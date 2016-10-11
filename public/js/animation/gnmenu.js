/**
 * Menu Contact scripting
 * Requires JQeuery
 */
var menuTrigger = $('a.gn-icon-menu');
var menuWrapper = $('nav.gn-menu-wrapper');
var menuLink = $('a.gn-icon');
/*
 * menuState is indicative of actual transition
 * 0 closed
 * 1 open part
 * 2 open complete
 * 
 * gn-open-all
 * 
 */


menuTrigger.mouseenter(function () {
    menuState = 1;
    menuWrapper.addClass('gn-open-part');
 //   console.log('menuState: ' + menuState);
    
    menuWrapper.mouseenter(function () {
        if (menuState == 1) {
            menuWrapper.addClass('gn-open-all');
     //       menuWrapper.removeClass('gn-open-part');
            menuState = 2;
      //      console.log('menuState: ' + menuState);
        }        ;
    });
    //Mouse Trigger towards menuWrapper transition
});
menuWrapper.mouseleave(function () {
    if (menuState == 2) {
        menuWrapper.removeClass('gn-open-all');
        menuWrapper.removeClass('gn-open-part');
    }    ;


});

menuTrigger.click(function () {
    if (menuState == 2) {
        menuState = 0;
        menuWrapper.removeClass('gn-open-part');
        menuWrapper.removeClass('gn-open-all');
        //Necesary for mobile touch
     //   console.log('menuState: ' + menuState);

    } else { 
       
        setTimeout(function () { menuState = 2; }, 200);
        menuWrapper.addClass('gn-open-all');
     //   console.log('menuState after timeout: ' + menuState);
    };
});

menuLink.click(function () {
    if (menuState == 2) {
        menuState = 0;
        menuWrapper.removeClass('gn-open-part');
        menuWrapper.removeClass('gn-open-all');
     //   console.log('menuState linkClick: ' + menuState);
        //Necesary for mobile touch

    } else if(menuState == 1) {
        menuState = 2;
        menuWrapper.addClass('gn-open-all');
    //    console.log('menuState: '+ menuState);
    }    ;
});


menuTrigger.mouseleave(function () {
    if (menuState == 1) {
        menuWrapper.removeClass('gn-open-part');
     //   console.log('menuState: ' + menuState);
    };
});
$("div.gn-menu-mask").click(function () {
        menuState = 0;
        menuWrapper.removeClass('gn-open-part');
    menuWrapper.removeClass('gn-open-all');
    //console.log('menuState mask click: ' + menuState);
});
