// Scripts for HiveBio
var scrolling = false;

function trimDecimal(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function startScrolling(obj, spd, btn) {
    var travel = (btn.hasClass('nav-pan-right')) ? '+=' + spd + 'px' : '-=' + spd + 'px';
    if (!scrolling) {
        obj.stop();
    } else {
        // recursively call startScrolling while mouse is pressed
        obj.animate({
            "scrollLeft": travel
        }, "fast", function () {
            if (scrolling) {
                startScrolling(obj, spd, btn);
            }
        });
    }
}

$(function () {
    var navPrimary = $(".nav-primary");

    navPrimary.each(function() {
        var $this = $(this);
        var navList = $this.find("ul");
        var navItem = navList.children();
        var navListWidth = navList.width();
        var navItemsWidth = 0;
        var listScrollLeft = navList.scrollLeft();

        $this.children()
        .append("<button class='nav-pan-right'><span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span></button>")
        .prepend("<button class='nav-pan-left'><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></button>");

        navItem.each(function() {
            navItemsWidth += $(this).outerWidth(true);
        });

        var navWidthsDiff = trimDecimal(navItemsWidth - navListWidth, 1);

        if(navWidthsDiff > 0) {
            $(".nav-pan-right").css("display", "block");
        }

        navList.on("scroll", function() {
            listScrollLeft = $(this).scrollLeft();

            if (listScrollLeft == 0) {
                $(".nav-pan-right").css("display", "block");
                $(".nav-pan-left").css("display", "");
            }
            else if (listScrollLeft == navWidthsDiff) {
                $(".nav-pan-right").css("display", "");
                $(".nav-pan-left").css("display", "block");
            }
            else if (0 < listScrollLeft < navWidthsDiff) {
                $(".nav-pan-right").css("display", "block");
                $(".nav-pan-left").css("display", "block");
            }
        });
    });

    $(document).on("mousedown", ".nav-pan-right", function(evt) {

        var thisList = $(this).closest(".nav-primary").find("ul");
        scrolling = true;

        thisList.css({
            "overflow-x": "scroll",
            "overflow-y": "hidden"
        });

        // startScrolling(thisList, 40, "right");
        startScrolling(thisList, 140, $(this));

        thisList.css("overflow", "hidden");
    }).
    on("mouseup", ".nav-pan-right", function() {
        scrolling = false;
    });

    $(document).on("mousedown", ".nav-pan-left", function(evt) {

        var thisList = $(this).closest(".nav-primary").find("ul");
        scrolling = true;

        thisList.css({
            "overflow-x": "scroll",
            "overflow-y": "hidden"
        });

        // startScrolling(thisList, 40, "right");
        startScrolling(thisList, 140, $(this));

        thisList.css("overflow", "hidden");
    }).
    on("mouseup", ".nav-pan-left", function() {
        scrolling = false;
    });
});
