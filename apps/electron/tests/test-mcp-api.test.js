// MCP API Unit Tests
// Tests MCP (Model Context Protocol) API endpoints and functionality

const { postRpc, ensureBackendUp, getFirstWindowId } = require("./test-utils");

describe("MCP API Unit Tests", () => {
  beforeAll(async () => {
    await ensureBackendUp();
  });

  describe("Window Management API", () => {
    test("should open a new window", async () => {
      const resp = await postRpc({
        method: "openWindow",
        params: {
          url: "https://example.com",
          options: {
            width: 800,
            height: 600,
          },
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp).toHaveProperty("result");
      expect(resp.result).toHaveProperty("id");
      expect(typeof resp.result.id).toBe("number");
    });

    test("should get list of windows", async () => {
      const resp = await postRpc({ method: "getWindows", params: {} });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp).toHaveProperty("result");
      expect(typeof resp.result).toBe("object");
    });

    test("should get window bounds", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "getBounds",
          params: { win_id: windowId },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
        expect(resp).toHaveProperty("result");
        expect(resp.result).toEqual(
          expect.objectContaining({
            x: expect.any(Number),
            y: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
          })
        );
      }
    });

    test("should set window bounds", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const newBounds = { x: 100, y: 100, width: 1024, height: 768 };

        const resp = await postRpc({
          method: "setBounds",
          params: { win_id: windowId, bounds: newBounds },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
      }
    });
  });

  describe("JavaScript Execution API", () => {
    test("should execute simple JavaScript code", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: "2 + 2",
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp).toHaveProperty("result", 4);
    });

    test("should execute JavaScript code returning object", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: '({ message: "Hello MCP", timestamp: Date.now() })',
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp.result).toHaveProperty("message", "Hello MCP");
      expect(resp.result).toHaveProperty("timestamp");
      expect(typeof resp.result.timestamp).toBe("number");
    });

    test("should handle JavaScript errors gracefully", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: 'throw new Error("Test error")',
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", false);
      expect(resp).toHaveProperty("result");
      expect(typeof resp.result).toBe("string");
    });
  });

  describe("Navigation API", () => {
    test("should navigate to URL", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "loadURL",
          params: {
            win_id: windowId,
            url: "https://httpbin.org/json",
          },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
      }
    });

    test("should get current URL", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "getURL",
          params: { win_id: windowId },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
        expect(resp).toHaveProperty("result");
        expect(typeof resp.result).toBe("string");
      }
    });

    test("should get window title", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "getTitle",
          params: { win_id: windowId },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
        expect(resp).toHaveProperty("result");
        expect(typeof resp.result).toBe("string");
      }
    });
  });

  describe("Input Simulation API", () => {
    test("should send click event", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "sendElectronClick",
          params: {
            win_id: windowId,
            x: 100,
            y: 100,
            button: "left",
          },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
      }
    });

    test("should send key press event", async () => {
      const windowId = await getFirstWindowId();
      if (windowId) {
        const resp = await postRpc({
          method: "sendElectronPressEnter",
          params: { win_id: windowId },
        });

        expect(resp).toBeDefined();
        expect(resp).toHaveProperty("ok", true);
      }
    });
  });

  describe("Clipboard API", () => {
    test("should write text to clipboard", async () => {
      const testText = "Hello from MCP test!";

      const resp = await postRpc({
        method: "writeClipboard",
        params: { text: testText },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
    });
  });

  describe("Error Handling", () => {
    test("should handle invalid method names", async () => {
      const resp = await postRpc({
        method: "invalidMethod",
        params: {},
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", false);
      expect(resp).toHaveProperty("result");
      expect(resp.result).toContain("Unknown method");
    });

    test("should handle missing parameters", async () => {
      const resp = await postRpc({
        method: "getBounds",
        params: {}, // Missing win_id
      });

      expect(resp).toBeDefined();
      // Note: getBounds returns ok: true even with missing win_id, result is null
      expect(resp).toHaveProperty("result", null);
    });

    test("should handle invalid window IDs", async () => {
      const resp = await postRpc({
        method: "getBounds",
        params: { win_id: 99999 }, // Non-existent window ID
      });

      expect(resp).toBeDefined();
      // Note: getBounds returns ok: true even with invalid window ID, result is null
      expect(resp).toHaveProperty("result", null);
    });
  });

  describe("Data Types and Validation", () => {
    test("should handle JSON string parsing", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: 'JSON.stringify({ type: "test", values: [1, 2, 3] })',
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(typeof resp.result).toBe("string");

      // Verify it's valid JSON
      const parsed = JSON.parse(resp.result);
      expect(parsed).toHaveProperty("type", "test");
      expect(parsed.values).toEqual([1, 2, 3]);
    });

    test("should handle boolean return values", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: "true",
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp).toHaveProperty("result", true);
    });

    test("should handle null and undefined values", async () => {
      const resp = await postRpc({
        method: "runCode",
        params: {
          win_id: 1,
          code: "null",
        },
      });

      expect(resp).toBeDefined();
      expect(resp).toHaveProperty("ok", true);
      expect(resp).toHaveProperty("result", null);
    });
  });
});
