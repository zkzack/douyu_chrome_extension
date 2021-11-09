(function () {
    'use strict';

    const btnSelector = 'button[class^="dy-Modal"][class$="-close"]';
    let target = document.body;
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {            
            m.addedNodes.forEach(node => {
                let close_btn = $(node).find(btnSelector)[0];
                if (close_btn && Config67373.blockJump) {
                    //console.log(node, $(node).html());
                    wait(500).then(() => { close_btn.click(); });
                }
            });
        });
    };
    
    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();