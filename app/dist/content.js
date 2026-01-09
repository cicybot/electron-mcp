var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    var ELECTRON_BASE_API_URL = "http://127.0.0.1:3456";
    var AI_BASE_API_URL = "https://api.cicy.de5.net";
    var post_rpc = async ({ method, params }) => {
      const res = await fetch(`${ELECTRON_BASE_API_URL}/rpc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ method, params })
      });
      return res.json();
    };
    function openWindow(url, options, others) {
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
      const { result } = await executeJavaScript2(`
const ele = document.querySelector("${sel}")
const {width,height,top,left} = ele.getBoundingClientRect()
return {
    width,height,top,left
}
    `, win_id);
      return result;
    };
    var executeJavaScript2 = async (code, win_id) => {
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
    var clearRequests2 = async (win_id) => {
      return post_rpc({
        method: "clearRequests",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var getWindowState2 = async (win_id) => {
      return post_rpc({
        method: "getWindowState",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var getRequests2 = async (win_id) => {
      return post_rpc({
        method: "getRequests",
        params: {
          win_id: win_id || 1
        }
      });
    };
    var downloadMedia2 = async (params, win_id) => {
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
    function waitForResult2(cb, timeout = -1, interval = 100) {
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
      chatgptAsk,
      sendKey,
      downloadMedia: downloadMedia2,
      getWindowState: getWindowState2,
      getHtmlPageInfo,
      waitForResult: waitForResult2,
      getRequests: getRequests2,
      clearRequests: clearRequests2,
      executeJavaScript: executeJavaScript2,
      post_rpc,
      MapArray,
      importCookies,
      openWindow,
      loadURL,
      getElementRect,
      sendInputEvent,
      simulateClick,
      getSubTitles
    };
  }
});

// src/utils-browser.js
var require_utils_browser = __commonJS({
  "src/utils-browser.js"(exports2, module2) {
    var Storage2 = class {
      static get(key) {
        const res = localStorage.getItem("cicy_" + key);
        if (res) {
          return JSON.parse(res)[0];
        } else {
          null;
        }
      }
      static set(key, value) {
        localStorage.setItem("cicy_" + key, JSON.stringify([value]));
      }
    };
    var RECT_ID = "__rect";
    function showRect2({ width, height, left, top }, timeout) {
      const existing = document.getElementById(RECT_ID);
      if (existing) existing.remove();
      if (!timeout) {
        timeout = 2;
      }
      const div = document.createElement("div");
      div.id = RECT_ID;
      div.style.cssText = `
    position: fixed;
    width: ${width}px;
    height: ${height}px;
    top: ${top}px;
    left: ${left}px;
    padding: 10px 20px;
    background: #ff4444;
    color: white;
    border-radius: 4px;
    z-index: 2147483647;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;
      document.body.appendChild(div);
      setTimeout(() => {
        div.style.opacity = "0";
        setTimeout(() => div.remove(), 300);
      }, timeout * 1e3);
    }
    function __getChats(chat) {
      const { id, messages, title, updateTime } = chat;
      const rows = [];
      for (let i = 0; i < messages.length; i++) {
        const { text } = messages[i];
        rows.push(text);
      }
      rows.reverse();
      let reply = null;
      if (rows.length > 0) {
        reply = rows[0];
      }
      return {
        id,
        title,
        reply,
        updateTime,
        messages: rows
      };
    }
    async function getChatGptChats2() {
      const db = window._G.useIndexedDB("ConversationsDatabase", "conversations");
      const allItems = await db.getAllItems();
      console.log("allItems", allItems);
      if (allItems.length === 0) {
        return null;
      }
      allItems.reverse();
      return __getChats(allItems[0]);
    }
    function cleanNode2(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        while (node.attributes.length > 0) {
          node.removeAttribute(node.attributes[0].name);
        }
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          cleanNode2(node.childNodes[i]);
        }
        if (node.childNodes.length === 0 || [...node.childNodes].every(
          (n) => n.nodeType === Node.TEXT_NODE && !n.textContent.trim()
        )) {
          node.remove();
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const cleanedText = node.textContent.replace(/\s+/g, " ").trim();
        if (!cleanedText) {
          node.remove();
        } else {
          node.textContent = cleanedText;
        }
      }
    }
    function getCleanHtml2(ele) {
      let doc = ele.cloneNode(true);
      const uselessTags = [
        "script",
        "style",
        "link",
        "img",
        "video",
        "audio",
        "iframe",
        "svg",
        "noscript",
        "canvas"
      ];
      uselessTags.forEach((tag) => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach((el) => el.remove());
      });
      cleanNode2(doc);
      return doc.outerHTML;
    }
    function regxHTML(html) {
      return html.replace(/<!--[\s\S]*?-->/g, "").replace(/span/g, "").replace(/<>/g, "").replace(/<\/>/g, "").trim();
    }
    function regxHTML1(html) {
      let t = html.replace(/span/g, "div").trim();
      while (t.indexOf("<div><div>") > -1) {
        t = t.replace(/<div><div>/g, "<div>");
      }
      while (t.indexOf("</div></div>") > -1) {
        t = t.replace(/<\/div><\/div>/g, "</div>");
      }
      return t;
    }
    module2.exports = { regxHTML1, regxHTML, cleanNode: cleanNode2, getCleanHtml: getCleanHtml2, showRect: showRect2, getChatGptChats: getChatGptChats2, Storage: Storage2 };
  }
});

