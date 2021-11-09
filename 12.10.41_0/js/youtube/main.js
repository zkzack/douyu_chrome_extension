(function () {
    'use strict';

	const liveReg = new RegExp("youtube.com/(watch\\?\\S+|(c|user|channel)/\\S+/live)");
	const liveChatUrl = 'youtube.com/live_chat?';
	
    let currentUrl = location.href;

	chrome.runtime.sendMessage({
		reg: true
	}, function (response) {
		console.log(response.msg);
	});

    mainTask();

    setInterval(function () {
        if (currentUrl != location.href) {
            console.log(location.href);
            currentUrl = location.href;
            wait(100).then(mainTask);
        }
    }, 500);

    function mainTask() {
        chrome.runtime.sendMessage({
            ready: ''
        });        
        if (liveReg.test(currentUrl)) {
            YtReady.frameCount = 0;
            YtReady.chatFrameReady();
        } else if (currentUrl.includes(liveChatUrl)) {
            YtReady.chatDomReady(true);
        }
    }

})();