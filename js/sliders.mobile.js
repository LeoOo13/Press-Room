/* MOSTROHOUSE
sliders_mobile.js

USAGE

HTML STRUCTURE 
<div data-slider-type="slide">
  ...
  <div data-slider-element="slides">
    <section>...</section>
    ...
  </div>
  <ul data-slider-element="thumbs">
    <li></li>
    ...
  </ul>
  <ul>
    <li data-slider-element="next"> Next</li>
    <li data-slider-element="prev"> Prev</li>
  </ul>
  ... 
</div>

data-slider-thumbs = "carousel|static"
  "carousel" enables thumb list navigation
data-slider-controls = "thumbs|arrows"
  "arrows" adds prev and next buttons
data-slider-autoslide = "NUMBER"
  NUMBER numeric value indicating the autoslide time
data-slider-type="swipe|slidefade"
  "swipe" only available on touch devices
  "slide" available in all devices, a simple slide transition
  "fade" available in all devices, a simple fade in/out transition
  The default is "slide"

data-slider-element="slides|thumbs|next|prev"
  "slides" must be set to the element containing the slides
  "thumbs" must be set to the element containing the thumbs, descriptions, dots or numbers
  "next" must be set to the element you want to trigger the next slide action  
  "prev" must be set to the element you want to trigger the previous slide action 

data-slider-overflow="visible|hidden"
  If set to visible, the next and prev slides will be visible at the sides of the current slide. It might be overwritten by css.
  The default is hidden. 

*/

