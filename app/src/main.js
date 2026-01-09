const { app, webContents, BrowserWindow, screen } = require('electron');
const cors = require('cors');
const contextMenu = require('electron-context-menu').default || require('electron-context-menu');
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

const serveIndex = require('serve-index');
const { MapArray } = require("./utils")
const { executeJavaScript,downloadMedia,getAppInfo,setCookies,windowSitesToJSON} = require("./helpers")
const { whisperTranscribe } = require("./utils-node")


const MediaDir = path.join(app.getPath('home'), "assets")

let mainWindow;
const WindowSites = new Map();
let requestIndex = 0;
const isLocal = process.env.IS_LOCAL === "true"
console.log("IS_LOCAL", isLocal, process.env.IS_LOCAL === 'true')
app.setName(process.env.APP_NAME || "Electron");
const WindowState = new Map()
async function handleMethod(method, params, { server: { req, res } }) {
    let win;
    let wc;
    if (method !== 'getWindows' && method !== 'getWindowState') {
        console.log("[ACT]", method);
        console.log("[PARAMS]", JSON.stringify(params));
    }
    if (params) {
        if (params.win_id) {
            win = BrowserWindow.fromId(params.win_id);
            if (win) {
                wc = win.webContents;
            }
        }
        if (params.wc_id) {
            wc = webContents.fromId(params.wc_id)
        }
    }
    let result;
    let ok = true;
    switch (method) {
        case 'ping':
            result = 'pong';
            break;
        case 'sendInputEvent': {
            const {inputEvent} = params
            await wc.sendInputEvent(inputEvent)
            break;
        }
        case 'getSubTitles': {
            const { mediaPath } = params
            result = await whisperTranscribe(mediaPath)
            break;
        }

        case 'downloadMedia':
            {
                const { mediaUrl,genSubtitles,basePath,id } = params
                const { session } = wc
                result = await downloadMedia(session, { mediaUrl,genSubtitles,basePath,id,MediaDir})
                console.log("genSubtitles",genSubtitles)
                let subtitles = null
                if(genSubtitles){
                    subtitles = await whisperTranscribe(result.audioPath)
                    console.log("subtitles", subtitles)
                }
                result = {
                    ...result,
                    subtitles
                }
                break
            }

        case 'info':
            const primaryDisplay = screen.getPrimaryDisplay();
            const { width, height } = primaryDisplay.workAreaSize;
            result = {
                process: getAppInfo(),
                screen: { width, height },
            };
            break
        case 'openWindow':
            // Added await here to ensure we get the window object before destructuring
            const winObj = await createWindow(params?.account_index || 0, params?.url, params?.options || {}, params?.others || {});
            result = { id: winObj.id };
            break;
        case 'getWindowState':
            if (params && params.win_id) {
                result = WindowState.get(params.win_id)||{}
            } else {
                result = {};
            }
            break
        case 'getRequests':
            if (params && params.win_id) {
                result = new MapArray(params.win_id).all();
            } else {
                result = [];
            }
            break
        case 'clearRequests':
            if (params && params.win_id) {

                new MapArray(params.win_id).clear();
            } else {
                result = [];
            }
            break;
        case 'getWindows':
            result = windowSitesToJSON(WindowSites);
            break;
        case 'getBounds':
            result = wc ? wc.getBounds() : null;
            break;
        case 'loadURL':
            if (params && params.win_id) {
                WindowState.set(params.win_id,{})
            }
            if (wc) wc.loadURL(params?.url);
            break;
        case 'importCookies':
            if (wc) {
                const { cookies } = params;
                await setCookies(wc, cookies);
            }
            break
        case 'exportCookies':
            if (wc) {
                const { options } = params;
                return await wc.session.cookies.get(options || {});
            }
            break
        case 'executeJavaScript':
            if (wc) {
                const { code } = params;
                result = await executeJavaScript(wc,code);
            }
            break;
        case 'openDevTools':
            if (wc) {
                await wc.openDevTools();
            }
            break;
        case 'getURL':
            wc ? wc.getURL() : '';
            break
        case 'reload':
            wc ? wc.reload() : null;
            break
        case 'getTitle':
            wc ? wc.getTitle() : '';
            break
        case 'setUserAgent':
            if (wc) {
                const { userAgent } = params || {};
                return wc.setUserAgent(userAgent);
            }
            break
        default:
            result = "error method"
            ok = false;
            break

    }
    if (result && result.headersSent) return;
    res.json({
        ok: true,
        result
    });
}

async function getScreenshot(wc) {
    if (!wc) return null;
    const image = await wc.capturePage();
    return image.resize({
        width: Math.floor(image.getSize().width / 2),
        height: Math.floor(image.getSize().height / 2),
    });
}

