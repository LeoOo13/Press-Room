$(document).ready(function(){
	$(".navbar-toggle").click(function(){
		if($("body").hasClass("menu-lateral-active")){
			$("body").removeClass("menu-lateral-active");
			//$(".navbar-fixed-top").removeClass("navbar-left");
			$(".menu-lateral").removeClass("menu-lateral-in");
			$(".wrapper-sup").removeClass("sup-active");	
			$(".navbar-header .navbar-toggle").removeClass("button-menu-in");
			$(".navbar-brand").removeClass("navbar-brand-out");
		}
		else{
			$("body").addClass("menu-lateral-active");
			//$(".navbar-fixed-top").addClass("navbar-left");
			$(".menu-lateral").addClass("menu-lateral-in");
			$(".wrapper-sup").addClass("sup-active");
			$(".navbar-header .navbar-toggle").addClass("button-menu-in");
			$(".navbar-brand").addClass("navbar-brand-out");
		}
	});
});