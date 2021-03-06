'use strict';
angular.module('Trendicity')

// Creating a constant for post type values.
// This adds readability to our code later.
.constant('POST_TYPE', {
    'TRENDING': 'TR',
    'NEARBY': 'NB',
    'USER_FEED': 'UF',
    'LIKED': 'LP'
})
.controller('HomeCtrl', function (
  POST_TYPE,
  $rootScope,
  $scope,
  $state,
  $ionicHistory,
  $ionicPopover,
  $ionicLoading,
  $ionicScrollDelegate,
  $ionicViewSwitcher,
  InstagramService,
  PostsService,
  GeolocationService
) {

  $scope.goToFood = function() {
    $ionicHistory.clearCache();
    $ionicViewSwitcher.nextDirection("backward");
    $state.go("base.home.food");
  };

  $scope.goToBusiness = function() {
    $ionicHistory.clearCache();
    $ionicViewSwitcher.nextDirection("forward");
    $state.go("base.home.business");
  };

    $scope.model =  PostsService.getModel();
    $scope.search = { value: POST_TYPE.NEARBY};

    // $scope.getPosts = function(value) {
    //   if (value === POST_TYPE.TRENDING) {
    //     PostsService.findPopularPosts();
    //   } else if (value === POST_TYPE.NEARBY) {
    //     $scope.findNearbyPosts();
    //   } else if (value === POST_TYPE.USER_FEED) {
    //     PostsService.findUserFeedPosts();
    //   } else if (value === POST_TYPE.LIKED) {
    //     PostsService.findLikedPosts();
    //   }
    // };

    // $scope.findNearbyPosts = function() {
    //   if ($state.current.name !== 'app.home.map') {
    //     $ionicLoading.show();
    //     var options = {
    //       timeout: 10000,
    //       maximumAge: 600000,
    //       enableHighAccuracy: false
    //     };
    //     GeolocationService.getCurrentPosition(options).then(
    //       function(position) {
    //         PostsService.findNearbyPosts(position.coords);
    //        },
    //       function() {
    //         $ionicLoading.hide();
    //       }
    //     );
    //   }
    // };

    // $scope.updatePosts = function (searchValue) {
    //   $scope.getPosts(searchValue);
    //   $scope.closePopover();
    //   $ionicScrollDelegate.scrollTop();
    // };

    $scope.goToFood = function() {
      $state.go('base.home.food');
    };

    $scope.$watch('search.value', function(newValue) {
        // Triggered when user changes search value
        // $scope.updatePosts(newValue);
    });

    $ionicPopover.fromTemplateUrl('templates/search.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      console.log('we here');

      $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      if ($scope.popover && $scope.popover.isShown()) {
        $scope.popover.hide();
      }
    };

    // Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      if ($scope.popover) {
        $scope.popover.remove();
      }
    });

    //*** Register some event handlers
    $scope.$on('event:auth-logoutComplete', function() {
      console.log('handling event:auth-logoutComplete...');
      if ($scope.search.value === POST_TYPE.USER_FEED || $scope.search.value === POST_TYPE.LIKED_POST) {
        PostsService.clearCurrentPosts();
      }
    });

    $scope.prepareDirection = function(destinationRoute) {
      if (destinationRoute == 'foodRoute') {
        console.log('went to food');
        $rootScope.foodRoute = 'back';
        $rootScope.businessRoute = 'forward';
        $rootScope.exploreRoute = 'forward';
      } else if (destinationRoute == 'businessRoute') {
        console.log('went to biz');
        $rootScope.foodRoute = 'back';
        $rootScope.businessRoute = 'forward';
        $rootScope.exploreRoute = 'forward';
      } else if (destinationRoute == 'exploreRoute') {
        console.log('went to explore');
        $rootScope.foodRoute = 'back';
        $rootScope.businessRoute = 'back';
        $rootScope.exploreRoute = 'forward';
      }
    };
  }
);
