/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.video', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('form.video', {
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

        templateUrl: '/views/app/authentication/video.html',

        title: 'Registration',

        format: 'mp4',

        url: 'https://dl.dropboxusercontent.com/u/67905790/ReportHub/HealthCluster/afg_health_cluster_project_details.mp4'

      }

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);
      
      // video type and location
      video.addSource($scope.panel.format, $scope.panel.url);

    }

]);
