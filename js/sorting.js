/* SORTING */
jQuery(function () {
	"use strict";    
	
	var $container = jQuery('.sorting_block');
	
    $container.isotope({
        itemSelector: '.element'
    });
	
    var $optionSets = jQuery('.optionset'),
        $optionLinks = $optionSets.find('a'),
        $showAll = jQuery('.show_all');

    jQuery('.filter_close').on("click", function (e) {
        e.preventDefault();
        $showAll.on("click");
		$optionSet.find('.selected').removeClass('selected');
        $showAll.parent('li').addClass('selected');

        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $showAll.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[key] = value;
        if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
            // changes in layout modes need extra logic
            changeLayoutMode($this, options)
        } else {
            // otherwise, apply new options
            $container.isotope(options);
        }
        return false;
    });
    $optionLinks.on("click", function () {
        var $this = jQuery(this);
        // don't proceed if already selected
        if ($this.parent('li').hasClass('selected')) {
            return false;
        }
        var $optionSet = $this.parents('.optionset');
        $optionSet.find('.selected').removeClass('selected');
        $this.parent('li').addClass('selected');

        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[key] = value;
        if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
            // changes in layout modes need extra logic
            changeLayoutMode($this, options)
        } else {
            // otherwise, apply new options
            $container.isotope(options);			
			var sortingtimer = setTimeout(function(){
				jQuery('.sorting_block').isotope('reLayout');
				clearTimeout(sortingtimer);
			}, 500);			
        }
        return false;
    });

    jQuery('.sorting_block').find('img').load(function () {
		$container.isotope('reLayout');
	});
});

jQuery(window).load(function () {
	"use strict";
    jQuery('.sorting_block').isotope('reLayout');
	var sortingtimer = setTimeout(function(){
		jQuery('.sorting_block').isotope('reLayout');
		clearTimeout(sortingtimer);
	}, 500);
    
	jQuery('.optionset a').on("click", function () {
        var sortingtimer = setTimeout(function(){
			jQuery('.sorting_block').isotope('reLayout');
			clearTimeout(sortingtimer);
		}, 800);
    });
});
jQuery(window).resize(function () {
	"use strict";
    jQuery('.sorting_block').isotope('reLayout');    
});


jQuery.fn.portfolio_addon = function(addon_options) {
	"use strict";
	//Set Variables
	var addon_el = jQuery(this),
		addon_base = this,
		img_count = addon_options.items.length,
		img_per_load = addon_options.load_count,
		$newEls = '',
		loaded_object = '',
		$container = jQuery('.image-grid');
	
	jQuery('.load_more_works').on("click", function(){
		$newEls = '';
		loaded_object = '';									   
		var loaded_images = $container.find('.added').size();
		if ((img_count - loaded_images) > img_per_load) {
			var now_load = img_per_load;
		} else {
			var now_load = img_count - loaded_images;
		}
		
		if ((loaded_images + now_load) == img_count) jQuery(this).fadeOut();

		if (loaded_images < 1) {
			var i_start = 1;
		} else {
			var i_start = loaded_images+1;
		}

		if (now_load > 0) {			
			if (addon_options.type == 0) {
				// Fullscreen portfolio
				for (var i = i_start-1; i < i_start+now_load-1; i++) {
					loaded_object = loaded_object + '<div class="blogpost_preview_fw element '+ addon_options.items[i].sortcategory +' added"><div class="fw-portPreview"><div class="img_block wrapped_img fs_port_item"><a class="featured_ico_link" href="'+ addon_options.items[i].url +'"><img alt="" src="'+ addon_options.items[i].src +'" /></a><div class="bottom_box"><div class="bc_content"><h5 class="bc_title"><a href="'+ addon_options.items[i].url +'">'+ addon_options.items[i].title +'</a></h5><div class="featured_items_meta"><span>'+ addon_options.items[i].itemcategory +'</span><span class="middot">&middot;</span><span class="preview_meta_comments">'+ addon_options.items[i].comments +'</span></div></div><div class="bc_likes gallery_likes_add"><i class="stand_icon icon-heart-o"></i><span>'+ addon_options.items[i].likecount +'</span></div></div><div class="portFadder"></div></div></div></div>';
				}				
			}
			  
			$newEls = jQuery(loaded_object);
			$container.isotope('insert', $newEls, function() {
				$container.isotope('reLayout');	
				
				if (jQuery('.blogpost_preview_fw').size() > 0) {
					jQuery('.fs_port_item').mouseenter(function() {
						html.addClass('fadeMe');
						jQuery(this).addClass('unfadeMe');
					}).mouseleave(function() {
						html.removeClass('fadeMe');
						jQuery(this).removeClass('unfadeMe');
					});
				}																			
											
			});			
		}	
	});
}