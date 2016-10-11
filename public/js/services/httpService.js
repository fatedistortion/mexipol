NerdService.factory('httpUpdate', ['$http', '$rootScope', function ($http, $rootScope) {
	/*
		HTTP Update are all $http resource based routines that handle get->post method from 
		an http method. 
		It's purpose is to ask for an account, task, potential to update and do so
		in whatever process required, considering routes.js api in such process
		it can get -> save -> remove, or get -> save; if necessary according to routes.js 

		Save, Remove, push, all mongoose methods supported in routes API can be modified according to:
		http://mongoosejs.com/docs/api.html


	*/
	return  {
        // Single ID driven get and update routines, id is divided since allowing copy-overs
        account: function (accountId, accountObject) {
                // Consider moving function to a factory
                // routes.js should handle update procedure using save();
                // routes posted to /api/accounts/:account_ID creates
                // an update routine
                var url='/api/accounts/'+accountId;
                console.log('URL is: ', url);
                $http.post(url, accountObject)
                    .success(function (data) {
                    console.log('account Post: ', data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                // Rootscope's accounts and potentials have changed, update
                // Http response is same as object sent
                $rootScope.refreshCRM();
                },
        potential: function (potentialId, potentialObject) {
                // Update potential is a get and save process, not pushing a new potential
                // $resource is desirable unless a method error is found as with account
                // Used to update opportunities and variables for potentials
                var url='/api/potentials/'+potentialId;
                console.log('URL is: ', url);
                $http.post(url, potentialObject)
                    .success(function (data) {
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                $rootScope.refreshCRM();
                },
        task: function (taskId, taskObject) {
                // Update potential is a get and save process, not pushing a new potential
                // $resource is desirable unless a method error is found as with account
                // Used to update opportunities and variables for potentials
                var url='/api/tasks/'+potentialId;
                console.log('URL is: ', url);
                $http.post(url, potentialObject)
                    .success(function (data) {
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                $rootScope.refreshCRM();
                }
        }


}]);
NerdService.factory('httpPost', ['$http', '$rootScope', function ($http, $rootScope) {
	/*
		HTTP Update are all $http resource based routines that handle get->post method from 
		an http method. 
		It's purpose is to ask for an account, task, potential to update and do so
		in whatever process required, considering routes.js api in such process
		it can get -> save -> remove, or get -> save; if necessary according to routes.js 

		Save, Remove, push, all mongoose methods supported in routes API can be modified according to:
		http://mongoosejs.com/docs/api.html


	*/
	return  {
        // Single ID driven get and update routines, id is divided since allowing copy-overs
        account: function (accountObject, accountId) {
                // Consider moving function to a factory
                // routes.js should handle update procedure using save();
                // routes posted to /api/accounts/:account_ID creates
                // an update routine
                if(typeof accountId != 'undefined'){
                	var url='/api/accounts/'+accountId;
                }else{
                	var url='/api/accounts';
                }
                console.log('URL is: ', url);
                $http.post(url, accountObject)
                    .success(function (data) {
                    console.log('account Post: ', data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                // Rootscope's accounts and potentials have changed, update
                // Http response is same as object sent
                $rootScope.refreshCRM();
                },
        potential: function (potentialObject, potentialId) {
                // Update potential is a get and save process, not pushing a new potential
                // $resource is desirable unless a method error is found as with account
                // Used to update opportunities and variables for potentials
                if(typeof potentialId != 'undefined'){
                	var url='/api/potentials/'+potentialId;
                }else{
                	var url='/api/potentials';
                }
                console.log('URL is: ', url);
                $http.post(url, potentialObject)
                    .success(function (data) {
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                $rootScope.refreshCRM();
                },
        task: function (taskObject, taskId) {
                // Update potential is a get and save process, not pushing a new potential
                // $resource is desirable unless a method error is found as with account
                // Used to update opportunities and variables for potentials
                if(typeof taskId != 'undefined'){
                	var url='/api/tasks/'+taskId;
                }else{
                	var url='/api/tasks';
                }
                console.log('URL is: ', url);
                $http.post(url, taskObject)
                    .success(function (data) {
                    console.log(data);
                })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
                $rootScope.refreshCRM();
                }
        }


}]);

NerdService.factory('resourceService', ['$resource', function ($resource) {
	/*
		Accounts and potential get with Id uses account's ID and potentials'id
		Only remove uses document's id.
		Using update method: resourceService.accounts.update({ id:$id }, account);

		Pass the object to update after the ID as shown above.
		Method PUT is not supported in current API version, POST with ID identifier 
		automatically updates document.
	*/
	return  {
        // Single ID driven get and update routines, id is divided since allowing copy-overs
        accounts: $resource('/api/accounts/:id', {id:'@id'}, {'update': { method:'POST' }}),
        potentials: $resource('/api/potentials/:id', {id:'@id'}, {'update': { method:'POST' }}),
        tasks: $resource('/api/tasks/:id', {id:'@id'}, {'update': { method:'POST' }}),
        postTasks: $resource('/api/tasks', null, null),
        notifications: $resource('/api/notifications/:taskOwner', {taskOwner:'@taskOwner'}, null),
        }
    /*
		Use: resourceService.accounts.update({id: $routeParams.id}, $scope.display);
        to update existing dataObject
        Repeat process for tasks and potentials as well.
        -	Posting without ID will post directly to general /api/accounts/
        -	Getting without ID will get directly from /api/accounts/

    */

}]);