/* -----------------------------
 * Express HTTP Server
 * ----------------------------- */
function startHttpServer() {
    const appServer = express();
    appServer.use(cors()); // enable CORS for all origins
    appServer.use(express.json({ limit: '50mb' }));

    appServer.use(
        "/assets",
        express.static(MediaDir),  // serves files
        serveIndex(MediaDir, { icons: true }) // lists directory
    );

    appServer.get('/', async (req, res) => {
        res.status(500).json({ message: "pong" });
    });
    appServer.get('/screenshot', async (req, res) => {
        try {
            const id = req.query.id ? Number(req.query.id) : (mainWindow ? mainWindow.id : 1);

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
            await handleMethod(method, params, {
                server: {
                    req,
                    res
                }
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
    });
}

async function createWindow(account_index, url, options, others) {
    if (!account_index) {
        account_index = 0;
    }
    const { userAgent, cookies, openDevtools, proxy, wrapUrl,showWin } = others || {};

    const currentWindowSites = WindowSites.has(account_index) ? WindowSites.get(account_index) : new Map();
    if (currentWindowSites.get(url)) {
        const currentWinEntry = currentWindowSites.get(url);
        if (currentWinEntry.win && !currentWinEntry.win.isDestroyed()) {
            if(showWin){
                currentWinEntry.win.show()
            }
            return currentWinEntry.win;
        }
    }

    if (!options) {
        options = {};
    }
    if (wrapUrl) {
        url = `${isLocal ? "http://127.0.0.1:3455" : "https://render.cicy.de5.net"}/render?u=${encodeURIComponent(url)}`
    }
    console.log(isLocal, url)
    if (userAgent) {
        if (options.userAgent) delete options.userAgent;
    }
    if (!options.webPreferences) {
        options.webPreferences = {};
    }

    const p = 'p_' + account_index;
    const win = new BrowserWindow({
        width: 720,
        height: 720,
        x: 0,
        y: 0,
        ...options,
        args: [
            '--safebrowsing-disable-download-protection',
            '--safebrowsing-disable-extension-blacklist'
        ],
        webPreferences: {
            partition: 'persist:' + p,
            // webviewTag: true,
            // nodeIntegration: true,
            // contextIsolation: false,
            ...options.webPreferences
        }
    });

    if (proxy) {
        await win.webContents.session.setProxy({
            proxyRules: proxy
        });
        console.log(`[${p}] Proxy set to: ${proxy}`);
    }

    if (cookies) {
        await setCookies(win.webContents, cookies);
    }

    if (openDevtools && openDevtools.mode) {
        win.webContents.openDevTools(openDevtools);
    }

    if (!mainWindow) {
        mainWindow = win;
    }

    const id = win.id;
    WindowState.set(id,{})
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
        if (win.isDestroyed()) {
            return;
        }

        new MapArray(id).push({
            index: requestIndex++,
            url,
            requestHeaders,
            win_id: id,
            method,
            timestamp: Date.now() // Added timestamp for frontend display
        })

        // console.log('REQUEST:', id, details.url);
        callback({ cancel: false });
    });

    win.webContents.on(
        'console-message',
        (event) => {
            const {
                level,
                message,
            } = event;
            if (
                level === 2 && // Warning level
                message.includes('Electron Security Warning')
            ) {
                return;
            }
            if (
                message.includes('ON_REQUEST')
            ) {
                return;
            }
            console.log(`[${key}][renderer][${level}] ${message}`);
        }
    );

    win.webContents.on('did-start-navigation', async ({ url, isMainFrame }) => {
        if (isMainFrame) {
            let state = WindowState.get(id)
            if(state){
                WindowState.set(id,{ready:false})
            }
            new MapArray(id).clear()
        }
    });

    win.webContents.on('did-finish-load', async () => {
        console.log(`[${key}] DOM ready`, { account_index, id, wcId }, win.webContents.getURL());
        WindowState.set(id,{ready:true})
        executeJavaScript(win.webContents,`window.__win_id = ${id};window._G.init();d('dom-ready')`)
    });
    return win;
}

//https://www.npmjs.com/package/electron-context-menu
contextMenu({
    showSaveImageAs: true
});
app.whenReady().then(() => {
    console.log('app ready');
    startHttpServer();
    if(process.env.INIT_URL){
        createWindow(0, process.env.INIT_URL,{width:1460},{openDevtools:{mode:"right"}})
        createWindow(0, 'https://gemini.google.com/app',{width:1460},{openDevtools:{mode:"right"}})
    }
});
app.on('before-quit', (event) => {
    console.log("before-quit")
    event.preventDefault();
});