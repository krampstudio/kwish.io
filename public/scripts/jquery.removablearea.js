(function( $ ){
    "use strict";
    
    var RemovableArea = {
        _opts : {
 			label 		: 'Supprimer',
			img			: '/imgs/delete.png',
			warning		: 'Voulez-vous supprimer cet élément?', 
			hoverClass	: 'half-opac'
        },
        setupArea: function(options){      
            var opts = $.extend(true, {}, RemovableArea._opts, options);
            return this.each(function() {
                var $elt = $(this);
				if($elt.css('position') != 'relative'){
					$elt.css('position', 'relative');
				}
				var $ctrl = $("<img class='removable-ctrl' src='"+opts.img+"' alt='"+opts.label+"' title='"+opts.label+"'>");
				$ctrl.css({
					'display' 	: 'none',
					'position'	: 'absolute',
					'right'		: '5px',
					'top'		: '5px',
					'cursor'	: 'pointer'
				});
				$ctrl.hover(function(){
					$(this).addClass(opts.hoverClass);
				}, function(){
					$(this).removeClass(opts.hoverClass);
				});
				;
				$elt.append($ctrl);
				$elt.mouseover(function(){
					$('.removable-ctrl', $(this)).show();
				});
				$elt.mouseout(function(){
                    $('.removable-ctrl', $(this)).hide();
                });
				$ctrl.click(function(){
					if(confirm(opts.warning)){
						$elt.remove();
					}
				});
			});
        },
        destroy : function(){
            this.each(function() {
            	var $elt = $(this);
				$('.removable-ctrl', $elt).remove();
			});
        }
    };

    $.fn.removableArea = function( method ) {        
        if ( RemovableArea[method] ) {
          return RemovableArea[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return RemovableArea.setupArea.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.removableArea' );
        }    
    };

})( jQuery );
