var FaceFactory = angular.module('FaceService', []);
//Angular.Module's name is Nerdservice, each factory serves a
//different function. CHECK GLOBAL VARIABLES IN app.js for more
FaceFactory.factory('accessToken', function accessTokenFactory() {
    return '991248310908811|VqpouE9LjWdm8x2abVy9EkUhMTs';
});

FaceFactory.factory('FacebookApi', ['accessToken','$http', function (accessToken, $http) {

        //$scope.tagline can filter for Hashtags, apiSearch = $scope.apiSearch can be used for posts,albums,photos, etc.
        //$scope.apiSearchFields can be used for field specific inputs
        // and should be written in controller as apiSearchFields = searchFields[1] ', '+searchFields[2]+', '+...


}]);


FaceFactory.controller('FacebookControl', ['accessToken', '$http', '$scope', function (accessToken, $http, $scope) {

        $scope.lists = [];
        $scope.posts = [];
        $scope.postType = 0;  //zero is default, accesses $scope.Header, $scope.newsLink and $scope.taglineLink
        //console.log(accessToken);

            //function is THIS. specifit to FacebookControler
        this.FacebookApi = function (apiSearch, apiSearchFields, messageHashtags) {
            m = 2;//Maximum month difference allowed
            d = 15;//Maximum days difference allowed
            var nowDate = new Date(Date.now());
            month = nowDate.getMonth();
            year = nowDate.getFullYear();
            day = nowDate.getDate();
            var allowDate = new Date(year, month - m, day - d); //leave lowercase with actual GMT time
            var AllowDate = (allowDate.getTime() / 1000).toString(); //console.log('Allowed date is: '+allowDate);
            //Uppercase is a seconds since 1970 unix timestamp in string for $http.get url query
            //BOTTOM correct for undeclared variables to allow FacebookApi function to be called even as FacebookApi() to access General information about business
            if (typeof apiSearch == 'undefined') { apiSearch = ''; }
            if (typeof apiSearchFields == 'undefined') { apiSearchFields = ''; }
            return $http.get('https://graph.facebook.com/v2.3/mexipol/' + apiSearch + '?access_token=' + accessToken + '&fields=' + apiSearchFields + '&since='+AllowDate+'&limit=20')
                .success(function (data, status, headers, config) {
                // this callback will be called asynchronously when the response is available
                //All direct data manipulation must be set within .success(){ __ } limit
                $scope.lists = data.data;
                //console.log($scope.lists);
                //First scan for hashtags or string array with logic and save index numbers according to
                //object passed in messageHastags variable
                //console.log('messageHastags: ',messageHashtags);
                if (typeof messageHashtags == 'undefined') {
                    $scope.posts = $scope.lists; //use no filter
                }
                else if (typeof messageHashtags == 'string') {
                    for (i = 0; i < $scope.lists.length; i++) {
                        strObject = $scope.lists[i].message;
                        if (typeof strObject !== 'undefined') { //strObject might be a post with no message
                            //console.log('STROBJECT IS: ' + strObject);
                            strIndex = strObject.search(messageHashtags);
                            if (strIndex != -1) { $scope.posts.push($scope.lists[i]); }//then the string exists within actual object
                        }
                       }
                }
                else if (typeof messageHashtags == 'object') {
                    //each object in messageHastags as an array must be passed as strings
                    for (j = 0; j < messageHashtags.length; j++) {
                        if (typeof messageHashtags[j] == 'string') { //if the current passed object in messageHashtags is a string
                            for (i = 0; i < $scope.lists.length; i++) {
                                strObject = $scope.lists[i].message;
                                if (typeof strObject !== 'undefined') { //strObject might be a post with no message
                                    ////console.log('STROBJECT IS: ' + strObject);
                                    strIndex = strObject.search(messageHashtags[j]);
                                    if (strIndex != -1) { $scope.posts.push($scope.lists[i]); }//then the string exists within actual object
                                }
                            }
                        }
                    }

                }
                else {
                    $scope.posts = $scope.lists; //Else just use no filter in case of error an
                }
                //select a random post number that's within the possible options to display
                //console.log('scope.posts are: ');
                //console.log($scope.posts);
                $scope.postIndex = Math.floor(($scope.posts.length) * Math.random());
                //console.log('post Index is: ' + $scope.postIndex + ' from a total of: ' + $scope.posts.length + ' posts');
                if (typeof $scope.postIndex !== 'undefined') {
                    //If postIndex is not undefiner it means there's at least a post in $scope.posts
                    /*Using an ng-show, parse between:
                 * 1. image containing post configuration
                 * 2. just string containig post configuration
                 * 3. just an image post without message. Uses default message
                 * -- Configure in template ng-show != post
                */
                    if (typeof $scope.posts[$scope.postIndex].picture == 'string') {
                        //Then a picture exists and is a string. Check if only a picture or picture and message
                        //If TypeError appears here it means there's no post within the search query
                        if (typeof $scope.posts[$scope.postIndex].message == 'undefined') {
                            //Only a picture, no message
                            $scope.postType = 3;
                        }
                        else {
                            //Picture and message
                            $scope.postType = 1;
                        }
                    }
                    else {
                        if (typeof $scope.posts[$scope.postIndex].message !== 'undefined') {
                            $scope.postType = 2;
                        } else {
                        // then it's a posting error and should return to default
                            $scope.postType = 0;
                        }
                    }
                } else {
                    //If postIndex is undefined
                    //console.log('Post index is Undefined! ');
                    $scope.postType = 0;
                    }

                //console.log($scope.postType);

                return data.data;

            }).error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //console.log('Didnota worka');
            });//End return argument
           //console.log('sommthn after return, Shouldnt be displayed...');//Shouldn't be displayed                                      
        };

        //=============== Configure post Function usage from ng-init at html; always use correct arguments
      //  apiSearch = 'posts'; //Set as default, whenever a new model needs changing call from function FacebookAPI(_, _)
     //   //console.log(apiSearch);
        //console.log('sommthn');
      //  this.FacebookApi(apiSearch, '');

    }]);

/*
 *
 * $http.get('https://graph.facebook.com/v2.3/mexipol?access_token=CAACEdEose0cBABCUkIqel2tnFHVZAMVjfZBNmu66gm7aAjWZA7vJQmHTaYtPYY2CdvUdzZAaj0hFBv7u4KPM0ny8nkI7kZAZB7drgkfXMA4o02dZCQEZBTITtbIVbGH4WnZAsOUwM1o4PiZAloDTMPeIaaPDdGAYhCYoKyMOfbjkBbjSMCnlKYfY4vJOsHwPUTiDq6RsvW1pAr6i6azVn2YcnZA')
 * .success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    	$scope.message = 'Everyone come and see how good I look!';
    	$scope.call=data;
    	//console.log(data);
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    	$scope.message = 'Didnota worka';
  });
 *
 *
 */
