let bg = chrome.extension.getBackgroundPage();
$(pickNum).text(bg.pickNum);
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0];
    if (currentTab && bg.tabs[currentTab.id] && bg.tabs[currentTab.id].roomTitle) {
        $(roomTitle).text(bg.tabs[currentTab.id].roomTitle);
        let originUrl = bg.tabs[currentTab.id].thumb;
        originUrl && $(roomThumb).on('error', function () {
                $(this).off('error').attr('src', originUrl);
            }).attr('src', getCoverUrl(originUrl)).show();
    }
});

function format(num, length) {  
    return (Array(length).join('0') + num).slice(-length);  
}
function getCoverUrl(coverUrl){
    var dateSep = coverUrl.lastIndexOf("/");
    var timeSep = coverUrl.lastIndexOf(".");
    var dateUrl = new Date('20'+coverUrl.slice(dateSep-6,dateSep-4)+
                        '-'+coverUrl.slice(dateSep-4,dateSep-2)+
                        '-'+coverUrl.slice(dateSep-2,dateSep)+
                        'T'+coverUrl.slice(timeSep-4,timeSep-2)+
                        ':'+coverUrl.slice(timeSep-2,timeSep)+':00');
    var dateNow = new Date();
    var elapsed = dateNow - dateUrl;
    if(elapsed > 6*60*1000 && elapsed < 15*60*1000){
        var newDate = new Date(dateUrl.getTime() + 5*60*1000);
        coverUrl = coverUrl.slice(0,dateSep-6)+
                    format(newDate.getFullYear(),2)+format(newDate.getMonth()+1,2)+format(newDate.getDate(),2)+
                    coverUrl.slice(dateSep, timeSep-4)+
                    format(newDate.getHours(),2)+format(newDate.getMinutes(),2)+coverUrl.slice(timeSep);
    }
    return coverUrl;
}

$('input').each(function(){
    let $c = $(this);
    let key = $c.attr('id');
    let type = $c.attr('type');
    if (type === 'checkbox')
        $c.prop('checked', !!bg.config[key]);
    else
        $c.val(bg.config[key]);
    $c.change(function () {
        let val = type === 'checkbox' ? $c.prop('checked') : $c.val();
        if (type === 'number') {
            val = Number(val);
            Number.isFinite(val) || (val = 0);
        }
        let pair = {};
        pair[key] = val;
        bg.config[key] = val;
        chrome.storage.local.set(pair, function() {
            console.log(bg.config);
            bg.tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, { config: bg.config }));
        });
    });
});