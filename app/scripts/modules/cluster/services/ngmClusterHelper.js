/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelper', [ '$location', '$q', '$http', '$filter', '$timeout', function( $location, $q, $http, $filter, $timeout ) {

		return {
			
			// update material_select
			updateSelect: function(){
        $timeout(function(){ $( 'select' ).material_select(); }, 0 );
			},

      // get a new project
      getNewProject: function( user ) {

        // create empty project
        var project = {
          project_status: 'new',
          project_title: 'New Project',
          project_description: 'Complete the project details to register a new project',
          project_start_date: moment().format('YYYY-MM-DD'),
          project_end_date: moment().add( 6, 'M' ).format('YYYY-MM-DD'),
          target_beneficiaries: [],
          beneficiary_type: [],
          target_locations: []
        }

        // extend defaults with ngmUser details
        project = angular.merge( {}, user, project );
        
        // remove id of ngmUser to avoid conflict with new project
        delete project.id;

        // return
        return project;

      },

      // get lists for cluster reporting
      setClusterLists: function() {
      
        // requests
        var requests = {

          // province lists
          getAdmin1List: {
            method: 'GET',
            url: 'http://' + $location.host() + '/api/location/getAdmin1List'
          },

          // district lists
          getAdmin2List: {
            method: 'GET',
            url: 'http://' + $location.host() + '/api/location/getAdmin2List'
          },

          // activities list
          getActivities: {
            method: 'GET',
            url: 'http://' + $location.host() + '/api/cluster/getActivities'
          },

          // indicators list
          getIndicators: {
            method: 'GET',
            url: 'http://' + $location.host() + '/api/cluster/getIndicators'
          }          

        }

        // get all lists 
        if ( !localStorage.getObject( 'lists' ) ) {

          // admin1, admin2, activities holders
          var lists = {
            admin1List: [],
            admin2List: [],
            activitiesList: [],
            indicatorsList: []
          };

          // storage
          localStorage.setObject( 'lists', lists );          

          // send request
          $q.all([ 
            $http( requests.getAdmin1List ),
            $http( requests.getAdmin2List ),
            $http( requests.getActivities ), 
            $http( requests.getIndicators ) ] ).then( function( results ){

              // admin1, admin2, activities object
              var lists = {
                admin1List: results[0].data,
                admin2List: results[1].data,
                activitiesList: results[2].data,
                indicatorsList: results[3].data
              };

              // storage
              localStorage.setObject( 'lists', lists );

            });
        }

      },    

      getStocks: function( cluster_id, list ) {

        // stock list
        var stocks = [{
          cluster: [ 'health' ],
          stock_item_type: 'health_ddk_kit',
          stock_item_name: 'Health: DDK Kit'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_iehk_basic_unit',
          stock_item_name: 'Health: IEHK Basic Unit'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_iehk_supplementary_unit',
          stock_item_name: 'Health: IEHK Supplementary Unit'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_new_born_kit',
          stock_item_name: 'Health: New Born Kit'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_pneumonia_kit',
          stock_item_name: 'Health: Pneumonia Kit'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_trauma_kit_a',
          stock_item_name: 'Health: Trauma Kit A'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'health_trauma_kit_b',
          stock_item_name: 'Health: Trauma Kit B'
        },{
          cluster: [ 'health' ],
          stock_item_type: 'miscellaneous',
          stock_item_name: 'Miscellaneous'
        }];

        // filter by cluster beneficiaries here
        stocks = $filter( 'filter' )( stocks, { cluster: cluster_id } );

        // for each beneficiaries from list
        angular.forEach( list, function( d, i ){
          // filter out selected types
          stocks = 
              $filter( 'filter' )( stocks, { stock_item_type: '!' + d.stock_item_type } );
        });

        // sort and return
        return $filter( 'orderBy' )( stocks, 'stock_item_name' );

      },

      // monthly report indicators
      getIndicators: function( target ) {

        // if project target, return subset
        if ( target ) {
          var indicators = {
            households: 0,
            families: 0,
            boys: 0,
            girls: 0,
            men: 0,
            women: 0,
            elderly_men: 0,
            elderly_women: 0
          }
        } else {

          // get indicatorsList
          var indicators = localStorage.getObject( 'lists' ).indicatorsList;

        }

        // reutrn
        return indicators;

      },

      // return activity type by cluster
      getActivities: function( cluster_id, unique ){

        // get activities list from storage
        var activities = localStorage.getObject( 'lists' ).activitiesList;

        // filter by cluster
        activities = $filter( 'filter' )( activities, { cluster_id: cluster_id } );

        // if unique
        if ( unique ) {
          activities = this.filterDuplicates( activities, 'activity_type_id' )
        }

        // return 
        return activities;

      },     

			// get cluster donors
			getDonors: function() {
				return [{
          project_donor_id: 'dfid',
          project_donor_name: 'DFID'
        },{
          project_donor_id: 'chf',
          project_donor_name: 'CHF'
        },{
          project_donor_id: 'echo',
          project_donor_name: 'ECHO'
        },{
          project_donor_id: 'global_fund',
          project_donor_name: 'Global Fund'
        },{
          project_donor_id: 'icrc',
          project_donor_name: 'ICRC'
        },{
          project_donor_id: 'ifrc',
          project_donor_name: 'IFRC'
        },{
          project_donor_id: 'qatar_red_crescent',
          project_donor_name: 'Qatar Red Crescent'
        },{
          project_donor_id: 'usaid',
          project_donor_name: 'USAID'
        },{
          project_donor_id: 'unicef',
          project_donor_name: 'UNICEF'
        },{
          project_donor_id: 'who',
          project_donor_name: 'WHO'
        }]
			},

			// country currencies
			getCurrencies: function( admin0pcode ) {
				var currencies = [{
          // default is USD
          admin0pcode: admin0pcode,
          currency_id: 'usd',
          currency_name: 'USD'
        },{
          admin0pcode: 'AF',
          currency_id: 'afn',
          currency_name: 'AFN'
        },{
          admin0pcode: 'ET',
          currency_id: 'etb',
          currency_name: 'ETB'
        },{
          admin0pcode: 'IQ',
          currency_id: 'iqd',
          currency_name: 'IQD'
        },{
          admin0pcode: 'KE',
          currency_id: 'kes',
          currency_name: 'KES'
        },{
          admin0pcode: 'SO',
          currency_id: 'sos',
          currency_name: 'SOS'
        }];

        // filter currency options list by admin0pcode
        return $filter( 'filter' )( currencies, { admin0pcode: admin0pcode } );

			},

      // get HRP 2017 category
      getCategoryTypes: function( cluster_id ){

        // full list
        // cluster_id: [ 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],

        var category_types = [{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: 'category_a',
          category_type_name: 'A) Emergency Relief Needs'
        },{
          cluster_id: [ 'health', 'nutrition', 'protection', 'wash' ],
          category_type_id: 'category_b',
          category_type_name: 'B) Excess Morbidity and Mortality'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'nutrition', 'protection' ],
          category_type_id: 'category_c',
          category_type_name: 'C) Shock-Induced Acute Vunerability'
        }];

        // filter by cluster category_types here
        return $filter( 'filter' )( category_types, { cluster_id: cluster_id } );

      },

      // return ocha beneficiaries
      getBeneficiaries2016: function( cluster_id, list ) {

        // ocha beneficiaries list
        var beneficiaries = [{
          cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
          beneficiary_type_id: 'conflict_displaced',
          beneficiary_type_name: 'Conflict IDPs'
        },{
          cluster_id: [ 'esnfi', 'health', 'wash' ],
          beneficiary_type_id: 'health_affected_conflict',
          beneficiary_type_name: 'Health Affected by Conflict'
        },{
          cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
          beneficiary_type_id: 'natural_disaster_affected',
          beneficiary_type_name: 'Natural Disaster IDPs'
        },{
          cluster_id: [ 'esnfi', 'wash', 'protection' ],
          beneficiary_type_id: 'protracted_idps',
          beneficiary_type_name: 'Protracted IDPs'
        },{
          cluster_id: [ 'esnfi', 'health', 'wash', 'protection' ],
          beneficiary_type_id: 'refugees_returnees',
          beneficiary_type_name: 'Refugees & Returnees'
        },{
          cluster_id: [ 'esnfi', 'health', 'wash' ],
          beneficiary_type_id: 'white_area_population',
          beneficiary_type_name: 'White Area Population'
        }];

        // filter by cluster beneficiaries here
        beneficiaries = $filter( 'filter' )( beneficiaries, { cluster_id: cluster_id } );

        // for each beneficiaries from list
        angular.forEach( list, function( d, i ){
          // filter out selected types
          beneficiaries = 
              $filter( 'filter' )( beneficiaries, { beneficiary_type: '!' + d.beneficiary_type } );
        });

        // sort and return
        return $filter( 'orderBy' )( beneficiaries, 'beneficiary_name' );

      },

			// return ocha beneficiaries
			getBeneficiaries: function( cluster_id ) {

        // full list
        // cluster_id: [ 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],

				// ocha beneficiaries list
				var beneficiaries = [{
          cluster_id: [ 'health', 'nutrition', 'protection', 'wash' ],
          category_type_id: [ 'category_b' ],
          beneficiary_type_id: 'access_to_services',
          beneficiary_type_name: 'Access to Services'
        },{
          cluster_id: [ 'esnfi', 'protection', 'wash' ],
          category_type_id: [ 'category_a' ],
          beneficiary_type_id: 'host_communities',
          beneficiary_type_name: 'Host Communities'
        },{
          cluster_id: [ 'health' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'white_area_population',
          beneficiary_type_name: 'White Area Population'
        },{
          cluster_id: [ 'fsac' ],
          category_type_id: [ 'category_c' ],
          beneficiary_type_id: 'severely_food_insecure',
          beneficiary_type_name: 'Severely Food Insecure'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'conflict_affected',
          beneficiary_type_name: 'Conflict Affected'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'natural_disaster_affected',
          beneficiary_type_name: 'Natural Disaster Affected'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'idp_conflict',
          beneficiary_type_name: 'Conflict IDPs'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'idp_natural_disaster',
          beneficiary_type_name: 'Natural Disaster IDPs'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'idp_protracted',
          beneficiary_type_name: 'Protracted IDPs'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: [ 'category_b', 'category_c' ],
          beneficiary_type_id: 'refugee_pakistani',
          beneficiary_type_name: 'Pakistani Refugees'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'returnee_documented',
          beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
        },{
          cluster_id: [ 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
          category_type_id: [ 'category_a', 'category_b', 'category_c' ],
          beneficiary_type_id: 'returnee_undocumented',
          beneficiary_type_name: 'Afghan Refugee Returnees (Undocumented)'
        }];


        // filter by cluster beneficiaries here
        return $filter( 'filter' )( beneficiaries, { cluster_id: cluster_id } );

        // sort and return
        // return $filter( 'orderBy' )( beneficiaries, 'beneficiary_name' );

			},

			// health facility types
			getFacilityTypes: function() {
				// health facility types
				return [{
          fac_type_id: 'RH',
          fac_type_name: 'RH'
        },{
          fac_type_id: 'PH',
          fac_type_name: 'PH'
        },{
          fac_type_id: 'DH',
          fac_type_name: 'DH'
        },{
          fac_type_id: 'CHC',
          fac_type_name: 'CHC'
        },{
          fac_type_id: 'CHC+FATP',
          fac_type_name: 'CHC + FATP'
        },{
          fac_type_id: 'BHC',
          fac_type_name: 'BHC'
        },{
          fac_type_id: 'BHC+FATP',
          fac_type_name: 'BHC + FATP'
        },{
          fac_type_id: 'FHH',
          fac_type_name: 'FHH'
        },{
          fac_type_id: 'SHC',
          fac_type_name: 'SHC'
        },{
          fac_type_id: 'MHT',
          fac_type_name: 'MHT'
        },{
          fac_type_id: 'FATP',
          fac_type_name: 'FATP'
        },{
          fac_type_id: 'DATC',
          fac_type_name: 'DATC'
        },{
          fac_type_id: 'rehabilitation_center',
          fac_type_name: 'Rehabilitation Center'
        },{
          fac_type_id: 'special_hospital',
          fac_type_name: 'Special Hospital'
        },{
          fac_type_id: 'local_committee',
          fac_type_name: 'Local Committee'
        }]
			},

      // sum beneficairies for location
      getSumBeneficiaries: function( locations ) {

        var $this = this;
        
        // sum beneficiary.sum
        angular.forEach( locations, function( l, i ){
          angular.forEach( l.beneficiaries, function( b, j ){
            // indicators
            angular.forEach( $this.getIndicators(), function( indicator, k ) {
              // sum by list ( exclude keys )
              if ( k !== 'id' && k !== 'education_sessions' && k !== 'training_sessions' && k !== 'notes' ) {
                if ( !locations[i].beneficiaries[j].sum ) {
                  locations[i].beneficiaries[j].sum = 0;
                }
                locations[i].beneficiaries[j].sum + b[ k ];
              }

            });
          });
        });

        return locations;
      },

      // update activities for an object ( update )
      updateActivities: function( project, update ){
        
        // update activity_type / activity_description
        update.project_title = project.project_title;
        update.activity_type = project.activity_type;
        update.beneficiary_type = project.beneficiary_type;
        update.activity_description = project.activity_description;

        //
        return update;
      },

      // get processed warehouse location
      getCleanWarehouseLocation: function(user, organization, warehouse){
        
        // merge
        var warehouse = angular.merge({}, warehouse, warehouse.admin2, warehouse.fac_type);

        // delete
        delete warehouse.id;
        delete warehouse.admin1;
        delete warehouse.admin2;
        delete warehouse.fac_type;

        // add params
        // warehouse.warehouse_status = 'new';
        warehouse.cluster_id = organization.cluster_id;
        warehouse.cluster = organization.cluster;
        warehouse.organization = user.organization;
        warehouse.username = user.username;
        warehouse.email = user.email;

        return warehouse;
      },

      // get processed stock location
      getCleanStocks: function( report, location, stocks ){
        
        // merge
        var stock = angular.merge( {}, stocks, report, location );

        // // delete
        delete stock.id;
        delete stock.stocks;
        delete stock.stocklocations;
        
        // default stock
        stock.report_id = stock.report_id.id;
        stock.number_in_stock = 0;
        stock.number_in_pipeline = 0;
        stock.beneficiaries_covered = 0;

        return stock;
      },


      // get processed target location
      getCleanBudget: function( user, project, budget ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;

        // needs to operate on an array
        angular.forEach( budget, function( d, i ){
          // merge beneficiaries + project
          delete budget[i].project_donor;
          delete budget[i].strategic_objectives;
          delete budget[i].activity_type;
          delete budget[i].beneficiary_type;
          delete budget[i].category_type;
          delete budget[i].admin1pcode;
          delete budget[i].admin2pcode;
          budget[i] = angular.merge( {}, d, p, { username: user.username }, { email: user.email } );
          // add donor name
          budget[i].project_donor_name = 
              $filter('filter')( project.project_donor, { project_donor_id: budget[i].project_donor_id });
        });

        // return clean budget
        return budget;

      },

      // get processed target location
      getCleanTargetBeneficiaries: function( project, beneficiaries ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;

        // needs to operate on an array
        angular.forEach( beneficiaries, function( d, i ){
          // merge beneficiaries + project
          delete beneficiaries[i].project_donor;
          delete beneficiaries[i].strategic_objectives;
          delete beneficiaries[i].admin1pcode;
          delete beneficiaries[i].admin2pcode;
          beneficiaries[i] = angular.merge( {}, d, p );
          // add default
          if( project.activity_type && project.activity_type.length === 1){
            beneficiaries[i].activity_type_id = project.activity_type[0].activity_type_id;
            beneficiaries[i].activity_type_name = project.activity_type[0].activity_type_name;
          }
        });

        // return clean beneficiaries
        return beneficiaries;

      },

      // get processed target location
      getCleanTargetLocation: function( project, locations ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;
        delete p.admin1pcode;
        delete p.admin2pcode;

        // needs to operate on an array
        angular.forEach( locations, function( d, i ){
          // merge locations + project
          delete locations[i].project_donor;
          delete locations[i].strategic_objectives;
          delete locations[i].activity_type;
          delete locations[i].beneficiary_type;
          locations[i] = angular.merge( {}, d, p );
        });

        // return clean location
        return locations;

      },

      // update entire report with project details (dont ask)
      getCleanReport: function( project, report ) {
        
        // copy to p
        var p = angular.copy( project );
        var r = angular.copy( report );

        // remove duplication from merge
        delete p.id;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;

        // remove arrays to update
        delete r.activity_description;
        delete r.activity_type;
        delete r.admin1pcode;
        delete r.admin2pcode;
        delete r.beneficiary_type;
        delete r.category_type;
        delete r.project_donor;
        delete r.strategic_objectives;

        // merge 
        report = angular.merge( {}, r, p );

        // locations
        angular.forEach(report.locations, function( location, i ){

          // remove to ensure updated
          var l = angular.copy( location );
          delete r.id;
          delete r.locations;
          delete l.activity_description;
          delete l.activity_type;
          delete l.admin1pcode;
          delete l.admin2pcode;
          delete l.beneficiary_type;
          delete l.category_type;
          delete l.project_donor;
          delete l.strategic_objectives;
          // ids
          l.project_id = project.id;
          l.report_id = report.id;
          // merge
          report.locations[i] = angular.merge( {}, l, r, p );

          // locations
          angular.forEach( report.locations[i].beneficiaries, function( beneficiary, j ){
            // rm
            delete l.id;
            delete l.report_id;
            delete l.beneficiaries;
            // remove to ensure updated
            var b = angular.copy( beneficiary );
            delete b.activity_description;
            delete b.activity_type;
            delete b.admin1pcode;
            delete b.admin2pcode;
            delete b.beneficiary_type;
            delete b.category_type;
            delete b.project_donor;
            delete b.strategic_objectives;
            // ids
            b.project_id = project.id;
            b.report_id = report.id;
            // merge
            report.locations[i].beneficiaries[j] = angular.merge( {}, b, l, r, p );
            
          });

        });

        return report;

      },

			// get processed target location
			getCleanBeneficiaries: function( project, report, location, beneficiaries ){

        // remove!
        // delete beneficiaries.cluster;
        // delete indicators.cluster;

				// merge project + indicators + beneficiaries
				var beneficiaries = angular.merge( {}, project, report, location, beneficiaries );

				// set project_id
				beneficiaries.project_id = project.id;
				beneficiaries.report_id = report.id;

        // remove duplication from merge
        delete beneficiaries.id;
        delete beneficiaries.activity_type;
        delete beneficiaries.beneficiary_type;
        delete beneficiaries.project_description
        delete beneficiaries.project_budget_progress;
        delete beneficiaries.beneficiaries;
        delete beneficiaries.locations;
        delete beneficiaries.target_beneficiaries;
        delete beneficiaries.target_locations;
        delete beneficiaries.activity_description_check;
        delete beneficiaries.implementing_partners_checked;
        delete beneficiaries.project_donor_check;
        delete beneficiaries.project_budget;
        delete beneficiaries.project_budget_currency;

        // add default
        if( project.activity_type && project.activity_type.length === 1){
          beneficiaries.activity_type_id = project.activity_type[0].activity_type_id;
          beneficiaries.activity_type_name = project.activity_type[0].activity_type_name;
        }

        // return clean beneficiaries
				return beneficiaries;

			},

      // get objectives by cluster 
      getStrategicObjectives: function( cluster_id ){

        var strategic_objectives = {
          'esnfi': [{
            objective_type_id: 'esnfi_objective_1',
            objective_type_name: 'ESNFI OBJECTIVE 1',
            objective_type_description: 'Coordinated and timely ES-NFI response to families affected by natural disaster and armed conflict',
            objective_type_objectives: [ 'SO1' ]
          },{
            objective_type_id: 'esnfi_objective_2',
            objective_type_name: 'ESNFI OBJECTIVE 2',
            objective_type_description: 'Coordinated and timely ES-NFI response to returnees',
            objective_type_objectives: [ 'SO1' ]
          },{
            objective_type_id: 'esnfi_objective_3',
            objective_type_name: 'ESNFI OBJECTIVE 3',
            objective_type_description: 'Families falling into acute vulnerability due to shock are assisted with ES-NFI interventions in the medium term',
            objective_type_objectives: [ 'SO3' ]
          }],
          'health': [{
            objective_type_id: 'health_objective_1',
            objective_type_name: 'HEALTH OBJECTIVE 1',
            objective_type_description: 'Ensure access to emergency health services, effective trauma care and mass casualty management for shock affected people',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            objective_type_id: 'health_objective_2',
            objective_type_name: 'HEALTH OBJECTIVE 2',
            objective_type_description: 'Ensure access to essential basic and emergency health services for white conflict-affected areas and overburdened services due to population movements',
            objective_type_objectives: [ 'SO2', 'SO4' ]
          },{
            objective_type_id: 'health_objective_3',
            objective_type_name: 'HEALTH OBJECTIVE 3',
            objective_type_description: 'Provide immediate life saving assistance to those affected by public health outbreaks',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          }],
          'nutrition':[{
            objective_type_id: 'nutrition_objective_1',
            objective_type_name: 'NUTRITION OBJECTIVE 1',
            objective_type_description: 'Quality community and facility-based nutrition information is made available timely for programme monitoring and decision making',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            objective_type_id: 'nutrition_objective_2',
            objective_type_name: 'NUTRITION OBJECTIVE 2',
            objective_type_description: 'The incidence of acute malnutrition is reduced through Integrated Management of Acute Malnutrition among boys, girls, pregnant and lactating women',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            objective_type_id: 'nutrition_objective_3',
            objective_type_name: 'NUTRITION OBJECTIVE 3',
            objective_type_description: 'Contribute to reduction of morbidity and mortality among returnees and refugees by providing preventative nutrition programmes',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            objective_type_id: 'nutrition_objective_4',
            objective_type_name: 'NUTRITION OBJECTIVE 4',
            objective_type_description: 'Enhance capacity of partners to advocate for and respond at scale to nutrition in emergencies',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          }],
          'protection':[{
            objective_type_id: 'protection_objective_1',
            objective_type_name: 'PROTECTION OBJECTIVE 1',
            objective_type_description: 'Acute protection concerns, needs and violations stemming from the immediate impact of shocks and taking into account specific vulnerabilities are identified and addressed in a timely manner',
            objective_type_objectives: [ 'SO1', 'SO2' ]
          },{
            objective_type_id: 'protection_objective_2',
            objective_type_name: 'PROTECTION OBJECTIVE 2',
            objective_type_description: 'Evolving protection concerns, needs and violations are monitored, analysed and responded to, upholding fundamental rights and restoring the dignity and well-being of vulnerable shock affected populations',
            objective_type_objectives: [ 'SO3' ]
          },{
            objective_type_id: 'protection_objective_3',
            objective_type_name: 'PROTECTION OBJECTIVE 3',
            objective_type_description: 'Support the creation of a protection-conducive environment to prevent and mitigate protection risks, as well as facilitate an effective response to protection violation',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          }],
          'wash':[{
            objective_type_id: 'wash_objective_1',
            objective_type_name: 'WASH OBJECTIVE 1',
            objective_type_description: 'Ensure timely access to a sufficient quantity of safe drinking water, use of adequate and gender sensitive sanitation and appropriate means of hygiene practices by the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            objective_type_id: 'wash_objective_2',
            objective_type_name: 'WASH OBJECTIVE 2',
            objective_type_description: 'Ensure timely and adequate access to WASH services in institutions affected by emergencies',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            objective_type_id: 'wash_objective_3',
            objective_type_name: 'WASH OBJECTIVE 3',
            objective_type_description: 'Ensure timely and adequate access to WASH needs of the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            objective_type_id: 'wash_objective_4',
            objective_type_name: 'WASH OBJECTIVE 4',
            objective_type_description: 'Two-year transition of cluster leadership of Ministry of Rural Rehabilitation and Development set in motion',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          }],
          'project_rnr_chapter':[{
            objective_type_id: 'project_rnr_chapter_objective_1',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
            objective_type_description: 'Protection interventions provided to NWA refugees',
            objective_type_objectives: [ 'SO1' ]
          },{
            objective_type_id: 'project_rnr_chapter_objective_2',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 2',
            objective_type_description: 'Essential services delivered to returnees while pursuing durable solutions',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            objective_type_id: 'project_rnr_chapter_objective_3',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 3',
            objective_type_description: 'Immediate humanitarian needs for vulnerable refugee returnees, undocumented returnees and deportees are met',
            objective_type_objectives: [ 'SO1' ]
          }]
        }

        // return SO by cluster
        return strategic_objectives[ cluster_id ];

      },

      // remove duplicates in item ( json array ) based on value ( filterOn )
      filterDuplicates: function( items, filterOn ){

          // vars
          var hashCheck = {}, 
              newItems = [];

          // comparison fn
          var extractValueToCompare = function ( item ) {
            if ( angular.isObject( item ) && angular.isString( filterOn ) ) {
              return item[ filterOn ];
            } else {
              return item;
            }
          };          

          // filter unique
          angular.forEach( items, function ( item ) {
            var valueToCheck, isDuplicate = false;

            for ( var i = 0; i < newItems.length; i++ ) {
              if ( angular.equals( extractValueToCompare( newItems[i] ), extractValueToCompare( item ) ) ) {
                isDuplicate = true;
                break;
              }
            }
            if ( !isDuplicate ) {
              newItems.push( item );
            }
          });
          
          return newItems;

      }

		};

	}]);
