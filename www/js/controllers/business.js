'use strict';
angular.module('Trendicity')

.controller('BusinessCtrl', function(
  $q,
  $scope,
  $state,
  $timeout,
  $ionicSlideBoxDelegate,
  $ionicSideMenuDelegate,
  $ionicHistory,
  $ionicLoading,
  BackendService,
  localStorageService) {
  console.log('ITS BUSINESS TIME, cause we in da business controlla');
  BackendService.getFoodIndex().then(
    function(data) {
      $scope.foods = data;
      // console.log($scope.foods[1]);
    },
    function(data) {
      console.log('we hit a problem here cap');
    });

  $scope.submitFood = function(name) {
    BackendService.submitFood(name).then(
      function(data) {
        $scope.foods = data;
      },
      function(data) {
        console.log('submitFood() failure in food.js');
      }
    );
  };
});
