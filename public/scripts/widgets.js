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
						msg(MSG.TYPE.ERROR, "Login incorrect");
						
					}
				},
				'json'
			);
		}	
	});
}

/**
 * Select an article
 * @param {String} articleId
 */
function focusArticle(articleId){
	$('#content').load('/article?id='+articleId, function(){
		
		//adapt the container size to the photo
		$('img.article-photo').bind('load', function(){
			var containerWidth = parseInt($(this).parents('.article-photos').width());
			var imageWidth = parseInt($(this).width());
			
			if(imageWidth > containerWidth){
				$(this).width(containerWidth + 'px');
			}
		});
		
		$('.options-dialog').dialog({
			autoOpen	: false,
			title		: 'test',
			modal 		: true,
			width		: 500,
			height		: 300,
			buttons		: {
				"Payer sur Paypal": function(){
					$('form.paypal-form', $(this));
				},
				"Réserver seulement": function(){
					$('form.paypal-form', $(this));
				},
				"Annuler" : function(){
					$(this).dialog( "close" );
				}
			},
			open : function(event, ui){
				if($(this).attr('id') == 'book-buy-container'){
					$('.ui-dialog-buttonset button').each(function(){
						if(/^Payer/.test($(this).find('.ui-button-text').text())){
							$(this).button("option", "disabled", true );
						}
					});
				}
				else{
					$('.ui-dialog-buttonset button').button("option", "disabled", false);
				}
			}
		});
		
		//set up the actions buttons
		$('.whish ul.options li').button().click(function(){
			
			//get the associated dialog container
			var $dialogContainer = $('#' + $(this).attr('id').replace('-button', '-container'));
			if($dialogContainer.hasClass('options-dialog')){
				
				$dialogContainer.dialog('option', 'title', $(this).text());
				$dialogContainer.dialog('open');
			}
		});
		
	});
}
	

/**
 * Update and resize the list items
 * @param {jQuery} $ctx the container element
 */	
function onListLoad($ctx){
	
	//prevent to be launched more than once
	if($('ul.whishes', $ctx).hasClass('resized')){
		return;
	}
	
	var imageCount = 0;
	var rows = [];
	$('ul.whishes', $ctx).bind('fullLoaded', function(event){
		$(this).unbind(event);
		
		var totalHeight = 0;
		for(var i in rows){
			totalHeight += rows[i] + 32;

			//we resize each row
			$('li.row-'+i, $ctx).height(rows[i] + 'px');
		}
		
		//and the main container
		$('ul.whishes', $ctx).parent('div').height(totalHeight + 'px');
		$('ul.whishes', $ctx).addClass('resized');
	});
	
	//when all images are loaded
	$('img.thumbnails', $ctx).imagesLoaded(function(){
		
		//we retrieve the size of image, article container and row (by the row class)
		$('img.thumbnails', $ctx).each(function(event){
			var $elt = $(this).parents('li.article');
			var desc = $elt.find('.article-desc').text();
			if(desc.length > 100){
				$elt.find('.article-desc').text( 
					desc.substring(0, 95) + ' [...]'
				);
			}
			
			var itemHeight = parseInt($elt.height());
			var thumbHeight = parseInt($(this).height()) + 20;
			if(thumbHeight > itemHeight){
				itemHeight = thumbHeight;
			}
			
			var $classes = $elt.attr('class').split(' ');
			var rowNum = 0;
			for(var i in $classes){
				if(/^row-/.test($classes[i])){
					rowNum = $classes[i].replace('row-', '');
					break;
				}
			}
			
			if(!rows[rowNum]){
				rows[rowNum] = itemHeight;
			}
			else if(itemHeight > rows[rowNum]){
				rows[rowNum] = itemHeight;
			}
			
			//when the last image is parsed when trigger the fullLoaded event
			if($('img.thumbnails', $ctx).length == ++imageCount){
				$('ul.whishes', $ctx).trigger('fullLoaded');
			}
		});
	});
	
	$('ul.whishes li', $ctx).click(function(){
		focusArticle($(this).attr('id'));
		return false;
	});
}
	
/**
 * Main loop
 */
$(document).ready(function(){
	
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
		 		.ajaxStop( function(){ $(this).hide(); });
	
	//initialize the login box
	initLogin();
	
	//by default load the articles list
	$('#content').load('/list',function(){
		
		var tabIndex = $('#content > div').index($('#content .selected'));
		console.log((tabIndex > -1) ? tabIndex : 0)
		
		//create the tabs widget
		$('#content').tabs({
			selected : (tabIndex > -1) ? tabIndex : 0,
			show: function(event, ui){
				onListLoad(ui.panel);
			}
		});	
	});
});