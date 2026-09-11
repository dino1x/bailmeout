import os
from playwright.sync_api import sync_playwright

OUT_DIR = r'c:\Users\Home\Desktop\vibecode\o\bailmeout\assets\clips'
os.makedirs(OUT_DIR, exist_ok=True)

HTML_IMESSAGE = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif; }
  body {
    background: #0f1117;
    width: 1280px;
    height: 720px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .bg-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, rgba(0,0,0,0) 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .phone-frame {
    width: 380px;
    height: 680px;
    background: #000000;
    border-radius: 46px;
    border: 3px solid #333945;
    box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 122, 255, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }
  .status-bar {
    height: 42px;
    padding: 12px 24px 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
  }
  .dynamic-island {
    width: 100px;
    height: 24px;
    background: #000;
    border-radius: 20px;
    margin: 0 auto;
  }
  .nav-bar {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    background: rgba(20, 20, 22, 0.9);
  }
  .back-btn { color: #007aff; font-size: 15px; font-weight: 500; margin-right: 12px; }
  .contact-info { flex: 1; text-align: center; }
  .contact-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #5856d6;
    color: #fff;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 3px auto;
    font-size: 15px;
  }
  .contact-name { font-size: 13px; font-weight: 600; color: #fff; }
  .chat-body {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #050507;
  }
  .bubble-row { display: flex; flex-direction: column; width: 100%; position: relative; }
  .bubble-row.sent { align-items: flex-end; }
  .bubble-row.received { align-items: flex-start; }
  
  .bubble {
    max-width: 82%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.35;
    position: relative;
  }
  .bubble.sent {
    background: #007aff;
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .bubble.received {
    background: #26262a;
    color: #fff;
    border-bottom-left-radius: 4px;
  }
  .tapback-badge {
    position: absolute;
    top: -10px;
    left: -8px;
    background: #1c1c1e;
    border: 2px solid #007aff;
    border-radius: 16px;
    padding: 2px 6px;
    font-size: 13px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    color: #ff3b30;
  }
  .audio-bubble {
    background: #007aff;
    border-radius: 20px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 250px;
    color: #fff;
  }
  .play-icon {
    width: 28px;
    height: 28px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #007aff;
    font-size: 11px;
    padding-left: 2px;
  }
  .waveform {
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    height: 24px;
  }
  .bar { width: 3px; background: rgba(255,255,255,0.85); border-radius: 2px; }
  .audio-time { font-size: 12px; font-weight: 600; }
  
  .stage-tag {
    position: absolute;
    bottom: 30px;
    background: rgba(0, 122, 255, 0.9);
    color: #fff;
    padding: 8px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  }
</style>
</head>
<body>
<div class="bg-glow"></div>
<div class="phone-frame">
  <div class="status-bar">
    <span>9:41</span>
    <div class="dynamic-island"></div>
    <span>5G 98%</span>
  </div>
  <div class="nav-bar">
    <div class="back-btn">&lsaquo; 23</div>
    <div class="contact-info">
      <div class="contact-avatar">DM</div>
      <div class="contact-name">Dave (Building Maint)</div>
    </div>
  </div>
  <div class="chat-body">
    <div class="bubble-row sent">
      <div class="bubble sent">
        <div class="tapback-badge">&hearts;</div>
        Let me know if there are any building updates today.
      </div>
    </div>
    
    <div class="bubble-row received">
      <div class="bubble received">
        <strong>URGENT DISPATCH:</strong> Water main ruptured above Unit 4B. Water is flooding through into apartment 2B. Please return to the building immediately!
      </div>
    </div>

    <div class="bubble-row received">
      <div class="audio-bubble">
        <div class="play-icon">&#9658;</div>
        <div class="waveform">
          <div class="bar" style="height:8px"></div>
          <div class="bar" style="height:16px"></div>
          <div class="bar" style="height:22px"></div>
          <div class="bar" style="height:12px"></div>
          <div class="bar" style="height:24px"></div>
          <div class="bar" style="height:18px"></div>
          <div class="bar" style="height:14px"></div>
          <div class="bar" style="height:20px"></div>
          <div class="bar" style="height:10px"></div>
          <div class="bar" style="height:17px"></div>
          <div class="bar" style="height:22px"></div>
          <div class="bar" style="height:9px"></div>
          <div class="bar" style="height:15px"></div>
        </div>
        <span class="audio-time">0:14</span>
      </div>
    </div>
  </div>
</div>
<div class="stage-tag">Stage 1 & 2: Urgent Text + ElevenLabs Voice Memo</div>
</body>
</html>
"""

HTML_INCOMING_CALL = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
  body {
    background: #0a0b0e;
    width: 1280px;
    height: 720px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }
  .phone-frame {
    width: 380px;
    height: 680px;
    background: radial-gradient(circle at 50% 30%, #1e2638 0%, #08090c 100%);
    border-radius: 46px;
    border: 3px solid #3a4252;
    box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 50px rgba(48, 209, 88, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 24px;
    position: relative;
    z-index: 2;
    color: #fff;
  }
  .caller-title { font-size: 13px; color: #8e8e93; text-transform: uppercase; letter-spacing: 1px; margin-top: 30px; }
  .caller-name { font-size: 24px; font-weight: 700; margin-top: 8px; text-align: center; }
  .caller-number { font-size: 15px; color: #a1a1a6; margin-top: 4px; }
  .avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #1c1c1e;
    border: 2px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin-top: 30px;
  }
  .telephony-badge {
    margin-top: 14px;
    background: rgba(255,255,255,0.1);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    color: #30d158;
    font-weight: 600;
  }
  .call-actions {
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding-bottom: 20px;
  }
  .btn-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
  .decline { background: #ff453a; color: #fff; }
  .accept { background: #30d158; color: #fff; }
  .stage-tag {
    position: absolute;
    bottom: 30px;
    background: rgba(48, 209, 88, 0.9);
    color: #000;
    padding: 8px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  }
</style>
</head>
<body>
<div class="phone-frame">
  <div class="caller-title">Emergency Incoming Call</div>
  <div class="caller-name">Property Emergency Dispatch</div>
  <div class="caller-number">+1 (737) 250-8034</div>
  <div class="avatar-circle">&#9742;</div>
  <div class="telephony-badge">Live Carrier Telephony via Twilio Voice</div>
  
  <div class="call-actions">
    <div class="btn-circle decline">Decline</div>
    <div class="btn-circle accept">Accept</div>
  </div>
</div>
<div class="stage-tag">Stage 4: Real-Time Phone Call to Speaker</div>
</body>
</html>
"""

HTML_OUTRO = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
  body {
    background: #08090c;
    width: 1280px;
    height: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: #fff;
    position: relative;
  }
  .logo-title {
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -1.5px;
    background: linear-gradient(135deg, #ffffff 30%, #007aff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .subtitle {
    font-size: 20px;
    color: #8e8e93;
    margin-bottom: 40px;
  }
  .badges-row {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
  }
  .badge-card {
    background: #14161f;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 16px 24px;
    text-align: center;
    width: 240px;
  }
  .badge-title { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .badge-desc { font-size: 13px; color: #8e8e93; }
  .footer-tag {
    font-size: 14px;
    color: #30d158;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="logo-title">BailMeOut</div>
  <div class="subtitle">Autonomous iMessage Social Extraction Agent</div>
  <div class="badges-row">
    <div class="badge-card">
      <div class="badge-title">Photon Spectrum</div>
      <div class="badge-desc">Native iMessage Gateway</div>
    </div>
    <div class="badge-card">
      <div class="badge-title">ElevenLabs</div>
      <div class="badge-desc">Realistic Audio Voicemail</div>
    </div>
    <div class="badge-card">
      <div class="badge-title">Twilio Voice</div>
      <div class="badge-desc">Direct Telephony Carrier</div>
    </div>
  </div>
  <div class="footer-tag">Open Source &bull; Hackathon 2026</div>
</body>
</html>
"""

def render_screens():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='msedge')
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        print("[Render] Generating screen 1: iMessage Thread...")
        page.set_content(HTML_IMESSAGE)
        page.screenshot(path=os.path.join(OUT_DIR, 'screen_imessage.png'))

        print("[Render] Generating screen 2: Incoming Phone Call...")
        page.set_content(HTML_INCOMING_CALL)
        page.screenshot(path=os.path.join(OUT_DIR, 'screen_incoming_call.png'))

        print("[Render] Generating screen 3: Outro Tech Stack...")
        page.set_content(HTML_OUTRO)
        page.screenshot(path=os.path.join(OUT_DIR, 'screen_outro.png'))

        browser.close()
    print("All UI screens rendered successfully!")

if __name__ == '__main__':
    render_screens()
