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
 * @param {String} msg
 */
function _msg(type, msg){
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
	$('#message-box').text(msg).show('slow');
	setTimeout(function(){
		$('#message-box').empty().hide();
	}, 4000);
}
	
/**
 * Initialize the login box
 */
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
	initLogin();
});