'use strict';
var sliders = {
  wrapper : {}, // The slider wrapper 
  instance : {},
  transform : "",
  transition : "",
  elems : {}, // the slide
  parent : {},
  type : "",
  length : 0,
  thumbs : {},
  btn : {},
  x_start : undefined,
  x_end : undefined,
  active_index : -1,
  loop : false,
  transition_time : 400, 
  init : function (elem) {
    var _self = this;     
    _self.thumbsCarouselId = $(elem).find('[data-thumbs-carousel]').attr('data-tc-instance');
    _self.thumbsCarouselId = parseInt(_self.thumbsCarouselId);
    _self.build_slider(elem);
    if ('WebkitTransform' in document.body.style ){
      _self.transform = 'WebkitTransform';
      _self.transition = 'WebkitTransition';
    }else if('MozTransform' in document.body.style){
      _self.transform = 'MozTransform';
      _self.transition = 'MozTransition';
    }else if('OTransform' in document.body.style ){
      _self.transform = 'OTransform';
      _self.transition = 'OTransition';
    }else if('transform' in document.body.style){
      _self.transform = 'transform';
      _self.transition = 'transition';
    }
    
  },
  build_slider : function (elem) {
    var _self = this,
      touch,
      first_slide;
     
    touch = 'ontouchstart' in document.documentElement ? true : false;
   
    
    _self.wrapper = $(elem);
    _self.iframes = _self.wrapper.find('iframe');
    _self.videos = _self.wrapper.find('video');
    
    _self.parent = _self.wrapper.find('[data-slider-element="slides"]');
    _self.wrappers = _self.parent.children(); //Defining property elems of slides which contains the nodes to slide 
    _self.thumbs = _self.wrapper.find('[data-slider-element="thumbs"]').children();
    _self.btn.next = _self.wrapper.find('[data-slider-element="next"]');
    _self.btn.prev = _self.wrapper.find('[data-slider-element="prev"]');
    _self.fullscreen = _self.wrapper.attr('data-slider-fullscreen') == undefined ? false : true;
    
    // Checks if data-slider-controls attribute is set, if so, makes an array containing it's values, iterates over it, and checks if this controls hasn't been set as markup yet. If they're not already set, it creates them
    if(_self.wrapper.attr('data-slider-controls')){
      var controls;
      controls = _self.wrapper.attr('data-slider-controls').split(" ");
      for (var i = 0; i < controls.length; i++){
        switch (controls[i]) {
          case "thumbs":
            
          break;
          case "arrows":
            if(_self.btn.next[0] == undefined || _self.btn.prev[0] == undefined) {
              _self.wrapper.find('.slider-inner').append('<ul class="slider-arrows"><li data-slider-element="prev">Prev</li><li data-slider-element="next">Next</li></ul>');
              _self.btn.next = _self.wrapper.find('[data-slider-element="next"]');
              _self.btn.prev = _self.wrapper.find('[data-slider-element="prev"]');
            }
          break;
        }
      }
    }
    
    _self.type = _self.wrapper.attr("data-slider-type") != "" ? _self.wrapper.attr("data-slider-type") : "slide";
    _self.overflow = _self.wrapper.attr("data-slider-overflow") == "visible" ? "visible" : "hidden"; 
    _self.loop = _self.wrapper.attr("data-slider-loop") == "true" ? true : false;
    _self.length = _self.wrappers.length;
    _self.original_length = _self.length;
    

    _self.parent.css({
      overflow : _self.overflow
    });
    _self.parent.addClass('no-transform');
    
    // Define the index of first slide and then add class "active" to corresponding elements 
    var preactive = _self.parent.find('.active');
    
    first_slide = _self.wrapper.attr('data-slider-first') !== undefined ? parseInt(_self.wrapper.attr('data-slider-first')) : 0;    
    
    first_slide = preactive[0] !== undefined ? _self.parent.children().index(preactive) : first_slide; 
    
    
    _self.wrappers.eq(first_slide).addClass('active');
    _self.thumbs.eq(first_slide).addClass('active');
    _self.active_index = first_slide;
    /*condicion para el zoom de travel-info*/
    if(_self.wrapper.hasClass( "zoomImage" )){
      if(_self.fullscreen) _self.fullscreenHandler();
    }
    if(_self.length <= 1) {
      _self.wrapper.addClass('single');
      _self.btn.next.add(_self.btn.prev).add(_self.thumbs).css({"display" : "none"});
      return; // There must be at least 2 slides
    }
    
    // The minimum length to make a loop effect is 5, so we make sure that there are always at least 4 slides;

    // if(_self.loop){
    //   switch (_self.length) {
    //     case 2:
    //       for(var i = 0; i < 1; i++){
    //         _self.wrappers.each(function () {
    //           $(this).clone().removeClass('active').addClass('ghost').appendTo(_self.parent);
    //         });
    //       }
    //     default:
    //       _self.wrappers.each(function () {
    //         $(this).clone().removeClass('active').addClass('ghost').appendTo(_self.parent);
    //       });
    //     break;
    //   }
    //     
    // }
    _self.wrappers.each(function(i){
      var slideCount;
      slideCount = i + 1 + " / " + _self.length;
      $(this).attr('data-slide', slideCount);
    });

    if(_self.loop && _self.length <= 5){
      _self.wrappers.each(function () {
        $(this).clone().removeClass('active').addClass('ghost').appendTo(_self.parent);
      });
    }
    //recalculate slides lenght in case it has new chidren for loop effect
    _self.wrappers = _self.parent.children(); //Defining property elems of slides which contains the nodes to slide 
    _self.length = _self.wrappers.length; 
    
    
    // Set up all elements according to the actual state
    _self.stage(first_slide);
    
    if(_self.type === "swipe" && touch){
      _self.swipe_handler(_self.wrapper);
    } else {
      _self.buttons_handler();
      _self.thumbs_handler();
    }
        _self.arrows = _self.wrapper.find('.slider-arrows');

    var autoslide = parseFloat(_self.wrapper.attr('data-slider-autoslide'));
    if(!isNaN(autoslide)){      
      
      var delay = autoslide * 1000;
      _self.interval = setInterval(function () {
        _self.next('next');
      }, delay);
      
      _self.wrapper.hover(function () {
        //PAUSE AUTOSLIDE ON HOVER
        clearInterval(_self.interval);
      }, function () {
        //RESUME AUTOSLIDE ON OUT
        _self.interval = setInterval(function () {
          _self.next('next');
        }, delay);
      });
    }
    
    if(_self.wrapper.attr('data-slider-fill') !== undefined){
      _self.fill();
    }
    
  },
  stage : function (index_center) {
    var _self = this,
      index_right,
      index_far_right,
      index_left,
      index_far_left,
      index_overflow_right,
      index_overflow_left;
    if(_self.loop){      
      index_overflow_right = index_center + 2 - _self.length;
      index_overflow_left = index_center - 2; 
      
      index_right = index_center + 1 >= _self.length ? 0 : index_center + 1; // if slide + 1 is still in the range of available slides
      index_far_right = index_center + 2 >= self.length ?  index_overflow_right : index_center + 2;
      index_left = index_center - 1 >= 0 ? index_center - 1 : _self.length - 1;  
      index_far_left = index_overflow_left; 
    }else {
      index_right = index_center + 1; 
      index_far_right = index_center + 2;
      index_left = index_center - 1 >= 0 ? index_center - 1 : _self.length + 1; 
      index_far_left = index_center - 2 >= 0 ? index_center - 2 : _self.length + 1;
    }



    _self.stopVideos();
    if(_self.wrappers.eq(index_center).hasClass('slide-video')){
      _self.wrapper.addClass('showing-video');
    } else {
      _self.wrapper.removeClass('showing-video');
    }
    _self.wrappers.eq(index_center).addClass('active');
    _self.wrappers.eq(index_right).addClass('right');
    // _self.wrappers.eq(index_far_right).addClass('far-right');
    // _self.wrappers.eq(index_far_left).addClass('far-left');
    _self.wrappers.eq(index_left).addClass('left');

    _self.thumbs.parent().find('.active').removeClass('active');
    
    switch (_self.loop) {
      case true:
        if (index_center > _self.original_length - 1 ){
          _self.thumbs.eq(index_center%_self.original_length).addClass('active');
        }else {
          _self.thumbs.eq(index_center).addClass('active');
        } 
      break;
      default:
        _self.thumbs.eq(index_center).addClass('active');    
    }
    if(!isNaN(_self.thumbsCarouselId)){
      tcInstances[_self.thumbsCarouselId].moveCarousel(index_center);   
    }
    _self.status = "idle";
  },
  buttons_handler : function () {
    var _self = this;
    
    _self.btn.next.add(_self.btn.prev).click(function () {
      var direction;
      _self.active_index = _self.wrappers.index(_self.parent.find('.active'));
      direction = $(this).attr("data-slider-element")

      switch (_self.loop) {
        case false:
          if(direction == "next" && _self.active_index != _self.wrappers.length - 1 && _self.status != "active"){
            _self.next("next");
          } else if(direction == "prev" && _self.active_index != 0 && _self.status != "active"){ 
            _self.next("prev");
          }
        break;
        case true:
          if(direction == "next" && _self.status != "active"){
            _self.next("next");;
          } else if(direction == "prev"&& _self.status != "active"){ 
            _self.next("prev");
          }
        break; 
      }
    });
  },
  swipe_handler : function (elem) {
    var
      _self = this,
      transform,
      start_time,
      start_x,
      start_y,
      end_x,
      end_y,
      active_index,
      distance,
      distance_y,
      end_time;
    
    transform = _self.transform;
    
    elem.bind('touchstart', function (e) {
      var o = e.originalEvent;
      start_time = o.timeStamp;
      start_x = o.touches[0].pageX;
      start_y = o.touches[0].pageY;
    });
    
    elem.bind('touchmove', function (e) {
      if (_self.status == "active") return;
      
      var o = e.originalEvent;
      distance = start_x - o.touches[0].pageX;
      distance *= -1;
      distance_y = Math.abs(start_y - o.touches[0].pageY);
      _self.wrapper.find('.active, .right, .left, .far-right, .far-left').css({
        transform : "translateX(" + distance + "px)"
      });
      
    });
    elem.bind('touchend', function (e) {
      
      if (_self.status == "active") return;
      
      var o = e.originalEvent,
        
      end_time = o.timeStamp;
      _self.active_index = _self.wrappers.index(_self.wrapper.find('.active'));
      
      switch (_self.loop) {
        case true:
          if(distance < 0 && distance_y < 22){ 
            _self.next("next");
          }else if(distance > 0 && distance_y < 22){
            _self.next("prev");
          }else {
            _self.still();
          }
        break;
        case false:
          if(distance < 0 && _self.active_index != _self.wrappers.length - 1 && distance_y < 22){ 
            _self.next("next");
          }else if(distance > 0 && _self.active_index != 0 && distance_y < 22){
            _self.next("prev");
          }else {
            _self.still();
          }
        break;
      }      
    });
  },
  next : function (dir, index) {
    var _self = this,
      transform = this.transform,
      transition = this.transition,
      new_right_index,
      new_left_index,
      width;
      
    _self.status = "active";
    dir = dir == undefined ? "next" : dir;    
    width = dir == "next" ? _self.parent.width()*-1 : _self.parent.width();  
    if(index != undefined && Math.abs(index - _self.active_index) > 1){
      width = width*4;
      if(_self.loop){
        new_right_index = index + 1 > _self.length ? 0 : index + 1;
        new_left_index = index - 1; 
      } else {
        new_right_index = index + 1
        new_left_index = index - 1 >= 0 ? index - 1 : _self.length + 1; 
      }

      _self.wrappers.eq(index).addClass("new-center new-set");
      _self.wrappers.eq(new_right_index).addClass("new-right new-set");
      _self.wrappers.eq(new_left_index).addClass("new-left new-set");
      
      if(dir == "prev"){
        _self.parent.find('.new-set').addClass('prev');
      }
      _self.active_index = index;      
    } else {
      _self.active_index = dir == "next" ? _self.wrappers.index(_self.wrapper.find('.right')) : _self.wrappers.index(_self.wrapper.find('.left'));    
    }
    
    _self.parent.find('.active, .right, .left, .far-right, .far-left, .new-set').css({
      transform : "translateX(" + width + "px)",
      transition : "all ." + _self.transition_time/100 + "s" 
    });
        
    setTimeout(function () {
      _self.parent.find('.active, .right, .left, .far-right, .far-left, .new-set').css({
        transform : "",
        transition : "" 
      }).removeClass('active right left far-right far-left prev new-set new-center new-left new-right');
      
      _self.stage(_self.active_index);

    }, _self.transition_time);


  },
  still : function () {
    var _self = this,
      transform = this.transform;
    
    _self.wrappers.css({
      transform : "",
      transition : ""
    });
  },

  thumbs_handler : function () {
    var _self = this,
      node_index;
    
    _self.thumbs.click(function () {
      node_index = _self.thumbs.index($(this));
      _self.thumbs.removeClass('active');
      if (node_index == _self.active_index + 1){
        _self.next("next");
      } else if (node_index == _self.active_index - 1) {
        _self.next("prev");
      } else if (node_index > _self.active_index + 1) {
        _self.next("next", node_index);
      } else if (node_index < _self.active_index - 1) {
        _self.next("prev", node_index);
      }        
    });

  },
  fullscreenHandler : function () {
    var _self;
    _self = this;
    
    _self.fsButton = $('<button class="button button-fullscreen">fullscreen</button>');
    
    _self.wrapper.prepend(_self.fsButton);
    
    _self.fsButton.click(function () {
      _self.stopVideos();
      _self.goFullscreen();
    });
  }, 
  stopVideos : function (){
     var _self = this;
     _self.videos.each(function(){
        //console.log(this);
        this.paused ? true : this.pause();
        //this.pause();
     });
    /*var videos = document.getElementsByTagName("video");
    for (var i = 0; i < videos.length; i++) { 
        videos[i].pause();
    }*/
  },
  goFullscreen : function () {
    var _self,
    _self = this;
    
    _self.modalWrap = $('<div class="modal-slider-wrap"></div>');
    _self.closeModalSlider = $('<button class="close-modal">Cerrar</button>');
    _self.modalSlider = _self.wrapper.clone(false, false);
    
    //console.log($(_self.modalSlider).find(".slide-video"));
    $(_self.modalSlider).find(".slide-video").each(function(){
      $(this).remove();
    });
    
    _self.modalSlider.append(_self.closeModalSlider);    
    _self.modalWrap.append(_self.modalSlider);

    $('body').append(_self.modalWrap);
    _self.newInstance = Object.create(sliders);
    _self.newInstance.init(_self.modalWrap[0]);

    _self.modalWrap.prepend(_self.newInstance.arrows); 
  
    _self.modalWrap.click(function (e) {
      if($(e.target).hasClass('modal-slider-wrap') || $(e.target).hasClass('slide')){
        _self.exitFullscreen();
      }
    });
    _self.closeModalSlider.click(function(){
      _self.exitFullscreen();
    });

    $('body').bind('keydown', function (e) {
      switch (e.keyCode) {
        case 27:
          _self.exitFullscreen();          
        break;
        case 39:
          _self.newInstance.next('next');
        break;
        case 37:
          _self.newInstance.next('prev');
        break;
      }
    });  
  },
  exitFullscreen : function () {
    var _self = this;
    _self.modalWrap.fadeOut(300, function () {
      _self.modalWrap.remove();
    });
    $('body').unbind('keydown');
  } 
};

