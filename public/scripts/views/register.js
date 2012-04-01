$(document).ready(function(){
    $(":text[name='bwlogin']").blur(function(){
       var $field = $(this);    
       if($field.val().length > 0){
            $.post('/site/checkLogin', 
            {login: $field.val()}, 
            function(data){
                if(data.available === true){
                   $field.parent('div').remove('.ui-icon').append("<span class='ui-icon ui-icon-circle-close'></span>");
                }
                else{
                   $field.parent('div').remove('.ui-icon').append("<span class='ui-icon ui-icon-circle-check'></span>");
                }
            }, 'json');
       }
    });
});