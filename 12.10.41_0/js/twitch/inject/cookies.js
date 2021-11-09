(function () {
    'use strict';

    const getLogin = () => {
        //console.log(`[${Date.now()}]getLogin`, window.cookies);
        if (window.cookies && window.cookies.login) {
            window.postMessage(Object.assign({
                ttvLogin: window.cookies.login
            }, Dy67373.msgData[1]), '*');
            return;
        }
        wait(100).then(getLogin);
    }

    getLogin();
})();