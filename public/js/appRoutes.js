angular.module('appRoutes', []).controller("docsController", function ($location, $routeParams) {
    docsUrl=$location.path;
    console.log('Docs Url: ',docsUrl);
    $location.path(docsUrl);
});


angular.module('appRoutes', [])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider

		// home page
		.when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController as Main' //Setting Alias
        })
        .when('/main', {

            templateUrl: 'views/home.html',
            controller: 'MainController as Main'
        })
        .when('/eventos', {
            title: '- Eventos',
            templateUrl: 'views/events.html',
            controller: 'EventController as Events'
        })
        .when('/eventos/:eventId', {
            title: '- Eventos',
            templateUrl: function(params) {
                return 'templates/poster' + params.eventId + '.html';
            },
            controller: 'MainController as Main'
        })
		.when('/equipos/:category/:model', {
            title: '- Equipos',
            templateUrl: 'views/equip.html',
            controller: 'EquipmentController as Equipos'
        })
        .when('/equipos', {
            title: '- Equipos',
            templateUrl: 'views/equip.html',
            controller: 'EquipmentController as Equipos'
        })

        .when('/crm', {

            templateUrl: 'views/crm.html',
            controller: 'DashController',
            resolve: {
                //employeeService: 'employeeFactory'
            }
        })
        .when('/crm/logout', {

            templateUrl: 'views/crm.html',
            controller: 'DashController',
            resolve: {
                employeeService: 'employeeFactory'
            }
        })
        .when('/crm/:listThis', {
            templateUrl: 'views/objectList.html',
            controller: 'ListController',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/crm/account/:id', {

            templateUrl: 'views/crm_account.html',
            controller: 'CRMController',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/crm/potential/:id', {

            templateUrl: 'views/crm_potential.html',
            controller: 'CRMControllerPotential',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/crm/task/:id', {

            templateUrl: 'views/crm_task.html',
            controller: 'CRMControllerTask',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/crm/task_account/:id', {

            templateUrl: 'views/crm_task.html',
            controller: 'CRMControllerTask',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/crm/task_potential/:id', {

            templateUrl: 'views/crm_task.html',
            controller: 'CRMControllerTask',
            resolve: {
                employeeService: function ($cookies, $cookieStore, $location) {
                    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
                        console.log( "Employee-resolver in factory" );
                        return("b-value-or-promise");
                    }else{
                        console.log( "No Employee logged in factory" );
                        $location.path('/crm');
                    }
                }
            }
        })
        .when('/activation/:id/:potentialId', {
            templateUrl: 'views/activate.html',
            controller: 'ActivateController',
        })
        .when('/aplicaciones/:id?', {
            title: '- Aplicaciones',
            templateUrl: 'views/apply.html',
            controller: 'ApplyController as Apply',//Needs own controller
        })

		.when('/asistencia', {
            title: '- Asistencia',
            templateUrl: 'views/poliureaHelp.html',
            controller: 'MainController as Main'
        //Aliases can be stated same as in ng-controller
        })
        .when('/asistencia/about/poliurea', {
            title: '- Qué es poliurea',
            templateUrl: 'views/poliureaHelp.html',
            controller: 'MainController as Main'
        //Aliases can be stated same as in ng-controller
        })
        .when('/quimicos', {
            title: '- Quimicos',
            //    templateUrl: 'views/home.html',
            //controller: 'MainController as Main'
            templateUrl: 'views/quim.html',
            controller: 'chemController as Quimicos'
        //Aliases can be stated same as in ng-controller
        })
        .when('/quimicos/:category/:quim', {
            title: '- Quimicos',
            templateUrl: 'views/quim.html',
            controller: 'chemController as Quimicos'
        //Aliases can be stated same as in ng-controller
        })
        .when('/cotizacion/:accountId/:potentialId', {
            title: '- Cotización',
            templateUrl: 'templates/cotizacionBasic.html',
            controller: 'cotizacionCtrl'
        }).when('/docs/:documentUrl', {
            title: '- Documentos y Manuales',
            controller: function ($location, $routeParams) {
                docsUrl=$location.path;
                console.log('Docs Url: ',docsUrl);
                $location.path(docsUrl);
            },
            redirectTo: function(params){
                if(params.documentUrl.indexOf('.pdf')==-1){
                    return 'docs/'+params.documentUrl+'.pdf';
                }else{
                    return 'docs/'+params.documentUrl;
                }
            }
        }).otherwise( { redirectTo: "/" });

        $locationProvider.html5Mode(true);
    // Generating pushState URLs in angular
    // http://stackoverflow.com/questions/13499040/how-do-search-engines-deal-with-angularjs-applications

    }])
    .run(['$window', '$location', '$rootScope', '$routeParams', '$cookies', function ($window, $location, $rootScope, $routeParams, $cookies) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            //filter dinamically by important parameters to add to rootScope
            if (typeof $routeParams.id != 'undefined') { $rootScope.title = current.$$route.title + ': ' + $routeParams.id;} else
                if (typeof $routeParams.model != 'undefined') { $rootScope.title = current.$$route.title + ' para ' + $routeParams.category + ' modelo: ' + $routeParams.model; } else
                    if (typeof $routeParams.quim != 'undefined') { $rootScope.title = current.$$route.title + ': ' + $routeParams.quim; } else { $rootScope.title = current.$$route.title }

            if(current.$$route.originalPath=='/docs/:documentUrl'){
                setTimeout(function(){
                     $window.location.reload();
                }, 800);
            }
            if ( current.templateUrl === "views/activate.html") {
                // When Returning from activation
                if(previous){
                    if(previous.originalPath=='/crm/:listThis'){
                        $rootScope.returnUrl = '/crm/'+previous.params['listThis'];
                    }else{
                        // if not from CRM return to main page
                        $rootScope.returnUrl = '/';
                    }
                }else{
                    $rootScope.returnUrl = '/';
                }

            }
            if ( current.templateUrl === "templates/cotizacionBasic.html") {
                // When Redirecting to Cotización
                $rootScope.hideBanners = true;
            } else {
                $rootScope.hideBanners = false;
            }

        });
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            if ( next.templateUrl === "templates/cotizacionBasic.html") {
                // When Starting on Cotización
                $rootScope.hideBanners = true;
            } else {
                $rootScope.hideBanners = false;
            }
            if ( next.templateUrl === "views/crm.html" ||  next.templateUrl === "views/crm_account.html" ||  next.templateUrl === "views/crm_potential.html" ||  next.templateUrl === "views/crm_task.html") {
                // When Starting on Cotización

            } else {
                // $rootScope.activeEmployee = false;
            }
        });
    }])
    .run(['$resource', '$rootScope', '$location', '$cookies', function($resource, $rootScope, $location, $cookies){
        $rootScope.activeKart = false;
        $rootScope.equipmentModal=function(){
            if ($location.$$path.search('equipos') == -1) {
                   // Go to equipos if not in location path
                    $location.path('/equipos')
                }
            //On click revert to current shoping kart, not modal state
            $rootScope.modalSwap.kartEnabled=true;
            $rootScope.modalSwap.kart=true;
            $rootScope.modalSwap.add=false;
            $rootScope.modalSwap.active=false;
            console.log('modalSwap Status: ',$rootScope.modalSwap);
            $("#shopModal").addClass("in");
            $("#shopModal").removeClass("fade");
        }
        function contactHas(Compare) {
            return function(element) {
                if(element.correo == Compare.correo && element.tel == Compare.tel){
                        console.log('element is: ', element);
                        return true;
                }
            }
        }
        var account = $resource('/api/accounts/:account_id', {account_id: '@_id'});
        temp1=$cookies.getObject('user');
        temp2=$cookies.getObject('activeAccount');
        if(typeof(temp2) != 'undefined' && typeof(temp1) != 'undefined'){
            account.get({account_id: temp2.id}, function(account){
                console.log('In appRoutes: ', account);
                if(account.contacto){
                    // Wrapper to avoid inexistent accounts, used to remove unauthorized cookies
                    if(account.contacto.filter(contactHas(temp1))[0]){
                        if(account){
                            $rootScope.activeAccount=account;
                            (($rootScope.modalSwap) ? $rootScope.modalSwap : $rootScope.modalSwap={});
                            $rootScope.modalSwap.add=false; $rootScope.modalSwap.kart=false; $rootScope.modalSwap.active=true
                            $rootScope.activeKart=true;
                        }else{
                            // No account, eliminate cookies
                            $cookies.remove('activeAccount');
                            $cookies.remove('user');
                        }
                    }
                }else{
                        $cookies.remove('user');
                        $cookies.remove('activeAccount');
                        delete $rootScope.user;
                        console.log('Removed invalid Cookies');

                    }
            });
        }else{
            $cookies.remove('user');
            $cookies.remove('activeAccount');
        }

        $rootScope.refreshCRM=function(){
            /*
                1.  When retrieving a resource, use query to retrieve all IDS, response will be stored
                    as an array, each element's resource_id will be overwritten with data._id, allowing deletion
                2.  If resource get is done with RESOURCE.get({resource_id: 'value'}, fu... ) then data._id will be
                    replaced with resource_id: 'value'
            */
            var potentials = $resource('/api/potentials/:potential_id', {potential_id:'@id'});
            var accounts = $resource('/api/accounts/:account_id', {account_id:'@id'});
            var tasks = $resource('/api/tasks/:task_id', {task_id:'@id'});
            accounts.query(function(accounts){
                $rootScope.accounts=accounts;
            });
            potentials.query(function(potentials){
                $rootScope.potentials=potentials;
            });
            tasks.query(function(tasks){
                $rootScope.tasks=tasks;
            });
        }

        $rootScope.employees = [{
            email: 'aruiz@mexipol.com.mx',
            nombre: 'Alejandro Ruiz',
            password: 'mexipol88'
        },{
            email: 'administracion@mexipol.com.mx',
            nombre: 'Edna Godoy',
            password: 'mexipol88'
        }];
        $rootScope.tasks = [{
        "id": 'tas-clienteinc-001',
        "accountId": 'ac-clienteinc-00',
        "idPotential" :'clienteinc-01',
        "title": 'Llamada for followup',
        "priority": 'high',
        "dueDate": new Date(2015, 11, 16),
        "taskOwner": 'Alejandro Ruiz',
        "status": 'Not Started',
        "valid": true,
        "modified": new Date(2015, 11, 08),
        "recordar": new Date(2015, 11, 08),
        "information": [{
            "contant": 'Rodrigo Varela',
            "subject": 'Catchup de A-10'
        }]
    },{
        "id": 'tas-clienteinc-002',
        "accountId": 'ac-clienteinc-00',
        "idPotential" :'clienteinc-02',
        "title": 'Call for followup',
        "priority": 'medium',
        "dueDate": new Date(2015, 11, 16),
        "taskOwner": 'Alejandro Ruiz',
        "status": 'Not Started',
        "valid": true,
        "modified": new Date(2015, 11, 09),
        "recordar": new Date(2015, 11, 10),
        "information": [{
            "contant": 'Rodrigo Varela',
            "subject": 'Agregar químico para pedido PU-100'
        }]
    },{
        "id": 'tas-visitorinc-001',
        "accountId": 'ac-visitorinc-00',
        "idPotential" :'visitorinc-01',
        "title": 'Verificar Correo',
        "priority": 'high',
        "dueDate": new Date(2015, 12, 16),
        "taskOwner": 'Alejandro Ruiz',
        "status": 'Not Started',
        "valid": true,
        "modified": new Date(2015, 12, 18),
        "recordar": new Date(2015, 12, 19),
        "information": [{
            "contant": 'Andrés Varela',
            "subject": 'Checar correo de Confirmación'
        }]
    }];
    $rootScope.accounts=[{
        "id": 'ac-clienteinc-00',
        "title":'Cliente Inc',
        "direccion": 'Calzada los arcos # 46',
        "pais": 'México',
        "estado": 'Querétaro',
        "cp": '76024',
        "tel":'2243200',
        "contacto":[{
            "nombre": 'Rodrigo Varela',
            "correo": 'elrodri@clieninc.com',
            "tel": '2243221'
        },{
            "nombre": 'Juliana Gomez',
            "correo": 'juliagogo@clieninc.com',
            "tel": '2243102'
        }],
        "tipo": 'cliente',
        "valid": true,
        "potentials":[{
            "id":'clienteinc-01'
        },{
            "id":'clienteinc-02'
        }]
    },{
        "id": 'ac-visitorinc-00',
        "title":'Visitor Inc',
        "direccion": 'El Retablo # 316',
        "pais": 'México',
        "estado": 'Querétaro',
        "cp": '76094',
        "tel":'2532133',
        "contacto":[{
            "nombre": 'Andrés Varela',
            "correo": 'elandi@visinc.com',
            "tel": '2532201'
        }],
        "tipo": 'cliente',
        "valid": false,
        "potentials":[{
            "id":'visitorinc-01'
        }]
    }
    ];

    $rootScope.potentials=[{
        "id":'clienteinc-01',
        "title": 'Cliente-One Diciembres',
        "accountId": 'ac-clienteinc-00',
        "contacto": 'Rodrigo Varela',
        "origen": 'Llamada',
        "indiceDesc": 1,
        "prioridad": 'media',
        "descripcion": 'Cliente original de muestra obtenido por llamada',
        "asignado": 'Alejandro Ruiz',
        "fechaInicio": new Date(2015, 11, 16),
        "fechaCierre": 'undefined',
        "estado": 'Negociacion',
        "opportunities": [],
        "valid": true,
        "tareas": [{"id": 'tas-clienteinc-002'}]
    },
    {
        "id":'clienteinc-02',
        "title": 'cliente tres',
        "accountId": 'ac-clienteinc-00',
        "contacto": 'Rodrigo Varela',
        "origen": 'Correo',
        "indiceDesc": 1,
        "prioridad": 'media',
        "descripcion": 'Segundo cliente Dummy',
        "asignado": 'Alejandro Ruiz',
        "fechaInicio": new Date(2015, 11, 11),
        "fechaCierre": new Date(2015, 11, 18),
        "estado": 'Cerrado-Win',
        "opportunities": [],
        "valid": true,
        "tareas": [{"id": 'tas-clienteinc-001'}]
    },{
        "id":'visitorinc-01',
        "title": 'Visitor one',
        "accountId": 'ac-visitorinc-00',
        "contacto": 'Rodrigo Varela',
        "origen": 'Web',
        "indiceDesc": 1,
        "prioridad": 'baja',
        "descripcion": 'Primer Unvalid Dummy',
        "asignado": 'Alejandro Ruiz',
        "fechaInicio": new Date(2015, 12, 11),
        "fechaCierre": new Date(2015, 12, 18),
        "estado": 'Negociacion',
        "opportunities": [{
            "brand": 'Graco',
            "category": 'Pistolas',
            "customization":[{
                "caption": "Lorem ipsum dolor sit amet, duo ut fugit volutpat, vel semper pertinacia eu. Autem tractatos intellegat has ex, ea hinc tamquam mel, id aeque errem inciderint cum. Eripuit sanctus maluisset vix ex, cu soluta ornatus ius. Ea ipsum simul cum. Pri quando regione accumsan an.",
                "clave": 'Solo Equipo',
                "codigo": 'NA',
                "precio": 10000
            }],
            "model": 'AP',
            "precio": 10000,
            "premodel": 'Fusion'
        }],
        "precio": 10000,
        "valid": false,
        "tareas": [{"id": 'tas-visitorinc-001'}]
    }];
    $rootScope.refreshCRM();

    }]);
