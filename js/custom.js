$(window).on('load', function(){
	"use strict";
	document.getElementById("home").innerHTML = gettranslate("home");
	document.getElementById("about").innerHTML = gettranslate("about");
	document.getElementById("security").innerHTML = gettranslate("security");
	document.getElementById("gallery").innerHTML = gettranslate("gallery");
	document.getElementById("team").innerHTML = gettranslate("team");
	document.getElementById("download").innerHTML = gettranslate("download");
	document.getElementById("price").innerHTML = gettranslate("price");
	document.getElementById("contact").innerHTML = gettranslate("contact");
	document.getElementById("my_passwords").innerHTML = gettranslate("my_passwords");
	document.getElementById("title_start").innerHTML = gettranslate("title_start");
	document.getElementById("title_sub1").innerHTML = "<i class=\"pe-7s-world white\" style=\"padding-left: 4px;padding-right: 28px;color:#fff;\"></i>"+gettranslate("title_sub1");
	document.getElementById("title_sub2").innerHTML = "<i class=\"pe-7s-science white\" style=\"color:#fff;\"></i> "+gettranslate("title_sub2");
	document.getElementById("title_sub3").innerHTML = "<i class=\"pe-7s-door-lock white\" style=\"padding-left: 4px;padding-right: 24px;color:#fff;\"></i> "+gettranslate("title_sub3");
	document.getElementById("how_works").innerHTML = gettranslate("how_works");
	document.getElementById("how_works_sub").innerHTML = gettranslate("how_works_sub");
	document.getElementById("how_works_import").innerHTML = gettranslate("how_works_import");
	document.getElementById("how_works_import_sub").innerHTML = gettranslate("how_works_import_sub");
	document.getElementById("how_works_generate").innerHTML = gettranslate("how_works_generate");
	document.getElementById("how_works_generate_sub").innerHTML = gettranslate("how_works_generate_sub");
	document.getElementById("how_works_autofill").innerHTML = gettranslate("how_works_autofill");
	document.getElementById("how_works_autofill_sub").innerHTML = gettranslate("how_works_autofill_sub");
	document.getElementById("how_works_scan").innerHTML = gettranslate("how_works_scan");
	document.getElementById("how_works_scan_sub").innerHTML = gettranslate("how_works_scan_sub");
	document.getElementById("prepare_title").innerHTML = gettranslate("prepare_title");
	document.getElementById("prepare_sub1").innerHTML = "<i class=\"fa fa-shield\" style=\"color: #0099fa;\"></i> "+ gettranslate("prepare_sub1");
	document.getElementById("prepare_sub2").innerHTML = "<i class=\"fa fa-cloud\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub2");
	document.getElementById("prepare_sub3").innerHTML = "<i class=\"fa fa-key\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub3");
	document.getElementById("prepare_sub4").innerHTML = "<i class=\"fa fa-mobile\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub4");
	document.getElementById("prepare_sub5").innerHTML = "<i class=\"fa fa-user\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub5");
	document.getElementById("prepare_sub6").innerHTML = "<i class=\"fa fa-share-alt\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub6");
	document.getElementById("prepare_sub7").innerHTML = "<i class=\"fa fa-user-secret\" style=\"color: #0099fa;\"></i> "+gettranslate("prepare_sub7");
	document.getElementById("get_app").innerHTML = gettranslate("get_app");
	document.getElementById("explore_title").innerHTML = gettranslate("explore_title");
	document.getElementById("explore_sub").innerHTML = gettranslate("explore_sub");
	document.getElementById("us_sub").innerHTML = gettranslate("us_sub");
	document.getElementById("us_title").innerHTML = gettranslate("us_title");
	document.getElementById("davi_title").innerHTML = gettranslate("davi_title");
	document.getElementById("davi_sub").innerHTML = gettranslate("davi_sub");
	document.getElementById("review1").innerHTML = gettranslate("review1");
	document.getElementById("review2").innerHTML = gettranslate("review2");
	document.getElementById("review3").innerHTML = gettranslate("review3");
	document.getElementById("platform1").innerHTML = " - "+gettranslate("android_user");
	document.getElementById("platform2").innerHTML = " - "+gettranslate("ios_user");
	document.getElementById("platform3").innerHTML = " - "+gettranslate("ios_user");
	document.getElementById("download_title").innerHTML = gettranslate("download_title");
	document.getElementById("download_sub").innerHTML = gettranslate("download_sub");
	document.getElementById("ios_title").innerHTML = gettranslate("ios_title");
	document.getElementById("ios_sub").innerHTML = gettranslate("ios_sub");
	document.getElementById("android_title").innerHTML = gettranslate("android_title");
	document.getElementById("android_sub").innerHTML = gettranslate("android_sub");
	document.getElementById("chrome_title").innerHTML = gettranslate("chrome_title");
	document.getElementById("chrome_sub").innerHTML = gettranslate("chrome_sub");
	document.getElementById("brave_title").innerHTML = gettranslate("brave_title");
	document.getElementById("brave_sub").innerHTML = gettranslate("brave_sub");
	document.getElementById("edge_title").innerHTML = gettranslate("edge_title");
	document.getElementById("edge_sub").innerHTML = gettranslate("edge_sub");
	document.getElementById("firefox_title").innerHTML = gettranslate("firefox_title");
	document.getElementById("firefox_sub").innerHTML = gettranslate("firefox_sub");
	document.getElementById("safari_title").innerHTML = gettranslate("safari_title");
	document.getElementById("safari_sub").innerHTML = gettranslate("safari_sub");
	document.getElementById("years_appstore").innerHTML = "<span class=\"facts-numbers\">12</span><br>"+gettranslate("years_appstore");
	document.getElementById("happy_customers").innerHTML = "<span class=\"facts-numbers\">+300k</span><br>"+gettranslate("happy_customers");
	document.getElementById("top_appstore").innerHTML = "<span class=\"facts-numbers\">46</span><br>"+gettranslate("top_appstore");
	document.getElementById("cups_coffe").innerHTML = "<span class=\"facts-numbers\">2137</span><br>"+gettranslate("cups_coffe");
	document.getElementById("fast_support").innerHTML = "<span class=\"facts-numbers\">24/7</span><br>"+gettranslate("fast_support");
	document.getElementById("plans_title").innerHTML = gettranslate("plans_title");
	document.getElementById("plans_sub").innerHTML = gettranslate("plans_sub");
	document.getElementById("plans_free").innerHTML = gettranslate("plans_free");
	document.getElementById("plans_price").innerHTML = gettranslate("plans_price");
	document.getElementById("plans_month").innerHTML = gettranslate("plans_month");
	document.getElementById("plans_get").innerHTML = gettranslate("plans_get");
	document.getElementById("plan1_arg1").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg1");
	document.getElementById("plan1_arg2").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg2");
	document.getElementById("plan1_arg3").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg3");
	document.getElementById("plan1_arg4").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg4");
	document.getElementById("plan1_arg5").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg5");
	document.getElementById("plan1_arg7").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan1_arg7");
	document.getElementById("premium_price").innerHTML = gettranslate("premium_price");
	document.getElementById("premium_month").innerHTML = gettranslate("plans_month");
	document.getElementById("premium_get").innerHTML = gettranslate("plans_get");
	document.getElementById("plan2_arg1").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg1");
	document.getElementById("plan2_arg2").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg2");
	document.getElementById("plan2_arg3").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg3");
	document.getElementById("plan2_arg7").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg7");
	document.getElementById("plan2_arg8").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg8");
	document.getElementById("plan2_arg9").innerHTML = "<i class=\"fa fa-check\" style=\"color: #fff;\"></i>"+gettranslate("plan2_arg9");
	document.getElementById("news_title").innerHTML = gettranslate("news_title");
	document.getElementById("news_sub").innerHTML = gettranslate("news_sub");
	document.getElementById("achievements").innerHTML = gettranslate("achievements");
	document.getElementById("achievements_ios").innerHTML = gettranslate("ios_title");
	document.getElementById("achievements_sub").innerHTML = gettranslate("achievements_sub");
	document.getElementById("achievements_more").innerHTML = gettranslate("know_more");
	document.getElementById("new2_title").innerHTML = gettranslate("new2_title");
	document.getElementById("new1_title").innerHTML = gettranslate("new1_title");	
	document.getElementById("new2_sub1").innerHTML = gettranslate("new2_sub1");
	document.getElementById("new2_sub2").innerHTML = gettranslate("new2_sub2");
	document.getElementById("new2_desc").innerHTML = gettranslate("new2_desc");
	document.getElementById("new2_button").innerHTML = gettranslate("know_more");
	document.getElementById("new3_title").innerHTML = gettranslate("new3_title");
	document.getElementById("new3_sub1").innerHTML = gettranslate("new3_sub1");
	document.getElementById("new3_sub2").innerHTML = gettranslate("new3_sub2");
	document.getElementById("new3_desc").innerHTML = gettranslate("new3_desc");
	document.getElementById("new3_button").innerHTML = gettranslate("know_more");
	document.getElementById("contact_title").innerHTML = gettranslate("contact_title");
	document.getElementById("contact_sub").innerHTML = gettranslate("contact_sub");
	document.getElementById("contact_name").placeholder = gettranslate("contact_name");
	document.getElementById("contact_email").placeholder = gettranslate("contact_email");
	document.getElementById("contact_text").placeholder = gettranslate("contact_text");
	document.getElementById("contact_button").value = gettranslate("contact_send");
	document.getElementById("img1").src = gettranslate("img1");
	document.getElementById("img2").src = gettranslate("img2");
	document.getElementById("img3").src = gettranslate("img3");
	document.getElementById("img4").src = gettranslate("img4");
	document.getElementById("img5").src = gettranslate("img5");
	document.getElementById("img6").src = gettranslate("img6");
	document.getElementById("popularapps").src = gettranslate("popularapps");
	document.getElementById("appswelove").src = gettranslate("appswelove");
	document.getElementById("apple_ecamp").src = gettranslate("apple_ecamp");
	document.getElementById("appswelove_link").href = gettranslate("appswelove_link");
	document.getElementById("popularapps_link").href = gettranslate("popularapps_link");
	document.getElementById("social").innerHTML = gettranslate("social");
	document.getElementById("logo").innerHTML = gettranslate("isenhas");
	document.getElementById("privacy").innerHTML = gettranslate("privacy");
	document.getElementById("privacy").href = gettranslate("privacy-href");
	document.getElementById("business_price").innerHTML = gettranslate("business_price");
	document.getElementById("business_month").innerHTML = gettranslate("business_month");
	document.getElementById("business_get").innerHTML = gettranslate("business_get");
	document.getElementById("business_download").innerHTML = gettranslate("business_download");
	document.getElementById("plan3_arg1").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg1");
	document.getElementById("plan3_arg2").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg2");
	document.getElementById("plan3_arg3").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg3");
	document.getElementById("plan3_arg4").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg4");
	document.getElementById("plan3_arg5").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg5");
	document.getElementById("plan3_arg6").innerHTML = "<i class=\"fa fa-check\" style=\"color: #0099fa;\"></i>"+gettranslate("plan3_arg6");
	document.getElementById("business_free").innerHTML = gettranslate("business_free");
	$('#owl1').owlCarousel({
	    loop:true,
	    margin:10,
	    nav:false,
	    responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:1
	        },
	        1000:{
	            items:1
	        }
	    }
	})

	$('#owl2').owlCarousel({
	    center:true,
	    autoplay:true,
	    loop:true,
	    margin:40,
	    nav:false,
	    responsiveClass:true,
	    responsive:{
	        0:{
	            items:1,
	            nav:false
	        },
	        600:{
	            items:2,
	            nav:false
	        },
	        1000:{
	            items:4,
	            nav:false,
	            loop:true
	        }
	    }
	})
	$(window).on('scroll', function() {
		if($(this).scrollTop() > 450) {
			$('.navbar-fixed-top').addClass('opaque');
		} else {
			$('.navbar-fixed-top').removeClass('opaque');
		}
	});
	  $(".navbar-nav li a").on('click', function(event) {
	    $(".navbar-collapse").collapse('hide');
	  });

	$('#navbar-collapse-02').onePageNav({
		filter: ':not(.external)'
	});
	$(".nav li a, a.scrool, .baixar").on('click', function(e) {
		
		var full_url = this.href;
		if(!full_url.includes("#")){
			window.open("senhas.html","_self")
			return
		}
		var parts = full_url.split("#");
		var trgt = parts[1];
		var target_offset = $("#"+trgt).offset();
		var target_top = target_offset.top;
	

		$('html,body').animate({scrollTop:target_top -70}, 1000);
			return false;
		
	});
	$('.newsletter_box .newsletter_form').each( function(){
		var form = $(this);
		//form.validate();
		form.submit(function(e) {
			if (!e.isDefaultPrevented()) {
				jQuery.post(this.action,{
					'email':$('input[name="nf_email"]').val(),
				},function(data){
					form.fadeOut('fast', function() {
						$(this).siblings('p.newsletter_success_box').show();
					});
				});
				e.preventDefault();
			}
		});
	});	
	$('#register-form').each( function(){
		var form = $(this);
		//form.validate();
		form.submit(function(e) {
			if (!e.isDefaultPrevented()) {
				jQuery.post(this.action,{
					'names':$('input[name="register_names"]').val(),
					'phone':$('input[name="register_phone"]').val(),
					'email':$('input[name="register_email"]').val(),
					'ticket':$('select[name="register_ticket"]').val(),
				},function(data){
					form.fadeOut('fast', function() {
						$(this).siblings('p.register_success_box').show();
					});
				});
				e.preventDefault();
			}
		});
	})
	$('#contact-form').each( function(){
		var form = $(this);
		//form.validate();
		form.submit(function(e) {
			if (!e.isDefaultPrevented()) {
				jQuery.post(this.action,{
					'names':$('input[name="contact_names"]').val(),
					'subject':$('input[name="contact_subject"]').val(),
					'email':$('input[name="contact_email"]').val(),
					'phone':$('input[name="contact_phone"]').val(),
					'message':$('textarea[name="contact_message"]').val(),
				},function(data){
					form.fadeOut('fast', function() {
						$(this).siblings('p').show();
					});
				});
				e.preventDefault();
			}
		});
	})

	
});
	$('.popup-gallery').find('a.popup1').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
	
	$('.popup-gallery').find('a.popup2').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
 
	$('.popup-gallery').find('a.popup3').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
 
	$('.popup-gallery').find('a.popup4').magnificPopup({
		type: 'iframe',
		gallery: {
		  enabled:false
		}
	});  
 
	function submitbutton(){
		
		window.location = '#home_wrapper';
		alert(gettranslate("contact_ok"));
		
	}