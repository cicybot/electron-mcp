import pyautogui
import sys
import json
import os
from datetime import datetime

data = json.loads(sys.argv[1])

# Take screenshot
screenshot = pyautogui.screenshot()

# Save to file
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = f"screenshot_{timestamp}.png"
filepath = os.path.join(os.getcwd(), filename)
screenshot.save(filepath)

print(json.dumps({"filepath": filepath}))