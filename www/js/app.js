'use strict';

angular.module('Trendicity', [
  'ionic',
  'ionic.contrib.ui.tinderCards',
  'ionic.contrib.icon',
  'config',
  'LocalStorageModule',
  'ngCordova',
  'uiGmapgoogle-maps',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'ion-autocomplete'
])

.run(function($rootScope, $ionicPlatform, ENV, auth, BackendService) {
  console.log('Environment:', ENV.name);

  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    BackendService.authCheck();
  });
})

.config(function(
  $stateProvider,
  $urlRouterProvider,
  $httpProvider,
  authProvider,
  jwtInterceptorProvider) {
  openFB.init({appId: '529868813818134'});

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('auth', {
      url: '/auth',
      abstract: true,
      templateUrl: 'templates/auth.html',
      controller: 'AppCtrl'
    })

    .state('auth.login', {
      url: '/login',
      views: {
        'authContent': {
          templateUrl: 'templates/login.html',
          controller: 'AuthCtrl'
        }
      }
    })

    .state('app.intro', {
      url: '/intro',
      views: {
        'menuContent': {
          templateUrl: 'templates/intro.html',
          controller: 'IntroCtrl'
        }
      }
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.home.food', {
      url: '/food',
      views: {
        'tab-food': {
          templateUrl: 'templates/tab-food.html',
          controller: 'FoodCtrl'
        }
      }
    })

    .state('app.home.business', {
      url: '/business',
      views: {
        'tab-business': {
          templateUrl: 'templates/tab-business.html',
          controller: 'BusinessCtrl'
        }
      }
    })

    // .state('app.home.map', {
    //   url: '/map/?latitude&longitude',
    //   views: {
    //     'tab-map': {
    //       templateUrl: 'templates/tab-map.html',
    //       controller: 'MapViewCtrl as mapCtrl'
    //     }
    //   }
    // })

    // .state('app.home.card', {
    //   url: '/card',
    //   views: {
    //     'tab-card': {
    //       templateUrl: 'templates/tab-card.html',
    //       controller: 'CardViewCtrl'
    //     }
    //   }
    // })

    // .state('app.home.list', {
    //   url: '/list',
    //   views: {
    //     'tab-list': {
    //       templateUrl: 'templates/tab-list.html',
    //       controller: 'ListViewCtrl'
    //     }
    //   }
    // })

    .state('app.callback', {
      url: '/callback',
      views: {
        'tab-meh': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListViewCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    console.log('go!');
    $urlRouterProvider.otherwise('/app/home/food');

  authProvider.init({
    domain: 'http://localhost:8100',
    clientID: '529868813818134',
    loginState: 'login'
  });
})

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner icon="android"></ion-spinner>'
})

.config(function($httpProvider) {
  // $httpProvider.interceptors.push('TrendicityInterceptor');
})

.config(function($ionicConfigProvider) {
  // Make tabs show up at the bottom for android if you so desire
  // $ionicConfigProvider.tabs.position('bottom');

  // Use native scrolling on Android
  if(ionic.Platform.isAndroid()) $ionicConfigProvider.scrolling.jsScrolling(false);
});