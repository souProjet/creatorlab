!(function($) {
    'use strict';
    // Go to Top
    $(window).on("scroll", function() {
        // If window scroll down .active class will added to go-top
        var goTop = $(".go-top");
        if ($(window).scrollTop() >= 200) {
            goTop.addClass("active");
        } else {
            goTop.removeClass("active")
        }
    })
    $(".go-top").on("click", function(e) {
        $("html, body").animate({
            scrollTop: 0,
        }, 0);
    });

})(jQuery);