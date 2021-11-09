(function () {
    'use strict';

    const giftClass = 'Banner4gift';
    const nobleClass = 'Banner4noble';
    const nameSelector = 'div.BannerMarquee-cont';
    const objectSelector = 'span[class$="objectName"]';
    const bNumsSelector = '.BannerNumbers--batchNums';
    const hNumsSelector = '.BannerNumbers--hitNums';
    const numClass = 'BannerNumbers-num';
    const giftColors = ['blue', 'pink', 'violet'];    

    const getSize = ($node) => {
        let className = $node.attr('class');
        return Number(Dy67373.numInClass(className, 'size'));
    };
    const getName = ($node) => {
        return $node.find(nameSelector).text();
    };
    const getObject = ($node) => {
        return $node.find(objectSelector).text();
    };
    const getNumStr = ($nums) => {
        let numStr = '';
        $nums.find(`.${numClass}`).each(function () {
            let className = $(this).attr('class');
            numStr += Dy67373.numInClass(className);
        });
        return numStr;
    };

    const recordGift = (name, nameClass, action, object, colorClass, batchNum = '', hitNum = '') => {
        let timeStr = new Date().toLocaleTimeString();
        let nameStr = `<span class="${nameClass}">${name}</span>`;        
        let batchStr = batchNum ? `<span class="${colorClass}">${batchNum}</span>发` : '';
        let objectStr = `<span class="${colorClass}">${object}</span>`;
        let hitStr = hitNum ? `<span class="${nameClass}">x${hitNum}</span>` : '';
        $(`
            <div>[${timeStr}]${nameStr}${action}${batchStr}${objectStr}${hitStr}</div>
        `).prependTo($(`#${Dy67373.tabContentClass}-${Dy67373.tabNames[0]}`));
    };

    function giftCallback ($node) {
        let $batchNums = $node.find(bNumsSelector);
        let bNum = $batchNums.length ? getNumStr($batchNums) : '';
        let name = getName($node);
        recordGift(name, `${Dy67373.nameColors[Config67373.specialIds.includes(name) ? 4 : 2]}-67373`,
             '送出', getObject($node), `${giftColors[getSize($node)]}-67373`,
             bNum, getNumStr($node.find(hNumsSelector)));
    };

    function nobelCallback ($node) {
        console.log($node[0], $node.html());
        let colorClass = `dy-noble-${getSize($node)}`;
        recordGift(getName($node), colorClass, '开通', getObject($node), colorClass);
    };

    let target = document.querySelector(Dy67373.barrageBanner);
    let config = { childList : true, attributeFilter: ['class'], subtree : true };

    let callback = (mutations) => {
        for (let m of mutations) {
            let $t = $(m.target);
            if ($t.hasClass(numClass)) {
                //console.log(`type = ${m.type}`, $(m.target).attr('class'), m.addedNodes.length);
                let $node = $t.parents(`.${giftClass}`);
                if ($node.length)
                    giftCallback($node);
                break;
            }
            m.addedNodes.forEach(node => {
                let $node = $(node);
                if ($node.hasClass(giftClass)) 
                    giftCallback($node);
                else if ($node.hasClass(nobleClass))
                    nobelCallback($node);
            });
        }
    };
    
    let observer = new MutationObserver(callback);
    observer.observe(target, config);
    $(target).css('z-index','3');
    $(`${Dy67373.giftEffect} > div`).css('z-index','4');
})();