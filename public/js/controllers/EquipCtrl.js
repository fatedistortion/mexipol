var EquipCtrl = angular.module('EquipCtrl', []);
    /*
     * Verification of Mongoose model for Equipments' factory and controller, said like so,
     * an "Administrative" control that may tune description and availability of the page (Admin view, General View)
     * Get functions should be obtained from a factory instead of inside controller,
     * but both should be declared in same JS document
     */
//EquipCtrl.factory('EquipmentFactory', ['$http', function ($http) {}]);

// Directly inyect EquipmentFactory as dependency of controller
EquipCtrl.controller('EquipmentController',['$resource','$scope', '$cookies', '$cookieStore','$http','$analytics', '$location', '$route', '$routeParams', '$rootScope', 'httpUpdate', function ($resource, $scope, $cookies, $cookieStore, $http, $analytics, $location, $route, $routeParams, $rootScope, httpUpdate) {

    /* Usage of $scope.var =... instead of this.var=... will result in calling directly {{var.object}}
     * in HTML'angular instead of calling the controller specifically as {{controllerName.var.object}}
     */

    $scope.equipos = [];
    if(typeof $rootScope.modalSwap == 'undefined'){
    $rootScope.modalSwap = {};
    //Check if kartEnabled is not already assigned
        if($rootScope.modalSwap.kartEnabled){
            $rootScope.modalSwap.add=true;
        }
    }
    $scope.modalAccount = {};
    $scope.modalContact = {};
    $scope.modalPotential = {};
    $scope.modalLogin={};
    $scope.tabs=1;
    //GET account & Potentials from REST
    // $rootScope.accounts
    // $rootScope.potentials
    var potentials = $resource('/api/potentials/:potential_id', {potential_id:'@_id'}, {new: {method:'POST', isArray: true}});
    //var potentials = $resource('/api/potentials');
    var accounts = $resource('/api/accounts');
    var account = $resource('/api/accounts/:account_id', {account_id: '@_id'});



    accounts.query(function(accounts){
        $rootScope.accounts=accounts;
    });
    $scope.newsLink = 'Preparaci\xF3n de la superficie y Aplicaci\xF3n de Poliurea sobre Acero y Concreto [B\xE1sico]';
    $scope.Header = 'Pr\xF3ximo Curso de Capacitaci\xF3n en Quer\xE9taro'; //Setting MainController.Header to string, if called $scope it's controlled by routeprovider, this.header is controller specific
    $scope.tagline = 'Equipos';
    $scope.taglineLink = '/eventos';
    $scope.icon = 'fa-cubes';
    $analytics.pageTrack('/equipos');
    console.log('Rootscope Accounts: ', $rootScope.accounts);

    /* Jumbotron Controller for background display */
    $scope.jumbo = {
        'background-image': 'url("../img/equipos/USE_2.jpg")'
    };

    /* General Standarization for images & Medias */
    this.mediaImg = {
        'max-width': '100%',
        'max-height': '420px',
        color: '#FCF9F9'
    };

    //For ng-Show var
    $scope.equipTypes = [
        {
            category: 'Pistolas',
            first:'AP',
            img:'Pistolas'
        },
        {
            category: 'Poliuretano',
            first: 'A-25',
            img:'Poliurea'
        },
        {
            category: 'PoliUrea',
            first:'E-XP1',
            img:'Poliuretano'
        }
    ];

    $scope.showCase = 'Pistolas';

    //Scope.showcase can be changes for category update and ngif
    //Using Queu and Showcase for default model and category items
    var initialize = function ($routeParams) {
        //Consider cases where controller is loaded as an instance, such as in Aplications and stop redefining default values for them
        if (typeof $routeParams.category == 'undefined' ) {
            //If routeParams is undefined, get basic linkage
            $scope.showCase = 'Poliuretano';
            $scope.queu = 'A-25';
            $rootScope.description = 'Venta y Mantenimiento de Equipos para aplicación de Poliurea, Poliuretano y Recubrimientos en Querétaro, México y alrededores, especialistas en maquinaria Graco';

        } else {
            $scope.showCase = $routeParams.category;
            $scope.queu = $routeParams.model;
            var object = $scope.equipos.filter(function (element) { if (element.model == $routeParams.model) { return element; } });
        }
    };
    /*
     * Accents in strings should be written in Hex code
     * \xF3: \xF3
     *
     */
     $scope.showPot = function(index){
        $scope.tabs=index;
        console.log($scope.tabs);
     }
    $scope.clearAllSelect = function(feature) {
        for (var i = $scope.modal.customization.length - 1; i >= 0; i--) {
            //Customization select is true or false from UI
            $scope.modal.customization[i].select=false; // Clear all other select
        };
        if(feature){
            feature.select=true;
        }
    };
    $scope.addEquip = function(){
        $scope.addOverride=false;
        if(typeof $rootScope.user == 'undefined'){
            console.log('No user on root');
            $rootScope.modalSwap.signup = true;
            $rootScope.modalSwap.kartEnabled=false;
            $rootScope.modalSwap.kart=false;
            $rootScope.modalSwap.add=true;

            //Login as well as Sigunup should return rootScope.user and rootScope.activeAccount
        }else{
            //Expects a rootScope User passed by addAccount Variable, cookie needs to be updated
            /*
            1.  Push $scope.modal to $rootScope.activePotential
            2.  Clean $scope.modal to add more equipments
            3.  addEquip should give two options
                 3.1. Ask for quote on current added Equipments
                 3.2. Continue shopping, in which case  (Shopping cart will be enabled in $rootScope.modalSwap)
            4.  Should check if rootScope.user exists but there's no activePotential which can occur
                in cases such as sendQuote(), if so use $scope.addPotential(); to create a new potential
            5.  If rootScope.user exists but activePotential is undefined it's because user logged in with
                $cookie, call addPotential asswell.
            */
            if(typeof $scope.accountOrigin == 'undefined'){
                $scope.accountOrigin=$cookies.get('accountOrigin');
            }
            console.log('User on root is: ', $rootScope.user);
            console.log('User Origin: ', $scope.accountOrigin);

            if($scope.accountOrigin=='new'){
                // if new, this account has just been created and it's cookies should be removed on Quote Submit
                // New accounts shouldn't be found in api/account since they're created on quote submit only
                $rootScope.modalSwap.kartEnabled=true;
                $rootScope.modalSwap.kart=true;
                $rootScope.modalSwap.add=false;

            }else if(!$rootScope.modalSwap.kartEnabled){
                // If modalSwap kartEnabled is off then "Refresh" cookies and account to get the current account's state
                $cookies.remove('activeAccount');
                $scope.activeAccount=$rootScope.accounts.filter(AccountContactHas2($rootScope.user))[0];
                var account = $resource('/api/accounts/:account_id', {account_id: $scope.activeAccount.id});
                console.log('Active account is: ', $scope.activeAccount.id);
                account.get({account_id: $scope.activeAccount.id}, function(){
                    $scope.activeAccount=account;
                });
                console.log('Getted account is: ', $scope.activeAccount);
                $cookies.putObject('activeAccount', $scope.activeAccount);
                $rootScope.activeAccount=$cookies.getObject('activeAccount');

            }else{
                // If process is continuous (Eg. new account with activeKart, returning user with cookies refreshed)

            }
            // Reactivate modalSwap status
            $rootScope.modalSwap.kartEnabled=true;
            $rootScope.modalSwap.kart=true;
            $rootScope.modalSwap.add=false;
            if(typeof $rootScope.activePotential == 'undefined'){
                //This is called when a user logged through cookies, without saving potential
                console.log('Undefined activePotential');
                $scope.addPotential();
            }else if(!Object.keys($rootScope.activePotential).length){
                //If true is becasue activePotential has no keys assigned to it, hence it's been reset by function
                console.log('Cleared activePotential');
                $scope.addPotential(); //Will re-reset again and add a new function
            }

            console.log('Active Account is: ', $rootScope.activeAccount);
            $rootScope.activePotential.opportunities.push(angular.copy($scope.modal));
            $scope.modal = {};
            console.log('New opportunitie added: ',$rootScope.activePotential.opportunities);
        }
        //Do nothing if user is not registered except changing modal view.
        //Modal should keep equipment on scope during registry and login
        //addEquip should be called after registration ends. Button should hide
        //while registration is in order
        $scope.phase1=true;
        $scope.phase2=false;
        $scope.selectFilter={
            type:"",
            description:''
        };
        $scope.clearAllSelect();
    };
    $scope.shopEquip = function(equipment){
        $("#shopModal").addClass("in");
        $("#shopModal").removeClass("fade");
        console.log('For Button: ',($rootScope.modalSwap.signup || $rootScope.modalSwap.contact || ((!(typeof($scope.modal)=='undefined')) && $rootScope.modalSwap.kartEnabled) || $rootScope.modalSwap.login));
        $rootScope.modalSwap.add=true;
        $rootScope.modalSwap.kartEnabled=false;
        $rootScope.modalSwap.kart=false;
        $rootScope.modalSwap.active=false;
        $scope.modal=equipment;
        console.log('Received equipment: ', equipment);
    };
    $scope.modalClose = function () {
        if(!($rootScope.modalSwap.kart)){
            if($rootScope.modalSwap.login){
                $rootScope.modalSwap.login=false;
            }
            if($rootScope.modalSwap.new = false){
                $rootScope.modalSwap.new = false;
            }
        }
        if (typeof $rootScope.activePotential != 'undefined'){
            if(typeof $rootScope.activePotential.opportunities != 'undefined'){
                if($rootScope.activePotential.opportunities.length){
                    // If there's more than one equipment to quote, activateKart button on close
                    $rootScope.activeKart = true;
                }
            }
        }
        $scope.addOverride=false;
        $scope.phase1=true;
        $scope.phase2=false;
        $scope.selectFilter={
            type:"",
            description:''
        };
        $("#shopModal").addClass("fade");
        $("#shopModal").removeClass("in");
        console.log("added class");
        //Close does not eliminate referenced loaded object.
        // $scope.modal = {};
        //$location.path('/aplicaciones');
    };

    $scope.addClose = function () {
        $rootScope.activeKart = true;
        //Rootscope.activeKart is visible cart on main menu
        $scope.phase1=true;
        $scope.phase2=false;
        $scope.selectFilter={
            type:"",
            description:''
        };
        $("#shopModal").addClass("fade");
        $("#shopModal").removeClass("in");
        console.log("added class");
    };
    function idHas(wordToCompare) {
        return function(element) {
            if(typeof(element.id)!='undefined')
                return element.id.search(wordToCompare) !== -1;
            return false;
        }
    }
    function idHasNot(wordToCompare) {
        return function(element) {
            return !(element.id.search(wordToCompare) !== -1);
        }
    }
    function AccountContactHas(Compare) {
        return function(element) {
            console.log('COmpare is: ', Compare);
            console.log('Element is: ', element);
            for (var i = element.contacto.length - 1; i >= 0; i--) {
                if(element.contacto[i].correo == Compare.email  && element.contacto[i].tel == Compare.password){
                    console.log('element is: ', element.contacto[i]);
                    return true;
                }else if (element.contacto[i].correo == Compare.email) {
                    $scope.modalLogin.error='Password';
                }else if (element.contacto[i].tel == Compare.password) {
                    $scope.modalLogin.error='Email';
                }
            };
        }
    };
    function AccountContactHas2(Compare) {
        return function(element) {
            console.log('COmpare is: ', Compare);
            console.log('Element is: ', element);
            for (var i = element.contacto.length - 1; i >= 0; i--) {
                if(element.contacto[i].correo == Compare.correo  && element.contacto[i].tel == Compare.tel){
                    console.log('element is: ', element.contacto[i]);
                    return true;
                }else if (element.contacto[i].correo == Compare.email) {
                    $scope.modalLogin.error='Password';
                }else if (element.contacto[i].tel == Compare.password) {
                    $scope.modalLogin.error='Email';
                }
            };
        }
    };
    function contactHas(Compare) {
        return function(element) {
            console.log('COmpare is: ', Compare);
            console.log('Element is: ', element);
            if(element.correo == Compare.email && element.tel == Compare.password){
                    console.log('element is: ', element);
                    return true;
            }
        }
    }
    $scope.loginAccount = function (loginObject) {
        //LoginObject has username and password to be filtered out of accounts.
        /*
            1. Filter accounts which's contact's does not have this email
            2. return account and contact as true
            3. Save account in rootScope.activeAccount
            4. Save contact in rootScope.user
        */
        $scope.loginError=false;
        $scope.activeAccount=$rootScope.accounts.filter(AccountContactHas(loginObject))[0];
        console.log('rootscope accounts for login: ', $rootScope.accounts);
        console.log('SCOPE accounts for login: ', $scope.activeAccount);
        // If username doesn't exist or no accounts exist check error and show on screen.
        if(typeof ($scope.activeAccount)=='undefined' ){
            // Display Error Message for no accounts, filter returns none true
            $scope.loginError='Es necesario registrar una cuenta';
        }else if($scope.activeAccount.length == 0){
            // Display Error Message for no real user
            $scope.loginError='No es un usuario Válido';
        }else{
            // All is well
        account.get({account_id: $scope.activeAccount.id}, function(account){
                $scope.activeAccount=account;
                if(account){
                    $rootScope.modalSwap.kartEnabled=true;
                    $rootScope.activeKart = true;
                }
        });
        $scope.activeUser=$scope.activeAccount.contacto.filter(contactHas(loginObject))[0];
        //Push to cokies as object user & account
        $cookies.putObject('user', $scope.activeUser);
        $scope.accountOrigin='login';
        $cookies.put('accountOrigin', $scope.accountOrigin);
        $cookies.putObject('activeAccount', $scope.activeAccount);
        console.log('User stored is: ',$cookies.getObject('user'));
        $rootScope.activeAccount=$cookies.getObject('activeAccount');
        $rootScope.user=$cookies.getObject('user');
        console.log('Account Login Object', $rootScope.activeAccount);
        console.log('Login Object', $rootScope.user);

        $scope.addPotential();
        $rootScope.modalSwap.login=false;
        $scope.addOverride=true;
        }
        console.log('For Button: ',($rootScope.modalSwap.signup || $rootScope.modalSwap.contact || ((!Object.keys($scope.modal).length) && $rootScope.modalSwap.kartEnabled) || $rootScope.modalSwap.login));
    }
    $scope.addAccount = function(contact){

        //initialize contacto array to push contact from modalContact
        $scope.modalAccount.contacto=[];
        $scope.modalAccount.contacto.push(contact);
        console.log('Modal Account is:', $scope.modalAccount);
        //Rootscope User should be contact of account.
        //On new account add as user straight from modalAccount.contacto
        //On Login usea  new function that works as accounts' contact filter
        $rootScope.activeAccount=$scope.modalAccount;
        $rootScope.user=contact;
        //Since an account can have multiple contacts, rootScope.user is logged in contact
        //Or new account's contact
        $scope.modalContact={};

        Actemporal=deepCopy($rootScope.activeAccount.title);
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
        $rootScope.activeAccount.id = Actemporal;
        $rootScope.activeAccount.valid=false;
        console.log('activeAccount: ',$rootScope.activeAccount);
        $scope.accountOrigin='new';
        $cookies.put('accountOrigin', $scope.accountOrigin);
        $scope.addPotential();
        /*== activeAccount should be submitted for database after setting id ==*/
    };
    $scope.addPotential = function(){
        $scope.limitPreview=true;
        console.log('Accounts before potential is defined was:', $rootScope.activeAccount);
        /*
        1.  This requires $rootScope.activeAccount to add potential id to it
        2.  After adding a potential ID to account, new equipments are added to potential
            without the need of calling this function.
        3.  addEquip will add equipments to this potential through an if else statement,
            Since addEquip can find existing potentials assigned to an account's user,
            any extra equipment creates a potential on first call.
        4.  This function should be called from addAccount() or loginAccount(), creating a NEW
            potential to which equipment will be added after login/register.
        5.  Potential + Account + Contact Submission only occur on quoteThis() function.
        6.  New potential is stored in $rootScope.activePotential, allowing user to move through site
        // $rootScope.activeAccount
        */
        $rootScope.activePotential = {};
        temporal =  $rootScope.activeAccount.id;
        // Remove 'ac-' from ac-[AccountName]' to get base name and return potential number to '-00'
        temporalId = $rootScope.activeAccount.id.substring(3);
        temporalId = temporalId.substring(0,temporalId.length-3);
        temporalId = temporalId+'-00'

        // activePotential will be temporal potential subject only to scope, this will later be passed to rootScope for submit
        $rootScope.activePotential.account=$rootScope.activeAccount.title;
        $rootScope.activePotential.accountId=$rootScope.activeAccount.id;
        // PROBABLY USE [$rootScope] INSTEAD

        // Update rootScope Accounts' potential:
        // It's possible that account doesn't exist if it's new, beware undefined error
        // Remove from previous account before adding to new account
        // Use filter to update previous rootScope while keeping object reference
        // Remove previous account potential by id and then update potential's id
        console.log('Temporal is: ',temporal);
        console.log('rootScope.accounts on addPotential is: ',$rootScope.accounts);
        if($rootScope.accounts.filter(idHas(temporal)).length){
            // If account exits, it has a potential assigned
            // Use potentialsNum to know existing not assigned potentials
            // Naturally, all potentials should begin with '-01', all new potentials are set as '-00'
            // potentialsNum should return number of existing potentials
            potentialsNum = $rootScope.accounts.filter(idHas(temporal))[0].potentials.filter(idHasNot(temporalId)).length+1;
        }else{
            potentialsNum=1;
        }
        temporalId = temporalId.substring(0,temporalId.length-2);
        if(potentialsNum<10){
                potentialsNum = '0'+potentialsNum;
            }
        temporalId=temporalId+potentialsNum;
        console.log('temporalID is:', temporalId);
        // temporalId is new potential id for this account
        // Add to new account's potential
        if(typeof $rootScope.activeAccount.potentials == 'undefined'){
            // If activeAccount hasn't got any potentials object assigned to it then add it as an array
            $rootScope.activeAccount.potentials=[];
             $rootScope.activeAccount.potentials.push(angular.copy({id: temporalId}));
        }else{
            // If it exist, just push it
            $rootScope.activeAccount.potentials.push(angular.copy({id: temporalId}));
        };
        // Create a new potential using  $rootScope.activePotential
        $rootScope.activePotential.id=temporalId;
        if($scope.accountOrigin=='new'){
          $rootScope.activePotential.contacto=$rootScope.user.nombre;
        }else{
            $rootScope.activePotential.contacto=$rootScope.user.nombre;
            // $rootScope.activePotential.contacto.push($rootScope.user);
        }
        $rootScope.activePotential.origen='Web';
        $rootScope.activePotential.precio=0;//Basic default, changed on quote submit
        $rootScope.activePotential.asignado='Alejandro Ruiz';
        // Do not add description so sales exec does instead on potential view
        // $rootScope.activePotential.descripcion='';
        $rootScope.activePotential.fechaInicio=new Date(Date.now());
        $rootScope.activePotential.indiceDesc=98;
        $rootScope.activePotential.account=$rootScope.activeAccount.title;
        // Add opportunities from current received equipment. pushed on addEquip() function outside
        // Same goes for price
        $rootScope.activePotential.opportunities=[];
        $rootScope.activePotential.prioridad='Baja';
        $rootScope.activePotential.tareas=[];
        $rootScope.activePotential.title=$rootScope.activeAccount.title +' '+ potentialsNum;
        // Test if active account has .valid: true, if true then it's from login process.
        $rootScope.activePotential.valid=(($rootScope.activeAccount.valid) ? true : false);
        console.log('Accounts after potential is defined as:', $rootScope.activeAccount);
        console.log('Accounts have new potential:', $rootScope.activePotential);
    }
    $scope.sendQuote = function(){
        /*
        1. SendQuote should submit account + Potential + opportunities
        2. Current activePotential should be cleaned without removing rootScope.user
        3. Submit
            3.1. $rootScope.activeAccount to accounts
            3.2. $rootScope.activePotential to potentials and clean $rootScope.activePotential={};
            3.3. Should pass an email activation link
            3.4. Should expect or send an email quote
                3.4.1. Activation email should have a route-based controller to activate account & it's potentials.
        4. Test data should be changed to GET / POST method once completed
        */
        // Update Price from quote
        $rootScope.activePotential.precio=0;
        for (var i = $rootScope.activePotential.opportunities.length - 1; i >= 0; i--) {
            // Run down of all opportunities, check which's customization is selected to get price quote
            $rootScope.activePotential.opportunities[i].precio=0;
            opportunityPrice = $rootScope.activePotential.opportunities[i].precio;
            for (var j = $rootScope.activePotential.opportunities[i].customization.length - 1; j >= 0; j--) {
                if($rootScope.activePotential.opportunities[i].customization[j].select==true){
                    opportunityPrice=opportunityPrice+$rootScope.activePotential.opportunities[i].customization[j].precio;
                }
            }
            $rootScope.activePotential.opportunities[i].precio=opportunityPrice;
            $rootScope.activePotential.precio=$rootScope.activePotential.precio+opportunityPrice;
            // Save as a potential's general price quote
        };
        console.log('Precio set as: ',$rootScope.activePotential.precio);

        accountOrigin=$cookies.get('accountOrigin');
        // Avoid repeating accounts and potential on login sessions
        // Restored and logged in sessions got account by GET and saved $cookie
        console.log('Account BEFORE HTTP POST: ', $rootScope.activeAccount);
        if(accountOrigin=='login'){
            //First update current activeaccount
            //Cookie exists, hence it was loaded by login, do notrepeat account
            console.log('Account origin login, save to: ',$rootScope.activeAccount.id);
            // $rootScope.potentials.push($rootScope.activePotential);

            httpUpdate.account($rootScope.activeAccount.id, $rootScope.activeAccount);
            /*
            var account2 = $resource('/api/accounts/'+$rootScope.activeAccount.id, {account_id: '@_id'});
            account2.get({account_id: $rootScope.activeAccount.id}, function(gotAccount){
                gotAccount=$rootScope.activeAccount;
                gotAccount.$save();
            });
            */
            var newPotential = new potentials($rootScope.activePotential);  //Pass activePotential to potential object
            var account = $resource('/api/accounts/:account_id', {account_id: '@_id'});
            //Restore account back to original value to parse
            newPotential.$save();
            // $scope.addPotential();
            //  Create new Potential in case another quote is resent
            var quoteObject= {
                contacto: $rootScope.user,
                potentialId: $rootScope.activePotential.id,
                accountId: $rootScope.activePotential.accountId
            }
            console.log('Sent quoteObject: ',quoteObject);
            $http.post('/mailCotizacion', quoteObject)
                .success(function(data){
                    console.log('Respose form mailCotizacion: ', data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });


        }else if(accountOrigin=='new'){
            // Was created without cookie, account is new
            console.log('Account origin new');
            // $rootScope.accounts.push($rootScope.activeAccount);
            // $rootScope.potentials.push($rootScope.activePotential);
            $cookies.remove('activeAccount');
            var newPotential = new potentials($rootScope.activePotential);  //Pass activePotential to potential object
            var newAccount = new accounts($rootScope.activeAccount);  //Pass activePotential to potential object
            newPotential.$save();
            newAccount.$save();
            // $scope.addPotential();
            //  Create new Potential in case another quote is resent
            var quoteObject= {
                contacto: $rootScope.user,
                potentialId: $rootScope.activePotential.id,
                accountId: $rootScope.activePotential.accountId
            }
            console.log('Sent quoteObject: ',quoteObject);
            $http.post('/mailActivation', quoteObject)
                .success(function(data){
                    console.log('Respose form mailActivation: ', data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });

        }else{
            console.error('Error: accountOrigin was not recognized: ', accountOrigin);
            // Remove cookies for account and users
            $cookies.remove('activeAccount');
            $cookies.remove('user');
        }
        // ==== Emailing route, passed object should have all variables since it's interpreted using req.body
        /*
            Verify if account has valid:true, if so no activation is needed
            If account has valid:false it requires activation.

        */
        if(!$rootScope.activeAccount.valid){
            //For accounts not yet activated
            $http.post('/mailActivation',  $rootScope.activePotential)
            .success(function (data, status, headers, config) {
                console.log("Activation Text Sent: " + data);
             //   $analytics.eventTrack('ContactForm', { category: 'Contact', label: 'ContactForm' });

            }).error(function (data) {
                console.log('Error: ' + data);
            });
        }
        $rootScope.activePotential={};
        $scope.modalClose(); //Do not remove modal since only Quotes on active product list
    }
    // Default values, use on modal Close and add equip
    $scope.phase1=true;
    $scope.phase2=false;
    $scope.selectFilter={
        type:"",
        description:''
    };
    $scope.filterSelect=function(type){
        if(typeof $rootScope.user == 'undefined'){
            console.log('No user on root');
            $rootScope.modalSwap.signup = true;
            $rootScope.modalSwap.kartEnabled=false;
            $rootScope.modalSwap.kart=false;
            $rootScope.modalSwap.add=true;

            //Login as well as Sigunup should return rootScope.user and rootScope.activeAccount
        }else{
            $scope.phase2=true;
            $scope.phase1=false;
            type.select=true;
            $scope.selectFilter.type=type.type;
            $scope.selectFilter.select=type.select;
            $scope.selectFilter.description=type.description;
            console.log('selectFilter: ',$scope.selectFilter);
        }
    };
    this.equipos = [
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
        $scope.equipos = this.equipos;
        initialize($routeParams);
    //$Scope can be changed for this, whole scope variable is changed
    // in appRoutes, 'this.variable' in controllers are appropiate
    // for manually overriding controller specific variables with
    // possible conflicting names with other controllers



    //Stablish Post, Saved via route.js's Api to Mongoose "postEquip()" function
    // $scope.formData = {} clear the form so our user is ready to enter another

    //===!==== MODIFY FOR api/equipo POSTING
  //  getEquipment();
        //  function getEquipment() { $http.get('/api/equipos').success(function (data) { $scope.equipos = data; }); }    ;
       // console.log(this.equipos.length + ' Equipos in total');
  for(var i=0; i < this.equipos.length; i++) {
    //console.log(this.equipos[i].model);
}

   $scope.postEquipment = function () {
        //formData might need to differ in name
        $http.post('/api/equipos', $scope.formData).success(function (data) {$scope.formData = {}; $scope.equipos = data; }).error(function (data) {console.log('Error: ' + data);});
    };


    //Stablish Delete

    $scope.deleteNerd = function (id) {
        $http.delete('/api/equipos/' + id)
			.success(function (data) {
            $scope.equipos = data;
            console.log(data);
            console.log('Delete Enabled' + id);
        })
			.error(function (data) {
            console.log('Error: ' + data);
        });
    };


}]);//END OF NerdController
