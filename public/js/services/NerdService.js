var NerdService = angular.module('NerdService', []);
//Angular.Module's name is Nerdservice, each factory serves a 
//different function.

NerdService.factory('userFactory', ['$http', function ($http) {
    //nerdFactory returns a "promise" (or data) only, in order to be loaded
        //synchroneousely, avoiding empty views on Angular.
    return {
        promise: function(){
            return $http.get('/api/nerds').success(function (data) {
                return data;
            })
            .error(function (err) {
                return err;
            })
        },
        postNerds: function(formData){
            return $http.post('/api/nerds', formData).success(function (data) {
                return data;
            })
            .error(function (err) {
                return err;
            })
        }

    }
}]);

NerdService.factory('employeeFactory', ['$rootScope', '$q', '$cookies', '$cookieStore', '$location', function ($rootScope, $q, $cookies, $cookieStore, $location) {
    //Should only be called from /crm to clear user
    if(typeof ($cookies.getObject('Employee')) != 'undefined'){
        //Existing user exists, remove from cookie
        console.log( "Employee user name removed" );
        $cookies.remove('Employee');
        $rootScope.activeEmployee=false;
        $location.path('/crm');
        return( $q.when( "Employee" ) );
    }else{
        $location.path('/crm');
        console.log( "No Employee logged in" );
        return( $q.when( "No employee" ) );
    }
    //console.log( "A-resolver" );                                
    //return( "a-value-or-promise" );

    

    //nerdFactory returns a "promise" (or data) only, in order to be loaded
    //synchroneousely, avoiding empty views on Angular.
    /*
    return {
        promise: function(){
            return $http.get('/api/nerds').success(function (data) {
                return data;
            })
            .error(function (err) {
                return err;
            })
        },
        postNerds: function(formData){
            return $http.post('/api/nerds', formData).success(function (data) {
                return data;
            })
            .error(function (err) {
                return err;
            })
        }

    }
    */

}]);

