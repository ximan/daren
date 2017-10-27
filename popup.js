var disabledIframe = document.querySelector('#disabledIframe');
var textarea = document.querySelector('textarea');
var msg = document.querySelector('#msg');

// 取 storage
chrome.storage.sync.get(['keyword', 'disabledIframe'],function(items){
    for (key in items) {
        var value = items[key];
        if(key == 'keyword'){
            // 存到文本框
            textarea.value = value.join('\n');
        }
        if(key == 'disabledIframe'){
            // 改变checkbox
            disabledIframe.checked = value;
        }
    }
});

// 点击按钮，保存
document.querySelector('#btn').onclick = function(){
    var theValue = textarea.value;
    var disabledIframeChecked = disabledIframe.checked;
    var keyword = theValue.split('\n');
    // 发送关键字，给后台存
    chrome.runtime.sendMessage({
        setKeyword: keyword, 
        setDisabledIframe: disabledIframeChecked
    }, function(response){  
        msg.innerText = '设置已保存，请刷新页面';
    });
};