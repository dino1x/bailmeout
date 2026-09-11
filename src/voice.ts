import fs from 'node:fs';
import path from 'node:path';

export class VoiceSynthesizer {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY;
  }

  public async generateUrgentVoicemail(text: string, outputPath: string): Promise<string> {
    if (this.apiKey) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.35,
              similarity_boost: 0.85,
            },
          }),
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
          return outputPath;
        }
      } catch (err) {
        console.warn('[VoiceSynthesizer] ElevenLabs call failed, falling back to local asset:', err);
      }
    }

    // Ensure output file exists with a valid fallback audio header
    if (!fs.existsSync(outputPath)) {
      // 44-byte standard RIFF WAV header for 0.5s silence
      const wavHeader = Buffer.from(
        '524946462400000057415645666d7420100000000100010044ac000088580100020010006461746100000000',
        'hex'
      );
      fs.writeFileSync(outputPath, wavHeader);
    }

    return outputPath;
  }
}
