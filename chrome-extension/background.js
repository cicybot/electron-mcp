var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var ELECTRON_BASE_API_URL = "http://127.0.0.1:3456";
    var AI_BASE_API_URL = "https://api.cicy.de5.net";
    function setBaseApi(url) {
      ELECTRON_BASE_API_URL = url;
    }
    function getBaseApi() {
      return ELECTRON_BASE_API_URL;
    }
    var post_rpc = async ({ method, params }) => {
      const url = `${getBaseApi()}/rpc`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ method, params })
      });
      console.log(res.status);
      return res.json();
    };
    function openWindow2(url, options, others) {
      console.log(url);
      return post_rpc({
        method: "openWindow",
        params: {
          url,
          options: {
            width: 1024,
            height: 768,
            ...options,
            webPreferences: {
              ...options?.webPreferences
            }
          },
          others
        }
      });
    }
    var loadURL = async (url, win_id) => {
      return post_rpc({
        method: "loadURL",
        params: {
          win_id: win_id || 1,
          url
        }
      });
    };
    var sendInputEvent = async (inputEvent, win_id) => {
      return post_rpc({
        method: "sendInputEvent",
        params: {
          win_id: win_id || 1,
          inputEvent
        }
      });
    };
    async function simulateClick(x, y, win_id) {
      await sendInputEvent({
        type: "mouseDown",
        x,
        y,
        button: "left",
        clickCount: 1
      }, win_id);
      setTimeout(() => {
        sendInputEvent({
          type: "mouseUp",
          x,
          y,
          button: "left",
          clickCount: 1
        }, win_id);
      }, 50);
    }
    async function sendKey(key, win_id) {
      await sendInputEvent({ type: "keyDown", keyCode: key }, win_id);
      setTimeout(() => {
        sendInputEvent({ type: "keyUp", keyCode: key }, win_id);
      }, 50);
    }
    var getElementRect = async (sel, win_id) => {
      const { result } = await executeJavaScript(`
const ele = document.querySelector("${sel}")
const {width,height,top,left} = ele.getBoundingClientRect()
return {
    width,height,top,left
}
    `, win_id);
      return result;
    };
    var executeJavaScript = async (code, win_id) => {
      return post_rpc({
        method: "executeJavaScript",
        params: {
          win_id: win_id || 1,
          code
        }
      });
    };
    var importCookies = async (cookies, win_id) => {
      return post_rpc({
        method: "importCookies",
        params: {
          win_id: win_id || 1,
          cookies
        }
      });
    };
    var getHtmlPageInfo = async (win_id) => {
      const code = `
(async ()=>{
  const {getCleanHtml,getTitle} = window._G;
  const cleanHtml = getCleanHtml();
      
  return {
    t:Date.now(),
    title:document.title,
    url:location.href,
    html:cleanHtml,
  }
})()
    
    
    `;
      return post_rpc({
        method: "executeJavaScript",
        params: {
          win_id: win_id || 1,
          code
        }
      });
    };
    var clearRequests = async (win_id) => {
      return post_rpc({
        method: "clearRequests",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var getWindowState = async (win_id) => {
      return post_rpc({
        method: "getWindowState",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var getRequests = async (win_id) => {
      return post_rpc({
        method: "getRequests",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var downloadMedia = async (params, win_id) => {
      return post_rpc({
        method: "downloadMedia",
        params: {
          win_id: win_id || 1,
          ...params
        }
      });
    };
    var getSubTitles = async ({ mediaPath }, win_id) => {
      return post_rpc({
        method: "getSubTitles",
        params: {
          win_id: win_id || 1,
          mediaPath
        }
      });
    };
    function waitForResult(cb, timeout = -1, interval = 100) {
      const startTime = Date.now();
      return new Promise((resolve) => {
        const checkReply = async () => {
          try {
            const res = await Promise.resolve(cb());
            if (res) {
              resolve(res);
              return;
            }
            if (timeout > -1 && Date.now() - startTime > timeout) {
              resolve({ err: "ERR_TIMEOUT" });
              return;
            }
            setTimeout(checkReply, interval);
          } catch (error) {
            console.error("Error in waitForResult callback:", error);
            resolve({ err: `ERR:${error}` });
          }
        };
        checkReply();
      });
    }
    async function chatgptAsk(prompt) {
      try {
        const response = await fetch(`${AI_BASE_API_URL}/chatgpt/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: prompt
          })
        });
        const result = await response.json();
        console.log("Full API response:", result);
        const messageItem = result.output.find((item) => item.type === "message");
        if (!messageItem) return { ok: false, error: "No message in response" };
        console.log("Output text:", messageItem.content);
        return messageItem.content;
      } catch (e) {
        console.error(e);
        return { ok: false };
      }
    }
    var __MapArray = /* @__PURE__ */ new Map();
    var MapArray = class {
      constructor(id) {
        this.id = id;
      }
      all() {
        let rows = [];
        if (!__MapArray.has(this.id)) {
          __MapArray.set(this.id, []);
        } else {
          rows = __MapArray.get(this.id);
        }
        return rows;
      }
      push(entity) {
        let rows = this.all();
        rows.push(entity);
        __MapArray.set(this.id, rows);
      }
      clear() {
        __MapArray.set(this.id, []);
      }
    };
    module2.exports = {
      setBaseApi,
      getBaseApi,
      chatgptAsk,
      sendKey,
      downloadMedia,
      getWindowState,
      getHtmlPageInfo,
      waitForResult,
      getRequests,
      clearRequests,
      executeJavaScript,
      post_rpc,
      MapArray,
      importCookies,
      openWindow: openWindow2,
      loadURL,
      getElementRect,
      sendInputEvent,
      simulateClick,
      getSubTitles
    };
  }
});

// src/extension/background.js
var { openWindow } = require_utils();
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-in-electron",
    title: "Open in Electron",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "toggleDiv",
    title: "Toggle Div",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "copy-domain-cookies",
    title: "Copy cookies for this domain",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "copyTgAuth",
    title: "Copy Tg Auth",
    contexts: ["all"],
    documentUrlPatterns: ["https://web.telegram.org/*"]
  });
});
var openInElectron = async (tab) => {
  console.log("openInElectron", tab.url);
  const url = tab.url;
  const uri = new URL(url);
  const domain = uri.hostname;
  const cookies = await chrome.cookies.getAll({ domain });
  console.log("openInElectron", domain, cookies);
  openWindow(url, {
    width: 1460
  }, {
    cookies,
    showWin: true,
    openDevtools: { mode: "right" }
  });
};
var copyCookies = async (tab) => {
  console.log("copyCookies", tab.url);
  const uri = new URL(tab.url);
  const domain = uri.hostname;
  const cookies = await chrome.cookies.getAll({ domain });
  chrome.tabs.sendMessage(tab.id, {
    type: "copy-domain-cookies",
    payload: cookies,
    domain
  });
};
var toggleDiv = async (tab) => {
  console.log("toggleDiv", tab.url);
  chrome.tabs.sendMessage(tab.id, {
    type: "toggleDiv"
  });
};
var copyTgAuth = async (tab) => {
  console.log("copyTgAuth", tab.url);
  chrome.tabs.sendMessage(tab.id, {
    type: "copyTgAuth"
  });
};
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("contextMenus clicked", info);
  if (info.menuItemId === "open-in-electron") {
    openInElectron(tab);
  }
  if (info.menuItemId === "toggleDiv") {
    toggleDiv(tab);
  }
  if (info.menuItemId === "copy-domain-cookies") {
    copyCookies(tab);
  }
  if (info.menuItemId === "copyTgAuth") {
    copyTgAuth(tab);
  }
});
chrome.runtime.onMessage.addListener(async (message, sender) => {
  const tab = await chrome.tabs.get(sender.tab.id);
  console.log("onMessage", message);
  if (message.type === "copy-domain-cookies") {
    copyCookies(tab);
  }
  if (message.type === "open-in-electron") {
    openInElectron(tab);
  }
});
//# sourceMappingURL=background.js.map
