// Scripts for HiveBio

// Make the nav layout behave

$(function () {
    var navPrimary = $(".nav-primary");

    navPrimary.each(function() {
        var $this = $(this);
        var navItem = $this.find("li");
        var navList = $this.find("ul");
        var navListWidth = navList.width();
        var navItemsWidth = 0;

        navItem.each(function() {
            navItemsWidth += $(this).outerWidth(true);
        });

        if(navItemsWidth > navListWidth) {
            // navList.css({
            //     "overflow-x": "scroll",
            //     "overflow-y": "hidden"
            // });
            navList.css("overflow", "hidden");
        }

        $this.children()
        .append("<div class='nav-pan-right'><span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span></div>")
        .prepend("<div class='nav-pan-left'><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></div>");
        $this.children().css("position", "relative");
    });


});
