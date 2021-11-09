'use strict';

const TtvNoticeRecorder = {
    playerClass: "persistent-player",
    drawer: new Drawer(),
    videoPlayerReady: function() {        
        let $parent = document.querySelector(`.${TtvNoticeRecorder.playerClass}`);
        if ($parent) {
            console.log('videoPlayerReady detected persistent-player');
            TtvNoticeRecorder.insertDrawer($parent);
        } else {
            //console.log(`[${Date.now()}]videoPlayerReady`);
            wait(100).then(TtvNoticeRecorder.videoPlayerReady);
        }
    },
    addRecord: function(noticeText) {
        if (this.drawer.$drawerContent) {
            let $record = document.createElement('div');
            $record.innerText = noticeText;
            let $time = document.createElement('span');
            $time.className = 'ttv-67373-purple';
            $time.innerText = `[${new Date().toLocaleTimeString()}]`;
            $record.prepend($time);
            this.drawer.$drawerContent.appendChild($record);
        }
    },
    insertDrawer: function($parent) {
        if (Util67373.firstDetected($parent))
            this.drawer.insertDrawer($parent);
        else
            this.drawer.clearDrawer();
    }
}

const TtvRootMonitor = {
    rootSelector: '.root-scrollable__wrapper',
    rootReady: () => {
        let $root = document.querySelector(TtvRootMonitor.rootSelector);
        if ($root) {
            new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach($node => {
                        if ($node.nodeType === Node.ELEMENT_NODE 
                            && $node.classList.contains(TtvNoticeRecorder.playerClass)) {
                                console.log('added persistent-player');
                                TtvNoticeRecorder.insertDrawer($node);
                            }                         
                    });
                });
            }).observe($root, { childList: true });
        } else {
            wait(100).then(TtvRootMonitor.rootReady);
        }
    }
}