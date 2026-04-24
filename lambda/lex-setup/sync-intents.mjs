#!/usr/bin/env node
/**
 * Sync intents from bot-definition.json to an existing Amazon Lex V2 bot.
 *
 * In CI this script is best-effort by default so a temporary AWS credential
 * problem does not fail the whole frontend deploy. Set LEX_SYNC_REQUIRED=true
 * to make sync failures blocking again.
 */

import {
  LexModelsV2Client,
  ListIntentsCommand,
  CreateIntentCommand,
  UpdateIntentCommand,
  BuildBotLocaleCommand,
  DescribeBotLocaleCommand,
} from "@aws-sdk/client-lex-models-v2";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BOT_ID = process.env.LEX_BOT_ID;
const LOCALE_ID = process.env.LEX_LOCALE_ID || "en_US";
const REGION = process.env.LEX_REGION || "us-east-1";
const SYNC_REQUIRED = process.env.LEX_SYNC_REQUIRED === "true";
const isCI = process.env.CI === "true";

function exitForSyncIssue(message, details = []) {
  const logger = SYNC_REQUIRED ? console.error : console.warn;
  const prefix = SYNC_REQUIRED ? "❌" : "⚠️";
  logger(`${prefix} ${message}`);
  for (const line of details) {
    logger(`   ${line}`);
  }
  process.exit(SYNC_REQUIRED ? 1 : 0);
}

if (!BOT_ID) {
  exitForSyncIssue("LEX_BOT_ID environment variable is required to sync Lex intents.", [
    "Set it in Netlify: Site settings -> Environment variables.",
    "Locally: $env:LEX_BOT_ID='BDMAAJAXB4'; node sync-intents.mjs",
    "Frontend build will continue without Lex sync.",
  ]);
}

if (isCI && (!process.env.LEX_AWS_KEY_ID || !process.env.LEX_AWS_SECRET)) {
  exitForSyncIssue("LEX_AWS_KEY_ID and LEX_AWS_SECRET are required in Netlify to sync Lex intents.", [
    "Netlify blocks AWS_ACCESS_KEY_ID - use these custom names instead.",
    "LEX_AWS_KEY_ID -> your AWS Access Key ID",
    "LEX_AWS_SECRET -> your AWS Secret Access Key",
    "Frontend build will continue without Lex sync.",
  ]);
}

const credentials =
  process.env.LEX_AWS_KEY_ID && process.env.LEX_AWS_SECRET
    ? {
        accessKeyId: process.env.LEX_AWS_KEY_ID,
        secretAccessKey: process.env.LEX_AWS_SECRET,
      }
    : undefined;

const lexClient = new LexModelsV2Client({
  region: REGION,
  ...(credentials && { credentials }),
});

const definition = JSON.parse(
  readFileSync(join(__dirname, "bot-definition.json"), "utf-8")
);
const desiredIntents = definition.intents || [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const log = (message) => console.log(`✅ ${message}`);
const info = (message) => console.log(`   ${message}`);

function isCredentialError(error) {
  const name = error?.name || "";
  const message = error?.message || "";
  return (
    name === "UnrecognizedClientException" ||
    name === "InvalidSignatureException" ||
    name === "ExpiredTokenException" ||
    /security token/i.test(message) ||
    /credential/i.test(message) ||
    /signature/i.test(message)
  );
}

async function getExistingIntents() {
  const existing = {};
  let nextToken;

  do {
    const { intentSummaries, nextToken: next } = await lexClient.send(
      new ListIntentsCommand({
        botId: BOT_ID,
        botVersion: "DRAFT",
        localeId: LOCALE_ID,
        maxResults: 100,
        ...(nextToken && { nextToken }),
      })
    );

    for (const intent of intentSummaries || []) {
      existing[intent.intentName] = intent.intentId;
    }

    nextToken = next;
  } while (nextToken);

  return existing;
}

function buildIntentPayload(intent, extras = {}) {
  const utterances = (intent.sampleUtterances || []).map((utterance) => ({
    utterance,
  }));

  const closingPayload = intent.closingResponse
    ? {
        intentClosingSetting: {
          closingResponse: {
            messageGroups: [
              {
                message: {
                  plainTextMessage: { value: intent.closingResponse },
                },
              },
            ],
          },
          active: true,
        },
      }
    : {};

  return {
    botId: BOT_ID,
    botVersion: "DRAFT",
    localeId: LOCALE_ID,
    intentName: intent.name,
    description: intent.description || "",
    sampleUtterances: utterances,
    ...closingPayload,
    ...extras,
  };
}

async function syncIntents(existingIntents) {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const intent of desiredIntents) {
    if (intent.name === "FallbackIntent") {
      skipped++;
      continue;
    }

    const existingId = existingIntents[intent.name];

    if (!existingId) {
      info(`Creating: ${intent.name}`);
      const { intentId } = await lexClient.send(
        new CreateIntentCommand(buildIntentPayload(intent))
      );
      log(`Created "${intent.name}" (ID: ${intentId})`);
      created++;
      continue;
    }

    info(`Updating: ${intent.name}`);
    await lexClient.send(
      new UpdateIntentCommand(buildIntentPayload(intent, { intentId: existingId }))
    );
    log(`Updated "${intent.name}"`);
    updated++;
  }

  return { created, updated, skipped };
}

async function buildLocale() {
  console.log("\n🔄 Building bot locale...");
  await lexClient.send(
    new BuildBotLocaleCommand({
      botId: BOT_ID,
      botVersion: "DRAFT",
      localeId: LOCALE_ID,
    })
  );

  let status = "Building";
  while (status === "Building" || status === "ReadyExpressTesting") {
    await sleep(4000);
    const { botLocaleStatus } = await lexClient.send(
      new DescribeBotLocaleCommand({
        botId: BOT_ID,
        botVersion: "DRAFT",
        localeId: LOCALE_ID,
      })
    );
    status = botLocaleStatus;
    info(`Build status: ${status}`);
  }

  if (status !== "Built") {
    throw new Error(`Bot locale build failed. Final status: ${status}`);
  }

  log("Bot locale built successfully");
}

async function main() {
  console.log("🤖 Syncing Lex V2 intents from bot-definition.json...");
  console.log(`   Bot ID : ${BOT_ID}`);
  console.log(`   Locale : ${LOCALE_ID}`);
  console.log(`   Region : ${REGION}`);
  console.log(`   Intents: ${desiredIntents.map((intent) => intent.name).join(", ")}\n`);

  try {
    const existingIntents = await getExistingIntents();
    info(`Found ${Object.keys(existingIntents).length} existing intents in Lex.`);

    const { created, updated, skipped } = await syncIntents(existingIntents);

    if (created + updated > 0) {
      await buildLocale();
    } else {
      log("No changes detected - bot is already up to date.");
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log("🎉 Intent sync complete!");
    console.log(`   Created : ${created}`);
    console.log(`   Updated : ${updated}`);
    console.log(`   Skipped : ${skipped} (built-in)`);
    console.log("=".repeat(50));
  } catch (error) {
    if (!SYNC_REQUIRED && isCredentialError(error)) {
      console.warn(`\n⚠️ Lex sync skipped: ${error.message}`);
      console.warn("   The frontend build can still complete.");
      console.warn("   Verify LEX_AWS_KEY_ID / LEX_AWS_SECRET in Netlify if Lex sync should run.");
      process.exit(0);
    }

    console.error("\n❌ Sync failed:", error.message);
    process.exit(1);
  }
}

main();
