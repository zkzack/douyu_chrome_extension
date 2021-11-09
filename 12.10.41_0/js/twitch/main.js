(function () {
    'use strict';

	let currentUrl = location.href;

	chrome.runtime.sendMessage({
		reg: true
	}, function (response) {
		console.log(response.msg);
	});
    
    TtvRootMonitor.rootReady();

    mainTask();

    setInterval(function () {
        if (currentUrl != location.href) {
            console.log(location.href);
            currentUrl = location.href;
            wait(100).then(mainTask);
        }
    }, 500);

    function mainTask() {
        Util67373.injectJS('js/common/utility.js');
        Util67373.injectJS('js/twitch/inject/cookies.js');
        TtvChatMonitor.chatRoomReady();
        TtvNoticeRecorder.videoPlayerReady();
    }
})();