const recordParentId = 'douyu_room_normal_player_proxy_box';

const createRecordBox = () => {
    let tabBtnSelector = '.record-67373 .tab-67373-link > button';
    let contentSelector = `.record-67373 .${Dy67373.tabContentClass}`;
    let openBtnSelector = '.record-67373 > .record-67373-open-btn > button';
    let recordParent = document.getElementById(recordParentId);
    let tabNameData = 'tab-name';
    if (recordParent) {
        $(`
        <div class="record-67373">
            <div class="tab-67373">
                <div class="tab-67373-link">
                    <button data-${tabNameData}="${Dy67373.tabNames[0]}" class="active">礼物</button>
                    <button data-${tabNameData}="${Dy67373.tabNames[1]}">弹幕</button>
                </div>
                <div class="tab-67373-main white-67373">
                    <div id="${Dy67373.tabContentClass}-${Dy67373.tabNames[0]}" data-${tabNameData}="${Dy67373.tabNames[0]}"
                     class="${Dy67373.tabContentClass} active"></div>
                    <div id="${Dy67373.tabContentClass}-${Dy67373.tabNames[1]}" data-${tabNameData}="${Dy67373.tabNames[1]}"
                     class="${Dy67373.tabContentClass}"></div>
                </div>
            </div>
            <div class="record-67373-open-btn">
                <button></button>
            </div>
        </div>`).appendTo(recordParent);
        $(openBtnSelector)
            .css('background-image',`url('${chrome.runtime.getURL("../images/btn.png")}')`)
            .click(() => $('.record-67373 > .tab-67373').toggleClass('open'));
        $(tabBtnSelector).each(function () {
            let tabName = $(this).data(tabNameData);
            $(this).click(() => 
                $(`${tabBtnSelector}, ${contentSelector}`).each(function () {
                    $(this).data(tabNameData) === tabName ? $(this).addClass('active') : $(this).removeClass('active');
                }));
        });
    }
};