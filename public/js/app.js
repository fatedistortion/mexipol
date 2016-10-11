(function () {
   var mexApp = angular.module('Mexipol', ['ngResource', 'ngCookies', 'd3','ngRoute', 'FaceService','appRoutes', 'NerdService', 'MainCtrl', 'EventCtrl', 'NerdCtrl', 'GeekCtrl', 'ChemCtrl', 'GeneralCtrl','ApplyCtrl', 'EquipCtrl', 'appDirectives', 'ui.bootstrap', 'ngTouch', 'angular-carousel', 'angulartics', 'angulartics.google.analytics']);
//The array elements (ngRoute is an Angular Specific Route module; app.js is required in head of index.HTML
//This element is the first reference of the angular module as an Angular App called "sampleApp" including all required active elements
//Whenever adding a new module it should be stated within this angular.module
//The Reference to said Module is specified in Body ng-app=sampleApp, if the name is to be changed it most be done in both.
//Will return to Globar variables


})();//Format Wrapper

//Globally define deepCopy
function deepCopy(obj) {
   if (Object.prototype.toString.call(obj) === '[object Array]') {
      var out = [], i = 0, len = obj.length;
      for ( ; i < len; i++ ) {
         out[i] = arguments.callee(obj[i]);
      }
      return out;
   }
   if (typeof obj === 'object') {
      var out = {}, i;
      for ( i in obj ) {
         out[i] = arguments.callee(obj[i]);
      }
      return out;
   }
   return obj;
};
 