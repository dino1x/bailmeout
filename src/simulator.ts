import readline from 'node:readline';
import { BailMeOutAgent } from './agent.ts';

const agent = new BailMeOutAgent('code red');
const SIMULATED_USER = '+14155559876';

console.log('---------------------------------------------------------');
console.log(' BailMeOut & AlibiOS: Covert Emergency Simulator');
console.log(' (Simulates multi-stage escalation in terminal)');
console.log('---------------------------------------------------------');
console.log('Target Device: ' + SIMULATED_USER);
console.log('\nTry typing:');
console.log('  1. "code red"         -> Apartment water emergency (leak)');
console.log('  2. "code red server"  -> Critical production database outage');
console.log('  3. "code red dog"     -> Family pet escape');
console.log('  4. "heart"            -> Simulates covert tapback trigger');
console.log('  5. "stand down"       -> Abort active escalation');
console.log('  6. "exit"             -> Quit');
console.log('---------------------------------------------------------\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You > ',
});

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (input.toLowerCase() === 'exit') {
    process.exit(0);
  }

  if (input.toLowerCase() === 'stand down') {
    const cancelled = agent.cancelEscape(SIMULATED_USER);
    console.log(`[BailMeOut]: Stand down received. Escalation aborted: ${cancelled}`);
    rl.prompt();
    return;
  }

  const reaction = input.toLowerCase() === 'heart' ? 'heart' : null;
  const { trigger, scenarioId } = agent.shouldTrigger(input, reaction);

  if (trigger) {
    console.log(`\n[Covert Trigger Detected! Activating Scenario: ${scenarioId}]`);
    console.log('Watch the blue bubble alerts arrive sequentially below:\n');

    agent.triggerEscape(SIMULATED_USER, scenarioId, async (payload) => {
      console.log('>>> [Incoming Blue Bubble Alert] >>>');
      console.log(payload.text);
      if (payload.attachmentPath) {
        console.log(`[Attached Evidence File]: ${payload.attachmentPath}`);
      }
      console.log('------------------------------------\n');
    });
  } else {
    console.log(`[Normal Message Ignored by BailMeOut: "${input}"]`);
  }

  rl.prompt();
});
