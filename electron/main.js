const { app, Menu, BrowserWindow, session, screen } = require('electron');
const cors = require('cors');
const contextMenu = require('electron-context-menu').default || require('electron-context-menu');
const express = require('express');
const path = require('path');

//https://www.npmjs.com/package/electron-context-menu
contextMenu({
    showSaveImageAs: true
});

let mainWindow;
let server;
const WindowSites = new Map();
const RequestsMap = [];
const MAX_REQUEST_LOGS = 1000;
let requestIndex = 0;

app.setName("Electron");

async function setCookies(wc, cookies) {
    for (const c of cookies) {
        const cookie = { ...c }; // don't mutate original
        const isSecurePrefix = cookie.name.startsWith("__Secure-");
        const isHostPrefix = cookie.name.startsWith("__Host-");

        let url =
            (cookie.secure ? "https://" : "http://") +
            cookie.domain.replace(/^\./, "");
        if (isSecurePrefix) {
            cookie.secure = true;        // must be secure
            if (!url.startsWith("https://")) {
                url = "https://" + cookie.domain.replace(/^\./, "");
            }
        }
        if (isHostPrefix) {
            cookie.secure = true;        // must be secure
            cookie.path = "/";           // must be /
            cookie.domain = undefined;   // MUST NOT have domain attribute

            if (!url.startsWith("https://")) {
                url = "https://" + cookie.domain?.replace(/^\./, "") || "https://localhost";
            }
        }

        if (!cookie.path) cookie.path = "/";

        try {
            await wc.session.cookies.set({
                url,
                name: cookie.name,
                value: cookie.value,

                path: cookie.path,
                domain: cookie.domain, // may be undefined when __Host-

                httpOnly: !!cookie.httpOnly,
                secure: !!cookie.secure,

                expirationDate: cookie.session ? undefined : cookie.expirationDate,

                sameSite:
                    cookie.sameSite === "no_restriction" ? "no_restriction" :
                        cookie.sameSite === "lax" ? "lax" :
                            cookie.sameSite === "strict" ? "strict" :
                                "unspecified",
            });
        } catch (e) {
            console.error("Failed to set cookie", cookie.name, e);
        }
    }
}

function getAppInfo() {
    const { defaultApp, platform, arch, pid, env, argv, execPath, versions } = process;
    const getCPUUsage = process.getCPUUsage();
    const getHeapStatistics = process.getHeapStatistics();
    const getBlinkMemoryInfo = process.getBlinkMemoryInfo();
    const getProcessMemoryInfo = process.getProcessMemoryInfo();
    const getSystemMemoryInfo = process.getSystemMemoryInfo();
    const getSystemVersion = process.getSystemVersion();

    return {
        session: session.defaultSession.getStoragePath(),
        userData: app.getPath('userData'),
        processId: pid,
        is64Bit: arch === 'x64' || arch === 'arm64',
        platform,
        versions,
        defaultApp,
        else: {
            env, argv, execPath,
            CPUUsage: getCPUUsage,
            HeapStatistics: getHeapStatistics,
            BlinkMemoryInfo: getBlinkMemoryInfo,
            ProcessMemoryInfo: getProcessMemoryInfo,
            SystemMemoryInfo: getSystemMemoryInfo,
            SystemVersion: getSystemVersion
        }
    };
}

function windowSitesToJSON(windowSites) {
    const result = {};
    for (const [groupKey, siteMap] of windowSites.entries()) {
        result[groupKey] = {};
        for (const [url, info] of siteMap.entries()) {
            result[groupKey][url] = {
                id: info.id,
                wcId: info.wcId
            };
        }
    }
    return result;
}

