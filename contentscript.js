// 删除 蝌蚪窝 广告
var noindexs = document.querySelectorAll('noindex');
if(noindexs.length > 0){
    for(var i=0; i<noindexs.length; i++){
        noindexs[i].parentNode.removeChild(noindexs[i]);
    }
}

// 发送信息，索要关键字
chrome.runtime.sendMessage({getKeyword: 'getKeyword'}, function(response) {
    if(!response){
        return false;
    }

    // 高亮关键字
    if('keyword' in response && response.keyword.length > 0){
        [].forEach.call(document.querySelectorAll('tr'), function(item) {
            response.keyword.forEach(function(key){
                if(item.innerHTML.indexOf(key) > -1){
                    var re = new RegExp('('+key+')', 'g');
                    item.innerHTML = item.innerHTML.replace(re, '<span style="font-size:120%;color:red;text-shadow:1px 1px #000;">$1</span>');
                }
            });
        });
    }
    // 删除iframe广告
    if('disabledIframe' in response && response.disabledIframe){
        function removeIframe(){
            [].forEach.call(document.querySelectorAll('iframe'), function(item) {
                item.parentNode.removeChild(item);
            });
        }
        removeIframe();
        setInterval(removeIframe,10000);
    }
});

// 接收视频url
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if('setVideoUrl' in response){
        var fixedVideo = document.createElement('div');
        fixedVideo.id = 'darenFixedVideo';
        fixedVideo.setAttribute('style', 'position:fixed;left:0;top:0;z-index:999999;width:100%;height:100%;background-color:rgba(0,0,0,0.6);');
        fixedVideo.innerHTML = '<video src="'+response.setVideoUrl+'" controls autoplay style="position:fixed;left:50%;top:50%;width:600px;height:500px;background-color:#000;transform:translate(-50%,-50%);"></video>'
        document.body.appendChild(fixedVideo);
    }
});

// 关闭视频
window.addEventListener('click',function(e){
    if(e.target.id == 'darenFixedVideo'){
        var fixedVideo = document.querySelector('#darenFixedVideo');
        fixedVideo.parentNode.removeChild(fixedVideo);
    }
},false);