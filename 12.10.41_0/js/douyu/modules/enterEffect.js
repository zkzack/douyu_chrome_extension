(function () {
    'use strict';
    
    const nameSelector = '.EnterNobleCard-nickName';

    let target = document.querySelector(Dy67373.enterEffect);
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    let $node = $(node);
                    if (!$node.hasClass('EnterNoble'))
                        console.log(node, node.innerHTML);
                    let $name = $node.find(nameSelector);
                    if ($name.length) {
                        let name = $name.text();
                        let colorIndex = Config67373.specialIds.includes(name) ? 4 : (name === Data67373.anchorName ? 1 : 0);
                        if (colorIndex)
                            Dy67373.recordDanmu(name, '来到本直播间', colorIndex);
                    }
                }
            });
        });
    };
    
    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();