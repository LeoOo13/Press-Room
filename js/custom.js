$(document).ready(function(){
    var prep = ["and", "at", "du"];
    var joya = "JOYÀ"
    /*Topics*/
    $("li[class^='tag-popularity'] strong").each(function(){
        var pal = $(this).text();
        var palabras = pal.split(" ");
        var cadena = "";
        var aux="";
        for( var i = 0; i < palabras.length; i++){
            for(var j = 0; j < prep.length; j++){
                if(prep[j] != palabras[i])
                    if(palabras[i] != "joyà")
                        aux = palabras[i].charAt(0).toUpperCase()+ palabras[i].slice(1);
                    else
                        aux="JOYÀ";
                else{
                    aux = palabras[i].toLowerCase();
                    break; 
                }
            }
            cadena = cadena + " " + aux;
        }
      $(this).replaceWith("<strong>" + cadena + "</strong>");
    });


    /*Contenido read more */
    $('.asset-more a').each(function(){
        $(this).empty().text("READ MORE >");
    });
    /*Title sections off Asset publisher*/
    if($('.asset-full-content').length > 0){
        $('.portlet-title-section-on').removeClass('portlet-title-section-on').addClass('portlet-title-section-off');
        $('.press-news-asset .taglib-header h1.header-title').addClass('portlet-title-section-off');
    }else{
        $('.portlet-title-section-off').removeClass('portlet-title-section-off').addClass('portlet-title-section-on');
    }
    
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

    
    /*Pagination*/
    var funcion = $(".page-selector .aui-field-input-select").attr("onchange");
    var paginacion = "<div class='pag-num'>";
    actual = $(".page-selector .aui-field-input-select").val();
    ultimo=0;

    /*boton de previos*/
    if (actual > 1) {
        paginacion+="<a class='paginacion previous' onclick='pags(" + (actual - 1) + ")'><span>Previous</span></a>"
    };
    /*Paginas por numero*/
    $(".page-selector .aui-field-input-select option").each(function() {
        if (actual == $(this).val()) {/*pagina activa*/
            paginacion += "<a class='paginacion active-pagination' onclick='pags(" + $(this).val() + ")'><span>" + $(this).val() + "</span></a>";
        }else{
            paginacion += "<a class='paginacion' onclick='pags(" + $(this).val() + ")'><span>" + $(this).val() + "</span></a>";
        } 
        ultimo=$(this).val();
    });
    /*boton siguiente*/
    if ( ultimo == actual ) {
        paginacion += "</div>";            
    }else{
        actual = parseInt(actual) + 1;
        paginacion += "<a class='paginacion paginacion-next' onclick='pags(" + actual + ")'><span>Next</span></a></div>";    
    }

    if ($(".press-news-asset .portlet-body .taglib-page-iterator").length) {
        $(".press-news-asset .portlet-body .taglib-page-iterator").append(paginacion);
    }else 
    if ($(".press-kit-asset .portlet-body .taglib-page-iterator").length) {
        $(".press-kit-asset .portlet-body .taglib-page-iterator").append(paginacion);
    }else 
    if ($(".press-release-asset .portlet-body .taglib-page-iterator").length) {
        $(".press-release-asset .portlet-body .taglib-page-iterator").append(paginacion);
    };

    
    var pp = $(".active-pagination span").text();
    if ( pp == 1 && false) {
        var imageSource = $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type img.asset-small-image").attr("src");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type").css("background-image","url('" + imageSource + "')"); 

        console.log("pagina" + pp);
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type").addClass("main-new");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type.main-new").prepend("<div class='abstract-custom-caption'></div>");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type.main-new .asset-actions").appendTo(".abstract-custom-caption");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type.main-new .asset-title").appendTo(".abstract-custom-caption");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type.main-new .asset-content").appendTo(".abstract-custom-caption");
        $(".press-news-asset.press-news-asset-home .portlet-body > .asset-abstract:first-of-type.main-new .asset-metadata").appendTo(".abstract-custom-caption");

    }

    /*Portlet search This site configuration*/
    $(".portlet-search form select option").each(function(){
    	if($(this).val() != "0")
    		$(this).attr("selected","");
    	else
    		$(this).removeAttr("selected");
	});

    /*topics filter*/
    if($("h1.taglib-categorization-filter .asset-entry").length){
        var currTopic = $("h1.taglib-categorization-filter .asset-entry").text();
        var eliminar = $("h1.taglib-categorization-filter .asset-entry a")
        currTopic = "\"" + currTopic.trim() + "\"";
         $("h1.taglib-categorization-filter .asset-entry").html(currTopic);
         $("h1.taglib-categorization-filter .asset-entry").append(eliminar);

    }
    

});



    function pags(num) {
        $(".page-selector .aui-field-input-select").val(num);
        $(".page-selector .aui-field-input-select").trigger("change");
    }