const baseUrl = "http://127.0.0.1:3456"
// const baseUrl = "https://win-electron-3456.cicy.de5.net"

const post_rpc = async ({method,params})=>{
  console.log("post_rpc",method,params)
  const res = await fetch(`${baseUrl}/rpc`,{
    method:"POST",
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify({method,params})
  })
  return res.json()
}

function openWindow(url,options,others){
  return  post_rpc({
    method:"openWindow",
    params:{
      url,
      options:{
        width:1024,
        height:768,
        ...options,
        webPreferences: {
          webviewTag: true,
          // nodeIntegration: true,
          // contextIsolation: false,
          ...options?.webPreferences
        }

      },
      others:{
        // openDevtools:{mode:"right"},
        // userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        ...others
      }
    }
  })
}
chrome.runtime.onInstalled.addListener(() => {

  chrome.contextMenus.create({
    id: "copy-domain-cookies",
    title: "Copy cookies for this domain",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: "open-in-electron",
    title: "Open in Electron",
    contexts: ["all"]
  });
});

const openInElectron = async (tab)=>{
  console.log("openInElectron",tab.url)
  const url = tab.url
  const uri = new URL(url);
  const domain = uri.hostname;
  const cookies = await chrome.cookies.getAll({ domain });
  console.log("openInElectron",domain,cookies)
  openWindow(url,{},{
    cookies,
    // proxy:"http://localhost:7897"
  })
}

const copyCookies = async (tab)=>{
  console.log("copyCookies",tab.url)
  const uri = new URL(tab.url);
  const domain = uri.hostname;
  const cookies = await chrome.cookies.getAll({ domain });
  chrome.tabs.sendMessage(tab.id, {
    type: "copy-domain-cookies",
    payload: cookies,
    domain
  });
}
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("contextMenus clicked",info)
  if (info.menuItemId === "open-in-electron") {
    openInElectron(tab)
  }
  if (info.menuItemId === "copy-domain-cookies") {
    copyCookies(tab)
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  const tab = await chrome.tabs.get(sender.tab.id);
  console.log("onMessage",message)

  if (message.type === "copy-domain-cookies"){
    copyCookies(tab)
  }
  if (message.type === "open-in-electron"){
    openInElectron(tab)
  }
});