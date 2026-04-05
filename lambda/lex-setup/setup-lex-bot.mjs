#!/usr/bin/env node
/**
 * 3AmShoppme - Amazon Lex V2 Bot Setup Script
 * 
 * Reads bot-definition.json and creates the full Lex V2 bot via AWS SDK.
 * 
 * Prerequisites:
 *   1. AWS CLI installed and configured: `aws configure`
 *   2. Node.js installed
 *   3. Run: npm install @aws-sdk/client-lex-models-v2
 * 
 * Usage:
 *   node setup-lex-bot.mjs
 * 
 * Outputs:
 *   BOT_ID, BOT_ALIAS_ID — paste these into your Lambda env vars
 */

import {
  LexModelsV2Client,
  CreateBotCommand,
  CreateBotLocaleCommand,
  CreateIntentCommand,
  UpdateIntentCommand,
  BuildBotLocaleCommand,
  CreateBotAliasCommand,
  DescribeBotLocaleCommand,
  DescribeBotCommand,
  ListBotsCommand,
  ListBotAliasesCommand,
} from "@aws-sdk/client-lex-models-v2";
import { IAMClient, CreateRoleCommand, AttachRolePolicyCommand, GetRoleCommand } from "@aws-sdk/client-iam";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ─────────────────────────────────────────────────────────────────
const REGION = "us-east-1"; // Change if you prefer a different region
const BOT_DEFINITION_PATH = join(__dirname, "bot-definition.json");

const lexClient = new LexModelsV2Client({ region: REGION });
const iamClient = new IAMClient({ region: REGION });

const definition = JSON.parse(readFileSync(BOT_DEFINITION_PATH, "utf-8"));
const { bot, locale, intents } = definition;

// ── Helpers ────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const log = (msg) => console.log(`\n✅ ${msg}`);
const warn = (msg) => console.warn(`⚠️  ${msg}`);
const step = (msg) => console.log(`\n🔄 ${msg}...`);

// ── Step 1: Ensure IAM Role for Lex ───────────────────────────────────────
async function ensureLexRole() {
  const roleName = "AmazonLexV2Role-3AmShoppme";
  step(`Checking IAM role "${roleName}"`);

  try {
    const { Role } = await iamClient.send(new GetRoleCommand({ RoleName: roleName }));
    log(`IAM role already exists: ${Role.Arn}`);
    return Role.Arn;
  } catch (e) {
    if (e.name !== "NoSuchEntityException") throw e;
  }

  const trustPolicy = {
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Principal: { Service: "lexv2.amazonaws.com" },
      Action: "sts:AssumeRole",
    }],
  };

  const { Role } = await iamClient.send(new CreateRoleCommand({
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
    Description: "IAM role for Amazon Lex V2 - 3AmShoppme chatbot",
  }));

  await iamClient.send(new AttachRolePolicyCommand({
    RoleName: roleName,
    PolicyArn: "arn:aws:iam::aws:policy/AmazonLexFullAccess",
  }));

  log(`Created IAM role: ${Role.Arn}`);
  await sleep(10000); // Wait for IAM propagation
  return Role.Arn;
}

// ── Step 2: Create the Bot ─────────────────────────────────────────────────
async function createBot(roleArn) {
  step(`Creating Lex V2 bot "${bot.name}"`);
  try {
    const { botId } = await lexClient.send(new CreateBotCommand({
      botName: bot.name,
      description: bot.description,
      roleArn,
      dataPrivacy: bot.dataPrivacy,
      idleSessionTTLInSeconds: bot.idleSessionTTLInSeconds,
    }));
    log(`Bot created — ID: ${botId}`);
    return botId;
  } catch (e) {
    if (e.name === "ConflictException") {
      warn(`Bot "${bot.name}" already exists — looking up its ID...`);
      // List bots and find by name
      const { botSummaries } = await lexClient.send(new ListBotsCommand({ maxResults: 100 }));
      const existing = botSummaries?.find((b) => b.botName === bot.name);
      if (!existing) throw new Error(`Could not find existing bot "${bot.name}" in your account.`);
      log(`Found existing bot — ID: ${existing.botId}`);
      return existing.botId;
    }
    throw e;
  }
}

// ── Wait for bot to reach Available state ─────────────────────────────────
async function waitForBot(botId) {
  step("Waiting for bot to become Available");
  let status = "Creating";
  while (status === "Creating") {
    await sleep(3000);
    const { botStatus } = await lexClient.send(new DescribeBotCommand({ botId }));
    status = botStatus;
    console.log(`  Bot status: ${status}`);
  }
  if (status !== "Available") {
    throw new Error(`Bot did not become Available. Final status: ${status}`);
  }
  log("Bot is Available");
}

// ── Step 3: Create Bot Locale ──────────────────────────────────────────────
async function createLocale(botId) {
  step(`Creating bot locale "${locale.localeId}"`);
  try {
    await lexClient.send(new CreateBotLocaleCommand({
      botId,
      botVersion: "DRAFT",
      localeId: locale.localeId,
      description: locale.description,
      nluIntentConfidenceThreshold: locale.nluIntentConfidenceThreshold,
    }));
    log(`Locale "${locale.localeId}" created`);
  } catch (e) {
    if (e.name === "ConflictException") {
      warn(`Locale "${locale.localeId}" already exists — skipping creation, will reuse.`);
    } else {
      throw e;
    }
  }

  // Wait for locale to be ready (not in Creating state)
  step(`Waiting for locale "${locale.localeId}" to be ready`);
  let localeStatus = "Creating";
  while (localeStatus === "Creating") {
    await sleep(3000);
    const { botLocaleStatus } = await lexClient.send(new DescribeBotLocaleCommand({
      botId,
      botVersion: "DRAFT",
      localeId: locale.localeId,
    }));
    localeStatus = botLocaleStatus;
    console.log(`  Locale status: ${localeStatus}`);
  }
  log(`Locale is ready (${localeStatus})`);
}

