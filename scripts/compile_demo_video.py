import os
import subprocess

def compile_video():
    base_dir = r'c:\Users\Home\Desktop\vibecode\o\bailmeout'
    ffmpeg = os.path.join(base_dir, 'bin', 'ffmpeg.exe')
    assets_dir = os.path.join(base_dir, 'assets')
    clips_dir = os.path.join(assets_dir, 'clips')
    
    audio_path = os.path.join(assets_dir, 'master_voiceover.wav')
    output_mp4 = os.path.join(assets_dir, 'bailmeout_demo_video.mp4')
    
    clip1 = os.path.join(clips_dir, '01_bored_meeting.mp4')
    clip2 = os.path.join(clips_dir, '02_hands_texting.mp4')
    clip3 = os.path.join(clips_dir, '03_message_receive.mp4')
    clip4 = os.path.join(clips_dir, '04_worried_call.mp4')

    font = "C\\\\:/Windows/Fonts/segoeui.ttf"
    font_bold = "C\\\\:/Windows/Fonts/segoeuib.ttf"
    
    print("[Compiler] Building video segments and caption choreography...")

    # Segment specifications
    # Total duration: 38.51s
    # Segment 1: 0.0 - 6.5s (6.5s)
    # Segment 2: 0.0 - 7.5s (7.5s)
    # Segment 3: 0.0 - 10.0s (10.0s)
    # Segment 4: 10.0 - 17.0s (7.0s)
    # Segment 5: 0.0 - 7.51s (7.51s)
    
    # Filtergraph construction
    filter_complex = (
        # Clip 1: The Hook (0 - 6.5s)
        f"[0:v]trim=start=0:duration=6.5,setpts=PTS-STARTPTS,scale=1280:720,fps=25,"
        f"drawbox=y=ih-120:color=black@0.7:width=iw:height=100:t=fill,"
        f"drawtext=fontfile='{font_bold}':text='BAILMEOUT':x=50:y=45:fontsize=22:fontcolor=white:box=1:boxcolor=red@0.85:boxborderw=8,"
        f"drawtext=fontfile='{font_bold}':text='Ever been trapped in a conversation you cannot escape?':x=(w-text_w)/2:y=h-95:fontsize=30:fontcolor=white,"
        f"drawtext=fontfile='{font}':text='Awkward date, painful vendor pitch, or endless weekend meeting':x=(w-text_w)/2:y=h-55:fontsize=20:fontcolor=#a0a0a0[v1];"
        
        # Clip 2: Stealth Trigger (0 - 7.5s)
        f"[1:v]trim=start=0:duration=7.5,setpts=PTS-STARTPTS,scale=1280:720,fps=25,"
        f"drawbox=y=ih-120:color=black@0.7:width=iw:height=100:t=fill,"
        f"drawtext=fontfile='{font_bold}':text='STEALTH TRIGGER':x=50:y=45:fontsize=22:fontcolor=white:box=1:boxcolor=blue@0.85:boxborderw=8,"
        f"drawtext=fontfile='{font_bold}':text='No suspicious app to open. Just react under the table.':x=(w-text_w)/2:y=h-95:fontsize=30:fontcolor=white,"
        f"drawtext=fontfile='{font}':text='Double-tap any iMessage with a Heart reaction to activate':x=(w-text_w)/2:y=h-55:fontsize=20:fontcolor=#38d9a9[v2];"
        
        # Clip 3: Inbound Message Alert + Audio Memo (0 - 10.0s)
        f"[2:v]trim=start=0:duration=10.0,setpts=PTS-STARTPTS,scale=1280:720,fps=25,"
        f"drawbox=y=ih-120:color=black@0.7:width=iw:height=100:t=fill,"
        f"drawtext=fontfile='{font_bold}':text='STAGE 1 & 2: TEXT + ELEVENLABS AUDIO NOTE':x=50:y=45:fontsize=22:fontcolor=white:box=1:boxcolor=0x007aff@0.9:boxborderw=8,"
        f"drawtext=fontfile='{font_bold}':text='Urgent text alert + realistic synthetic voice memo':x=(w-text_w)/2:y=h-95:fontsize=30:fontcolor=white,"
        f"drawtext=fontfile='{font}':text='\"Dave from Maintenance: Water leak in Unit 4B. Need you home now!\"':x=(w-text_w)/2:y=h-55:fontsize=20:fontcolor=#ffd43b[v3];"
        
        # Clip 4: Hard Proof + Uber Getaway (10.0 - 17.0s)
        f"[2:v]trim=start=10:duration=7.0,setpts=PTS-STARTPTS,scale=1280:720,fps=25,"
        f"drawbox=y=ih-120:color=black@0.7:width=iw:height=100:t=fill,"
        f"drawtext=fontfile='{font_bold}':text='STAGE 3: VERIFIABLE DISPATCH REPORT + UBER':x=50:y=45:fontsize=22:fontcolor=white:box=1:boxcolor=0x20c997@0.9:boxborderw=8,"
        f"drawtext=fontfile='{font_bold}':text='Official incident report notice with timestamps':x=(w-text_w)/2:y=h-95:fontsize=30:fontcolor=white,"
        f"drawtext=fontfile='{font}':text='Includes pre-configured one-tap Uber escape button':x=(w-text_w)/2:y=h-55:fontsize=20:fontcolor=#74c0fc[v4];"
        
        # Clip 5: Inbound Phone Call + Outro (0 - 7.51s)
        f"[3:v]trim=start=0:duration=7.51,setpts=PTS-STARTPTS,scale=1280:720,fps=25,"
        f"drawbox=y=ih-120:color=black@0.7:width=iw:height=100:t=fill,"
        f"drawtext=fontfile='{font_bold}':text='STAGE 4: LIVE PHONE CALL VIA TWILIO VOICE':x=50:y=45:fontsize=22:fontcolor=white:box=1:boxcolor=0xe03131@0.9:boxborderw=8,"
        f"drawtext=fontfile='{font_bold}':text='Real inbound phone call dials your speaker out loud':x=(w-text_w)/2:y=h-95:fontsize=30:fontcolor=white,"
        f"drawtext=fontfile='{font}':text='Built on Photon Spectrum + ElevenLabs + Twilio | Never get stuck again':x=(w-text_w)/2:y=h-55:fontsize=20:fontcolor=#51cf66[v5];"
        
        # Concatenate all 5 video streams
        f"[v1][v2][v3][v4][v5]concat=n=5:v=1:a=0[outv]"
    )

    cmd = [
        ffmpeg,
        '-y',
        '-i', clip1,
        '-i', clip2,
        '-i', clip3,
        '-i', clip4,
        '-i', audio_path,
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-map', '4:a',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '19',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        output_mp4
    ]

    print("[Compiler] Running FFmpeg render pipeline...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print("[Compiler] FFmpeg error:")
        print(result.stderr[-2000:])
        raise RuntimeError("FFmpeg compilation failed")
        
    print("================================================================")
    print("           DEMO VIDEO COMPILATION SUCCESSFUL")
    print("================================================================")
    print(f"Output Video:  {output_mp4}")
    print(f"File Size:     {os.path.getsize(output_mp4):,} bytes")
    print(f"Duration:      38.51 seconds")
    print(f"Resolution:    1280x720 HD (16:9 widescreen, X/Twitter ready)")
    print(f"Video Codec:   H.264 / AVC (High Profile, yuv420p)")
    print(f"Audio Codec:   AAC 192 kbps (Master Studio Mix)")
    print("================================================================")

if __name__ == '__main__':
    compile_video()
