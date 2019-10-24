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
		'ngmClusterFinancial',
    'config',
    '$translate',
		function ($scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmClusterFinancial, config,$translate ){

      // project

			//budget_funds
			$scope.ngmClusterFinancial = ngmClusterFinancial;
      if($scope.config.project.admin0pcode === 'COL'){
        financial_html = 'financials-COL.html';
        budget_funds= [ { budget_funds_id: 'received', budget_funds_name: $filter('translate')('received') },{ budget_funds_id: 'excecuted', budget_funds_name: $filter('translate')('excecuted') } ];

      }else{
				// financial_html = 'financials.html';
				financial_html = 'financial-reform.html';
         budget_funds= [ { budget_funds_id: 'financial', budget_funds_name: $filter('translate')('financial') }, { budget_funds_id: 'inkind',budget_funds_name: $filter('translate')('inkind') } ];

			}
			$scope.detailFinancial = [];
			$scope.detailFinancial = config.project.project_budget_progress.length ?
			new Array(config.project.project_budget_progress.length).fill(false) : new Array(0).fill(false);
			if (config.project.project_budget_progress.length) {
				$scope.detailFinancial[0] = true;
			}
			// })

 
      

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

          //for Colombia
           target_locations_departamentos : [... new Set(config.project.target_locations.map(data => data.admin1name))],
           target_locations_departamentos2:  config.project.target_locations,
         target_locations_municipios:  [... new Set(config.project.target_locations.map(data => data.admin2name))],
         target_locations_municipios2: config.project.target_locations,


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

				cancelEdit: function ($index) {
					if (!$scope.project.definition.project_budget_progress[$index].id) {
						$scope.project.definition.project_budget_progress.splice($index, 1);
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

        //Select Departamento FOR COLOMBIA

        departamento: function( $data, $budget ) {

          var selected = [];
          $budget.admin1name = $data;


           if( $budget.admin1name ) {

              if($budget.admin1name == 'All' || $budget.admin1name == 'Todos'){

             
               $budget.admin1name = $filter('translate')('all_min1');
              $budget.admin1pcode = $filter('translate')('all_min1');
              $budget.admin1lat = 4.3200072;
              $budget.admin1lng = -74.1519811;

                // console.log(antes, "ANTES");
                 $scope.project.lists.target_locations_municipios =  [... new Set($scope.project.lists.target_locations_municipios2.map(data => data.admin2name))];
                  $scope.project.lists.target_locations_municipios.unshift($filter('translate')('all_min1'))

                 

               return $budget ? $budget.admin1name : $filter('translate')('no_selection')+'!';



             }else{

                 selected = $filter('filter')( $scope.project.lists.target_locations_departamentos2,  {admin1name: $budget.admin1name}, true);

                 if( selected.length ) {


                      $budget.admin1name = selected[0].admin1name;
                      $budget.admin1pcode = selected[0].admin1pcode;
                      $budget.admin1lat = selected[0].admin1lat;
                      $budget.admin1lng = selected[0].admin1lng;

                     var antes = $filter('filter')($scope.project.lists.target_locations_municipios2,{admin1name:$budget.admin1name},true);

                      $scope.project.lists.target_locations_municipios = [... new Set(antes.map(data => data.admin2name))];

                      $scope.project.lists.target_locations_municipios.unshift($filter('translate')('all_min1'))

                }          

                return selected.length ? selected[0].admin1name : $filter('translate')('no_selection')+'!';


             }
         }


         
        },

        //select municipio FOR COLOMBIA

        municipio: function( $data, $budget ) {


          var selected = [];
          $budget.admin2name = $data;

          if( $budget.admin2name ) {

            if($budget.admin2name == 'All' || $budget.admin2name == 'Todos'){

               $budget.admin2name = $filter('translate')('all_min1');
              $budget.admin2pcode = $filter('translate')('all_min1');
              $budget.admin2lat = $budget.admin1lat;
              $budget.admin2lng = $budget.admin1lng;

              return $budget ? $budget.admin2name : $filter('translate')('no_selection')+'!';

            }else{

              selected = $filter('filter')( $scope.project.lists.target_locations_municipios2,  {admin2name: $budget.admin2name} , true);
         
            if( selected.length ) {

              $budget.admin2name = selected[0].admin2name;
              $budget.admin2pcode = selected[0].admin2pcode;
              $budget.admin2lat = selected[0].admin2lat;
              $budget.admin2lng = selected[0].admin2lng;


            }
            return selected.length ? selected[0].admin2name : $filter('translate')('no_selection')+'!';


           }

           
          }


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
          if($scope.project.definition.admin0pcode == 'COL'){
           
          }
          else{
            if( !$budget.reported_on_fts_id ){
            
              $budget.budget_funds_id = 'financial';
              $budget.budget_funds_name = $filter('translate')('financial');
              }

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
				showProgrammingField:function(budget){
					if (budget.budget_funds_id === 'financial'){
						return true;
					}
					return false;
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
				showMultiYearFundingField:function(budget){
					if(budget.multi_year_funding_id === 'yes'){
						var start_year = moment($scope.project.definition.project_start_date).year();
						end_year = moment($scope.project.definition.project_end_date).year();
						if (!budget.multi_year_array || budget.multi_year_array.length<1){
							budget.multi_year_array =[];
							if (end_year % start_year > 0) {
								for (let index = start_year; index <= end_year; index++) {							
									budget.multi_year_array.push({ year: index, budget: 0 })
								}
							} else {
								budget.multi_year_array.push(end_year)
							}
						}
						return true;
					}else{
						return false;
					}

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
				showFtsIdLabelField: function (budget) {
					if (budget.reported_on_fts_id === 'yes') {
						return true;
					}
					return false;
					
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
						delete b.multi_year_array;
            $scope.inserted = angular.merge( b, $scope.inserted );
          }

          // push
					$scope.project.definition.project_budget_progress.push( $scope.inserted );
					$scope.detailFinancial[$scope.project.definition.project_budget_progress.length-1] = true;
        },

        // remove notification
        removeBudgetModal: function( $index ) {
          $scope.project.budgetIndex = $index;
          // open confirmation modal
          // $( '#budget-modal' ).openModal({ dismissible: false });
          $('#budget-modal').modal({ dismissible: false });
          $('#budget-modal').modal('open');
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
            // Materialize.toast( $filter('translate')('project_budget_item_removed')+'!', 3000, 'success');
            M.toast({ html: $filter('translate')('project_budget_item_removed') + '!', displayLength: 3000, classes: 'success' });
          }).error(function( err ) {
            // update
            // Materialize.toast( 'Error!', 6000, 'error' );
            M.toast({ html: 'Error', displayLength: 6000, classes: 'error' });
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
            // Materialize.toast( $filter('translate')('project_budget_item_added')+'!', 3000, 'success');
            M.toast({ html: $filter('translate')('project_budget_item_added') + '!', displayLength: 3000, classes: 'success' });
          });          
				},
				
				openCloseDetailFinancial: function ($index) {
					$scope.detailFinancial[$index] = !$scope.detailFinancial[$index];
				},
				validateFinancialDetailsForm:function(){
					if(ngmClusterFinancial.validateBudgets($scope.project.definition.project_budget_progress, $scope.detailFinancial)){
						$scope.project.save()
					}
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

        //add all to departamentos and municipios COL
        $scope.project.lists.target_locations_departamentos.unshift(
          $filter('translate')('all_min1')

        );
       
        $scope.project.lists.target_locations_municipios.unshift(
          $filter('translate')('all_min1')

        );
       


      }, 0 );

  }

]);

