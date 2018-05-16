'use strict';

angular

.module('sApp', ['sirtiAlert'])

.controller('sCtrl', function($scope, sirtiAlert) {

   $scope.alertType = 'info';

   $scope.openAlert = function(referenceId) {
     var config = {};
     if(referenceId) {
       config.referenceId = referenceId;
     }
     sirtiAlert[$scope.alertType]('This is an alert message', config);
   };

   $scope.openSirtiErrorAlert = function() {
     sirtiAlert[$scope.alertType]({
       message: 'bla bla bla',
       internalMessage: 'verbose bla bla bla',
       UUID: '644e7005a42a1269c390a4ac9fe149be'
     });
   };

   $scope.openObjectAlert = function() {
     sirtiAlert[$scope.alertType]({
       pippo: 'pluto',
       paperino: 'paperone'
     });
   };
   
   $scope.clearAlerts = function() {
     sirtiAlert.clear();
   };

})

;
