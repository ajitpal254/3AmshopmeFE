#!/usr/bin/env node
/**
 * sync-intents.mjs
 *
 * Syncs intents from bot-definition.json to an EXISTING Amazon Lex V2 bot.
 * Designed to run as part of a Netlify build — NOT a first-time setup script.
 * 
 * For first-time setup, run setup-lex-bot.mjs instead.
 *
 * Required Netlify Environment Variables:
 *   LEX_BOT_ID          - Your Lex V2 Bot ID (e.g. BDMAAJAXB4)
 *   AWS_ACCESS_KEY_ID   - AWS IAM access key
 *   AWS_SECRET_ACCESS_KEY - AWS IAM secret key
 *
 * Optional:
 *   LEX_LOCALE_ID       - Default: en_US
 *   LEX_REGION          - Default: us-east-1
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

// ── Config from env vars ───────────────────────────────────────────────────
const BOT_ID     = process.env.LEX_BOT_ID;
const LOCALE_ID  = process.env.LEX_LOCALE_ID  || "en_US";
const REGION     = process.env.LEX_REGION      || "us-east-1";

if (!BOT_ID) {
  console.error("❌ LEX_BOT_ID environment variable is required.");
  console.error("   Set it in Netlify: Site settings → Environment variables.");
  console.error("   Locally: $env:LEX_BOT_ID='BDMAAJAXB4'; node sync-intents.mjs");
  process.exit(1);
}

// In CI (Netlify), explicit creds are required. Locally, ~/.aws/credentials is used.
const isCI = process.env.CI === "true";
if (isCI && (!process.env.LEX_AWS_KEY_ID || !process.env.LEX_AWS_SECRET)) {
  console.error("❌ LEX_AWS_KEY_ID and LEX_AWS_SECRET are required in Netlify.");
  console.error("   Netlify blocks AWS_ACCESS_KEY_ID — use these custom names instead:");
  console.error("   LEX_AWS_KEY_ID     → your AWS Access Key ID");
  console.error("   LEX_AWS_SECRET     → your AWS Secret Access Key");
  process.exit(1);
}

// Build credentials — use custom names in CI, fall back to default chain locally
const credentials = (process.env.LEX_AWS_KEY_ID && process.env.LEX_AWS_SECRET)
  ? { accessKeyId: process.env.LEX_AWS_KEY_ID, secretAccessKey: process.env.LEX_AWS_SECRET }
  : undefined; // SDK will use ~/.aws/credentials locally

const lexClient = new LexModelsV2Client({
  region: REGION,
  ...(credentials && { credentials }),
});
const definition = JSON.parse(
  readFileSync(join(__dirname, "bot-definition.json"), "utf-8")
);
const { locale, intents: desiredIntents } = definition;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log   = (m) => console.log(`✅ ${m}`);
const warn  = (m) => console.warn(`⚠️  ${m}`);
const info  = (m) => console.log(`   ${m}`);

// ── Fetch all existing intents from Lex ────────────────────────────────────
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

// ── Build an intent payload ────────────────────────────────────────────────
function buildIntentPayload(intent, extras = {}) {
  const utterances = (intent.sampleUtterances || []).map((u) => ({ utterance: u }));
  const closingPayload = intent.closingResponse
    ? {
        intentClosingSetting: {
          closingResponse: {
            messageGroups: [{
              message: { plainTextMessage: { value: intent.closingResponse } },
            }],
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

// ── Sync intents: create new, update changed ───────────────────────────────
async function syncIntents(existingIntents) {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const intent of desiredIntents) {
    // FallbackIntent is auto-managed by Lex V2 — skip
    if (intent.name === "FallbackIntent") {
      skipped++;
      continue;
    }

    const existingId = existingIntents[intent.name];

    if (!existingId) {
      // ── CREATE ──
      info(`Creating: ${intent.name}`);
      const { intentId } = await lexClient.send(
        new CreateIntentCommand(buildIntentPayload(intent))
      );
      log(`Created "${intent.name}" (ID: ${intentId})`);
      created++;
    } else {
      // ── UPDATE ──
      info(`Updating: ${intent.name}`);
      await lexClient.send(
        new UpdateIntentCommand(buildIntentPayload(intent, { intentId: existingId }))
      );
      log(`Updated "${intent.name}"`);
      updated++;
    }
  }

  return { created, updated, skipped };
}

// ── Rebuild bot locale ─────────────────────────────────────────────────────
async function buildLocale() {
  console.log("\n🔄 Building bot locale...");
  await lexClient.send(new BuildBotLocaleCommand({
    botId: BOT_ID,
    botVersion: "DRAFT",
    localeId: LOCALE_ID,
  }));

  let status = "Building";
  while (status === "Building" || status === "ReadyExpressTesting") {
    await sleep(4000);
    const { botLocaleStatus } = await lexClient.send(
      new DescribeBotLocaleCommand({ botId: BOT_ID, botVersion: "DRAFT", localeId: LOCALE_ID })
    );
    status = botLocaleStatus;
    info(`Build status: ${status}`);
  }

  if (status !== "Built") {
    throw new Error(`Bot locale build failed. Final status: ${status}`);
  }
  log("Bot locale built successfully");
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("🤖 Syncing Lex V2 intents from bot-definition.json...");
  console.log(`   Bot ID : ${BOT_ID}`);
  console.log(`   Locale : ${LOCALE_ID}`);
  console.log(`   Region : ${REGION}`);
  console.log(`   Intents: ${desiredIntents.map((i) => i.name).join(", ")}\n`);

  try {
    const existingIntents = await getExistingIntents();
    info(`Found ${Object.keys(existingIntents).length} existing intents in Lex.`);

    const { created, updated, skipped } = await syncIntents(existingIntents);

    if (created + updated === 0) {
      log("No changes detected — bot is already up to date.");
    } else {
      await buildLocale();
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Intent sync complete!");
    console.log(`   Created : ${created}`);
    console.log(`   Updated : ${updated}`);
    console.log(`   Skipped : ${skipped} (built-in)`);
    console.log("=".repeat(50));
  } catch (err) {
    console.error("\n❌ Sync failed:", err.message);
    process.exit(1);
  }
}

main();
