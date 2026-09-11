export type ScenarioType = 'apartment_flood' | 'production_outage' | 'dog_escape' | 'medical_emergency';

export interface EmergencyStage {
  delayMs: number;
  type: 'text' | 'voice_note' | 'photo_proof' | 'phone_call';
  content: string;
  attachmentPath?: string;
}

export interface EmergencyScenario {
  id: ScenarioType;
  title: string;
  description: string;
  stages: EmergencyStage[];
}

export interface EscalationSession {
  sessionId: string;
  targetPhone: string;
  scenario: EmergencyScenario;
  startedAt: number;
  currentStageIndex: number;
  status: 'active' | 'completed' | 'cancelled';
}
