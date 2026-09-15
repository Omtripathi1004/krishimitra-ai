import asyncio
import base64
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
import websockets
import imageio_ffmpeg
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACTS_DIR = r"C:\Users\tripa\.gemini\antigravity-ide\brain\0f1cace9-193b-45ef-9c70-a6e4855ad48f"
FRAMES_DIR = os.path.join(os.getcwd(), "temp_frames")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FFMPEG_PATH = imageio_ffmpeg.get_ffmpeg_exe()

SCENE_CONFIG = [
    {"name": "Dashboard Command Center", "duration": 13, "scrolls": [0, 80, 260, 380, 200, 50, 0]},
    {"name": "Crop Intelligence ML", "duration": 13, "scrolls": [0, 150, 350, 480, 300, 100, 0]},
    {"name": "Weather & Spray Advisory", "duration": 13, "scrolls": [0, 120, 280, 420, 250, 60, 0]},
    {"name": "Smart Irrigation Hydrology", "duration": 13, "scrolls": [0, 140, 320, 450, 260, 80, 0]},
    {"name": "Satellite GIS Map", "duration": 13, "scrolls": [0, 50, 100, 180, 120, 40, 0]},
    {"name": "Viksit Bharat MSP & Schemes", "duration": 13, "scrolls": [0, 160, 360, 500, 320, 110, 0]},
    {"name": "Krishi Copilot Bilingual AI", "duration": 12, "scrolls": [0, 80, 160, 240, 150, 50, 0]}
]

TOTAL_DURATION = 90  # Exactly 1 minute 30 seconds

async def send_cdp(ws, msg_id, method, params=None):
    payload = {"id": msg_id, "method": method}
    if params:
        payload["params"] = params
    await ws.send(json.dumps(payload))
    while True:
        resp_raw = await ws.recv()
        resp = json.loads(resp_raw)
        if resp.get("id") == msg_id:
            return resp

async def record():
    os.makedirs(FRAMES_DIR, exist_ok=True)
    temp_profile = os.path.join(os.environ.get("TEMP", "C:/Temp"), "chrome_ad_run")
    
    print("🎬 Launching headless Chrome 1080p for KrishiMitra Commercial recording...")
    proc = subprocess.Popen([
        CHROME_PATH,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--disable-gpu",
        f"--user-data-dir={temp_profile}",
        "--window-size=1920,1080",
        "http://127.0.0.1:5173/?ad=true"
    ])
    
    time.sleep(3)
    try:
        data = urllib.request.urlopen("http://127.0.0.1:9222/json").read()
        targets = json.loads(data.decode())
        page_target = next(t for t in targets if t.get("type") == "page")
        ws_url = page_target["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url, max_size=100 * 1024 * 1024) as ws:
            print("Connected to page CDP. Initializing viewport and page state...")
            await send_cdp(ws, 1, "Page.enable")
            await send_cdp(ws, 2, "DOM.enable")
            await send_cdp(ws, 3, "Emulation.setDeviceMetricsOverride", {
                "width": 1920,
                "height": 1080,
                "deviceScaleFactor": 1,
                "mobile": False
            })
            
            # Allow page assets and components to settle
            await asyncio.sleep(2)
            
            frame_index = 0
            cur_scene = 0
            scene_elapsed = 0
            
            print(f"🎬 Starting 90-Second Commercial Capture (Total Duration: 01:30)...")
            
            for sec in range(TOTAL_DURATION):
                # Calculate which scene is active
                elapsed_check = 0
                for s_idx, s_cfg in enumerate(SCENE_CONFIG):
                    if sec < elapsed_check + s_cfg["duration"]:
                        cur_scene = s_idx
                        scene_elapsed = sec - elapsed_check
                        break
                    elapsed_check += s_cfg["duration"]
                
                cfg = SCENE_CONFIG[cur_scene]
                scroll_profile = cfg["scrolls"]
                scroll_step = int((scene_elapsed / max(1, cfg["duration"] - 1)) * (len(scroll_profile) - 1))
                scroll_y = scroll_profile[min(scroll_step, len(scroll_profile) - 1)]
                
                # Execute automation in page
                script = f"""
                if (window.__setAdScene) {{
                    window.__setAdScene({cur_scene}, {scene_elapsed});
                }}
                if (window.__scrollCommand) {{
                    window.__scrollCommand({scroll_y});
                }}
                """
                await send_cdp(ws, 10 + sec, "Runtime.evaluate", {"expression": script})
                await asyncio.sleep(0.08)
                
                # Capture frame
                shot_resp = await send_cdp(ws, 1000 + sec, "Page.captureScreenshot", {
                    "format": "jpeg",
                    "quality": 88
                })
                img_data = base64.b64decode(shot_resp["result"]["data"])
                frame_path = os.path.join(FRAMES_DIR, f"frame_{sec:04d}.jpg")
                with open(frame_path, "wb") as f:
                    f.write(img_data)
                
                print(f"  [Time {sec+1:02d}/90s] Scene {cur_scene+1}: {cfg['name']} (y={scroll_y}px)")
            
            print("✅ All 90 frames captured successfully!")
    finally:
        proc.terminate()

def compile_video():
    mp4_out = os.path.join(os.getcwd(), "krishimitra_ad_1m30s.mp4")
    webp_out = os.path.join(os.getcwd(), "krishimitra_ad_1m30s.webp")
    
    print(f"🎬 Compiling MP4 video via FFmpeg ({FFMPEG_PATH})...")
    # 90 frames at 1 fps = exactly 90.0 seconds (1 min 30s)
    ffmpeg_cmd = [
        FFMPEG_PATH,
        "-y",
        "-framerate", "1",
        "-i", os.path.join(FRAMES_DIR, "frame_%04d.jpg"),
        "-c:v", "libx264",
        "-r", "30",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "18",
        "-movflags", "+faststart",
        mp4_out
    ]
    subprocess.run(ffmpeg_cmd, check=True)
    print(f"✅ MP4 generated: {mp4_out} (Size: {os.path.getsize(mp4_out):,} bytes)")
    
    # Generate animated WebP for IDE artifact preview (every 2 seconds to keep file lightweight)
    print("🎬 Generating animated WebP for IDE preview...")
    webp_images = []
    for sec in range(0, TOTAL_DURATION, 2):
        frame_file = os.path.join(FRAMES_DIR, f"frame_{sec:04d}.jpg")
        if os.path.exists(frame_file):
            im = Image.open(frame_file)
            im = im.resize((960, 540), Image.Resampling.LANCZOS)
            webp_images.append(im)
            
    if webp_images:
        webp_images[0].save(
            webp_out,
            save_all=True,
            append_images=webp_images[1:],
            duration=2000,
            loop=0,
            quality=85
        )
        print(f"✅ WebP generated: {webp_out} (Size: {os.path.getsize(webp_out):,} bytes)")
    
    # Copy to artifacts directory
    if os.path.exists(ARTIFACTS_DIR):
        artifact_mp4 = os.path.join(ARTIFACTS_DIR, "krishimitra_ad_1m30s.mp4")
        artifact_webp = os.path.join(ARTIFACTS_DIR, "krishimitra_ad_1m30s.webp")
        shutil.copy2(mp4_out, artifact_mp4)
        shutil.copy2(webp_out, artifact_webp)
        print(f"✅ Copied video artifacts to: {ARTIFACTS_DIR}")

if __name__ == "__main__":
    asyncio.run(record())
    compile_video()
