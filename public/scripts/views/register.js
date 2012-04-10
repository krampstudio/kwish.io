$(document).ready(function(){
    $(":text[name='bwlogin']").blur(function(){
       var $field = $(this);    
       if($field.val().length > 0){
            $.post('/site/checkLogin', 
            {login: $field.val()}, 
            function(data){
                var $parent = $field.parent();
                $parent.find('.ui-icon').remove();
                $parent.find('.form-info').remove();
                if(data.available === true){
                  $parent.append("<span class='ui-icon ui-icon-circle-check'></span>");
                }
                else{
                   $parent.append("<span class='ui-icon ui-icon-circle-close'></span><span class='form-info'>Pseudo non disponible</span>");
                }
            }, 'json');
       }
    });
});