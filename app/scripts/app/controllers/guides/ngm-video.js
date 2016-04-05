/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.video', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('ngm.video', {
        title: 'ReportHub Video Player Form',
        description: 'ReportHub Video Player Form',
        controller: 'VideoPlayerFormCtrl',
        templateUrl: '/views/app/authentication/view.html'
      });
  })
  .controller('VideoPlayerFormCtrl', [
    '$scope',
    '$timeout',
    '$location',
    '$anchorScroll',
    'video',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $timeout, $location, $anchorScroll, video, ngmAuth, ngmUser, ngmData, config){

      // project
      $scope.panel = {

        // search
        search: {
          filter: '',
          focused: false
        },

        templateUrl: '/views/app/guides/video.html',

        // video panel
        video:[{

          title: 'Registration',

          format: 'mov',

          url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/afg_health_cluster_project_details.mp4'

        }],

        // scroll to hash
        gotoMenuItem: function($hash) {
            
          // div item
          $location.hash($hash);

          // call $anchorScroll()
          $anchorScroll();          
        },

        // expand search box
        toggleSearch: function($event) {
          // focus search
          $('#search_ngm-financial-list').focus();
          $scope.panel.search.focused = $scope.panel.search.focused ? false : true;
        }

      }

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);      
      // video type and location
      console.log(video)
      video.addSource($scope.panel.video[0].format, $scope.panel.video[0].url);

    }

]);
