/**
 * Main loop
 */
$(document).ready(function(){
    
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
				.ajaxStop(function(){ $(this).hide(); });
                
    $('.big-button').button();
    
    var listName = $('title').text() || $(this).attr('title');
	
	var editMode = $('#container').hasClass('inline-edition');
	
    $.get('/list/data/' + listName, function(list){
        if(list){
            $('#header').text(list.title);
            $('#intro').html('<p>'+list.description+'</p>');   
  
			
			var itemTitle = 'Afficher les détails';
			if(editMode){
				$('#header, #intro').editableArea({
                	hoverClass : 'editable-hover'
           		});
				itemTitle = 'Cliquez pour éditer, glissez pour réordonner';
			}
 
           $.post('/list/articles', {list: list}, function(articles){
				var $list = $('#items > ul');

				//set up template data	
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
					article.hover = itemTitle;
            	}
				$('#item-tmpl').tmpl(articles).appendTo($list);

				//attach object to elements
				for(var i in articles){
					var article = articles[i];
					$('#item_'+article.index).data('article', article);
				}
			
            	if(editMode){

					$('#items').addClass('editable');
					
					//enable to add an article
					$list.append("\
								<li id='ctrl-add' class='ctrl-box'>\
									<img class='icon' src='/imgs/add.png' alt='+' />\
								 	Ajouter un article \
								 </li>\
								");
					
					//add a new item by clicking the ctrl button
					$('#ctrl-add', $list).click(function(){
						var newIndex = $('li', $list).length - 1;
						
						$('#item-tmpl').tmpl([{
							'index'		: newIndex,
							'name'		: 'Titre',
							'shortDesc' : 'Description',
							'thumb'		: 'default.png'
						}]).insertBefore($(this));
						
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

					$('li:not(.ctrl-box)', $list).click(function(){
						var article = $(this).data('article');
						$('#content').empty();
						$('#article-tmpl').tmpl([article]).appendTo($('#content'));
						
					});
             	} else {
					$('li', $list).click(function(){
                		
                    });
				}

				
           }, 'json');
        }
    });
    
});
