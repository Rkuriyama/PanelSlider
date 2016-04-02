 var ImageSlider = {};
        	ImageSlider.Sliderwidth = [];
        	ImageSlider.Slideroffsetleft = [];
        	ImageSlider.imagenumber = [];
        	ImageSlider.imagewidth = [];
        	ImageSlider.limitpos = [];
        	ImageSlider.centerpos = [];
        	ImageSlider.func = [];
        	$(function(){
        		$("div.Image_Slider").each(function(index, el) {
        			ImageSlider.Sliderwidth[index] = $(el).width();
        			ImageSlider.Slideroffsetleft[index] = $(el).offset().left;
	        		ImageSlider.imagenumber[index] = $(el).find('img').length;
	        		var li = "";
        				$(el).find('img').each(function(index, el) {
        					$(el).data('loc', index);
        				});
        			for (var i = 0; i < ImageSlider.imagenumber[index] ; i++) {
        				li = li + "<li data-list_num ='"+i+"'><a></a></li>";
        			};

        			li = "<ul data-index='"+index+"'>" + li + "</ul>";


        			$(el).data('id', index);
        			$(el).wrapInner('<div id="Slide_'+index+'" class="image-wrapper" data-id="'+index+'" />');
        			$(el).wrap('<div id="Slide_container_'+index+'" class="Slider_container" />').after(li).parent().css('width', $(el).width());;


        			if ($(el).find('img.on')[0]) {
	        			var onindex	= $(el).find('img.on').first().data('loc') + 1;
	        			$(el).next().children("li:nth-child("+onindex+")").addClass('li_on');
        				var name = ($(el).find('img.on').first().attr('alt'))? $(el).find('img.on').first().attr('alt'):"No Name";
        			}else{
        				$(el).find('img').first().addClass('on');
	        			$(el).next().children().first().addClass('li_on');
        			}
        		});



        		$("div.Image_Slider > .image-wrapper").each(function(index, el) {
        			$(el).find('img').first().on('load', function(){
	        			//image-wrapperの整形。

	        			ImageSlider.imagewidth[index] = $(el).find('img').first().width();

	        			$('<div></div>').prependTo($(el)).css({
	        				'width': (ImageSlider.Sliderwidth[index] - ImageSlider.imagewidth[index]) / 2,
	        				'height':$(el).height(),
	        				'float':'left'
	        			});
	        			$('<div></div>').appendTo($(el)).css({
	        				'width': (ImageSlider.Sliderwidth[index] - ImageSlider.imagewidth[index]) / 2,
	        				'height':$(el).height(),
	        				'float':'left'
	        			});
	        			$(el).width(ImageSlider.imagenumber[index] * ImageSlider.imagewidth[index] + ImageSlider.Sliderwidth[index] - ImageSlider.imagewidth[index]);
        				var imagepos = $(el).find("img").first().offset().left;
        				ImageSlider.centerpos[index] = imagepos;

        				ImageSlider.limitpos[index] = {
        					 "left": imagepos - (ImageSlider.imagewidth[index] / 2),
        					"right": imagepos + (ImageSlider.imagewidth[index] / 2)
        				}


						var imagelist = $(el).find("img");
        				$(imagelist).each(function( a, el) {
							var imgpos =  $(el).offset().left - ImageSlider.centerpos[index];
							var abs = Math.abs(imgpos/$(el).width());
							$(el).css({
								'opacity': 1 - ( abs / 3)
							}).addClass('img_'+a+'');
						});
        			});
        		});

				$("div.Slider_container > ul > li").on('click', function(event) {
					var Slider_index = $(this).parent().data('index');
					var img_index = $(this).data('list_num');
					var ImgNowPos = $('#Slide_'+Slider_index+' .img_'+img_index+'').offset().left;
					var NowMargin = "0px";//$("#Slide_"+Slider_index+"").parent().css('margin-left');

					// console.log(ImgNowPos + "-" + NowMargin + ":" + ImageSlider.centerpos[Slider_index]);
					var setmargin = ImgNowPos - ImageSlider.centerpos[Slider_index] ;

					$("#Slide_"+Slider_index+"").animate({
						'marginLeft': "-=" + setmargin
					},{
						duration:'slow',
						progress:function(){
							MoveOn(this);
						}
					});
					StopImageAnime('#Slide_'+Slider_index+'');
					event.stopPropagation();
				});

/////////////////////////////////////////////////////////////////////////////////////// スクロールによってImageSliderが画面内に入ったら動作させるという処理。今のとこ使ってない。
				// $(window).scroll(function(event) {
				// 	$("div.image-wrapper").each(function(index, el) {
				// 			StopSlideAnime(index);
				// 		if (CheckinView(el)) {
				// 			ImageSlider.func[index] = setInterval(function(){SlideAnime(index,el)}, 3000);
				// 		}else{
				// 			StopSlideAnime(index);
				// 		}
				// 	});
				// });

				
				// $("div.image-wrapper").each(function(index, el) {
				// 		StopSlideAnime(index);
				// 	if (CheckinView(el)) {
				// 		ImageSlider.func[index] = setInterval(function(){SlideAnime(index,el);}, 3000);
				// 	}else{
				// 		StopSlideAnime(index);
				// 	}
				// });

        	});


