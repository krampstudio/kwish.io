/**
 * Main loop
 */
$(document).ready(function(){
    
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
				.ajaxStop(function(){ $(this).hide(); });
                
    $('.big-button').button();
    
    var listName = $('title').text() || $(this).attr('title');
	
    $.get('/list/data/' + listName, function(list){
        if(list){
            $('#header').text(list.title);
            $('#intro').html('<p>'+list.description+'</p>');   
  
           $('.editable').not('#items').editableArea({
                hoverClass : 'editable-hover'
           });
          
			var $itemTemplate = "\
					<li id='item_${index}'>\
						<div class='item-title'>${name}</div>\
						<img class='item-thumbnail' src='/imgs/articles/${thumb}' alt='' />\
						<div class='item-desc'>${shortDesc}</div>\
					</li>\
          			";
			
 
           $.post('/list/articles', {list: list}, function(articles){
				var $list = $('#items > ul');
				for (var index in articles){
					var article = articles[index];
					article.shortDesc = article.description; 
					if(article.description.length > 100){
						article.shortDesc = article.shortDesc.substring(0,95) + '[...]';                    
					}
					//if there is an array of thumbnails, we get one randomly
					if(article.thumb && $.isArray(article.thumb)){
						article.thumb = article.thumb[Math.floor(Math.random()*article.thumb.length)];
					}
					article.index = index;
					
					$list.append($.tmpl($itemTemplate, article));
            	}
            	if($('#items').hasClass('editable')){
					//enable to add an article
					$list.append("\
								<li class='ctrl-box'>\
									<img class='icon' src='/imgs/add.png' alt='+' />\
								 	Ajouter un article \
								 </li>\
								");
					//add a new item by clicking the ctrl button
					$('.ctrl-box', $list).click(function(){
						var newIndex = $('li', $list).length - 1;
						$.tmpl($itemTemplate, {
							'index'		: newIndex,
							'name'		: 'Titre',
							'shortDesc' : 'Description',
							'thumb'		: 'default.png'
						}).insertBefore($(this));
						$('#item_'+newIndex).removableArea();
					});
					

					//the articles can be sorted 					
					$list.sortable({
						cursor: 'move',
						forcePlaceholderSize: true,
						opacity: 0.6,
						placeholder: 'placeholder',
						items: 'li:not(.ctrl-box)',          //to exclude the control box
						update: function(event, ui){
							$.each($('li:not(.ctrl-box)', $list), function(index, elt){
								elt.id = 'item_' + index;
							});
						}
					});

					$('li:not(.ctrl-box)', $list).removableArea();
             	}
           }, 'json');
        }
    });
    
});
