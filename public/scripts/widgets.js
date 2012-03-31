/**
 * Type of Messages
 */
var MSG = {
	TYPE: {
		ERROR	: 1,
		INFO	: 0
	}
};
	
/**
 * Display a message
 * @param {MSG.TYPE} type
 * @param {String|Array} msg the message(s) to display
 * @param {Number} [time] display time in ms (default 4000)
 *                        Possible values are -1 to never hide or > 1500 
 *                        (because of the apparition time)
 */
function _msg(type, msg, time){
	switch(type){
		case MSG.TYPE.ERROR:
			$('#message-box')
			.toggleClass('ui-state-highlight', false)
			.toggleClass('ui-state-error', true);
		break;	
		case MSG.TYPE.INFO:
		default:
			$('#message-box')
				.toggleClass('ui-state-error', false)
				.toggleClass('ui-state-highlight', true);
		break;
	}
     $('#message-box').empty();
    if($.isArray(msg) && msg.length > 0){
        var $ul = $('<ul />');
        for(var i in msg){
            $ul.append('<li>'+msg[i]+'</li>');     
        }
        $('#message-box').append($ul).fadeIn(1500, 'easeInCubic');
    }
    else{
	    $('#message-box').text(msg).fadeIn(1500, 'easeInCubic');
    }
    var timeout = (time && (time < 0 || time > 1500)) ? time : 4000;
    if(timeout > 0){
        setTimeout(function(){
    		$('#message-box').fadeOut(1500, 'easeOutCubic', function(){
                $(this).empty();
            });
    	}, timeout);
    }
}
	
/**
 * Initialize the login box
 
function initLogin(){
	$("#connector").click(function(){
		if($("#login-form").css('display') == 'none'){
			$("#login-form").show();
			
			//move the contact box
			$("#contact").css('top', (parseInt($("#contact").css('top')) + parseInt($("#login-form").height())) + 'px');
		}
		else{
			$("#contact").css('top', (parseInt($("#contact").css('top')) - parseInt($("#login-form").height())) + 'px');
			$("#login-form").hide();
		}
	});
	$("#login-form input:button").button().click(function(){
		var login = $('#login', $("#login-form")).val();
		var passwd = $('#passwd', $("#login-form")).val();
		if(login != '' && passwd != ''){
			$.post(
				'login', 
				{login: login, passwd: passwd}, 
				function(data){
					if(data.valid === true){
						window.location.reload();
					}
					else{
						_msg(MSG.TYPE.ERROR, "Login incorrect");
					}
				},
				'json'
			);
		}	
	});
}*/

function initControl(){
    $('#connector').click(function(){
       $('#connect-box').slideToggle();
       return false;
    });
}

	
/**
 * Main loop
 */
$(document).ready(function(){
	
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
				.ajaxStop(function(){ $(this).hide(); });
                
    $('.big-button').button();
	
	//initialize the login box
	initControl();
});