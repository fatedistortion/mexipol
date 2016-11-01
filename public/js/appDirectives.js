var dir = angular.module('appDirectives', []);

/*
 * Calling the background directive will templeate CSS accrding to atribute values of an element
 * Directive filtering in angular eliminates "x-" to "x" hence the attribute backImg must be
 * written in the elemnt's DOM as:
 *
 *                  back-Img:"http://{{$SCOPE_ELEMENT}}/or_STATIC_ELEMENT"
 *
 * http://jsfiddle.net/BinaryMuse/aSjwk/2/
 */
dir.directive('backImg', function () {
    return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
            element.css({
                'background-image': 'url(' + value + ')',
                'background-size' : 'cover'
            });
        });
    };
});
dir.directive('analytics', function () {
    return {
        restrict: 'E', //Restrict for Element
        templateUrl: '/templates/analytics.html' //Url accessed from public folder

    };
});
dir.directive('postsection', function () {
    return {
        restrict: 'E', //Restrict for Element
        controller: 'FacebookControl as Facebook',
        templateUrl: '/templates/newssection.html' //Url accessed from public folder

    };
});
dir.directive('hotBanner', function () {
    return {
        restrict: 'E', //Restrict for Element
        controller: 'MainController as Main',
        templateUrl: function(elem, attr){
            var date = new Date();
            // use date parser to access simposium htmls
                if((date.getMonth()>4)&&(date.getYear()>115)){
                    // After April 2016 use normal banner
                    return '/templates/hero'+'.html';
                }else if((date.getMonth()<4)&&(date.getYear()>115)){
                    // Before April 2016 use simposium
                    return '/templates/poster2.html';
                }else{
                    // Use default hero
                    return '/templates/hero'+'.html';
                }
            } //Url accessed from public folder

    };
});

dir.directive('activePotenial', ['resourceService', '$rootScope', 'httpUpdate', function(resourceService, $rootScope, httpUpdate) {
  function link(scope, element, attr) {
    scope.commented=false;
    scope.feedback=false;
    console.log('scope.potential: ', scope.potential);
    resourceService.potentials.get({id: scope.potential}, function(potential){
        console.log('Directives potential is: ',potential);
        scope.preview=potential;
    });
    scope.taskFeedback = function(potentialId){
        scope.commented=true;
        scope.feedback=false;

        resourceService.tasks.query({id: scope.accountid}, function(tasks){
            console.log('Got tasks for '+scope.accountid+': ',tasks);
            // Build  new Id for task starting with accountId and task length
            var tempId=scope.accountid.substr(scope.accountid.indexOf('-')+1);
            tempId=tempId.substr(0,tempId.indexOf('-'));
            lengthTail=tasks[0].id.substr(-3);
            if(lengthTail.indexOf('-')==0){
                // Fix tail lag
                lengthTail=tasks[0].id.substr(-2);
            };
            nextNum=tasks.length+1;
            lengthTail=parseInt(lengthTail);
            if(lengthTail==(nextNum)){
                // Id Conflict with number, avoid task rejection
                console.log(lengthTail);
                console.log(nextNum);
                nextNum=nextNum+1;
            }

            console.log('Text substring gotten: ', lengthTail);
            if(nextNum<10){
                number='00'+nextNum;
            }else if(nextNum<100){
                number='0'+nextNum;
            }else{
                number=nextNum;
            }
            var thisDate = new Date;
            tempId='tas-'+tempId+'-'+number;
            console.log('TempId: ', tempId);
            scope.description = angular.copy($rootScope.directiveDescription);
            tempTask={
                id: tempId,
                title: 'Feedback por '+scope.name,
                accountId: scope.accountid,
                idPotential: potentialId,
                valid: true,
                priority: 'high',
                taskOwner: 'Alejandro Ruiz',
                recordar: new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()+8),
                status: 'Not Started',
                taskType: 'Feedback',
                descripcion: scope.description
            };
            $rootScope.directiveDescription='';
            resourceService.potentials.get({id: potentialId}, function(potential){
                potential.tareas.push({id: tempId});
                console.log('presaved Potential tasks: ', potential.tareas);
                httpUpdate.potential(potentialId, potential);
            });
            var newTask = new resourceService.postTasks(tempTask);
            console.log('Saved a task: ',tempTask);
            newTask.$save();

        });
        console.log('Working with: ',potentialId);
        /*
        resourceService.potentials.get({id: scope.potential}, function(potential){
            potential.task
        })
        */
    }

    console.log('Element: ',element);
    console.log('Attribute: ',attr);
  }
  return {
    restrict: 'E',
    transclude: false,
    scope: { // should be passed as attribute
      potential: '=',
      accountid: '=',
      name: '='
    },
    link: link,
    templateUrl: '/templates/preview-potential.html'
  };
}]);
