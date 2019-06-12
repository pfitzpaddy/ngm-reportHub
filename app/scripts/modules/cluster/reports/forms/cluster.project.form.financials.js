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
    '$translate',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, config,$translate ){

      // project

      //budget_funds

      if($scope.config.project.admin0pcode === 'COL'){
        financial_html = 'financials-COL.html';
        budget_funds= [ { budget_funds_id: 'cash', budget_funds_name: $filter('translate')('cash') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') },{ budget_funds_id: 'bonuses',budget_funds_name: $filter('translate')('bonuses') } ];

      }else{
        financial_html = 'financials.html';
         budget_funds= [ { budget_funds_id: 'financial', budget_funds_name: $filter('translate')('financial') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') } ];

      }

      

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

        //financialsUrl: 'financials.html',
        financialsUrl: financial_html,

        notesUrl: 'notes.html',

        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),

        // placeholder bydget activity
        lists: {
          reported_on_fts: [ { reported_on_fts_id: 'yes', reported_on_fts_name: $filter('translate')('yes') }, { reported_on_fts_id: 'no', reported_on_fts_name: 'No' } ],
          //budget_funds: [ { budget_funds_id: 'financial', budget_funds_name: $filter('translate')('financial') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') } ],
          budget_funds: budget_funds,
          financial_programming: [{ 
            financial_programming_id: 'non_cash', financial_programming_name: $filter('translate')('non_cash')
          },{ 
            financial_programming_id: 'restricted_cash', financial_programming_name: $filter('translate')('restricted_cash') 
          },{ 
            financial_programming_id: 'unrestricted_cash', financial_programming_name: $filter('translate')('unrestricted_cash')
          }],
          multi_year_funding: [ { multi_year_funding_id: 'yes', multi_year_funding_name: $filter('translate')('yes') }, { multi_year_funding_id: 'no', multi_year_funding_name: 'No' } ],
          activity_type: angular.copy( config.project.activity_type ),
          currencies: ngmClusterLists.getCurrencies( config.project.admin0pcode ),
          activity_descriptions: angular.copy( config.project.target_beneficiaries),
          activity_descriptions2: [],

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
          return selected.length ? selected[0].project_donor_name : $filter('translate')('no_selection')+'!';
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

            $scope.project.lists.activity_descriptions2 = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_type_id: $budget.activity_type_id }, true);
            
          } 
          return selected.length ? selected[0].activity_type_name : $filter('translate')('no_selection')+'!';
        },

        //activitydesciption
        showActivityDescription: function( $data, $budget ) {
          
          var selected = [];
          $budget.activity_description_id = $data;

          if( $budget.activity_description_id ) {

            selected = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_description_id: $budget.activity_description_id }, true);
            if( selected.length ) {
              
              $budget.activity_description_name = selected[0].activity_description_name;
            }
            
          } 


          return selected.length ? selected[0].activity_description_name : $filter('translate')('no_selection')+'!';
        },

      showAdmin: function( project, lists, admin0pcode, pcode, $index, $data, target_location ){
          console.log($scope.project.definition);
        angular.forEach( $scope.project.definition.target_locations, function( d, i ){
             console.log(d);

          });
         


          /*  $http({ method: 'GET', 
                    url: ngmAuth.LOCATION + '/api/list/getAdminSites?admin0pcode=' 
                                            + admin0pcode
                                            + '&admin1pcode=' + target_location.admin1pcode
            }).success( function( result ) {
              var selected_sites = $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode }, true );
              if ( !selected_sites.length ){
                lists.adminSites = lists.adminSites.concat( result );
                ngmClusterLocations.adminOnChange( lists, pcode, $index, $data, target_location );
              }
            });*/

          


        /*// params
        var selected = [];

        // selection list
        if( target_location[ parent_pcode ] ) {
          
          // filter parent list
          var search_parent_admin = {}
          search_parent_admin[ parent_pcode ] = target_location[ parent_pcode ];
          lists[ list + 'Select' ][ $index ] = $filter('filter')( lists[ list ], search_parent_admin, true );

          // other (for ET lists)
          var o_index, o_other;
          angular.forEach( lists[ list + 'Select' ][ $index ], function( d, i ) {
            if ( d.admin3name === 'Other' ) { o_index = i; o_other = d; }
          });
          if ( o_other ) {
            lists[ list + 'Select' ][ $index ].splice( o_index, 1 );
            lists[ list + 'Select' ][ $index ].push( o_other );
          }

        } 

        // list selection
        target_location[ pcode ] = $data;
        if( target_location[ pcode ] ) {

          // filter
          var search_admin = {}
          search_admin[ pcode ] = target_location[ pcode ];

          // get selection
          selected = $filter( 'filter')( lists[ list + 'Select' ][ $index ], search_admin, true );
          if ( selected && selected[0] && selected[0].id ) { 
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }

          // filter sites
          lists.adminSitesSelect[ $index ] = $filter('filter')( lists.adminSites, search_admin, true );
 
        }

        // return name
        return selected && selected.length ? selected[0][ name ] : '-';*/
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
          return selected.length ? selected[0].currency_name : $filter('translate')('no_selection')+'!';
        },

        // show in fts
        showFunds: function( $data, $budget ) {
          var selected = [];
          $budget.budget_funds_id = $data; 

          // default
          if( !$budget.reported_on_fts_id ){
            $budget.budget_funds_id = 'financial';
            $budget.budget_funds_name = $filter('translate')('financial');
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
            $budget.financial_programming_name = $filter('translate')('non_cash');
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
				
				//multi year funding
				showMultiYearFunding:function(){
					var show = false;
					$scope.multiYearRange=[];
					angular.forEach($scope.project.definition.project_budget_progress, function (d, i) {
						if (d.multi_year_funding_id === 'yes') {
              show = true;
            }
          });

					// to set range multi year
					if(show){
						var start_year = moment($scope.project.definition.project_start_date).year(); 
								end_year   = moment($scope.project.definition.project_end_date).year();
						if(end_year % start_year > 0){
							for (let index = start_year; index <= end_year; index++) {
								$scope.multiYearRange.push(index)								
							}
						}else{
							$scope.multiYearRange.push(end_year)
						}
					};
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
						delete $budget.funding_year ;
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
            Materialize.toast( $filter('translate')('project_budget_item_removed')+'!', 3000, 'success');
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
            Materialize.toast( $filter('translate')('project_budget_item_added')+'!', 3000, 'success');
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
          activity_type_name: $filter('translate')('all_activities')
        });

      }, 0 );

  }

]);

