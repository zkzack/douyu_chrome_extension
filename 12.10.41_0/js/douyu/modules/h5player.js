(function () {
    'use strict';    
    
    const obSelector = '#__h5player';
    const isMask1 = ($node) => {
        let className = $node.attr('class');
        return typeof className === 'string' && className.startsWith('mask1');
    };

    let target = document.querySelector(obSelector);
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                let $node = $(node);                
                //$node.attr('class').startsWith('pip') || console.log(node, node.innerHTML);
                if (Config67373.blockIdleBlack && isMask1($node)) {
                    wait(500).then(() => m.target.dispatchEvent(new MouseEvent('mousemove', { bubbles: true })));
                }
            });
        });
    };
    
    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();