// src/playground/douyin.js
var require_douyin = __commonJS({
  "src/playground/douyin.js"(exports2, module2) {
    var utils2 = require_utils();
    var { getRequests: getRequests2, chatgptAsk } = require_utils();
    var { Storage: Storage2, getCleanHtml: getCleanHtml2, regxHTML1 } = require_utils_browser();
    function parseMeta() {
      const metas = document.querySelectorAll('meta[data-rh="true"]');
      const result = {};
      metas.forEach((meta) => {
        const name = meta.getAttribute("name");
        const content = meta.getAttribute("content");
        if (name && content) {
          result[name] = content;
        }
      });
      return result;
    }
    async function parseHtml() {
      const metaData = parseMeta();
      const { description, keywords } = metaData;
      const video_cover_image_url = metaData["lark:url:video_cover_image_url"];
      const video_title = metaData["lark:url:video_title"];
      let videoInfoHtml = "";
      const ele = document.querySelector(".bm6Yr1Fm");
      if (ele) {
        videoInfoHtml = getCleanHtml2(ele);
      }
      let authorInfoHtml = "";
      const ele1 = document.querySelector(".cHwSTMd3");
      if (ele1) {
        authorInfoHtml = getCleanHtml2(ele1);
      }
      const ele2 = document.querySelector(".comment-mainContent");
      let commentsHtml = "";
      if (ele2) {
        commentsHtml = regxHTML1(getCleanHtml2(ele2));
      }
      const url = location.href;
      const videoId = url.replace("https://www.douyin.com/video/", "");
      const prompt = `
\u4F60\u662F\u4E00\u4E2A\u201CJSON \u89E3\u6790\u5668\u201D\uFF0C\u4E0D\u662F\u804A\u5929\u52A9\u624B\u3002

\u3010\u5F3A\u5236\u8F93\u51FA\u89C4\u5219\u3011
1. \u4F60\u7684\u56DE\u590D\u3010\u53EA\u80FD\u3011\u662F\u4E00\u4E2A\u5408\u6CD5\u7684 JSON \u5BF9\u8C61
2. \u4E0D\u5141\u8BB8\u51FA\u73B0 Markdown\u3001\`\`\`\u3001\u8BF4\u660E\u6587\u5B57\u3001\u6CE8\u91CA\u3001\u89E3\u91CA\u3001\u6362\u884C\u524D\u540E\u591A\u4F59\u5B57\u7B26
3. \u4E0D\u5141\u8BB8\u51FA\u73B0\u9664 JSON \u4EE5\u5916\u7684\u4EFB\u4F55\u5185\u5BB9
4. \u6240\u6709\u5B57\u6BB5\u5FC5\u987B\u5B58\u5728
5. \u5982\u679C\u5B57\u6BB5\u5728 HTML \u4E2D\u65E0\u6CD5\u786E\u5B9A\uFF0C\u503C\u5FC5\u987B\u4E3A null
6. \u5B57\u6BB5\u7C7B\u578B\u5FC5\u987B\u4E25\u683C\u9075\u5B88\u4E0B\u9762\u5B9A\u4E49
7. \u8F93\u51FA\u4E0D\u7B26\u5408\u4EE5\u4E0A\u4EFB\u4E00\u89C4\u5219\u5373\u4E3A\u9519\u8BEF

\u3010JSON \u7ED3\u6784\u5B9A\u4E49\u3011
{
  
  "author":{
      "name":  string | null,//author name
      "fansCount": number | string | null,//vlog \u7C89\u4E1D\u6570
      "likeTotalCount": number | string | null,//vlog \u603B\u83B7\u8D5E\u6570
  },
  "video":{
      "publishDate": string | null,//video \u53D1\u5E03\u65F6\u95F4
      "likeCount": number | string | null,//video \u70B9\u8D5E\u6570
      "commentCount": number | null,//video \u8BC4\u8BBA\u6570
      "favorCount": number | null,//video \u6536\u85CF\u6570
      "forwardCount": number | null,//video \u8F6C\u53D1\u6570
  },
  "comments": [//\u8BC4\u8BBA\u5217\u8868
    {
      "user": string,
      "text": string,
      "time": string | null
    }
  ]
}

\u3010\u4EFB\u52A1\u3011
\u4ECE\u4E0B\u9762 HTML \u4E2D\u62BD\u53D6\u4FE1\u606F\uFF0C\u5E76\u4E25\u683C\u6309\u4E0A\u8FF0 JSON \u7ED3\u6784\u8F93\u51FA\u3002

\u3010HTML\u3011
\u4F5C\u8005html\u7247\u6BB5
${authorInfoHtml}

\u89C6\u9891html\u7247\u6BB5
${videoInfoHtml}

\u8BC4\u8BBAhtml\u7247\u6BB5
${commentsHtml}
`;
      let aiParseInfo = null;
      try {
        const res1 = await chatgptAsk(prompt);
        if (res1 && res1.length > 0) {
          aiParseInfo = JSON.parse(res1[0].text);
        }
      } catch (e) {
        console.log(e);
      }
      const res = {
        time: Date.now(),
        id: videoId,
        url,
        aiParseInfo,
        page: {
          title: document.title,
          description,
          keywords
        },
        html: {
          videoInfo: videoInfoHtml,
          authorInfo: authorInfoHtml,
          comments: commentsHtml
        },
        video: {
          title: video_title,
          thumb: video_cover_image_url
        }
      };
      Storage2.set("_video_" + videoId, res);
      return res;
    }
    var main2 = async ({ win_id }) => {
      parseHtml();
      const { waitForResult: waitForResult2, getSubTitles, downloadMedia: downloadMedia2 } = utils2;
      const video = await waitForResult2(async () => {
        const res = await getRequests2(win_id);
        const { result } = res;
        const row = result.find((row2) => row2.url.indexOf("__vid") > -1);
        if (row) {
          return row;
        } else {
          return false;
        }
      }, -1, 1e3);
      if (video) {
        const { url: mediaUrl } = video;
        d("got mediaUrl:", mediaUrl);
        const videoId = location.href.replace("https://www.douyin.com/video/", "");
        const downloadMediaRes = await downloadMedia2({
          mediaUrl,
          id: videoId,
          basePath: "douyin",
          genSubtitles: false
        }, win_id);
        const { result } = downloadMediaRes;
        const { audioPath } = result;
        d("audioPath", audioPath);
      } else {
        d("[ERR] fetch error video:");
      }
    };
    module2.exports = { main: main2 };
  }
});

