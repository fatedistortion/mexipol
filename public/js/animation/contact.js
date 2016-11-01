/**
 * Menu Contact scripting
 * Requires JQeuery
 */

var activeState;

$(document).ready(function () { activeState = 0; });

$("#contactTrigger").click(function() {
    if (activeState == 0) {
        $("#contactPanel").addClass("contact-active");
        setTimeout(function () {
            activeState = 1;
        }, 500);
    } else {
        $("#contactPanel").removeClass("contact-active");
        activeState = 0;
    }
});

$("#contactPanel").mouseleave(function () {
    $("div.contact-mask").click(function () {
        if (activeState == 1) {
            $("#contactPanel").removeClass("contact-active");
            setTimeout(function () {
                activeState = 0;
            }, 500);
        }
    });
});
