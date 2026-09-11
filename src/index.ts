import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
process.env.OTEL_SDK_DISABLED = "true";

import { Spectrum, attachment, voice } from "spectrum-ts";
import { imessage } from "@spectrum-ts/imessage";
import { BailMeOutAgent } from "./agent.ts";
import { PhoneCaller } from "./call.ts";
import fs from "node:fs";

// Catch all background rejection errors to prevent node process from crashing
process.on("unhandledRejection", (reason) => {
  console.warn("[BailMeOut] Network blip intercepted (process preserved):", (reason as any)?.message || reason);
});

process.on("uncaughtException", (err) => {
  console.warn("[BailMeOut] Uncaught exception intercepted (process preserved):", err?.message || err);
});

const projectId =
  process.env.SPECTRUM_PROJECT_ID ||
  process.env.PROJECT_ID ||
  process.env.PHOTON_PROJECT_ID;
const projectSecret =
  process.env.SPECTRUM_PROJECT_SECRET ||
  process.env.PROJECT_SECRET ||
  process.env.PHOTON_PROJECT_SECRET;
const safeWord = process.env.SAFE_WORD || "code red";

if (!projectId || !projectSecret) {
  console.error("[BailMeOut] Missing PROJECT_ID or PROJECT_SECRET in environment.");
  process.exit(1);
}

console.log("[BailMeOut] Starting BailMeOut Emergency Alibi Agent...");
console.log(`[BailMeOut] Project ID: ${projectId}`);
console.log(`[BailMeOut] Safe word: "${safeWord}"`);

const agent = new BailMeOutAgent(safeWord);
const caller = new PhoneCaller();
const activeCallTimeouts = new Map<string, NodeJS.Timeout>();

if (caller.isConfigured()) {
  console.log(`[BailMeOut] Twilio Voice Calls ENABLED from ${process.env.TWILIO_PHONE_NUMBER}!`);
}

