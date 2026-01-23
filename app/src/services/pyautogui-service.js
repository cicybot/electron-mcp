const { spawn } = require("child_process");
const util = require("util");

/**
 * PyAutoGUI Service - Node.js wrapper around Python pyautogui module
 * Uses pyautogui Python module for cross-platform automation
 */
class PyAutoGUIService {
  constructor() {
    this.platform = process.platform;
  }

  /**
   * Execute Python script using pyautogui module
   */
  async executePyAutoGUICode(code, variables = {}) {
    return new Promise((resolve, reject) => {
      // Create Python script that imports pyautogui and executes the code
      const pythonScript = `
import pyautogui
import sys
import json
import base64
from io import BytesIO

# Set up pyautogui safety settings
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.1

# Input variables
variables = ${JSON.stringify(variables)}

try:
    ${code}
except Exception as e:
    print(f"ERROR: {str(e)}", file=sys.stderr)
    sys.exit(1)
      `;

      const pythonProcess = spawn("python3", ["-c", pythonScript], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`PyAutoGUI execution failed: ${stderr}`));
        }
      });

      pythonProcess.on("error", (error) => {
        reject(new Error(`Python process error: ${error.message}`));
      });
    });
  }

  /**
   * Click at specific coordinates or current position
   */
  async click(params = {}) {
    const { x, y } = params;
    let code;

    if (x !== undefined && y !== undefined) {
      code = `pyautogui.click(${x}, ${y})`;
    } else {
      code = "pyautogui.click()";
    }

    return this.executePyAutoGUICode(code, { x, y });
  }

  /**
   * Type text using keyboard input
   */
  async type(params = {}) {
    const { text = "" } = params;
    const code = `pyautogui.typewrite('${this.escapePythonString(text)}')`;
    return this.executePyAutoGUICode(code, { text });
  }

  /**
   * Press hotkey combination
   */
  async hotkey(params = {}) {
    const { keys = [] } = params;
    this._validateHotkeyParams(params);

    const keyList = keys.map((key) => `'${key}'`).join(", ");
    const code = `pyautogui.hotkey(${keyList})`;
    return this.executePyAutoGUICode(code, { keys });
  }

  /**
   * Press a single key
   */
  async press(params = {}) {
    const { key } = params;
    this._validatePressParams(params);

    const code = `pyautogui.press('${key}')`;
    return this.executePyAutoGUICode(code, { key });
  }

  /**
   * Paste text from clipboard
   */
  async paste(params = {}) {
    const code = 'pyautogui.hotkey("command", "v")';
    return this.executePyAutoGUICode(code);
  }

  /**
   * Move mouse to specific coordinates
   */
  async move(params = {}) {
    const { x, y } = params;
    this._validateMoveParams(params);

    const code = `pyautogui.moveTo(${x}, ${y})`;
    return this.executePyAutoGUICode(code, { x, y });
  }

  /**
   * Press Enter key
   */
  async pressEnter(params = {}) {
    const code = 'pyautogui.press("enter")';
    return this.executePyAutoGUICode(code);
  }

  /**
   * Press Backspace key
   */
  async pressBackspace(params = {}) {
    const code = 'pyautogui.press("backspace")';
    return this.executePyAutoGUICode(code);
  }

  /**
   * Press Space key
   */
  async pressSpace(params = {}) {
    const code = 'pyautogui.press("space")';
    return this.executePyAutoGUICode(code);
  }

  /**
   * Press Escape key
   */
  async pressEsc(params = {}) {
    const code = 'pyautogui.press("escape")';
    return this.executePyAutoGUICode(code);
  }

  /**
   * Take screenshot and return base64 encoded image
   */
  async screenshot(params = {}) {
    const code = `
import base64
from io import BytesIO

screenshot = pyautogui.screenshot()
buffer = BytesIO()
screenshot.save(buffer, format='PNG')
img_bytes = buffer.getvalue()
img_base64 = base64.b64encode(img_bytes).decode('utf-8')
print(json.dumps({"base64": img_base64, "format": "png"}))
    `;

    const result = await this.executePyAutoGUICode(code);
    try {
      return JSON.parse(result);
    } catch (e) {
      throw new Error(`Failed to parse screenshot result: ${e.message}`);
    }
  }

  /**
   * Write text (alias for type)
   */
  async write(params = {}) {
    return this.type(params);
  }

  /**
   * Insert text at current position (alias for type)
   */
  async text(params = {}) {
    return this.type(params);
  }

  /**
   * Escape string for Python
   */
  escapePythonString(str) {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
  }

  /**
   * Validation helpers for testing
   */
  _validatePressParams(params) {
    const { key } = params;
    if (!key) {
      throw new Error("Key parameter is required");
    }
  }

  _validateHotkeyParams(params) {
    const { keys = [] } = params;
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error("Keys array is required");
    }
  }

  _validateMoveParams(params) {
    const { x, y } = params;
    if (x === undefined || y === undefined) {
      throw new Error("X and Y coordinates are required");
    }
  }
}

module.exports = new PyAutoGUIService();