// ── Step 4: Create Intents ─────────────────────────────────────────────────
async function createIntents(botId) {
  step("Creating intents from bot-definition.json");

  for (const intent of intents) {
    // FallbackIntent is built-in and auto-created by Lex V2 — skip it
    if (intent.name === "FallbackIntent") {
      warn(`Skipping "FallbackIntent" — it is auto-created by Lex V2 and cannot be manually created.`);
      continue;
    }

    console.log(`  → Creating intent: ${intent.name}`);

    const utterances = intent.sampleUtterances.map((u) => ({ utterance: u }));

    let intentId;
    try {
      const result = await lexClient.send(new CreateIntentCommand({
        botId,
        botVersion: "DRAFT",
        localeId: locale.localeId,
        intentName: intent.name,
        description: intent.description,
        sampleUtterances: utterances,
      }));
      intentId = result.intentId;
    } catch (e) {
      if (e.name === "ConflictException") {
        warn(`Intent "${intent.name}" already exists — skipping.`);
        continue;
      }
      throw e;
    }

    // Set the closing response via UpdateIntent
    if (intent.closingResponse) {
      await lexClient.send(new UpdateIntentCommand({
        botId,
        botVersion: "DRAFT",
        localeId: locale.localeId,
        intentId,
        intentName: intent.name,
        description: intent.description,
        sampleUtterances: utterances,
        intentClosingSetting: {
          closingResponse: {
            messageGroups: [{
              message: {
                plainTextMessage: { value: intent.closingResponse },
              },
            }],
          },
          active: true,
        },
      }));
    }

    log(`Intent "${intent.name}" created (ID: ${intentId})`);
  }
}

// ── Step 5: Build the Bot Locale ───────────────────────────────────────────
async function buildLocale(botId) {
  step("Building bot locale (this takes 30–60 seconds)");
  await lexClient.send(new BuildBotLocaleCommand({
    botId,
    botVersion: "DRAFT",
    localeId: locale.localeId,
  }));

  // Poll until build is complete
  let status = "Building";
  while (status === "Building" || status === "ReadyExpressTesting") {
    await sleep(5000);
    const { botLocaleStatus } = await lexClient.send(new DescribeBotLocaleCommand({
      botId,
      botVersion: "DRAFT",
      localeId: locale.localeId,
    }));
    status = botLocaleStatus;
    console.log(`  Build status: ${status}`);
  }

  if (status !== "Built") {
    throw new Error(`Build failed with status: ${status}`);
  }

  log("Bot locale built successfully");
}

// ── Step 6: Create Production Alias ───────────────────────────────────────
async function createAlias(botId) {
  step("Creating bot alias 'prod'");
  try {
    // Note: Do NOT set botVersion when creating a DRAFT alias in Lex V2
    const { botAliasId } = await lexClient.send(new CreateBotAliasCommand({
      botAliasName: "prod",
      botId,
      description: "Production alias for 3AmShoppme chatbot",
    }));
    log(`Alias 'prod' created — ID: ${botAliasId}`);
    return botAliasId;
  } catch (e) {
    if (e.name === "ConflictException") {
      warn("Alias 'prod' already exists — looking up alias ID...");
      const { botAliasSummaries } = await lexClient.send(new ListBotAliasesCommand({ botId, maxResults: 100 }));
      const existing = botAliasSummaries?.find((a) => a.botAliasName === "prod");
      if (!existing) throw new Error("Could not find existing 'prod' alias.");
      log(`Found existing alias 'prod' — ID: ${existing.botAliasId}`);
      return existing.botAliasId;
    }
    throw e;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 3AmShoppme — Amazon Lex V2 Bot Setup");
  console.log(`   Region: ${REGION}`);
  console.log(`   Bot: ${bot.name}`);
  console.log(`   Intents: ${intents.map((i) => i.name).join(", ")}\n`);

  try {
    const roleArn = await ensureLexRole();
    const botId = await createBot(roleArn);
    await waitForBot(botId);       // ← wait for AWS to finish provisioning
    await createLocale(botId);
    await createIntents(botId);
    await buildLocale(botId);
    const botAliasId = await createAlias(botId);

    console.log("\n" + "=".repeat(60));
    console.log("🎉 BOT SETUP COMPLETE!");
    console.log("=".repeat(60));
    console.log("\nAdd these to your Lambda environment variables:");
    console.log(`  LEX_BOT_ID       = ${botId}`);
    console.log(`  LEX_BOT_ALIAS_ID = ${botAliasId}`);
    console.log(`  LEX_LOCALE_ID    = ${locale.localeId}`);
    console.log(`  LEX_REGION       = ${REGION}`);
    console.log("\n" + "=".repeat(60));
  } catch (err) {
    console.error("\n❌ Setup failed:", err.message);
    process.exit(1);
  }
}

main();
