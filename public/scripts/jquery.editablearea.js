var EditableArea = {
  _editing : [],
  setupArea : function(options){
    var $elt = $(this[0]);
    var eltId = $elt.attr('id');
    function isEditing(){
        return ($.inArray(eltId, EditableArea._editing) > -1);
    }
    $elt.mouseover(function(){
        if(!isEditing()){
            $(this).css({
                'cursor': 'pointer',
                'border': 'dotted 1px orange'
            });
        }
    })
    .mouseout(function(){
        $(this).css({
            'cursor': 'default',
            'border': 'none'
        });
    })
    .click(function(){
        if(!isEditing()){
            EditableArea._editing.push(eltId);
            var $editable;
            if ( $(this).children().length === 0 ) {
                $editable = $("<input type='text' />");
                $editable.val($(this).text())
                        .attr('id', $(this).attr('id') + '_edit')
                        .width(parseInt($(this).width()) - 20 + 'px');
                $(this).empty().append($editable);
            }
            else{
                $editable = $("<textarea />");
                $editable.val($(this).html())
                        .attr('id', $(this).attr('id') + '_edit')
                        .width(parseInt($(this).width()) - 20 + 'px');
                $(this).empty().append($editable);
                $editable.wysiwyg();
            }
            
        }
    });   
  }
};

jQuery.fn.editableArea = EditableArea.setupArea;