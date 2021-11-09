(function () {
    'use strict';
    
    let stopEvent = (e) => e.stopPropagation();

    //接收content js的消息
    window.addEventListener("message", function (e) {
        //console.log(e.data);
        if (e.data && e.data.target === Dy67373.msgTargets[1]) {            
            if (e.data.config && typeof e.data.config === "object") {//配置变更
                Object.assign(Config67373, e.data.config);
                //透明化
                $(Dy67373.barrageBanner).css('opacity', Config67373.effectOpacity ? '.8' : '1');
                $(`${Dy67373.giftEffect} > div,${Dy67373.enterEffect},${Dy67373.treasure}`)
                    .css('opacity', Config67373.effectOpacity ? '.7' : '1');
                //滚动条锁屏
                let scollLock = document.querySelector(Dy67373.danmuSide).parentNode.parentNode;
                Config67373.blockScollLock ? 
                    scollLock.addEventListener('scroll', stopEvent, true) : 
                    scollLock.removeEventListener('scroll', stopEvent, true);
                //视频弹幕开关
                /*if (Data67373.show_status === 2)
                    window.commons_E().call({
                        id: "comment",
                        action: "setComment",
                        data: [!Config67373.videoDanmuOff]
                    });*/
                //视频弹幕位置
                //__player.setLocalStorage('player_storage_danmu_Model', Config67373.danmuBelow ? 2 : 1);
            } else if (e.data.status && Number.isFinite(e.data.status)) {//播放状态变更
                //console.log(Data67373.show_status, e.data.status, Data67373.show_status === e.data.status);                
                if (Data67373.show_status !== e.data.status) {                    
                    if (Config67373.autoRefresh && Data67373.show_status === 2 && e.data.status === 1) {
                        /*
                        window.commons_E().call({
                            id: "app",
                            action: "updataStatusRoom",
                            data: [!0]
                        });
                        if (H5PlayerVideoLib.getVideo() && Array.isArray(H5PlayerVideoLib.getVideo().modules) && H5PlayerVideoLib.getVideo().modules.length >= 3)
                            H5PlayerVideoLib.getVideo().modules[2].actionHandle({
                                action: "reloadVideo",
                                data: [{ manual: !0 }]
                            });*/
                        $('#js-player-video-above > .video-above').empty();
                    }
                    Data67373.show_status = e.data.status;
                }
            }
        }
    }, false);
})();