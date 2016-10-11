var GeekCtrl = angular.module('GeekCtrl', []);
//Whole Module is imported in app.js with all it's controllers

GeekCtrl.controller('GeekController',['$scope', '$http', function ($scope, $http) {
    //Acqure Controller Variables
    $scope.Header = 'Geek City';
    $scope.tagline = 'The square root of life is pi!';
    getGeeks();	
    
    //-- Declaring general Get,Post, Delete Geeks --//
   
    function getGeeks() {
        $http.get('/api/geeks')
        .success(function (data) {
        $scope.geeks = data;
        console.log(data);
        
        })
		.error(function (data) {
            console.log('Error: ' + data);
        });
        console.log('getGeeks Accessed');
    };
    
    //Stablish Post, Saved via route.js' API to Mongoose
    this.postGeeks = function () {
        $http.post('/api/geeks', $scope.formData)
			.success(function (data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.geeks = data;
            console.log(data);
        })
			.error(function (data) {
            console.log('Error: ' + data);
        });
    };
    
    //Stablish Delete
    this.deleteGeek = function (id) {
        $http.delete('/api/geeks/' + id)
			.success(function (data) {
            $scope.geeks = data;//Refreshes $scope.geeks
            console.log(data);
            console.log('Delete Enabled' + id);
        })
			.error(function (data) {
            console.log('Error: ' + data);
        });
    };

}]);//END OF GeekController 


