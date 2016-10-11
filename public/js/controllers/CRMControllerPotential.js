NerdCtrl.controller('CRMControllerPotential',['$scope','$http', 'userFactory', '$location', '$route', '$routeParams', '$rootScope', 'resourceService', 'httpPost', 'httpUpdate', function ($scope, $http, userFactory, $location, $route, $routeParams, $rootScope, resourceService, httpPost, httpUpdate) {
//  
//
    $rootScope.refreshCRM();
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
    */
    $scope.tasks =$rootScope.tasks;
    $scope.accounts=$rootScope.accounts;
    $scope.contactShow=false;
    console.log('Accounts: ', $scope.accounts);
    $scope.opportunities=$rootScope.opportunities;

    $scope.potential=$rootScope.potentials;
    $scope.sendError = false;
    $scope.sendSuccess = false;
    $scope.sendProcess=false;
    $scope.sendLink = '#';
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
    $scope.phase1=true;
    $scope.phase2=false;
    $scope.selectFilter={
        type:"",
        description:''
    };
    $scope.filterSelect=function(type){
        $scope.phase2=true;
        $scope.phase1=false;
        type.select=true;
        $scope.selectFilter.type=type.type;
        $scope.selectFilter.description=type.description;
        console.log('selectFilter: ',$scope.selectFilter);
        // Pass Type to modal
    };
    /*** URL PARAMETER CONTROLLER FUNCTIONS ***/
    //Single var function for initial value
    console.log('Rootscope has:', $rootScope);
    var potentialQ = function ($routeParams, potentialsArray) {
        console.log('The route is: ', $routeParams);
        if (typeof $routeParams.id != 'undefined') {
            if($routeParams.id != 'NEW'){
            // Should filter only one element, pass as first object of collection
            // Use accountFlag to state an account is assigned
            $scope.accountFlag=true;
            resourceService.potentials.get({id: $routeParams.id}, function(potential){
                return potential;
            });
//            return potentialsArray.filter(filteringIds($routeParams.id))[0];
            

        }else{
            $scope.saveFlag=true;
            $scope.accountFlag=false;
            //Save flag is used to pass to rootScope on save;
            console.log('new potential!');
            //Task does not exist and search variables should be used for creating a new Tasks 
            //It takes it's input from scope.tasks as filter, since NEw doesn't exist it creates one of it's own.
            //NEW task does not require to define keys since they'd be added on UI.
            newTask = angular.copy($routeParams);
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
                number=$scope.potential.filter(filteringIdsFlex(substr)).length+1;
                if(number<100){
                    number='00'+number;
                }
                newTask.id=''+substr+'-'+number;
            }
            //Else leave NEW until assigned an account
            console.log('Hail a New Task: ', newTask);
            $scope.formedit=false;
            $scope.formedit2=false;
            return newTask;
        }
        }
    }
    var potentialQ2 = function (idParams, potentialsArray) {
        //Differs as a straight String Filter in passed Array, not from id
        console.log('The potentialsArray is: ', potentialsArray);
        if (typeof idParams != 'undefined') {
            //Should filter only one element, pass as first object of collection
            return potentialsArray.filter(filteringIds(idParams))[0];
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
    function checkHashKey(term){
        console.log('TERM HASH is: ',term);
        return function(element){
            //Verify HashKey with hashkey term currently used in for loop
            console.log('TERM HASH is: ',term);
            console.log('$$hashKey is: ',element.id);
            return element.id == term;            
        }
    }
    function idHas(wordToCompare) {
        return function(element) {
            return element.id.search(wordToCompare) !== -1;
        }
    }
    function contactIs(contactName) {
        return function(element) {
            return element.nombre.search(contactName) !== -1;
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
        /* 
            1.  Check if first save of new potential to push to rootScope.
            2.  State scope.potential and scop.account as new resoursePotential and id'd account
                respectively,
            3.  Potential is not directly referenced to database, should be updated everytime 
                it's  editted.
            4.  When account changes, use $scope.accountFlag & $scope.lastAccount to remove
                potential from previous accounts and add them to new ones. 
        */
        $scope.display.valid=true;
        if(($scope.display.indiceDesc == undefined)||(typeof($scope.display.indiceDesc) == 'undefined') || $scope.display.indiceDesc ==0){
            // If undefined or cero change to 100
            $scope.display.indiceDesc=100;
        }
        console.log('indice Desc: ', $scope.display.indiceDesc );
        var saveobject= angular.copy($scope.display);
        if($scope.saveFlag){
            $scope.saveFlag=false;
            $scope.display=saveobject;
            //$rootScope.potentials.push(saveobject);
            /*
            $scope.potential = new resourceService.potentials(saveobject);
            $scope.potential.$save(function(potential, putResponseHeaders){
                // Get was done without id, should get all potentials
                console.log('Res potential: ',potential);
                if(putResponseHeaders){
                    console.log('Res potential: ',potential);
                }           
            });
            */
            httpPost.potential(saveobject);
            resourceService.potentials.get({id: saveobject.id})
            .$promise.then(function(potential){
                console.log('Resolved promise is: ',potential);
                $scope.display=potential;
                if(potential.fechaInicio){
                    $scope.display.fechaInicio=new Date(potential.fechaInicio);
                }
                if(potential.fechaCierre){
                    $scope.display.fechaCierre=new Date(potential.fechaCierre);
                }
                // $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);

            });


            //$rootScope.accounts.filter(idHas($scope.display.accountId))[0].potentials.push({id: saveobject.id});
            
            $scope.account = resourceService.accounts.get({id: $scope.display.accountId});
            $scope.account.$promise.then(function(account){
                account.potentials.push({id: saveobject.id});
                console.log('Account to pass: ', account);
                httpPost.account(account,saveobject.accountId);
                /*
                account.$save(function(account, putResponseHeaders) {
                    if(putResponseHeaders){
                        console.log('Res account: ',account);
                    }
                    //user => saved user object
                    //putResponseHeaders => $http header getter
                });
                */
            });
            //Trace back and re-referece recently pushed element for scope.display
            //Quick fix is to revert to saved object, stable route is to re-search for it in rootScope
            //Save to account's potentials reference to this saveobject's id
            console.log('First Save of Potential: ',$scope.display);
            console.log('RootScope Potentials: ',$rootScope.potentials);
            console.log('Accounts have new potential:', $scope.accounts.filter(idHas($scope.display.accountId))[0]);
            if($routeParams.id == 'NEW'){
                $location.path('/crm/potential/'+$scope.display.id);
            }
        }else{
            // Check for aditional flags that occur after potential is savedFlag = false
            // Test if account assinged has changed to remove potential from previous account
            // Since account can be changed multiple times between save states. accounts should
            // be saved when "Edit" is clicked and "Saved"
            if($scope.accountFlag){
                // AccountFlag must be set on autofillAccounts only
                $scope.oldAccount;
                $scope.account = resourceService.accounts.get({id: $scope.oldAccount});
                $scope.account.$promise.then(function(account){
                    // Remove from old account, return remaining potentials with idHasNot filter
                    account.potentials=account.potentials.filter(idHasNot($scope.display.id));
                    httpPost.account(account,saveobject.accountId);
                    console.log('Account to pass: ', account);
                });
                $scope.account = resourceService.accounts.get({id: $scope.display.accountId});
                $scope.account.$promise.then(function(account){
                    // Avoid repetitionof potential using filter
                    account.potentials=account.potentials.filter(idHasNot($scope.display.id));
                    account.potentials.push({id: saveobject.id});
                    console.log('Account to pass: ', account);
                    httpPost.account(account,saveobject.accountId);
                    $scope.oldAccount = account.id;
                });

                $scope.accountFlag = false;
                // Accept change, reset flag
            }
            if($routeParams.id != 'NEW'){
                // Do not save NEW until 'Guardar' stores it
                console.log('Route params: ',$routeParams.id);
                httpPost.potential(saveobject, saveobject.id);
                resourceService.potentials.get({id: saveobject.id}, function(potential){
                    console.log('Saved potential: ',saveobject);
                    $scope.display = potential;
                });
            }else{

            }
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
        $scope.oldAccount=$scope.display.accountId;
        // Whenever clicked, save old accountId to be used for account.potential Cleanup
    }
    $scope.autofillAccount = function (account) {
        //Should account for new potentials without set accounts
        $scope.contactShow=true;
        if($scope.display.id=='NEW'){
        $scope.contactos=account.contacto;
        $scope.addAccount(account);
        }else{
        //When changed flash accountFlag = true so accounts are cleaned
        $scope.contactShow=true;
        $scope.accountFlag=true;
        $scope.display.account=account.title;
        $scope.display.accountId=account.id;
        $scope.contactos=account.contacto;
        console.log('saved account with contacts: ', $scope.contactos);
        }
         
    }
    $scope.addAccount = function(accountObject){
        //Account objet is passed from rootScope, hence it's already updated in DB
        temporal = $scope.display.accountId;
        temporalId = $scope.display.id;
        $scope.display.account=accountObject.title;
        $scope.display.accountId=accountObject.id;
        console.log('accountObject is: ',accountObject);
        //Update rootScope Accounts' potential:
        //Remove from previous account before adding to new account
        //Use filter to update previous rootScope while keeping object reference  
        //Remove previous account potential by id and then update potential's id
        remainPotentials = $scope.accounts.filter(idHas(temporal))[0].potentials.filter(idHasNot(temporalId));
        $scope.accounts.filter(idHas(temporal))[0].potentials = remainPotentials;
        //Update potential Id based on accountObject and id before adding to new account
        $scope.display.id = accountObject.id.substring(3,accountObject.id.length-2);
        
        //resourceService.accounts.update({id: temporal}, $scope.display);
            //Should return ac-[accountName-]00
            //Add number postfix according to new account potential numbers.
            // *Consider that potentials can be deleted and hence this ID should not 
            // Be repited, check highest number of postfixes
            // Use a parseInt and search, potential IDs should ONLY have one "-"
            numberIndex=$scope.accounts.filter(idHas(accountObject.id))[0].potentials.length;
            if(numberIndex>0){
                numberS=$scope.accounts.filter(idHas(accountObject.id))[0].potentials[numberIndex-1].id;
                number=parseInt(numberS.substring(numberS.search("-")+1))+1;
                if(number<10){
                    $scope.display.id = $scope.display.id+'0'+number;
                }else{
                    $scope.display.id = $scope.display.id+number;
                }
            }else{
                $scope.display.id = $scope.display.id+'01';
            }
        console.log('Updated Potential: ', $scope.display);
    }
    $scope.fillOppotunity = function () {
        if($scope.selected.length > 0){
            //Redefine precio everytime selected has new items to add
            $scope.display.precio = 0;
            for (var i = $scope.selected.length - 1; i >= 0; i--) {
                //Push each object, not the array of objects
                $scope.display.opportunities.push($scope.selected[i]);
            };
            for (var i = $scope.display.opportunities.length - 1; i >= 0; i--) {
                //Once opportunities is reset, add to price reference of each item, so when eliminated
                //it's eliminated from price variable due to reference.
                $scope.display.precio = $scope.display.precio +$scope.display.opportunities[i].precio;
            };
            console.log('Nuevo Precio: ', $scope.display.precio);

            resourceService.potentials.get({id: $scope.display.id}, function(potential){
                savePot= angular.copy($scope.display);
                potential.precio=savePot.precio;
                potential.opportunities=savePot.opportunities;
                potential.$save(function(potentialSaved, putResponseHeaders){
                    $scope.display=potentialSaved;
                    console.log('Updated Response Headers: ',putResponseHeaders);
                    if($scope.display.indiceDesc){
                        $scope.display.precio=potentialSaved*($scope.display.indiceDesc/100);
                    }
                });      
            setTimeout(function(){
                resourceService.potentials.get({id: $scope.display.id}, function(potential){
                        $scope.display=potential;
                    });
            }, 1800)          
                console.log('Updated promise is: ',potential);
                $scope.oldAccount=potential.accountId;
                // $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);

            });

        };
        $scope.selected=[];
        console.log('fillOppotunity Called:', $scope.display);
    };
    $scope.deleteOppotunity = function (index) {
        $scope.display.opportunities.splice(index,1);
        $scope.display.precio = 0;
          
        for (var i = $scope.display.opportunities.length - 1; i >= 0; i--) {
            //Once opportunities is reset, add to price reference of each item, so when eliminated
            //it's eliminated from price variable due to reference.
            $scope.display.precio = $scope.display.precio +$scope.display.opportunities[i].precio;
        };
        
        resourceService.potentials.get({id: $scope.display.id}, function(potential){
                savePot= angular.copy($scope.display);
                potential.precio=savePot.precio;
                potential.opportunities=savePot.opportunities;
                potential.$save(function(potentialSaved, putResponseHeaders){
                    console.log('Updated promise is: ',potential);
                    $scope.display=potentialSaved;
                    if($scope.display.indiceDesc){
                        $scope.display.precio=potentialSaved*($scope.display.indiceDesc/100);
                    }
                    console.log('Updated Response Headers: ',putResponseHeaders);
                });                
                $scope.oldAccount=potential.accountId;
                // $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);

        });
        console.log('deleteOppotunity Called:', $scope.display);
    };
    $scope.oppModal = function(equipment){
        //Save equipment for scope modal.
        $scope.modal=equipment;
        console.log('equipment is:', equipment);
        $("#myModal").addClass("in");
        $("#myModal").removeClass("fade");

    }
    $scope.modalClose = function () {
        $scope.phase1=true;
        $scope.phase2=false;
        $scope.selectFilter={
            type:"",
            description:''
        };
        $("#myModal").addClass("fade");
        $("#myModal").removeClass("in");
        console.log("added class");
        //Close does not eliminate referenced loaded object.
        // $scope.modal = {};
        //$location.path('/aplicaciones');
    };
    $scope.clearAllSelect = function(feature) {
        for (var i = $scope.modal.customization.length - 1; i >= 0; i--) {
            //Customization select is true or false from UI
            $scope.modal.customization[i].select=false; // Clear all other select
        };
        if(feature){
            feature.select=true;
        }
    };
    $scope.saveOpp = function () {
        //First search for selected feature, and only push that feature plus essential info.
        // DO not pass whole equipment information, employees have no need to know equipment description
        // only package description.
        // On call flush temporal var.
        $scope.selectFilter.select=true;
        console.log('received Select: ',$scope.selectFilter);
        $scope.oportunityF='';
        temporal = {};
        temporal.brand = $scope.modal.brand;
        temporal.precio = 0;
        temporal.model = $scope.modal.model;
        temporal.premodel = $scope.modal.premodel;
        temporal.category = $scope.modal.category;
        temporal.customization=[];
        temporal.select=[];
        temporal.select.push(angular.copy($scope.selectFilter));
        for (var i = $scope.modal.customization.length - 1; i >= 0; i--) {
            //Customization select is true or false from UI
            if($scope.modal.customization[i].select){
                temporal.customization.push($scope.modal.customization[i]);
                temporal.precio = temporal.precio+$scope.modal.customization[i].precio
                //Add all customizations selected
            }

        };
        $scope.selected.push(temporal);
        $scope.modal={};
        $("#myModal").addClass("fade");
        $("#myModal").removeClass("in");
        console.log("Saved Selected", $scope.selected);
        //Close does not eliminate referenced loaded object.
        // $scope.modal = {};
        //$location.path('/aplicaciones');
        $scope.phase1=true;
        $scope.phase2=false;
        $scope.selectFilter={
            type:"",
            description:''
        };
        $scope.clearAllSelect();
    };
    $scope.sendQuote = function(){
        $scope.sendProcess=true;
        // retrieve contact from potential contact
        resourceService.accounts.get({id: $scope.display.accountId}, function(account){
            var contact=account.contacto.filter(contactIs($scope.display.contacto))[0];
            var quoteObject= {
                            contacto: contact,
                            potentialId: $scope.display.id,
                            accountId: $scope.display.accountId
                        };
            console.log('Sent quoteObject: ',quoteObject);
            $http.post('/mailCotizacion', quoteObject)
                .success(function(data){
                    console.log('Respose form mailCotizacion: ', data);
                    $scope.sendSuccess = 'Cotización enviada exitosamente';
                    $scope.sendError = false;
                    $scope.sendProcess=false;
                    $scope.sendLink = '/cotizacion/'+quoteObject.accountId+'/'+quoteObject.potentialId;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                    $scope.sendSuccess = false;
                    $scope.sendProcess=false;
                    $scope.sendError = 'Hubo un error al enviar la cotización';
                    $scope.sendLink = '/cotizacion/'+quoteObject.accountId+'/'+quoteObject.potentialId;
                });
                    
        });
    }
    this.init = function(){
        $scope.dispTasks = [];
        if($routeParams.id == 'NEW'){
            // If routeParams is new, it doesn't expect a promise, continue sequential init()
            // If it's not new, process should work after promise is resolved.
            $scope.display = potentialQ($routeParams, $scope.potential);
            console.log('Display :', $scope.display);
            $scope.display.account = potentialQ2($scope.display.accountId, $scope.accounts).title;
            if($scope.saveFlag){
                //Wrapper adjuster for NEW potential flag
                $scope.saveFlag=false;
                console.log('Route params before fillTask: ',$routeParams.id);
                $scope.fillTask();
                $scope.saveFlag=true;
            }else{
                $scope.fillTask();
            }        
            $scope.formedit=false;
        }else{
            // if parameter is not NEW it requires a promise resolved
            $scope.formedit=true;
            $scope.accountFlag=false;
            resourceService.potentials.get({id: $routeParams.id})
            .$promise.then(function(potential){
                console.log('Resolved promise is: ',potential);
                $scope.display=potential;
                if(potential.fechaInicio){
                    $scope.display.fechaInicio=new Date(potential.fechaInicio);
                }
                if(potential.fechaCierre){
                    $scope.display.fechaCierre=new Date(potential.fechaCierre);
                }
                $scope.oldAccount=potential.accountId;
                // $scope.dispPot = account2pot($scope.display.potentials, $scope.potential);

            });

            
        }
        
    }
    this.init();
    $scope.equipos = [
            {
                category: 'Pistolas',
                model: 'AP',
                brand: 'Graco',
                premodel: 'Fusion',
                caption: 'Con alta duraci\xF3n de c\xE1maras mezcladoras y juntas de los bordes. La Fusion AP proporciona mejores mezclas adem\xE1s de reducir el mantenimiento e interrupciones',
                parameters: [/*
                    { Param: 'Title here', Value: 13 },
                    { Param: 'More Title', Value: 23 },
                    { Param: 'Even More Title',  Value: 33, captionText: 'Presi\xF3n lineal relativa a caudal' }*/],
                select:[{
                  type:'Sistema estandar',
                  description:'Chorro redondo , diferente cámara de mezcla'
                }],
                customization:[{
                                "caption":"Chorro redondo con camara de mezcla AR2020",
                                "codigo":246099,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo con camara de mezcla AR2929",
                                "codigo":246100,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo con camara de mezcla AR3737",
                                "codigo":248617,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo con camara de mezcla AR4242",
                                "codigo":246101,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo con camara de mezcla AR5252",
                                "codigo":246102,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro plano camara AF2020, Boquilla plana FT0424",
                                "codigo":247101,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro plano camara AF2929, Boquilla plana FT0424",
                                "codigo":247111,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro plano camara AF4242, Boquilla plana FT0438",
                                "codigo":247122,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro plano camara AF5252, Boquilla plana FT0624",
                                "codigo":247133,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo amplio con camara AW2222",
                                "codigo":249810,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo amplio con camara AW3939",
                                "codigo":249529,
                                type:'Sistema estandar',
                                "precio":2430
                              },
                              {
                                "caption":"Chorro redondo amplio con camara AW4646",
                                "codigo":249530,
                                type:'Sistema estandar',
                                "precio":2430
                              }],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Operaci\xF3n' },
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            },

            {
                category: 'Pistolas',    
                model: 'MP',
                brand: 'Graco',
                premodel: 'Fusion',
                caption: 'La pistola Fusion Mp lo permite todo, pulveriza recubrimientos de poliurea u aislamientos de espuma. Brinda grandes resultados en la aplicaci\xF3n debido a su dise\xF1o robusto que se refleja en las propiedades de mezcla y material al aplicar.',
                parameters: [
                   /* { Param: 'Title here', Value: 13 },
                    { Param: 'More Title', Value: 23 },
                    { Param: 'Even More Title',  Value: 33, captionText: 'Presi\xF3n lineal relativa a caudal' }*/],
                select:[{
                  type:'Sistema estandar',
                  description:'Chorro plano, diferente selección de boquillas '
                }],
                customization:[
                                {
                                "caption":"Chorro redondo  camara MR3535,  boquilla RTM030",
                                "codigo":247211,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro redondo  camara MR4747,  boquilla RTM040",
                                "codigo":247218,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro redondo  camara MR5757,  boquilla RTM055",
                                "codigo":247225,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro redondo  camara MR6666,  boquilla RTM090",
                                "codigo":247231,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara MF1818, boquilla FTM 317",
                                "codigo":247257,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara MF2929, boquilla FTM 424",
                                "codigo":247265,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara MF3535, boquilla FTM 624",
                                "codigo":247274,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara MF4747, boquilla FTM 638",
                                "codigo":247282,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara MF5757, boquilla FTM 838",
                                "codigo":247290,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara XR2323, boquilla RTM040",
                                "codigo":247003,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara XR3535, boquilla RTM040",
                                "codigo":247013,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara XR4747, boquilla RTM055",
                                "codigo":247019,
                                type:'Sistema estandar',
                                "precio":2940
                              },
                              {
                                "caption":"Chorro plano camara XR5757, boquilla RTM070",
                                "codigo":247026,
                                type:'Sistema estandar',
                                "precio":2940
                              }],
                documents: [
                    { name: 'REPAIR.pdf', type: 'Operaci\xF3n' }]
            },
            {
                category: 'Pistolas',
                model: 'CS',
                brand: 'Graco',
                premodel: 'Fusion',
        caption: 'La Pistola Fusion CS es muy diferente a otro aplicador. Emplea la tecnolog\xEDa ClearShot que elimina la espuma y mantiene la c\xE1mara mezcladora limpia, elimina casi por completo la necesidad de perforar la c\xE1mara mezcladora, por ello requiere menos interrupciones por mantenimiento y un tiempo \xFAtil de pulverizaci\xF3n prolongado. Adem\xE1s su flexibilidad permite emplear flujo variable tanto en espuma como con poliurea',
                parameters: [
                    /*{ Param: 'Title here', Value: 13 },
                    { Param: 'More Title', Value: 23 },
                    { Param: 'Even More Title',  Value: 33, captionText: 'Presi\xF3n lineal relativa a caudal' }*/],
                customization:[{caption: 'Solo Equipo', 
                                codigo: 'NA',
                                precio: 10000 }
                                 ],
                documents: [
                    { name: 'REPAIR.pdf', type: 'Operaci\xF3n' }]
            },
            {
                category: 'Pistolas',
                model: 'P2',
                brand: 'Graco',
                premodel: 'Probler',
        caption: 'Liviana y facil de maniobrar, disminuye la incomodidad en posiciones de aplicaic\xF3n dificiles. Empleando un dise\xF1o de doble pist\xF3n es capaz de entregar m\xE1s de 136 kilos de fuerza de actuaci\xF3n. Disponible en versi\xF3n elite para personalizar accesorios, enrutar bloqueo de mangueras y cambio de filtros amigable',
                parameters: [
                    ],
                select:[{
                  type:'Sistema estandar',
                  description:'Camara de mezclado circular'
                }],
                customization:[
                          {
                            "caption":"Camara de mezclado circular GC250A",
                            "codigo":"GCP2RA",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2500",
                            "codigo":"GCP2R0",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2501",
                            "codigo":"GCP2R1",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2502",
                            "codigo":"GCP2R2",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2503",
                            "codigo":"GCP2R3",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2504",
                            "codigo":"GCP2R4",
                            type:'Sistema estandar',
                            "precio":3040
                          },
                          {
                            "caption":"Camara de mezclado circular GC2505",
                            "codigo":"GCP2R5",
                            type:'Sistema estandar',
                            "precio":3040
                          }
                        ],
                documents: [
                    { name: 'REPAIR.pdf', type: 'Operaci\xF3n' }]
            },
            {
        category: 'Poliuretano',    
                model: 'A-25',
                brand: 'Graco',
        type: 'Neum\xE1tico',
        premodel: 'Reactor',
        caption: 'Dosificador de pulverizaci\xF3n de espuma, ofrece confiabilidad y portabilidad en el lugar de trabajo. El control de temperatura es capaz de mantenerla constante inclusive en aplicaciones demandantes lo que se refleja en la calidad de la espuma',
        parameters: [
            { Param: '\xEDndice Potencia', Value: 51.5*25*((0.00127)*10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000},
            { Param: 'Salida M\xE1xima (lb / min)', Value: 25 },
            { Param: ' Salida Lineal (lb / min)',  Value: 25, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Sistema estandar',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa) Consumo de aire 28 scfm @100 psi. Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 25 lb (11.4 kg)/min. Calentador de 6 kW. Longitud maxima de mangueras 210 ft (64 m). La maquina puede operar a 230V 1-ph — 40A; 230V 3-ph — 32A; 380V 3-ph — 18.5A'
                }],
            customization:[{caption: 'Solo Equipo', 
                                codigo: '262614',
                                type:'Sistema estandar',
                                clave: 'Solo Equipo',
                                precio: 13540 },
                                {caption: 'Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP', 
                                codigo: 'AP2614',
                                type:'Sistema estandar',
                                clave: 'Paquete AP',
                                precio: 17560 },
                                {caption: '  Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS ', 
                                codigo: 'AP2614',
                                type:'Sistema estandar',
                                clave: 'Paquete CS',
                                precio: 17850 },
                                {caption: '  Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola P2 ', 
                                codigo: 'P22614',
                                type:'Sistema estandar',
                                clave: 'Paquete P2',
                                precio: 18140 }
                                ],
            documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
        category: 'Poliuretano',    
                model: 'E-8P',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
        caption: 'Dise\xF1ado para aplicaci\xF3nes en pisos; portatil, compacto y facil de usar. Reduce el tiempo y costos de trabajo permitiendo inclusive bombeo directo desde contenedores de 19 litros.  Apto para aplicaciones de junta sin calentamiento medianas y chicas.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 103*12*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 10 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 9, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Equipo Espuma | 120 volts, 15 amps, 1 ph 50/60 hz',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa) Consumo de aire 28 scfm @100 psi. Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 25 lb (11.4 kg)/min. Calentador de 6 kW. Longitud maxima de mangueras 210 ft (64 m). La maquina puede operar a 230V 1-ph — 40A; 230V 3-ph — 32A; 380V 3-ph — 18.5A'
                },{
                  type:'Equipo Espuma | 240 volts, 10 amps, 1 ph 50/60 hz',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa) Consumo de aire 28 scfm @100 psi. Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 25 lb (11.4 kg)/min. Calentador de 6 kW. Longitud maxima de mangueras 210 ft (64 m). La maquina puede operar a 230V 1-ph — 40A; 230V 3-ph — 32A; 380V 3-ph — 18.5A'
                },{
                  type:'Equipo Pisos | 120 volts, 15 amps, 1 ph 50/60 hz',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Calentador de 6 kW. Longitud maxima de mangueras 210 ft (64 m). La maquina puede operar a 230V 1-ph — 40A; 230V 3-ph — 32A; 380V 3-ph — 18.5A'
                }],
                customization:[{caption: 'Solo Equipo', 
                                codigo: '259082',
                                type:'Equipo Espuma | 120 volts, 15 amps, 1 ph 50/60 hz',
                                clave: 'Solo Equipo',
                                precio: 7820 },
                                {caption: 'Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP', 
                                codigo: 'AP9082',
                                type:'Equipo Espuma | 120 volts, 15 amps, 1 ph 50/60 hz',
                                clave: 'Paquete AP',
                                precio: 9460 },
                                {caption: 'Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS', 
                                clave: 'Paquete CS',
                                codigo: 'CS9082',
                                type:'Equipo Espuma | 120 volts, 15 amps, 1 ph 50/60 hz',
                                precio: 9700 },
                                {caption: 'Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler  P2', 
                                codigo: 'P29082',
                                type:'Equipo Espuma | 120 volts, 15 amps, 1 ph 50/60 hz',
                                clave: 'Paquete P2',
                                precio: 9960 },

                                {caption: 'Solo Equipo', 
                                codigo: '259083',
                                clave: 'Solo Equipo',
                                type:'Equipo Espuma | 240 volts, 10 amps, 1 ph 50/60 hz',
                                precio: 7820 },
                                {caption: 'Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP', 
                                codigo: 'AP9083',
                                clave: 'Paquete AP',
                                type:'Equipo Espuma | 240 volts, 10 amps, 1 ph 50/60 hz',
                                precio: 9460 },
                                {caption: 'Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS', 
                                clave: 'Paquete CS',
                                codigo: 'CS9083',
                                type:'Equipo Espuma | 240 volts, 10 amps, 1 ph 50/60 hz',
                                precio: 9700 },
                                {caption: 'Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler  P2', 
                                codigo: 'P29083',
                                type:'Equipo Espuma | 240 volts, 10 amps, 1 ph 50/60 hz',
                                clave: 'Paquete P2',
                                precio: 9960 },


                                {caption: 'Incluye Pistolal de dosificacion manual 2K y manguera de 35ft(10.6m) 1/4 DI sin linea de aire', 
                                codigo: '25R151',
                                type:'Equipo Pisos | 120 volts, 15 amps, 1 ph 50/60 hz',
                                clave: 'Solo Equipo',
                                precio: 9460 },

                                {caption: 'Incluye Pistolal de dosificacion manual 2K y manguera 35ft(10.6m) 1/4 DI sin linea de aire', 
                                codigo: '259083',
                                type:'Equipo Pisos | 120 volts, 15 amps, 1 ph 50/60 hz',
                                clave: 'Solo Equipo',
                                precio: 9460 }],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
    },
    {
        category: 'Poliuretano',    
                model: 'E-10',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
        caption: 'Dise\xF1ado para aplicaciones en pisos; cuenta con tanques propios, simplificando las mezclas de alta viscocidad con buena precision. Apto para aplicaciones de junta sin calentamiento grandes y medianas. ',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 106.5*8.3*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 12 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 9.5, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                }],
                customization:[
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":14610
                                  },
                                  {
                                    "clave":"Paquete AP",
                                    "caption":"(Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –  Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP",
                                    "codigo":"AP9570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":16620
                                  },
                                  {
                                    "clave":"Paquete CS",
                                    "caption":"(Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –    Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS",
                                    "codigo":"CS9570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Paquete P2",
                                    "caption":" (Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –   Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler P2",
                                    "codigo":"P29570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":14610
                                  },
                                  {
                                    "clave":"Paquete AP",
                                    "caption":"  (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -   Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP",
                                    "codigo":"AP9571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":16620
                                  },
                                  {
                                    "clave":"Paquete CS",
                                    "caption":"  (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -   Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS",
                                    "codigo":"CS9571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Paquete P2",
                                    "caption":" (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -    Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler P2",
                                    "codigo":"P29571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249576",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":9040
                                  },
                                  {
                                    "clave":"Paquete 2K",
                                    "caption":"(Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones )  -      Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola dispensadora manual 2K",
                                    "codigo":"24R984",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":9780
                                  },
                                  {
                                    "clave":"Paquete MD2",
                                    "caption":"(Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones )  -      Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola MD2",
                                    "codigo":"249806",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":10740
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249577",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":9040
                                  },
                                  {
                                    "clave":"Paquete 2K",
                                    "caption":"Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola dispensadora manual 2K",
                                    "codigo":"24R985",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":9780
                                  },
                                  {
                                    "clave":"Paquete MD2",
                                    "caption":"Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola MD2",
                                    "codigo":"249808",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":10740
                                  }
                                ],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            },{
        category: 'PoliUrea',    
                model: 'E-10',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
        caption: 'Dise\xF1ado para aplicaciones en pisos; cuenta con tanques propios, simplificando las mezclas de alta viscocidad con buena precision. Apto para aplicaciones de junta sin calentamiento grandes y medianas. ',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 106.5*8.3*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 12 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 9.5, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                },{
                  type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 12 lb (5.4 kg)/min. Longitud maxima de manguera 105 ft (32 m)'
                }],
                customization:[
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":14610
                                  },
                                  {
                                    "clave":"Paquete AP",
                                    "caption":"(Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –  Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP",
                                    "codigo":"AP9570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":16620
                                  },
                                  {
                                    "clave":"Paquete CS",
                                    "caption":"(Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –    Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS",
                                    "codigo":"CS9570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Paquete P2",
                                    "caption":" (Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones) –   Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler P2",
                                    "codigo":"P29570",
                                    type:'Con Calentadores  |  1.7kw, 120 volts (15 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":14610
                                  },
                                  {
                                    "clave":"Paquete AP",
                                    "caption":"  (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -   Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion AP",
                                    "codigo":"AP9571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":16620
                                  },
                                  {
                                    "clave":"Paquete CS",
                                    "caption":"  (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -   Incluye: Manguera sin calentamiento 35ft (10.6 m) y pistola Fusion CS",
                                    "codigo":"CS9571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Paquete P2",
                                    "caption":" (Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones )  -    Incluye: Manguera sin calentamiento35ft (10.6 m)  y pistola Probler P2",
                                    "codigo":"P29571",
                                    type:'Con Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":17130
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249576",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":9040
                                  },
                                  {
                                    "clave":"Paquete 2K",
                                    "caption":"(Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones )  -      Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola dispensadora manual 2K",
                                    "codigo":"24R984",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":9780
                                  },
                                  {
                                    "clave":"Paquete MD2",
                                    "caption":"(Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones )  -      Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola MD2",
                                    "codigo":"249806",
                                    type:'Sin Calentadores  | 2.0kw, 120 volts (15 A) 2 cordones',
                                    "precio":10740
                                  },
                                  {
                                    "clave":"Solo Equipo",
                                    "caption":"Solo Equipo",
                                    "codigo":"249577",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":9040
                                  },
                                  {
                                    "clave":"Paquete 2K",
                                    "caption":"Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola dispensadora manual 2K",
                                    "codigo":"24R985",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":9780
                                  },
                                  {
                                    "clave":"Paquete MD2",
                                    "caption":"Incluye: Manguera sin calentamiento 35ft (10.6 m) - 1/4 y pistola MD2",
                                    "codigo":"249808",
                                    type:'Sin Calentadores  | 2.0kw, 240 volts (10 A) 2 cordones',
                                    "precio":10740
                                  }
                                ],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            },
            {
                category: 'Poliuretano',    
                model: 'E-20',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
                caption: 'Los dosificadores el\xE9ctricos de espuma E-20 y E-30 cuentan con datos del material empleado y diagn\xF3sitcos del sistema; proporcionan excelente control para el aislamiento por espuma. Confiables y duraderos, ideales para aplicaciones grandes y extensas, facilitan un dia laboral m\xE1s productivo con la famosa calidad del dise\xF1o de Graco.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 103*12.5*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 20 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 12.5, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'230 volts 1 fase, 48 Amp',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Salida de 9 kgs/min (20lb/min). Longitud maxima de manguera 210 ft (64 m). Temperatura maxima del fluido 88°C (190°F).  Calentador de 6 kW.'
                },{
                  type:'230 volts 3 fase, 32 Amp',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Salida de 9 kgs/min (20lb/min). Longitud maxima de manguera 210 ft (64 m). Temperatura maxima del fluido 88°C (190°F).  Calentador de 6 kW.'
                },{
                  type:'400 volts 3 fase,24 Amp',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Salida de 9 kgs/min (20lb/min). Longitud maxima de manguera 210 ft (64 m). Temperatura maxima del fluido 88°C (190°F).  Calentador de 6 kW.'
                }],
                customization:[{
                                "clave":"Solo Equipo",
                                "caption":"Solo Equipo",
                                "codigo":"259025",
                                type:'230 volts 1 fase, 48 Amp',
                                "precio":18350
                              },
                              {
                                "clave":"Paquete AP",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                                "codigo":"AP9025",
                                type:'230 volts 1 fase, 48 Amp',
                                "precio":22730
                              },
                              {
                                "clave":"Paquete CS",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                                "codigo":"CS9025",
                                type:'230 volts 1 fase, 48 Amp',
                                "precio":22990
                              },
                              {
                                "clave":"Paquete P2",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                                "codigo":"P29025",
                                type:'230 volts 1 fase, 48 Amp',
                                "precio":23250
                              },
                              {
                                "clave":"Solo Equipo",
                                "caption":"Solo Equipo",
                                "codigo":"259034",
                                type:'230 volts 3 fase, 32 Amp',
                                "precio":18350
                              },
                              {
                                "clave":"Paquete AP",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                                "codigo":"AP9034",
                                type:'230 volts 3 fase, 32 Amp',
                                "precio":22730
                              },
                              {
                                "clave":"Paquete CS",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                                "codigo":"CS9034",
                                type:'230 volts 3 fase, 32 Amp',
                                "precio":22990
                              },
                              {
                                "clave":"Paquete P2",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2 ",
                                "codigo":"P29034",
                                type:'230 volts 3 fase, 32 Amp',
                                "precio":23250
                              },
                              {
                                "clave":"Solo Equipo",
                                "caption":"Solo Equipo",
                                "codigo":"259030",
                                type:'400 volts 3 fase,24 Amp',
                                "precio":18350
                              },
                              {
                                "clave":"Paquete AP",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                                "codigo":"AP9030",
                                type:'400 volts 3 fase,24 Amp',
                                "precio":22730
                              },
                              {
                                "clave":"Paquete CS",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                                "codigo":"CS9030",
                                type:'400 volts 3 fase,24 Amp',
                                "precio":22990
                              },
                              {
                                "clave":"Paquete P2",
                                "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                                "codigo":"P29030",
                                type:'400 volts 3 fase,24 Amp',
                                "precio":23250
                              }],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
                category: 'Poliuretano',    
                model: 'E-30',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'El\xE9ctrico',
                caption: 'La familia Reactor 2 fu\xE9 dise\xF1ada para brindar inovaciones que faciliten las operaciones de su negocio. Mejoras de hardware y software para una mejor pulverizaci\xF3n. El equipo reactor 2 E-30 es compacto, ergon\xF3mico y muestra una mejora en comparaci\xF3n a equipos el\xE9ctricos tradicionales',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 126.4*18*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 29.5 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 18, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Sistema estandar',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 30 lb (13.6 kg)/min. Longitud maxima de manguera 310 ft (94 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (62A), 400 volts 3 fase  35 A.'
                },{
                  type:'Sistema Ellite, incluye graco in site',
                  description:'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa). Caudal de salida del material 30 lb (13.6 kg)/min. Longitud maxima de manguera 310 ft (94 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (62A), 400 volts 3 fase  35 A.'
                }],
                customization:[{
                        "clave":"Solo Equipo",
                        "caption":"Solo Equipo",
                        "codigo":"272011",
                        type:'Sistema estandar',
                        "precio":24200
                      },
                      {
                        "clave":"Paquete AP",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                        "codigo":"AP2011",
                        type:'Sistema estandar',
                        "precio":28590
                      },
                      {
                        "clave":"Paquete CS",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                        "codigo":"CS2011",
                        type:'Sistema estandar',
                        "precio":28840
                      },
                      {
                        "clave":"Paquete P2",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                        "codigo":"P22011",
                        type:'Sistema estandar',
                        "precio":29110
                      },
                      {
                        "clave":"Solo Equipo",
                        "caption":"Solo Equipo",
                        "codigo":"272111",
                        type:'Sistema Ellite, incluye graco in site',
                        "precio":26360
                      },
                      {
                        "clave":"Paquete AP",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                        "codigo":"AP2111",
                        type:'Sistema Ellite, incluye graco in site',
                        "precio":30950
                      },
                      {
                        "clave":"Paquete CS",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                        "codigo":"CS2111",
                        type:'Sistema Ellite, incluye graco in site',
                        "precio":31210
                      },
                      {
                        "clave":"Paquete P2",
                        "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2 ",
                        "codigo":"P22111",
                        type:'Sistema Ellite, incluye graco in site',
                        "precio":31470
                      }],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
                category: 'PoliUrea',    
                model: 'A-XP1',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'Hidr\xE1ulico',
                caption: 'Dosificador de componente plural, calentado eléctricamente y accionado por aire. Para pulverizar o suministrar fórmulas de espuma de poliuretano con relación 1:1 y otros materiales 1:1 de fijación rápida..',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 127*23*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 25.1327 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 22.2, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select:[{
                  type:'Sistema estandar',
                  description:'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa) Consumo de aire 50 scfm @100 psi. Temperatura maxima de calientamiento del Fluido 170˚F (77˚C). Caudal de salida de material 1.5Gl (5.7L/min).La maquina puede operar a 230V 1-ph — 56A; 230V 3-ph — 46A; 380V 3-ph — 26A Longitud maxima de mangueras 210 ft (64 m).'
                }],
                customization:[{clave: 'Solo Equipo', 
                                caption: 'Solo Equipo',
                                codigo: '24Y165',
                                type:'Sistema estandar',
                                precio: 14000 },
                                {clave: 'Paquete AP', 
                                codigo: 'APY165',
                                type:'Sistema estandar',
                                caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ',
                                precio: 19110 },
                                {clave: 'Paquete P2', 
                                codigo: 'P2Y165',
                                type:'Sistema estandar',
                                caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2',
                                precio: 19610 }],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }]
            
            },
            {
                category: 'Poliuretano',    
                model: 'H-40',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'Hidr\xE1ulico',
                caption: 'Desde trabajos residenciales hasta techado comercial de gran volumen, los dosificadores hidr\xE1ulicos de espuma H-25, H-40 y H-50 brindan una confiabilidad y la potencia para realizar sus proyectos de hasta 23 kg por minuto.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 103*40.7*((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 45 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 41, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema estandar',
                  description: ' Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 45 lb (20.0 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                },{
                  type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema Ellite, incluye graco in site',
                  description: 'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 45 lb (20.0 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                },{
                  type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema estandar',
                  description: ' Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 45 lb (20.0 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                },{
                  type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema Ellite, incluye graco in site',
                  description: 'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 45 lb (20.0 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                }],
                customization:[
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H043",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema estandar',
                            "precio":37240
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH043",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema estandar',
                            "precio":41630
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH043",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema estandar',
                            "precio":41880
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H043",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema estandar',
                            "precio":42030
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H143",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema Ellite, incluye graco in site',
                            "precio":38780
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH143",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema Ellite, incluye graco in site',
                            "precio":43360
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH143",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema Ellite, incluye graco in site',
                            "precio":43620
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola ¨Probler P2",
                            "codigo":"P2H143",
                            type: 'Calentador 15.3 kW. 230 Volts, 3 fases, 71A | Sistema Ellite, incluye graco in site',
                            "precio":43770
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H044",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema estandar',
                            "precio":37240
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH044",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema estandar',
                            "precio":41630
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH044",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema estandar',
                            "precio":41880
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H044",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema estandar',
                            "precio":42030
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H144",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema Ellite, incluye graco in site',
                            "precio":38780
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH144",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema Ellite, incluye graco in site',
                            "precio":43360
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH144",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema Ellite, incluye graco in site',
                            "precio":43620
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H144",
                            type: 'Calentador 20.4 kW. 230 volts, 3 fases, 95A | Sistema Ellite, incluye graco in site',
                            "precio":43770
                          }
                        ],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
                category: 'Poliuretano',    
                model: 'H-50',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'Hidr\xE1ulico',
                caption: 'Desde trabajos residenciales hasta techado comercial de gran volumen, los dosificadores hidr\xE1ulicos de espuma H-25, H-40 y H-50 brindan una confiabilidad y la potencia para realizar sus proyectos de hasta 23 kg por minuto.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 103 * 40.7 *((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 52 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 41, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                  description: 'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 52 lb (23.6 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                },{
                  type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                  description: 'Presion maxima de trabajo 2000 psi (138 bar, 13.8 MPa)- Presion minima de trabajo 600 psi (41 bar, 4.1mPa). Caudal de salida del material 52 lb (23.6 kg)/min. Longitud maxima de manguera 410 ft (125 m). Temperatura maxima del fluido 88°C (190°F). Calentador de 15.3 kW. '
                }],
                customization:[
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H053",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":38620
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH053",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":43010
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH053",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":43270
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H053",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":43420
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H153",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":40160
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH153",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":44750
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH153",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":45000
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H153",
                            type: 'Calentador 20.4 kW. 230 Volts, 3 fases, 95A  |  Sistema estandar',
                            "precio":45150
                          },
                          {
                            "clave":"Solo Equipo", 
                            "caption":"Solo Equipo",
                            "codigo":"17H056",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":38620
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH056",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":43010
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH056",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":43270
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P2H056",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":43420
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"17H156",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":40160
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"APH156",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":44750
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CSH156",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":45000
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Manguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2 ",
                            "codigo":"P2H156",
                            type: 'Calentador 20.4 kW. 400 volts, 3 fases, 53A |  Sistema Estandar',
                            "precio":45150
                          }
                        ],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
                category: 'PoliUrea',    
                model: 'E-10hp',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
                caption: 'El equipo b\xE1sico perfecto, y resulta ideal para proyectos de recubrimiento, como terrazas, piscinas, impermeabilizaci\xF3n y revestimientos y protecciones de superficies de camionetas.Es una inversi\xF3n asequible y acertada que le ayudar\xE1 en la expansi\xF3n de su negocio. ',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 155.5 * 8.3 * ((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 3000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 10.16 },
                    { Param: ' Salida Lineal (lb / min)', Value: 9.5, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: '120 Volts',
                  description: 'Presion maxima de trabajo 2500 psi (172 bar, 17.2 MPa) . Temperatura maxima de calientamiento del Fluido 170˚F (77˚C). Caudal de salida de material 1.0Gl (3.8L/min). Longitud maxima de mangueras 105 ft (32 m). '
                },{
                  type: '230 volts',
                  description: 'Presion maxima de trabajo 2500 psi (172 bar, 17.2 MPa) . Temperatura maxima de calientamiento del Fluido 170˚F (77˚C). Caudal de salida de material 1.0Gl (3.8L/min). Longitud maxima de mangueras 105 ft (32 m). '
                }],
                customization:[
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"24T100",
                            type: '120 Volts',
                            "precio":19230
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera  15 mts 3/8\" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ",
                            "codigo":"APT100",
                            type: '120 Volts',
                            "precio":21070
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4\" presion de trabajo 3500 Psi;  Pistola Probler P2",
                            "codigo":"P2T100",
                            type: '120 Volts',
                            "precio":21500
                          },
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"24T900",
                            type: '230 volts',
                            "precio":19230
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera  15 mts 3/8\" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4\" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ",
                            "codigo":"APT900",
                            type: '230 volts',
                            "precio":21070
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4\" presion de trabajo 3500 Psi;  Pistola Probler P2 ",
                            "codigo":"P2T900",
                            type: '230 volts',
                            "precio":21500
                          }
                        ],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            
            },
            {
                category: 'PoliUrea',   
                model: 'E-XP1',
                brand: 'Graco',
                premodel: 'Reactor',
                type: 'El\xE9ctrico',
        caption: 'El equipos Reactor E-XP1 es un dosificador el\xE9ctrico de recubrimiento con capacidad de hasta 7.6 litros por minuto. Apto para procesar poliurea y otros recubrimientos que necesitan altas presiones, emplea calentadores h\xEDbridos en conjunto con manguera t\xE9rmica para lograr la viscosidad adecuada antes de mezclar. Uno de los equipos preferidos para aplicaciones de recubrimientos; controles f\xE1ciles de usar, mantenimiento sencillo debido a su bomba inferior de remoci\xF3n r\xE1pida, dise\xF1o resistente y portatil. Redizca el tiempo de trabajo con la Serie E de Graco entrega la potencia necesaria para aplicaciones de poliurea de secado r\xE1pido.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: .76*138*((0.00127) * 100), inText: 'Presi\xF3n M\xE1xima', inVal: 2500 },
                    { Param: 'Salida M\xE1xima (lt / min)', Value: 1*10* 3.78541, reduce:1 },
                    { Param: ' Salida Lineal (lt / min)',  Value: 0.76 * 10* 3.78541, reduce: 1, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: '230 Volts 1 fase, 69A',
                  description: 'Presion maxima de trabajo 2500 psi (172 bar, 17.2 MPa) . Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.0Gl (3.8L/min). Longitud maxima de mangueras 210 ft (64 m).  Calentador de 10.2 kW'
                },{
                  type: '230 Volts 3 fases, 43A',
                  description: 'Presion maxima de trabajo 2500 psi (172 bar, 17.2 MPa) . Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.0Gl (3.8L/min). Longitud maxima de mangueras 210 ft (64 m).  Calentador de 10.2 kW'
                },{
                  type: '400 Volts 3 fases, 24A',
                  description: 'Presion maxima de trabajo 2500 psi (172 bar, 17.2 MPa) . Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.0Gl (3.8L/min). Longitud maxima de mangueras 210 ft (64 m).  Calentador de 10.2 kW'
                }],
                customization:[{caption: 'Solo Equipo', 
                                codigo: '259024',
                                clave: 'Solo Equipo',
                                type: '230 Volts 1 fase, 69A',
                                precio: 19230 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP9024',
                                clave: 'Paquete AP',
                                type: '230 Volts 1 fase, 69A',
                                precio: 24450 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2 ', 
                                clave: 'Paquete P2',
                                type: '230 Volts 1 fase, 69A',
                                codigo: 'P29024',
                                precio: 24970 },

                                {caption: 'Solo Equipo', 
                                codigo: '259033',
                                clave: 'Solo Equipo',
                                type: '230 Volts 3 fases, 43A',
                                precio: 19230 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP9033',
                                clave: 'Paquete AP',
                                type: '230 Volts 3 fases, 43A',
                                precio: 24450 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2 ', 
                                clave: 'Paquete P2',
                                type: '230 Volts 3 fases, 43A',
                                codigo: 'P29033',
                                precio: 24970 },

                                {caption: 'Solo Equipo', 
                                codigo: '259029',
                                type: '400 Volts 3 fases, 24A',
                                clave: 'Solo Equipo',
                                precio: 19230 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP9029',
                                type: '400 Volts 3 fases, 24A',
                                clave: 'Paquete AP',
                                precio: 24450 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2 ', 
                                clave: 'Paquete P2',
                                type: '400 Volts 3 fases, 24A',
                                codigo: 'P29029',
                                precio: 24970 }
                                ],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]

            }, {
                category: 'PoliUrea',   
                model: 'E-XP2',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'El\xE9ctrico',
                caption: 'El equipos Reactor E-XP2 es un dosificador el\xE9ctrico de recubrimiento con capacidad de hasta 7.6 litros por minuto. Apto para procesar poliurea y otros recubrimientos que necesitan altas presiones, emplea calentadores h\xEDbridos en conjunto con manguera t\xE9rmica para lograr la viscosidad adecuada antes de mezclar. Uno de los equipos preferidos para aplicaciones de recubrimientos; controles f\xE1ciles de usar, mantenimiento sencillo debido a su bomba inferior de remoci\xF3n r\xE1pida, dise\xF1o resistente y portatil. Redizca el tiempo de trabajo con la Serie E de Graco entrega la potencia necesaria para aplicaciones de poliurea de secado r\xE1pido.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: .76 * 138 * ((0.00127) * 100), inText: 'Presi\xF3n M\xE1xima', inVal: 2500 },
                    { Param: 'Salida M\xE1xima (lt / min)', Value: 1 * 10 * 3.78541, reduce: 1 },
                    { Param: ' Salida Lineal (lt / min)', Value: 0.76 * 10 * 3.78541, reduce: 1, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Configuración Estandar',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa) . Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 2.0Gl (7.6L/min).  Longitud maxima de mangueras 310 ft (94 m). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (59A), 400 volts 3 fase  35 A.'
                },{
                  type: 'Sistema Ellite, Incluye Graco Insite',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa) . Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 2.0Gl (7.6L/min).  Longitud maxima de mangueras 310 ft (94 m). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (59A), 400 volts 3 fase  35 A.'
                }],
                customization:[{caption: 'Solo Equipo', 
                                codigo: '272012',
                                clave: 'Solo Equipo',
                                type: 'Configuración Estandar',
                                precio: 25430 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP2012',
                                clave: 'Paquete AP',
                                type: 'Configuración Estandar',
                                precio: 30860 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P22012',
                                clave: 'Paquete P2',
                                type: 'Configuración Estandar',
                                precio: 31380 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AH2012',
                                clave: 'Paquete AH',
                                type: 'Configuración Estandar',
                                precio: 41610 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PH2012',
                                clave: 'Paquete PH',
                                type: 'Configuración Estandar',
                                precio: 41210 },

                                {caption: 'Solo Equipo', 
                                codigo: '272112',
                                clave: 'Solo Equipo',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 27590 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP2112',
                                clave: 'Paquete AP',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 33030 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P22112',
                                clave: 'Paquete P2',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 33540 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AH2112',
                                clave: 'Paquete AH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 43770 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PH2112',
                                clave: 'Paquete PH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 44290 }],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]

            },
            
            {
                category: 'Poliuretano',   
                model: 'E-30i',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'El\xE9ctrico',
                caption: 'Sistema integral para recubrimientos de poliurea impermeable hasta 13.6 kg por minuto; combina un dosificador el\xE9ctrico y un generador diesel en un solo equipo. Este dise\xF1o inovador ahorra gastos en proyectos de varias maneras, reciclaje de energ\xEDa t\xE9rmica al dirigir el calor del motor diesel para calentar los materiales reduciendo demanda del generador, control de software y hardware embebido para un mayor control de aplicaci\xF3n as\xED como regulaci\xF3n de fluctuaci\xF3nes en presi\xF3n entre otros.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 126.4 * 17 *((0.00127) * 10), inText: 'Presi\xF3n M\xE1xima', inVal: 2000 },
                    { Param: 'Salida M\xE1xima (lb / min)', Value: 31 },
                    { Param: ' Salida Lineal (lb / min)',  Value: 17, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Configuración Estandar',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Temperatura maxima del fluido 88°C (190°F). Compresor Hydrovane 5 hp, 16 scfm, 240 volts, 1 fase 60 Hz, Secador de Aire: Hakinson Refrigerado 22 scfm, 115 volts, 1 fase, 60 hz, Motor: Perkins 404-22G, 2.2L,  29HP, Generador: Mecc Alte 22kW, 240 volts, 1 fase, 60 Hz, Longitud maxima de manguera 310 ft (94 m). '
                }],
                customization:[
                          {
                            "clave":"Solo Equipo",
                            "caption":"Solo Equipo",
                            "codigo":"272090",
                            type: 'Configuración Estandar',
                            "precio":69590
                          },
                          {
                            "clave":"Paquete AP",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ",
                            "codigo":"AP2090",
                            type: 'Configuración Estandar',
                            "precio":74170
                          },
                          {
                            "clave":"Paquete CS",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Fussion CS ",
                            "codigo":"CS2090",
                            type: 'Configuración Estandar',
                            "precio":74430
                          },
                          {
                            "clave":"Paquete P2",
                            "caption":"Incluye: Manguera 15 mts 3/8\" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4\" presion de trabajo 2000 Psi;  Pistola Probler P2",
                            "codigo":"P22090",
                            type: 'Configuración Estandar',
                            "precio":74690
                          }
                        ],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]

            },
            {
                category: 'PoliUrea',   
                model: 'E-XP2i',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'El\xE9ctrico',
                caption: 'Sistema integral para recubrimientos de poliurea impermeable hasta 7.6 litros por minuto; combina un dosificador el\xE9ctrico y un generador diesel en un solo equipo. Este dise\xF1o inovador ahorra gastos en proyectos de varias maneras, reciclaje de energ\xEDa t\xE9rmica al dirigir el calor del motor diesel para calentar los materiales reduciendo demanda del generador, control de software y hardware embebido para un mayor control de aplicaci\xF3n as\xED como regulaci\xF3n de fluctuaci\xF3nes en presi\xF3n entre otros.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 207*1.23*((0.00127) * 100), inText: 'Presi\xF3n M\xE1xima', inVal: 3500 },
                    { Param: 'Salida M\xE1xima (lt / min)', Value: 2 * 10* 3.78541, reduce: 1 },
                    { Param: ' Salida Lineal (lt / min)',  Value: 1.23 * 10* 3.78541, reduce: 1, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Configuración Estandar',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Temperatura maxima del fluido 88°C (190°F). Compresor Hydrovane 5 hp, 16 scfm, 240 volts, 1 fase 60 Hz, Secador de Aire: Hakinson Refrigerado 22 scfm, 115 volts, 1 fase, 60 hz, Motor: Perkins 404-22G, 2.2L,  29HP, Generador: Mecc Alte 22kW, 240 volts, 1 fase, 60 Hz'
                }],
                customization:[{caption: 'Caudal de salida del material 2.0 gal (7.6L/min). Longitud maxima de manguera 310 ft (94 m).', 
                                codigo: '272091',
                                clave: 'Solo Equipo',
                                type: 'Configuración Estandar',
                                precio: 70740 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4" DI presion de trabajo 2000 Psi;  Pistola Fussion AP ', 
                                codigo: 'AP2091',
                                clave: 'Paquete AP',
                                type: 'Configuración Estandar',
                                precio: 76170 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 2000psi; Maguera flexible 3 mts 1/4" presion de trabajo 2000 Psi;  Pistola Probler P2', 
                                codigo: 'P22091',
                                clave: 'Paquete P2',
                                type: 'Configuración Estandar',
                                precio: 76690 }],
                documents: [
                    { name: 'FLYER.pdf', type: 'Detalles' }, 
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPARACION.pdf', type: 'Reparaci\xF3n' }]

            },
            {
                category: 'PoliUrea',
                model: 'H-XP2',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'Hidr\xE1ulico',
                
                caption: 'Los dosificadores hidr\xE1ulicos de recubrimientos H-XP2 y H-XP3 fueron dise\xF1ados para aplicar poliurea y otros recubrimientos a presiones altas. En aplicaciones de suministro alto, entregan potencia y desempe\xF1o superiores, hasta 10.6 litros por minuto. El control de temperatura responde r\xE1pidamente, mantieniendo los valores prefijados incluso a caudales m\xE1ximos.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 1.35*207*((0.00127) * 100), inText: 'Presi\xF3n M\xE1xima', inVal: 3500 },
                    { Param: 'Salida M\xE1xima (lt / min)', Value: 1.6 * 10* 3.78541, reduce: 1},
                    { Param: 'Salida Lineal (lt / min)', Value: 1.3 * 10* 3.78541, reduce: 1, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Configuración Estandar',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Presion minima de trabajo 1200psi (83 bar, 8.3 MPa) Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.5gal (5.7L/min).  Longitud maxima de mangueras 310 ft (94 m). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (59A), 400 volts 3 fase  35 A.'
                },{
                  type: 'Sistema Ellite, Incluye Graco Insite',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Presion minima de trabajo 1200psi (83 bar, 8.3 MPa)Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.5gal (5.7L/min).  Longitud maxima de mangueras 310 ft (94 m). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (59A), 400 volts 3 fase  35 A.'
                }],
                customization:[{caption: 'Solo Equipo', 
                                codigo: '17H062',
                                clave: 'Solo Equipo',
                                type: 'Configuración Estandar',
                                precio: 29500 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'APH062',
                                clave: 'Paquete AP',
                                type: 'Configuración Estandar',
                                precio: 34720 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P2H062',
                                clave: 'Paquete P2',
                                type: 'Configuración Estandar',
                                precio: 35240 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AHH062',
                                clave: 'Paquete AH',
                                type: 'Configuración Estandar',
                                precio: 44540 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PHH062',
                                clave: 'Paquete PH',
                                type: 'Configuración Estandar',
                                precio: 45070 },

                                {caption: 'Solo Equipo', 
                                codigo: '17H162',
                                clave: 'Solo Equipo',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 31070 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'APH162',
                                clave: 'Paquete AP',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 36500 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P2H162',
                                clave: 'Paquete P2',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 37020 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AHH162',
                                clave: 'Paquete AH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 47240 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PHH162',
                                clave: 'Paquete PH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 47760 }],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            },
            {
                category: 'PoliUrea',    
                model: 'H-XP3',
                brand: 'Graco',
                premodel: 'Reactor2',
                type: 'Hidr\xE1ulico',
                caption: 'Los dosificadores hidr\xE1ulicos de recubrimientos H-XP2 y H-XP3 fueron dise\xF1ados para aplicar poliurea y otros recubrimientos a presiones altas. En aplicaciones de suministro alto, entregan potencia y desempe\xF1o superiores, hasta 10.6 litros por minuto. El control de temperatura responde r\xE1pidamente, mantieniendo los valores prefijados incluso a caudales m\xE1ximos.',
                parameters: [
                    { Param: '\xEDndice Potencia', Value: 2.5*193*((0.00127) * 100), inText: 'Presi\xF3n M\xE1xima', inVal: 3500 },
                    { Param: 'Salida M\xE1xima (lt / min)', Value: 2.83 * 10* 3.78541, reduce: 1 },
                    { Param: ' Salida Lineal (lt / min)',  Value: 2.5 * 10* 3.78541, reduce: 1, captionText: 'Presi\xF3n lineal relativa a caudal' }
                ],
                select: [{
                  type: 'Configuración Estandar',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Presion minima de trabajo 850psi (59 bar, 5.9 MPa). Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 2.8gal (10.6L/min).  Longitud maxima de mangueras 410 ft (125 m). Calentador de 20.4 kW. 230 Volts, 3 fases, 95A'
                },{
                  type: 'Sistema Ellite, Incluye Graco Insite',
                  description: 'Presion maxima de trabajo 3500 psi (240 bar, 24.0 MPa). Presion minima de trabajo 1200psi (83 bar, 8.3 MPa). Temperatura maxima de calientamiento del Fluido 190˚F (88˚C). Caudal de salida de material 1.5gal (5.7L/min).  Longitud maxima de mangueras 310 ft (94 m). Calentador de 15.3 kW. Configuracion electrica ajustable a 230 volts 1 fase (100A), 230 volts 3 fase (59A), 400 volts 3 fase  35 A.'
                }],
                customization:[{caption: 'Solo Equipo', 
                                codigo: '17H074',
                                clave: 'Solo Equipo',
                                type: 'Configuración Estandar',
                                precio: 37240 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'APH074',
                                clave: 'Paquete AP',
                                type: 'Configuración Estandar',
                                precio: 42460 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P2H074',
                                clave: 'Paquete P2',
                                type: 'Configuración Estandar',
                                precio: 42980 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AHH074',
                                clave: 'Paquete AH',
                                type: 'Configuración Estandar',
                                precio: 54740 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PHH074',
                                clave: 'Paquete PH',
                                type: 'Configuración Estandar',
                                precio: 55260 },

                                {caption: 'Solo Equipo', 
                                codigo: '17H174',
                                clave: 'Solo Equipo',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 38780 },
                                {caption: 'Incluye: Manguera  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'APH174',
                                clave: 'Paquete AP',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 44210 },
                                {caption: 'Incluye: Manguera 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'P2H174',
                                clave: 'Paquete P2',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 44730 },
                                {caption: 'Incluye: Multiples mangueras de  15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" DI presion de trabajo 3500 Psi;  Pistola Fussion AP ', 
                                codigo: 'AHH174',
                                clave: 'Paquete AH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 57640 },
                                {caption: 'Incluye: Multiples mangueras de 15 mts 3/8" presion de trabajo 3500psi; Manguera flexible 3 mts 1/4" presion de trabajo 3500 Psi;  Pistola Probler P2', 
                                codigo: 'PHH174',
                                clave: 'Paquete PH',
                                type: 'Sistema Ellite, Incluye Graco Insite',
                                precio: 58160 }],
                documents: [
                    { name: 'OPERATION.pdf', type: 'Funci\xF3n' }, 
                    { name: 'REPAIR.pdf', type: 'Reparaci\xF3n' }]
            
            }
        ];
        console.log('equipos', $scope.equipos);

}]);//END OF NerdController


