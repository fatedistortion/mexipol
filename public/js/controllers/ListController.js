NerdCtrl.controller('ListController',['$scope','$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'resourceService', 'httpUpdate', function ($scope, $http, userFactory, $location, $route, $routeParams, $rootScope, resourceService, httpUpdate) {
//    
    
    //Each potential is an user which Belongs to an Account
    //Each Account is defined by all Potentials belonging to it
    //Each potential has a set of quotations and buys
    //Each quotation should allow more than one element on same sale
    /*
    * Each potential can have state: 
    * Negociación, Cerrado - Vendido, Cerrado - Perdido, Seguimiento
    * 
    *
    */
    $rootScope.$watchCollection('accounts', function(newValue, oldValue){
        if($routeParams.listThis=='accounts'){
            $scope.display=newValue;
            $scope.dispType='accounts';
        }
    });
    $rootScope.$watchCollection('potentials', function(newValue, oldValue){
        if($routeParams.listThis=='potentials'){
            $scope.display=newValue;
            console.log('potentials Updated');
            $scope.dispType='potentials';
        }
        
    });
    $rootScope.$watchCollection('tasks', function(newValue, oldValue){
        if($routeParams.listThis=='tasks'){
            $scope.display=newValue;
            $scope.dispType='tasks';
            nameString=$rootScope.activeEmployee.nombre.replace(" ", '-');
            resourceService.notifications.query({taskOwner: nameString}, function(notifications){
                console.log('Notifications Response: ', notifications);
                $rootScope.notifications=notifications;
            });
        }
        
    });
    var openListing = function ($routeParams) {
        //listThis parameter can have three options: accounts, potentials, tasks
        if($routeParams.listThis=='accounts'){
            $scope.display=$rootScope.accounts;
            $scope.dispType='accounts';
        }else if($routeParams.listThis=='potentials'){
            $scope.display=$rootScope.potentials;
            console.log('potentials Updated');
            $scope.dispType='potentials';
        }else if($routeParams.listThis=='tasks'){
            $scope.display=$rootScope.tasks;
            $scope.dispType='tasks';
        }else{
            console.log('ERROR no viable routeParams option');
            $scope.dispType='none';
            $scope.display={};
        }
        console.log('Display is: ', $scope.display);
    }

    //$scope.nerds = userFactory.promise().then(function(data){console.log('Data is: ', data);});
    //use Factories to return promises and cleanly assign promise data to scope
    userFactory.promise().then(function(data){$scope.nerds = data.data;});
   
    $scope.tagline = 'Nothing beats a pocket protector!';
    $scope.tokyo = 'Bazzingaa!';
    //-- Declaring general Get,Post, Delete Geeks --//     
    // $Scope can be changed for this, whole scope variable is changed
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

    function emailHas(wordToCompare) {
        return function(element) {
            return element.email.search(wordToCompare) !== -1;
        }
    }
    function passwordHas(wordToCompare) {
        return function(element) {
            return element.password.search(wordToCompare) !== -1;
        }
    }

    /*** URL PARAMETER CONTROLLER FUNCTIONS ***/
    //Single var function for initial value
    console.log('Rootscope has:', $rootScope);
    
    function filteringIds(idString){
        return function(element){
          /*Should return a true statement*/      
          /*element is an object*/
          console.log('idString is: ',idString);
          console.log('Element ID is: ',element.id);
          return (element.id == idString);
        }
    };
    function filteringIdsFlex(idString){
        return function(element){
          /*Should return a true statement*/      
          /*element is an object*/
          console.log('idString is: ',idString);
          console.log('Task ID is: ',element.id);
          return (element.id.indexOf(idString) != -1);
        }
    };
    function taskIdGen(accountId){
        //To be called from a constructor when task account changes
        //or when creating a brand new task and assign an account
        //should be passed accountId ONLY, from account autocomplete object
        start = newTask.accountId.search("-");
        substr = newTask.accountId.substring(start+1);
        end = substr.search("-");
        substr=substr.substring(end);

        number=$scope.tasks.filter(filteringIdsFlex(substr)).length;
        newTask.id='tas-'+substr+number;
    }
    /** ================================== **/
    /** INITIALIZE FUNCTIONS OF CONTROLLER **/
    // Should only pass controllers as scope array objects
    // Processing and filtering should be done here not in html
    $scope.edit={
        account: false,
        description: false
    };
    $scope.d3dataset2 = [
        { x: 0, y: 3, },
        { x: 1, y: 8, },
        { x: 2, y: 6, },
        { x: 3, y: 12, },
    ];
    $scope.d3dataset = [
      { label: 'Email', score: 10 }, 
      { label: 'Web', score: 20 },
      { label: 'Telefono', score: 30 },
      { label: 'Google', score: 35 }
    ];
    $scope.d3Data = [
        {name: "Greg", score:98},
        {name: "Ari", score:96},
        {name: "Loser", score: 48}
    ];
    $scope.donutData = [10, 20, 30];
    
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
    $scope.addSubtask = function(subtaskArray, taskObject){
        subtaskArray.push(taskObject);
    };

    $scope.fillTask = function () {
        console.log('Form SUbmitted');
        if(typeof $scope.display.title == 'undefined'){
            $scope.edit.title=false;
        }else{
            $scope.edit.title=true;
        }
        if(typeof $scope.display.descripcion == 'undefined'){
            $scope.edit.descripcion=false;
        }else{
            $scope.edit.descripcion=true;
        }
        if(typeof $scope.display.fechaCierre == 'undefined'){
            $scope.edit.fechaCierre=false;
        }else{
            $scope.edit.fechaCierre=true;
        }
        if(typeof $scope.display.prioridad == 'undefined'){
            $scope.edit.prioridad=false;
        }else {
            $scope.edit.prioridad=true;
        }
        if(typeof $scope.display.fechaInicio == 'undefined'){
            $scope.edit.fechaInicio=false;
        }else{
            $scope.edit.fechaInicio=true;
        }
        if(typeof $scope.display.estado == 'undefined'){
            $scope.edit.estado=false;
        }else{
            $scope.edit.estado=true;
        }
        if(typeof $scope.display.idPotential == 'undefined'){
            $scope.edit.idPotential=false;
        }else{
            $scope.edit.idPotential=true;
        }
        if(typeof $scope.display.indiceDesc == 'undefined'){
            $scope.edit.indiceDesc=false;
        }else{
            $scope.edit.indiceDesc=true;
        }
        if(typeof $scope.display.origen == 'undefined'){
            $scope.edit.origen=false;
        }else{
            $scope.edit.origen=true;
        }
        if(typeof $scope.display.contacto == 'undefined'){
            $scope.edit.contacto=false;
        }else{
            $scope.edit.contacto=true;
        }
        if(typeof $scope.display.prioridad == 'undefined'){
            $scope.edit.prioridad=false;
        }else{
            $scope.edit.prioridad=true;
        }
        console.log('Edit array:', $scope.edit);
        $scope.formedit=true;
    };
     $scope.editAll = function(){
        objects=Object.keys($scope.edit);
        for (var i = objects.length - 1; i >= 0; i--) {
            if(!$scope.formedit){
                $scope.edit[objects[i]]=false;
            }else{
                $scope.edit[objects[i]]=true;
            }
            
        };
    }
    $scope.removeAccount = function(accountId, thisId){
        // Must remove all associated potentials to this account
        console.log('Removed Account: ', accountId);
        resourceService.accounts.get({id: thisId}, function(account){
            // Use sequential query to avoid backend saturation, consider an alternate to for if this happens
            if(account.potentials.length){
                // Some accounts are deleted without potentials
                console.log('accountId: ', thisId);
                resourceService.potentials.query({id: thisId}, function(potentials){
                    console.log('Retrieved potentials assigned to account deletion: ',potentials);
                    for (var i = potentials.length - 1; i >= 0; i--) {
                        $http.delete('/api/potentials/'+potentials[i]._id)
                        .success(function (data) {
                            console.log('Successfully Removed potential: ',data);
                        });
                    };

                });
                resourceService.tasks.query({id: thisId}, function(tasks){
                    console.log('Retrieved Tasks assigned to potential deletion: ',tasks);
                    for (var i = tasks.length - 1; i >= 0; i--) {
                        $http.delete('/api/tasks/'+tasks[i]._id).success(function (data) {
                            console.log('Successfully Removed task: ',data);
                        });
                    };
                });
                setTimeout(function(){resourceService.accounts.delete({id: accountId});}, 1000);
                
            }else{
                resourceService.accounts.delete({id: accountId});
            }

            setTimeout(function(){$rootScope.refreshCRM(); }, 1950);
        });
    }
    $scope.removePotential = function(potential){
        // Receive complete potential to also remove from accountId list of potentials
        resourceService.accounts.get({id: potential.accountId}, function(account){
            if(account.id){
                // Some buggy removal of accounts may eliminate accounts but not potentials
                // wrap in IF account exists
                console.log('Received potential: ',potential.id);
                console.log('Received account: ',account);
                account.potentials=account.potentials.filter(idHasNot(potential.id));
                httpUpdate.account(account.id, account);
            }else{
                console.log('Account not found, verify!');
            }
        });
        console.log('idPotential: ', potential.id);
        resourceService.tasks.query({id: potential.id}, function(tasks){
            console.log('Retrieved Tasks assigned to potential deletion: ',tasks);
            for (var i = tasks.length - 1; i >= 0; i--) {
                $http.delete('/api/tasks/'+tasks[i]._id).success(function (data) {
                    console.log('Successfully Removed task: ',data);
                });
            };
        });
        $http.delete('/api/potentials/'+potential._id)
        .success(function (data) {
            console.log('Successfully Removed potential: ',data);
            
            setTimeout(function(){ $rootScope.refreshCRM();}, 150);
        });
    }
    $scope.removeTasks = function(task){
        // Receive complete task to also remove from potential list
        resourceService.potentials.get({id: task.idPotential}, function(potential){
            if(potential.id){
                // Some buggy removal of accounts may eliminate accounts but not potentials
                // wrap in IF account exists
                console.log('Received task: ',task.id);
                console.log('Received potential: ',potential);
                potential.tareas=potential.tareas.filter(idHasNot(task.id));
                httpUpdate.potential(potential.id, potential);
            }else{
                console.log('Potential not found, verify!');
            }
        });
        $http.delete('/api/tasks/'+task._id)
        .success(function (data) {
            console.log('Successfully Removed task: ',data);
            setTimeout(function(){ $rootScope.refreshCRM();}, 150);
        });
    }
    
    this.init = function(){
        // #1 Scope display is a single account to display
        // #2 Scope dispPot is an array of potentials to display
        // #3 Scope dispPot is an array of potentials to display
        $rootScope.refreshCRM();
        openListing($routeParams);
        
    }
    this.init();
    

}]);//END OF NerdController


