import os
import time
import random

# --- CONFIGURATION ---
COLLECTION_URL = "https://digitalghoststudy.com/" # Your Anonymous URL
NUM_WEEKS_TO_PLAN = 4  # Initial 4-week sprint
TARGET_DEVICES = list(range(1, 51)) # 50 physical devices
OUTPUT_DIR = "Weekly_Launchers"

# 1. FINALIZED GEO-PROFILES (Used for browser launch arguments)
GEO_PROFILES = [
    {"label": "01_Irish_Base", "TZ": "Europe/Dublin", "LANG_ARG": "--lang=en-IE"},
    {"label": "02_US_Mismatch", "TZ": "America/New_York", "LANG_ARG": "--lang=en-US"},
    {"label": "03_UK_Overlap", "TZ": "Europe/London", "LANG_ARG": "--lang=en-GB"},
    {"label": "04_German_EU", "TZ": "Europe/Berlin", "LANG_ARG": "--lang=de-DE"},
    {"label": "05_French_EU", "TZ": "Europe/Paris", "LANG_ARG": "--lang=fr-FR"},
]

# 2. BROWSER LAUNCH COMMANDS (Windows Paths - YOU MUST VERIFY THESE LOCATIONS)
# Note: Timezone Spoofing is tricky. We'll use the --lang flag for Language, 
# and rely on the browser's own Timezone emulation flags or system TZ for maximum safety.
BROWSER_LAUNCHERS = {
    "Chrome": r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "Firefox": r"C:\Program Files\Mozilla Firefox\firefox.exe",
    "Edge": r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    # Add other browsers (Brave, Opera, etc.) here after installing/locating them.
}

def generate_launchers():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    all_commands = []

    for week in range(1, NUM_WEEKS_TO_PLAN + 1):
        week_dir = os.path.join(OUTPUT_DIR, f"Week_{week}")
        if not os.path.exists(week_dir):
            os.makedirs(week_dir)
            
        for device_id in TARGET_DEVICES:
            for browser_name, browser_path in BROWSER_LAUNCHERS.items():
                for profile in GEO_PROFILES:
                    # Construct the unique filename
                    filename = f"D{device_id:02d}_{browser_name}_{profile['label']}.bat"
                    filepath = os.path.join(week_dir, filename)

                    # --- 3. CONSTRUCT THE COMMAND LINE STRING ---
                    
                    # The Timezone spoofing is handled by CDP commands in controlled automation, 
                    # but for zero-smell manual launch, we embed the Language argument directly.
                    # CRITICAL: Browsers do not all have a native --timezone-id launch flag.
                    # We will use the system-agnostic --lang flag and rely on the FP wrapper's JS 
                    # for the time zone spoof (which is safer than relying on system TZ changes).
                    
                    # Command format: "[Browser Path]" --new-window [Language Arg] [URL]
                    command = f'"{browser_path}" --new-window "{profile["LANG_ARG"]}" "{COLLECTION_URL}"\n'

                    # CRITICAL: Embed a randomized "Human Pause" reminder
                    delay = random.randint(3, 10) # 3-10 second suggestion
                    
                    bat_content = f"""@echo off
REM --- VAE ACQUISITION LAUNCHER ---
REM DEVICE: {device_id:02d} | BROWSER: {browser_name} | PROFILE: {profile['label']}
REM ACTION: Launches browser with spoofed headers. You must manually click the collect button.
REM
REM *** HUMAN ACTION REQUIRED: ***
REM 1. ENSURE Device {device_id:02d} is ON and READY.
REM 2. CLICK 'collect' BUTTON on the website.
REM 3. CLOSE this browser after submission is confirmed.
REM 4. WAIT AT LEAST {delay} SECONDS before running the next BAT file.
REM --------------------------------
{command}
exit
"""
                    with open(filepath, 'w') as f:
                        f.write(bat_content)

    print(f"\n--- SUCCESS: Generated {len(TARGET_DEVICES) * len(BROWSER_LAUNCHERS) * len(GEO_PROFILES) * NUM_WEEKS_TO_PLAN} .bat files in the '{OUTPUT_DIR}' directory. ---")
    print("\nNext step: Modify server.py to accept, enrich, and save the data.")
    
# --- EXECUTE THE GENERATOR ---
# generate_launchers()