function StartImageAnime(element, duration){
	if(element == "All"){
		$("div.image-wrapper").each(function(index, el) {
			StopSlideAnime(index);
			ImageSlider.func[index] = setInterval(function(){SlideAnime(index,el);}, duration);
		});
		return true;
	}else if($(element).hasClass('Image_Slider')){
		var el = $(element).children('.image-wrapper').first();
		var index = el.data('id');
		if (typeof index === "number") {
			StopSlideAnime(index);
			ImageSlider.func[index] = setInterval(function(){SlideAnime(index,el);}, duration);
			return true;
		}
	}else if($(element).hasClass('image-wrapper')){
		var index = $(element).data('id');
		if (typeof index === "number") {
			StopSlideAnime(index);
			ImageSlider.func[index] = setInterval(function(){SlideAnime(index,element);}, duration);
			return true;
		}
	}
	return false;
}

function StopImageAnime(element){
	if(element == "All"){
		$("div.image-wrapper").each(function(index, el) {
			StopSlideAnime(index);
		});
		return true;
	}else if($(element).hasClass('Image_Slider')){
		var el = $(element).children('.image-wrapper').first();
		var index = el.data('id');
		if (typeof index === "number") {
			StopSlideAnime(index);
			return true;
		}
	}else if($(element).hasClass('image-wrapper')){
		var index = $(element).data('id');
		if (typeof index === "number") {
			StopSlideAnime(index);
			return true;
		}
	}
	return false;
}


function CheckinView(element){
	if (($(element).offset().top - $(window).scrollTop() + $(element).height()) > 0  && $(element).offset().top - $(window).scrollTop() < $(window).innerHeight()) {
		return true;
	}else{
		return false;
	}
}


function SlideAnime(index,element){
	var limit = ImageSlider.imagenumber[index];
	var nowImage = $(element).find("img.on").first();
	var nowImageIndex = $(element).find("img.on").data('loc');
	var nextImagepos = (nowImage.data('loc') != limit -1)? nowImage.next().offset().left : $(element).find("img").first().offset().left;
	var setmargin = nextImagepos - ImageSlider.centerpos[index]
	$(element).animate({"marginLeft": "-=" + setmargin },{
		duration: 'slow',
		progress:function(){
			MoveOn(element);
		}
	});

}


function StopSlideAnime(index){
		if(ImageSlider.func[index]){clearInterval(ImageSlider.func[index]);}
}



function MoveOn(element){
	// console.log(element);
	var onimage = $(element).find("img.on");
	var neimage = onimage.next();
	var primage = onimage.prev();
	var onimagepos = onimage.offset().left;
	var index = $(element).data('id');


	if(onimagepos < ImageSlider.limitpos[index].left){
		onimage.removeClass('on').next().addClass('on');
		var name = (neimage.attr('alt'))?neimage.attr('alt'):"No Name";
		$(element).parent().next().find('.li_on').removeClass('li_on').next().addClass('li_on');
		 $("p#Image-name-"+index+"").text(name);

	}else if(onimagepos > ImageSlider.limitpos[index].right){
		onimage.removeClass('on').prev().addClass('on');
		var name = (primage.attr('alt'))?primage.attr('alt'):"No Name";
		$(element).parent().next().find('.li_on').removeClass('li_on').prev().addClass('li_on');
		$("p#Image-name-"+index+"").text(name);
	}


	var imagelist = $(element).find("img");
	$(imagelist).each(function( a, el) {
		var imgpos =  $(el).offset().left - ImageSlider.centerpos[index];
		var abs = Math.abs(imgpos/$(el).width());
			$(el).css({
				'opacity': 1 - ( abs / 3)
			});
	});
}