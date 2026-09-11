import type { EmergencyScenario, EscalationSession } from './types.ts';
import { getScenarioPresets } from './scenarios.ts';

export class EscalationCoordinator {
  private activeSessions: Map<string, EscalationSession> = new Map();
  private scenarios: Record<string, EmergencyScenario>;

  constructor(assetsDir: string = './assets') {
    this.scenarios = getScenarioPresets(assetsDir);
  }

  public getAvailableScenarios(): string[] {
    return Object.keys(this.scenarios);
  }

  public startEscalation(
    targetPhone: string,
    scenarioId: string = 'apartment_flood',
    onDispatch: (stage: { type: string; content: string; attachmentPath?: string }) => Promise<void>
  ): EscalationSession {
    const scenario = this.scenarios[scenarioId] || this.scenarios['apartment_flood'];
    const session: EscalationSession = {
      sessionId: 'esc_' + Date.now(),
      targetPhone,
      scenario,
      startedAt: Date.now(),
      currentStageIndex: 0,
      status: 'active',
    };

    this.activeSessions.set(targetPhone, session);

    // Schedule each stage
    for (let i = 0; i < scenario.stages.length; i++) {
      const stage = scenario.stages[i];
      setTimeout(async () => {
        const current = this.activeSessions.get(targetPhone);
        if (current && current.status === 'active') {
          current.currentStageIndex = i;
          await onDispatch({
            type: stage.type,
            content: stage.content,
            attachmentPath: stage.attachmentPath,
          });
          if (i === scenario.stages.length - 1) {
            current.status = 'completed';
          }
        }
      }, stage.delayMs);
    }

    return session;
  }

  public cancelEscalation(targetPhone: string): boolean {
    const session = this.activeSessions.get(targetPhone);
    if (session && session.status === 'active') {
      session.status = 'cancelled';
      return true;
    }
    return false;
  }
}
