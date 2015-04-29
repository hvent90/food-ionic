'use strict';
angular.module('Trendicity')

.controller('FoodCtrl', function(
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
  console.log('we in da food controlla');
  // $scope.foods = BackendService.getFoodIndex();
  // $q.all(BackendService.getFoodIndex()).then(function(result) {
  //   console.log('HERE WE GOOO', JSON.stringify(result));
  //   $scope.foods = result;
  // });
  var firstTimeFoods = 0;
  if (firstTimeFoods == 0) {
    $scope.foods = [];
    firstTimeFoods = 1;
  }

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
