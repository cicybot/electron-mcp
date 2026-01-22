#!/usr/bin/env python3
import pyautogui
import sys
import json

data = json.loads(sys.argv[1])

pyautogui.hotkey(data.get("hot"), data.get("key"))