angular.module('ApplyCtrl', []).controller('ApplyController', function ($scope, $analytics, $location, $route, $routeParams, $rootScope) {
    /* $Scope dependent functions        ======================= */
    $scope.modal = [];
    $scope.Header = 'Pr\xF3ximo Curso de Capacitaci\xF3n en Quer\xE9taro'; //Setting MainController.Header to string, if called $scope it's controlled by routeprovider, this.header is controller specific
    $scope.newsLink = 'Preparaci\xF3n de la superficie y Aplicaci\xF3n de Poliurea sobre Acero y Concreto [B\xE1sico]';
    $scope.tagline = 'Aplicaciones';
    $scope.taglineLink = '/eventos';
    $scope.icon = 'fa-cubes';
    $analytics.pageTrack('/aplicaciones');
    var names = [];
    
       //cover is a generan property for each section or subsection
    $scope.cover = { src: 'img/bckgrnd-1.jpg', ngclass: 'cover' };
    //Setting MainController.headlines
    
    /* Declarative Functions to call  [Not called Here] ======================= */
    
    
    var modalize = function ($routeParams, object, names) {
        var index;
        console.log('The route is: ', $routeParams);
        console.log('The length of the object is: ', object.length);
        if (typeof $routeParams.id != 'undefined') {
            //If if parameter is not undefined, then pass as variable
            index = names.indexOf($routeParams.id);
            $rootScope.description = object[index].figcaption.caption;
            console.log('Description is: ', $rootScope.description);
            modalParser(index, object);
        }
    }
    
    var modalParser = function (index, object) {
        $scope.modal = object[index];
        $scope.modal.showOff = '';
        $scope.modal.galery = 0;
        console.log($scope.modal);
        //Use "JQuery's HasClass() for clean-liness" 
        $("#myModal").removeClass("fade");
        $("#myModal").addClass("in");
        
        console.log("removed class");
    };
    this.modalClose = function () {
        $("#myModal").addClass("fade");
        $("#myModal").removeClass("in");
        console.log("added class");
        $location.path('/aplicaciones');
    };
    
    
    /* END Declarative Functions to call ======================= */
    this.headlines = [
        {
            figcaption: {
                title: 'Bedliners', 
                bold: ' ',
                caption: 'Es sin lugar a dudas una de las primeras y principales aplicaciones de las membranas de poliurea, recubre y protege contra impactos la caja de la camioneta, d\xE1ndole una inigualable apariencia f\xEDsica. Se adhiere perfectamente a la superficie formando un enlace impenetrable para la humedad evitando que la caja se corroa, disminuye ruido de la carga y protege de rayones y derrames de sustancias qu\xEDmicas.',
                footer: 'Aplicaci\xF3n directa en veh\xEDculos'
            },
            src: 'img/PU22.jpg',
            link: '',
            ngclass: 'marley2',
            primarios: [{ name: 'PrimerTruck' }],
            quimicos: [{ name: '6080' }, { name: 'ALF-7045' }],
            equipos: [{ name: 'E-10', category: 'Poliuretano' }, { name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }]
        },
        {
            figcaption: {
                title: 'Albercas',
                bold: '', 
                caption: 'La aplicaci\xF3n de membranas de poliurea en el recubrimiento de acero y al ser este un material que se adapta a la forma de la superficie hace que la membrana quede sin uniones ni juntas fr\xEDas como una protecci\xF3n impermeable exactamente de la misma forma que la superficie garantizando la estanqueidad del l\xEDquido contenido. Esto lo hace ideal para contener agua en aplicaciones en la industria de la construcci\xF3n para espejos de agua y albercas.',
                footer: 'Aplicaci\xF3n sobre estructura'
            },
            src: 'img/PU5.jpg',
            link: '#',
            ngclass: 'marley',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'ART-7052' }, { name: 'ALF-7045' }, { name: 'PU-100' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }]
        },
        {
            figcaption: {
                title: 'Estacionamientos', 
                bold: '',
                caption: 'Con una gran resistencia al desgaste las membranas de Poliurea encuentran una gran aplicaci\xF3n en la proyecci\xF3n sobre concreto como un impermeabilizante transitable, combinado con que pueden ponerse en marcha r\xE1pidamente una vez aplicadas los arquitectos encuentran en esta propiedad una forma muy adecuada para protecci\xF3n de sus obras sin largos periodos de espera para su puesta en trabajo nuevamente.',
                footer: 'Aplicaci\xF3n sobre estructura o plancha'
            },
            src: 'img/PU7.jpg',
            link: '#',
            ngclass: 'marley2',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'PU-100' }, { name: 'ART-70450' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }, { url: 8 }, { url: 9 }, { url: 10 }]
        }, 
        {
            figcaption: {
                title: 'Espejos de Agua', 
                bold: ' ',
                caption: 'Una de las propiedades de las membranas de Poliurea es su impermeabilidad al agua ideal para aplicaciones en cuerpos de agua, como espejos de agua, gracias a sus propiedades mec\xE1nicas es capaz de soportar deformaciones y adaptarse a cualquier imperfecci\xF3n en la superficie generando una membrana monol\xEDtica.',
                footer: 'Aplicaci\xF3n sobre estructura o plancha'
            },
            src: 'img/PU23.jpg',
            link: '#',
            ngclass: 'marley2',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'PU-100' }, { name: 'ART-70450' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }, { url: 8 }, { url: 9 }, { url: 10 }]
        },
        {
            figcaption: {
                title: 'Impermeabilizacion', 
                bold: '',
                caption: 'Las membranas de poliurea adoptan la forma de cada elemento estructural existente en el techo, ca\xEDdas o bajadas de agua, ductos de aire acondicionado, elementos de electricidad, etc. evitando que hayan juntas fr\xEDas o permeaci\xF3n por la complejidad de dichos elementos, esto la hace ideal como impermeabilizante en edificios habitacionales, hospitales, aeropuertos, centros comerciales, industrias, etc.',
                footer: 'Aplicaci\xF3n sobre estructura'
            },
            src: 'img/PU14.jpg',
            link: '#',
            ngclass: 'marley',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'PU-100' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }, { name: 'E-30', category: 'Poliuretano' }, { name: 'E-30i', category: 'Poliuretano' }, { name: 'E-XP2i', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }, { url: 8 }]
        },
        {
            figcaption: {
                title: 'Green Roofs', 
                bold: '',
                caption: 'Adicional a la impermeabilidad de agua, es capaz la membrana de soportar cierta variedad de ra\xEDces sin generar da\xF1o a la membrena, formando una barrera en los jardines dise\xF1ados sobre las losas de construcci\xF3n.',
                footer: 'Aplicaci\xF3n sobre estructura, cemento y concreto'
            },
            src: 'img/PU27.jpg',
            link: '#',
            ngclass: 'sarah2',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'ART-7052' }, { name: 'PU-100' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }]
        }, {
            figcaption: {
                title: 'Aislamiento', 
                bold: ' Termico',
                caption: 'Aplicaci\xF3n de Espuma de poliuretano para reducir la temperatura al interior de edificios y techados laminados, ideal  para aislar,  insonorizar y proteger techos de naves industriales, laminados de alta incidencia solar, etc. \r \n  Complementada la aplicaci\xF3n con un recubrimiento poliasp\xE1rtico blanco o aluminio incrementa la durabilidad y vida \xFAtil de la espuma creando adem\xE1s un escudo reflector solar para disminuir a\xFAn m\xE1s la transmisi\xF3n de calor por incidencia de los rayos UV.',
                footer: 'Ayuda a reducir considerablemente el consumo el\xE9ctrico por aires acondicionados en el interior de edificios y naves industriales.'
            },
            src: 'img/PU25.jpg',
            link: '#',
            ngclass: 'marley2',
            primarios: [{ name: 'PrimerPoxi' }, { name: 'PrimerFlex' }],
            quimicos: [{ name: 'ECOFOAM-30' }, { name: 'ECOFOAM-40' }, { name: 'Aislatherm 251' }, { name: 'Poly SP Coating' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }]
        }, {
            figcaption: {
                title: 'Corrosion', 
                bold: ' ',
                caption: 'El recubrimiento de metales aplicando una capa de espesores variados de Poliureas proporciona una protecci\xF3n en el metal impermeable a la humedad que evita la corrosi\xF3n. Es variada la protecci\xF3n que puede proporcionar los recubrimientos a base de poliurea debido a las variedades de la misma, la protecci\xF3n al acero es un mercado creciente para la poliurea gracias a su adherencia y espesor de pel\xEDcula que permite adicional a la prevenci\xF3n de corrosi\xF3n la protecci\xF3n al impacto y al desgaste.',
                footer: 'Aplicaci\xF3n sobre estructuras met\xE1licas o planchas de concreto'
            },
            src: 'img/PU13.jpg',
            link: '#',
            ngclass: 'sarah2',
            primarios: [],
            quimicos: [{ name: '6080' }, { name: 'ALF-7045' }, { name: 'PU-100' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' },{ name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }, { name: 'E-XP2i', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }]
        }, {
            figcaption: {
                title: 'Decoracion', 
                bold: ' ',
                caption: 'Una de las aplicaciones resientes de los recubrimientos de Poliurea es la protecci\xF3n de figuras 3D generalmente moldeadas o esculpidas sobre materiales de espuma de poliestiereno o poliuretano. La capa final de Poliurea protege de impactos la figura, contra lluvia o agua en figuras expuestas a la intemperie, da una capa final protectora la cual puede ser posteriormente pintada para generar una apariencia casi real.',
                footer: 'Aplicaci\xF3n sobre mesas, bancas, sillas y auxiliar decorativo'
            },
            src: 'img/PU26.jpg',
            link: '#',
            ngclass: 'sarah',
            primarios: [],
            quimicos: [{ name: '6080' }, { name: 'ART-7052' }, { name: 'ALF-7045' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }]
        }, {
            figcaption: {
                title: 'Pisos', 
                bold: ' ',
                caption: '.',
                footer: 'Aplicaci\xF3n sobre estructura, cemento y concreto'
            },
            src: 'img/PU28.jpg',
            link: '#',
            ngclass: 'marley',
            primarios: [],
            quimicos: [],
            equipos: [],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }]
        }, {
            figcaption: {
                title: 'Techos Galvanizados', 
                bold: ' ',
                caption: 'LA aplicaci\xF3n para impermeabilizar en laminados galvanizados es una aplicaci\xF3n en la cual las membranas monol\xEDticas de poliurea son capaces de cubrir orificio y uniones de l\xE1minas dando soluci\xF3n a las filtraciones de agua en techos laminados. Disminuye tambi\xE9n el ruido por granizo.',
                footer: 'Aplicaci\xF3n sobre estructura, cemento y concreto'
            },
            src: 'img/PU16.jpg',
            link: '#',
            ngclass: 'marley',
            primarios: [],
            quimicos: [{ name: 'PU-100' }, { name: 'ALM-70300' }, { name: 'ART-70350' }, { name: 'ART-70450' }],
            equipos: [{ name: 'E-10hp', category: 'PoliUrea' }, { name: 'E-XP1', category: 'PoliUrea' }, { name: 'E-XP2', category: 'PoliUrea' }, { name: 'H-XP2', category: 'PoliUrea' }, { name: 'H-XP3', category: 'PoliUrea' }],
            images: [{ url: 1 }, { url: 2 }, { url: 3 }, { url: 4 }, { url: 5 }, { url: 6 }, { url: 7 }]
        }
    ];
    //Headline dependent functions ============================
   
    
    
    /* CALL DECLARATIVE FUNCTION =============================== */
    for (var i = 0; i < this.headlines.length; i++) { names[i] = this.headlines[i].figcaption.title };
    console.log('The Headlines are: ',this.headlines);
    modalize($routeParams, this.headlines, names);

 

});//Ending of Angular Module