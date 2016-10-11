angular.module('EventCtrl', []).controller('EventController', function ($scope, $analytics, $location, $routeParams) {
    
   
    $analytics.pageTrack($location.url());
    if($location.url().indexOf('eventos')<0){
        //Returns true when not in eventos
        $scope.inEvents=false;
    }
    console.log('Youre in events');
    
    //cover is a generan property for each section or subsection
    var date = new Date();

    $scope.events=[{
        title:'Centro de Capacitación y Formación Profesional en Poliurea',
        subtitle:'Preparación de la superficie y Aplicación de Poliurea sobre Acero y Concreto',
        date:'18 al 22 de Abril',
        dateY: '2016',
        place:'Fiesta Inn Insurgentes, Ciudad de México, México',
        link:'/eventos/2',
        image:'1.png',
        class:'sprayEvent'
    },{
        title:'Centro de Capacitación y Formación Profesional en Poliurea',
        subtitle:'Preparación de la superficie y Aplicación de Poliurea sobre Acero y Concreto [Básico]',
        date:'21 a 24 de Abril',
        dateY: '2015',
        place:'Hotel NH, Querétaro, Qro, México',
        link:'/eventos/1',
        image:'OBJECT_CS_sketch.png',
        class:'simpleEvent'
    }];
  

});//Ending of Angular Module