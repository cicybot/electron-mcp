// Test harness: ensures Electron backend is running, then exercises a minimal RPC call.
// Before tests: if Electron backend is not started on port 3456, start it via `npm start` in app/

const { postRpc, ensureBackendUp } = require("./test-utils");

describe("Electron test harness (RPC)", () => {
  beforeAll(async () => {
    await ensureBackendUp();
  });

  test("RPC /rpc responds to getWindows with window info", async () => {
    const resp = await postRpc({ method: "getWindows", params: {} });

    // top-level shape
    expect(resp).toBeDefined();
    expect(resp).toHaveProperty("ok", true);
    expect(resp).toHaveProperty("result");
    expect(typeof resp.result).toBe("object");

    // first level: window groups
    const groups = Object.values(resp.result);
    expect(groups.length).toBeGreaterThan(0);

    // second level: windows
    const windows = Object.values(groups[0]);
    expect(windows.length).toBeGreaterThan(0);

    const win = windows[0];

    // window fields
    expect(win).toHaveProperty("id");
    expect(typeof win.id).toBe("number");

    expect(win).toHaveProperty("wcId");
    expect(typeof win.wcId).toBe("number");

    expect(win).toHaveProperty("bounds");
    expect(win.bounds).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number),
      })
    );
  });

  test("RPC /rpc runCode code return integer", async () => {
    const resp = await postRpc({ method: "runCode", params: { win_id: 1, code: "1" } });

    expect(resp).toBeDefined();
    expect(resp).toHaveProperty("ok", true);
    expect(resp).toHaveProperty("result", 1);
  });
  test("RPC /rpc runCode code return json", async () => {
    const resp = await postRpc({
      method: "runCode",
      params: {
        win_id: 1,
        code: `({ a: 1, b: "x", c: true })`,
      },
    });

    expect(resp).toBeDefined();
    expect(resp.ok).toBe(true);

    expect(resp.result).toEqual({
      a: 1,
      b: "x",
      c: true,
    });

    expect(typeof resp.result).toBe("object");
  });
});
