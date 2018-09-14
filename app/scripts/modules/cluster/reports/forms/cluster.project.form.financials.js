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
    'ngmAuth',
    'ngmData',
    'ngmClusterHelper',
    'ngmClusterLists',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, config ){

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
          budget_funds: [ { budget_funds_id: 'financial', budget_funds_name: 'Financial' }, { budget_funds_id: 'inkind',budget_funds_name: 'InKind' } ],
          financial_programming: [{ 
            financial_programming_id: 'non_cash', financial_programming_name: 'Non-Cash' 
          },{ 
            financial_programming_id: 'restricted_cash', financial_programming_name: 'Restricted Cash' 
          },{ 
            financial_programming_id: 'unrestricted_cash', financial_programming_name: 'Unrestricted Cash' 
          }],
          multi_year_funding: [ { multi_year_funding_id: 'yes', multi_year_funding_name: 'Yes' }, { multi_year_funding_id: 'no', multi_year_funding_name: 'No' } ],
          activity_type: angular.copy( config.project.activity_type ),
          currencies: ngmClusterLists.getCurrencies( config.project.admin0pcode )
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

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
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

        // show in fts
        showFunds: function( $data, $budget ) {
          var selected = [];
          $budget.budget_funds_id = $data;

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.budget_funds_id = 'financial';
            $budget.budget_funds_name = 'Financial';
          }

          // selection
          if( $budget.budget_funds_id ) {
            selected = $filter('filter')( $scope.project.lists.budget_funds, { budget_funds_id: $budget.budget_funds_id }, true);
            if( selected.length ) {
              $budget.budget_funds_id = selected[0].budget_funds_id;
              $budget.budget_funds_name = selected[0].budget_funds_name;
            }
          } 
          return selected.length ? selected[0].budget_funds_name : 'N/A';
        },

        // show fts Id label
        showProgrammingLabel: function(){
          // budget progress
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.budget_funds_id === 'financial') {
              show = true;
            }
          });
          return show;
        },

        // show in fts
        showProgramming: function( $data, $budget ) {
          var selected = [];
          $budget.financial_programming_id = $data;

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.financial_programming_id = 'non_cash';
            $budget.financial_programming_name = 'Non-Cash';
          }

          // selection
          if( $budget.financial_programming_id ) {
            selected = $filter('filter')( $scope.project.lists.financial_programming, { financial_programming_id: $budget.financial_programming_id }, true);
            if( selected.length ) {
              $budget.financial_programming_id = selected[0].financial_programming_id;
              $budget.financial_programming_name = selected[0].financial_programming_name;
            }
          } 
          return selected.length ? selected[0].financial_programming_name : 'N/A';
        },

        // funding 2017
        showFunding2017: function(){
          var show = false;
          angular.forEach( $scope.project.definition.project_budget_progress, function( d, i ){
            if ( d.multi_year_funding_id === 'yes') {
              show = true;
            }
          });
          return show;
        },

        // show in fts
        showMultiYear: function( $data, $budget ) {
          var selected = [];
          $budget.multi_year_funding_id = $data;

          // default
          if( !$budget.multi_year_funding_id ){
            $budget.multi_year_funding_id = 'no';
            $budget.multi_year_funding_name = 'No';
          }

          // selection
          if( $budget.multi_year_funding_id ) {
            selected = $filter('filter')( $scope.project.lists.multi_year_funding, { multi_year_funding_id: $budget.multi_year_funding_id }, true);
            if( selected.length ) {
              $budget.multi_year_funding_id = selected[0].multi_year_funding_id;
              $budget.multi_year_funding_name = selected[0].multi_year_funding_name;
            }
          } 

          // multi-year set 
          if ( $budget.multi_year_funding_id === 'no' ) {
            $budget.funding_2017 = $budget.project_budget;
          }

          return selected.length ? selected[0].multi_year_funding_name : 'N/A';
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
        // add beneficiary
        addBudgetItem: function() {
          
          // inserted
          $scope.inserted = {
            project_budget_amount_recieved: 0,
            project_budget_date_recieved: moment().format('YYYY-MM-DD'),
            comments: ''
          };

          // default donor
          if( $scope.project.definition.project_donor.length===1 ){
            $scope.inserted.project_donor_id = $scope.project.definition.project_donor[0].project_donor_id;
            $scope.inserted.project_donor_name = $scope.project.definition.project_donor[0].project_donor_name;
          }

          // clone
          var length = $scope.project.definition.project_budget_progress.length;
          if ( length ) {
            var b = angular.copy( $scope.project.definition.project_budget_progress[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( b, $scope.inserted );
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
            url: ngmAuth.LOCATION + '/api/cluster/project/removeBudgetItem',
            data: {
              id: id
            }
          }).success( function( project ){
            // on success
            Materialize.toast( 'Project Budget Item Removed!', 3000, 'success');
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });
        },

        save: function(){
          // Update Project
          ngmData.get({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
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

