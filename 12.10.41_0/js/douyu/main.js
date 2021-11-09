(function () {
    'use strict';

    const readySelector = '.PlayerToolbar-ycInfo .PlayerToolbar-wealthNum';

    if (document.getElementById(Dy67373.videoId) && document.getElementById(Dy67373.toolbarId)) {
        //后台页面注册、载入配置
        chrome.runtime.sendMessage({
            reg: true
        }, function (response) {
            if (response && response.config && typeof response.config === 'object') {
                Object.assign(Config67373, response.config);
                console.log(response.msg);
            }
        });

        //注入inject js
        Util67373.injectJS('js/lib/jquery.min.js');
        Util67373.injectJS('js/lib/getCaretCoordinates.js');
        Util67373.injectJS('js/common/utility.js');
        wait(100).then(() => {
            Util67373.injectJS('js/douyu/modules/recvMsg.js');
            Util67373.injectJS('js/douyu/modules/roomInfo.js');
        });
        flashReady();
    }

    function flashReady() {
        if ($(readySelector).text()) {
            wait(100).then(mainTask);
        } else {
            wait(100).then(flashReady);
        }
    }

    function mainTask() {
        Dy67373.sendConfig(Config67373);
        createRecordBox();
        Util67373.injectJS('js/douyu/modules/barrageBanner.js');
        Util67373.injectJS('js/douyu/modules/danmu_side.js');
        Util67373.injectJS('js/douyu/modules/danmu_video.js');
        Util67373.injectJS('js/douyu/modules/enterEffect.js');
        Util67373.injectJS('js/douyu/modules/chatInput.js');
        Util67373.injectJS('js/douyu/modules/treasure.js');
        Util67373.injectJS('js/douyu/modules/treasureResult.js');
        Util67373.injectJS('js/douyu/modules/h5player.js');
        Util67373.injectJS('js/douyu/modules/blockJump.js');
        chrome.runtime.sendMessage({
            ready: document.title.split('_')[0]
        });
    }
})();