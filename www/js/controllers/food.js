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
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  console.log('we in da food controlla');
  var firstTimeFoods = 0;
  if (firstTimeFoods == 0) {
    $scope.foods = [];
    firstTimeFoods = 1;
  }

  BackendService.getFoodIndex().then(
    function(data) {
      $scope.foods = data;
    },
    function(data) {
      console.log('we hit a problem here cap');
    });

  $scope.submitFood = function(name) {
    if (!name) {
      console.log('dere was no food');
      return;
    }

    console.log('DA FOOD NAME for submission IS '+name);
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
