(function () {
    'use strict';

    const obChildSelector = '#js-barrage-container';
    const isSuccess = ($node) => {
        return $node.hasClass('is-success') || $node.hasClass('is-best');
    };

    let target = document.querySelector(obChildSelector).parentElement;
    let config = { childList : true };

    let callback = (mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (isSuccess($(node))) {
                    console.log(node, $(node).html());
                    window.postMessage(Object.assign({
                        "picked": 1
                    }, Dy67373.msgData[1]), '*');
                }
            });
        });
    };

    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();