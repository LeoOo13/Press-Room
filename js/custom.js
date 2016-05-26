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
	$(".site-map-nav-title").click(function(){
		if($(this).parent(".col-sm-3").hasClass("active"))
			$(this).parent(".col-sm-3").removeClass("active");
		else
			$(this).parent(".col-sm-3").addClass("active");
	});
	/*Asset publisher News behavior */
    $(".press-news-asset .portlet-body > .asset-abstract:first-of-type").prepend("<div class='abstract-custom-caption'></div>");
    $(".press-news-asset .portlet-body > .asset-abstract:first-of-type .asset-actions").appendTo(".abstract-custom-caption");
    $(".press-news-asset .portlet-body > .asset-abstract:first-of-type .asset-title").appendTo(".abstract-custom-caption");
    $(".press-news-asset .portlet-body > .asset-abstract:first-of-type .asset-content").appendTo(".abstract-custom-caption");
    $(".press-news-asset .portlet-body > .asset-abstract:first-of-type .asset-metadata").appendTo(".abstract-custom-caption");
});