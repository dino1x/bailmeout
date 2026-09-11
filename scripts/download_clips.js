const dns = require('node:dns');
const fs = require('node:fs');
const path = require('node:path');
const { Agent, setGlobalDispatcher } = require('undici');

dns.setServers(['8.8.8.8', '1.1.1.1']);
const agent = new Agent({
  connect: {
    lookup: (hostname, options, callback) => {
      if (typeof options === 'function') { callback = options; options = {}; }
      dns.resolve4(hostname, (err, addresses) => {
        if (err || !addresses || !addresses.length) return callback(err || new Error('No address found'), null, 4);
        if (options && options.all) return callback(null, addresses.map(a => ({ address: a, family: 4 })));
        return callback(null, addresses[0], 4);
      });
    }
  }
});
setGlobalDispatcher(agent);

const CLIPS = [
  {
    name: '01_bored_meeting.mp4',
    url: 'https://assets.mixkit.co/videos/4607/4607-720.mp4'
  },
  {
    name: '02_hands_texting.mp4',
    url: 'https://assets.mixkit.co/videos/144/144-720.mp4'
  },
  {
    name: '03_message_receive.mp4',
    url: 'https://assets.mixkit.co/videos/41165/41165-720.mp4'
  },
  {
    name: '04_worried_call.mp4',
    url: 'https://assets.mixkit.co/videos/12964/12964-720.mp4'
  }
];

async function downloadAll() {
  const outDir = path.resolve('assets', 'clips');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const clip of CLIPS) {
    const dest = path.join(outDir, clip.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log(`[Clip] ${clip.name} already exists (${fs.statSync(dest).size} bytes)`);
      continue;
    }
    console.log(`[Clip] Downloading ${clip.name} from ${clip.url}...`);
    const res = await fetch(clip.url, { redirect: 'follow' });
    if (!res.ok) {
      console.error(`Failed ${clip.name}: HTTP ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`[Clip] Saved ${clip.name} (${buffer.length} bytes)`);
  }
  console.log('All video clips ready!');
}

downloadAll();
