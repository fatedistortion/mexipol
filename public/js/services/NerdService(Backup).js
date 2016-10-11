angular.module('NerdService', []).factory('nerdFactory', ['$http', function($http) {
    //Angular.Module's name is Nerdservice
    return {
        // call to get all nerds
        get: function () {
            return $http.get('/api/nerds')
//Possible Comment out Beguins -- ELIMINATE the ";" and sent it at end.
    /**/
        .success(function (data) {
                $scope.nerds = data;
                console.log('Nerds gotten');
            })
		.error(function (data) {
                console.log('Error: ' + data);
            });
    /**/
//Possible Comment out Ends -- CHANGE the ";" before "}"
            
        },

        // call to POST and create a new nerd
        create: function (nerdData) {
            return $http.post('/api/nerds', nerdData);
//Possible Comment out Beguins -- ELIMINATE the ";" and sent it at end.
    /*
        .success(function (data) {
			    $scope.formData = {}; // clear the form so our user is ready to enter another
			    $scope.nerds = data;
			    console.log(data);
			})
			.error(function (data) {
			    console.log('Error: ' + data);
			})
    */
//Possible Comment out Ends -- CHANGE the ";" before "}".
            
        },

        // call to DELETE a nerd
        delete: function (id) {
            return $http.delete('/api/nerds/' + id);
//Possible Comment out Beguins -- ELIMINATE the ";" and sent it at end.
    /*
            .success(function (data) {
			    $scope.nerds = data;
			    console.log(data);
			})
			.error(function (data) {
			    console.log('Error: ' + data);
			})
    */
//Possible Comment out Ends -- CHANGE the ";" before "}".


        }
    }

}]);