NerdCtrl.controller('ActivateController',['$scope','$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'httpUpdate', 'resourceService', function ($scope, $http, userFactory, $location, $route, $routeParams, $rootScope, httpUpdate, resourceService) {
//    
    $scope.nerds = [];
    $scope.display = [];
    $scope.selected = [];
    //Each potential is an user which Belongs to an Account
    //Each Account is defined by all Potentials belonging to it
    //Each potential has a set of quotations and buys
    //Each quotation should allow more than one element on same sale
    /*
    * Each potential can have state: 
    * Negociación, Cerrado - Vendido, Cerrado - Perdido, Seguimiento
    * 
    *
    *
    * $rootScope.tasks;
    * $rootScope.accounts;
    * console.log('Accounts: ', $rootScope.accounts);
    * $rootScope.opportunities;
    * $rootScope.potentials;
    */
    //$scope.nerds = userFactory.promise().then(function(data){console.log('Data is: ', data);});
    //use Factories to return promises and cleanly assign promise data to scope
    // userFactory.promise().then(function(data){$scope.nerds = data.data;});
   
    //getNerds();
    
    //-- Declaring general Get,Post, Delete Geeks --//     
    //$Scope can be changed for this, whole scope variable is changed
    // in appRoutes, 'this.variable' in controllers are appropiate
    // for manually overriding controller specific variables with
    // possible conflicting names with other controllers
    function getNerds() {
        $http.get('/api/nerds')
        .success(function (data) {
            $scope.nerds = data;
            console.log(data);
        });
    };

    //Stablish Post, Saved via route.js's Api to Mongoose "postNerds()" function
    $scope.postNerds = function () {//formData might need to differ in name
        $http.post('/api/nerds', $scope.formData) //formData is passed as req.body....
            .success(function (data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.nerds = data;
            console.log(data);
        })
            .error(function (data) {
            console.log('Error: ' + data);
        });
    };

    //Stablish Delete
    $scope.deleteNerd = function (id) {
        $http.delete('/api/nerds/' + id)
            .success(function (data) {
            $scope.nerds = data;
            console.log(data);
            console.log('Delete Enabled' + id)
        })
            .error(function (data) {
            console.log('Error: ' + data);
        });
    };

    /*** URL PARAMETER CONTROLLER FUNCTIONS ***/
    //Single var function for initial value
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
                    var quoteObject= {
                        contacto: account.contacto[0],
                        potentialId: $routeParams.potentialId,
                        accountId: account.id
                    };
                    // Create new task for activated account
                    resourceService.tasks.query({id: $routeParams.id}, function(tasks){
                        var tempId=$routeParams.id.substr($routeParams.id.indexOf('-')+1);
                        tempId=tempId.substr(0,tempId.indexOf('-'));
                        if(tasks.length){
                            lengthTail=tasks[0].id.substr(-3);
                            if(lengthTail.indexOf('-')==0){
                                // Fix tail lag
                                lengthTail=tasks[0].id.substr(-2);
                            };
                            nextNum=tasks.length+1;
                            lengthTail=parseInt(lengthTail);
                            if(lengthTail==(nextNum)){
                                // Id Conflict with number, avoid task rejection
                                console.log(lengthTail);
                                console.log(nextNum);
                                nextNum=nextNum+1;
                            }
                        }else{
                            console.log('lengthTail is none');
                            lengthTail='None';
                            nextNum=0;
                        }
                        console.log('Text substring gotten: ', lengthTail);
                        if(nextNum<10){
                            number='00'+nextNum;
                        }else if(nextNum<100){
                            number='0'+nextNum;
                        }else{
                            number=nextNum;
                        }
                        var thisDate = new Date;
                        tempId='tas-'+tempId+'-'+number;
                        console.log('TempId: ', tempId);
                        tempTask={
                            id: tempId,
                            title: 'Nueva cotización por '+account.contacto[0].nombre,
                            accountId: account.id,
                            idPotential: account.potentials[0].id,
                            valid: true,
                            priority: 'high',
                            taskOwner: 'Alejandro Ruiz',
                            recordar: new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+8),
                            status: 'Not Started',
                            taskType: 'Venta',
                            descripcion: 'Nueva cotización activada, dar seguimiento'
                        };
                        var newTask = new resourceService.postTasks(tempTask);
                        console.log('Saved a task: ',tempTask);
                        newTask.$save();
                        resourceService.potentials.get({id: account.potentials[0].id}, function(potential){
                            // Find if task ID exists
                            ididPotentials=potential.tareas.filter(function(element){return (element.id==tempTask.id)});
                            if(ididPotentials.length==0){
                                // If potential task with this id doesn't exist, create it, else do nothing
                                potential.tareas.push({id: tempId});
                                potential.$save();
                            }
                        });
                    });
                    console.log('Sent quoteObject: ',quoteObject);
                    $http.post('/mailCotizacion', quoteObject)
                        .success(function(data){
                            console.log('Respose form mailCotizacion: ', data);
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });
                    $rootScope.refreshCRM();
                    }else{
                        // Print an error statement, accoutn is already active
                        account.valid=true;
                        for (var i = account.potentials.length - 1; i >= 0; i--) {
                            resourceService.potentials.get({id: account.potentials[i].id}, function(potential){
                                potential.valid=true;
                                $scope.potentialQueu.push(potential);
                                potential.$save();
                            });
                        };
                        account.$save();
                        $rootScope.refreshCRM();
                        var quoteObject= {
                            contacto: account.contacto[0],
                            potentialId: $routeParams.potentialId,
                            accountId: account.id
                        };
                        resourceService.tasks.query({id: $routeParams.id}, function(tasks){
                            var tempId=$routeParams.id.substr($routeParams.id.indexOf('-')+1);
                            tempId=tempId.substr(0,tempId.indexOf('-'));
                            if(tasks.length){
                                console.log('Tasks is: ',tasks);
                                lengthTail=tasks[0].id.substr(-3);
                                if(lengthTail.indexOf('-')==0){
                                    // Fix tail lag
                                    lengthTail=tasks[0].id.substr(-2);
                                };
                                nextNum=tasks.length+1;
                                lengthTail=parseInt(lengthTail);
                                if(lengthTail==(nextNum)){
                                    // Id Conflict with number, avoid task rejection
                                    console.log(lengthTail);
                                    console.log(nextNum);
                                    nextNum=nextNum+1;
                                }
                            }else{
                                console.log('lengthTail is none');
                                lengthTail='None';
                                nextNum=0;
                            }

                            console.log('Text substring gotten: ', lengthTail);
                            if(nextNum<10){
                                number='00'+nextNum;
                            }else if(nextNum<100){
                                number='0'+nextNum;
                            }else{
                                number=nextNum;
                            }
                            var thisDate = new Date;
                            tempId='tas-'+tempId+'-'+number;
                            console.log('TempId: ', tempId);
                            tempTask={
                                id: tempId,
                                title: 'Nueva cotización por '+account.contacto[0].nombre,
                                accountId: account.id,
                                idPotential: account.potentials[0].id,
                                valid: true,
                                priority: 'high',
                                taskOwner: 'Alejandro Ruiz',
                                recordar: new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+8),
                                status: 'Not Started',
                                taskType: 'Venta',
                                descripcion: 'Nueva cotización activada, dar seguimiento'
                            };
                            var newTask = new resourceService.postTasks(tempTask);
                            console.log('Saved a task: ',tempTask);
                            newTask.$save();
                            resourceService.potentials.get({id: account.potentials[0].id}, function(potential){
                                // Find if task ID exists
                                ididPotentials=potential.tareas.filter(function(element){return (element.id==tempTask.id)});
                                if(ididPotentials.length==0){
                                    // If potential task with this id doesn't exist, create it, else do nothing
                                    potential.tareas.push({id: tempId});
                                    potential.$save();
                                }
                            });
                        });
                        console.log('Sent quoteObject: ',quoteObject);
                        $http.post('/mailCotizacion', quoteObject)
                            .success(function(data){
                                console.log('Respose form mailCotizacion: ', data);
                            })
                            .error(function (data) {
                                console.log('Error: ' + data);
                            });
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
                */

            }
         console.log('Activated account: ', $scope.activeAccount);
        }
    }
    

   
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
    
    this.init= function(){
        activateAccount($routeParams);
    }
    this.init();

}]);//END OF NerdController