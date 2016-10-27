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
        templateUrl: '/scripts/modules/health/views/forms/reports.list/form.html'
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

        // budget
        project_budget_amount_recieved: 0,

        // date
        project_budget_date_recieved: moment().format('YYYY-MM-DD'),

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // budget
        budgetUrl: '/scripts/modules/health/views/forms/reports.list/budget.html',

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // Re-direct to summary
            $location.path( '/health/projects/summary/' + $scope.project.definition.id );

          }, 100);

        },

        // save project
        saveBudgetLine: function() {

          // if no progress reporting exists
          if ( !$scope.project.definition.project_budget_progress ) {
            $scope.project.definition.project_budget_progress = []
          }
  
          // budget + username
          var b = {
            username: ngmUser.get().username,
            email: ngmUser.get().email,
            project_budget_amount_recieved: $scope.project.project_budget_amount_recieved,
            project_budget_date_recieved: $scope.project.project_budget_date_recieved
          }

          // project definition + config
          var p = angular.merge( {}, config.project, $scope.project.definition );
          delete p.id;
  
          // extend targets with projectn ngmData details & push
          $scope.project.definition.project_budget_progress.unshift( angular.merge( {}, p, b ) );

          // reset form
          $scope.project.project_budget_amount_recieved = 0;

          // Update Project (as project_budget_progress is an association)
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/health/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            // on success
            Materialize.toast( 'Project Budget Progress Updated!', 3000, 'success');
          });

        },

        // remove budget item
        removeBudgetItem: function( $index ) {

          // remove from
          $scope.project.definition.project_budget_progress.splice( $index, 1 );

          // Update 
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/health/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            // on success
            Materialize.toast( 'Project Budget Progress Updated!', 3000, 'success');
          });

        },

        // set budget date on datepicker close
        datepicker: {
          maxDate: moment().format('YYYY-MM-DD'),
          onClose: function() {
            // format date
            $scope.project.project_budget_date_recieved = moment( new Date( $scope.project.project_budget_date_recieved ) ).format('YYYY-MM-DD');
          }
        }

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

        }, 1000 );

      });
  }

]);
