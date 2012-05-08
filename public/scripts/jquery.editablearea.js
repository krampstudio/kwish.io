(function( $ ){
    
    "use strict";
    
    var EditableArea = {
        _editing : [],
        _isEditing: function(id){
            return ($.inArray(id, EditableArea._editing) > -1);
        },
        setupArea: function(options){      
            var opts = options || {};
            return this.each(function() {
                var $elt = $(this);
                var id = $elt.attr('id');
                if(!id){
                    $.error('editable areas must be identified by a unique id');   
                }
                $elt.mouseover(function(){
                    if(!EditableArea._isEditing(id)){
                        $elt.css('cursor', 'pointer');
                        if(opts.hoverClass){
                            $elt.addClass(opts.hoverClass);
                        }
                    }
                })
                .mouseout(function(){
                    $elt.css('cursor', 'default');
                    if(opts.hoverClass){
                        $elt.removeClass(opts.hoverClass);
                    }
                })
                .click(function(){
                    
                    if(!EditableArea._isEditing(id)){
                        EditableArea._editing.push(id);
                        var type = ($elt.children().length === 0) ? 'text' : 'wysiwyg';
                        var $editable;
                        if (type == 'text') {
                            $editable = $("<input type='text' />");
                            $editable.val($elt.text())
                                    .attr('id', id + '_edit')
                                    .width(parseInt($elt.width(), 10) - 20 + 'px');
                            $elt.empty().append($editable);
                        }
                        else{
                            $editable = $("<textarea />");
                            $editable.val($elt.html())
                                    .attr('id', id + '_edit')
                                    .width(parseInt($elt.width(), 10) - 20 + 'px');
                            $elt.empty().append($editable);
                            $editable.wysiwyg();
                        }
                        $elt.data('editableArea', {type : type});
                        if(opts.fieldClass){
                            $elt.addClass(opts.fieldClass);
                        }
                        var $controlBox = $("<div class='editablearea-control-box'><a id='"+id +"_edit_control' href='#'>ok</a></div>");
                        $elt.append($controlBox);
                        $('#'+id+'_edit_control').click(function(){
                           console.log('#'+id+'_edit_control');
                           var eltId = $(this).attr('id').replace('_edit_control', '');
                            console.log($('#'+eltId).editableArea('getValue'));
                            
                        });
                    }
                })
                .bind('editableArea.close', EditableArea.closeArea);
            });
        },
        closeArea : function(){
            return this.each(function() {
                var $elt = $(this);
                if(EditableArea._isEditing($elt.attr('id'))){
                    var data = $elt.data('editableArea');
                    switch(data.type){
                    case 'wysiwyg': 
                        $elt.empty().html($elt.editableArea('getValue'));
                        break;
                    case 'text': $elt.empty().text($elt.editableArea('getValue'));
                        $elt.empty().html($elt.editableArea('getValue'));
                        break;
                    }
                    EditableArea._editing.splice(EditableArea._editing.indexOf($elt.attr('id')));
                }
            }); 
        },
        getValue : function(){
            var values = [];
            this.each(function() {
                var $elt = $(this);
                if(EditableArea._isEditing($elt.attr('id'))){
                    var $editable = $('#' +$elt.attr('id') + '_edit', $elt);
                    var data = $elt.data('editableArea');
                    switch(data.type){
                    case 'text': 
                        values.push($editable.val());
                        break;
                    case 'wysiwyg': 
                        values.push($editable.wysiwyg('getContent'));
                        break;
                    }
                }
            }); 
            
            return values;
        }
    };

    $.fn.editableArea = function( method ) {        
        if ( EditableArea[method] ) {
          return EditableArea[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return EditableArea.setupArea.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.editableArea' );
        }    
    };

})( jQuery );