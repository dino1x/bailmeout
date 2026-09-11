import os
import urllib.request

CLIPS = [
    {
        "name": "01_hook_bored_meeting.mp4",
        "url": "https://assets.mixkit.co/videos/4607/4607-1080.mp4",
        "description": "Scene 1 (0:00-0:06): Office workers bored/trapped in a meeting"
    },
    {
        "name": "02_hook_bored_cafe_phone.mp4",
        "url": "https://assets.mixkit.co/videos/27352/27352-720.mp4",
        "description": "Scene 1 Alt: Bored person looking miserable with phone in cafe"
    },
    {
        "name": "03_stealth_hands_typing.mp4",
        "url": "https://assets.mixkit.co/videos/144/144-1080.mp4",
        "description": "Scene 2 (0:06-0:14): Close-up hands texting under table/desk"
    },
    {
        "name": "04_stealth_phone_detail.mp4",
        "url": "https://assets.mixkit.co/videos/4915/4915-1080.mp4",
        "description": "Scene 2 Alt: Detailed shot of hands tapping phone screen"
    },
    {
        "name": "05_incoming_message_notification.mp4",
        "url": "https://assets.mixkit.co/videos/41165/41165-1080.mp4",
        "description": "Scene 3 (0:14-0:24): Over-the-shoulder receiving urgent message"
    },
    {
        "name": "06_phone_call_worried_reaction.mp4",
        "url": "https://assets.mixkit.co/videos/12964/12964-720.mp4",
        "description": "Scene 4 (0:31-0:38): Person answering call looking shocked/worried"
    }
]

def download_clips():
    out_dir = r'c:\Users\Home\Desktop\vibecode\o\bailmeout\assets\clips'
    os.makedirs(out_dir, exist_ok=True)
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    for clip in CLIPS:
        dest = os.path.join(out_dir, clip['name'])
        print(f"[Downloading] {clip['name']} - {clip['description']}...")
        try:
            req = urllib.request.Request(clip['url'], headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp, open(dest, 'wb') as f:
                f.write(resp.read())
            print(f"  Saved ({os.path.getsize(dest):,} bytes)")
        except Exception as e:
            print(f"  Failed to download {clip['name']}: {e}")

if __name__ == '__main__':
    download_clips()
