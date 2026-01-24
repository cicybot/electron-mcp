// Test Utils
// Common utility functions for Electron MCP tests

const http = require("http");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

/**
 * Post RPC request to the Electron MCP server
 * @param {Object} payload - RPC payload with method and params
 * @returns {Promise<Object>} RPC response
 */
function postRpc(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: "127.0.0.1",
      port: 3456,
      path: "/rpc",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });
    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

/**
 * Check if a port is open
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} True if port is open
 */
async function isPortOpen(port) {
  return new Promise((resolve) => {
    const s = net.connect({ port }, () => {
      s.end();
      resolve(true);
    });
    s.on("error", () => resolve(false));
    setTimeout(() => {
      try {
        s.destroy();
      } catch {}
      resolve(false);
    }, 1000);
  });
}

/**
 * Ensure that Electron backend is running
 * Checks if port 3456 is open, starts Electron if not
 * @returns {Promise<void>}
 */
async function ensureBackendUp() {
  console.log("Checking if Electron MCP backend is running on port 3456...");

  // Check if port is already open
  if (await isPortOpen(3456)) {
    console.log("Electron MCP backend is already running");
    return;
  }

  console.log("Starting Electron MCP backend...");
  const appDir = path.resolve(__dirname, "..");

  return new Promise((resolve, reject) => {
    const proc = spawn("npm", ["start"], {
      cwd: appDir,
      shell: true,
      stdio: ["inherit", "pipe", "inherit"], // Capture stdout for logging
    });

    // Log Electron startup output
    proc.stdout?.on("data", (data) => {
      console.log(`[Electron] ${data.toString().trim()}`);
    });

    proc.on("error", (err) => {
      console.error("Failed to start Electron backend:", err);
      reject(err);
    });

    const timeout = setTimeout(() => {
      console.error("Electron backend start timeout");
      proc.kill();
      reject(new Error("Backend start timeout after 60 seconds"));
    }, 60000);

    const waitFor = setInterval(async () => {
      if (await isPortOpen(3456)) {
        console.log("Electron MCP backend started successfully");
        clearInterval(waitFor);
        clearTimeout(timeout);
        resolve();
      }
    }, 500);
  });
}

/**
 * Get the first available window ID from getWindows response
 * @returns {Promise<number|null>} Window ID or null if no windows
 */
async function getFirstWindowId() {
  const windowsResp = await postRpc({ method: "getWindows", params: {} });
  if (!windowsResp.ok) return null;

  const windows = Object.values(windowsResp.result)[0];
  return windows && windows.length > 0 ? windows[0].id : null;
}

/**
 * Create a test window with basic options
 * @param {string} url - URL to load
 * @param {Object} options - Additional window options
 * @returns {Promise<Object>} RPC response with window ID
 */
async function createTestWindow(url = "https://example.com", options = {}) {
  const defaultOptions = {
    width: 800,
    height: 600,
    ...options,
  };

  return await postRpc({
    method: "openWindow",
    params: {
      url,
      options: defaultOptions,
    },
  });
}

/**
 * Clean up test windows
 * @param {Array<number>} windowIds - Array of window IDs to close
 */
async function cleanupTestWindows(windowIds = []) {
  for (const windowId of windowIds) {
    try {
      await postRpc({
        method: "closeWindow",
        params: { win_id: windowId },
      });
    } catch (error) {
      // Ignore errors during cleanup
      console.warn(`Failed to close window ${windowId}:`, error.message);
    }
  }
}

module.exports = {
  postRpc,
  isPortOpen,
  ensureBackendUp,
  getFirstWindowId,
  createTestWindow,
  cleanupTestWindows,
};
