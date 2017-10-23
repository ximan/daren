// 支持的网址
var supportURL = [
    "http://*.imagetwist.com/*",
    "http://*.imgchili.net/*",
    "http://*.dmm.co.jp/*",
    "http://yapdd.com/*",
    "http://img588.net/*"
];
// 打开图片
function openImage(info, tab) {
    // 当前图片的src
    var link = info.srcUrl;
    // 根据图片网址替换规则
    if(/imagetwist.com/.test(link)){
        link = link.replace(/\/th\//,'/i/');
    }else if(/imgchili.net/.test(link)){
        link = link.replace(/:\/\/t/,'://i').replace(/(_\d+).jpg$/,'$1.jpeg');
    }else if(/dmm.co.jp/.test(link)){
        link = link.replace(/-/,'jp-');
    }else if(/yapdd.com/.test(link)){
        link = link.replace(/thumbs\//,'').replace(/.md.jpg$/,'.jpeg');
    }else if(/img588.net/.test(link)){
        link = link.replace(/.th.jpg$/,'.jpg');
    }else{
        alert('图片打开出错');
        return;
    }
    // 新tab打开图片
    chrome.tabs.create({
        "url": link,
        // 当前页下一个页面打开
        "index": tab.index+1,
        "selected": true
    });
    // js打开
    // window.open(info.srcUrl);
    
    
}
// 右键菜单
var images = chrome.contextMenus.create({
    "title": "查看原图",
    // 在image上点击右键才出现
    "contexts": ["image"],
    // 匹配此规则的image src
    "targetUrlPatterns": supportURL,
    "onclick": openImage
}); 

/*
特别注意：background.js只会在插件更新时加载一次，页面刷新不会执行。所以下面代码只会执行一次。
所以监听storage改变时，要重新赋值
 */
var arrKeyword = [];
// 读取 storage，赋值到arrKeyword
chrome.storage.sync.get(['keyword'],function(item){
    if(!!item.keyword){
        arrKeyword = item.keyword;
    }
});
// 接收
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(!!response.setKeyword){
        // 如果关键字为空，删除
        if(response.setKeyword.length === 1 && response.setKeyword[0] === ''){
            chrome.storage.sync.remove("keyword", function(){
                console.log('删除keyword成功');
            });
        // 存popup里的keyword到storage
        }else{
            chrome.storage.sync.set({
                'keyword': response.setKeyword
            },function(){
                console.log("保存storage完毕");
            });
        }
    }
    if(response == 'getKeyword'){
        // 传到contentscript.js
        sendResponse(arrKeyword);
    }
}); 

// 监听 storage 改变
chrome.storage.onChanged.addListener(function(changes, namespace) {
    // 赋值上面sendResponse 传到contentscript.js
    arrKeyword = changes.keyword.newValue;
});