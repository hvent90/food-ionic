'use strict';
angular.module('Trendicity')

.service('BackendService', function(
  $cordovaOauth,
  $http,
  $interval,
  $ionicLoading,
  $rootScope,
  $q,
  $state,
  localStorageService) {
  var self = this;

  // if running in a desktop browswer we will proxy to: https://api.instagram.com/v1 in ionic.project to avoid CORS issues
  var API_ENDPOINT = 'http://local.food.com';

  console.log('API_ENDPOINT:' + API_ENDPOINT);

  // You are encouraged to setup your own client_id at: http://instagram.com/developer/clients/manage
  var CLIENT_ID = '529868813818134';
  var CLIENT_SECRET = 'ed8dab109859ba855cd65794b72806d5';

  // var AUTH_URL = 'http://local.food.com/facebook';
  var AUTH_REDIRECT_URL = 'http://localhost:8100/callback';
  var AUTH_URL = 'https://www.facebook.com/v2.2/dialog/oauth?client_id='+
    CLIENT_ID+'&redirect_uri='+AUTH_REDIRECT_URL+'&scope=email&response_type=code';
  var LOGOUT_URL = 'http://local.food.com/logout';

  this.authCheck = function() {
    var token = window.localStorage['auth_token'];
    console.log('Auth check for token: '+ token);
    var response =  $http({
            method: 'POST',
            url: API_ENDPOINT + '/auth/check',
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            data: { auth_token: token }
    });

    response.success(
        function( data, status, headers, config ) {
         console.log('passed auth check.');
        }
    );
    response.error(
        function( data, status, headers, config ) {
         console.log('failed auth check.');
         console.log(JSON.stringify(data));
         console.log(JSON.stringify(status));
         console.log(JSON.stringify(headers));
         $state.go('auth.login');
        }
    );
  };

  this.submitBusinessStatus = function(formData) {
    var defer = $q.defer();
    var token = window.localStorage['auth_token'];

    formData.auth_token = token;

    var response =  $http({
            method: 'POST',
            url: API_ENDPOINT + '/business?auth_token='+token,
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            data: formData
    });

    response.success(
        function( data, status, headers, config ) {
          console.log('successful submission of business');
          defer.resolve(JSON.parse(JSON.stringify(data)));
        }
    );
    response.error(
        function( data, status, headers, config ) {
         console.log('failed food index');
         $state.go('auth.login');
         console.log(JSON.stringify(data));
         console.log(JSON.stringify(status));
         console.log(JSON.stringify(headers));
        }
    );

    return defer.promise;
  }

  this.getFoodIndex = function() {
    var defer = $q.defer();
    var token = window.localStorage['auth_token'];

    var response =  $http({
            method: 'GET',
            url: API_ENDPOINT + '/food?auth_token='+token
    });

    response.success(
        function( data, status, headers, config ) {
          console.log('successful retrieval of food index');
          defer.resolve(JSON.parse(JSON.stringify(data)));
        }
    );
    response.error(
        function( data, status, headers, config ) {
         console.log('failed food index');
         $state.go('auth.login');
         console.log(JSON.stringify(data));
         console.log(JSON.stringify(status));
         console.log(JSON.stringify(headers));
        }
    );

    return defer.promise;
  };

  this.submitFood = function(name) {
    $ionicLoading.show();
    var defer = $q.defer();

    var token = window.localStorage['auth_token'];
    console.log('SUBMIT FOOD CALL || Auth check for token: '+ token);
    var response =  $http({
            method: 'POST',
            url: API_ENDPOINT + '/food',
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            data: { auth_token: token, foodName: name }
    });

    response.success(
        function( data, status, headers, config ) {
          $ionicLoading.hide();
          console.log('Successful food submission');
          defer.resolve(JSON.parse(JSON.stringify(data)));
        }
    );
    response.error(
        function( data, status, headers, config ) {
          $ionicLoading.hide();
          console.log('failed food submission');
          defer.reject();
          console.log(JSON.stringify(data));
          console.log(JSON.stringify(status));
          console.log(JSON.stringify(headers));
        }
    );

    return defer.promise;
  }

  this.loginWithFacebook = function() {
    $cordovaOauth.facebook(CLIENT_ID, ['email']).then(function(result) {
        console.log(JSON.stringify(result.access_token));
        window.localStorage['facebook_token'] = result.access_token;
        console.log('Facebook token: '+ window.localStorage['facebook_token']);
        $ionicLoading.show();
        self.loginWithBackend(result.access_token);
    }, function(error) {
        console.log(error);
    });
  }

  this.logout = function() {
    window.localStorage['auth_token'] = '';
    $state.go('auth.login');
  };

  this.loginWithBackend = function(access_token) {
    console.log(localStorageService.get('auth_token'));
    var response =  $http({
            method: 'POST',
            url: API_ENDPOINT + '/auth/facebook',
            headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
            data: { accessToken: access_token }
    });

    response.success(
        function( data, status, headers, config ) {
          console.log(data);
          window.localStorage['auth_token'] = data.token;
          console.log('Successful login. Auth token: '+ window.localStorage['auth_token']);
          console.log('go to food!');
          $ionicLoading.hide();
          $state.go('base.home.food');
        }
    );

    response.error(
      function( data, status, headers, config ) {
        console.log('Failure to login');
        console.log(JSON.stringify(data));
        console.log(JSON.stringify(status));
        console.log(JSON.stringify(headers));
        console.log(JSON.stringify(config));
      }
    );
  };

  this.getEndpoint = function() {
      return API_ENDPOINT;
  };

  this.login = function() {
    var loginWindow = window.open(AUTH_URL, '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'
    );

    var request = $http({
        method: "post",
        url: "https://www.facebook.com/v2.2/dialog/oauth",
        data: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: localStorage.getItem('fbCode'),
          redirect_uri: AUTH_REDIRECT_URL
        }
    });

    // Store the data-dump of the FORM scope.
    request.success(
        function( html ) {
          console.log('wat');
          console.log(html);
        }
    );

    if (ionic.Platform.isWebView()) { // If running in a WebView (i.e. on a mobile device/simulator)
      loginWindow.addEventListener('loadstart', function (event) {
        console.log('we herr?');
        if ((event.url).indexOf(AUTH_REDIRECT_URL) === 0) {
          var accessToken = (event.url).split('access_token=')[1];
          localStorageService.set('accessToken', accessToken);
          // loginWindow.close();
          if (self.isLoggedIn()) {
            authService.loginConfirmed(null, configUpdater);
          }
        }
      });
    } else { // if running on a desktop browser, use this hack
      var intervalCount = 0, timesToRepeat = 100, intervalDelay = 3000;
      var loginPoller = function() {
        intervalCount++;
        if (self.isLoggedIn()) {
          console.log('user is logged in now');
          $interval.cancel(promise);
          // authService.loginConfirmed(null, configUpdater);
        } else {
          console.log('user not logged in yet, we wont wait forever.  Intervals left:', timesToRepeat - intervalCount);
          if (intervalCount >= timesToRepeat) {
            $interval.cancel(promise);
            console.log('Since this is a hack for running the app in the browser, we are now giving up on you logging in.');
            loginWindow.close();
          }
        }
      };
      var promise = $interval(loginPoller, intervalDelay, timesToRepeat, false);
    }
  };

  this.findPopularPosts = function(options) {
    options = options || {};
    options.client_id = CLIENT_ID; // jshint ignore:line

    var promise =
      $http.get(API_ENDPOINT + '/media/popular', {
        params: options
      })
      .error(function(data, status) {
        console.log('findPopularPosts returned status:'  + status);
      });
    return promise;
  };

  // options.distance by default is 1 Kilometer
  this.findNearbyPosts = function(options) {
    options = options || {};
    options.client_id = CLIENT_ID; // jshint ignore:line

    var promise =
      $http.get(API_ENDPOINT + '/media/search', {
        params: options
      })
      .error(function(data, status) {
        console.log('findNearbyPosts returned status:'  + status);
      });
    return promise;
  };

  this.findUserFeedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ENDPOINT + '/users/self/feed', {
      params: options
    })
    .error(function (data, status) {
      console.log('userFeedPosts returned status:' + status);
    });
    return promise;
  };

  this.findLikedPosts = function(options) {
    options = options || {};

    var promise = $http.get(API_ENDPOINT + '/users/self/media/liked', {
      params: options
    })
    .error(function (data, status) {
      console.log('findLikedPosts returned status:' + status);
    });
    return promise;
  };

  this.likePost = function(mediaId) {
    var promise = $http.post(API_ENDPOINT + '/media/' + mediaId + '/likes')
    .error(function (data, status) {
      console.log('likePost returned status:' + status);
    });
    return promise;
  };

  this.dislikePost = function(mediaId) {
    var promise = $http.delete(API_ENDPOINT + '/media/' + mediaId + '/likes')
    .error(function (data, status) {
      console.log('dislikePost returned status:' + status);
    });
    return promise;
  };

  this.loginCancelled = function() {
    // Let the authService know that login was cancelled so that the http buffer will be cleared.
    authService.loginCancelled();
  };

  this.logoutx = function() {
    var promise = ionic.Platform.isWebView() ? $http.post(LOGOUT_URL) : $http.jsonp(LOGOUT_URL);
    promise.error(function (data, status) {
      // expect to get a 404 error on the desktop browser due to the nature of the response from Instagram
      // The Instagram API doesn't officially have a logout function
      console.log('logout returned status:' + status);
    })
    .finally(function() {
      localStorageService.remove('accessToken');
      $rootScope.$broadcast('event:auth-logoutComplete');
    });
    return promise;
  };

  this.getAccessToken = function() {
    return window.localStorage['auth_token'];
  };

  this.isLoggedIn = function() {
    return !!this.getAccessToken();
  };
});
