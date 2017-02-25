// Scripts for HiveBio

// Scrolling functionality for navs
var scrolling = false;
function startScrolling(obj, spd, btn) {
    var travel = (btn.hasClass('nav-pan-right')) ? '+=' + spd + 'px' : '-=' + spd + 'px';
    if (!scrolling) {
        obj.stop();
    } else {
        // recursively call startScrolling while mouse is pressed
        obj.animate({
            "scrollLeft": travel
        }, 400, function () {
            if (scrolling) {
                startScrolling(obj, spd, btn);
            }
        });
    }
}

// Define variable for list scroll left here so we don't redefine it on every scroll event
var listScrollLeft;
// Variables for checking the widths throughout the different functions/events
var checkListWidth;
var checkAllItemsWidth;
var checkWidthsDiff = 0;

// This function checks the width of the list and the items within it,
// which we need to do on load, scroll, and window resize
$.fn.checkSizes = function() {
	$(this).each(function() {
		var $this = $(this);
		var $list = $this.find("ul");
		var $items = $list.children();

		checkListWidth = $list.width();
		checkAllItemsWidth = 0;
		$items.each(function() {
			checkAllItemsWidth += $(this).outerWidth(true);
		});

		checkWidthsDiff = Math.round(checkAllItemsWidth) - Math.round(checkListWidth);
	});
}

// document loaded
$(function () {
	// Primary navigation
    var $navPrimary = $(".nav-primary");

	// Check sizes of nav on load
	$navPrimary.checkSizes();

    if(checkWidthsDiff > 0) {
        // In case there are multiple, we do this on each nav-primary
        $navPrimary.each(function() { // !!!!!!!!!!! TO DO !!!!!!!!!!!! make this into function to use for subnav too
            var $this = $(this);
            var $navList = $this.find("ul"); // find() because we're using container between wrapper and list

            // Add left and right scroll buttons to the container within primary nav wrapper
            // Buttons are display: none by default
            $this.children()
            .append("<button class='nav-pan-right'><span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span></button>")
            .prepend("<button class='nav-pan-left'><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></button>");

            // Show the right scroll button if the list is too wide
            $(".nav-pan-right").css("display", "block");

            // When you scroll the list (horizontally)
            $navList.on("scroll", function() {
                $navPrimary.checkSizes(); // check sizes again
                listScrollLeft = Math.round($(this).scrollLeft()); // check scroll position

                if (listScrollLeft == 0) { // list hasn't been scrolled
                    $(".nav-pan-right").css("display", "block");
                    $(".nav-pan-left").css("display", "");
                    scrolling = false; // stop scrolling function
                }
                else if (listScrollLeft == checkWidthsDiff) { // list is scrolled all the way
                    $(".nav-pan-right").css("display", "");
                    $(".nav-pan-left").css("display", "block");
                    setTimeout(function() {
                        // this timer is needed because when you initially click left arrow, this is still true and stops scrolling
                        if (listScrollLeft == checkWidthsDiff) {
                            scrolling = false; // stop scrolling function
                        }
                    }, 250);
                }
                else { // list is scrolled somewhere in the middle
                    $(".nav-pan-right").css("display", "block");
                    $(".nav-pan-left").css("display", "block");
                }
        });
    });

    // When we click either the left or right scroll buttons
    $(".nav-pan-left, .nav-pan-right").on("mousedown", function() {
        var thisList = $(this).closest(".nav-primary").find("ul");
        scrolling = true;

        thisList.css({ // list overflow has to be visible to be scrolled
            "overflow-x": "scroll",
            "overflow-y": "hidden"
        });

        // Invoke scrolling function on this list,
        // increment it by a good (arbitrary) amount,
        // pass the button object so we can check what class it has
        startScrolling(thisList, 48, $(this));

        thisList.css("overflow", "hidden"); // we don't want the user to see the scroll bar, so hide it again

    }).on("mouseup", function() {
        scrolling = false; // stop scrolling function
    });
}

	// When the window is resized
    $(window).on("resize", function() {
		$navPrimary.checkSizes(); // check sizes again

        if(checkWidthsDiff > 0) {
            $navPrimary.each(function() {
                $(this).find("ul").scrollLeft(0);
            });
        }
	});
});
