NerdCtrl.controller('CRMControllerTask',['$scope','$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'resourceService', 'httpPost', function ($scope, $http, userFactory, $location, $route, $routeParams, $rootScope, resourceService, httpPost) {
//    
    $scope.nerds = [];
    $scope.display = [];
    
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
    $scope.tasks =$rootScope.tasks;
    $scope.accounts=$rootScope.accounts;
    console.log('Accounts: ', $scope.accounts);
    $scope.opportunities=$rootScope.opportunities;

    $scope.potential=$rootScope.potentials;


    //$scope.nerds = userFactory.promise().then(function(data){console.log('Data is: ', data);});
    //use Factories to return promises and cleanly assign promise data to scope
    userFactory.promise().then(function(data){$scope.nerds = data.data;});
   
    $scope.tagline = 'Nothing beats a pocket protector!';
    $scope.tokyo = 'Bazzingaa!';
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
    var taskQ = function ($routeParams, tasksArray) {
        console.log('The route is: ', $routeParams);
        if (typeof $routeParams.id != 'undefined') {
                if($routeParams.id != 'NEW'){
                //Should filter only one element, pass as first object of collection
                $scope.potentialFlag=true;

                
                resourceService.tasks.get({id: $routeParams.id}, function(task){
                    resourceService.accounts.get({id: task.accountId}, function(account){
                        // Fill autofillPotentials from promise if task is not new
                        $scope.accountPotentials = account.potentials;
                    });
                    return task;
                });
            }else{
                $scope.saveFlag=true;
                $scope.potentialFlag=false;
                //Save flag is used to pass to rootScope on save;
                console.log('new potential!');
                //Task does not exist and search variables should be used for creating a new Tasks 
                //It takes it's input from scope.tasks as filter, since NEw doesn't exist it creates one of it's own.
                //NEW task does not require to define keys since they'd be added on UI.
                newTask = $routeParams;
                //Get newTask id, $routeParams is alway populated since any new task already has id="NEW"
                if($routeParams.accountId){
                    console.log('Starting with: ', newTask);
                    start = newTask.accountId.search("-");
                    substr = newTask.accountId.substring(start+1);
                    end = substr.search("-");
                    substr=substr.substring(0,end).toLowerCase();

                    //If we know the account ID from routeparams then we can construct taskID
                    //Otherwise we need to call id constructor from UI when task account has been edited
                    //Returns the amount of taks assigned for a given account, fix with +1
                    console.log('Tasks are: ',$scope.tasks);
                    number=$scope.tasks.filter(filteringIdsFlex(substr)).length+1;
                    if(number<100){
                        number='00'+number;
                    }
                    newTask.id='tas-'+substr+'-'+number;
                    resourceService.accounts.get({id: $routeParams.accountId}, function(account){
                        // Fill autofillPotentials from accountId parameter if it exists
                        $scope.accountPotentials = account.potentials;
                    });
                }
                //Else leave NEW until assigned an account
                console.log('Hail a New Task: ', newTask);
                $scope.formedit=false;
                return newTask;
            }
        }
    }
    var taskQ2 = function (idParams, accountsArray) {
        //Differs as a straight String Filter in passed Array, not from id
        console.log('The accountsArray is: ', accountsArray);
        if (typeof idParams != 'undefined') {
            //Should filter only one element, pass as first object of collection
            return accountsArray.filter(filteringIds(idParams))[0];
        }else{
            //Might need to remove all else block if unassigned doesn't work
            //Save only account name as title
            unassinged = {};
            unassinged.title = 'unassigned account';
            return unassinged;
        }
    }
    // Mounted on scope for acount hierarchy querry, can use array of ids
    // [OPTIMIZE]
    var account2pot = function (parentId, childArray) {
         console.log('account2pot: ', parentId);
        if (typeof parentId != 'undefined') {
            if (typeof(parentId)=='string'){
                             
                //Should filter only one element, pass as first object of collection
                return childArray.filter(filteringIds(parentId))[0];
            } else if(typeof(parentId)=='object'){
                 console.log('account2pot is an object');
                //Should filter only one element as well since works with id Filtering of potentials
                
                queryStore = [];
                if (Object.keys(parentId[0]).some(function(element){return element=='id'})){
                    for (var i = parentId.length - 1; i >= 0; i--) {
                        queryStore.push(childArray.filter(filteringIds(parentId[i].id))[0])
                    };
                }else{
                    for (var i = parentId.length - 1; i >= 0; i--) {
                        queryStore.push(childArray.filter(filteringIds(parentId[i]))[0])
                    };

                }
                console.log('QueryStore has:', queryStore);
                return queryStore;
            }
        }

    };
    var pot2task = function (parentId, childArray) {
         console.log('pot2task: ', parentId);
        if (typeof parentId != 'undefined') {
            //This ParentId shouldn't be a string ever
            if(typeof(parentId)=='object'){
                 console.log('pot2task is an object');
                //Should filter only one element as well since works with id Filtering of potentials
                
                queryStore = [];
                if (Object.keys(parentId[0]).some(function(element){return element=='id'})){
                    for (var i = parentId.length - 1; i >= 0; i--) {
                        queryStore.push(childArray.filter(filteringIds(parentId[i].id))[0])
                    };
                }else{
                    for (var i = parentId.length - 1; i >= 0; i--) {
                        queryStore.push(childArray.filter(filteringIds(parentId[i]))[0])
                    };

                }
                console.log('QueryStore has:', queryStore);
                return queryStore;
            }
        }

    };
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
    function accountIdHas(idString){
        return function(element){
          return (element.accountId.search(idString) !== -1);
        }
    };
    function idHasNot(wordToCompare) {
        return function(element) {
            return !(element.id.search(wordToCompare) !== -1);
        }
    }
    function taskIdGen(accountId){
        //To be called from a constructor when task account changes
        //or when creating a brand new task and assign an account
        //should be passed accountId ONLY, from account autocomplete object
        start = $scope.display.accountId.search("-");
        substr = $scope.display.accountId.substring(start+1);
        end = substr.search("-");
        substr=substr.substring(0,end);
        console.log('AccountId is: ', accountId);
        console.log('Substring is: ', substr);
        number=$scope.tasks.filter(filteringIdsFlex(substr)).length+1;
        if(number<10){
                number='-0'+number;
            }else{
                number='-'+number;
           }
        $scope.display.id='tas-'+substr+number;
    }
    /** ================================== **/
    /** INITIALIZE FUNCTIONS OF CONTROLLER **/
    // Should only pass controllers as scope array objects
    // Processing and filtering should be done here not in html
    $scope.edit={
        account: false,
        description: false
    };
    var dataset = [
      { label: 'Abulia', count: 10 }, 
      { label: 'Betelgeuse', count: 20 },
      { label: 'Cantaloupe', count: 30 },
      { label: 'Dijkstra', count: 40 }
    ];
    $scope.donutData = [10, 20, 30];
    function checkHashKey(term){
        console.log('TERM HASH is: ',term);
        return function(element){
            //Verify HashKey with hashkey term currently used in for loop
            console.log('TERM HASH is: ',term);
            console.log('$$hashKey is: ',element.id);
            return element.id == term;            
        }
    }

    $scope.addSubtask = function(taskObject){
        if(typeof $scope.display.information =='undefined'){
            $scope.display.information=[];
        }
        // $scope.display.information.push(taskObject);
        // httpPost.tasks(angular.copy($scope.display),$scope.display.id);
        // Expects tasks to be updated without error, Does not return value
        resourceService.tasks.get({id: $scope.display.id}, function(task){
            console.log('TaskObject: ',taskObject);
            task.information.push(taskObject);
            $scope.display=task;
            $scope.display.dueDate=new Date(task.dueDate);
            $scope.display.modified=new Date(task.modified);
            $scope.display.recordar=new Date(task.recordar);
            task.$save();
            console.log('Task updated: ',task);

        }); 
    };
    $scope.fillTask = function () {
        $scope.display.taskOwner=$rootScope.activeEmployee.nombre;
        // Task Owner is always the creator of the task
        $scope.display.valid=true;
        var savedTask = angular.copy($scope.display);
        if($scope.saveFlag){
            // Only on firstsave, if exists routes.js will avoid duplicates
            $scope.saveFlag=false;
            httpPost.task(savedTask);
            /*
            resourceService.tasks.get({id: savedTask.id}, function(task){
                $scope.display=task;
            });
            */

            $scope.display=savedTask;
            console.log('First Save of Task: ',$scope.display);
            console.log('RootScope tasks: ',$rootScope.tasks);
            console.log('RootScope Potentials: ',$rootScope.potentials);
            //Some tasks need to be related to a potential or an account
            if($scope.potentialFlag){
                // Only triggered if automatically editted potential
                $scope.potential = resourceService.potentials.get({id: $scope.display.idPotential});
                $scope.potential.$promise.then(function(potential){
                    // Avoid repetitionof potential using filter
                    potential.tareas=potential.tareas.filter(idHasNot($scope.display.id));
                    potential.tareas.push({id: savedTask.id});
                    console.log('Potential to pass: ', potential);
                    httpPost.potential(potential,savedTask.idPotential);
                    $scope.oldPotential = potential.id;
                });
            }
        }else{
            if($scope.potentialFlag){
                // potentialFlag must be set on autofillAccounts only
                console.log('Old Potential is: ',$scope.oldPotential);
                $scope.potential = resourceService.potentials.get({id: $scope.oldPotential});
                $scope.potential.$promise.then(function(potential){
                    // Remove from old potential, return remaining tasks with idHasNot filter
                    console.log('Old Potential to pass: ', potential);
                    potential.tareas=potential.tareas.filter(idHasNot($scope.display.id));
                    httpPost.potential(potential,savedTask.idPotential);
                });
                $scope.potential = resourceService.potentials.get({id: $scope.display.idPotential});
                $scope.potential.$promise.then(function(potential){
                    // Avoid repetitionof potential using filter
                    potential.tareas=potential.tareas.filter(idHasNot($scope.display.id));
                    potential.tareas.push({id: savedTask.id});
                    console.log('New Potential to pass: ', potential);
                    httpPost.potential(potential,savedTask.idPotential);
                    $scope.oldPotential = potential.id;
                });

                $scope.potentialFlag = false;
                // Accept change, reset flag
            }
            resourceService.tasks.get({id: savedTask.id}, function(task){
                task = $scope.display;
                task.dueDate= new Date($scope.display.dueDate);
                task.modified= new Date($scope.display.modified);
                task.recordar= new Date($scope.display.recordar);
                task.valid=true;
                // Tasks on CRM Controller Tasks are always valid
                console.log('Saved task: ',task);
                httpPost.task(task, savedTask.id);
                //task.$save();
            });

        }
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
        if(typeof $scope.display.dueDate == 'undefined'){
            $scope.edit.dueDate=false;
        }else{
            $scope.edit.dueDate=true;
        }
        if(typeof $scope.display.priority == 'undefined'){
            $scope.edit.priority=false;
        }else {
            $scope.edit.priority=true;
        }
        if(typeof $scope.display.recordar == 'undefined'){
            $scope.edit.recordar=false;
        }else{
            $scope.edit.recordar=true;
        }
        if(typeof $scope.display.status == 'undefined'){
            $scope.edit.status=false;
        }else{
            $scope.edit.status=true;
        }
        if(typeof $scope.display.idPotential == 'undefined'){
            $scope.edit.idPotential=false;
        }else{
            $scope.edit.idPotential=true;
        }
        if(typeof $scope.display.taskType == 'undefined'){
            $scope.edit.taskType=false;
        }else{
            $scope.edit.taskType=true;
        }
        if(typeof $scope.display.contact == 'undefined'){
            $scope.edit.contact=false;
        }else{
            $scope.edit.contact=true;
        }
        console.log('Display array:', $scope.display);
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
    };
    $scope.autofillAccount = function (account) {
        //Should account for new potentials without set accounts
        if($scope.display.id=='NEW'){
        $scope.contactos=account.contacto;
        $scope.display.account=account.title;
        $scope.display.accountId=account.id;
        $scope.accountPotentials = account.potentials;
        taskIdGen(account.id)
        //$scope.addAccount(account);
        }else{
        $scope.display.account=account.title;
        $scope.display.accountId=account.id;
        $scope.accountPotentials = account.potentials;
        $scope.contactos=account.contacto;
        console.log('saved account with contacts: ', $scope.contactos);
        }         
    };
       $scope.autofillPotential = function (potential) {
            //Should account for new potentials without set accounts
            if($scope.display.id=='NEW'){
                // if NEW there's no potential avaiable, activate accounts first:
                $scope.accountF=1;
                $scope.accountW=1;
                $scope.accountP=0;
                $scope.accountQ=0;
            }else{
                $scope.display.idPotential=potential.id;
                $scope.potentialFlag=true;
               
                console.log('saved potential: ', potential);
            }         
        };

    this.init = function(){
        // #1 Scope display is a single account to display
        // #2 Scope dispPot is an array of potentials to display
        // #3 Scope dispPot is an array of potentials to display
        
        
        
        console.log('Display :', $scope.display);

        $scope.dispTasks = [];
        if($routeParams.id == 'NEW'){
            // If routeParams is new, it doesn't expect a promise, continue sequential init()
            // If it's not new, process should work after promise is resolved.
            $scope.display = taskQ($routeParams, $scope.tasks);
            console.log('Display :', $scope.display);
            $scope.display.account = taskQ2($scope.display.accountId, $scope.accounts).title;
            if($scope.saveFlag){
                // Wrapper adjuster for NEW potential flag, avoids saving a NEW object to DB
                $scope.saveFlag=false;
                $scope.fillTask();
                $scope.saveFlag=true;
            }else{
                $scope.fillTask();
            }        
            $scope.formedit=true;
        }else{
            // if parameter is not NEW it requires a promise resolved
            $scope.potentialFlag=false;
            $scope.formedit=true;
            // Raw promise resolution saved
            resourceService.tasks.get({id: $routeParams.id})
            .$promise.then(function(task){
                console.log('Resolved promise is: ',task);
                $scope.display=task;            
                $scope.display.dueDate=new Date(task.dueDate);
                $scope.display.modified=new Date(task.modified);
                $scope.display.recordar=new Date(task.recordar);
                $scope.oldPotential=task.idPotential;
                // $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);

            });           
        }
        
    }
    this.init();
    

}]);//END OF NerdController


