/**
 * 3AmShoppme Chatbot Lambda Proxy
 * 
 * Deploy this to AWS Lambda (Node.js 20.x runtime).
 * This function receives a message from the frontend via API Gateway,
 * sends it to your Amazon Lex V2 bot, and returns the response.
 *
 * Required Environment Variables (set in Lambda console):
 *   LEX_BOT_ID         - Your Lex V2 Bot ID (e.g. ABCDEF1234)
 *   LEX_BOT_ALIAS_ID   - Your Lex V2 Bot Alias ID (e.g. TSTALIASID or a prod alias)
 *   LEX_LOCALE_ID      - Locale (default: en_US)
 *   LEX_REGION         - AWS Region (default: us-east-1)
 */

import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

const lexClient = new LexRuntimeV2Client({
  region: process.env.LEX_REGION || "us-east-1",
});

// Map Lex intents to optional navigation actions
const INTENT_ACTIONS = {
  TrackOrders: { type: "NAVIGATE", payload: "/orders" },
  ViewCart:    { type: "NAVIGATE", payload: "/cart" },
  AllProducts: { type: "NAVIGATE", payload: "/all-products" },
};

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Restrict to your domain in production
    "Access-Control-Allow-Headers": "Content-Type,x-api-key",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message?.trim();

    if (!userMessage) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Message is required." }),
      };
    }

    // Use the user's IP or a session ID from the request if available
    const sessionId = body.sessionId || event.requestContext?.identity?.sourceIp || "anonymous-session";

    const lexCommand = new RecognizeTextCommand({
      botId: process.env.LEX_BOT_ID,
      botAliasId: process.env.LEX_BOT_ALIAS_ID,
      localeId: process.env.LEX_LOCALE_ID || "en_US",
      sessionId,
      text: userMessage,
    });

    const lexResponse = await lexClient.send(lexCommand);

    // Extract the bot's reply message
    const messages = lexResponse.messages || [];
    const replyText =
      messages.map((m) => m.content).join(" ") ||
      "I'm not sure how to help with that. Try asking about our products or return policy!";

    // Detect the intent name to optionally attach a navigation action
    const intentName = lexResponse.sessionState?.intent?.name;
    const action = INTENT_ACTIONS[intentName] || null;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: replyText,
        intent: intentName,
        ...(action && { action }),
      }),
    };
  } catch (err) {
    console.error("Lambda error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Sorry, I'm having trouble right now. Please try again shortly.",
      }),
    };
  }
};
