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
  $ionicModal,
  $ionicPopup,
  $ionicViewSwitcher,
  $rootScope,
  BackendService,
  localStorageService) {
  console.log('ITS BUSINESS TIME, cause we in da business controlla');

  // $rootScope.foodRoute = 'back';
  // $rootScope.exploreRoute = 'forward';
  // console.log($rootScope.foodRoute);
  // console.log($rootScope.businessRoute);
  // console.log($rootScope.exploreRoute);


  $scope.data = {};
  $scope.data.blood = 0;
  $scope.data.pain = 0;
  $scope.data.consistency = 50;
  $scope.data.time_cleaning = 50;

  $scope.submitBusinessStatus = function(input) {
    var data = {
      blood: $scope.data.blood,
      pain: $scope.data.pain,
      time_cleaning: $scope.data.time_cleaning,
      consistency: $scope.data.consistency,
    };

    if (input == 'happy') {
      console.log('wooooo');
      data = { happy: 1 };
    }


    BackendService.submitBusinessStatus(data).then(
      function(returnData) {
        $scope.showConfirm();
        $scope.closeModal();
      },
      function(returnData) {
        console.log('submitBusinessStatus() failure in business.js');
      }
    );
  };

  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.show({
      title: 'Great Job! <br /><br /> <i style="display: block; text-align: center; margin-top: 5px; font-size: 3em !important" class="icon ion-checkmark"></i>'
    });
    $timeout(function() {
       confirmPopup.close(); //close the popup after 3 seconds for some reason
    }, 1500);
  };

  $ionicModal.fromTemplateUrl('templates/modals/bad-business.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
});
