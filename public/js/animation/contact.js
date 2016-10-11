/**
 * Menu Contact scripting
 * Requires JQeuery
 */
var menuState;
var activeState;
$(document).ready(function () {activeState = 0; menuState = 0; });

$("#contactTrigger").click(function() {
    if (activeState == 0) {
        $("#contactPanel").addClass("gn-contact-active");
        setTimeout(function () {
            activeState = 1; //Change active state after half second
        //    console.log("Trigger Clica! " + activeState);
        }, 500);
             
        
    } else {
     //   console.log("Trigger on activeState");
    }    ;
    
});

$("#contactPanel").mouseleave(function () {
    $("div.gn-contact-mask").click(function () {
        if (activeState == 1) {
            $("#contactPanel").removeClass("gn-contact-active");
            setTimeout(function () {
                activeState = 0; //Change active state after half second
         //       console.log("mouseleave - body clica! " + activeState);
            }, 500);
            
        } else {
         //   console.log("Mouseleave-Body on offState");
        }        ;
    });
});
$("div.contacto").click(function () {
    if (activeState == 1) {
        $("#contactPanel").removeClass("gn-contact-active");
        setTimeout(function () {
            activeState = 0; //Change active state after half second
         //       console.log("mouseleave - body clica! " + activeState);
        }, 500);
            
    } else {
         //   console.log("Mouseleave-Body on offState");
    }    ;
});



    /* To be set with Angular
    $("#contactData1").css("display", "none");
    $("#contactData2").css("display", "none");
     */
