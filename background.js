// 支持图片的网址
var supportImageURL = [
    "http://*.imagetwist.com/*",
    "http://*.imgchili.net/*",
    "http://*.dmm.co.jp/*",
    "http://yapdd.com/*",
    "http://img588.net/*",
    "http://*.t6k.co/*"
];
// 支持视频的网址
var supportVideoURL = [
    "http://*.t6k.co/*"
];
// 右键菜单-查看原图
chrome.contextMenus.create({
    "title": "🌅查看原图",
    // 在image上点击右键才出现
    "contexts": ["image"],
    // 匹配此规则的image src
    "targetUrlPatterns": supportImageURL,
    "onclick": openImage
});
// 右键菜单-打开视频
chrome.contextMenus.create({
    "title": "🎬播放视频",
    // 在image上点击右键才出现
    "contexts": ["image"],
    // 匹配此规则的image src
    "targetUrlPatterns": supportVideoURL,
    "onclick": openVideo
});
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
    }else if(/t6k.co/.test(link)){
        link = link.replace(/(thumb\/)\d_/, '$1');
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
}
// 打开视频
function openVideo(info, tab){
    // 当前图片url
    var picUrl = info.srcUrl;
    var id = 0;
    picUrl.replace(/\d_(\d+)\.jpg/, function($0, $1){
        id = $1;
    });
    var videoUrl = 'http://192.240.120.35//mp43/'+id+'.mp4?st=T-h-Gwn58SiFF3bWYSZmCw&e=1509012476';
    // 发送视频url给前台
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {setVideoUrl: videoUrl}, function(response) {
            console.log('发送视频url');
        });
    });
}

/*
特别注意：background.js只会在插件更新时加载一次，页面刷新不会执行。所以下面代码只会执行一次。
所以监听storage改变时，要重新赋值
 */
var objStorage = {
    keyword: [],
    disabledIframe: false
};
// 读取 storage，赋值到objStorage
chrome.storage.sync.get(['keyword', 'disabledIframe'],function(items){
    for (key in items) {
        var value = items[key];
        if(key == 'keyword'){
            objStorage.keyword = value;
        }
        if(key == 'disabledIframe'){
            objStorage.disabledIframe = value;
        }
    }
});
// 接收
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if('setKeyword' in response){
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
                console.log("keyword保存storage完毕");
            });
        }
    }
    if('setDisabledIframe' in response){
        chrome.storage.sync.set({
            'disabledIframe': response.setDisabledIframe
        },function(){
            console.log("disabledIframe保存storage完毕");
        });
    }
    if('getKeyword' in response){
        // 传到contentscript.js
        sendResponse(objStorage);
    }
}); 

// 监听 storage 改变
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var value = changes[key];
        // 赋值上面sendResponse 传到contentscript.js
        if(key == 'keyword'){
            objStorage.keyword = changes.keyword.newValue;
        }
        if(key == 'disabledIframe'){
            objStorage.disabledIframe = changes.disabledIframe.newValue;
        }
    }
});