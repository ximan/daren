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
chrome.runtime.sendMessage('getKeyword', function(response) {
    // console.log('页面收到',response);
    // 返回数组有内容，才做循环
    if(!!response && response.length > 0){
        [].forEach.call(document.querySelectorAll('tr'), function(item) {
            response.forEach(function(key){
                if(item.innerHTML.indexOf(key) > -1){
                    var re = new RegExp('('+key+')', 'g');
                    item.innerHTML = item.innerHTML.replace(re, '<span style="font-size:120%;color:red;text-shadow:1px 1px #000;">$1</span>');
                }
            });
        });
    }
});