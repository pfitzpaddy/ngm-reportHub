/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelper', [ '$location', '$q', '$http', '$filter', '$timeout', 'ngmAuth', function( $location, $q, $http, $filter, $timeout, ngmAuth ) {

		return {

			// update material_select
			updateSelect: function(){
        $timeout(function(){ $( 'select' ).material_select(); }, 0 );
			},

      // get a new project
      getNewProject: function( user ) {

        var u = angular.copy( user );
                delete u.createdAt;
                delete u.updatedAt;

        // create empty project
        var project = {
          project_status: 'new',
          project_title: '',//'Enter New ' + user.organization + ' Project Title...',
          project_description: 'Please complete Project Details and enter a project summary description including objectives...',
          project_start_date: moment().startOf( 'M' ).format('YYYY-MM-DD'),
          project_end_date: moment().add( 8, 'M' ).endOf( 'M' ).format('YYYY-MM-DD'),
          // project_code: user.organization + '/' + moment().unix(),
          project_budget: '0',
          project_budget_progress: [],
          beneficiary_type: [],
          target_beneficiaries: [],
          target_locations: [],
        }

        // extend defaults with ngmUser details
        project = angular.merge( {}, u, project );

        // set hrp code
        project.project_hrp_code = this.getProjectHrpCode( project );

        // remove id of ngmUser to avoid conflict with new project
        delete project.id;

        // return
        return project;

      },

      // get hrp code
      getProjectHrpCode: function( project ) {

        // report
        var report = project.admin0pcode === 'AF' ? '-OTH-' : '-HRP-';

        // return project code
        return project.admin0name.toUpperCase().substring(0, 3) + report +
                        moment().year() + '-' +
                        project.cluster.toUpperCase().substring(0, 3) + '-' +
                        moment().unix();
      },

      // get lists for cluster reporting
      setClusterLists: function( user ) {

        // requests
        var requests = {

          // province lists
          getAdmin1List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin1List?admin0pcode=' + user.admin0pcode
          },

          // district lists
          getAdmin2List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin2List?admin0pcode=' + user.admin0pcode
          },

          // district lists
          getAdmin3List: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/list/getAdmin3List?admin0pcode=' + user.admin0pcode
          },

          // activities list
          getActivities: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/activities?admin0pcode=' + user.admin0pcode
          },

          // donors list
          getDonors: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/donors'
          },

          // indicators list
          getIndicators: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/indicators'
          },

          // indicators list
          getStockItems: {
            method: 'GET',
            url: ngmAuth.LOCATION + '/api/cluster/list/stockitems'
          }

        }

        // get all lists
        if ( !localStorage.getObject( 'lists' ) ) {

          // admin1, admin2, activities holders
          var lists = {
            admin1List: [],
            admin2List: [],
            admin3List: [],
            activitiesList: [],
            donorsList: [],
            indicatorsList: [],
            stockItemsList: []
          };

          // storage
          localStorage.setObject( 'lists', lists );

          // send request
          $q.all([
            $http( requests.getAdmin1List ),
            $http( requests.getAdmin2List ),
            $http( requests.getAdmin3List ),
            $http( requests.getActivities ),
            $http( requests.getDonors ),
            $http( requests.getIndicators ),
            $http( requests.getStockItems ) ] ).then( function( results ){

              // admin1, admin2, activities object
              var lists = {
                admin1List: results[0].data,
                admin2List: results[1].data,
                admin3List: results[2].data,
                activitiesList: results[3].data,
                donorsList: results[4].data,
                indicatorsList: results[5].data,
                stockItemsList: results[6].data
              };

              // storage
              localStorage.setObject( 'lists', lists );

            });
        }

      },

      // monthly report indicators
      getIndicators: function( target ) {

        // if project target, return subset (2016)
        if ( target ) {
          var indicators = {
            // households: 0,
            // families: 0,
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

      // delivery
      getDeliveryTypes: function() {
        return [{
          delivery_type_id: 'population',
          delivery_type_name: 'New Beneficiaries'
        },{
          delivery_type_id: 'service',
          delivery_type_name: 'Existing Beneficiaries'
        }];
      },

      // mpc delivery
      getMpcDeliveryTypes: function() {

        // food_for_asset_in_kind
        // food_for_asset_cbt
        // food_for_training_in_kind
        // food_for_training_cbt

        var types = [{
            activity_description_id: [ 'fsac_cash', 'fsac_multi_purpose_cash', 'esnfi_multi_purpose_cash', 'cvwg_multi_purpose_cash', 'cash_nfi', 'cash_winterization', 'cash_rent', 'cash_shelter_repair', 'shelter_construction_cash_permanent', 'shelter_construction_cash_transitional','mpc_cash_smeb','mpc_cash_post_arrival_grant','mpc_cash_protection_grant','mpc_cash_grant_other','nfi_package_cash_restricted_unrestricted_nonstandard','nfi_package_cash_restricted_unrestricted_standard_usd','winterization_package_cash_restricted_unrestricted_nonstandard','winterization_package_cash_restricted_unrestricted_standard_usd','transitional_shelter_cash_restricted_unrestricted_usd','existing_shelter_cash_restricted_unrestricted_usd_upgrade','rental_support_3_month_cash_restricted_unrestricted_usd' ],
            mpc_delivery_type_id: 'hawala',
            mpc_delivery_type_name: 'Hawala'
          },{
            activity_description_id: [ 'fsac_cash', 'fsac_multi_purpose_cash', 'esnfi_multi_purpose_cash', 'cvwg_multi_purpose_cash', 'cash_nfi', 'cash_winterization', 'cash_rent', 'cash_shelter_repair', 'shelter_construction_cash_permanent', 'shelter_construction_cash_transitional','mpc_cash_smeb','mpc_cash_post_arrival_grant','mpc_cash_protection_grant','mpc_cash_grant_other','nfi_package_cash_restricted_unrestricted_nonstandard','nfi_package_cash_restricted_unrestricted_standard_usd','winterization_package_cash_restricted_unrestricted_nonstandard','winterization_package_cash_restricted_unrestricted_standard_usd','transitional_shelter_cash_restricted_unrestricted_usd','existing_shelter_cash_restricted_unrestricted_usd_upgrade','rental_support_3_month_cash_restricted_unrestricted_usd' ],
            mpc_delivery_type_id: 'cash_in_envelope',
            mpc_delivery_type_name: 'Cash in Envelope'
          },{
            activity_description_id: [ 'fsac_cash', 'fsac_multi_purpose_cash', 'esnfi_multi_purpose_cash', 'cvwg_multi_purpose_cash', 'cash_nfi', 'cash_winterization', 'cash_rent', 'cash_shelter_repair', 'shelter_construction_cash_permanent', 'shelter_construction_cash_transitional','mpc_cash_smeb','mpc_cash_post_arrival_grant','mpc_cash_protection_grant','mpc_cash_grant_other','nfi_package_cash_restricted_unrestricted_nonstandard','nfi_package_cash_restricted_unrestricted_standard_usd','winterization_package_cash_restricted_unrestricted_nonstandard','winterization_package_cash_restricted_unrestricted_standard_usd','transitional_shelter_cash_restricted_unrestricted_usd','existing_shelter_cash_restricted_unrestricted_usd_upgrade','rental_support_3_month_cash_restricted_unrestricted_usd' ],
            mpc_delivery_type_id: 'bank',
            mpc_delivery_type_name: 'Bank'
          },{
            activity_description_id: [ 'fsac_cash', 'fsac_multi_purpose_cash', 'esnfi_multi_purpose_cash', 'cvwg_multi_purpose_cash', 'cash_nfi', 'cash_winterization', 'cash_rent', 'cash_shelter_repair', 'shelter_construction_cash_permanent', 'shelter_construction_cash_transitional','mpc_cash_smeb','mpc_cash_post_arrival_grant','mpc_cash_protection_grant','mpc_cash_grant_other','nfi_package_cash_restricted_unrestricted_nonstandard','nfi_package_cash_restricted_unrestricted_standard_usd','winterization_package_cash_restricted_unrestricted_nonstandard','winterization_package_cash_restricted_unrestricted_standard_usd','transitional_shelter_cash_restricted_unrestricted_usd','existing_shelter_cash_restricted_unrestricted_usd_upgrade','rental_support_3_month_cash_restricted_unrestricted_usd' ],
            mpc_delivery_type_id: 'mobile_cash',
            mpc_delivery_type_name: 'Mobile Cash'
          },{
            activity_description_id: [ 'fsac_cash', 'fsac_multi_purpose_cash', 'esnfi_multi_purpose_cash', 'cvwg_multi_purpose_cash', 'cash_nfi', 'cash_winterization', 'cash_rent', 'cash_shelter_repair', 'shelter_construction_cash_permanent', 'shelter_construction_cash_transitional','mpc_cash_smeb','mpc_cash_post_arrival_grant','mpc_cash_protection_grant','mpc_cash_grant_other','nfi_package_cash_restricted_unrestricted_nonstandard','nfi_package_cash_restricted_unrestricted_standard_usd','winterization_package_cash_restricted_unrestricted_nonstandard','winterization_package_cash_restricted_unrestricted_standard_usd','transitional_shelter_cash_restricted_unrestricted_usd','existing_shelter_cash_restricted_unrestricted_usd_upgrade','rental_support_3_month_cash_restricted_unrestricted_usd' ],
            mpc_delivery_type_id: 'e_cash',
            mpc_delivery_type_name: 'Electronic Card - Cash'
          },{
            activity_description_id: [ 'fsac_cash_value_voucher', 'fsac_cash_commodity_voucher' ],
            mpc_delivery_type_id: 'paper_vouchers',
            mpc_delivery_type_name: 'Paper Vouchers'
          },{
            activity_description_id: [ 'fsac_cash_value_voucher', 'fsac_cash_commodity_voucher' ],
            mpc_delivery_type_id: 'mobile_vouchers',
            mpc_delivery_type_name: 'Mobile Vouchers'
          },{
            activity_description_id: [ 'fsac_cash_value_voucher', 'fsac_cash_commodity_voucher' ],
            mpc_delivery_type_id: 'e_vouchers',
            mpc_delivery_type_name: 'Electronic Card - Vouchers'
          },{
            activity_description_id: [ 'fsac_in_kind' ],
            mpc_delivery_type_id: 'distribution',
            mpc_delivery_type_name: 'Distribution'
          }];

        return types;
      },

      // get list
      getTransfers: function( length ){
        var trasnfers = [];
        for( var i=1; i<=length; i++ ){
          trasnfers.push({
            transfer_type_id: i,
            transfer_type_value: i
          })
        }
        return trasnfers;
      },

      // clusters
      getClusters: function( admin0pcode ){
        var clusters = [];
        if ( admin0pcode.toLowerCase() === 'all') {
          clusters = [{
            cluster_id: 'acbar',
            cluster: 'ACBAR'
          },{
            cluster_id: 'agriculture',
            cluster: 'Agriculture'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'eiewg',
            cluster: 'EiEWG'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        } else if ( admin0pcode.toLowerCase() === 'af' ) {
          clusters = [{
            cluster_id: 'acbar',
            cluster: 'ACBAR'
          },{
            cluster_id: 'eiewg',
            cluster: 'EiEWG'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        } else {
          clusters = [{
            cluster_id: 'agriculture',
            cluster: 'Agriculture'
          },{
            cluster_id: 'education',
            cluster: 'Education'
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI'
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC'
          },{
            cluster_id: 'health',
            cluster: 'Health'
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition'
          },{
            cluster_id: 'cvwg',
            cluster: 'Multi-Purpose Cash'
          },{
            cluster_id: 'protection',
            cluster: 'Protection'
          },{
            cluster_id: 'wash',
            cluster: 'WASH'
          }];
        }

          return clusters;
      },

      // return activity type by cluster
      getActivities: function( project, filterInterCluster, filterDuplicates ){

        // get activities list from storage
        var activities = [],
            activitiesList = angular.copy( localStorage.getObject( 'lists' ).activitiesList );

        // no intercluster
        if ( !filterInterCluster ) {
          activities = activitiesList;
        }

        // intercluster filters
        if ( filterInterCluster ) {
          activities = $filter( 'filter' )( activitiesList, { cluster_id: project.cluster_id } );
          angular.forEach( project.inter_cluster_activities, function( d, i ){
            activities = activities.concat( $filter( 'filter' )( activitiesList, { cluster_id: d.cluster_id } ) );
          });
        }

        // filter for unique activity type
        if ( filterDuplicates ) {
          // filter duplicates
          activities = this.filterDuplicates( activities, 'activity_type_id' );
        }

        // return
        return activities;

      },

			// get cluster donors
			getDonors: function( cluster_id ) {

        // get from list
        var donors = $filter( 'filter' )( localStorage.getObject( 'lists' ).donorsList,
                          { cluster_id: cluster_id }, true );

        // if no list use default
        if ( !donors.length ) {
          var donors = [
            { project_donor_id: 'australia', project_donor_name:'Australia'},
            { project_donor_id: 'aus_aid', project_donor_name:'AusAid'},
            { project_donor_id: 'bmz', project_donor_name:'BMZ'},
            { project_donor_id: 'canada',  project_donor_name:'Canada'},
            { project_donor_id: 'caritas_germany', project_donor_name: 'Caritas Germany' },
            { project_donor_id: 'cerf', project_donor_name: 'CERF' },
            { project_donor_id: 'chf', project_donor_name: 'CHF' },
            { project_donor_id: 'cida', project_donor_name: 'CIDA' },
            { project_donor_id: 'czech_aid', project_donor_name: 'Czech Aid' },
            { project_donor_id: 'czech_mofa', project_donor_name: 'Czech MOFA' },
            { project_donor_id: 'danida', project_donor_name:'Danida'},
            { project_donor_id: 'denmark', project_donor_name:'Denmark'},
            { project_donor_id: 'dfid', project_donor_name: 'DFID' },
            { project_donor_id: 'echo', project_donor_name: 'ECHO' },
            { project_donor_id: 'ehf', project_donor_name: 'EHF' },
            { project_donor_id: 'european_union', project_donor_name: 'European Union' },
            { project_donor_id: 'finland', project_donor_name:'Finland' },
            { project_donor_id: 'france', project_donor_name:'France' },
            { project_donor_id: 'global_fund', project_donor_name: 'Global Fund' },
            { project_donor_id: 'german_foreign_ministry', project_donor_name: 'German Foreign Ministry' },
            { project_donor_id: 'icrc', project_donor_name: 'ICRC' },
            { project_donor_id: 'ifrc', project_donor_name: 'IFRC' },
            { project_donor_id: 'irish_aid', project_donor_name: 'IrishAid' },
            { project_donor_id: 'italy', project_donor_name: 'Italy' },
            { project_donor_id: 'jica', project_donor_name: 'JICA' },
            { project_donor_id: 'johanniter', project_donor_name: 'Johanniter' },
            { project_donor_id: 'khalifa_bin_zayed_al_nahyan_charity_foundation', project_donor_name: 'Khalifa bin Zayed Al Nahyan Charity Foundation' },
            { project_donor_id: 'netherlands', project_donor_name: 'Netherlands' },
            { project_donor_id: 'norway', project_donor_name: 'Norway' },
            { project_donor_id: 'ocha', project_donor_name: 'OCHA' },
            { project_donor_id: 'qatar_red_crescent', project_donor_name: 'Qatar Red Crescent' },
            { project_donor_id: 'republic_of_korea', project_donor_name: 'Republic of Korea' },
            { project_donor_id: 'sdc', project_donor_name: 'SDC' },
            { project_donor_id: 'sida', project_donor_name: 'SIDA' },
            { project_donor_id: 'start_network_global_humanitarian_assistance', project_donor_name: 'Start Network Global Humanitarian Assistance' },
            { project_donor_id: 'sweden', project_donor_name: 'Sweden' },
            { project_donor_id: 'switzerland', project_donor_name: 'Switzerland' },
            { project_donor_id: 'usaid', project_donor_name: 'USAID' },
            { project_donor_id: 'unhcr', project_donor_name: 'UNHCR' },
            { project_donor_id: 'unicef', project_donor_name: 'UNICEF' },
            { project_donor_id: 'wfp', project_donor_name: 'WFP' },
            { project_donor_id: 'who', project_donor_name: 'WHO' },
            { project_donor_id: 'world_bank', project_donor_name: 'Worldbank' }
          ];
        }

        // add other
        donors.push( { project_donor_id: 'other', project_donor_name: 'Other' } );

        return donors;
      },

      // country currencies
      getCurrencies: function( admin0pcode ) {
        var currencies = [{
          admin0pcode: 'AF',
          currency_id: 'afn',
          currency_name: 'AFN'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'aud',
          currency_name: 'AUD'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'cad',
          currency_name: 'CAD'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'ddk',
          currency_name: 'DDK'
        },{
          admin0pcode: 'ET',
          currency_id: 'etb',
          currency_name: 'ETB'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'eur',
          currency_name: 'EUR'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'gbp',
          currency_name: 'GBP'
        },{
          admin0pcode: 'IQ',
          currency_id: 'iqd',
          currency_name: 'IQD'
        },{
          admin0pcode: 'KE',
          currency_id: 'kes',
          currency_name: 'KES'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'nok',
          currency_name: 'NOK'
        },{
          admin0pcode: admin0pcode,
          currency_id: 'sek',
          currency_name: 'SEK'
        },{
          admin0pcode: 'SO',
          currency_id: 'sos',
          currency_name: 'SOS'
        },{
          // default is USD
          admin0pcode: admin0pcode,
          currency_id: 'usd',
          currency_name: 'USD'
        }];

        // filter currency options list by admin0pcode
        return $filter( 'filter' )( currencies, { admin0pcode: admin0pcode } );

      },

      // get HRP 2017 category
      getCategoryTypes: function(){

        // full list
        // cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],

        var category_types = [{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash', 'eiewg', 'rnr_chapter' ],
          category_type_id: 'category_a',
          category_type_name: 'A) Emergency Relief Needs'
        },{
          cluster_id: [ 'cvwg', 'health', 'nutrition', 'protection', 'wash', 'rnr_chapter' ],
          category_type_id: 'category_b',
          category_type_name: 'B) Excess Morbidity and Mortality'
        },{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'nutrition', 'protection', 'rnr_chapter' ],
          category_type_id: 'category_c',
          category_type_name: 'C) Shock-Induced Acute Vunerability'
        },{
          cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash', 'eiewg', 'rnr_chapter' ],
          category_type_id: 'category_d',
          category_type_name: 'D) Development'
        }];

        return category_types;

      },

      getUnits: function( admin0pcode ) {

        // filter by cluster?
        var units = [
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'kg', unit_type_name: 'KG', },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'doze', unit_type_name: 'Doze' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'quantin', unit_type_name: 'Quantin' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'seeds', unit_type_name: 'Seeds' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'livestock', unit_type_name: 'Livestock' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'cattle', unit_type_name: 'Cattle' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'sheep', unit_type_name: 'Sheep' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'goats', unit_type_name: 'Goats' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'camels', unit_type_name: 'Camels' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'donkeys', unit_type_name: 'Donkeys' },
            { cluster_id: [ 'agriculture' ],
              unit_type_id: 'equians', unit_type_name: 'Equians' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'm2', unit_type_name: 'm2' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'm3', unit_type_name: 'm3' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'kg', unit_type_name: 'KG' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'man_days', unit_type_name: 'Man Days' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'metric_tonnes', unit_type_name: 'Metric Tonnes' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pieces', unit_type_name: 'Pieces' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tablets', unit_type_name: 'Tablets' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'litres', unit_type_name: 'Litres' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'boxes', unit_type_name: 'Boxes' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'kits', unit_type_name: 'Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'drums', unit_type_name: 'Drums' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pac', unit_type_name: 'PAC' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'seeds', unit_type_name: 'Seeds' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'units', unit_type_name: 'Units' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'wheat', unit_type_name: 'Wheat' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'wheat_flour', unit_type_name: 'Wheat Flour' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'oil', unit_type_name: 'Oil' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'pulses', unit_type_name: 'Pulses' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'salt', unit_type_name: 'Salt' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'rice', unit_type_name: 'Rice' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'heb', unit_type_name: 'HEB' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'rusf', unit_type_name: 'RUSF' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'mnt', unit_type_name: 'MNT' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'facilities', unit_type_name: 'Facilities' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'structures', unit_type_name: 'Structures' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'sessions', unit_type_name: 'Sessions' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tcs', unit_type_name: 'TCs' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'cbss', unit_type_name: 'CBSs' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'teachers', unit_type_name: 'People' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'teachers', unit_type_name: 'Teachers' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'tents', unit_type_name: 'Tents' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'classroom_kits', unit_type_name: 'Classroom Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
              unit_type_id: 'school_kits', unit_type_name: 'School Kits' },
            { cluster_id: [ 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
							unit_type_id: 'schools', unit_type_name: 'Schools' },
						{ cluster_id: [ 'health' ],
							unit_type_id: 'centers', unit_type_name: 'Centers' },
						{ cluster_id: [ 'health' ],
							unit_type_id: 'medics', unit_type_name: 'Medics' },
						{ cluster_id: [ 'health' ],
							unit_type_id: 'health_extension_workers', unit_type_name: 'Health Extension Workers' },
          ];

        // unit type list
        var currencies=[];
        // add each currency
        angular.forEach( this.getCurrencies( admin0pcode ), function( d, i ){
          currencies.push({ unit_type_id: d.currency_id, unit_type_name: d.currency_name });
        });
        units = currencies.concat( $filter( 'orderBy' )( units, 'unit_type_name' ) );

        return units;
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
			getBeneficiaries: function( admin0pcode ) {

        // full list
        // cluster_id: [ 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],

        var beneficiaries = [{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idps',
            beneficiary_type_name: 'IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Returnees'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          }];

        // admin ET
        if ( admin0pcode === 'ET' ) {

          // beneficiaries
          beneficiaries = [{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idps',
            beneficiary_type_name: 'IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idp_conflict',
            beneficiary_type_name: 'Conflict IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idp_drought',
            beneficiary_type_name: 'Drought Affected IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idp_flood',
            beneficiary_type_name: 'Flood Affected IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idp_natural_disaster',
            beneficiary_type_name: 'Natural Disaster IDPs'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'refugees',
            beneficiary_type_name: 'Refugees'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'returnees',
            beneficiary_type_name: 'Returnees'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'health_workers',
            beneficiary_type_name: 'Health Workers'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'social_workers',
            beneficiary_type_name: 'Social Workers'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'host_communities',
            beneficiary_type_name: 'Host Communities'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'conflict_affected',
            beneficiary_type_name: 'Conflict Affected'
          },{
            cluster_id: [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'rnr_chapter', 'wash' ],
            beneficiary_type_id: 'idp_natural_affected',
            beneficiary_type_name: 'Natural Disaster Affected'
          }];

        } else if ( admin0pcode === 'AF' ) {
					// #TODO put it on config
					var report_year = 2017;

					if (moment()>moment('2018-02-01')) report_year = 2018;

					// ocha beneficiaries list
					if (report_year === 2017){

							beneficiaries = [{

								// Conflict Affected / Conflict IDPs

								// CAT A) conflict affected / conflict idps
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs (Recent)'
							},{
							//   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
							//   category_type_id: [ 'category_a' ],
							//   beneficiary_type_id: 'idp_conflict_natural_disaster',
							//   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
							// },{
								// CAT B) conflict affected / conflict idps
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs (Recent)'
							},{
							//   cluster_id: [ 'wash' ],
							//   category_type_id: [ 'category_b' ],
							//   beneficiary_type_id: 'idp_conflict_natural_disaster',
							//   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
							// },{
								// CAT C) conflict affected / conflict idps
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
							//   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection',  ],
							//   category_type_id: [ 'category_c' ],
							//   beneficiary_type_id: 'idp_conflict_natural_disaster',
							//   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
							// },{
								// CAT D) conflict affected / conflict idps
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs (Recent)'
							},{
							//   cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
							//   category_type_id: [ 'category_d' ],
							//   beneficiary_type_id: 'idp_conflict_natural_disaster',
							//   beneficiary_type_name: 'Conflict IDPs + Natural Disaster IDPs'
							// },{


								// Natural Disaster

								// CAT A) Natural Disaster
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								// CAT B) Natural Disaster
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								// CAT C) Natural Disaster
								cluster_id: [ 'esnfi' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'esnfi' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								// CAT D) Natural Disaster
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{


								// FSAC

								// CAT A), CAT B), Conflict, Natural Disaster
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs ( Returnees )'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs ( Refugee Returnees )'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs ( Deportee Returnees )'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected_earthquake',
								beneficiary_type_name: 'Natural Disaster Affected (Earthquake)'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected_flood',
								beneficiary_type_name: 'Natural Disaster Affected (Flood)'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected_drought',
								beneficiary_type_name: 'Natural Disaster Affected (Drought)'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected_wls',
								beneficiary_type_name: 'Natural Disaster Affected (Winter / Lean Season)'
							},{
								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_a', 'category_c' ],
								beneficiary_type_id: 'natural_disaster_affected_locust',
								beneficiary_type_name: 'Natural Disaster Affected (Locust)'
							},{


								// Refugees, IDPs

								// CAT A), Cat B), Cat C), Protracted IDPs
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection' ],
								category_type_id: [ 'category_a', 'category_b', 'category_c' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a', 'category_b' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Conflict IDPs (Prolonged)'
							},{
								// CAT A)
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								// CAT B)
								cluster_id: [ 'nutrition', 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'nutrition', 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'cvwg', 'health', 'nutrition', 'wash' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{
								// CAT C)
								cluster_id: [ 'cvwg', 'esnfi', 'protection' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'protection' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'protection' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{
								// Cat D)
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{


								// EiEWG

								// CAT A), Refugees & Returnees
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'displaced_children',
								beneficiary_type_name: 'Displaced Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'displaced_refugee_children',
								beneficiary_type_name: 'Displaced + Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'displaced_returnee_children',
								beneficiary_type_name: 'Displaced + Returnee Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'host_community_children',
								beneficiary_type_name: 'Host Community Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'returnee_refugee_children',
								beneficiary_type_name: 'Returnee Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'refugee_children',
								beneficiary_type_name: 'Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								category_type_id: [ 'category_a', 'category_d' ],
								beneficiary_type_id: 'returnee_children',
								beneficiary_type_name: 'Returnee Children'
							},{


								// WASH

								// CAT A), host communities
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'host_communities_disaster_idps',
								beneficiary_type_name: 'Communities Hosting Natural Disasater IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'host_communities_conflict_idps',
								beneficiary_type_name: 'Communities Hosting Conflict IDPs'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'host_communities_returnees',
								beneficiary_type_name: 'Communities Hosting Returnees'
							},{
								cluster_id: [ 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'host_communities_refugees',
								beneficiary_type_name: 'Communities Hosting Refugees'
							},{

								// Host Communities

								// CAT A), host communities
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'protection', 'wash' ],
								category_type_id: [ 'category_a' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{
								cluster_id: [ 'cvwg', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'wash' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{


								// Access to services

								// CAT B)

								cluster_id: [ 'health' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'White Area Population'
							},{
								cluster_id: [ 'wash', 'protection' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'Underserved Community'
							},{
								cluster_id: [ 'cvwg', 'nutrition' ],
								category_type_id: [ 'category_b' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'Access to Services'
							},{


								// FASC

								// food insecture

								cluster_id: [ 'fsac' ],
								category_type_id: [ 'category_c' ],
								beneficiary_type_id: 'severely_food_insecure',
								beneficiary_type_name: 'Severely Food Insecure'
							},{


								// RnR Chapter

								// CAT A), CAT B), CAT C),
								cluster_id: [ 'rnr_chapter' ],
								category_type_id: [ 'category_a', 'category_b', 'category_c' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'rnr_chapter' ],
								category_type_id: [ 'category_a', 'category_b', 'category_c' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'rnr_chapter' ],
								category_type_id: [ 'category_a', 'category_b', 'category_c' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{

								// HEALTH

								// CAT D) Others

								cluster_id: [ 'health' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'health_workers',
								beneficiary_type_name: 'Health Workers'
							},{
								cluster_id: [ 'health' ],
								category_type_id: [ 'category_d' ],
								beneficiary_type_id: 'other_beneficiaries',
								beneficiary_type_name: 'Other Beneficiaries'
							}];

							// set beneficiaries
							// beneficiaries = $filter( 'filter' )( beneficiaries, { cluster_id: cluster_id } );

							// if RnR
							// if ( project.project_rnr_chapter ) {
							//   beneficiaries = this.filterDuplicates( beneficiaries.concat( rnr ), 'beneficiary_type_id' );
							// }

						} else if (report_year === 2018){

							beneficiaries = [{

								// WASH

								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs (Recent)'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected Community'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected Community People'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Conflict IDPs (Prolonged)'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'host_communities_disaster_idps',
								beneficiary_type_name: 'Communities Hosting Natural Disasater IDPs'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'host_communities_conflict_idps',
								beneficiary_type_name: 'Communities Hosting Conflict IDPs'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'host_communities_returnees',
								beneficiary_type_name: 'Communities Hosting Returnees'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'host_communities_refugees',
								beneficiary_type_name: 'Communities Hosting Refugees'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'Underserved Community'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'wash' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{

								// FSAC

								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected_earthquake',
								beneficiary_type_name: 'Natural Disaster Affected (Earthquake)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected_flood',
								beneficiary_type_name: 'Natural Disaster Affected (Flood)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected_drought',
								beneficiary_type_name: 'Natural Disaster Affected (Drought)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected_wls',
								beneficiary_type_name: 'Natural Disaster Affected (Winter / Lean Season)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected_locust',
								beneficiary_type_name: 'Natural Disaster Affected (Locust)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'conflict_affected_non_displaced',
								beneficiary_type_name: 'Conflict Affected Non Displaced'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{
								cluster_id: [ 'fsac' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{

								// CASH

								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'conflict_affected_non_displaced',
								beneficiary_type_name: 'Conflict Affected Non Displaced'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'returnee_undocumented_border',
								beneficiary_type_name: 'Undoc. returnee (border)'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'returnee_undocumented_settlement',
								beneficiary_type_name: 'Undoc. returnee (settlement)'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'returnee_documented_encashment_center',
								beneficiary_type_name: 'Refugee returnee (documented) - encashment center'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'returnee_documented_settlement',
								beneficiary_type_name: 'Refugee returnee (documented) - settlement'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{
								cluster_id: [ 'cvwg' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{

								// HEALTH
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'White Area Population'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'health_workers',
								beneficiary_type_name: 'Health Workers'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'other_beneficiaries',
								beneficiary_type_name: 'Other Beneficiaries'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'health' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{

								// NUTRITION
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'Access to Services'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'refugee_pakistani',
								beneficiary_type_name: 'Pakistani Refugees'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{
								cluster_id: [ 'nutrition' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{

								// ESNFI

								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'esnfi' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{

								// Protection

								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'access_to_services',
								beneficiary_type_name: 'Underserved Community'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'returnee_documented',
								beneficiary_type_name: 'Afghan Refugee Returnees (Documented)'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'returnee_undocumented',
								beneficiary_type_name: 'Afghan Returnees (Undocumented)'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'conflict_affected',
								beneficiary_type_name: 'Conflict Affected'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'idp_conflict',
								beneficiary_type_name: 'Conflict IDPs'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'host_communities',
								beneficiary_type_name: 'Host Communities'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'idp_natural_disaster',
								beneficiary_type_name: 'Natural Disaster IDPs'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'natural_disaster_affected',
								beneficiary_type_name: 'Natural Disaster Affected'
							},{
								cluster_id: [ 'protection' ],
								beneficiary_type_id: 'idp_protracted',
								beneficiary_type_name: 'Protracted IDPs'
							},{

								// EIEWG

								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'displaced_children',
								beneficiary_type_name: 'Displaced Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'displaced_refugee_children',
								beneficiary_type_name: 'Displaced + Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'displaced_returnee_children',
								beneficiary_type_name: 'Displaced + Returnee Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'host_community_children',
								beneficiary_type_name: 'Host Community Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'returnee_refugee_children',
								beneficiary_type_name: 'Returnee Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'refugee_children',
								beneficiary_type_name: 'Refugee Children'
							},{
								cluster_id: [ 'eiewg' ],
								beneficiary_type_id: 'returnee_children',
								beneficiary_type_name: 'Returnee Children'
							}];
						}

			   }

        // filter by cluster beneficiaries here
        return beneficiaries;

			},

      // get facility implementation
      getFacilityImplementation: function( cluster_id ){
        var facility_implementation = [];
        if ( cluster_id === 'eiewg'  ) {
          facility_implementation = [{
            facility_implementation_id: 'formal',
            facility_implementation_name: 'Formal'
          },{
            facility_implementation_id: 'informal',
            facility_implementation_name: 'Informal'
          }]
        } else {
          facility_implementation = [{
            facility_implementation_id: 'standalone',
            facility_implementation_name: 'Standalone Facility'
          },{
            facility_implementation_id: 'embedded',
            facility_implementation_name: 'Embedded Facility'
          },{
            facility_implementation_id: 'community',
            facility_implementation_name: 'Community Based'
          },{
            facility_implementation_id: 'multiple',
            facility_implementation_name: 'Multiple Locations'
          }]
        }
        return facility_implementation;
      },

			// health facility types
			getFacilityTypes: function( cluster_id, admin0pcode ) {

        // facility_type
        var facility_types = [];

        // select what you wish
        if ( cluster_id === 'eiewg' ) {
          facility_types = [{
            facility_implementation_id: 'formal',
            facility_type_id: 'higher',
            facility_type_name: 'Higher'
          },{
            facility_implementation_id: 'formal',
            facility_type_id: 'secondary',
            facility_type_name: 'Secondary'
          },{
            facility_implementation_id: 'formal',
            facility_type_id: 'primary',
            facility_type_name: 'Primary'
          },{
            facility_implementation_id: 'formal',
            facility_type_id: 'ECD',
            facility_type_name: 'ECD'
          },{
            facility_implementation_id: 'formal',
            facility_type_id: 'TC',
            facility_type_name: 'TC'
          },{
            facility_implementation_id: 'informal',
            facility_type_id: 'ALC',
            facility_type_name: 'ALC'
          },{
            facility_implementation_id: 'informal',
            facility_type_id: 'CBS',
            facility_type_name: 'CBS'
          }]
        }

        // health & Et
				if ( admin0pcode === 'ET' ) {
          facility_types = [{
            facility_type_id: 'community_based',
            facility_type_name: 'Community Based'
          },{
            facility_type_id: 'refugee_camp',
            facility_type_name: 'Refugee Camp'
          },{
            facility_type_id: 'idp_camp',
            facility_type_name: 'IDP Camp'
          },{
            facility_type_id: 'feeding_center',
            facility_type_name: 'Feeding Center'
          },{
            facility_type_id: 'child_friendly_sapce',
            facility_type_name: 'Child Friendly Sapce'
          },{
            facility_type_id: 'women_friendly_sapce',
            facility_type_name: 'Women Friendly Sapce'
          },{
            facility_type_id: 'schools',
            facility_type_name: 'Schools'
          },{
            facility_type_id: 'multiple_facilities',
            facility_type_name: 'Multiple Facilities'
          },{
            facility_type_id: 'primary_hospital',
            facility_type_name: 'Primary Hospital'
          },{
            facility_type_id: 'general_hospital',
            facility_type_name: 'General Hospital'
          },{
            facility_type_id: 'referral_hospital',
            facility_type_name: 'Referral Hospital'
          },{
            facility_type_id: 'health_center',
            facility_type_name: 'Health Center'
          },{
            facility_type_id: 'health_post',
            facility_type_name: 'Health Post'
          },{
            facility_type_id: 'permanent_health_facility',
            facility_type_name: 'Permanent Health Facility'
          },{
            facility_type_id: 'temporary_health_facility',
            facility_type_name: 'Temporary Health Facility'
          },{
            facility_type_id: 'stabalization_center',
            facility_type_name: 'Stabalization Center'
          },{
            facility_type_id: 'MHNT',
            facility_type_name: 'MHNT'
          },{
            facility_type_id: 'ctc',
            facility_type_name: 'CTC'
          },{
            facility_type_id: 'ctu',
            facility_type_name: 'CTU'
          },{
            facility_type_id: 'orp',
            facility_type_name: 'ORP'
          }];
        }

        // health and not ET
        if ( cluster_id === 'health' && admin0pcode !== 'ET' ) {
          facility_types = [{
            facility_type_id: 'RH',
            facility_type_name: 'RH'
          },{
            facility_type_id: 'PH',
            facility_type_name: 'PH'
          },{
            facility_type_id: 'DH',
            facility_type_name: 'DH'
          },{
            facility_type_id: 'CHC',
            facility_type_name: 'CHC'
          },{
            facility_type_id: 'CHC+FATP',
            facility_type_name: 'CHC + FATP'
          },{
            facility_type_id: 'BHC',
            facility_type_name: 'BHC'
          },{
            facility_type_id: 'BHC+FATP',
            facility_type_name: 'BHC + FATP'
          },{
            facility_type_id: 'FHH',
            facility_type_name: 'FHH'
          },{
            facility_type_id: 'SHC',
            facility_type_name: 'SHC'
          },{
            facility_type_id: 'MHT',
            facility_type_name: 'MHT'
          },{
            facility_type_id: 'FATP',
            facility_type_name: 'FATP'
          },{
            facility_type_id: 'DATC',
            facility_type_name: 'DATC'
          },{
            facility_type_id: 'rehabilitation_center',
            facility_type_name: 'Rehabilitation Center'
          },{
            facility_type_id: 'special_hospital',
            facility_type_name: 'Special Hospital'
          },{
            facility_type_id: 'local_committee',
            facility_type_name: 'Local Committee'
					},{
            facility_type_id: 'family_protection_center',
            facility_type_name: 'Family Protection Center'
          },{
            facility_type_id: 'woman_friendly_health_space',
            facility_type_name: 'Woman Friendly Health Space'
          },{
            facility_type_id: 'mobile_outreach_team',
            facility_type_name: 'Mobile Outreach Team ( MOT )'
          },{
            facility_type_id: 'village',
            facility_type_name: 'Village'
          },{
            facility_type_id: 'community_based',
            facility_type_name: 'Community Based'
          }];
        }

        // facilities
        return facility_types;
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
      getCleanWarehouseLocation: function( user, organization, warehouse ){

        // merge
        var warehouse = angular.merge({}, organization, warehouse, warehouse.admin2, warehouse.admin3, warehouse.facility_type);

        // delete
        delete warehouse.id;
        delete warehouse.admin1;
        delete warehouse.admin2;
        delete warehouse.admin3;
        delete warehouse.facility_type;
				delete warehouse.createdAt;
				delete warehouse.updatedAt;

        // add params
        // warehouse.warehouse_status = 'new';
        warehouse.username = user.username;
        warehouse.email = user.email;
        warehouse.facility_lng = warehouse.admin3lng ? warehouse.admin3lng : warehouse.admin2lng;
				warehouse.facility_lat = warehouse.admin3lat ? warehouse.admin3lat : warehouse.admin2lat;

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
        // stock.number_in_stock = 0;
        // stock.number_in_pipeline = 0;
        // stock.beneficiaries_covered = 0;

        return stock;
      },


      // get processed target location
      getCleanBudget: function( user, project, budget ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.project_budget_progress;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.updatedAt;
        delete budget.updatedAt;

        // merge
        budget = angular.merge( {}, { username: user.username }, { email: user.email }, p, budget );

        // return clean budget
        return budget;

      },

      // get processed target location
      getCleanTargetBeneficiaries: function( project, beneficiaries ){

        // copy to p
        var p = angular.copy( project );

        // remove duplication from merge
        delete p.id;
        delete p.cluster_id;
        delete p.cluster;
        delete p.target_beneficiaries;
        delete p.target_locations;
        delete p.project_budget_progress;
        delete p.beneficiary_type;

        // needs to operate on an array
        angular.forEach( beneficiaries, function( d, i ){
          // merge beneficiaries + project
          delete beneficiaries[i].project_donor;
          delete beneficiaries[i].strategic_objectives;
          delete beneficiaries[i].admin1pcode;
          delete beneficiaries[i].admin2pcode;
          delete beneficiaries[i].admin3pcode;
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
        delete p.admin3pcode;
        // user
        delete p.name;
        delete p.position;
        delete p.phone;
        delete p.email;
        delete p.username;

        // needs to operate on an array
        angular.forEach( locations, function( d, i ){
          // merge locations + project
          delete locations[i].project_donor;
          delete locations[i].strategic_objectives;
          delete locations[i].activity_type;
          delete locations[i].beneficiary_type;
          locations[i] = angular.merge( {}, d, p );
          // set facility_lng, facility_lat
            // this is propigated through the entire datasets
          if ( !locations[i].facility_lng && !locations[i].facility_lat ) {
            // set admin3 or admin2
            locations[i].facility_lng = locations[i].admin3lng ? locations[i].admin3lng : locations[i].admin2lng;
            locations[i].facility_lat = locations[i].admin3lat ? locations[i].admin3lat : locations[i].admin2lat;
          }
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
				delete p.createdAt;
				delete p.updatedAt;

        // remove arrays to update
        delete r.activity_description;
        delete r.activity_type;
        delete r.admin1pcode;
        delete r.admin2pcode;
        delete r.admin3pcode;
        delete r.beneficiary_type;
        delete r.category_type;
        delete r.project_donor;
				delete r.strategic_objectives;
				delete r.createdAt;
				delete r.updatedAt;

        // merge
        report = angular.merge( {}, r, p );

        // locations
        angular.forEach(report.locations, function( location, i ){

          // remove to ensure updated
          var l = angular.copy( location );
          delete r.id;
          delete p.admin1pcode;
          delete p.admin2pcode;
          delete p.admin3pcode;
          delete r.admin1pcode;
          delete r.admin2pcode;
          delete r.admin3pcode;
          delete r.locations;
          delete l.activity_description;
          delete l.activity_type;
          delete l.beneficiary_type;
          delete l.category_type;
          delete l.project_donor;
					delete l.strategic_objectives;
					delete l.createdAt;
					delete l.updatedAt;
          // ids
          l.project_id = project.id;
          l.report_id = report.id;
          // merge
          report.locations[i] = angular.merge( {}, l, r, p );

          // locations
          angular.forEach( report.locations[i].trainings, function( training, j ){
            // rm
            // delete p.cluster_id;
            // delete p.cluster;
            // report
            // delete r.cluster_id;
            // delete r.cluster;
            // location
            delete l.id;
            delete l.report_id;
            delete l.beneficiaries;
            // delete l.cluster_id;
            // delete l.cluster;
            // remove to ensure updated
            var t = angular.copy( training );
            delete t.activity_description;
            delete t.activity_type;
            delete t.beneficiary_type;
            delete t.category_type;
            delete t.project_donor;
						delete t.strategic_objectives;
						delete t.createdAt;
						delete t.updatedAt;
            // ids
            t.project_id = project.id;
            t.report_id = report.id;
            // merge
            report.locations[i].trainings[j] = angular.merge( {}, t, l, r, p );

            // trainees
            angular.forEach( training.training_participants, function( trainees, k ){
              var trainings = angular.copy( report.locations[i].trainings[j] );
							delete trainings.id;
							delete trainings.createdAt;
							delete trainings.updatedAt;
              report.locations[i].trainings[j].training_participants[k] = angular.merge( {}, trainees, trainings);
              delete report.locations[i].trainings[j].training_participants[k].trainings;
              delete report.locations[i].trainings[j].training_participants[k].training_participants;
            });

          });

          // locations
          angular.forEach( report.locations[i].beneficiaries, function( beneficiary, j ){
            // rm
            delete p.cluster_id;
            delete p.cluster;
            // report
            delete r.cluster_id;
            delete r.cluster;
            // location
            delete l.id;
            delete l.report_id;
            delete l.beneficiaries;
            delete l.cluster_id;
            delete l.cluster;
            // remove to ensure updated
            var b = angular.copy( beneficiary );
            delete b.activity_description;
            delete b.activity_type;
            delete b.beneficiary_type;
            delete b.category_type;
            delete b.project_donor;
						delete b.strategic_objectives;
						delete b.createdAt;
						delete b.updatedAt;
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
      getStrategicObjectives: function (admin0pcode, start_report_year, end_report_year) {
      	if (admin0pcode === 'AF') {

        var strategic_objectives = {
      			2017: {
          'cvwg': [{
            cluster_id: 'cvwg',
            cluster: 'Cash Voucher Working Group',
      					objective_type_id: 'mpc_objective_1',
      					objective_type_name: 'MPC OBJECTIVE 1',
            objective_type_description: 'No objectives related to HRP for 2017',
            objective_type_objectives: []
          }],
          'eiewg': [{
            cluster_id: 'eiewg',
            cluster: 'EiEWG',
            objective_type_id: 'eiewg_objective_1',
            objective_type_name: 'EiEWG OBJECTIVE 1',
            objective_type_description: 'No objectives related to HRP for 2017',
            objective_type_objectives: []
          }],
          'fsac': [{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_1',
            objective_type_name: 'FSAC OBJECTIVE 1',
            objective_type_description: 'Immediate food needs of targeted shock affected populations are addressed with appropriate transfer modality (food, cash or voucher)',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_2',
            objective_type_name: 'FSAC OBJECTIVE 2',
            objective_type_description: 'Ensure continued and regular access to food during lean season for severely food insecure people, refugees and prolonged IDPs at risk of hunger and acute malnutrition',
            objective_type_objectives: [ 'SO3' ]
          },{
            cluster_id: 'fsac',
            cluster: 'FSAC',
            objective_type_id: 'fsac_objective_3',
            objective_type_name: 'FSAC OBJECTIVE 3',
            objective_type_description: 'Strengethen emergency preparedness and response capabilities of partners through development of contingency plans, timely coordinated food security assessments and capacity development especially in hard to reach areas',
            objective_type_objectives: [ 'SO4' ]
          }],
          'esnfi': [{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_1',
            objective_type_name: 'ESNFI OBJECTIVE 1',
            objective_type_description: 'Coordinated and timely ES-NFI response to families affected by natural disaster and armed conflict',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_2',
            objective_type_name: 'ESNFI OBJECTIVE 2',
            objective_type_description: 'Coordinated and timely ES-NFI response to returnees',
            objective_type_objectives: [ 'SO1' ]
          },{
            cluster_id: 'esnfi',
            cluster: 'ESNFI',
            objective_type_id: 'esnfi_objective_3',
            objective_type_name: 'ESNFI OBJECTIVE 3',
            objective_type_description: 'Families falling into acute vulnerability due to shock are assisted with ES-NFI interventions in the medium term',
            objective_type_objectives: [ 'SO3' ]
          }],
          'health': [{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_1',
            objective_type_name: 'HEALTH OBJECTIVE 1',
            objective_type_description: 'Ensure access to emergency health services, effective trauma care and mass casualty management for shock affected people',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_2',
            objective_type_name: 'HEALTH OBJECTIVE 2',
            objective_type_description: 'Ensure access to essential basic and emergency health services for white conflict-affected areas and overburdened services due to population movements',
            objective_type_objectives: [ 'SO2', 'SO4' ]
          },{
            cluster_id: 'health',
            cluster: 'Health',
            objective_type_id: 'health_objective_3',
            objective_type_name: 'HEALTH OBJECTIVE 3',
            objective_type_description: 'Provide immediate life saving assistance to those affected by public health outbreaks',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          }],
          'nutrition':[{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_1',
            objective_type_name: 'NUTRITION OBJECTIVE 1',
            objective_type_description: 'Quality community and facility-based nutrition information is made available timely for programme monitoring and decision making',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_2',
            objective_type_name: 'NUTRITION OBJECTIVE 2',
            objective_type_description: 'The incidence of acute malnutrition is reduced through Integrated Management of Acute Malnutrition among boys, girls, pregnant and lactating women',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO3', 'SO4' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_3',
            objective_type_name: 'NUTRITION OBJECTIVE 3',
            objective_type_description: 'Contribute to reduction of morbidity and mortality among returnees and refugees by providing preventative nutrition programmes',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            cluster_id: 'nutrition',
            cluster: 'Nutrition',
            objective_type_id: 'nutrition_objective_4',
            objective_type_name: 'NUTRITION OBJECTIVE 4',
            objective_type_description: 'Enhance capacity of partners to advocate for and respond at scale to nutrition in emergencies',
      					objective_type_objectives: ['SO1', 'SO2', 'SO3', 'SO4'],
          }],
          'protection':[{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_1',
            objective_type_name: 'PROTECTION OBJECTIVE 1',
            objective_type_description: 'Acute protection concerns, needs and violations stemming from the immediate impact of shocks and taking into account specific vulnerabilities are identified and addressed in a timely manner',
            objective_type_objectives: [ 'SO1', 'SO2' ]
          },{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_2',
            objective_type_name: 'PROTECTION OBJECTIVE 2',
            objective_type_description: 'Evolving protection concerns, needs and violations are monitored, analysed and responded to, upholding fundamental rights and restoring the dignity and well-being of vulnerable shock affected populations',
            objective_type_objectives: [ 'SO3' ]
          },{
            cluster_id: 'protection',
            cluster: 'Protection',
            objective_type_id: 'protection_objective_3',
            objective_type_name: 'PROTECTION OBJECTIVE 3',
            objective_type_description: 'Support the creation of a protection-conducive environment to prevent and mitigate protection risks, as well as facilitate an effective response to protection violation',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          }],
          'wash':[{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_1',
            objective_type_name: 'WASH OBJECTIVE 1',
            objective_type_description: 'Ensure timely access to a sufficient quantity of safe drinking water, use of adequate and gender sensitive sanitation and appropriate means of hygiene practices by the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_2',
            objective_type_name: 'WASH OBJECTIVE 2',
            objective_type_description: 'Ensure timely and adequate access to WASH services in institutions affected by emergencies',
      					objective_type_objectives: ['SO1', 'SO2', 'SO4'],
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_3',
            objective_type_name: 'WASH OBJECTIVE 3',
            objective_type_description: 'Ensure timely and adequate assessments of WASH needs of the affected population',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          },{
            cluster_id: 'wash',
            cluster: 'Wash',
            objective_type_id: 'wash_objective_4',
            objective_type_name: 'WASH OBJECTIVE 4',
            objective_type_description: 'Two-year transition of cluster leadership of Ministry of Rural Rehabilitation and Development set in motion',
            objective_type_objectives: [ 'SO1', 'SO2', 'SO4' ]
          }],
          'rnr_chapter': [{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_1',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
            objective_type_description: 'Protection interventions provided to NWA refugees',
      					objective_type_objectives: ['SO1'],
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_2',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 2',
            objective_type_description: 'Essential services delivered to returnees while pursuing durable solutions',
            objective_type_objectives: [ 'SO1', 'SO3' ]
          },{
            cluster_id: 'rnr_chapter',
            cluster: 'R&R Chapter',
            objective_type_id: 'project_rnr_chapter_objective_3',
            objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 3',
            objective_type_description: 'Immediate humanitarian needs for vulnerable refugee returnees, undocumented returnees and deportees are met',
            objective_type_objectives: [ 'SO1' ]
      				}],
      			},
      			2018: {
      				'cvwg': [{
      					cluster_id: 'cvwg',
      					cluster: 'Cash Voucher Working Group',
      					objective_type_id: 'mpc_objective_1',
      					objective_type_name: 'MPC OBJECTIVE 1',
      					objective_type_description: 'Save lives in the areas of highest need',
      					objective_type_objectives: ['S01'],
      					objective_year: 2018
      				}],
      				'eiewg': [{
      					cluster_id: 'eiewg',
      					cluster: 'EiEWG',
      					objective_type_id: 'eiewg_objective_1',
      					objective_type_name: 'EiEWG OBJECTIVE 1',
      					objective_type_description: 'No objectives related to HRP for 2017',
      					objective_type_objectives: [],
      					objective_year: 2018
      				}],
      				'fsac': [{
      					cluster_id: 'fsac',
      					cluster: 'FSAC',
      					objective_type_id: 'fsac_objective_1',
      					objective_type_name: 'FSAC OBJECTIVE 1',
      					objective_type_description: 'Ensure continued and regular access to food for the acute food insecure across the country',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'fsac',
      					cluster: 'FSAC',
      					objective_type_id: 'fsac_objective_2',
      					objective_type_name: 'FSAC OBJECTIVE 2',
      					objective_type_description: 'Protect and rehabilitate livelihoods for the vulnerable population at risk of hunger and malnutrition through appropriate response and linkages with development programme',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'fsac',
      					cluster: 'FSAC',
      					objective_type_id: 'fsac_objective_3',
      					objective_type_name: 'FSAC OBJECTIVE 3',
      					objective_type_description: 'Strengthen emergency preparedness and provide timely response in hard to reach areas through enhanced capacity of partners on assessment and contingency planning',
      					objective_type_objectives: ['SO3'],
      					objective_year: 2018
      				}],
      				'esnfi': [{
      					cluster_id: 'esnfi',
      					cluster: 'ESNFI',
      					objective_type_id: 'esnfi_objective_1',
      					objective_type_name: 'ESNFI OBJECTIVE 1',
      					objective_type_description: 'Ensure timely, adequate access to shelter and non-food items for internally displaced and returnees assessed in need',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'esnfi',
      					cluster: 'ESNFI',
      					objective_type_id: 'esnfi_objective_2',
      					objective_type_name: 'ESNFI OBJECTIVE 1',
      					objective_type_description: 'Ensure that the living conditions of vulnerable people are improved',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'esnfi',
      					cluster: 'ESNFI',
      					objective_type_id: 'esnfi_objective_3',
      					objective_type_name: 'ESNFI OBJECTIVE 1',
      					objective_type_description: 'Ensure adequate response capacity through preparedness measures and prepositioning of emergency shelters and Non-Food Items',
      					objective_type_objectives: ['SO3'],
      					objective_year: 2018
      				}],
      				'health': [{
      					cluster_id: 'health',
      					cluster: 'Health',
      					objective_type_id: 'health_objective_1',
      					objective_type_name: 'HEALTH OBJECTIVE 1',
      					objective_type_description: 'Save lives in the areas of highest need: People suffering trauma related injuries because of the conflict receive life-saving treatment within the province where the injury was sustained in either existing medical facilities or new First Aid Trauma Posts',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'health',
      					cluster: 'Health',
      					objective_type_id: 'health_objective_2',
      					objective_type_name: 'HEALTH OBJECTIVE 2',
      					objective_type_description: 'Reduce protection violations and increase respect for International Humanitarian Law',
      					objective_type_objectives: ['SO2'],
      					objective_year: 2018
      				}],
      				'nutrition': [{
      					cluster_id: 'nutrition',
      					cluster: 'Nutrition',
      					objective_type_id: 'nutrition_objective_1',
      					objective_type_name: 'NUTRITION OBJECTIVE 1',
      					objective_type_description: 'Save lives in the areas of highest need',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
      				}],
      				'protection': [{
      					cluster_id: 'protection',
      					cluster: 'Protection',
      					objective_type_id: 'protection_objective_2',
      					objective_type_name: 'PROTECTION OBJECTIVE 2',
      					objective_type_description: 'Parties increase measures to protect civilians based upon further harmonized POC/IHL advocacy by protection actors',
      					objective_type_objectives: ['SO1','SO2'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'protection',
      					cluster: 'Protection',
      					objective_type_id: 'protection_objective_2',
      					objective_type_name: 'PROTECTION OBJECTIVE 2',
      					objective_type_description: 'Child rights violations are monitored and verified to prevent and respond to the needs of children affected by emergencies',
      					objective_type_objectives: ['SO1','SO2'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'protection',
      					cluster: 'Protection',
      					objective_type_id: 'protection_objective_3',
      					objective_type_name: 'PROTECTION OBJECTIVE 3',
      					objective_type_description: 'Gender Based Violence incidents in emergencies are identified and survivors’ multi-sectorial needs are adequately responded to',
      					objective_type_objectives: ['SO1','SO2'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'protection',
      					cluster: 'Protection',
      					objective_type_id: 'protection_objective_4',
      					objective_type_name: 'PROTECTION OBJECTIVE 5',
      					objective_type_description: 'Vulnerable displaced persons are able to claim and exercise housing, land and property, as well as legal identity rights vital for achieving durable solutions',
      					objective_type_objectives: ['SO1','SO3'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'protection',
      					cluster: 'Protection',
      					objective_type_id: 'protection_objective_5',
      					objective_type_name: 'PROTECTION OBJECTIVE 5',
      					objective_type_description: 'Reduce deaths and injuries from mines/ERW and promote inclusivity and rights of persons with disabilities, through education and clearance of high-impact mine/ERW and spot ERW contamination',
      					objective_type_objectives: ['SO1','SO2'],
      					objective_year: 2018
      				}],
      				'wash': [{
      					cluster_id: 'wash',
      					cluster: 'Wash',
      					objective_type_id: 'wash_objective_1',
      					objective_type_name: 'WASH OBJECTIVE 1',
      					objective_type_description: 'WASH related communicable diseases are reduced among IDP, returnee, refugee and non-displaced conflictaffected women, men and children of all ages through timely and adequate WASH assistance',
      					objective_type_objectives: ['SO1', 'SO3'],
      					objective_year: 2018
      				}, {
      					cluster_id: 'wash',
      					cluster: 'Wash',
      					objective_type_id: 'wash_objective_2',
      					objective_type_name: 'WASH OBJECTIVE 2',
      					objective_type_description: 'People affected by natural disasters –including severe weather conditions– are assessed and responded to in a timely manner preventing loss of life and risk of disease',
      					objective_type_objectives: ['SO1', 'SO3'],
      					objective_year: 2018
      				}],
      				'rnr_chapter': [{
      					cluster_id: 'rnr_chapter',
      					cluster: 'R&R Chapter',
      					objective_type_id: 'project_rnr_chapter_objective_1',
      					objective_type_name: 'REFUGEE & RETURNEE OBJECTIVE 1',
      					objective_type_description: 'Save lives in the areas of highest need',
      					objective_type_objectives: ['SO1'],
      					objective_year: 2018
          }]
        }
      		}
      	}

      	sub_strategic_objectives = {};
      	for (var i = start_report_year; i <= end_report_year; i++) {
      		if (strategic_objectives&&strategic_objectives[i]) sub_strategic_objectives[i] = strategic_objectives[i];
      	}
        // return SO by cluster
      	return sub_strategic_objectives;

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
