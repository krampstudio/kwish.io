function editableArea(elt, options){
    var editing = false;
    $(elt).mouseover(function(){
        $(this).css({
            'cursor': 'pointer',
            'border': 'dotted 1px orange'
        });
    })
    .mouseout(function(){
        $(this).css({
            'border': 'none'
        });
    })
    .click(function(){
        if(!editing){
            editing = true;
            var $editable = $("<input type='text' />");
            $editable.val($(this).text())
                    .attr('id', $(this).attr('id') + '_edit');
            
            $(this).empty().append($editable);
        }
    });
    
}

/**
 * Main loop
 */
$(document).ready(function(){
    
	//loader behavior
	$("#loader").ajaxStart(function(){ $(this).show(); })
				.ajaxStop(function(){ $(this).hide(); });
                
    $('.big-button').button();
    
    var listName = $('title').text();
	
    $.get('/list/data/' + listName, function(data){
        if(data){
            $('#header').text(data.title);
            $('#intro').text(data.description);   
            editableArea($('#header'));
            editableArea($('#intro'));
        }
    });
    
});
