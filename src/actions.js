

function getProcessInfo(){
    const {defaultApp,platform,arch,pid,env,argv,execPath,versions} = process
    const getCPUUsage = process.getCPUUsage()
    const getHeapStatistics = process.getHeapStatistics()
    const getBlinkMemoryInfo = process.getBlinkMemoryInfo()
    const getProcessMemoryInfo = process.getProcessMemoryInfo()
    const getSystemMemoryInfo = process.getSystemMemoryInfo()
    const getSystemVersion = process.getSystemVersion()

    return {
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
export async function handleMethod(method,params,{
    mainWindow,
    screen,
    createWindow,
    BrowserWindow,
    WindowSites,
    server:{
        req,
        res
    }
}){
    let win;
    let wc
    console.log("[ACT]",method)
    console.log("[PARAMS]",params)
    if(params && params.win_id){
        win = BrowserWindow.fromId(params.win_id)
        wc = win.webContents
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
                process:getProcessInfo(),
                screen:{width, height },
                getBounds:mainWindow.getBounds(),
                getContentBounds:mainWindow.getContentBounds()
            };
        case 'openWindow':
            const {id} = createWindow(params?.account_index||0,params?.url);
            return {id}
        case 'getWindows':
            return windowSitesToJSON(WindowSites)
        case 'getBounds':
            return wc.getBounds();
        case 'loadURL':
            wc.loadURL(params?.url);
            break;
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
        case 'getUserAgent':
            return wc.getUserAgent();
        case 'screenshot':
            const image = await wc.capturePage();
            result = image.toPNG().toString('base64');
            console.log(result)
            break;
        default:
            return res.status(404).json({ error: 'unknown method' });
    }
    return result
}