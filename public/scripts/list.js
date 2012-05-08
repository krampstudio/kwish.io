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
  
           $('#header').editableArea();
           $('#intro').editableArea();
           
           $('#test').click(function(){
                console.log($('#header').editableArea('getValue')); 
                console.log($('#intro').editableArea('getValue')); 
           });
        }
    });
    
});
