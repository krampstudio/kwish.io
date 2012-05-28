/**
 * Main loop
 */
$(document).ready(function(){
    
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
				.ajaxStop(function(){ $(this).hide(); });
                
    $('.big-button').button();
    
    var listName = $('title').text() || $(this).attr('title');
	
    $.get('/list/data/' + listName, function(data){
        if(data){
            $('#header').text(data.title);
            $('#intro').html('<p>'+data.description+'</p>');   
  
           $('.editable').editableArea({
                hoverClass : 'editable-hover'
           });
           $('#items > ul').sortable({
                cursor: 'move',
                forcePlaceholderSize: true,
                opacity: 0.6,
                placeholder: 'placeholder',
                items: 'li:not(.ctrl-box)'          //to exclude the control box
           });
           $('#items > ul').disableSelection();
           
        }
    });
    
});
