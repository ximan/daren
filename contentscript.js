// 删除 91 iframe广告
var iframes = document.querySelectorAll('iframe');
if(iframes.length > 0){
    for(var i=0; i<iframes.length; i++){
        iframes[i].parentNode.removeChild(iframes[i]);
    }
}

// 删除 蝌蚪窝 广告
var noindexs = document.querySelectorAll('noindex');
if(noindexs.length > 0){
    for(var i=0; i<noindexs.length; i++){
        noindexs[i].parentNode.removeChild(noindexs[i]);
    }
}