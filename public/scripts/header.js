$(document).ready(function(){
 	var isLogin = "<%= is_login %>";
 	var allprob = "<%= allprob %>";
 	var passed = "<%= passprob %>";
 	var notpassed = "<%= notpassed %>";
 	var nosub = "<%= nosub %>";
 	if(isLogin == "1"){
 		$("#login_but").html("<i class=\"fa fa-sign-in\"></i> Logout");
 		$("#login_but").attr("href", "logout");
 		$("#login_but").css("color", "red");
 		$("#welcome").show();
 		$("#guest").hide();
 	}
 	else{
 		$("#login_but").html("<i class=\"fa fa-sign-in\"></i> Login");
 		$("#login_but").attr("href", "login");
 		$("#login_but").css("color", "rgba(0, 0, 0, 0.7)");
 		$("#welcome").hide();
 		$("#guest").show();
 	}
});