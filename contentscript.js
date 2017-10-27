// 删除 91 iframe广告
// var iframes = document.querySelectorAll('iframe');
// if(iframes.length > 0){
//     for(var i=0; i<iframes.length; i++){
//         iframes[i].parentNode.removeChild(iframes[i]);
//     }
// }

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