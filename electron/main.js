const { app,Menu, BrowserWindow,session } = require('electron');
const {screen } = require('electron')
const cors = require('cors');

const contextMenu = require('electron-context-menu').default || require('electron-context-menu');
const express = require('express');

//https://www.npmjs.com/package/electron-context-menu
contextMenu({
    showSaveImageAs: true
});

let mainWindow;
let server;
const WindowSites = new Map();
const RequestsMap =  [];
let requestIndex = 0;

app.setName("Electron")
async function setCookies(wc,cookies) {
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
    }
}
function getAppInfo(){

    const {defaultApp,platform,arch,pid,env,argv,execPath,versions} = process
    const getCPUUsage = process.getCPUUsage()
    const getHeapStatistics = process.getHeapStatistics()
    const getBlinkMemoryInfo = process.getBlinkMemoryInfo()
    const getProcessMemoryInfo = process.getProcessMemoryInfo()
    const getSystemMemoryInfo = process.getSystemMemoryInfo()
    const getSystemVersion = process.getSystemVersion()

    return {
        session:session.defaultSession.getStoragePath(),
        userData: app.getPath('userData'),
        processId:pid,
        is64Bit: arch === 'x64' || arch === 'arm64',
        platform,
        versions,
        defaultApp,
        else:{
            env,argv,execPath,
            CPUUsage:getCPUUsage,
            HeapStatistics:getHeapStatistics,
            BlinkMemoryInfo:getBlinkMemoryInfo,
            ProcessMemoryInfo:getProcessMemoryInfo,
            SystemMemoryInfo:getSystemMemoryInfo,
            SystemVersion:getSystemVersion
        }
    }
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
async function handleMethod(method,params,{
    server:{
        req,
        res
    }
}){
    let win;
    let wc
    console.log("[ACT]",method)
    console.log("[PARAMS]",params)
    if( params && params.win_id){
        win = BrowserWindow.fromId(params.win_id)
        if(win){
            wc = win.webContents
        }

    }
    let result;
    switch (method) {
        case 'ping':
            result = 'pong';
            break;
        case 'info':
            const primaryDisplay = screen.getPrimaryDisplay()
            const { width, height } = primaryDisplay.workAreaSize
            return {
                process:getAppInfo(),
                screen:{width, height },
            };
        case 'openWindow':
            const {id} = createWindow(params?.account_index||0,params?.url,params?.options||{},params?.others||{});
            return {id}
        case 'getRequests':
            return RequestsMap
        case 'getWindows':
            return windowSitesToJSON(WindowSites)
        case 'getBounds':
            return wc.getBounds();
        case 'loadURL':
            wc.loadURL(params?.url);
            break;
        case 'importCookies':
            const {cookies} = params
            await setCookies(wc,cookies)
            return {}
        case 'exportCookies':
            const {options} = params
            return await wc.session.cookies.get(options||{})
        case 'executeJavaScript':
            const {code} = params
            result = await wc.executeJavaScript(code);
            break
        case 'getURL':
            return wc.getURL();
        case 'reload':
            return wc.reload();
        case 'getTitle':
            return wc.getTitle();
        case 'setUserAgent':
            const {userAgent} = params||{}
            return wc.setUserAgent(userAgent);
        case 'screenshot':
            const image = await getScreenshot(wc)
            result = image.toPNG().toString('base64');
            console.log(result)
            break;
        default:
            return res.status(404).json({ error: 'unknown method' });
    }
    return result
}
async function getScreenshot(wc){
    const image = await wc.capturePage();
    const scaled = image.resize({
        width: Math.floor(image.getSize().width / 2),
        height: Math.floor(image.getSize().height / 2),
    });
    return scaled
}
/* -----------------------------
 * Express HTTP Server
 * ----------------------------- */
function startHttpServer() {
    const appServer = express();
    appServer.use(cors()); // enable CORS for all origins
    appServer.use(express.json({ limit: '50mb' }));
    appServer.get('/', async (req, res) => {
        res.send("hi")
    });
    // 📸 Screenshot endpoint
    appServer.get('/screenshot', async (req, res) => {
        try {
            if (!mainWindow) {
                return res.status(500).json({ error: 'window not ready' });
            }
            const id = req.query.id ? Number(req.query.id) : 1;
            console.log('[screenshot] id =', id);

            const scaled = await getScreenshot(BrowserWindow.fromId(id).webContents)
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
        console.log(req.body)
        if (!method) {
            return res.status(400).json({ error: 'method is required' });
        }
        try {
            const result = await handleMethod(method, params,{
                server:{
                    req,
                    res
                }
            })
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
    const port = process.env.PORT || 3456
    server = appServer.listen(port, '0.0.0.0', () => {
        const url = `http:/127.0.0.1:${port}`
        console.log(`[express] listening on ${url}`);
        createWindow(0,url)
    });
}

async function createWindow(account_index,url,options,others) {
    if(!account_index){
        account_index = 0
    }
    const currentWindowSites = WindowSites.has(account_index) ? WindowSites.get(account_index) : new Map()
    if(currentWindowSites.get(url)){
        const currentWin = currentWindowSites.get(url)
        currentWin.win.show()
        return currentWin
    }
    if(!options){
        options = {}
    }
    const {userAgent,cookies,openDevtools} = others||{}
    if(userAgent){
        delete options["userAgent"]
    }
    if(!options.webPreferences){
        options.webPreferences = {}
    }

    const p ='p_'+account_index
    const win = new BrowserWindow({
        width: 1920,
        height: 1280,
        x:0,
        y:0,
        ...options,
        webPreferences: {
            partition: 'persist:' + p,
            // webviewTag: true,
            // nodeIntegration: true,
            // contextIsolation: false,
            ...options.webPreferences
        }
    });
    if(cookies){
        await setCookies(win.webContents,cookies)
    }

    if(openDevtools){
        win.webContents.openDevTools(openDevtools);
    }

    if(!mainWindow){
        mainWindow = win
    }

    const id = win.id
    const key = `win_${id}`
    const ses = win.webContents.session;
    const {storagePath} = ses
    const wcId = win.webContents.id;
    if(userAgent){
        win.webContents.setUserAgent(
            userAgent
        );
    }

    currentWindowSites.set(url,{
        id:win.id,
        wcId,
        win
    })
    WindowSites.set(account_index,currentWindowSites)
    console.log("storagePath",storagePath)
    console.log("wcId",wcId)
    win.loadURL(url);
    win.on("close",()=>{
        const currentWindowSites = WindowSites.has(account_index) ? WindowSites.get(account_index) : new Map()
        if(currentWindowSites){
            currentWindowSites.delete(url)
            WindowSites.set(account_index,currentWindowSites)
        }
    })
    win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
        const {url,method,requestHeaders} = details

        RequestsMap.push({
            index:requestIndex++,
            url,requestHeaders,win_id:id,method
        })
        console.log('REQUEST:', id,details.url);
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
                level === "warning" &&
                message.includes('Electron Security Warning')
            ) {
                return;
            }
            console.log(`[${key}][renderer][${level}] ${message}`);
        }
    );
    win.webContents.on('did-finish-load', async () => {
        console.log(`[${key}] DOM ready`,{account_index,id,wcId},win.webContents.getURL());
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

