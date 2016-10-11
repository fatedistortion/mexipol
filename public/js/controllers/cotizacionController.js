NerdCtrl.controller('cotizacionCtrl',['$scope','$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'httpUpdate', 'resourceService', function ($scope, $http, userFactory, $location, $route, $routeParams, $rootScope, httpUpdate, resourceService) {
//    
    $scope.nerds = [];
    $scope.display = [];
    $scope.selected = [];

    $scope.date=new Date;
    $scope.cotizacion={
        account: {
            title: 'Contoso Ac de Cv',
            direccion: 'Avenida empresalia #46, col bosques empresariales',
            estado: 'Querétaro',
            pais: 'México',
            tel: '213-5669',
            correo: 'contacto@contoso.com'
        },
        equipo: 'E-10',
        number: 'contoso-001',
        description: '(Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –  Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)',
        cantidad: 1,
        precio: 14610,
        total: 14610
    };
    resourceService.potentials.get({id: $routeParams.potentialId},function(potential){
        console.log('Potential Gotten :', potential.opportunities);
        $scope.cotizacion.products=potential.opportunities;
        $scope.cotizacion.number=potential.id;
        for (var i = $scope.cotizacion.products.length - 1; i >= 0; i--) {
            $scope.cotizacion.products[i].customization=$scope.cotizacion.products[i].customization.filter(function(element){if(element.select){return element;}});
            $scope.cotizacion.products[i].precio=$scope.cotizacion.products[i].precio*potential.indiceDesc/100;
            if($scope.cotizacion.products[i].select){
                $scope.cotizacion.products[i].select=$scope.cotizacion.products[i].select.filter(function(element){if(element.select){return element;}});
            }
        };
    });
    resourceService.accounts.get({id: $routeParams.accountId}, function(account){
        $scope.cotizacion.account=account;
        console.log('Account Gotten: ', account);
    });

    /*** URL PARAMETER CONTROLLER FUNCTIONS ***/
    //Single var function for initial value
    /*
    console.log('Rootscope has:', $rootScope);
    var activateAccount = function ($routeParams) {
        console.log('The route is: ', $routeParams);
        if (typeof $routeParams.id == 'undefined') {
            //If no id parameter return to main page
            $location.path('/');
        }else{
            //Task does not exist and search variables should be used for creating a new Tasks 
            //It takes it's input from scope.tasks as filter, since NEw doesn't exist it creates one of it's own.
            //NEW task does not require to define keys since they'd be added on UI.
            //Get newTask id, $routeParams is alway populated since any new task already has id="NEW"
            $scope.potentialQueu=[];
            if($routeParams.id){
                console.log('Starting with: ', $routeParams.id);
                resourceService.accounts.get({id: $routeParams.id}, function(account){
                    console.log('account to activate: ',account);
                    $scope.activeAccount=account;
                    $scope.activeAccount.valid=true;
                    if(!account.valid){
                        account.valid=true;
                        for (var i = account.potentials.length - 1; i >= 0; i--) {
                            resourceService.potentials.get({id: account.potentials[i].id}, function(potential){
                                potential.valid=true;
                                $scope.potentialQueu.push(potential);
                                potential.$save();
                            });
                        };
                        account.$save();
                    // Send activation email from inside promise callback function, use a scalated if -> success function to keep queu without saturation

                    $rootScope.refreshCRM();
                    }else{
                        // Print an error statement, accoutn is already active
                        account.valid=true;
                        account.$save();
                        $rootScope.refreshCRM();
                    }
                });
                // $scope.activeAccount=$rootScope.accounts.filter(idHas($routeParams.id))[0];
                
                //Account's potentials are stored separatelly, use recursive searching 
                /*
                $scope.activeAccount.potentials.forEach(function(element, index){
                    console.log('Element Id:', element.id);
                    thisPotential=$rootScope.potentials.filter(idHas(element.id))[0];
                    thisPotential.valid=true;
                    console.log('This Potential: ', thisPotential);
                    //Return a filter of each potential and change valid to true
                    //Do not return anything
                });
                *//*

            }
         console.log('Activated account: ', $scope.activeAccount);
        }
    }
    
    */
   
    function idHas(wordToCompare) {
        return function(element) {
            return element.id.search(wordToCompare) !== -1;
        }
    }
    function idHasNot(wordToCompare) {
        return function(element) {
            return !(element.id.search(wordToCompare) !== -1);
        }
    }
    

}]);//END OF NerdController