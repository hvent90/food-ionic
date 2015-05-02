'use strict';
angular.module('Trendicity')

.controller('BaseCtrl', function(
  $rootScope,
  $scope,
  $ionicModal,
  $timeout,
  $state,
  InstagramService,
  FavoritesService,
  BackendService,
  localStorageService) {
  console.log('In da base CTRL');

  // Check if user is logged in
  if (!window.localStorage['auth_token']) {
    $state.go('auth.login');
  } else {
    console.log('auth_token: '+window.localStorage['auth_token']);
  }

  // Determine if the user is logged into Instagram
  $scope.isLoggedIn = function() {
    return BackendService.isLoggedIn();
  };

  // Perform the logout action when the user invokes the logout link
  $scope.logout = function() {
    BackendService.logout();
  };

  // Hit the Laravel API
  // Laravel API does the OAUTH authentication with Facebook
  // Laravel returns the backend user
  $scope.loginToFacebook = function() {
    BackendService.loginWithFacebook();
  };

});
