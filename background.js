// 支持的网址
var supportURL = [
    "http://*.imagetwist.com/*",
    "http://*.imgchili.net/*",
    "http://*.dmm.co.jp/*"
];
// 打开图片
function openImage(info, tab) {
    // 当前图片的src
    var link = info.srcUrl;
    // 根据图片网址替换规则
    if(/imagetwist.com/.test(link)){
        link = link.replace(/\/th\//,'/i/');
    }else if(/imgchili.net/.test(link)){
        link = link.replace(/:\/\/t/,'://i');
    }else if(/dmm.co.jp/.test(link)){
        link = link.replace(/-/,'jp-');
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