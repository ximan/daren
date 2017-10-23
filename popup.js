var textarea = document.querySelector('textarea');
var msg = document.querySelector('#msg');

// 取 storage
chrome.storage.sync.get(['keyword'],function(item){
    console.log('item',item);
    if(!!item.keyword){
        // 存到文本框
        textarea.value = item.keyword.join('\n');
    }
});

// 点击按钮，保存
document.querySelector('#btn').onclick = function(){
    var theValue = document.querySelector('textarea').value;
    var keyword = theValue.split('\n');
    // 发送关键字，给后台存
    chrome.runtime.sendMessage({setKeyword: keyword}, function(response){  
        msg.innerText = '设置已保存，请刷新页面';
    });
};