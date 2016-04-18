/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.reports.list', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.reports.list', {
        title: 'Health Reports Form',
        description: 'Health Reports Form',
        controller: 'ProjectReportsListCtrl',
        templateUrl: '/views/modules/health/forms/reports.list/form.html'
      });
  })
  .controller('ProjectReportsListCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, config){

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // exchange rate
        exchange: {
          USDUSD: 1,
          USDAFN: 68.61          
        },

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // budget
        budgetUrl: '/views/modules/health/forms/reports.list/budget.html',

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // Re-direct to summary
            $location.path( '/health/projects/summary/' + $scope.project.definition.id );

          }, 100);

        },

        // save project
        save: function() {

          // update details

          // make little message too

          console.log( 'save' );

        }

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

        });

      });
  }

]);
