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

        // budget
        project_budget_amount_recieved: 0,

        // date
        project_budget_date_recieved: moment().format('YYYY-MM-DD'),

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
        saveBudgetLine: function() {

          // if no progress reporting exists
          if ( !$scope.project.definition.project_budget_progress ) {
            $scope.project.definition.project_budget_progress = []
          }

          // create project budget progress object
          $scope.project.definition.project_budget_progress.unshift({
            organization_id: config.project.organization_id,
            organization: config.project.organization,
            project_title: $scope.project.definition.project_title,
            project_budget: $scope.project.definition.project_budget,
            project_budget_currency: $scope.project.definition.project_budget_currency,
            project_budget_amount_recieved: $scope.project.project_budget_amount_recieved,
            project_budget_date_recieved: $scope.project.project_budget_date_recieved
          });

          // reset form
          $scope.project.project_budget_amount_recieved = 0;


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

        // set start datepicker
        setBudgetTime: function() {
            
          // set element
          $scope.$input = $('#ngm-budget-recieved-date').pickadate({
            selectMonths: true,
            selectYears: 15,
            max: new Date(),
            format: 'dd mmm, yyyy',
            onStart: function(){
              
              $timeout(function(){
                
                // set time
                $scope.project.startPicker.set('select', $scope.project.project_budget_date_recieved, { format: 'yyyy-mm-dd' } );

              }, 10)
            },          
            onSet: function( event ){
              
              // close on date select
              if( event.select ){
                
                // get date
                var selectedDate = moment( event.select );

                // set date
                $scope.project.project_budget_date_recieved = moment( selectedDate ).format( 'YYYY-MM-DD' );
                
                // close
                $scope.project.startPicker.close();

              }

            }

          });        

          //pickadate api
          $scope.project.startPicker = $scope.$input.pickadate( 'picker' );

          // on click
          $( '#ngm-budget-recieved-date' ).bind( 'click', function( $e ) {
            // open
            $scope.project.startPicker.open();
          });

        }

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // init start date
          $scope.project.setBudgetTime();

        }, 1000 );

      });
  }

]);
