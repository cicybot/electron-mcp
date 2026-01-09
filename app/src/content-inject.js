const utils = require("./utils");
const {clearRequests, waitForResult, getWindowState,executeJavaScript, getRequests, downloadMedia} = require("./utils");
const {Storage,cleanNode,getCleanHtml,getChatGptChats,showRect} = require("./utils-browser");
const {main} = require("./playground/douyin");

window.__test = async ()=>{
    main({win_id:window.__win_id})
}
(()=>{
    const utils = require("./utils")
    window.showRect = showRect
    window.__preload = async ({win_id})=>{
        window.l = ()=>{
            executeJavaScript("__test()",win_id)
        }
        window.addEventListener('keydown', async (e) => {
            const cmdKeyPressed = (k)=>{
                return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === k
            }
            if (cmdKeyPressed("\\")) {
                e.preventDefault();
                console.log(e.key)
            }
        },true)
        d("__preload",{win_id:win_id})

    }

    const d = (...args) => {
        console.debug('[CICY]', ...args);
    };
    window.d = d;
    window.utils = utils;

    function useIndexedDB(dbName, storeName) {
        return {
            openDB: function () {
                return new Promise((resolve, reject) => {
                    // ⬇️ FIXED: removed explicit version
                    const request = indexedDB.open(dbName);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains(storeName)) {
                            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                        }
                    };

                    request.onsuccess = (event) => resolve(event.target.result);
                    request.onerror = (event) => reject(event.target.error);
                });
            },

            addItem: async function (item) {
                const db = await this.openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(storeName, 'readwrite');
                    const store = tx.objectStore(storeName);
                    const request = store.add(item);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            getItem: async function (id) {
                const db = await this.openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(storeName, 'readonly');
                    const store = tx.objectStore(storeName);
                    const request = store.get(id);

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            },

            getAllItems: async function () {
                const db = await this.openDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(storeName, 'readonly');
                    const store = tx.objectStore(storeName);
                    const request = store.getAll();

                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            }
        };
    }
    const getHtml= ()=>{
        return document.documentElement.outerHTML
    }
    const getBodyText= ()=>{
        let {textContent} =  document.body

        return textContent
            // 删除注释
            .replace(/\s/g, "")
            .trim();
    }
    const getLinks = ()=>{
        const links = Array.from(document.querySelectorAll('a[href]'))
            .map(a => ({
                url: a.getAttribute('href'),
                a: a.innerText.trim()
            }))
            .filter(item =>
                item.url &&
                item.url.trim() !== '' &&
                item.url.trim() !== 'undefined'
            );
        return links
    }
    const setAutoRunJs = (code)=>{
        localStorage.setItem("__AutoRunJs",code)
    }
    const getTitle = ()=>{
        return document.title
    }
    const init = ()=>{
        if(window.__preload){
            window.__preload({win_id:window.__win_id})
        }
        const autoRunJs = localStorage.getItem("__AutoRunJs")
        if(autoRunJs){
            d("autoRunJs")
            eval(atob(autoRunJs))
        }
    }
    window.G = window._G = {
        d,
        init,
        setAutoRunJs,
        getLinks,
        getHtml,
        getTitle,
        getBodyText,
        getCleanHtml,
        useIndexedDB,
        getChatGptChats,
        v:1
    }
})()