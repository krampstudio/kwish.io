$(document).ready(function(){
	
	$("#connector").click(function(){
		$("#login-form").toggle();
	});
	$("#login-form input:button").button().click(function(){
		var login = $('#login', $("#login-form")).val();
		var passwd = $('#passwd', $("#login-form")).val();
		if(login != '' && passwd != ''){
			$.post(
				'login', 
				{login: login, passwd: passwd}, 
				function(data){
					if(data.loggedIn){
						window.location.reload();
					}
				},
				'json'
			);
		}	
	});
	
	$('#content').tabs({selected : 0});
	
});