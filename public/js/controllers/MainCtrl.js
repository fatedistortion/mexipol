angular.module('MainCtrl', []).controller('MainController', function ($scope, $analytics, $location) {

    $scope.Header = 'Pr\xF3ximo Curso de Capacitaci\xF3n en Quer\xE9taro'; //Setting MainController.Header to string, if called $scope it's controlled by routeprovider, this.header is controller specific
    $scope.newsLink = 'Preparaci\xF3n de la superficie y Aplicaci\xF3n de Poliurea sobre Acero y Concreto [B\xE1sico]';
    $scope.tagline = '';
    $scope.taglineLink = '/eventos';
    $scope.inEvents=true;
    $analytics.pageTrack($location.url());
    if($location.url().indexOf('eventos')<0){
        //Returns true when not in eventos
        $scope.inEvents=false;
    }

    //cover is a generan property for each section or subsection
    var day = new Date();
    $scope.coverNumber = (day % 2); //Get the residual from number division
    $scope.coverButton = function scrollWin() {
        window.scrollTo(0, 650);
    };
    $scope.cover = [{ src: 'img/bckgrnd-2.jpg', ngclass: 'cover' },
                    { src: 'img/bckgrnd-3.jpg', ngclass: 'cover' }];
    //Setting MainController.headlines

    /* Declarative Functions to call ======================= */
    $scope.modal = [];
    $scope.modal.content = 'Pronto tendremos preguntas frecuentes que responder.';
    $scope.modal.showOff = 'Porqu\xE9 no nos comunicas tus dudas por Contacto?';
    $scope.modal.title= 'Asistencia en Desarrollo';
    this.contactMain = function () {
        if (activeState == 0) {
            $("#contactPanel").addClass("gn-contact-active");
            setTimeout(function () {
                activeState = 1; //Change active state after half second
        //    console.log("Trigger Clica! " + activeState);
            }, 500);
        } else {
     //   console.log("Trigger on activeState");
        }        ;
    };


    $scope.changer = function (varIn, sizeMax, sizeMin) {
        if (varIn < sizeMax)
            return sizeMax;//varIn is expected to change
        else
            return sizeMin;//varIn is expected to return to default

    };
    $scope.stringChanger = function (stringIn) {
        if (stringIn == 'Ver M\xE1s')
            return 'Ver Menos';//varIn is expected to change
        else
            return 'Ver M\xE1s';//varIn is expected to return to default

    };

    this.quickLinks = {
        aplicaciones: {title:'Aplicaci\xF3nes',
            text: 'La tecnolog\xEDa de recubrimientos a base de poliureas y poliuretanos ha ampliado el campo de aplicaciones, desde recubrimientos en el \xE1rea de construcci\xF3n (impermeabilizaci\xF3n transitable, aislamiento t\xE9rmico, pisos, etc.) recubrimientos automotrices (bedliners),  recubrimientos en el \xE1rea industrial (protecci\xF3n contra la corrosi\xF3n, contenci\xF3n secundaria de qu\xEDmicos, mitigaci\xF3n de ondas expansivas, etc. ). Que en diversos sectores de la industria naval, construcci\xF3n, civil, automotriz, minera, el\xE9ctrica, petroqu\xEDmica, agua potable, etc. han demostrado ser soluciones viables.',
            stringLimit: 248, stringMin: 248, stringMax: 600, buttonText: 'Ver M\xE1s'},
        equipos: {
            title: 'Equipos',
            text: 'Representante para M\xE9xico de la marca GRACO, Mexicana de Poliureas ofrece la gama completa de Equipos REACTOR GRACO, FUSSION para sistemas de espreado de dos componentes de alta presi\xF3n, ideales para la aplicaci\xF3n de espumas de poliuretano, recubrimientos de poliuretano y poliureas. Mexicana de poliurea ofrece servicio t\xE9cnico nacional, cuenta con un inventario de refacciones para dichos equipos y servicio de mantenimiento.',
        stringLimit: 248, stringMin: 248, stringMax: 427, buttonText: 'Ver M\xE1s'},
        quimicos: {
            title: 'Qu\xEDmicos',
            text: 'Recubrimientos a base de Poliuretano y Poliurea son soluciones que abarcan una amplia gama de producto ofrecidos para la protecci\xF3n y soluci\xF3n en recubrimiento de diversas superficies, Mexicana de poliurea ofrece un amplia gama de soluciones basadas en las m\xE1s recientes tecnolog\xEDas los productos a base de poliuretanos, poliureas modificadas (hibridas), poliureas puras, sistemas de recubrimientos de poliureas alif\xE1ticas y recubrimientos poliasp\xE1rticos.',
        stringLimit: 248, stringMin: 248, stringMax: 455, buttonText: 'Ver M\xE1s'},
        asistencia: {
            title: 'Asistencia',
            text: 'Con m\xE1s de 17 a\xF1os de experiencia en el campo de poliuretanos y poliureas, el equipo t\xE9cnico de nuestra compa\xF1\xEDa le brinda asesor\xEDa durante la ejecuci\xF3n de sus proyectos, constante capacitaci\xF3n, apoyo para la operaci\xF3n y mantenimiento de sus equipos, desarrollo profesional de sus aplicadores, as\xED como comunicaci\xF3n  de nuevas tecnolog\xEDas.',
            stringLimit: 248, stringMin: 248, stringMax: 339, buttonText: 'Ver M\xE1s'
        }
    };

});//Ending of Angular Module
