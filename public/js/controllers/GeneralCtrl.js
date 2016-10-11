angular.module('GeneralCtrl', []).controller('GeneralController', ['$scope', '$cookies', '$cookieStore', '$http', '$analytics', '$rootScope', 'resourceService', function ($scope, $cookies, $cookieStore, $http, $analytics, $rootScope, resourceService) {
        $scope.Header = 'Pr\xF3ximo Curso de Capacitaci\xF3n en Quer\xE9taro'; //Setting MainController.Header to string, if called $scope it's controlled by routeprovider, this.header is controller specific
        $scope.tagline = 'Preparaci\xF3n de la superficie y Aplicaci\xF3n de Poliurea sobre Acero y Concreto [B\xE1sico]';
        $scope.taglineLink = '/eventos';
        //$analytics.pageTrack('/Main');    //Main is not Required since the analytics page track is obtained from ng-view's controller

        /* ]]> */
    // Setting a cookie
    $cookies.put('myFavorite', 'oatmeal');

    /*
    ==== $Cookie get to retrieve old sessions: user / Employee  ====
    1. Review when an account is deleted and user exists
        1.1. First user action triggers must verify this account exists
        1.2. If account doesn't exists, eliminate cookie from browser
        1.3. Use rootScope filter for accounts/username on General controller
             and reduce further need to verify
    2. Only valid accounts can or should Login / store cookie sessions
        2.1. Newly created accounts cannot use cookies
    */
    var username = $cookies.getObject('user');
    var activeAccount = $cookies.getObject('activeAccount');
    var employee = $cookies.getObject('Employee');
    if(typeof(employee) != 'undefined'){
       $rootScope.activeEmployee=$cookies.getObject('Employee');
        console.log('Cookie Employee', employee);
        // Add notifications import to dashboard if activeEmployee exits.
        nameString=$rootScope.activeEmployee.nombre.replace(" ", '-');
        resourceService.notifications.query({taskOwner: nameString}, function(notifications){
            console.log('Notifications Response: ', notifications);
            $rootScope.notifications=notifications;
        })

    };
    if((typeof(username)!='undefined')&&(typeof(activeAccount)!='undefined')){
        $rootScope.user=$cookies.getObject('user');
        $rootScope.activeAccount=$cookies.getObject('activeAccount');
        console.log('Cookie Account', $rootScope.activeAccount);
        console.log('Cookie User', $rootScope.user);
        //Verify this account and cotnact is valid and exists in DB
    }

    //Setting MainController.headlines
    this.contactInfo = {
            company: {
                name: 'Mexipol SA de CV',
                street: 'CE5 Avenida 5 de Febrero',
                maps:'https://maps.google.com.mx/maps?espv=2&biw=1366&bih=667&bav=on.2,or.r_cp.r_qf.&bvm=bv.85970519,d.aWw&ion=1&um=1&ie=UTF-8&q=Ce5+queretaro&fb=1&gl=mx&hnear=0x85d35aca4b1dca91:0x78b6be4ddfb6a71e,ce5+queretaro&cid=8698348971987740446&sa=X&ei=t_bjVKSJKJGmyATQ-oEw&ved=0CCEQrwswAA',
                city: 'Santiago de Querétaro',
                state: 'Qro',
                phone: '(442) - 4465674',
                tel: '(442) - 1833586'
            },
            mail: 'aruiz@mexipol.com.mx',
            postCode: '76010',
            copyright: 'Mexipol Derechos reservados, 2015'
    };
    //Setting Contact tabs and validation

    this.previous = function () {
        if ($scope.contactTab > 1) {
            $scope.contactTab--;
        }
        else { $scope.contactTab = 1; }
    };
    this.concepts = [
        'Venta de Químicos',
        'Venta de Equipos',
        'Refacciones / Asistencia',
        'Dudas sobre Aplicaciones'
        ];
    $scope.conSelect = [];

    // toggle selection for a given subject by name
    this.toggleConcept = function toggleConcept(concept) {
        var idx = $scope.conSelect.indexOf(concept);

        // is currently selected
        if (idx > -1) {
            $scope.conSelect.splice(idx, 1);
       //     console.log($scope.conSelect);
       //     console.log($scope.conSelect.length);
        }

    // is newly selected
        else {
            $scope.conSelect.push(concept);
       //     console.log($scope.conSelect);
       //     console.log($scope.conSelect.length);
        }
        };
        $scope.description = function (Description) {
            $rootScope.description = Description;
        };
        $rootScope.description = 'Proveedores de Químicos y equipos de aplicación Graco de Poliurea, Poliuretano y recubrimientos en México';


    //Stablish MailPost, Saved via server.js' API to Nodemailer
    //Variables are: subject[], text, name, mail, phone, ext, business, address
    this.contSubmit = function () {
        for (i = 0; i < $scope.conSelect.length; i++) {
            if (i == 0) {
                $scope.contactData.subject = $scope.conSelect[i];
            }
            else {
                $scope.contactData.subject += ", " + $scope.conSelect[i];
            };
        };

        goog_report_conversion();

        $http.post('/mailPost', $scope.contactData)
        .success(function (data, status, headers, config) {
            $scope.contactTab = 4;
            $scope.contactData.result = '¡Gracias por Contactarnos!'; // clear the form so our user is ready to enter another
            $analytics.eventTrack('ContactForm', { category: 'Contact', label: 'ContactForm' });
        }).error(function (data) {
            console.log('Error: ' + data);
            $scope.contactTab = 4;
            $scope.contactData.result = 'Error on HTTP post';
        });
    };

        $(document).ready(
            function () { window.prerenderReady = true; }
        );
        $rootScope.$watchCollection('tasks', function(newValue, oldValue){
            // If Employee is not loged in then skip next step
            if($rootScope.activeEmployee){
                nameString=$rootScope.activeEmployee.nombre.replace(" ", '-');
                console.log('Name String: ',nameString);
                resourceService.notifications.query({taskOwner: nameString}, function(notifications){
                    console.log('Notifications Response: ', notifications);
                    $rootScope.notifications=notifications;
                });
            }


        });
        $rootScope.$watchCollection('activeEmployee', function(newValue, oldValue){
            // If Employee is not loged in then skip next step
            if($rootScope.activeEmployee){
                nameString=$rootScope.activeEmployee.nombre.replace(" ", '-');
                console.log('Name String: ',nameString);
                resourceService.notifications.query({taskOwner: nameString}, function(notifications){
                    console.log('Notifications Response: ', notifications);
                    $rootScope.notifications=notifications;
                });
            }
        });

}]);//Ending of Angular Module
