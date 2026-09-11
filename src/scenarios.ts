import type { EmergencyScenario } from './types.ts';
import path from 'node:path';

export function getScenarioPresets(assetsDir: string = './assets'): Record<string, EmergencyScenario> {
  return {
    apartment_flood: {
      id: 'apartment_flood',
      title: 'Building Emergency: Main Pipe Burst',
      description: 'Superintendent reports active leak pouring into unit below',
      stages: [
        {
          delayMs: 0,
          type: 'text',
          content: 'URGENT: This is building management. Water is pouring through the ceiling into apartment 2B right below yours. Are you home right now??',
        },
        {
          delayMs: 8000,
          type: 'voice_note',
          content: 'Incoming Voicemail (0:14): "Hey, it is Dave from maintenance. We have a major leak, water is backing up fast, we need entry immediately to shut off the main valve. Please call me back!"',
          attachmentPath: path.resolve(assetsDir, 'voicemail_landlord.m4a'),
        },
        {
          delayMs: 20000,
          type: 'photo_proof',
          content: 'Tenant downstairs just sent this photo. We are cutting water to the entire riser in 10 minutes if you cannot get here.',
          attachmentPath: path.resolve(assetsDir, 'proof_leak.svg'),
        },
      ],
    },
    production_outage: {
      id: 'production_outage',
      title: 'Work Emergency: P0 Database Lock',
      description: 'CTO / On-call escalation: payment processing down',
      stages: [
        {
          delayMs: 0,
          type: 'text',
          content: 'P0 OUTAGE: Stripe webhooks failing globally. All checkout flows returning 500s. We need your auth key right now.',
        },
        {
          delayMs: 8000,
          type: 'voice_note',
          content: 'Incoming Voicemail (0:11): "Hey, sorry to disturb you, the replica database desynced and locked all table writes. Can you hop on the incident bridge ASAP?"',
          attachmentPath: path.resolve(assetsDir, 'voicemail_cto.m4a'),
        },
        {
          delayMs: 20000,
          type: 'photo_proof',
          content: 'Grafana latency spike confirmed at 99.4% error rate. War room link: meet.google.com/emergency-bridge',
          attachmentPath: path.resolve(assetsDir, 'proof_outage.svg'),
        },
      ],
    },
    dog_escape: {
      id: 'dog_escape',
      title: 'Family Emergency: Pet Escape',
      description: 'Neighbor spotted pet running down the street',
      stages: [
        {
          delayMs: 0,
          type: 'text',
          content: 'Hey!! Your back gate blew open in the wind. Cooper is running down toward Oak Street, I am trying to catch him!',
        },
        {
          delayMs: 9000,
          type: 'photo_proof',
          content: 'He ran past Mrs. Gable\'s driveway! Please text me as soon as you see this.',
          attachmentPath: path.resolve(assetsDir, 'proof_gate.svg'),
        },
      ],
    },
  };
}
