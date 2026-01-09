
class Storage{
    static get(key){
        const res =  localStorage.getItem("cicy_"+key)
        if(res){
            return JSON.parse(res)[0]
        }else{
            null
        }
    }
    static set(key,value){
        localStorage.setItem("cicy_"+key,JSON.stringify([value]))
    }
}

const RECT_ID = "__rect"
function showRect({width,height,left,top},timeout){
    const existing = document.getElementById(RECT_ID);
    if (existing) existing.remove();
    if(!timeout){
        timeout = 2
    }

    const div = document.createElement('div');
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
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
    }, timeout * 1000);
}
function __getChats(chat){
    const {id,messages,title,updateTime} = chat
    const rows = []
    for (let i = 0; i < messages.length; i++) {
        const {text} = messages[i]
        rows.push(text)
    }
    rows.reverse()
    let reply = null
    if(rows.length > 0){
        reply = rows[0]
    }
    return {
        id,title,reply,updateTime,messages:rows
    }
}
async function getChatGptChats(){
    const db = window._G.useIndexedDB('ConversationsDatabase', 'conversations');
    const allItems = await db.getAllItems();
    console.log("allItems",allItems)
    if(allItems.length === 0){
        return null
    }
    allItems.reverse()
    return __getChats(allItems[0])
}


// 递归遍历所有节点，移除属性并清理空格，同时删除空元素
function cleanNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        // 移除所有属性
        while (node.attributes.length > 0) {
            node.removeAttribute(node.attributes[0].name);
        }

        // 递归处理子节点（从后往前遍历，方便删除）
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
            cleanNode(node.childNodes[i]);
        }

        // 如果元素没有子节点，或者所有子节点都是空文本，则删除自己
        if (
            node.childNodes.length === 0 ||
            [...node.childNodes].every(
                n => n.nodeType === Node.TEXT_NODE && !n.textContent.trim()
            )
        ) {
            node.remove();
        }

    } else if (node.nodeType === Node.TEXT_NODE) {
        // 压缩文本：去除换行和多余空格
        const cleanedText = node.textContent.replace(/\s+/g, ' ').trim();
        if (!cleanedText) {
            node.remove(); // 如果是纯空格节点则删除
        } else {
            node.textContent = cleanedText;
        }
    }
}


/**
 * 压缩 HTML 并优化嵌套空标签，同时保留内容
 * @returns {string} 压缩并优化后的 HTML
 */
function getCleanHtml(ele) {
    // 克隆文档，避免破坏页面
    let doc = ele.cloneNode(true);

    // 删除无用标签
    const uselessTags = [
        'script', 'style', 'link', 'img', 'video',
        'audio', 'iframe', 'svg', 'noscript', 'canvas'
    ];
    uselessTags.forEach(tag => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach(el => el.remove());
    });
    cleanNode(doc);
    return doc.outerHTML;
}

function regxHTML(html){
    return html
        // 删除注释
        .replace(/<!--[\s\S]*?-->/g, "")
        //</div></div> ... => </div>
        //<div><div> ... => <div>
        // .replace(/div/g, '')
        .replace(/span/g, '')
        .replace(/<>/g, '')
        .replace(/<\/>/g, '')
        .trim();
}


function regxHTML1(html){
    let t = html
        .replace(/span/g, 'div')
        .trim();

    while (t.indexOf("<div><div>")>-1){
        t = t
            .replace(/<div><div>/g, '<div>')
    }
    while (t.indexOf("</div></div>")>-1){
        t = t
            .replace(/<\/div><\/div>/g, '</div>')
    }
    return t
}



module.exports = {regxHTML1,regxHTML,cleanNode,getCleanHtml,showRect,getChatGptChats,Storage}