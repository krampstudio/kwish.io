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
           
           $.post('/list/articles', {list: list}, function(articles){
				var $list = $('#items > ul');
				for (var index in articles){
					var article = articles[index];
					var shortDesc = article.description; 
					if(article.description.length > 100){
						shortDesc = shortDesc.substring(0,95) + '[...]';                    
					}
						 
					$list.append("\
							<li>\
								<div class='item-title'>"+article.name+"</div>\
								<img class='item-thumbnail' src='/imgs/articles/"+article.thumb+"' alt='' />\
								<div class='item-desc'>"+shortDesc+"</div>\
                           	</li>\
							");
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
						$('<li/>').insertBefore($(this));
					});
					

					//the articles can be sorted 					
					$list.sortable({
						cursor: 'move',
						forcePlaceholderSize: true,
						opacity: 0.6,
						placeholder: 'placeholder',
						items: 'li:not(.ctrl-box)'          //to exclude the control box
					});

					$('li', $list).removableArea();
             	}
           }, 'json');
           
           
         //  $('#items > ul').disableSelection();
           
           
        }
    });
    
});
