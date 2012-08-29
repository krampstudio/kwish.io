
/**
 * Populate the screen section with the list data
 * @param [Object] list the data
 * @return [boolean] true if the data are present
 */
function buildList(list){
    if(list && (list.title || list.description)){
        $('#header').text(list.title);
        $('#intro').html('<p>'+list.description+'</p>'); 
        return true;
    } 
    return false;
}

/**
 * Enable inline editing of the list metatdata
 */
function makeListEditable(){
    $('#header, #intro').editableArea({hoverClass : 'editable-hover'});
}

/**
 * Build the articles list 
 * @param [Array] the array of articles
 * @param [JQueryElement] the ul element that will contains the articles
 */
function buildArticles(articles, $cont){

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
		article.hover = 'Afficher les détails';
	}
	$('#item-tmpl').tmpl(articles).appendTo($cont);
	//attach object to elements
	for(var i in articles){
		var article = articles[i];
		$('#item_'+article.index).data('article', article);
	}
	
	$('li', $cont).click(function(){
		displayArticle($(this).data('article'));
		return false;
	});
}
/**
 * Make the articles editable inline
 * @param [JQueryElement] the ul element that will contains the articles
 */
function makeArticlesEditable($cont){

    $cont.parent('div').addClass('editable');
    //$('#items').addClass('editable');
					
	//enable to add an article
	$cont.append("\
				<li id='ctrl-add' class='ctrl-box'>\
					<img class='icon' src='/imgs/add.png' alt='+' />\
				 	Ajouter un article \
				 </li>\
				");
	
	//add a new item by clicking the ctrl button
	$('#ctrl-add', $cont).click(function(){
		var newIndex = $('li', $cont).length - 1;
		
		$('#item-tmpl').tmpl([{
			'index'		: newIndex,
			'name'		: 'Titre',
			'shortDesc' : 'Description',
			'thumb'		: 'default.png'
		}]).insertBefore($(this));
		
		$('#item_'+newIndex).removableArea();
	});
	

	//the articles can be sorted 					
	$cont.sortable({
		cursor: 'move',
		forcePlaceholderSize: true,
		opacity: 0.6,
		placeholder: 'placeholder',
		items: 'li:not(.ctrl-box)',          //to exclude the control box
		update: function(event, ui){
			$.each($('li:not(.ctrl-box)', $cont), function(index, elt){
				elt.id = 'item_' + index;
			});
		}
	});

	$('li:not(.ctrl-box)', $cont).removableArea();
}

/**
 * Action to display the details of an article
 * @param [Object] the article data
 */
function displayArticle(article){
    $('#content').empty();
	$('#article-tmpl').tmpl([article]).appendTo($('#content'));
}

function addToolTips(){

}

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

	
	
	//get the list data
    $.get('/list/data/' + listName, function(list){

        if(buildList(list)){
			
			var $cont = $('#items > ul');
			
		    if(editMode){
				
				$('#intro').infoBubble({content : 'test test'});			
				
			    makeListEditable();
		    	if(list.update === null){
					
				}
			}
			
 
            //get the articles of the retrieved list
            $.post('/list/articles', {list: list}, function(articles){
				
				buildArticles(articles, $cont);
			
            	if(editMode){
                    makeArticlesEditable($cont);
                }				
           }, 'json');
        }
    });
    
});
