
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
	
function initLogin(){
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
}
	
	
function onListLoad(){
	var rows = [];
	$.each($('ul.whishes li'), function(index, elt){
		
		var desc = $(elt).find('.article-desc').text();
		if(desc.length > 100){
			$(elt).find('.article-desc').text( 
				desc.substring(0, 95) + ' [...]'
			);
		}
		
		var itemHeight = parseInt($(elt).height());
		var thumbHeight = parseInt($(elt).find('img.thumbnails').height()) + 20;
		if(thumbHeight > itemHeight){
			itemHeight = thumbHeight;
		}
		
		var rowNum = Math.floor(index/3);
		if(!rows[rowNum]){
			rows[rowNum] = itemHeight;
		}
		else if(itemHeight > rows[rowNum]){
			rows[rowNum] = itemHeight;
		}
	});
	var totalHeight = 0;
	for(i in rows){
		totalHeight += rows[i] + 16;
		$('li.row-'+i).height(rows[i] + 'px');
	}
	$('ul.whishes').parent('div').height(totalHeight + 'px');
	
	$('ul.whishes li').click(function(){
		$('#content').load('/article?id='+$(this).attr('id'));
		return false;
	});
}
	
$(document).ready(function(){
	
	$("#loader").ajaxStart(function(){ $(this).show(); })
		 		.ajaxStop( function(){ $(this).hide(); });
	
	initLogin();
	
	$('#content').load('/list',function(){
		$('#content').tabs({
			selected : 0,
			show: function(event, ui){
				onListLoad();
			}
		});	
	});
	
});