sliders.fill = function(){
  // var _self,
  //   W;

  // _self = this;
  // W = _self.getDimensions();
  
  // console.log(_self.wrapper.width() / _self.wrapper.height());
}
sliders.getDimensions = function(){
  var _self,
    dimensions,
    W;

  _self = this;

  W = $(window); //Viewport
  dimensions = {};
  dimensions.w = W.width(); // Viewport Height
  dimensions.h = W.height(); // Viewport Height
  return dimensions;
}

var thumbsCarousel = {
  init: function (item) {
    var _self;
    
    _self = this;
    _self.item = $(item);
    _self.maxItems = _self.item.attr('data-thumbs-carousel');
    _self.thumbsWrap = _self.item.find('[data-slider-element="thumbs"]');
    _self.thumbOriginalWidth = 100 / _self.maxItems;
    _self.thumbsLength = _self.thumbsWrap.children().length;
    _self.walked = 0;
    _self.wrapWidth = (100/_self.maxItems) * _self.thumbsLength; 
    _self.thumbWidth = (_self.thumbOriginalWidth * 100) / _self.wrapWidth;
    _self.overflow = _self.wrapWidth - 100;
    _self.activeBatch = 1;
    
    
    _self.item.attr('data-tc-instance', tcInstances.length - 1);
    _self.thumbsWrap.css({
      'width': _self.wrapWidth + '%'
    });
    
    
    _self.thumbsWrap.children().css({
      'width' : _self.thumbWidth + '%'
    });
    
    _self.arrows = _self.item.find('.thumb-arrows');  
    
    if(_self.arrows[0] === undefined){ 
      _self.arrows = $('<ul class="thumb-arrows"><li data-slider-element="thumb-prev">Prev</li> <li data-slider-element="thumb-next">Next</li>');
      _self.item.append(_self.arrows);
    }
    
    _self.thumbPrev = _self.item.find('[data-slider-element="thumb-prev"]');
    _self.thumbNext = _self.item.find('[data-slider-element="thumb-next"]');

    if(_self.thumbsLength <= _self.maxItems){
      _self.item.addClass('no-arrows');
    }
     
    _self.thumbPrev.click(function () {
      _self.goPrev(); 
    });
    _self.thumbNext.click(function () {
      _self.goNext();
    });

  },
  goNext: function () {
    var _self,
      distanceLeft,
      distance;
      
    _self = this;

    distanceLeft = _self.overflow - _self.walked;

    if(distanceLeft > 100){
      distance = 100;
    } else if(distanceLeft > 0){
      distance = distanceLeft;
    } else {
      distance = 0;
    } 

    _self.thumbsWrap.animate({
      'left' : '-'+ (distance + _self.walked) + '%'
    }, 200);

    _self.walked += distance;
  },
  goPrev: function () {
    var _self,
      distance,
      distanceLeft;
      
    _self = this;
    distanceLeft = _self.walked - _self.overflow;

    if(_self.walked > 100){
      distance = -100;
    } else if (_self.walked > 0){
      distance = -_self.walked
    } else {
      distance = 0;
    }
    _self.thumbsWrap.animate({
      'left' : '-'+ (_self.walked + distance) + '%'
    }, 200);

    _self.walked += distance;
  },
  setBatch: function(batch){
    switch(batch){
      case 'start':

        break;
      case 'end':
        break;
    }

  },
  moveCarousel: function(thumbIndex){
    var _self,
      diff,
      batchSpan;

    _self = this;
    thumbIndex = thumbIndex % _self.thumbsLength;
    batchSpan = _self.maxItems * _self.activeBatch > _self.thumbsLength-1 ? _self.thumbsLength-1 :  _self.maxItems * _self.activeBatch;
    switch(thumbIndex){
      case 0:
        _self.thumbsWrap.animate({
          'left' : '0%'
        }, 200);
        // console.log('first');
        _self.activeBatch = 1;
      break;
      case _self.thumbsLength - 1:
        var goTo = _self.wrapWidth - 100;
        _self.thumbsWrap.animate({
          'left' : '-' + goTo + '%'
        }, 200);
        _self.activeBatch = Math.ceil(_self.thumbsLength / _self.maxItems);
        // console.log('last');
      break; 
      default:
        diff = batchSpan - thumbIndex;
        if(diff <= 0){
          _self.goNext();
          _self.activeBatch ++;
        } else if (diff >= _self.maxItems){
          _self.goPrev();
          _self.activeBatch --;
        } 
        break;
    }
    // console.log(thumbIndex, _self.activeBatch);
  },
  setArrows: function(){
  
  }
};


var slider_instances = [],
  tcInstances = [];
(function ($) { 
  $('[data-thumbs-carousel]').each(function (i) {
    tcInstances[i] = Object.create(thumbsCarousel);
    tcInstances[i].init(this);
  });
  $('[data-slider-type]').each(function (i) {
    slider_instances[i] = Object.create(sliders);
    slider_instances[i].init(this);
  });

}(jQuery));