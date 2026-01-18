#!/usr/bin/env python3
import pyautogui
import sys
import json

def paste_text():
    # Paste using Ctrl+V
    pyautogui.hotkey('ctrl', 'v')

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    paste_text()