var NerdCtrl = angular.module('NerdCtrl', ['NerdService']);

NerdCtrl.controller('CRMController',['$scope','httpPost', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'resourceService', function ($scope, httpPost, userFactory, $location, $route, $routeParams, $rootScope, resourceService) {
//    
    $scope.nerds = [];
    $scope.display = [];
    $scope.optional = {};
    
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
    console.log('Rootscope Potentials: ', $rootScope.potentials);

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

/************** URL PARAMETER CONTROLLER FUNCTIONS **********************/
//Single var function for initial value
    function filteringIdsFlex(idString){
        return function(element){
          /*Should return a true statement*/      
          /*element is an object*/
          return (element.id.indexOf(idString) != -1);
        }
    };
    var accountQ = function ($routeParams, accountsArray) {
        console.log('The route is: ', $routeParams);
        console.log('Returned resourceService from routeParams: ',resourceService.accounts.get({id: $routeParams.id}));
        if (typeof $routeParams.id != 'undefined') {
            if($routeParams.id == 'NEW'){
            $scope.saveFlag=true;
            //Save flag is used to pass to rootScope on save;
            console.log('new Account!');
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
                number=$scope.accounts.filter(filteringIdsFlex(substr)).length+1;
                if(number<10){
                    number='0'+number;
                }
                newTask.id='ac-'+substr+'-'+number;
            }
            //Else leave NEW until assigned an account
            //Generate contacto and potentials array, since they're saved using "Push"
            newTask.contacto=[];
            
            console.log('Hail a New Account: ', newTask);
            $scope.formedit=false;
            return newTask;

        }
        }
    };
    // Mounted on scope for acount hierarchy querry, can use array of ids
    // [OPTIMIZE]
    var account2pot = function (parentId, childArray) {
         console.log('account2pot: ', parentId);
        if (typeof parentId != 'undefined') {
            if (typeof(parentId)=='string'){
                             
                //Should filter only one element, pass as first object of collection
                return childArray.filter(filteringIds(parentId))[0];
            } else if(typeof(parentId)=='object'){
                 console.log('account2pot is an object', parentId);
                //Should filter only one element as well since works with id Filtering of potentials
                queryStore = [];
                if(parentId.length != 0){
                    if (Object.keys(parentId[0]).some(function(element){return element=='id'})){
                        for (var i = parentId.length - 1; i >= 0; i--) {
                            queryStore.push(childArray.filter(filteringIds(parentId[i].id))[0])
                        };
                    }else{
                        for (var i = parentId.length - 1; i >= 0; i--) {
                            queryStore.push(childArray.filter(filteringIds(parentId[i]))[0])
                        };

                    }
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
          return (element.id == idString);
        }
    };
    function hasAccountId(accountIdString){
        return function(element){
          return (element.accountId == accountIdString);
        }
    };
    function idHas(wordToCompare) {
        return function(element) {
            return element.id.search(wordToCompare) !== -1;
        }
    };
    $scope.modalParser = function (companyArray, option, index) {
        //Modal parser version for edit and add contacts
        //Use intermediate scope object optional to pass for savecontacts
        $scope.modal = angular.copy(companyArray);
        companyArray = {};
        if(typeof(index) != 'undefined'){
            $scope.optional.index = index;
        }if(typeof(option) != 'undefined'){
            $scope.optional.option = option;
        }
        console.log('Scope Optional has: ', $scope.optional);        
        console.log('Modal Company Array is: ', $scope.modal);
        //Use "JQuery's HasClass() for clean-liness" 
        $("#myModal").removeClass("fade");
        $("#myModal").addClass("in");
        console.log("removed class");

    };
    $scope.modalParserAccount = function (account) {
         /* body... do not use deepCopy since this modal is referential to this object */
         console.log("added Account class");
        $scope.modal = account;
        $("#myModal2").removeClass("fade");
        $("#myModal2").addClass("in");

    }
    $scope.saveAccount = function () {
         /* 
            1.  Save account must verify if account is new, this means it's not referenced and 
                must be stored in DB.
            2.  If $scope.display.id == "NEW" then account's id must be remade from account's Name
                and stored as new object.
            3.  Use: resourceService.accounts.update({id: $routeParams.id}, $scope.display);
                to update existing dataObject
         */ 
        //Eliminate spaces from title and generate id if "ID==NEW"
        if ($scope.display.id=='NEW') {
            // statement
            Actemporal=angular.copy($scope.display.title);
            var spaces=[];
            for(var i=0; i<Actemporal.length; i++){
                if(Actemporal[i]==' '){
                 spaces.push(i);
                }
            };
            for(var i=0; i<spaces.length; i++){
            Actemporal=Actemporal.substring(0,spaces[i]-i)+Actemporal.substring(spaces[i]+1-i)
            }
            Actemporal='ac-'+Actemporal.toLowerCase();
            //Add numeral reference by checking existing strings in account Name
            accountNum = $rootScope.accounts.filter(idHas(Actemporal)).length;
            //Should return accountNummber from it get account postfix
            if(accountNum<10){
                    Actemporal = Actemporal+'-0'+accountNum;
                }else{
                    Actemporal = Actemporal+'-'+accountNum;
            }   
            $scope.display.id = Actemporal;
            if(typeof $scope.display.potentials == 'undefined'){
                $scope.display.potentials=[];
            }
            $scope.display.valid=true;
            //Save to rootScope and re-referenced
            var saveobject= angular.copy($scope.display);
            $scope.display = new resourceService.accounts(saveobject);
            httpPost.account(saveobject);
            $location.path('/crm/account/'+saveobject.id);
            console.log('location: ',$location.path());

            //Rootscope and display are both referenced to saveobject, hence they're linked
            console.log('RootScope Accounts are: ',$rootScope.accounts);
            console.log('Display Accounts are: ',$scope.display);

        }

        $("#myModal2").addClass("fade");
        $("#myModal2").removeClass("in");
        resourceService.accounts.update({id: $routeParams.id}, $scope.display);
        console.log("New display is: ", $scope.display);
        delete $scope.modal;
        setTimeout(function(){
            $rootScope.refreshCRM();
        }, 600)
    }
    $scope.saveContact = function() {
        if(typeof($scope.optional.index)!='number'){
            $scope.optional.index=0;
            console.log('WARNING: Scope optional index overriden');
        }
        if($scope.optional.option == 'add'){
            //Use deepCopy to create a new object and avoid passing reference variables.
            var temArray = angular.copy($scope.modal);
            console.log('Adding contact');
            // $scope.display.contacto.push(temArray);
            resourceService.accounts.get({id: $scope.display.id}, function(account){
                account.contacto.push(temArray);
                account.$save();
                $scope.display=account;
                setTimeout(function(){
                    $rootScope.refreshCRM();
                }, 600)
            });

        }else if ($scope.optional.option == 'edit') {
            console.log('Editing contact');
            // WARNING!: Once for production this value needs to be pushed to DB
            // Otherwise it'll just reflect on scope.
            //$scope.display.contacto.splice($scope.optional.index, 1, $scope.modal);
            var editedContact=angular.copy($scope.modal);
            resourceService.accounts.get({id: $scope.display.id}, function(account){
                account.contacto.splice($scope.optional.index, 1, editedContact);
                console.log('Index is: ',$scope.optional.index);
                console.log("account's contact: ", account.contacto);
                account.$save();
                $scope.display=account;
                setTimeout(function(){
                    $rootScope.refreshCRM();
                }, 600)
            });
            
            console.log('New Edit is:', $scope.display.contacto);
        }
        $("#myModal").addClass("fade");
        $("#myModal").removeClass("in");
        delete $scope.modal;
        console.log("added class");

        console.log('modal is: ',$scope.modal);
        //$location.path('/aplicaciones');
    };
    $scope.modalClose = function () {
        $("#myModal").addClass("fade");
        $("#myModal").removeClass("in");
        $("#myModal2").addClass("fade");
        $("#myModal2").removeClass("in");
        console.log("added class");
        //Close does not eliminate referenced loaded object.
        // $scope.modal = {};
        //$location.path('/aplicaciones');
    };
    $scope.deleteContact = function(indexContact){
        $scope.display.contacto.splice(indexContact,1);
        console.log('spliced:', indexContact);
    };
    $scope.passTask = function (id, taskObject, contact) {
         /* 
        == Can use a new task without id argument or edit with id argument ==
            Pass taskObject to rootscope to edit existing taks 
            or tasks with previous autocomplete.
            Concact variable will be received as number string
            1. Task object must be an account array, should exist always
            2. Consider Adding tasks directly to Potentials
            3. Consider adding tasks directly to users as well
         */ 
         //$rootScope.taskComplete = taskObject;
         //If taskObject is not passed, contact should not exist
         // Be carefull not to pass contact as taskObject, use isNaN(parseInt(taskObject.id))
         // to know if it's a string
         
         if (typeof(taskObject)){
            searchConstruct = {};
            if(taskObject.id && isNaN(parseInt(taskObject.id))){
                searchConstruct.accountId=taskObject.id;
            }
            if (typeof(contact) != 'undefined' && contact != ''){
            searchConstruct.contact=contact;
            }   
         }
         console.log('searchConstruct: ', searchConstruct);
         taskBase = '/crm/task/'+id;
         console.log('passTask', taskBase);              
         $location.path(taskBase).search(searchConstruct);
    }
    $scope.passPotential = function (id, taskObject, contact) {
         /* 
        == Can use a new task without id argument or edit with id argument ==
            Pass taskObject to rootscope to edit existing taks 
            or tasks with previous autocomplete.
            Concact variable will be received as number string
            1. Task object must be an account array, should exist always
            2. Consider Adding tasks directly to Potentials
            3. Consider adding tasks directly to users as well
         */ 
         //$rootScope.taskComplete = taskObject;
         //If taskObject is not passed, contact should not exist
         // Be carefull not to pass contact as taskObject, use isNaN(parseInt(taskObject.id))
         // to know if it's a string
         
         if (typeof(taskObject)){
            searchConstruct = {};
            if(taskObject.id && isNaN(parseInt(taskObject.id))){
                searchConstruct.accountId=taskObject.id;
            }
            if (typeof(contact) != 'undefined' && contact != ''){
            searchConstruct.contact=contact;
            }   
         }
         console.log('searchConstruct: ', searchConstruct);
         taskBase = '/crm/potential/'+id;
         console.log('passPotential', taskBase);              
         $location.path(taskBase).search(searchConstruct);
    }

    /** ================================== **/
    /** INITIALIZE FUNCTIONS OF CONTROLLER **/
    // Should only pass controllers as scope array objects
    // Processing and filtering should be done here not in html
    var dataset = [
      { label: 'Abulia', count: 10 }, 
      { label: 'Betelgeuse', count: 20 },
      { label: 'Cantaloupe', count: 30 },
      { label: 'Dijkstra', count: 40 }
    ];
    $scope.donutData = [10, 20, 20];
    var donutData=[{
            label: 'Sin Cargar Datos',
            instances: 207
        }];
        // $scope.donutData2=
    function checkHashKey(term){
        console.log('TERM HASH is: ',term);
        return function(element){
            //Verify HashKey with hashkey term currently used in for loop
            console.log('TERM HASH is: ',term);
            console.log('$$hashKey is: ',element.id);
            return element.id == term;            
        }
    }
    this.init = function(){
        // #1 Scope display is a single account to display
        // #2 Scope dispPot is an array of potentials to display
        // #3 Scope dispPot is an array of potentials to display
        $scope.dispTasks = [];
        if($routeParams.id == 'NEW'){
            // If routeParams is new, it doesn't expect a promise, continue sequential init()
            // If it's not new, process should work after promise is resolved.
        $scope.display = accountQ($routeParams, $scope.accounts);
        console.log('Display :', $scope.display);
        $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);
        console.log('DispPot :', $scope.dispPot);    
        console.log('Tasks available are: ',$scope.tasks); 
        $scope.dispTasks=$scope.tasks.filter(hasAccountId($routeParams.id));
        console.log('DispTask :', $scope.dispTasks);
        }else{
            // if parameter is not NEW it requires a promise resolved
            $scope.display = resourceService.accounts.get({id: $routeParams.id});
            $scope.display.$promise.then(function(account){
                console.log('Resolved promise is: ',account);
                $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);
                console.log('DispPot :', $scope.dispPot);    
                console.log('Tasks available are: ',$scope.tasks); 
                $scope.dispTasks=$scope.tasks.filter(hasAccountId($routeParams.id));
                console.log('DispTask :', $scope.dispTasks);
                // Load for DonutChart constructor ========================================
                donutData=[];
                donutDataSimple=[];
                var changedPot=angular.copy($scope.dispPot);
                for (var i = changedPot.length - 1; i >= 0; i--) {
                    if(!donutData.some(function(element){return element.estado == changedPot[i].estado})){
                        objectX={
                            label: changedPot[i].estado,
                            instances: Math.round(changedPot[i].precio)
                        };
                        donutDataSimple.push(objectX.instances);
                        donutData.push(objectX);
                    }else{
                        // This estado exists, sum, must exist only one per estate
                        donutData.filter(function(element, index){
                            if(element.estado == changedPot[i].estado){
                                // Should occur only once per state
                                element.instances=element.instances+Math.round(changedPot[i].precio);
                            }
                        });
                    }
                };
                console.log('Donut Data2: ',donutData);
                console.log('Donut Data Simple: ',donutDataSimple);
                $scope.donutData2=angular.copy(donutData);
                $scope.donutData=angular.copy(donutDataSimple);

            });
            
        }
    }
    this.init();
    

}]);//END OF NerdController