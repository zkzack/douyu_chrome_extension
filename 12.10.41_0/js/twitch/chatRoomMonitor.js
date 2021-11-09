'use strict';

const TtvChatMonitor = {
    headerLabelId: 'chat-room-header-label',
    msgContainerSelector: `section.chat-room>.chat-room__content div.chat-scrollable-area__message-container`,
    chatMsgClass: 'chat-line__message',
    userNoticeClass: 'user-notice-line',
    viewerListClass: 'chat-viewers-list',
    cheerClass: 'chat-line__message--cheer-amount',
    textSelector: 'span.text-fragment',
    rating: new Rating(),
    lottery: new Lottery(),
    chatRoomReady: () => {
        //console.log(`[${Date.now()}]chatRoomReady`);
        if (document.querySelector(TtvChatMonitor.msgContainerSelector)
            && document.getElementById(TtvChatMonitor.headerLabelId)) {
                TtvChatMonitor.insertRatingModalBtn();
                TtvChatMonitor.monitorMsgContainer();
        } else {
            wait(100).then(TtvChatMonitor.chatRoomReady);
        }
    },
    insertRatingModalBtn: function () {
        if (Data67373.ttvLogin && Constant67373.TwitchIds.includes(Data67373.ttvLogin)) {
            let $parent = document.getElementById(this.headerLabelId).parentElement;
            if ($parent && Util67373.firstDetected($parent)) {
                this.rating.insertRatingModalBtn($parent);
                this.lottery.insertLotteryModalBtn($parent);
            }
        }
    },    
    monitorMsgContainer: function () {
        let $target = document.querySelector(this.msgContainerSelector);
        if ($target && Util67373.firstDetected($target)) {
            new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach($node => {
                        if ($node.nodeType === Node.ELEMENT_NODE) {
                            if ($node.classList.contains(this.chatMsgClass)) {
                                //console.log(m.target);
                                getChatMsg($node);
                            } else if ($node.classList.contains(this.userNoticeClass) || 
                                $node.firstElementChild.classList.contains(this.userNoticeClass)) {
                                let $msg = $node.querySelector(`div.${this.chatMsgClass}`);
                                if ($msg)
                                    getChatMsg($msg);
                                else {
                                    let $notice = getNoticeNode($node);
                                    if ($notice) {
                                        TtvNoticeRecorder.addRecord($notice.innerText.replace('\n', ' '));
                                    } else {
                                        console.log($node);
                                    }
                                }
                            } else if ($node.className != 'scrollable-trigger__wrapper'
                                    && $node.getAttribute(Constant67373.TtvTargetAttr) !== 'chat-welcome-message') {
                                console.log($node);
                            }
                        }
                    });
                });
            }).observe($target, { childList : true });

            function getChatMsg($node) {
                let $cheers = $node.querySelectorAll(`.${TtvChatMonitor.cheerClass}`);
                if ($cheers.length || TtvChatMonitor.rating.start || TtvChatMonitor.lottery.$lotteryModal) {
                    let $user = $node.querySelector(`span[${Constant67373.TtvUserAttr}]`);
                    if ($user) {
                        let name = $user.innerText;
                        if ($cheers.length) {
                            let amount = 0;
                            $cheers.forEach($cheer => amount += Number($cheer.innerText));
                            TtvNoticeRecorder.addRecord(`${name}送出 ${amount} 呼币`);
                        }                            
                        if (TtvChatMonitor.lottery.$lotteryModal)
                            TtvChatMonitor.lottery.addLotteryUser(name);
                        if (TtvChatMonitor.rating.start) {
                            let $text = $node.querySelector(TtvChatMonitor.textSelector);
                            if (name && $text && Util67373.nonBlankStr($text.innerText))
                                TtvChatMonitor.rating.addRating(name, $text.innerText);
                        }
                    }
                }
            }
            
            function getNoticeNode($node) {
                let $chatterName = $node.querySelector('span.chatter-name');
                if ($chatterName && $chatterName.parentElement) {
                    //console.log($chatterName.innerText);
                    return $chatterName.parentElement.parentElement;
                }
            }
        }
    }
}