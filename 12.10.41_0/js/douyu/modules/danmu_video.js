(function () {
    'use strict';

    //const obSelector = '#comment-higher-container';//悬停弹幕
    const obSelector = '#__h5player > [class|="comment"] > [class*="danmu-"]';//飞行弹幕
    const infoSelector = '#comment-dzjy-container';
    const imgRootUrl = 'https://apic.douyucdn.cn/upload/';
    const imgExt = '_small.jpg';
    
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (Config67373.danmuUN && node.comment && node.comment.data && node.comment.data.likeData && node.comment.data.likeData.raw) {
                    let data = node.comment.data.likeData.raw;
                    let $node = $(node);
                    let className = $node.attr('class');
                    if (data.nn && className && className.includes('danmuItem')) {                        
                        if (!$node.children('div').first().hasClass(Dy67373.danmuUserNameClass)) {
                            let img = $node.children('img').first();
                            let left = img.length ? img.width() : 0;
                            let color = className.includes('noble') ? 'beige' : 'yellow';
                            $(`<div class="${Dy67373.danmuUserNameClass} ${color}-67373">${data.nn}</div>`)
                                .css('left', `${left + 2}px`)
                                .prependTo(node);
                        }
                    }
                }
            });
        });
    };
    
    function danmuReady() {
        let target = document.querySelector(obSelector);
        if (target) {
            new MutationObserver(callback).observe(target, config);
        } else {
            wait(100).then(danmuReady);
        }
    }

    danmuReady();
})();