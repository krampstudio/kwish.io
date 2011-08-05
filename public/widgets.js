$(document).ready(function(){
	
	var MSG = {
		TYPE: {
			ERROR	: 1,
			INFO	: 0
		}
	};
	
	function msg(type, msg){
		switch(type){
			case MSG.TYPE.ERROR:
				$('#message-box')
				.toggleClass('ui-state-highlight', false)
				.toggleClass('ui-state-error', true);
				
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
	
	$("#connector").click(function(){
		$("#login-form").toggle();
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
						msg(MSG.TYPE.ERROR, "Login incorrect");
					}
				},
				'json'
			);
		}	
	});
	
	$('#content').tabs({
		selected : 0,
		show: function(event, ui){
			$('ul.whishes li').each(function(){
				var thumbHeight = parseInt($(this).find('img.thumbnails').height()) + 20;
				var itemHeight	= parseInt($(this).height());
				console.log(this.id + " : " + thumbHeight + " > " +itemHeight);
				if(thumbHeight > itemHeight){
					$(this).height(thumbHeight + 'px');
				}
			});
		}
	});
	
});