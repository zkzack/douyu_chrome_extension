(function () {
    'use strict';    
    
    const likeSelector = 'span.roomDianzanIcon';
    const likeText = '为主播点了个赞';
    const danmuSelector = 'span.Barrage-content';
    const anchorSelector = 'span.AnchorLevel';
    const adminSelector = 'span.Barrage-icon:not(.Barrage-noble)';
    const nobleSelector = 'span.Barrage-noble';
    const fanSelector = '.FansMedalBox';//class="level-15/is-made" data-rid="73570"
    const levelSelector = 'span.UserLevel';
    const nameSelector = 'span.Barrage-nickName';//data-uid="17389617"
    const msgSelctor = 'span.Barrage-text';

    const isLike = ($node) => {
        return $node.find(danmuSelector).text().trim() === likeText;
    };
    const isEnter = ($node) => {
        return $node.children('div').first().hasClass('Barrage-userEnter');
    };
    const isMsg = ($node) => {
        return $node.children('div').first().hasClass('Barrage-message');
    };
    const isNotice = ($node) => {
        return $node.children('div').first().hasClass('Barrage-notice');
    };
    const isNobleDanmu = ($node) => {
        return $node.children('div').first().hasClass('Barrage-notice--noble');//彩色Barrage--paddedBarrage 普通Barrage-notice--normalBarrage
    };
    const getRole = ($node) => {
        if ($node.find(anchorSelector).length)
            return 1;
        else {
            let $admin = $node.find(adminSelector);
            if ($admin.length)//Barrage-icon--superAdmin Barrage-icon--roomAdmin
                return $admin.hasClass('Barrage-icon--superAdmin') ? 3 : 2;
            return 0;
        }
    };
    const getNobleName = ($node) => {
        let $noble = $node.find(nobleSelector);
        return $noble.length ? $noble.children('img').first().attr('title') : '';
    };     
    const getLevel = ($node, roleIndex) => {
        let levelStr = roleIndex == 1 ? 
            $node.find(anchorSelector).attr('class') //class="AnchorLevel AnchorLevel-51"
            :
            $node.find(levelSelector).attr('class'); //class="UserLevel UserLevel--31"            
        return typeof levelStr === 'string' ? Number(Dy67373.numInClass(levelStr)) : 0;
    };

    const getName = ($node, type) => {
        let name = $node.find(nameSelector).text().trim();
        return type ? name : name.slice(0,-1);
    };
    const getDanmu = ($node) => {//data-chatid="6b757a6619c242b60610120000000000"
        return $node.find(danmuSelector).html();
    };

    const simplifyDanmu = ($node, roleIndex) => {
        if (Config67373.simplifyDanmu) {
            let medal = roleIndex === 1 ? anchorSelector : 
                ($node.find(fanSelector).length ? fanSelector : levelSelector);
            $node.children('div').first().children(
                `:not(${medal},${nameSelector},${danmuSelector},${msgSelctor})`)
                .remove();
            if (roleIndex)
                $node.find(nameSelector).addClass(`border-bottom-${Dy67373.nameColors[roleIndex]}`);
            if (roleIndex === undefined)
                $node.find(msgSelctor).addClass('silver-67373');
        }
    };
    const removeDanmuColor = ($node) => {
        if (Config67373.removeDanmuColor) {
            let $danmu = $node.find(danmuSelector);
            let className = $danmu.attr('class');
            if (typeof className === 'string')
                $danmu.attr('class', className.replace('Barrage-content--color','Barrage-content'));
        }
    };

    function danmuCallback ($node) {
        let roleIndex = getRole($node);
        let level = getLevel($node, roleIndex);
        let name = getName($node);
        let nobleName = isNobleDanmu($node) ? getNobleName($node) : "";
        let nobleLevel = nobleName ? Dy67373.nobles.indexOf(nobleName) : -1;
        let colorIndex = Config67373.specialIds.includes(name) ? 4 : roleIndex;
            
        if (colorIndex >= 3 
            || (Config67373.recordNobleDanmu && nobleName) 
            || (Config67373.recordAdminDanmu && colorIndex) 
            || level >= Config67373.recordDanmuLevel) {            
            let danmu = getDanmu($node);            
            Dy67373.recordDanmu(`${name}：`, danmu, colorIndex, level, nobleLevel);
        }
        simplifyDanmu($node, roleIndex);
        removeDanmuColor($node);
    }

    function enterCallback ($node) {        
        let name = getName($node, 1);
        let roleIndex = getRole($node);
        let colorIndex = Config67373.specialIds.includes(name) ? 4 : roleIndex;
        
        if ([1, 4].includes(colorIndex))            
            Dy67373.recordDanmu(name, '来到本直播间', colorIndex);
               
        if (Config67373.blockEnter && roleIndex !== 1)
            $node.remove();
        else
            simplifyDanmu($node);
    }

    function msgCallback ($node) {
        //console.log('msg', getName($node, 2), $node.find(msgSelctor).text());
        if (Config67373.blockMsg)
            $node.remove();
    }

    function likeCallback ($node) {
        //console.log('like', getName($node), getDanmu($node));
        if (Config67373.blockLike)
            $node.remove();
        else
            removeDanmuColor($node);
    }

    function noticeCallback ($node) {
        //console.log('notice', getName($node, 3), $node.find(msgSelctor).text());
    }

    let target = document.querySelector(Dy67373.danmuSide);
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                let $node = $(node);
                if ($node.find(danmuSelector).length) {
                    if (isLike($node))
                        likeCallback($node);
                    else    
                        danmuCallback($node);
                }
                else if (isEnter($node))
                    enterCallback($node);
                else if (isMsg($node))
                    msgCallback($node);
                else if (isNotice($node))
                    noticeCallback($node);
            });
        });
    };
    
    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();