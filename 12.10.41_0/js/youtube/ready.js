'use strict';

const YtReady = {
    chatframeSelector: 'ytd-watch-flexy ytd-live-chat-frame>iframe#chatframe',
    pinnedMsgSelector: 'yt-live-chat-pinned-message-renderer#pinned-message',
    ownerSelector: 'ytd-watch-flexy ytd-channel-name#channel-name yt-formatted-string#text>a',
    frameCount: 0,
    itemsCount: 0,
    pinnedCount: 0,
    maxRetry: 600,
    chatFrameReady: () => {
        let $chatframe = document.querySelector(YtReady.chatframeSelector);
        if ($chatframe) {
            YtReady.chatDomReady();
        } else {
            //console.log(`[${Date.now()}]chatFrameReady`, YtReady.frameCount);
            ++YtReady.frameCount < YtReady.maxRetry && wait(100).then(YtReady.chatFrameReady);
        }
    },
    chatDomReady: (isLiveChat) => {
        YtReady.itemsCount = 0;
        YtReady.itemsReady(isLiveChat);
        YtReady.pinnedCount = 0;
        YtReady.pinnedMsgReady(isLiveChat);
    },
    getChatDocument: (isLiveChat) => {
        if (isLiveChat) {
            return document;
        } else {
            let $chatframe = document.querySelector(YtReady.chatframeSelector);
            return $chatframe ? $chatframe.contentDocument : null;
        }
    },
    itemsReady: (isLiveChat) => {
        let chatDocument = YtReady.getChatDocument(isLiveChat);
        if (chatDocument) {
            let $items = chatDocument.querySelector(`${YtReady.pinnedMsgSelector} + #item-list`);
            if ($items && Util67373.firstDetected($items)) {
                YtChat.monitorChat($items);
                let $owner = document.querySelector(YtReady.ownerSelector);
                if ($owner) {
                    chrome.runtime.sendMessage({
                        ready: $owner.innerText
                    });
                }
            } else {
                //console.log(`[${Date.now()}]itemsReady`, YtReady.itemsCount);
                //++YtReady.itemsCount < YtReady.maxRetry && 
                wait(100).then(YtReady.itemsReady);
            }
        }
    },    
    pinnedMsgReady: (isLiveChat) => {
        let chatDocument = YtReady.getChatDocument(isLiveChat);
        if (chatDocument) {
            let $pinnedMsg = chatDocument.querySelector(YtReady.pinnedMsgSelector);
            if ($pinnedMsg && Util67373.firstDetected($pinnedMsg)) {
                YtChat.monitorChat($pinnedMsg);
                YtChat.insertLotteryBtn(chatDocument);
            } else {
                //console.log(`[${Date.now()}]pinnedMsgReady`, YtReady.pinnedCount);
                //++YtReady.pinnedCount < YtReady.maxRetry && 
                wait(100).then(YtReady.pinnedMsgReady);
            }
        }
    }
}