import { EscalationCoordinator } from './escalation.ts';

export class BailMeOutAgent {
  private coordinator: EscalationCoordinator;
  private safeWord: string;

  constructor(safeWord: string = 'code red') {
    this.coordinator = new EscalationCoordinator();
    this.safeWord = safeWord.toLowerCase();
  }

  public shouldTrigger(text: string, reaction?: string | null): { trigger: boolean; scenarioId: string } {
    const lower = text.toLowerCase().trim();

    // Trigger via tapback heart/love/like on any recent message
    if (
      reaction &&
      (reaction === 'heart' ||
        reaction === 'love' ||
        reaction === '❤️' ||
        reaction === '💖' ||
        reaction.includes('love') ||
        reaction.includes('heart') ||
        reaction === 'like' ||
        reaction === '👍')
    ) {
      return { trigger: true, scenarioId: 'apartment_flood' };
    }

    // Trigger via text tapback fallback (e.g. 'Loved "..."' or 'Liked "..."')
    if (
      lower.startsWith('loved ') ||
      lower.startsWith('liked ') ||
      lower.includes('loved “') ||
      lower.includes('liked “') ||
      lower.includes('loved "') ||
      lower.includes('liked "')
    ) {
      return { trigger: true, scenarioId: 'apartment_flood' };
    }

    // Trigger via safe words
    if (lower.includes(this.safeWord) || lower === 'mayday' || lower === 'bail') {
      if (lower.includes('work') || lower.includes('server')) {
        return { trigger: true, scenarioId: 'production_outage' };
      }
      if (lower.includes('dog') || lower.includes('pet')) {
        return { trigger: true, scenarioId: 'dog_escape' };
      }
      return { trigger: true, scenarioId: 'apartment_flood' };
    }

    return { trigger: false, scenarioId: '' };
  }

  public triggerEscape(
    senderPhone: string,
    scenarioId: string,
    onStageDispatch: (payload: { text: string; attachmentPath?: string }) => Promise<void>
  ) {
    return this.coordinator.startEscalation(senderPhone, scenarioId, async (stage) => {
      await onStageDispatch({
        text: stage.content,
        attachmentPath: stage.attachmentPath,
      });
    });
  }

  public cancelEscape(senderPhone: string): boolean {
    return this.coordinator.cancelEscalation(senderPhone);
  }
}
