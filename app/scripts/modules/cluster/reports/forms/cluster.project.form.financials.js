/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.financials', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.financials', {
        title: 'Cluster Financial Form',
        description: 'Cluster Financial Form',
        controller: 'ClusterProjectFormFinancialCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/financials/form.html'
      });
  })
  .controller( 'ClusterProjectFormFinancialCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config ){

      // project
      $scope.project = {
        
        // user
        user: ngmUser.get(),
        
        // app style
        style: config.style,
        
        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
                
        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/financials/',
        financialsUrl: 'financials.html',
        notesUrl: 'notes.html',

        // placeholder bydget activity
        lists: {
          reported_on_fts: [ { reported_on_fts_id: 'yes', reported_on_fts_name: 'Yes' }, { reported_on_fts_id: 'no', reported_on_fts_name: 'No' } ],
          activity_type: angular.copy( config.project.activity_type ),
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode )
        },

        // datepicker
        datepicker: {
          maxDate: moment().format('YYYY-MM-DD'),
          onClose: function( $budget ) {
            // format date on selection
            $budget.project_budget_date_recieved = 
                moment( new Date( $budget.project_budget_date_recieved ) ).format('YYYY-MM-DD');
          }
        },

        // donor
        showDonor: function( $data, $budget ) {
          var selected = [];
          $budget.project_donor_id = $data;
          if( $budget.project_donor_id ) {
            selected = $filter('filter')( $scope.project.definition.project_donor, { project_donor_id: $budget.project_donor_id }, true);
            if( selected.length ) {
              $budget.project_donor_name = selected[0].project_donor_name;
            }
          } 
          return selected.length ? selected[0].project_donor_name : 'No Selection!';
        },

        // activity
        showActivity: function( $data, $budget ) {
          var selected = [];
          $budget.activity_type_id = $data;
          if( $budget.activity_type_id ) {
            selected = $filter('filter')( $scope.project.lists.activity_type, { activity_type_id: $budget.activity_type_id }, true);
            if( selected.length ) {
              $budget.cluster = selected[0].cluster;
              $budget.cluster_id = selected[0].cluster_id;
              $budget.activity_type_name = selected[0].activity_type_name;
            }
          } 
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // currency
        showCurrency: function( $data, $budget ) {
          var selected = [];
          $budget.currency_id = $data;
          if( $budget.currency_id ) {
            selected = $filter('filter')( $scope.project.lists.currencies, { currency_id: $budget.currency_id }, true);
            if( selected.length ) {
              $budget.currency_name = selected[0].currency_name;
            }
          } 
          return selected.length ? selected[0].currency_name : 'No Selection!';
        },

        // show fts Id label
        showFtsIdLabel: function(){
          // budget progress
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.reported_on_fts_id === 'yes') {
              show = true;
            }
          });
          return show;
        },

        // show in fts
        showOnFts: function( $data, $budget ) {
          var selected = [];
          $budget.reported_on_fts_id = $data;

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.reported_on_fts_id = 'no';
            $budget.reported_on_fts_name = 'No';
          }

          // selection
          if( $budget.reported_on_fts_id ) {
            selected = $filter('filter')( $scope.project.lists.reported_on_fts, { reported_on_fts_id: $budget.reported_on_fts_id }, true);
            if( selected.length ) {
              $budget.reported_on_fts_id = selected[0].reported_on_fts_id;
              $budget.reported_on_fts_name = selected[0].reported_on_fts_name;
            }
          } 
          return selected.length ? selected[0].reported_on_fts_name : 'N/A';
        },

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
        },

        // add beneficiary
        addBudgetItem: function() {
          
          // inserted
          $scope.inserted = {
            project_budget_date_recieved: moment().format('YYYY-MM-DD')
          };

          // default donor
          if( $scope.project.definition.project_donor.length===1 ){
            $scope.project.budget.project_donor_id = $scope.project.definition.project_donor[0].project_donor_id;
            $scope.project.budget.project_donor_name = $scope.project.definition.project_donor[0].project_donor_name;
          }

          // clone
          var length = $scope.project.definition.project_budget_progress.length;
          if ( length ) {
            var b = angular.copy( $scope.project.definition.project_budget_progress[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( $scope.inserted, b );
            $scope.inserted.project_budget_amount_recieved = 0;
          }

          // merge
          $scope.inserted = 
              ngmClusterHelper.getCleanBudget( ngmUser.get(), $scope.project.definition, $scope.inserted );

          // push
          $scope.project.definition.project_budget_progress.push( $scope.inserted );
        },

        // remove notification
        removeBudgetModal: function( $index ) {
          $scope.project.budgetIndex = $index;
          // open confirmation modal
          $( '#budget-modal' ).openModal({ dismissible: false });
        },

        // remove budget item
        removeBudgetItem: function() {
          // id
          var id = $scope.project.definition.project_budget_progress[ $scope.project.budgetIndex ].id;
          // splice
          $scope.project.definition.project_budget_progress.splice( $scope.project.budgetIndex, 1 );
          // remove 
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/removeBudgetItem',
            data: {
              id: id
            }
          }).success( function( project ){
            // on success
            Materialize.toast( 'Project Budget Progress Removed!', 3000, 'success');
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });
        },

        save: function(){
          // Update Project
          ngmData.get({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).then( function( project ){
            
            // set project definition
            $scope.project.definition = project;

            // on success
            Materialize.toast( 'Project Budget Item Added!', 3000, 'success');
          });          
        }

      }

      // if one donor
      $timeout(function(){

        // add ALL to activity_type
        $scope.project.lists.activity_type.unshift({
          cluster_id: $scope.project.definition.cluster_id,
          cluster: $scope.project.definition.cluster,
          activity_type_id: 'all',
          activity_type_name: 'All Activities'
        });

      }, 0 );

  }

]);

