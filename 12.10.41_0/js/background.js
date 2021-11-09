'use strict'
var tabs = [];
var pickNum = 0;
var config = {
    ytNotice: false,
    ttvNotice: false,
    autoPick: true,
    blockIdleBlack: true,
    blockJump: true,
    danmuUN: false,
    autoRefresh: true,
    videoDanmuOff: false,
    blockEnter: false,
    blockMsg: false,
    blockLike: false,
    simplifyDanmu: false,
    removeDanmuColor: false,
    blockScollLock: false,
    effectOpacity: true,
    recordNobleDanmu: true,
    recordAdminDanmu: true,
    recordDanmuLevel: 60,
    specialIds: ['陈一发儿', '陈一发儿放映室', 'thebs']
};

chrome.storage.local.get(config, function (result) {
    console.log(result);
    Object.assign(config, result);
    getNotice();
});

chrome.tabs.onRemoved.addListener(
    function(tabId) {
		if(tabs[tabId]) 
			delete tabs[tabId];
    });

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.reg) {
            if (sender.tab) {
                tabs[sender.tab.id] = sender.tab;
                console.log("registered from a content script: " + sender.tab.url);
                sendResponse({
                    msg: `reg received, tabId = ${sender.tab.id}`,
                    config: config
                });
            }
        } else if (typeof request.ready === "string") {
			let owner_name = tabs[sender.tab.id] && tabs[sender.tab.id].owner_name ? tabs[sender.tab.id].owner_name : request.ready;
            chrome.browserAction.setBadgeText({text: owner_name, tabId: sender.tab.id});
            chrome.browserAction.setBadgeBackgroundColor({color: [255, 127, 0, 255], tabId: sender.tab.id});
        } else if (Number.isFinite(request.rid) && request.rid) {
            fetch(`http://open.douyucdn.cn/api/RoomApi/room/${request.rid}`).then(response => {                
                if (response.ok) {
                    let contentType = response.headers.get("content-type");
                    if (typeof contentType === 'string' && contentType.includes("application/json"))
                        return response.json();
                    throw new Error(`contentType: ${contentType ? contentType : typeof contentType}`);
                }                    
                throw new Error(`${response.status}: ${response.statusText}`);
            }).then(json => {
                if (json.error === 0) {
                    if (tabs[sender.tab.id]) {
						if (json.data.room_thumb) {
							let index = json.data.room_thumb.lastIndexOf("/dy");
							tabs[sender.tab.id].thumb = index > 0 ? json.data.room_thumb.slice(0, index) : json.data.room_thumb;
							tabs[sender.tab.id].roomTitle = json.data.room_name;							
						}
						if (json.data.owner_name && json.data.owner_name !== tabs[sender.tab.id].owner_name) {
							tabs[sender.tab.id].owner_name = json.data.owner_name;
						}
                    }					
                    //console.log("room_thumb="+json.data.room_thumb+",cate_name="+json.data.cate_name+",status="+json.data.room_status);
                    sendResponse({title: json.data.room_name, thumb: json.data.room_thumb, cate: json.data.cate_name, status: json.data.room_status});
                } else
                    sendResponse({error: json.error});
            }).catch(error => sendResponse({error: error.message}));
            return true;
        } else if (Number.isFinite(request.picked) && request.picked) {
            pickNum += request.picked;
        }
    });

//获取当日汇率并储存在本地
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cny.min.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        if (json && json.cny && json.cny.cny && json.cny.cny === 1) {
            chrome.storage.local.set(json, function() {
                console.log(json.cny);
            });
        }
    });

//获取开播通知
const ytNotificationId = 'ytStreams';
const ttvNotificationId = 'ttvStreams';
var ytStreamUrl;
const ttvStreamUrl = 'https://www.twitch.tv/thebs_chen';
chrome.notifications.onClicked.addListener(function (notificationId) {
    let url = notificationId === ytNotificationId ? ytStreamUrl : ttvStreamUrl;
    chrome.tabs.query({}, tabs => {
        if (tabs) {
            for (let tab of tabs) {
                if (tab.url.startsWith(url)) {
                    chrome.tabs.highlight({ windowId: tab.windowId, tabs: tab.index });
                    return;
                }
            }
        }
        chrome.tabs.create({ url: url, active: true });
    });    
});
function getNotice() {
    if (config.ytNotice || config.ttvNotice) {
        fetch('https://raw.githubusercontent.com/asdfjk82/67373Assistant/master/noticeJson', {cache: "no-cache"})
        .then(response => {
            if (response.ok) return response.json();
        })
        .then(json => {
            if (json && typeof json === 'object' && typeof json.timestamp === 'number') {
                chrome.storage.local.get('noticeJson', function (result) {
                    let notice = result.noticeJson;
                    if (!notice || json.timestamp > notice.timestamp) {
                        if (config.ytNotice && json.yt && json.yt.videoId && json.yt.yt_ts
                             && (!notice || !notice.yt || (notice.yt.yt_ts && json.yt.yt_ts > notice.yt.yt_ts))
                             && (json.yt.sch || (Date.now() - 1000*json.yt.yt_ts)/1000 < 43200)) {
                                ytStreamUrl = `https://www.youtube.com/watch?v=${json.yt.videoId}`;
                                chrome.notifications.create(ytNotificationId, {
                                    type: 'basic',
                                    title: json.yt.sch ? `将于${new Date(json.yt.sch*1000).toLocaleString()}开始直播` : `67373油管开播啦~`,
                                    message: json.yt.title ? json.yt.title : `直播地址：${ytStreamUrl}，点个赞不迷路~`,
                                    iconUrl: chrome.runtime.getURL("../images/orange_cat.jpg")
                                });
                        }
                        if (config.ttvNotice && json.ttv && json.ttv.title && json.ttv.ttv_ts
                             && (!notice || !notice.ttv || (notice.ttv.ttv_ts && json.ttv.ttv_ts > notice.ttv.ttv_ts))
                             && (Date.now() - 1000*json.ttv.ttv_ts)/1000 < 43200) {
                                chrome.notifications.create(ttvNotificationId, {
                                    type: 'basic',
                                    title: `${json.ttv.user_name}在Twitch开播啦`,
                                    message: json.ttv.title,
                                    iconUrl: chrome.runtime.getURL("../images/orange_cat.jpg")
                                });
                        }
                        chrome.storage.local.set({noticeJson: json}, function() {
                            console.log('storage set', json);
                        });
                    }
                });
            }
        });
    }
    setTimeout(getNotice, 30000);
}    