import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { Agent, setGlobalDispatcher, FormData } from 'undici';
import dotenv from 'dotenv';

dotenv.config();

// Configure DNS and Undici for Windows network resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);
const undiciAgent = new Agent({
  connect: {
    lookup: (hostname, options, callback) => {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || !addresses.length) {
          return callback(err || new Error('No address found'), null, 4);
        }
        if (options && options.all) {
          return callback(null, addresses.map(a => ({ address: a, family: 4 })));
        }
        return callback(null, addresses[0], 4);
      });
    },
  },
});
setGlobalDispatcher(undiciAgent);

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY is not set in .env');
  process.exit(1);
}

// Script narration optimized for the 60-second X video demo
export const DEMO_NARRATION_SCRIPT = `Ever been trapped in an agonizing conversation or a two-hour meeting that refused to end?

This is BailMeOut. You do not open an app. You just react to an existing iMessage under the table.

Instantly, Stage One fires an urgent alert. Stage Two: an authentic synthetic voice memo from ElevenLabs lands right in the chat.

When they ask to see your screen, BailMeOut gives you an official dispatch report with timestamps, plus a one-tap Uber link to get out immediately.

And if you need the ultimate exit cue, it calls your actual phone via Twilio Voice. You apologize, look shocked, and leave with total social immunity.

Built natively on Photon Spectrum. Code is open source. Never get stuck again.`;

export async function cloneVoice(samplePath: string, voiceName: string = 'User Clone'): Promise<string> {
  console.log(`[Clone] Reading sample audio from ${samplePath}...`);
  const buffer = fs.readFileSync(samplePath);
  const form = new FormData();
  form.append('name', voiceName);
  form.append('files', new Blob([buffer], { type: 'audio/mp4' }), path.basename(samplePath));

  console.log('[Clone] Uploading sample to ElevenLabs /v1/voices/add...');
  const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY! },
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Voice cloning failed (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as { voice_id: string };
  console.log(`[Clone] Voice clone created successfully! Voice ID: ${data.voice_id}`);
  return data.voice_id;
}

export async function generateMasterVoiceover(
  voiceId: string = 'TX3LPaxmHKxFdv7VOQHJ', // Liam (Energetic Social Media Creator) as default premade
  outputPath: string = 'assets/master_voiceover.mp3'
): Promise<string> {
  console.log(`[TTS] Synthesizing master demo voiceover using voice ID ${voiceId}...`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY!,
    },
    body: JSON.stringify({
      text: DEMO_NARRATION_SCRIPT,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.85,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Text-to-speech failed (${res.status}): ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
  console.log(`[TTS] Master audio saved to ${outputPath} (${arrayBuffer.byteLength} bytes)`);
  return outputPath;
}
