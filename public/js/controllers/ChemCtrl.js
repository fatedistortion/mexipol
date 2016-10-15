var ChemCtrl = angular.module('ChemCtrl', []);
//Whole Module is imported in app.js with all it's controllers

ChemCtrl.controller('chemController',['$scope', '$http', '$analytics', '$location', '$route', '$routeParams', '$rootScope', function ($scope, $http, $analytics, $location, $route, $routeParams, $rootScope) {
        //Acqure Controller Variables
        $analytics.pageTrack('/quimicos');

        //Jquery addons
        angular.element(document).ready(function () {

            var width = $(window).width();
            if (width <= 873) { $scope.device = 'mobile'; }

        });
        $scope.Header = '';
        $scope.tagline = 'Qu\xEDmicos';
        $scope.icon = 'fa-flask';
        /* Jumbotron Controller for background display */
        $scope.jumbo = {
            'background-image': 'url("../img/quimicos/USE_1.jpg")'
        };

        /* General Standarization for images & Medias */
        this.mediaImg = {
            'max-width': '100%',
            'max-height': '420px',
            color: '#FCF9F9'
        };

        //For ng-Show var
        $scope.chemTypes = [
            {
                category: 'Primarios',
                first:'PrimerPoxi',
                img:'Epoxide',
                show: 1
            },
            {
                category: 'Espuma de Poliuretano',
                first: 'ECOFOAM-30',
                img:'Urethane',
                show: 1
            },
            {
                category: 'Poliureas',
                first:'PU-100',
                img:'Urea',
                show: 1
            },
            {
                category: 'Recubrimientos',
                first: 'Poliaspartico',
                img:'Poliaspartic',
                show: 0
            },
            {
                category: 'Pisos',
                first: 'Densificador',
                img: 'Floor',
                show: 0
            }
        ];
        typesLength = $scope.chemTypes.length;
        if (typesLength < 6) { $scope.firstOffset = (12 - typesLength * 2) / 2 } else { $scope.firstOffset = 0 };
        //Scope.showcase can be changes for category update and ngif
        //Using Queu and Showcase for default model and category items
        $scope.showCase = 'Primarios';
        $scope.queu = 'PrimerPoxi';
        //If function is passed with a variable instead of a string, then $scope.variable is referenced.
        var initialize = function ($routeParams) {
            if (typeof $routeParams.category == 'undefined') {
                //If routeParams is undefined, get basic linkage
                $scope.showCase = 'Primarios';
                $scope.queu = 'PrimerPoxi';
                $rootScope.description = 'Cat�logo de Productos Qu�micos entre ellos Poliurea, Poliuretano y Recubrimientos para aplicaciones industriales, comerciales y dom�sticas';
            } else {
                $scope.showCase = $routeParams.category;
                $scope.queu = $routeParams.quim;
                var object = $scope.quimicos.filter(function (element) { if (element.model == $routeParams.quim) { return element; } });
                $rootScope.description = object[0].caption;
            }
        };

        /*
         * Chemicals DataArray, to be changed to JSON for Production editions
         * REST Functions are listed after array and are to be used for JSON Mongodb in production
         */
        this.quimicos = [
            {
                category: 'Primarios',
                model: 'PrimerPoxi',
                premodel: 'Epoxicos',

                caption: 'Primerpoxi est\xE1 formulado a base de resinas epoxicas modificadas de dos componentes dise\xF1ado especialmente para su uso sobre concreto y metal.Resultado de la mezcla de la parte A y la parte B en una proporci\xF3n 2:1 en volumen, pueden producirse pel\xEDculas libres de burbuja de hasta 20 mils(0.6mm) de espesor. \n \r Primerpoxi tiene especial aplicaci\xF3n para el uso en concreto, madera y metal con promotor de adherencia en el recubrimiento con elast\xF3meros esperados de poliuretano y poliurea.',
                parameters: [
                    { Param: 'Tiempo de Curado (h)', Value: 6, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Primarios',
                model: 'PrimerFlex',
                premodel: 'Uretanos',

                caption: 'Primerflex esta formulado a base de poliurea de dos componentes dise\xF1ado especialmente para su uso sobre concreto, madera y metal.Resultado de la mezcla de la parte A y la parte B en una proporci\xF3n 1:1 en volumen, pueden producirse pel\xEDculas libres de burbuja de hasta 50 mils(1.3mm) de espesor. \n \r Primerflex tiene especial aplicaci\xF3n para el uso en concreto, madera y metal con promotor de adherencia en el recubrimiento con elast\xF3meros esperados de poliuretano y poliurea.',
                parameters: [
                    { Param: 'Tiempo de Curado (h)', Value: 4, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: 'PU-100',
                premodel: 'Aromaticas Puras',

                caption: 'Poliurea 100% pura  de alta reactividad, sus caracter\xEDsticas de reactividad le hacen ideal para aplicaciones en el mayor espectro de temperaturas ambientales y humedades relativas en el aire. Su gran flexibilidad y resistencia al rasgado, as\xED como su alta resistencia al desgaste la hacen la m\xE1s resistente al estr\xE9s mec\xE1nico en la mayor\xEDa de aplicaciones. Certificada para aplicaciones de impermeabilizaci\xF3n , impermeabilizaci\xF3n transitable bajo est\xE1ndares europeos.',
                parameters: [
                    { Param: 'Dureza', Value: 48.5, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 325, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 1750, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 260, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1500, subValue: 1800, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 5, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 66.2, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: 'ART-7052',
                premodel: 'Aromaticas',

                caption: 'Recubrimiento a base de poliurea modificada de alta reactividad, alta resistencia al impacto  y excelente resistencia al desgaste. Certificada para la mayor\xEDa de aplicaciones en impermeabilizaci\xF3n e impermeabilizaci\xF3n transitable, contenci\xF3n de agua en aljibes, albercas y  cisternas. Cuenta con certificado para resistencia a la penetraci\xF3n de ra\xEDces en la aplicaci\xF3n de Green-Roofs. Excelente flexibilidad y su combinaci\xF3n de propiedades la hacen ideal para un gran n\xFAmero de aplicaciones.',
                parameters: [
                    { Param: 'Dureza', Value: 44, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 170, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 1750, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 225, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1250, subValue: 1400, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 28, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 130, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }
                ]
            },
            {
                category: 'Poliureas',
                model: 'ALM-70300',
                premodel: 'Aromaticas',

                caption: 'Recubrimiento a base de poliurea modificada pigmentada en color aluminio, este recubrimiento garantiza un sustrato reflectivo a los rayos UV, lo sit\xFAan ideal gracias a su alta flexibilidad para aplicaciones sobre laminados impermeabilizando y reduciendo el ruido de las piezas met\xE1licas de la techumbre. Gracias a la naturaleza de sus color tiene una excelente resistencia al cambio de coloraci\xF3n y una alta retenci\xF3n de brillo.',
                parameters: [
                    { Param: 'Dureza', Value: 89, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 325, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 1750, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 300, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 38, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 288, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 9, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: 'ART-70350',
                premodel: 'Aromaticas',

                caption: 'Recubrimiento a base de Poliurea modificada,  en la poliurea de m\xE1s baja dureza de la l\xEDnea con una muy alta flexibilidad, excelente para aplicaciones donde requieran una alta resiliencia de la superficie, como pisos de gimnasios, guarder\xEDas, sales de actividades de ni\xF1os.  Su baja dureza y elevada flexibilidad incluso contribuyen a la reducci\xF3n de ruido cuando hay transito sobre el recubrimiento.',
                parameters: [
                    { Param: 'Dureza', Value: 85, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 350, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 1750, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 260, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 12, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 267, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 9.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: 'ART-70450',
                premodel: 'Aromaticas',

                caption: 'Recubrimiento a base de Poliurea modificada de alta reactividad con una alt\xEDsima flexibilidad y dureza moderada, excelente para aplicaciones de alto impacto, protecci\xF3n de metales, resistencia al desgaste y alta demanda de flexibilidad. Gracias a su alta resistencia al desgaste puede ser usada en piezas sujetas a abrasi\xF3n como tolvas, carretillas de transporte de solidos...Excelente en aplicaciones como impermeabilizaci\xF3n, impermeabilizaci\xF3n transitable, espejos de agua, etc. . .',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 15, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: '6080',
                premodel: 'Aromaticas',

                caption: 'Recubrimiento a base de poliurea modificada de alta reactividad y excelente resistencia qu\xEDmica. De flexibilidad moderada y alta dureza .Su alta resistencia al desgaste y la abrasi\xF3n asi como su bajo peso lo hacen ideal para aplicaciones como Bedliners, tolvas de cemento, protecci\xF3n de chasis, piezas met\xE1licas, etc.   De la l\xEDnea de poliurea est\xE1 en particular es especial por su alto contenido de materias primas renovables no provenientes del petr\xF3leo.',
                parameters: [
                    { Param: 'Dureza', Value: 53.5, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 86, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2480, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 250, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1350, subValue: 1500, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 20, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 120, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 6, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Poliureas',
                model: 'ALF-7045',
                premodel: 'Alifaticas',

                caption: 'Recubrimiento a base de Poliurea Alifatica, excelente resistencia a los rayos UV, gracias a su excelente retenci\xF3n de brillo y reducida variaci\xF3n de color la sit\xFAan como un excelente TOP COAT para aplicaciones de alto a moderado tr\xE1fico o contenci\xF3n de l\xEDquidos  con alta retenci\xF3n de la apariencia visual del color. Tiene una alta reactividad lo cual garantiza una r\xE1pida puesta en marcha o retorno a servicio de las \xE1reas aplicadas. ',
                parameters: [
                    { Param: 'Dureza', Value: 53, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 70, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 3190, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 250, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1200, subValue: 1500, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 64, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 280, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 26, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]
            },
            {
                category: 'Espuma de Poliuretano',
                model: 'ECOFOAM-30',
                premodel: 'Base Agua',

                caption: 'De menor densidad inclusive que ECOFOAM 40, Un sistema de espuma de poliuretano que utiliza agua como agente de expansi\xF3n. Ecol\xF3gico y sin HFCs, Dise�ada espec\xEDficamente para el aislamiento t\xE9rmico en construcci\xF3n e industria, es una elecci\xF3n ideal cuando no existen requisitos de resistencia a compresi\xF3n en techos, instalaciones ganaderas, etc.',
                parameters: [
                    { Param: 'Densidad aplicada (Kg/m3)', Value: 30, modify: 56 },
                    { Param: 'Conductividad t\xE9rmica (Watt/mK)', Value: 0.028, modify: 3 },
                    { Param: 'Resistencia Compresi\xF3n (KPa)', Value: 160, modify: 500 },
                    { Param: 'Presi\xF3n de Procesamiento (psi)', Value: 1350, modify: 2500 },
                    { Param: 'Tiempo de Curado (s)', Value: 10, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Espuma de Poliuretano',
                model: 'ECOFOAM-40',
                premodel: 'Base Agua',

                caption: 'Un sistema de espuma de poliuretano que utiliza agua como agente de expansi\xF3n. Ecol\xF3gico y sin HFCs, Dise�ada espec\xEDficamente para el aislamiento t\xE9rmico en construcci\xF3n e industria, es una elecci\xF3n ideal cuando no existen requisitos de resistencia a compresi\xF3n en techos, instalaciones ganaderas, etc.',
                parameters: [
                    { Param: 'Densidad aplicada (Kg/m3)', Value: 42, modify: 56 },
                    { Param: 'Conductividad t\xE9rmica (Watt/mK)', Value: 0.03, modify: 3 },
                    { Param: 'Resistencia Compresi\xF3n (KPa)', Value: 190, modify: 500 },
                    { Param: 'Presi\xF3n de Procesamiento (psi)', Value: 1350, modify: 2500 },
                    { Param: 'Tiempo de Curado (s)', Value: 10, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Recubrimientos',
                model: 'Poliaspartico',
                premodel: 'Poliasparticos',

                caption: '..',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Pisos',
                model: 'Densificador',
                premodel: 'Catalizador',

                caption: '...',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Pisos',
                model: 'Abrillantador',
                premodel: 'Catalizador',

                caption: '...',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Pisos',
                model: 'Entintados',
                premodel: '??',

                caption: '...',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Pisos',
                model: 'Poliasp\xE1rtico',
                premodel: 'Poliasp\xE1rtico',

                caption: '...',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            },
            {
                category: 'Pisos',
                model: 'Poliuretano',
                premodel: '???',

                caption: '...',
                parameters: [
                    { Param: 'Dureza', Value: 92, modify: 92 },
                    { Param: 'Elongaci\xF3n (%)', Value: 450, modify: 450 },
                    { Param: 'Esfuerzo Tensil (psi)', Value: 2200, modify: 3190 },
                    { Param: 'Resistencia Resgado', Value: 410, modify: 500 },
                    { Param: 'Adhesi\xF3n Acero Sin/Con primer', Value: 1000, subValue: 1200, modify: 1800 },//Usar el Acero Primer
                    { Param: 'Abrasi\xF3n   CS-17 (mg)', Value: 10, modify: 64 },
                    { Param: 'Abrasi\xF3n   H-18 (mg)', Value: 180, modify: 288 },
                    { Param: 'Tiempo de Curado (s)', Value: 7.5, modify: 26 }],
                documents: [
                    { name: 'Tecnica', type: 'T\xE9cnica' },
                    { name: 'Seguridad-A', type: 'Seguridad A' },
                    { name: 'Seguridad-B', type: 'Seguridad B' }]

            }
        ];
        $scope.quimicos = this.quimicos;
        initialize($routeParams);

}]);//END OF GeekController
