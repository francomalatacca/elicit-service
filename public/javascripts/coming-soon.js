(function($) {
    "use strict"; // Start of use strict

    // Vide - Video Background Settings
    $('body').vide({
        mp4: "resources/bg.mp4",
        poster: "resources/bg-mobile-fallback.jpg"
    }, {
        posterType: 'jpg'
    });

})(jQuery); // End of use strict