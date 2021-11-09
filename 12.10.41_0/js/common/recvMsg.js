 (function () {
    'use strict';    
    
    //接收popup&background的消息
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
    {
        //console.log(sender.tab ? `from a content script: ${sender.tab.url}` : "from the extension");
        if (request.config && typeof request.config === 'object') {
            Object.assign(Config67373, request.config);
            Dy67373.sendConfig(request.config);
        }
    });

    //接收inject js的消息
    window.addEventListener("message", function (e) {
        if (e.data && e.data.target === Dy67373.msgTargets[0]) {
            if (typeof e.data.rid === "number" && e.data.rid > 0) { 
                Data67373.roomId = e.data.rid;
                refreshInfo();
            } else if (typeof e.data.picked === "number" && e.data.picked > 0) {
                chrome.runtime.sendMessage({ picked: e.data.picked });
            } else if (typeof e.data.ttvLogin === "string") {
                //console.log(`ttvLogin: ${e.data.ttvLogin}`);
                Data67373.ttvLogin = e.data.ttvLogin;
            }
        }        
    }, false);

    //通过background调用api获取房间信息
    function refreshInfo () {
        chrome.runtime.sendMessage({
            rid: Data67373.roomId
        }, function (response) {
            if (response) {
                if (response.status) {
                    //console.log(response.status, response.title, response.cate);
                    if (response.title) {
                        let $title = $(Dy67373.roomTitle);
                        if ($title.length && $title.text() !== response.title) {
                            $title.text(response.title);
                            $title.attr('title', response.title);
                        }
                    }
                    window.postMessage(Object.assign({
                        status: Number(response.status)
                    }, Dy67373.msgData[0]), '*');
                } else if (response.error) {
                    console.log(`refresh error: ${response.error}`);
                }
            }
            wait(40000).then(refreshInfo);
        });
    }
})();    