(function () {
    'use strict';
    
    const rIdSelector = '.Title-anchorPic-bottom a';
    const nameSelector = '[class^=Title-anchorName]';
    const rIdField = 'room_id=';

    const setRoomId = (rid) => {
        Data67373.roomId = rid;
        window.postMessage(Object.assign({
            "rid": rid
        }, Dy67373.msgData[1]), '*');
    };

    const getRoomId = () => {
        let a = document.querySelector(rIdSelector);
        if (a) {
            let index = a.href.indexOf(rIdField);
            if (index != -1) {
                setRoomId(Number(a.href.slice(index + rIdField.length)));
                return;
            }
        }
        wait(100).then(getRoomId);
    }

    const getAnchorName = () => {
        let name = document.querySelector(nameSelector);
        if (name) { 
            Data67373.anchorName = name.getAttribute('title');
            return;
        }
        wait(100).then(getAnchorName);
    }

    for (let p in window) {
        if (p.startsWith('playerSDK')) {
            if (window[p] && window[p].c && window[p].c.e55c4 && window[p].c.e55c4.exports && window[p].c.e55c4.exports.DataCenter && window[p].c.e55c4.exports.DataCenter.global) {                
                let global = window[p].c.e55c4.exports.DataCenter.global;
                setRoomId(global.get("$ROOM.room_id"));
                Data67373.show_status = global.get("$ROOM.show_status");
                Data67373.obj = global.obj;
            } else {
                wait(100).then(getRoomId);
            }
            break;
        }
    }
    if (window.__player) {
        //console.log(typeof window.__player.getGlobal);
    }
    wait(0).then(getAnchorName);
})();