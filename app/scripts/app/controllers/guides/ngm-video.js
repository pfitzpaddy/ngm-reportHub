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
    '$location',
    '$timeout',
    'video',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, video, ngmAuth, ngmUser, ngmData, config){

      // project
      $scope.panel = {

        // video panel
        video:[{

          title: 'Registration',

          format: 'mp4'

        }],

        templateUrl: '/views/app/guides/video.html',

        // search
        search: {
          filter: '',
          focused: false
        },

        // expand search box
        toggleSearch: function($event) {;
          // focus search
          $('#search_ngm-financial-list').focus();
          $scope.panel.search.focused = $scope.panel.search.focused ? false : true;
        },

        url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/afg_health_cluster_project_details.mp4'

      }

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);      
      // video type and location
      video.addSource($scope.panel.video[0].format, $scope.panel.video[0].url);

    }

]);
