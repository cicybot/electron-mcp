#!/usr/bin/env python3
import pyautogui
import sys
import json

def write_text(text, interval=0.25):
    pyautogui.write(text, interval=interval)

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    write_text(data.get('text', 'Hello world!'), data.get('interval', 0.25))