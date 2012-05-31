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
  
           $('.editable').editableArea({
                hoverClass : 'editable-hover'
           });
           
           $.post('/list/articles', {list: list}, function(articles){
            var $list = $('#items > ul');
            for (index in articles){
                $list.append('<li>'+articles[index].name+'</li>');
            }
             $list.append("<li class='ctrl-box'></li>");
             
             $list.sortable({
                cursor: 'move',
                forcePlaceholderSize: true,
                opacity: 0.6,
                placeholder: 'placeholder',
                items: 'li:not(.ctrl-box)'          //to exclude the control box
           });
             
           }, 'json');
           
           
         //  $('#items > ul').disableSelection();
           
           
        }
    });
    
});
