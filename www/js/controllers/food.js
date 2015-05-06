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
  $ionicPopup,
  $ionicViewSwitcher,
  $rootScope,
  BackendService,
  localStorageService) {

  // $rootScope.businessRoute = 'forward';
  // $rootScope.exploreRoute = 'forward';
  // console.log($rootScope.foodRoute);
  // console.log($rootScope.businessRoute);
  // console.log($rootScope.exploreRoute);

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
  console.log(firstTimeFoods);
  if (firstTimeFoods == 0) {
    $scope.foods = [];
    firstTimeFoods = 1;
  }

  if (window.localStorage['auth_token']) {
    console.log('ok we are here so it should do it pls');
    BackendService.getFoodIndex().then(
      function(data) {
        $scope.foods = data;
      },
      function(data) {
        console.log('we hit a problem here cap');
      });
  }

  $scope.submitFood = function(name) {
    if (!name) {
      console.log('dere was no food');
      return;
    }

    console.log('DA FOOD NAME for submission IS '+ name);
    BackendService.submitFood(name).then(
      function(data) {
        $scope.foods = data;
        $scope.showConfirm();
      },
      function(data) {
        console.log('submitFood() failure in food.js');
      }
    );
  };

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.show({
      title: 'Yum! <br /><br /> <i style="display: block; text-align: center; margin-top: 5px; font-size: 3em !important" class="icon ion-checkmark"></i>'
    });
    $timeout(function() {
       confirmPopup.close(); //close the popup after 3 seconds for some reason
    }, 500);
  };
});
