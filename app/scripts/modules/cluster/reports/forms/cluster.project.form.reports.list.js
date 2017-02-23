/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportsListCtrl
 * @description
 * # ClusterProjectFormReportsListCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.reports.list', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.reports.list', {
        title: 'Cluster Reports List',
        description: 'Cluster Reports List',
        controller: 'ClusterProjectFormReportsListCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/reports.list/form.html'
      });
  })
  .controller( 'ClusterProjectFormReportsListCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, ngmClusterHelper, config){

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // budget
        budget: {
          project_budget_amount_recieved: 0,
          project_budget_date_recieved: moment().format('YYYY-MM-DD')
        },

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // budget
        budgetUrl: '/scripts/modules/cluster/views/forms/reports.list/budget.html',

        // set budget date on datepicker close
        datepicker: {
          minDate: moment( config.project.project_start_date ).format('YYYY-MM-DD'),
          maxDate: moment().format('YYYY-MM-DD'),
          onClose: function() {
            // format date on selection
            $scope.project.budget.project_budget_date_recieved = 
                moment( new Date( $scope.project.budget.project_budget_date_recieved ) ).format('YYYY-MM-DD');
          }
        },

        // project donor
        showDonor: function($data, $budget){
          var selected = [];
          $budget.project_donor_id = $data;
          if($budget.project_donor_id) {
            selected = $filter('filter')( $scope.project.definition.project_donor, { project_donor_id: $budget.project_donor_id });
            $budget.project_donor_name = selected[0].project_donor_name;
          }
          return selected.length ? selected[0].project_donor_name : 'No Selection!';
        },

        // add budget
        addBudget: function( $parent ) {
          // process + clean location
          $scope.inserted = 
              ngmClusterHelper.getCleanBudget( ngmUser.get(), $scope.project.definition, $scope.project.budget );
          $scope.project.definition.project_budget_progress.push( $scope.inserted );
        },

        // save budget
        save: function(){

        },

        // save project
        saveBudgetLine: function() {

          // get clean budget
          var budget = 
              ngmClusterHelper.getCleanBudget( ngmUser.get(), $scope.project.definition, $scope.project.budget );

          // if no progress reporting exists
          if ( !$scope.project.definition.project_budget_progress ) {
            $scope.project.definition.project_budget_progress = []
          }
  
          // extend targets with projectn ngmData details & push
          $scope.project.definition.project_budget_progress.unshift( budget );

          // Update Project (as project_budget_progress is an association)
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){

            // reset form
            $scope.project.budget.project_budget_amount_recieved = 0;            
            
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
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            
            // on success
            Materialize.toast( 'Project Budget Progress Updated!', 3000, 'success');

          });

        }

      }
  }

]);
