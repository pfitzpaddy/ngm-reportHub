/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module('ngmReportHub')
	.factory('ngmClusterHelper', [ '$filter', '$timeout', function( $filter, $timeout ) {

		return {
			
			// update material_select
			updateSelect: function(){
        $timeout(function(){ $( 'select' ).material_select(); }, 0 );
			},

      // project target report indicators
      getProjectTargetIndicators: function() {
        // targets
        return { 
          boys: 0,
          girls: 0,
          men: 0,
          women: 0
        }
      },

      // monthly report indicators
      getIndicators: function() {
        // indicators
        return {
          boys: 0,
          girls: 0,
          men: 0,
          women: 0,
          penta3_vacc_male_under1: 0,
          penta3_vacc_female_under1: 0,
          antenatal_care: 0,
          postnatal_care: 0,
          skilled_birth_attendant: 0,
          male_referrals: 0,
          female_referrals: 0,
          conflict_trauma_treated: 0,
          capacity_building_sessions: 0,
          capacity_building_male: 0,
          capacity_building_female: 0,
          education_sessions: 0,
          education_male: 0,
          education_female: 0,
          notes: false
        }
      },

      // return activity type by cluster
      getActivities: function( cluster_id, unique ){

        // get activities list from storage
        var activities = angular.fromJson( localStorage.getItem( 'activitiesList' ) );

        // filter by cluster
        activities = $filter( 'filter' )( activities, { cluster_id: cluster_id }, true );

        // if unique
        if ( unique ) {
          activities = this.filterDuplicates( activities, 'activity_type_id' )
        }

        // else 
        if ( !unique ) {
          // add other
          activities.push({
            activity_description_id: 'other',
            activity_description_name: 'Other'
          });
        }

        // return 
        return activities;

      },     

			// get cluster donors
			getDonors: function() {
				return [{
          donor_id: 'dfid',
          donor_name: 'DFID'
        },{
          donor_id: 'chf',
          donor_name: 'CHF'
        },{
          donor_id: 'echo',
          donor_name: 'ECHO'
        },{
          donor_id: 'global_fund',
          donor_name: 'Global Fund'
        },{
          donor_id: 'icrc',
          donor_name: 'ICRC'
        },{
          donor_id: 'ifrc',
          donor_name: 'IFRC'
        },{
          donor_id: 'qatar_red_crescent',
          donor_name: 'Qatar Red Crescent'
        },{
          donor_id: 'usaid',
          donor_name: 'USAID'
        },{
          donor_id: 'unicef',
          donor_name: 'UNICEF'
        },{
          donor_id: 'who',
          donor_name: 'WHO'
        },{
          donor_id: 'other',
          donor_name: 'Other'
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
        return $filter( 'filter' )( currencies, { admin0pcode: admin0pcode }, true );

			},

			// return ocha beneficiaries
			getBeneficiaries: function( list ) {

				// ocha beneficiaries list
				var beneficiaries = [{
          beneficiary_type: 'conflict_displaced',
          beneficiary_name: 'Conflict IDPs'
        },{
          beneficiary_type: 'health_affected_conflict',
          beneficiary_name: 'Health Affected by Conflict'
        },{
          beneficiary_type: 'training',
          beneficiary_name: 'Education & Capacity Building'
        },{
          beneficiary_type: 'natural_disaster_affected',
          beneficiary_name: 'Natural Disaster IDPs'
        },{
          beneficiary_type: 'refugees_returnees',
          beneficiary_name: 'Refugees & Returnees'
        },{
          beneficiary_type: 'white_area_population',
          beneficiary_name: 'White Area Population'
        }];

        
        // filter by cluster beneficiaries here


        // for each beneficiaries from list
        angular.forEach( list, function( d, i ){
          // filter out selected types
          beneficiaries = 
              $filter( 'filter' )( beneficiaries, { beneficiary_type: '!' + d.beneficiary_type }, true );
        });

        // sort and return
        return $filter( 'orderBy' )( beneficiaries, 'beneficiary_name' );

			},

			// health facility types
			getFacilityTypes: function() {
				// health facility types
				return [{
          fac_type: 'RH',
          fac_type_name: 'RH'
        },{
          fac_type: 'PH',
          fac_type_name: 'PH'
        },{
          fac_type: 'DH',
          fac_type_name: 'DH'
        },{
          fac_type: 'CHC',
          fac_type_name: 'CHC'
        },{
          fac_type: 'CHC+FATP',
          fac_type_name: 'CHC + FATP'
        },{
          fac_type: 'BHC',
          fac_type_name: 'BHC'
        },{
          fac_type: 'BHC+FATP',
          fac_type_name: 'BHC + FATP'
        },{
          fac_type: 'FHH',
          fac_type_name: 'FHH'
        },{
          fac_type: 'SHC',
          fac_type_name: 'SHC'
        },{
          fac_type: 'MHT',
          fac_type_name: 'MHT'
        },{
          fac_type: 'FATP',
          fac_type_name: 'FATP'
        },{
          fac_type: 'DATC',
          fac_type_name: 'DATC'
        },{
          fac_type: 'rehabilitation_center',
          fac_type_name: 'Rehabilitation Center'
        },{
          fac_type: 'special_hospital',
          fac_type_name: 'Special Hospital'
        },{
          fac_type: 'local_committee',
          fac_type_name: 'Local Committee'
        }]
			},

			// get processed target location
			getCleanBeneficiaries: function( project, report, indicators, location, beneficiaries ){

				// merge project + indicators + beneficiaries
				var beneficiaries = angular.merge( {}, project, report, indicators, location, beneficiaries );

				// set project_id
				beneficiaries.project_id = project.id;
				beneficiaries.report_id = report.id;

        // remove duplication from merge
        delete beneficiaries.id;
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

        // return clean beneficiaries
				return beneficiaries;

			},


			// get processed target location
			getCleanTargetBeneficiaries: function( project, indicators, beneficiaries ){
        
				// merge project + indicators + beneficiaries
				var beneficiaries = angular.merge( {}, project, indicators, beneficiaries );

        // remove duplication from merge
        delete beneficiaries.id;
        delete beneficiaries.project_description
        delete beneficiaries.project_budget_progress;
        delete beneficiaries.target_beneficiaries;
        delete beneficiaries.target_locations;
        delete beneficiaries.activity_description_check;
        delete beneficiaries.implementing_partners_checked;
        delete beneficiaries.project_donor_check;
        delete beneficiaries.project_budget;
        delete beneficiaries.project_budget_currency;

        // return clean beneficiaries
				return beneficiaries;

			},

			// get processed target location
			getCleanTargetLocation: function( project, location ){

				// merge project + admin1 + admin2 + facility
				var location = angular.merge( {}, project, location.admin2, location.fac_type );

        // remove duplication from merge
        delete location.id;
        delete location.project_description
        delete location.project_budget_progress;
        delete location.target_beneficiaries;
        delete location.target_locations;
        delete location.activity_description_check;
        delete location.implementing_partners_checked;
        delete location.project_donor_check;
        delete location.project_budget;
        delete location.project_budget_currency;

        // return clean location
				return location;

			},

			// get processed target location
			getCleanBudget: function( user, project, budget ){

				// merge user + project + new budget item
				var budget = angular.merge( {}, user.username, user.email, project, budget  );

				// remove duplication from merge
        delete budget.id;
        delete budget.project_description
        delete budget.project_budget_progress;
        delete budget.target_beneficiaries;
        delete budget.target_locations;
        delete budget.activity_description_check;
        delete budget.implementing_partners_checked;
        delete budget.project_donor_check;

        // return clean budget
				return budget;

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
