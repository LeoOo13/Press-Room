$(document).ready(function(){
	$(".navbar-toggle").click(function(){
		if($("body").hasClass("menu-lateral-active")){
			$("body").removeClass("menu-lateral-active");
			$(".navbar-fixed-top").removeClass("navbar-left");
			$(".menu-lateral").removeClass("menu-lateral-in");	
		}
		else{
			$("body").addClass("menu-lateral-active");
			$(".navbar-fixed-top").addClass("navbar-left");
			$(".menu-lateral").addClass("menu-lateral-in");

		}
	});
});