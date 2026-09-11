import dns from 'node:dns';
import { Agent, setGlobalDispatcher } from 'undici';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const agent = new Agent({
  connect: {
    lookup: (hostname, options, callback) => {
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          callback(err || new Error('No address found'), null, 4);
          return;
        }
        if (typeof options === 'object' && options?.all) {
          callback(null, addresses.map(a => ({ address: a, family: 4 })));
        } else {
          callback(null, addresses[0], 4);
        }
      });
    },
  },
});
setGlobalDispatcher(agent);

export class PhoneCaller {
  private accountSid?: string;
  private authToken?: string;
  private fromNumber?: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  public isConfigured(): boolean {
    return Boolean(this.accountSid && this.authToken && this.fromNumber);
  }

  public async placeEmergencyCall(
    toNumber: string,
    scenarioId: string = 'apartment_flood'
  ): Promise<{ success: boolean; callSid?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Twilio credentials not configured' };
    }

    let spokenMessage =
      'Emergency alert! This is Dave from building maintenance. Water is pouring through the ceiling into apartment 2B right below yours. We need you to return to your building immediately to cut the main valve!';
    let voice = 'Polly.Matthew';

    if (scenarioId === 'production_outage') {
      spokenMessage =
        'P0 incident alert! Stripe webhooks are failing globally. All checkout flows are returning 500 errors. Join the incident war room bridge immediately!';
      voice = 'Polly.Joey';
    } else if (scenarioId === 'dog_escape') {
      spokenMessage =
        'Urgent family alert! Your back gate blew open in the wind and your dog was spotted running down the street. Please call me back right away!';
      voice = 'Polly.Joanna';
    }

    const twimletUrl = `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(spokenMessage)}`;

    try {
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', toNumber);
      params.append('From', this.fromNumber!);
      params.append('Url', twimletUrl);

      console.log(`[PhoneCaller] Placing emergency phone call to ${toNumber} from ${this.fromNumber}...`);
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        console.log(`[PhoneCaller] Call dispatched successfully! Call SID: ${data.sid}`);
        return { success: true, callSid: data.sid };
      } else {
        const errText = await res.text();
        console.error(`[PhoneCaller] Twilio call request failed: ${res.status}`, errText);
        return { success: false, error: errText };
      }
    } catch (err: any) {
      console.error(`[PhoneCaller] Error making Twilio call:`, err);
      return { success: false, error: err.message };
    }
  }
}
