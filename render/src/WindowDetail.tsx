
import React, { useState, useEffect } from 'react';
import { useRpc } from './RpcContext';
import { NetworkLog } from './types';
import { IconArrowLeft, IconRefresh, IconCamera, IconPlay, IconTrash } from './Icons';
import View from './View';

export const WindowDetail = ({ windowId, initialUrl, onBack }: { windowId: number, initialUrl: string, onBack: () => void }) => {
    const { rpc, rpcBaseUrl } = useRpc();
    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [navUrl, setNavUrl] = useState(initialUrl);
    const [screenshotUrl, setScreenshotUrl] = useState<string>('');

    // JS Exec State
    const [jsCode, setJsCode] = useState(`(() => { 
    return document.title;
})()`);
    const [evalResult, setEvalResult] = useState<string>('');
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);

    // Network State
    const [requests, setRequests] = useState<NetworkLog[]>([]);
    const [activeTab, setActiveTab] = useState<'console' | 'network'>('console');
    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
    const [urlFilter, setUrlFilter] = useState('');

    const refreshScreenshot = () => setScreenshotUrl('');

    // Consolidated Refresh Loop
    useEffect(() => {
        let interval: any;

        const tick = async () => {
            if (isAutoRefresh) refreshScreenshot();

            // Poll Network requests
            if (activeTab === 'network') {
                try {
                    const logs = await rpc<NetworkLog[]>('getRequests', { win_id: windowId });
                    if (Array.isArray(logs)) {
                        let filtered = logs;
                        if (urlFilter) {
                            const lowerFilter = urlFilter.toLowerCase();
                            filtered = filtered.filter(l => l.url.toLowerCase().includes(lowerFilter));
                        }
                        setRequests(filtered.reverse().slice(0, 100));
                    }
                } catch (e) {
                    // Silent catch for polling
                }
            }
        };

        // Initial fetch
        tick();

        interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [isAutoRefresh, activeTab, windowId, rpc, urlFilter]);

    const handleReload = async () => {
        await rpc('reload', { win_id: windowId });
        setTimeout(refreshScreenshot, 500); // Delay for render
    };

    const handleNavigate = async () => {
        await rpc('loadURL', { win_id: windowId, url: navUrl });
        setCurrentUrl(navUrl);
        setTimeout(refreshScreenshot, 1000);
    };

    const handleEval = async () => {
        try {
            const res = await rpc('executeJavaScript', { win_id: windowId, code: jsCode });
            setEvalResult(JSON.stringify(res, null, 2));
            refreshScreenshot();
        } catch (e: any) {
            setEvalResult('Error: ' + e.message);
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'text-success';
            case 'POST': return 'text-warning';
            case 'DELETE': return 'text-danger';
            case 'PUT': return 'text-secondary';
            default: return 'text-primary';
        }
    };


    // Auto-fetch screenshot as blob URL
    useEffect(() => {
        let interval: any;

        const fetchScreenshot = async () => {
            try {
                const url = (rpcBaseUrl ? `${rpcBaseUrl}/screenshot` : '/screenshot') + `?id=${windowId}&t=${Date.now()}`;
                const response = await fetch(url);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const blob = new Blob([arrayBuffer], { type: 'image/png' });
                    const blobUrl = URL.createObjectURL(blob);
                    setScreenshotUrl(blobUrl);
                }
            } catch (error) {
                console.error('Failed to fetch screenshot:', error);
            }
        };

        // Initial fetch
        fetchScreenshot();

        // Set up interval for auto-refresh
        interval = setInterval(fetchScreenshot, 1000);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [windowId, rpcBaseUrl]);

    const onClickImage = (e,type)=>{
        e.preventDefault();
        // 获取鼠标相对于图片的坐标
        var x = parseInt(e.clientX + document.querySelector("#screen").scrollLeft) -64;
        var y = parseInt(e.clientY+ document.querySelector("#screen").scrollTop) -64;
        // 弹出显示坐标
        rpc(type||"sendElectronClick",{
            win_id:1,
            x,y
        }).finally(()=>{
            //location.reload()
        })
    }
    const onMouseMoveImage = (e)=>{
        e.preventDefault();
        // 获取鼠标相对于图片的坐标
        var x = parseInt(e.clientX + document.querySelector("#screen").scrollLeft) -64;
        var y = parseInt(e.clientY+ document.querySelector("#screen").scrollTop) -64;
        document.querySelector("#position").textContent= `x::${y},y:${y}`
    }

    return (
        <div className="flex flex-col h-full">
            <View w100vw h100vh  xx0 yy0 fixed>
                <View abs xx0 top0 h={64} rowVCenter>
                    <div className="p-2 border-b border-border flex gap-2 items-center bg-card">
                        <button className="btn btn-icon" onClick={onBack} title="Back">
                            <IconArrowLeft />
                        </button>
                        <div className="flex-1 flex gap-2">
                            <input
                                style={{ width: "600px" }}
                                className="input flex-1 font-mono text-sm"
                                value={navUrl}
                                onChange={e => setNavUrl(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleNavigate()}
                            />
                            <button className="btn" onClick={handleNavigate}>Go</button>
                        </div>

                    </div>
                </View>
                <View absFull top={64} right={320} overflowXAuto overflowYAuto id={"screen"}>
                    {
                        screenshotUrl && <img
                            onMouseMove={((e)=>onMouseMoveImage(e))}
                            onClick={(e)=>{
                                onClickImage(e,"sendElectronClick")
                            }}
                            src={screenshotUrl} alt=""/>
                    }
                    {
                        !screenshotUrl && <View wh100p center>Loading...</View>
                    }

                </View>
                <View abs top={64} right0 bottom0 w={320}  >
                    <View rowVCenter mb12>
                        <View id={"bound"}></View>
                    </View>
                    <View rowVCenter mb12>
                        <View id={"position"}></View>
                    </View>
                    <View rowVCenter jStart>
                        <button className="btn btn-sm" onClick={async () => {
                            await rpc('showWindow', { win_id: windowId });
                        }} title="Active Window">
                            Active
                        </button>
                        <button className="btn btn-sm" onClick={async () => {
                            if(!confirm("close?")){
                                return;
                            }
                            await rpc('closeWindow', { win_id: windowId });
                        }} title="Close Window">
                            Close
                        </button>
                        <button className="btn btn-sm" onClick={async () => {
                            await rpc('hideWindow', { win_id: windowId });
                        }} title="Hide Window">
                            Hide
                        </button>
                        {/*<button className="btn btn-icon" onClick={handleReload} title="Reload Page">*/}
                        {/*    <IconRefresh />*/}
                        {/*</button>*/}
                        <button className="btn btn-sm" onClick={async () => {
                            await rpc('executeJavaScript', { win_id: windowId, code: 'location.reload()' });
                        }} title="Reload via JavaScript">
                            Reload
                        </button>
                    </View>
                </View>

            </View>
        </div>
    );
};
