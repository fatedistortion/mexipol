NerdCtrl.controller('DashController',['$scope', '$cookies', '$cookieStore', '$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', function ($scope, $cookies, $cookieStore, $http, userFactory, $location, $route, $routeParams, $rootScope) {
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
    $scope.tasks =$rootScope.tasks;
    $scope.accounts=$rootScope.accounts;
    console.log('Accounts: ', $scope.accounts);
    $scope.opportunities=$rootScope.opportunities;
    $scope.user={};
    $scope.potential=$rootScope.potentials;
   
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
    $scope.loginCRM = function(user){
        //PROCESS SHOULD BE IN BACK END FOR SECURITY
        passed={};
        passed.email=false;
        passed.password=false;
        //Use rootScope employees to parse existing users
        matchedEmployee=$rootScope.employees.filter(emailHas(user.email))[0]
        if(matchedEmployee.email==user.email){
            passed.email=true;
        }
        if(matchedEmployee.password==user.password){
            passed.password=true;
        }
        console.log('Checked as: ', passed);
        if(passed.password && passed.email){
            $cookies.putObject('Employee', matchedEmployee);
            $rootScope.activeEmployee=$cookies.getObject('Employee');            
            //$rootScope.activeEmployee=matchedEmployee;            
        }else{
            $scope.unauthorized=true;
        }
        console.log('Matched Employee: ',$rootScope.activeEmployee);
    }
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
    var potentialQ = function ($routeParams, accountsArray) {
        console.log('The route is: ', $routeParams);
        if (typeof $routeParams.id != 'undefined') {
            if($routeParams.id != 'NEW'){
            //Should filter only one element, pass as first object of collection
            return accountsArray.filter(filteringIds($routeParams.id))[0];
        }else{
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
                substr=substr.substring(0,end);

                //If we know the account ID from routeparams then we can construct taskID
                //Otherwise we need to call id constructor from UI when task account has been edited
                //Returns the amount of taks assigned for a given account, fix with +1
                number=$scope.tasks.filter(filteringIdsFlex(substr)).length+1;
                if(number<100){
                    number='00'+number;
                }
                newTask.id='tas-'+substr+'-'+number;
            }
            //Else leave NEW until assigned an account
            console.log('Hail a New Task: ', newTask);
            $scope.formedit=false;
            $scope.formedit2=false;
            return newTask;
        }
        }
    }
    var potentialQ2 = function (idParams, accountsArray) {
        //Differs as a straight String Filter in passed Array, not from id
        console.log('The accountsArray is: ', accountsArray);
        if (typeof idParams != 'undefined') {
            //Should filter only one element, pass as first object of collection
            return accountsArray.filter(filteringIds(idParams))[0];
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
    var dataset = [
      { label: 'Abulia', count: 10 }, 
      { label: 'Betelgeuse', count: 20 },
      { label: 'Cantaloupe', count: 30 },
      { label: 'Dijkstra', count: 40 }
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
    $scope.addAccount = function(accountObject){
        //Account objet is passed from rootScope, hence it's already updated in DB
        temporal = $scope.display.accountId;
        temporalId = $scope.display.id;
        $scope.display.account=accountObject.title;
        $scope.display.accountId=accountObject.id;
        //Update rootScope Accounts' potential:
        //Remove from previous account before adding to new account
        //Use filter to update previous rootScope while keeping object reference  
        //Remove previous account potential by id and then update potential's id
        remainPotentials = $scope.accounts.filter(idHas(temporal))[0].potentials.filter(idHasNot(temporalId));
        $scope.accounts.filter(idHas(temporal))[0].potentials = remainPotentials;
        //Update potential Id based on accountObject and id before adding to new account
        $scope.display.id = accountObject.id.substring(3,accountObject.id.length-2);
            //Should return ac-[accountName-]00
            //Add number postfix according to new account potential numbers.
            // *Consider that potentials can be deleted and hence this ID should not 
            // Be repited, check highest number of postfixes
            // Use a parseInt and search, potential IDs should ONLY have one "-"
            numberIndex=$scope.accounts.filter(idHas(accountObject.id))[0].potentials.length;
            numberS=$scope.accounts.filter(idHas(accountObject.id))[0].potentials[numberIndex-1].id;
            number=parseInt(numberS.substring(numberS.search("-")+1))+1;
            if(number<10){
                $scope.display.id = $scope.display.id+'0'+number;
            }else{
                $scope.display.id = $scope.display.id+number;
            }
        //Add to new account's potential
        $scope.accounts.filter(idHas(accountObject.id))[0].potentials.push({id: $scope.display.id});
        console.log('Accounts have new potential:', $scope.accounts.filter(idHas(accountObject.id)));
        console.log('Updated Potential: ', $scope.display);
    }
    
    
    this.init = function(){
        // #1 Scope display is a single account to display
        // #2 Scope dispPot is an array of potentials to display
        // #3 Scope dispPot is an array of potentials to display
        $rootScope.refreshCRM();
        if($location.$$path == '/crm/logout'){
            $cookies.remove('Employee');
            $rootScope.activeEmployee = false;
            $location.$$path = '/crm';
        }

        
    }
    this.init();
    

}]);//END OF NerdController


