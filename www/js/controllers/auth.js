'use strict';
angular.module('Trendicity')

.controller('AuthCtrl', function(
  $scope,
  $state,
  $timeout,
  $ionicSlideBoxDelegate,
  $ionicSideMenuDelegate,
  $ionicHistory,
  auth,
  localStorageService) {
  	$scope.loginPls = function() {
	    auth.signin({
	      authParams: {
	        scope: 'openid offline_access',
	        device: 'Mobile device'
	      }
	    }, function(profile, token, accessToken, state, refreshToken) {
	      // Success callback
	      store.set('profile', profile);
	      store.set('token', token);
	      store.set('refreshToken', refreshToken);
	      $location.path('/');
	    }, function() {
	      // Error callback
	    });
	}

	$scope.fbLogin = function() {
		openFB.login(function(response) {
			if (response.status === 'connected') {
				console.log(response);
				$scope.closeLogin();
			} else {
				alert('Facebook login failed');
			}
		},
		{scope: 'email,publish_actions'});
	};
});