async function handleMethod(method, params, { server: { req, res } }) {
    let win;
    let wc;
    console.log("[ACT]", method);
    console.log("[PARAMS]", params);
    if (params && params.win_id) {
        win = BrowserWindow.fromId(params.win_id);
        if (win) {
            wc = win.webContents;
        }
    }
    let result;
    switch (method) {
        case 'ping':
            result = 'pong';
            break;
        case 'info':
            const primaryDisplay = screen.getPrimaryDisplay();
            const { width, height } = primaryDisplay.workAreaSize;
            return {
                process: getAppInfo(),
                screen: { width, height },
            };
        case 'openWindow':
            // Added await here to ensure we get the window object before destructuring
            const winObj = await createWindow(params?.account_index || 0, params?.url, params?.options || {}, params?.others || {});
            return { id: winObj.id };
        case 'getRequests':
            return RequestsMap;
        case 'getWindows':
            return windowSitesToJSON(WindowSites);
        case 'getBounds':
            return wc ? wc.getBounds() : null;
        case 'loadURL':
            if (wc) wc.loadURL(params?.url);
            break;
        case 'importCookies':
            if (wc) {
                const { cookies } = params;
                await setCookies(wc, cookies);
            }
            return {};
        case 'exportCookies':
            if (wc) {
                const { options } = params;
                return await wc.session.cookies.get(options || {});
            }
            return [];
        case 'executeJavaScript':
            if (wc) {
                const { code } = params;
                result = await wc.executeJavaScript(code);
            }
            break;
        case 'getURL':
            return wc ? wc.getURL() : '';
        case 'reload':
            return wc ? wc.reload() : null;
        case 'getTitle':
            return wc ? wc.getTitle() : '';
        case 'setUserAgent':
            if (wc) {
                const { userAgent } = params || {};
                return wc.setUserAgent(userAgent);
            }
            return null;
        case 'screenshot':
            if (wc) {
                const image = await getScreenshot(wc);
                result = image.toPNG().toString('base64');
                // console.log(result); // Reduced log noise
            }
            break;
        default:
            return res.status(404).json({ error: 'unknown method' });
    }
    return result;
}

async function getScreenshot(wc) {
    if (!wc) return null;
    const image = await wc.capturePage();
    const scaled = image.resize({
        width: Math.floor(image.getSize().width / 2),
        height: Math.floor(image.getSize().height / 2),
    });
    return scaled;
}

/* -----------------------------
 * Express HTTP Server
 * ----------------------------- */
function startHttpServer() {
    const appServer = express();
    appServer.use(cors()); // enable CORS for all origins
    appServer.use(express.json({ limit: '50mb' }));

    // Serve static files from the application directory (index.html, index.js)
    appServer.use(express.static(__dirname));

    // 📸 Screenshot endpoint
    appServer.get('/screenshot', async (req, res) => {
        try {
            // Note: mainWindow is the initial window, but ID param should override
            const id = req.query.id ? Number(req.query.id) : (mainWindow ? mainWindow.id : 1);
            // console.log('[screenshot] id =', id);

            const win = BrowserWindow.fromId(id);
            if (!win) {
                return res.status(404).json({ error: 'Window not found' });
            }

            const scaled = await getScreenshot(win.webContents);
            const buffer = scaled.toPNG();
            res.setHeader('Content-Type', 'image/png');
            res.send(buffer);
        } catch (err) {
            console.error('[screenshot]', err);
            res.status(500).json({ error: err.message });
        }
    });

    appServer.post('/rpc', async (req, res) => {
        const { method, params } = req.body || {};
        // console.log(req.body); // Reduced log noise
        if (!method) {
            return res.status(400).json({ error: 'method is required' });
        }
        try {
            const result = await handleMethod(method, params, {
                server: {
                    req,
                    res
                }
            });
            // Handle if result is the response object (e.g. 404)
            if (result && result.headersSent) return;

            res.json({
                ok: true,
                result
            });

        } catch (err) {
            console.error('[rpc] error', err);
            res.status(500).json({
                ok: false,
                error: err.message
            });
        }
    });
    const port = process.env.PORT || 3456;
    server = appServer.listen(port, '0.0.0.0', () => {
        const url = `http://127.0.0.1:${port}`;
        console.log(`[express] listening on ${url}`);
        createWindow(0, url);
    });
}

