jQuery(document).ready(function($){
	"use strict";

	/* PRELODER */
	$(window).load(function(){
		$('.preloader').fadeOut(200);
	});

	window.onpageshow = function(event) {
	    if (event.persisted) {
	        window.location.reload();
	    }
	};	

	window.onunload = function(){}; 

	$(document).on( 'click', 'a', function(){
		if( $(this).parent('.client-item').length == 0 && !$(this).hasClass('popup') && !$(this).hasClass('dropdown-toggle') && $(this).attr('href')[0] != '#' && $(this).attr('href').indexOf('mailto:') == -1 && !$(this).hasClass( 'gallery-item' ) && !$(this).hasClass( 'share' ) && $(this).attr('href') !== 'javascript:;' ){
			if( !$(this).attr('target') ){
				$('.preloader').fadeIn(100);
			}
		}
	});	

	/* STICKY NAVIGATION */
	function sticky_nav(){
		var $admin = $('#wpadminbar');
		if( $admin.length > 0 && $admin.css( 'position' ) == 'fixed' ){
			$sticky_nav.css( 'top', $admin.height() );
		}
		else{
			$sticky_nav.css( 'top', '0' );
		}
	}

	var $navigation_bar = $('.navigation-bar');
	var $sticky_nav = $navigation_bar.clone().addClass('sticky_nav');
	$('body').append( $sticky_nav );

	if( $('input[name="sticky_only"]').val() == 'yes' ){
		$navigation_bar.remove();
		$sticky_nav.slideDown( 0, function(){
			var $body = $('body');
			if( !$body.hasClass('no-padding') ){
				$body.css('padding-top', $sticky_nav.height() );
			}
		});
	}

	$(window).on('scroll', function(){
		if( $(window).scrollTop() >= $navigation_bar.position().top + $navigation_bar.height() && $(window).width() > 769 ){
			$sticky_nav.slideDown();
		}
		else{
			$sticky_nav.slideUp();
		}
	});	

	sticky_nav();

	$(window).resize(function(){
		sticky_nav();
	});
	
	/* HANDLE NAVIGATION */
	function handle_navigation(){
		if( $('.standard-menu ').length > 0 ){
			if ($(window).width() >= 767) {
				$('ul.nav li.dropdown, ul.nav li.dropdown-submenu').hover(function () {
					$(this).addClass('open').find(' > .dropdown-menu').stop(true, true).hide().slideDown(200);
				}, function () {
					$(this).removeClass('open').find(' > .dropdown-menu').stop(true, true).show().slideUp(200);
		
				});
			}
			else{
				$('ul.nav li.dropdown, ul.nav li.dropdown-submenu').unbind('mouseenter mouseleave');
			}
		}
	}
	
	handle_navigation();
	$(window).resize(function(){
		setTimeout(function(){
			handle_navigation();
		}, 200);
	});		

	/* TOTAL FIXED */
	$('.total-overlay-trigger').click(function(){
		$('.total-overlay-sticky').animate({
			top: '0px',
			opacity: 1
		}, 800 );
		setTimeout(function(){
			var delay = 200;
			$('.total-overlay-sticky #navigation .nav.navbar-nav > li > a').each(function(){
				var $this = $(this);
				setTimeout(function(){
					$this.animate({
						opacity: 1,
						left: 0
					}, 100);
				},delay);
				delay += 50;
			});	
		}, 700 );		
	});

	$('.total-overlay-sticky-close').click(function(){
		$('.total-overlay-sticky').animate({
			top: '-1400px',
			opacity: 0
		}, 800, function(){
			$('.total-overlay-sticky #navigation .nav.navbar-nav > li > a').css({
				opacity: 0,
				left: '-50px'
			})
		});	
	});

	/* SUBMIT FORMS */
	$('.submit_form').click(function(){
		$(this).parents('form').submit();
	});
	
	
	/* SUBSCRIBE */
	$('.subscribe').click( function(e){
		e.preventDefault();
		var $this = $(this);
		var $parent = $this.parents('.subscribe-form');		
		
		$.ajax({
			url: ajaxurl,
			method: "POST",
			data: {
				action: 'subscribe',
				email: $parent.find( '.email' ).val()
			},
			dataType: "JSON",
			success: function( response ){
				if( !response.error ){
					$parent.find('.sub_result').html( '<div class="alert alert-success" role="alert"><span class="fa fa-check-circle"></span> '+response.success+'</div>' );
				}
				else{
					$parent.find( '.sub_result' ).html( '<div class="alert alert-danger" role="alert"><span class="fa fa-times-circle"></span> '+response.error+'</div>' );
				}
			}
		})
	} );
		
	/* contact script */
	$('.send-contact').click(function(e){
		e.preventDefault();
		var $this = $(this);
		var form = $this.parents('form');
		$.ajax({
			url: ajaxurl,
			method: "POST",
			data: form.serialize(),
			dataType: "JSON",
			success: function( response ){
				if( !response.error ){
					form.find('.send_result').html( '<div class="alert alert-success" role="alert"><span class="fa fa-check-circle"></span> '+response.success+'</div>' );
				}
				else{
					form.find('.send_result').html( '<div class="alert alert-danger" role="alert"><span class="fa fa-times-circle"></span> '+response.error+'</div>' );
				}
			}
		})
	});
	
	/* MAGNIFIC POPUP FOR THE GALLERY */
	$('.gallery').each(function(){
		var $this = $(this);
		$this.magnificPopup({
			type:'image',
			delegate: 'a',
			gallery:{enabled:true},
		});
	});

	/* PORTFOLIO MAGNIFIC POPUP */
	$('.popup').each(function(){
		var $this = $(this);
		$this.magnificPopup({
			type: $this.data('type'),
		});		
	});

	/* MASONRY */
	var $container = $('.portfolio-section');

	function mark_boxes(){
		$container.find('.ih-item').each(function(){
			if( $(this).parents('.masonry-box').length == 0 ){
				var itemCats = JSON.parse( $(this).attr('data-cats') );
				var mainCats = [];
				for( var i=0; i<itemCats.length; i++ ){
					mainCats.push( itemCats[i][1] );
					if( cats_filter.indexOf( itemCats[i][1] ) == -1 ){
						cats_filter.push( itemCats[i][1] );
						cats_filter_html.push( '<a href="javascript:;" data-filter=".'+itemCats[i][1]+'">'+unescape(itemCats[i][0])+'</a>' );
					}
				}
				var parent = $(this).parents('div[class^="col-sm-"]');
				parent.addClass( mainCats.join( ' ' ) ).addClass('masonry-box');
			}
		});		
	}

	function append_filters(){
		$('.portfolio-filters').html( cats_filter_html.join(' / ') );
		if( activeFilter !== '*' ){
			$('.portfolio-filters a[data-filter="'+activeFilter+'"]').addClass('active');
		}
	}

	function masonry_filter(){
        $container.find('.portfolios-container').isotope({ filter: activeFilter });
		setTimeout(function(){
			$container.find('.portfolios-container').isotope({ filter: activeFilter });
		},0);
	}

	if( $container.length > 0 ){
		var cats_filter_html = [];
		var cats_filter = [];
		var activeFilter = '*';

		$container.prepend('<div class="portfolio-filters"></div>');

		$(document).on( 'click', '.portfolio-filters a', function(){
			var $this = $(this);
			var filterValue = '*';

	 		var isActive = $this.hasClass( 'active' );
	 		$this.parent().find('.active').removeClass('active');
			if ( !isActive ) {
				filterValue = $this.attr('data-filter');
				$this.addClass('active');
			}

			activeFilter = filterValue;

			masonry_filter();
		});

		mark_boxes();
		append_filters();

		$(window).load(function(){
			$container.find('.portfolios-container').isotope({
				itemSelector: '.masonry-box',
				layoutMode: 'packery',
				gutter: 0
			});	
			setTimeout(function(){
				$container.find('.portfolios-container').isotope();
			}, 350);
		});	
	}

	/* MAIN SLIDER */
	$('.main-slider').owlCarousel({
		items: 1,
		responsiveClass: true,
		margin: 0,
		nav: false,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		dots: true,
		onInitialize: function(){
			calc_caption();
		},
		onResized: function(){
			calc_caption();
		}
	});

	if( $('.featured-image').length > 0 ){
		calc_caption();
		$(window).resize(function(){
			setTimeout(function(){
				calc_caption();
			}, 100);
		})
	}

	function calc_caption(){
		$('.featured-image, .slide-item').each(function(){
			var $this = $(this);
			var height = $this.height();
			var width = $this.width();

			var $caption = $this.find( '.slide-caption' );
			var captionHeight = $caption.outerHeight();
			var captionWidth = $caption.outerWidth();

			$caption.css( 'top', ( height/2 - captionHeight/2 ) );
			$caption.css( 'left', width/2 - captionWidth/2 );
		});
	}

	/* CLIENTS SLIDER */
	$('.clients-slider').owlCarousel({
		items: 5,
		responsiveClass: true,
		margin: 0,
		nav: false,
		dots: false,
		autoplay: true,
		autoplayHoverPause: true
	});	

	/* LAZY LOAD */
	$(".lazy").lazyload({
	    effect : "fadeIn",
	    effectspeed: 5000
	});	

	/* INFINITE SCROLL */
	var calling = false;
	$(window).scroll(function(){
		if($(window).scrollTop() + $(window).height() > $(document).height() - $(window).height() / 2 && $('.load-more').length > 0 && calling === false) {
			calling = true;
			var next_page = parseInt( $('.load-more').val() ) + 1;
			$.ajax({
				url: window.location.href,
				data: {pag: next_page},
				success: function( response ){
					$container.find('.portfolios-container').append( $(response).find( '.portfolios-container' ).html() );

					mark_boxes();
					append_filters();	

					$container.find('.portfolios-container .masonry-element').each(function(){
						var $this = $(this);
						if( activeFilter == '*' || $this.find('.ih-item').data('cats').indexOf( activeFilter.replace('.', '') ) !== -1 ){
							$this.removeClass('masonry-element');
						}
						$container.find('.portfolios-container').isotope('insert', $this );
						$container.find('.portfolios-container').isotope( 'on', 'layoutComplete',	function( laidOutItems  ){
							$this.removeClass('masonry-element');
						});
					});
					
					if( $(response).find('.load-more').length > 0 ){
						$('.load-more').val( next_page );
					}
					else{
						$('.load-more').remove();
					}
				},
				complete: function(){
					calling = false;
				}
			});
		}
	});	
});