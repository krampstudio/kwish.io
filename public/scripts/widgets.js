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
		var imageHeight = 0;
		var containerHeight = parseInt($('#content').height());
		$('img.article-photo').bind('load', function(){
			
			var containerWidth = parseInt($(this).parents('.article-photos').width());
			var imageWidth = parseInt($(this).width());
	
			if(imageWidth > containerWidth){
				$(this).width(containerWidth + 'px');
			}
			imageHeight +=  parseInt($(this).height());
			if(imageHeight >= containerHeight){
				$('#content').height( (imageHeight + 20) + 'px');
			}
		});
		
		function checkForm($ctx, dontCheckAmount){
			
			$('.valid-form').remove();
			
			var $email  = $('form', $ctx).find(":text[name='email']");
			var $amount =  $('form', $ctx).find(":text[name='amount']");
			
			var status = {
				email: {
					valid	: false,
					img		: 'error',
					alt		: 'erreur',
					msg		: 'Le champ email est invalide'	
				},
				amount: {
					valid	: false,
					img		: 'error',
					alt		: 'erreur',
					msg		: 'Le champ email est invalide'	
				}	
			};
			if($email.val().trim().length > 0 && /^\S+@\S+\.\S+$/.test($email.val())){
					status.email.valid = true;
					status.email.img   = 'valid';
					status.email.alt   = 'Valide';
					status.email.msg   = '';
			}
			
			$email.after(
					"<img src='/imgs/"+status.email.img+".png' " +
					"class='valid-form' alt='"+status.email.alt+"' " +
					"title='"+status.email.msg+"' />"
				);
			
			
			if(dontCheckAmount == true){
				return status.email.valid;
			}
			
			if($amount.val().trim().length > 0){
				if(/^\d+$/.test($amount.val()) && parseInt($amount.val()) > 0 && parseInt($amount.val()) < 10000){
					status.amount.valid = true;
					status.amount.img   = 'valid';
					status.amount.alt   = 'Valide';
					status.amount.msg   = '';
				}
			}
			$amount.after(
					"<img src='/imgs/"+status.amount.img+".png' " +
					"class='valid-form' alt='"+status.amount.alt+"' " +
					"title='"+status.amount.msg+"' />"
				);
			
			
			return status.email.valid && status.amount.valid;
		}
		
		$('.options-dialog').dialog({
			autoOpen	: false,
			title		: 'test',
			modal 		: true,
			width		: 500,
			height		: 300,
			buttons		: {
				"Payer sur Paypal": function(){
					if(checkForm($(this), false)){
						$('form.paypal-form', $(this)).submit();
					}
				},
				"Réserver seulement": function(){
					
					var $dialog = $(this);
					
					if(checkForm($dialog, true)){
						$.post(
							'/bookArticle', {
								'email'	: $('form', $dialog).find(":text[name='email']").val(),
								'amount': $('form', $dialog).find(":text[name='amount']").val()
							},
							function(response){
								$dialog.dialog( "close" );
								if(response.valid == true){
									msg(MSG.TYPE.INFO, "Article réservé!");
									
									setTimeout(function(){
										window.location = '/';
									}, 3000);
								}
								else{
									msg(MSG.TYPE.ERROR, "Un problème est survenue en réservant l'article");
								}
							},
							'json'
						);
					}
				},
				"Annuler" : function(){
					$(this).dialog( "close" );
				}
			},
			open : function(event, ui){
				
				$('.valid-form').remove();
				
				if($(this).attr('id') == 'book-buy-container'){
					$('.ui-dialog-buttonset button').each(function(){
						if(/^Payer/.test($(this).find('.ui-button-text').text())){
							$(this).button("option", "disabled", true );
						}
					});
				}
				else{
					if($(this).attr('id') == 'partial-cash-container'){
						var $amount =  $('form', $(this)).find(":text[name='amount']");
						$('#slider').slider({
							value: parseInt($amount.val()) || 0,
							min: 0,
							max: parseInt($amount.val()) || 1000,
							step: 10,
							slide: function (event, ui){
								$amount.val( ui.value );
							}
						});
					}
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
	
	$('ul.whishes li', $ctx).not('.booked').click(function(){
		focusArticle($(this).attr('id'));
		return false;
	});
	$('ul.whishes li.booked', $ctx).each(function(){
		var $overDiv = $("<div class='over-article'></div>");
		$overDiv.width(parseInt($(this).width()) - 10);
		$overDiv.height(parseInt($(this).height()) - 10 );
		$(this).prepend($overDiv);
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
	$('#content').load('/list?d='+new Date().getTime(), function(){
		
		var tabIndex = $('#content > div').index($('#content .selected'));
		
		//create the tabs widget
		$('#content').tabs({
			selected : (tabIndex > -1) ? tabIndex : 0,
			show: function(event, ui){
				onListLoad(ui.panel);
			}
		});	
	});
});