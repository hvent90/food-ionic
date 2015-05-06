'use strict';
angular.module('Trendicity')

.controller('ExploreCtrl', function(
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
  $ionicScrollDelegate,
  $ionicViewSwitcher,
  $rootScope,
  BackendService,
  localStorageService) {

  $scope.chart = '';

  /**
   * $scope.businessMeetings is an object
   * that populates tab-explore.html's main
   * listing of Businesses.
   * @type {Object}
   */
  $scope.businessMeetings = {};

  /**
   * These four variables help us deal
   * with pagination.
   * @type {String}
   */
  $scope.lastPageNumber = '';
  $scope.currentPageNumber = '';
  $scope.nextPageUrl = '';
  $scope.prevPageUrl = '';

  BackendService.getBusinessIndex().then(
    function(data) {
      $ionicLoading.hide();

      // Fill the chart with Data
      $scope.createCharts(data.data);
      // Populate the list items
      $scope.businessMeetings = data.data;

      /**
       * Handle pagination with the
       * next four variables.
       */
       $scope.lastPageNumber = data.last_page;
       $scope.currentPageNumber = data.current_page;
       $scope.nextPageUrl = data.next_page_url;
       $scope.prevPageUrl = data.prev_page_url;
    },
    function(data) {
      $ionicLoading.hide();
    }
  );

  $scope.moreDataCanBeLoaded = function() {
    if ($scope.lastPageNumber > $scope.currentPageNumber) {
      return true;
    }

    return false;
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMoreData();
  });

  $scope.loadMoreData = function() {
    BackendService.getBusinessIndex($scope.nextPageUrl).then(
      function(data) {
        $ionicLoading.hide();

        // Fill the chart with Data
        $scope.createCharts(data.data);
        // Populate the list items
        $scope.businessMeetings = data.data;

        /**
         * Handle pagination with the
         * next four variables.
         */
         $scope.lastPageNumber = data.last_page;
         $scope.currentPageNumber = data.current_page;
         $scope.nextPageUrl = data.next_page_url;
         $scope.prevPageUrl = data.prev_page_url;

         $scope.$broadcast('scroll.infiniteScrollComplete');
         // $ionicScrollDelegate.resize();
         $scope.$broadcast('scroll.resize');
      },
      function(data) {
        $ionicLoading.hide();
      }
    );
  };

  $scope.createCharts = function(inputData) {
    var labelData = [];
    var bloodData = [];
    var painData = [];
    var timeCleaningData = [];
    var consistencyData = [];

    angular.forEach(inputData, function(value, key) {
      if(value.happy == 1) {
        value.blood = 0;
        value.pain = 0;
        value.timeCleaning = 0;
        value.consistency = 0;
      }

      labelData.push(value.created_at);
      bloodData.push(value.blood);
      painData.push(value.pain);
      timeCleaningData.push(value.timeCleaning);
      consistencyData.push(value.consistency);
    });

    $scope.chart = {
      customTooltips: function(tooltip) {
        console.log('custom tool tip!');
      },
      labels : labelData,
      datasets : [
          {
              label : "Red Stuff",
              fillColor : "rgba(151,187,205,0)",
              strokeColor : "#EF473A",
              pointColor : "rgba(151,187,205,0)",
              pointStrokeColor : "#EF473A",
              data : bloodData
          },
          {
              label : "Rear Lightning",
              fillColor : "rgba(151,187,205,0)",
              strokeColor : "#FFC900",
              pointColor : "rgba(151,187,205,0)",
              pointStrokeColor : "#FFC900",
              data : painData
          },
          {
              label : "Time Spent Cleaning",
              fillColor : "rgba(151,187,205,0)",
              strokeColor : "#886AEA",
              pointColor : "rgba(151,187,205,0)",
              pointStrokeColor : "#886AEA",
              data : timeCleaningData
          },
          {
              label : "Consistency",
              fillColor : "rgba(151,187,205,0)",
              strokeColor : "#444444",
              pointColor : "rgba(151,187,205,0)",
              pointStrokeColor : "#444444",
              data : consistencyData
          }
      ],
    };

    $scope.chart.customTooltips = function(tooltip) {
      console.log('fadfas');
    };

  };

  $scope.options = {
        // Boolean - Whether to animate the chart
        animation: true,

        // Number - Number of animation steps
        animationSteps: 60,

        // String - Animation easing effect
        animationEasing: "easeOutQuart",

        // Boolean - If we should show the scale at all
        showScale: true,

        // Boolean - If we want to override with a hard coded scale
        scaleOverride: false,

        // ** Required if scaleOverride is true **
        // Number - The number of steps in a hard coded scale
        scaleSteps: null,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: null,
        // Number - The scale starting value
        scaleStartValue: null,

        // String - Colour of the scale line
        scaleLineColor: "rgba(0,0,0,.1)",

        // Number - Pixel width of the scale line
        scaleLineWidth: 1,

        // Boolean - Whether to show labels on the scale
        scaleShowLabels: true,

        // Interpolated JS string - can access value
        scaleLabel: "<%=value%>",

        // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
        scaleIntegersOnly: true,

        // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: false,

        // String - Scale label font declaration for the scale label
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Scale label font size in pixels
        scaleFontSize: 12,

        // String - Scale label font weight style
        scaleFontStyle: "normal",

        // String - Scale label font colour
        scaleFontColor: "#666",

        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive: false,

        // Boolean - Determines whether to draw tooltips on the canvas or not
        showTooltips: true,

        // Array - Array of string names to attach tooltip events
        tooltipEvents: ["mousemove", "touchstart", "touchmove"],

        // String - Tooltip background colour
        tooltipFillColor: "rgba(0,0,0,0.8)",

        // String - Tooltip label font declaration for the scale label
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip label font size in pixels
        tooltipFontSize: 14,

        // String - Tooltip font weight style
        tooltipFontStyle: "normal",

        // String - Tooltip label font colour
        tooltipFontColor: "#fff",

        // String - Tooltip title font declaration for the scale label
        tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip title font size in pixels
        tooltipTitleFontSize: 14,

        // String - Tooltip title font weight style
        tooltipTitleFontStyle: "bold",

        // String - Tooltip title font colour
        tooltipTitleFontColor: "#fff",

        // Number - pixel width of padding around tooltip text
        tooltipYPadding: 6,

        // Number - pixel width of padding around tooltip text
        tooltipXPadding: 6,

        // Number - Size of the caret on the tooltip
        tooltipCaretSize: 8,

        // Number - Pixel radius of the tooltip border
        tooltipCornerRadius: 6,

        // Number - Pixel offset from point x to tooltip edge
        tooltipXOffset: 10,

        // String - Template string for single tooltips
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

        // String - Template string for single tooltips
        multiTooltipTemplate: "<%= value %>",

        customTooltips: true,


        // Function - Will fire on animation progression.
        onAnimationProgress: function(){},

        // Function - Will fire on animation completion.
        onAnimationComplete: function(){}
    };

    $scope.chartClick = function( event ) {
        if ( $scope.chart ) {
            // Different methods depending on chart type
            console.log( $scope.chart.getPointsAtEvent( event ) ); // for Points
            // console.log( $scope.chart.getSegmentsAtEvent( event ) ); // for Segments
        }
    };

});
