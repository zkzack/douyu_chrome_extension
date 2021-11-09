(function () {
    'use strict';
    
    const treasureClass = 'Treasure';
    const finishClass = 'is-finish';
    
    let target = document.querySelector(Dy67373.treasure);
    let config = { 
        attributeFilter: ['class'],
        subtree: true
    };

    let callback = (mutations) => {
        mutations.forEach(m => {
            let $treasure = $(m.target);
            //console.log(`NodeClass: ${$treasure.attr('class')}, autoPick: ${Config67373.autoPick}`);
            if (Config67373.autoPick && $treasure.hasClass(treasureClass) && $treasure.hasClass(finishClass)) {
                //console.log('The Treasure is finish!!!!!!!!!!!!!!!!!!!');
                let p = m.target.parentNode;
                p.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                p.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                m.target.click();//e.originalEvent.isTrusted 判断是否浏览器发出的事件
            }
        });
    };

    let observer = new MutationObserver(callback);
    observer.observe(target, config);
})();


/*
define(["douyu/page/room/normal/mod/gift/controller/treasure"], function (treasure) {    
    if(treasure.timeHandle instanceof Function){
        var newFunction = function(e){
            var n=$.extend(!0,{},e),
            newDelay=Math.floor(Math.random()*21+490),
            i=parseInt(n.endTime,10)+newDelay+(new Date).getTime()+500,
            o=parseInt(n.surplusTime,10)+newDelay+(new Date).getTime()+500;
            return n.endTime=parseInt(i,10),
            n.backTime=parseInt(o,10),
            n
        };
        var oldFunction = function(e){
            var n=$.extend(!0,{},e),
            i=parseInt(n.endTime,10)+n.delayTime+(new Date).getTime()+500,
            o=parseInt(n.surplusTime,10)+n.delayTime+(new Date).getTime()+500;
            return n.endTime=parseInt(i,10),
            n.backTime=parseInt(o,10),
            n
        };
        
        if(document.getElementById('peckSwitch').checked)
            treasure.timeHandle = newFunction;

        $('#peckSwitch').on('change', function(){
            if(document.getElementById('peckSwitch').checked)
                treasure.timeHandle = newFunction;
            else
                treasure.timeHandle = oldFunction;            
        });
    }
});
*/