async function run() {
  while (true) {
    try {
      console.log("[BailMeOut] Connecting to Photon Spectrum Cloud gateway...");
      const app = await Spectrum({
        projectId,
        projectSecret,
        providers: [imessage.config()],
      });

      console.log("[BailMeOut] Connected to Photon Spectrum Cloud gateway!");
      console.log("[BailMeOut] Listening for incoming messages, safe words, and tapbacks...");

      for await (const [space, message] of app.messages) {
        try {
          const sender =
            (message as any).from ||
            (message as any).sender?.id ||
            space.id ||
            "ProtectedUser";

          let messageText = "";
          let reaction = null;

          if (message.content) {
            if (message.content.type === "text") {
              messageText = message.content.text;
            } else if (message.content.type === "reaction") {
              reaction =
                (message.content as any).emoji ||
                (message.content as any).reaction ||
                (message.content as any).kind;
            }
          }
          if (!messageText && (message as any).text) {
            messageText = (message as any).text;
          }
          if (!reaction && (message as any).reaction) {
            reaction = (message as any).reaction;
          }
          if (!reaction && (message as any).raw?.reaction) {
            reaction = (message as any).raw.reaction;
          }
          if (!reaction && (message as any).reactionRecord) {
            const rec = (message as any).reactionRecord;
            reaction = rec.reaction?.kind || rec.reaction?.emoji;
          }

          if (typeof reaction === "object" && reaction !== null) {
            reaction =
              (reaction as any).emoji ||
              (reaction as any).kind ||
              JSON.stringify(reaction);
          }
          if (typeof reaction === "string") {
            reaction = reaction.toLowerCase();
          }

          console.log(
            `[BailMeOut] Inbound from ${sender} | text: "${messageText}" | reaction: "${reaction}"`
          );

          const trimmed = messageText.trim().toLowerCase();

          // 1. Stand Down Protocol
          if (trimmed === "stand down" || trimmed === "safe" || trimmed === "cancel") {
            agent.cancelEscape(sender);
            const pendingCall = activeCallTimeouts.get(sender);
            if (pendingCall) {
              clearTimeout(pendingCall);
              activeCallTimeouts.delete(sender);
            }
            await space.send("Alibi escalation cancelled. You are safe.");
            continue;
          }

          // 2. Immediate Direct Phone Call Trigger
          if (trimmed === "call me" || trimmed === "ring me" || trimmed === "call now") {
            const phoneMatch = sender.match(/\+?\d{10,15}/);
            const targetPhone = phoneMatch
              ? phoneMatch[0].startsWith("+")
                ? phoneMatch[0]
                : "+" + phoneMatch[0]
              : process.env.TARGET_PHONE_NUMBER;

            if (targetPhone && caller.isConfigured()) {
              await space.send("Emergency call inbound right now...");
              await caller.placeEmergencyCall(targetPhone, "apartment_flood");
            } else {
              await space.send("Phone caller not configured or phone number unrecognized.");
            }
            continue;
          }

          // 3. Dead-Man's Switch (Scheduled Check-In)
          const timerMatch = trimmed.match(
            /(?:check on me|bail) in (\d+)\s*(s|sec|m|min|h|hr)?/
          );
          if (timerMatch) {
            const amount = parseInt(timerMatch[1], 10);
            const unit = (timerMatch[2] || "m").toLowerCase();
            let ms = amount * 60 * 1000;
            if (unit.startsWith("s")) ms = amount * 1000;
            if (unit.startsWith("h")) ms = amount * 60 * 60 * 1000;

            await space.send(
              `Dead-Man's Switch armed. Checking in with an innocent text in ${amount}${unit}.\n\n- Tapback Thumbs Up if date is good.\n- Tapback Heart if you need an emergency bail.`
            );

            setTimeout(async () => {
              try {
                await space.send(
                  "Hey, quick question about tomorrow. Let me know when you are free!"
                );
              } catch (e) {}
            }, ms);
            continue;
          }

          // 4. Emergency Escalation Sequence
          const { trigger, scenarioId } = agent.shouldTrigger(messageText, reaction);
          if (trigger) {
            console.log(
              `[BailMeOut] Trigger detected from ${sender}! Initiating scenario: ${scenarioId}`
            );

            // Schedule live phone call at T+25s
            if (caller.isConfigured()) {
              const phoneMatch = sender.match(/\+?\d{10,15}/);
              const targetPhone = phoneMatch
                ? phoneMatch[0].startsWith("+")
                  ? phoneMatch[0]
                  : "+" + phoneMatch[0]
                : process.env.TARGET_PHONE_NUMBER;

              if (targetPhone) {
                const callTimeout = setTimeout(async () => {
                  console.log(
                    `[BailMeOut] T+25s reached! Placing live phone call to ${targetPhone}...`
                  );
                  await caller.placeEmergencyCall(targetPhone, scenarioId);
                }, 25000);
                activeCallTimeouts.set(sender, callTimeout);
              }
            }

            agent.triggerEscape(sender, scenarioId, async (payload) => {
              try {
                if (payload.text) {
                  console.log(`[BailMeOut] Sending text: "${payload.text}"`);
                  await space.send(payload.text);
                }
                if (payload.attachmentPath && fs.existsSync(payload.attachmentPath)) {
                  const isAudio =
                    payload.attachmentPath.endsWith(".m4a") ||
                    payload.attachmentPath.endsWith(".wav") ||
                    payload.attachmentPath.endsWith(".mp3");
                  if (isAudio) {
                    console.log(`[BailMeOut] Sending voice audio memo: ${payload.attachmentPath}`);
                    try {
                      await space.send(voice(payload.attachmentPath));
                    } catch (voiceErr) {
                      console.warn(
                        `[BailMeOut] voice() send failed, falling back to attachment():`,
                        voiceErr
                      );
                      await space.send(attachment(payload.attachmentPath));
                    }
                  } else {
                    console.log(`[BailMeOut] Sending visual attachment: ${payload.attachmentPath}`);
                    await space.send(attachment(payload.attachmentPath));
                    await space.send(
                      "Emergency ride pre-set: https://m.uber.com/ul/?action=setPickup&pickup=my_location"
                    );
                  }
                } else if (payload.attachmentPath) {
                  console.warn(
                    `[BailMeOut] Warning: Attachment path not found on disk: ${payload.attachmentPath}`
                  );
                }
              } catch (sendErr) {
                console.warn("[BailMeOut] Message send error caught (continuing):", sendErr);
              }
            });
          }
        } catch (msgErr) {
          console.warn("[BailMeOut] Error processing message (continuing):", msgErr);
        }
      }
    } catch (err: any) {
      console.error("[BailMeOut] Gateway connection drop, auto-reconnecting in 3s...", err?.message || err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

run();
