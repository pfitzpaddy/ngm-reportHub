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

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 100);
        },

        // save form on enter
        keydownSaveForm: function(){
          setTimeout(function(){
            $('#ngm-project-budget_progress').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // save project
        saveBudgetLine: function() {

          // if no progress reporting exists
          if ( !$scope.project.definition.project_budget_progress ) {
            $scope.project.definition.project_budget_progress = [];
          }

          // push latest
          $scope.project.definition.project_budget_progress.push( $scope.project.budget );

          // get clean budget
          $scope.project.definition.project_budget_progress = 
              ngmClusterHelper.getCleanBudget( ngmUser.get(), $scope.project.definition, $scope.project.definition.project_budget_progress );
  
          // extend targets with projectn ngmData details & push
          // $scope.project.definition.project_budget_progress.unshift( budget );

          // Update Project (as project_budget_progress is an association)
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            // reset form
            // $scope.project.budget.activity_type_id = '';
            $scope.project.budget.project_budget_amount_recieved = 0;
            $scope.project.budget.project_budget_date_recieved = moment().format('YYYY-MM-DD');       
            // on success
            Materialize.toast( 'Project Budget Progress Added!', 3000, 'success');
          });

        },

        // set
        setDonor: function(){
          angular.forEach( $scope.project.definition.project_donor, function( d, i ){
            if ( d.project_donor_id === $scope.project.budget.project_donor_id  ) {
              $scope.project.budget.project_donor_name = d.project_donor_name;
            } 
          });
        },

        // set
        setActivity: function(){
          angular.forEach( $scope.project.definition.activity_type, function( d, i ){
            if ( d.activity_type_id === $scope.project.budget.activity_type_id  ) {
              $scope.project.budget.activity_type_name = d.activity_type_name;
            } 
          });
        },

        // remove notification
        removeBudgetModal: function( $index ) {
          $scope.project.budgetIndex = $index;
          // open confirmation modal
          $( '#budget-modal' ).openModal({ dismissible: false });
        },

        // remove budget item
        removeBudgetItem: function() {
          // remove from
          $scope.project.definition.project_budget_progress.splice( $scope.project.budgetIndex, 1 );
          // Update 
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).success( function( project ){
            // on success
            Materialize.toast( 'Project Budget Progress Updated!', 3000, 'success');
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });
        }
        
      }

      // if one donor
      $timeout(function(){
        // keydown of enter to save budget item
        $scope.project.keydownSaveForm();
        // default donor
        if($scope.project.definition.project_donor.length===1){
          $scope.project.budget.project_donor_id = $scope.project.definition.project_donor[0].project_donor_id
          $scope.project.budget.project_donor_name = $scope.project.definition.project_donor[0].project_donor_name
        }
      }, 0 );

  }

]);