// src/content-inject.js
var utils = require_utils();
var { clearRequests, waitForResult, getWindowState, executeJavaScript, getRequests, downloadMedia } = require_utils();
var { Storage, cleanNode, getCleanHtml, getChatGptChats, showRect } = require_utils_browser();
var { main } = require_douyin();
window.__test = async () => {
  main({ win_id: window.__win_id });
};
(() => {
  const utils = require_utils();
  window.showRect = showRect;
  window.__preload = async ({ win_id }) => {
    window.l = () => {
      executeJavaScript("__test()", win_id);
    };
    window.addEventListener("keydown", async (e) => {
      const cmdKeyPressed = (k) => {
        return (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === k;
      };
      if (cmdKeyPressed("\\")) {
        e.preventDefault();
        console.log(e.key);
      }
    }, true);
    d("__preload", { win_id });
  };
  const d = (...args) => {
    console.debug("[CICY]", ...args);
  };
  window.d = d;
  window.utils = utils;
  function useIndexedDB(dbName, storeName) {
    return {
      openDB: function() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName);
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            }
          };
          request.onsuccess = (event) => resolve(event.target.result);
          request.onerror = (event) => reject(event.target.error);
        });
      },
      addItem: async function(item) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          const request = store.add(item);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      },
      getItem: async function(id) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      },
      getAllItems: async function() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, "readonly");
          const store = tx.objectStore(storeName);
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
    };
  }
  const getHtml = () => {
    return document.documentElement.outerHTML;
  };
  const getBodyText = () => {
    let { textContent } = document.body;
    return textContent.replace(/\s/g, "").trim();
  };
  const getLinks = () => {
    const links = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      url: a.getAttribute("href"),
      a: a.innerText.trim()
    })).filter(
      (item) => item.url && item.url.trim() !== "" && item.url.trim() !== "undefined"
    );
    return links;
  };
  const setAutoRunJs = (code) => {
    localStorage.setItem("__AutoRunJs", code);
  };
  const getTitle = () => {
    return document.title;
  };
  const init = () => {
    if (window.__preload) {
      window.__preload({ win_id: window.__win_id });
    }
    const autoRunJs = localStorage.getItem("__AutoRunJs");
    if (autoRunJs) {
      d("autoRunJs");
      eval(atob(autoRunJs));
    }
  };
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
    v: 1
  };
})();
//# sourceMappingURL=content.js.map