async function createWindow(account_index, url, options, others) {
    if (!account_index) {
        account_index = 0;
    }
    const currentWindowSites = WindowSites.has(account_index) ? WindowSites.get(account_index) : new Map();
    if (currentWindowSites.get(url)) {
        const currentWinEntry = currentWindowSites.get(url);
        if (currentWinEntry.win && !currentWinEntry.win.isDestroyed()) {
            currentWinEntry.win.show();
            return currentWinEntry.win;
        }
    }

    if (!options) {
        options = {};
    }
    const { userAgent, cookies, openDevtools, proxy } = others || {};
    if (userAgent) {
        // Remove userAgent from options if it exists, handled via webContents
        if (options.userAgent) delete options.userAgent;
    }
    if (!options.webPreferences) {
        options.webPreferences = {};
    }

    const p = 'p_' + account_index;
    const win = new BrowserWindow({
        width: 360,
        height: 768,
        x: 0,
        y: 0,
        ...options,
        webPreferences: {
            partition: 'persist:' + p,
            // webviewTag: true,
            // nodeIntegration: true,
            // contextIsolation: false,
            ...options.webPreferences
        }
    });
    console.log(proxy)
    if (proxy) {
        await win.webContents.session.setProxy({
            proxyRules: proxy
        });
        console.log(`[${p}] Proxy set to: ${proxy}`);
    }

    if (cookies) {
        await setCookies(win.webContents, cookies);
    }

    if (openDevtools) {
        win.webContents.openDevTools();
    }

    if (!mainWindow) {
        mainWindow = win;
    }

    const id = win.id;
    const key = `win_${id}`;
    const ses = win.webContents.session;
    const { storagePath } = ses;
    const wcId = win.webContents.id;

    if (userAgent) {
        win.webContents.setUserAgent(userAgent);
    }

    currentWindowSites.set(url, {
        id: win.id,
        wcId,
        win
    });
    WindowSites.set(account_index, currentWindowSites);

    console.log("storagePath", storagePath);
    console.log("wcId", wcId);

    win.loadURL(url);

    win.on("close", () => {
        const currentWindowSites = WindowSites.has(account_index) ? WindowSites.get(account_index) : new Map();
        if (currentWindowSites) {
            currentWindowSites.delete(url);
            WindowSites.set(account_index, currentWindowSites);
        }
    });

    win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        const { url, method, requestHeaders } = details;

        // Ignore RPC calls to self to avoid log spam and recursion
        if (url.includes('127.0.0.1') && url.includes(process.env.PORT || '3456')) {
            callback({ cancel: false });
            return;
        }

        RequestsMap.push({
            index: requestIndex++,
            url,
            requestHeaders,
            win_id: id,
            method,
            timestamp: Date.now() // Added timestamp for frontend display
        });

        // Cap the log size
        if (RequestsMap.length > MAX_REQUEST_LOGS) {
            RequestsMap.shift();
        }

        console.log('REQUEST:', id, details.url);
        callback({ cancel: false });
    });

    win.webContents.on(
        'console-message',
        (event) => {
            const {
                level,
                message,
                lineNumber,
                sourceId
            } = event;
            if (
                level === 2 && // Warning level
                message.includes('Electron Security Warning')
            ) {
                return;
            }
            console.log(`[${key}][renderer][${level}] ${message}`);
        }
    );

    win.webContents.on('did-finish-load', async () => {
        console.log(`[${key}] DOM ready`, { account_index, id, wcId }, win.webContents.getURL());
    });

    return win;
}

app.whenReady().then(() => {
    console.log('app ready');
    startHttpServer();
});

app.on('window-all-closed', () => {
    if (server) server.close();
    if (process.platform !== 'darwin') app.quit();
});