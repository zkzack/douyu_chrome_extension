(function () {
    'use strict';    
    let chat_content = $('#js-player-asideMain textarea.ChatSend-txt');
    let chat_btn = $('#js-player-asideMain .ChatSend-button');
    let last_chartStr = '';
    let record = [];
    let index = 0;
    let count = 0;
    
    chat_content.on('keydown', function (event) {        
        if(event.which === 38) { //上箭头            
            if(count > 0){
                if(index === count){
                    var pos = getCaretCoordinates(chat_content[0], chat_content[0].selectionEnd);
                    if(pos.top > pos.height)
                        return;
                }
                event.preventDefault();
                if(index === count)
                    last_chartStr = chat_content.val();
                if(index > 0){
                    index--;
                    chat_content.val(record[index]);
                }                
            }            
        }else if(event.which === 13) { //回车
            pushRecord();
        }else if(event.which === 40){ //下箭头
            if(count > 0 && index < count){
                event.preventDefault();
                index++;
                if(index === count){
                    chat_content.val(last_chartStr);                    
                } else {
                    chat_content.val(record[index]);
                }                
            }
        }        
	});

    chat_btn.on('mousedown', function (event) {
        pushRecord();
    });
    
    function pushRecord() {
        var msg = chat_content.val();        
        if(msg && (count > 0 ? msg !== record[count-1] : true)){
            record.push(msg);
            count = record.length;
            index = count;
        }        
    }
    
    chat_content.on('keyup paste', function (event) {
        if (parseInt(chat_content.attr('maxlength')) < 100)
            chat_content.attr('maxlength', '100');
    });    
    //var events_length = $._data(chat_btn[0],'events').click.length;
    //console.log('click.length: ' + events_length);
   
})();