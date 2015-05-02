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

  $scope.submitBusinessStatus = function(data) {
    if (data == 'happy') {
      data = { happy: 1 };
    }

    BackendService.submitBusinessStatus(data);
  }
});
