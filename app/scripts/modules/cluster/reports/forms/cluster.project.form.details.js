/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormDetailsCtrl
 * @description
 * # ClusterProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.details', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget( 'project.details', {
        title: 'Cluster Project Details Form',
        description: 'Display Project Details Form',
        controller: 'ClusterProjectFormDetailsCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/details/form.html'
      });
  })
  .controller( 'ClusterProjectFormDetailsCtrl', [
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

      // set default
      if( !config.project.project_budget_currency ){
        config.project.project_budget_currency = 'usd';
      }

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // form
        submit: true,

        // new project?
        newProject: $route.current.params.project === 'new' ? true : false,

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // default subset indicators ( boys, girls, men, women )
        indicators: ngmClusterHelper.getIndicators( true ),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],

        // lists
        activity_types: config.project.activity_type,
        lists: {
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          units: ngmClusterHelper.getUnits( config.project.admin0pcode ),

          // delivery
          delivery_types: ngmClusterHelper.getDeliveryTypes(),
          
          // MPC
          mpc_purpose: [
            { cluster_id: 'eiewg', cluster: 'EiEWG', mpc_purpose_type_id: 'education', mpc_purpose_type_name: 'Education' },
            { cluster_id: 'fsac', cluster: 'FSAC', mpc_purpose_type_id: 'food', mpc_purpose_type_name: 'Food' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'fuel_electricity', mpc_purpose_type_name: 'Fuel / Electricity' },
            { cluster_id: 'health', cluster: 'Health', mpc_purpose_type_id: 'health', mpc_purpose_type_name: 'Health' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'rent', mpc_purpose_type_name: 'Rent' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'shelter', mpc_purpose_type_name: 'Shelter Construction' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'transport', mpc_purpose_type_name: 'Transport' },
            { cluster_id: 'esnfi', cluster: 'ESNFI', mpc_purpose_type_id: 'nfi', mpc_purpose_type_name: 'NFI' },
            { cluster_id: 'wash', cluster: 'WASH', mpc_purpose_type_id: 'wash', mpc_purpose_type_name: 'WASH' }
          ],
          mpc_delivery_types: ngmClusterHelper.getMpcDeliveryTypes(),

          // transfers
          transfers: ngmClusterHelper.getTransfers( 30 ),
          clusters: ngmClusterHelper.getClusters(),
          activity_types: ngmClusterHelper.getActivities( config.project, true, true ),
          activity_descriptions: ngmClusterHelper.getActivities( config.project, true, false ),

          strategic_objectives: ngmClusterHelper.getStrategicObjectives(),
          category_types: ngmClusterHelper.getCategoryTypes(),
          beneficiary_types: moment( config.project.project_end_date ).year() === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries( config.project.admin0pcode ),
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          donors: ngmClusterHelper.getDonors( config.project.cluster_id ),
          
          // admin1 ( with admin0 filter from API )
          admin1: localStorage.getObject( 'lists' ).admin1List,
          
          // admin2 ( with admin0 filter from API )
          admin2: localStorage.getObject( 'lists' ).admin2List,

          // admin3 ( with admin0 filter from API )
          admin3: localStorage.getObject( 'lists' ).admin3List,

          // this is for row by row filters
          admin2Select: [],
          admin3Select: [],
          
          // Schools
          schools:[],
          hub_schools: [],
          school_status: [{ school_status_id: 'formal', school_status_name: 'Formal' },{ school_status_id: 'informal', school_status_name: 'Informal' }],
          new_schools:[{ new_school_id: 'yes', new_school_name: 'Yes' },{ new_school_id: 'no', new_school_name: 'No' }],
          school_type: ngmClusterHelper.getSchoolTypes(),
          facility_type: ngmClusterHelper.getFacilityTypes( config.project.admin0pcode )
        },

        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',
        detailsUrl: 'details.html',
        strategicObjectivesUrl: 'strategic-objectives.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        locationsUrl: config.project.cluster_id === 'eiewg' ? 'target-locations/locations-eiewg.html' : 'target-locations/locations.html',

        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.update_dates = true;
            $scope.project.definition.project_start_date = moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');
          }
        },

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
        },

        // set to model on check
        setStrategicObjectives: function( $index, cluster_id ){

          $scope.project.definition.strategic_objectives = [];
          angular.forEach( $scope.project.definition.strategic_objectives_check, function( key, so ){

            if ( key ) {
              if ( cluster_id !== $scope.project.definition.cluster_id ) {
                // always include cluster_id
                var objective = $filter('filter')( $scope.project.lists.strategic_objectives[ $scope.project.definition.cluster_id ], { objective_type_id: so }, true);
                if( objective[0] ){
                  $scope.project.definition.strategic_objectives.push( objective[0] );
                }
              } 
              var objective = $filter('filter')( $scope.project.lists.strategic_objectives[ cluster_id ], { objective_type_id: so }, true);
              if( objective[0] ){
                $scope.project.definition.strategic_objectives.push( objective[0] );
              }

            }

          });

          // set HRP if SOs selected
          if( $scope.project.definition.strategic_objectives.length ) {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'HRP' );
          } else {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'HRP', 'OTH' );
          }

        },

        // update organization if acbar partner
        updateOrganization: function(){

          // set org
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/setOrganizationPartner',
            data: { 
              organization_id: $scope.project.definition.organization_id,
              project_acbar_partner: $scope.project.definition.project_acbar_partner
            }
          }).success( function( result ) {
            // success!
          }).error( function( err ) {
            Materialize.toast( 'ACBAR Partner Organization Error!', 6000, 'error' );
          });

        },

        // add beneficiary
        addBeneficiary: function() {
          // sadd
          var sadd = {
            units: 0,
            cash_amount: 0,
            households: 0, 
            sessions: 0, 
            families: 0, 
            boys: 0, 
            girls: 0, 
            men:0, 
            women:0, 
            elderly_men:0, 
            elderly_women:0 
          };
          $scope.inserted = {
            category_type_id: null,
            category_type_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            delivery_type_id: null,
            delivery_type_name: null,
            transfer_type_id: 0,
            transfer_type_value: 0
          };

          // merge
          angular.merge( $scope.inserted, sadd );

          // eiewg
          if( $scope.project.definition.admin0pcode !== 'AF' || $scope.project.definition.cluster_id === 'eiewg' ){
            $scope.inserted.category_type_id = 'category_a';
            $scope.inserted.category_type_name = 'A) Emergency Relief Needs';
          }
          
          // clone
          var length = $scope.project.definition.target_beneficiaries.length;
          if ( length ) {
            var b = angular.copy( $scope.project.definition.target_beneficiaries[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( $scope.inserted, b, sadd );
            $scope.inserted.transfer_type_id = 0;
            $scope.inserted.transfer_type_value = 0;
          }
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
        },

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if( $beneficiary.activity_type_id && $scope.project.definition.activity_type.length ) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
            if ( selected.length ) {
              
              // catch for old data
              if( selected[0].cluster_id && selected[0].cluster ) {
                $beneficiary.cluster_id = selected[0].cluster_id;
                $beneficiary.cluster = selected[0].cluster;
              }

              $beneficiary.activity_type_name = selected[0].activity_type_name;
            }
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true);
            if( selected.length ) {
              $beneficiary.activity_description_name = selected[0].activity_description_name;
            }
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // display delivery
        showCashDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.mpc_delivery_type_id = $data;
          if( $beneficiary.mpc_delivery_type_id ) {

            // selection
            selected = $filter('filter')( $scope.project.lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true );
            if ( selected.length ) {
              $beneficiary.mpc_delivery_type_name = selected[0].mpc_delivery_type_name;
            } else {
              selected.push({
                mpc_delivery_type_id: 'n_a',
                mpc_delivery_type_name: 'N/A'
              });
            }

            // no cash! for previous selections
            if ( $beneficiary.activity_type_id.indexOf( 'cash' ) === -1 &&
                  $beneficiary.activity_description_id &&  
                  ( $beneficiary.activity_description_id.indexOf( 'cash' ) === -1 && 
                    $beneficiary.activity_description_id.indexOf( 'in_kind' ) === -1 ) ){
              // reset
              $beneficiary.mpc_delivery_type_id = 'n_a';
              $beneficiary.mpc_delivery_type_name = 'N/A';
            }

          }

          return selected.length ? selected[0].mpc_delivery_type_name : 'No Selection!';
        },

        // display category
        showCategory: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.category_type_id = $data;
          if($beneficiary.category_type_id) {
            selected = $filter('filter')( $scope.project.lists.category_types, { category_type_id: $beneficiary.category_type_id }, true);
            if( selected.length ) {
              $beneficiary.category_type_name = selected[0].category_type_name;
            }
          }
          return selected.length ? selected[0].category_type_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if($beneficiary.beneficiary_type_id) {
            selected = $filter('filter')( $scope.project.lists.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id }, true);
          }
          if ( selected.length ) {
            $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
            return selected[0].beneficiary_type_name
          } else {
            return 'No Selection!';
          }
        },

        // display delivery
        showDelivery: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.delivery_type_id = $data;
          if($beneficiary.delivery_type_id) {
            selected = $filter('filter')( $scope.project.lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
            $beneficiary.delivery_type_name = selected[0].delivery_type_name;
          }
          return selected.length ? selected[0].delivery_type_name : 'No Selection!';
        },

        // 
        display: function( cluster_id ) {
          var display = false;
          angular.forEach( $scope.project.target_beneficiaries, function( b, i ){
            if ( b.cluster_id === cluster_id ) {
              display = true;
            }
          });
          return display;
        },

        // sessions disabled
        rowSessionsDisabled: function( $beneficiary ){
          var disabled = true;
          if( ( $beneficiary.cluster_id !== 'eiewg' )
                && ( $beneficiary.activity_description_id )
                && ( $beneficiary.activity_description_id.indexOf( 'education' ) !== -1 || $beneficiary.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
            disabled = false
          }
          return disabled;
        },

        // cash
        showCash: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( ( b.activity_type_id && b.activity_type_id.indexOf('cash') > -1 ) || 
              ( b.activity_description_id && ( b.activity_description_id.indexOf('cash') > -1 || 
                b.activity_description_id.indexOf( 'fsac_in_kind' ) > -1 ) ) ) {
              display = true;
            }
          });
          return display;
        },

        // units
        showUnits: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( 
                ( b.cluster_id === 'eiewg' || b.cluster_id === 'fsac' || b.cluster_id === 'wash' ) ||
                ( b.activity_description_id && 
                ( b.activity_description_id.indexOf( 'education' ) > -1 ||
                  b.activity_description_id.indexOf( 'training' ) > -1 ||
                  b.activity_description_id.indexOf( 'cash' ) > -1 ||
                  b.activity_description_id.indexOf( 'in_kind' ) > -1 ) )
              ) {
              display = true;
            }
          });
          return display;
        },

        showUnitTypes: function( $data, $beneficiary ){
          var selected = [];
          $beneficiary.unit_type_id = $data;
          if($beneficiary.unit_type_id) {
            selected = $filter('filter')( $scope.project.lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
            if( selected.length ) {
              $beneficiary.unit_type_name = selected[0].unit_type_name;
            }
          }else{
            $beneficiary.unit_type_id = 'n_a';
            $beneficiary.unit_type_name = 'N/A';
          }
          return selected.length ? selected[0].unit_type_name : 'N/A';
        },

        // transfer_type_id
        showTransferTypes: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.transfer_type_id = $data;
          if($beneficiary.transfer_type_id) {
            selected = $filter('filter')( $scope.project.lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
            if( selected.length ) {
              $beneficiary.transfer_type_value = selected[0].transfer_type_value;
            }
          }else{
            $beneficiary.transfer_type_id = 0;
            $beneficiary.transfer_type_value = 0;
          }
          return selected.length ? selected[0].transfer_type_value : 0;
        },

        // esnfi
        showHouseholds: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.cluster_id === 'cvwg' || b.cluster_id === 'esnfi' || b.cluster_id === 'fsac' ){
              display = true;
            }
          });
          return display;
        },

        showFamilies: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.cluster_id === 'wash' || b.activity_type_id === 'nutrition_education_training' ){
              display = true;
            }
          });
          return display;
        },

        showMen: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( ( b.cluster_id !== 'nutrition' || b.activity_type_id === 'nutrition_education_training' ) && 
                b.activity_type_id !== 'mch' &&
                b.activity_type_id !== 'vaccination' && 
                b.activity_description_id !== 'antenatal_care' &&
                b.activity_description_id !== 'postnatal_care' &&
                b.activity_description_id !== 'skilled_birth_attendant' &&
                b.activity_description_id !== 'penta_3' &&
                b.activity_description_id !== 'measles' ){
              display = true;
            }
          });
          return display;
        },

        showWomen: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.activity_type_id !== 'vaccination' && 
                b.activity_description_id !== 'penta_3' &&
                b.activity_description_id !== 'measles' ){
              display = true;
            }
          });
          return display;
        },

        showEldMen: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.cluster_id !== 'eiewg' && 
                b.cluster_id !== 'nutrition' && 
                b.cluster_id !== 'wash' && 
                b.activity_type_id !== 'mch' &&
                b.activity_description_id !== 'antenatal_care' &&
                b.activity_description_id !== 'postnatal_care' &&
                b.activity_description_id !== 'skilled_birth_attendant' &&
                b.activity_type_id !== 'vaccination' && 
                b.activity_description_id !== 'penta_3' &&
                b.activity_description_id !== 'measles' ){
              display = true;
            }
          });
          return display;
        },

        showEldWomen: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.cluster_id !== 'eiewg' && 
                b.cluster_id !== 'nutrition' && 
                b.cluster_id !== 'wash' &&
                b.activity_type_id !== 'mch' &&
                b.activity_description_id !== 'antenatal_care' &&
                b.activity_description_id !== 'postnatal_care' &&
                b.activity_description_id !== 'skilled_birth_attendant' &&
                b.activity_type_id !== 'vaccination' && 
                b.activity_description_id !== 'penta_3' &&
                b.activity_description_id !== 'measles' ){
              display = true;
            }
          });
          return display;
        },

        // update inidcators
        updateInput: function( $index, indicator, $data ){
          $scope.project.definition.target_beneficiaries[ $index ][ indicator ] = $data;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.category_type_id && $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
                $data.households >= 0 && $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 && $data.elderly_men >= 0 && $data.elderly_women >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // save beneficiary
        saveBeneficiary: function() {
          // update location
          $scope.project.save( false, 'People in Need Saved!' );
        },

        // remove location from location list
        removeBeneficiaryModal: function( $index ) {
          // set location index
          $scope.project.beneficiaryIndex = $index;
          // open confirmation modal
          $( '#beneficiary-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary
        removeBeneficiary: function() {
          
          // get id
          var id = $scope.project.definition.target_beneficiaries[ $scope.project.beneficiaryIndex ].id;

          // remove from UI
          $scope.project.definition.target_beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          
          // send msg
          $timeout( function(){ Materialize.toast( 'People in Need Removed!' , 3000, 'success' ) }, 600 );
          
          // remove at db
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/removeBeneficiary',
            data: { id: id }
          }).success( function( result ) {

          }).error( function( err ) {
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },

        // add location
        addLocation: function() {
          $scope.inserted = {
            admin1pcode: null,
            admin1name: null,
            admin2pcode: null,
            admin2name: null,
            admin3pcode: null,
            admin3name: null,
            fac_type_id: null,
            fac_type_name: null,
            fac_name: null
          };

          // clone
          var length = $scope.project.definition.target_locations.length;
          if ( length ) {
            var l = angular.copy( $scope.project.definition.target_locations[ length - 1 ] );
            delete l.id;
            delete l.school_id;
            delete l.school_hub_id;
            delete l.school_hub_name;
            $scope.inserted = angular.merge( $scope.inserted, l, { fac_name: null } );
          }
         $scope.project.definition.target_locations.push( $scope.inserted );
        },

        showAdmin1: function($data, $location){
          var selected = [];
          $location.admin1pcode = $data;
          if($location.admin1pcode) {
            selected = $filter('filter')( $scope.project.lists.admin1, { admin1pcode: $location.admin1pcode }, true);
            delete selected[0].id;
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].admin1name : 'No Selection!';
        },

        // admin2
        showAdmin2: function($index, $data, $location){

          // filter admin2
          $scope.project.lists.admin2Select[$index] = 
                  $filter('filter')( $scope.project.lists.admin2, { admin1pcode: $scope.project.definition.target_locations[$index].admin1pcode }, true);

          // update admin2
          var selected = [];
          $location.admin2name = $data;
          if($location.admin2name) {
            selected = $filter('filter')( $scope.project.lists.admin2Select[$index], { admin2name: $location.admin2name }, true);
            if(selected[0]){
              delete selected[0].id;
              angular.merge($location, selected[0]);
            }
          }

          return selected.length ? selected[0].admin2name : 'No Selection!';
        },     

        // admin3
        showAdmin3: function($index, $data, $location){

          // filter admin3
          $scope.project.lists.admin3Select[$index] = 
                  $filter('filter')( $scope.project.lists.admin3, { admin2pcode: $scope.project.definition.target_locations[$index].admin2pcode }, true);

          var selected = [];
          $location.admin3name = $data;
          if($location.admin3name) {
            selected = $filter('filter')( $scope.project.lists.admin3Select[$index], { admin3name: $location.admin3name }, true);
            delete selected[0].id;
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].admin3name : 'No Selection!';
        },

        // new school?
        showYesNo: function($data, $location){
          var selected = [];
          $location.new_school_id = $data;
          if($location.new_school_id) {
            selected = $filter('filter')( $scope.project.lists.new_schools, { new_school_id: $location.new_school_id }, true);
            new_school_id = selected[0].new_school_id;
            new_school_name = selected[0].new_school_name;
          }
          return selected.length ? selected[0].new_school_name : 'No Selection!';
        },

        yesNoChange: function( $location ){
          delete $location.fac_name;
          delete $location.school_id;
          delete $location.school_hub_id;
          delete $location.school_hub_name;
        },

        // fac_type
        showFacType: function($data, $location){
          var selected = [];
          $location.fac_type_id = $data;
          if($location.fac_type_id) {
            selected = $filter('filter')( $scope.project.lists.facility_type, { fac_type_id: $location.fac_type_id }, true);
            delete selected[0].id;
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].fac_type_name : 'No Selection!';
        },

        // fac_name
        showName: function($data, $location){
          $location.fac_name = $data;
          return $location.fac_name ? $location.fac_name : '';
        },

        // school status
        showSchoolStatus: function($data, $location){
          var selected = [];
          $location.school_status_id = $data;
          if($location.school_status_id) {
            selected = $filter('filter')( $scope.project.lists.school_status, { school_status_id: $location.school_status_id }, true);
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].school_status_name : 'No Selection!';
        },

        // fac_type
        showSchoolType: function($data, $location){
          var selected = [];
          $location.fac_type_id = $data;
          if($location.fac_type_id) {
            selected = $filter('filter')( $scope.project.lists.school_type, { fac_type_id: $location.fac_type_id }, true);
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].fac_type_name : 'No Selection!';
        },

        // show the label heading
        showSchoolNameLabel: function(){
          var display = false;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ) {
            if ( d.new_school_id ) {
              display = true;
            }
          });
          return display;
        },

        // show the label heading
        showHubSchoolNameLabel: function(){
          var display = false;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ) {
            if ( d.school_status_id === 'informal' ) {
              display = true;
            }
          });
          return display;
        },

        // show schools
        showSchools: function($index, $data, $location){

          var selected = [];
          $location.school_id = $data;
          if( $location.school_id && $scope.project.lists.schools[$index] ) {
            selected = $filter('filter')( $scope.project.lists.schools[$index], { school_id: $location.school_id }, true);
            if (selected.length) {
              $location.school_id = selected[0].school_id;
              $location.fac_name = selected[0].fac_name;
              $location.admin2lng = selected[0].admin2lng;
              $location.admin2lat = selected[0].admin2lat;
            }
          }
          return $location.fac_name ? $location.fac_name : 'No Selection!';
        },

        // hub school
        showHubSchools: function($index, $data, $location){
          var selected = [];
          $location.school_hub_id = $data;
          if( $location.school_hub_id && $scope.project.lists.hub_schools[$index] ) {
            selected = $filter('filter')( $scope.project.lists.hub_schools[$index], { school_id: $location.school_hub_id }, true);
            if (selected.length) {
              $location.school_hub_id = selected[0].school_id;
              $location.school_hub_name = selected[0].fac_name;
            }
          }
          return $location.school_hub_name;
        },

        // load schools
        loadSchools: function( $index, $data, $target_location ){

          // reset
          // remove any existing records if only on client
          if (!$target_location.id) {
            $scope.project.lists.schools[$index] = [];
            $scope.project.lists.hub_schools[$index] = [];
            delete $target_location.fac_name;
            delete $target_location.school_id;
            delete $target_location.school_hub_id;
            delete $target_location.school_hub_name;
          }

          // set lists  
            // timeout will enable admin2 to be selected (if user changes admin2 retrospectively)
          $timeout(function(){
            if ( $target_location.admin1pcode && $target_location.admin2name ) {
              if( !$target_location.id ){
                Materialize.toast( 'Loading Schools!' , 6000, 'note' );
              }
              $http({ 
                method: 'GET', url: 'http://' + $location.host() + '/api/location/getAdmin2Schools?admin1pcode=' + $target_location.admin1pcode + '&admin2name=' + $target_location.admin2name
              }).success( function( result ) {
                if ( $target_location.admin1pcode && $target_location.admin2name && !result.length ) {
                  Materialize.toast( 'No Schools for ' + $target_location.admin1name +', ' + $target_location.admin2name + '!' , 6000, 'success' );
                }
                $scope.project.lists.schools[$index] = result;
                $scope.project.lists.hub_schools[$index] = result;
              }).error( function( err ) {
                Materialize.toast( 'Schools List Error!', 6000, 'error' );
              });
            }
          }, 200 );
        },

        // location edit
        locationEdit: function( $index ) {
          $scope.project.definition.target_locations[ $index ].update_location = true;
        },

        // save location
        saveLocation: function() {
          // update location
          $scope.project.save( false, 'Project Location Saved!' );
        },

        // remove from array if no id
        cancelEdit: function( key, $index ) {
          if ( !$scope.project.definition[ key ][ $index ].id ) {
            $scope.project.definition[ key ].splice( $index, 1 );
          }
        },

        // remove location from location list
        removeLocationModal: function( $index ) {
          // set location index
          $scope.project.locationIndex = $index;
          // open confirmation modal
          $( '#location-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary
        removeLocation: function() {
          
          // get id
          var id = $scope.project.definition.target_locations[ $scope.project.locationIndex ].id;
          
          // remove from UI
          $scope.project.definition.target_locations.splice( $scope.project.locationIndex, 1 );
          
          // send msg
          $timeout( function(){ Materialize.toast( 'Project Location Removed!' , 3000, 'success' ) }, 600 );
          
          // remove at db
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/removeLocation',
            data: { id: id }
          }).success( function( result ) {

          }).error( function( err ) {
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },

        // validate project type
        project_details_valid: function () {
          // valid
          var valid = false;
          if(
            $scope.project.definition.project_title &&
            $scope.project.definition.project_start_date &&
            $scope.project.definition.project_end_date &&
            // $scope.project.definition.project_budget >= 0 &&
            $scope.project.definition.project_budget_currency &&
            $scope.project.definition.project_status &&
            $scope.project.definition.project_description
          ){
            valid = true;
          }
          return valid;
        },

        // validate if ONE activity type
        activity_type_valid: function () {
          // valid
          var valid = false;
          // compile activity_description
          angular.forEach( $scope.project.definition.activity_type_check, function( d, i ) {
            // check if selected
            if ( d ){
              valid = true;
            }
          });
          return valid;
        },

        // validate project donor
        project_donor_valid: function () {
          // valid
          var valid = false;
          // compile activity_description
          angular.forEach( $scope.project.definition.project_donor_check, function( d, i ){
            // check if selected
            if ( d ){
              valid = true;
            }
          });
          return valid;
        },

        // validate if ALL target beneficairies valid
        target_beneficiaries_valid: function(){
          var rowComplete = 0;
          angular.forEach( $scope.project.definition.target_beneficiaries, function( d, i ){
            if ( !$scope.project.rowSaveDisabled(d) ){
              rowComplete++;
            }
          });
          if( rowComplete >= $scope.project.definition.target_beneficiaries.length ){
            return true;
          } else {
            return false;  
          }
        },

        // validate id ALL target locations valid
        target_locations_valid: function(){
          var rowComplete = 0;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ){
            if ( d.admin1pcode && d.admin1name && d.admin2pcode && d.admin2name && d.fac_name ){
              rowComplete++;
            }
            // hack for eiewg
            if ( d.school_status_id && d.school_status_id === 'informal' && !d.school_hub_id ) {
              rowComplete--;
            }
          });
          if( rowComplete >= $scope.project.definition.target_locations.length ){
            return true;
          } else {
            return false;  
          }
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          // $scope.clusterProjectForm.$dirty ?
              // $( '#' + modal ).openModal( { dismissible: false } ) : $scope.project.cancel();
          $scope.project.cancel();
        },

        // compile cluster activities
        compileInterClusterActivities: function(){

          $scope.project.definition.inter_cluster_activities = [];
          angular.forEach( $scope.project.definition.inter_cluster_check, function( t, key ){
            if ( t ) {
              var cluster = $filter( 'filter' )( $scope.project.lists.clusters, { cluster_id: key }, true)[0];
              if ( cluster ) {
                $scope.project.definition.inter_cluster_activities.push( { cluster_id: cluster.cluster_id, cluster: cluster.cluster } );
              }
            } else {
              // turn off ?
              var activity_type = [];
              angular.forEach( $scope.project.definition.activity_type, function( obj, i ) {
                if ( obj.cluster_id === key ){
                  $scope.project.definition.activity_type_check[ obj.activity_type_id ] = false;
                } else{
                  activity_type.push(obj);
                }
              });
            }
          });
          $scope.project.compileStrategicObjectives();
          $scope.project.compileActivityType();
        },

        // strategic objectives
        compileStrategicObjectives: function( $index ){
          
          var strategic_objectives = [];

          // each SO
          angular.forEach( $scope.project.definition.strategic_objectives_check, function( key, so ){

            if ( key ) {
              // default
              var objective = $filter('filter')( $scope.project.lists.strategic_objectives[ $scope.project.definition.cluster_id ], { objective_type_id: so }, true );
              if( objective[0] ){
                strategic_objectives.push( objective[0] );
              }

              // intercluster
              angular.forEach( $scope.project.definition.inter_cluster_activities, function( d, i ){
                var objective = $filter('filter')( $scope.project.lists.strategic_objectives[ d.cluster_id ], { objective_type_id: so }, true );
                if( objective[0] ){
                  strategic_objectives.push( objective[0] );
                }
              });
            }

          });

          $scope.project.definition.strategic_objectives = strategic_objectives;

        },

        // compile mpc cash purpose
        compileMpcPurpose: function() {

          // db attributes
          $scope.project.definition.mpc_purpose = [];
          $scope.project.definition.mpc_purpose_cluster_id = '';

          // mpc purpose
          angular.forEach( $scope.project.definition.mpc_purpose_check, function( t, key ){
            if ( t ) {
              var a_type = $filter( 'filter' )( $scope.project.lists.mpc_purpose, { mpc_purpose_type_id: key }, true)[0];
              if ( a_type ) {
                $scope.project.definition.mpc_purpose.push( a_type );
                $scope.project.definition.mpc_purpose_cluster_id += a_type.cluster_id + ', ';
              }
            }
          });

          // trim last character of string
          $scope.project.definition.mpc_purpose_cluster_id = $scope.project.definition.mpc_purpose_cluster_id.slice( 0, -2 );

        },

        // compile activity_type 
        compileActivityType: function(){
          
          // update
          $scope.project.lists.activity_types = ngmClusterHelper.getActivities( $scope.project.definition, true, true );
          $scope.project.lists.activity_descriptions = ngmClusterHelper.getActivities( $scope.project.definition, true, false );

          // filter
          $scope.project.definition.activity_type = [];
          angular.forEach( $scope.project.definition.activity_type_check, function( t, key ){
            if ( t ) {
              var a_type = $filter( 'filter' )( $scope.project.lists.activity_types, { activity_type_id: key }, true)[0];
              if ( a_type ) {
                $scope.project.definition.activity_type.push( { cluster_id: a_type.cluster_id, cluster: a_type.cluster, activity_type_id: a_type.activity_type_id, activity_type_name: a_type.activity_type_name } );
              }
            }
          });

        },

        // compile project_donor
        compileDonor: function(){
          $scope.project.definition.project_donor = [];
          angular.forEach( $scope.project.definition.project_donor_check, function( d, key ){
            if ( d ) {
              var donor = $filter( 'filter' )( $scope.project.lists.donors, { project_donor_id: key }, true)[0];
              $scope.project.definition.project_donor.push( donor );
            }
            // focus on select
            if ( key === 'other' && d ) {
              $( '#ngm-project-project_donor_other' ).focus();
            }
            // remove if un-selected
            if ( key === 'other' && !d ) {
              $scope.project.definition.project_donor_other = '';
            }
          });
        },

        // save project
        save: function( display_modal, save_msg ){

          // disable btn
          $scope.project.submit = false;




          // groups
          $scope.project.definition.category_type = [];
          $scope.project.definition.beneficiary_type = [];
          $scope.project.definition.admin1pcode = [];
          $scope.project.definition.admin2pcode = [];
          $scope.project.definition.admin3pcode = [];

          // parse budget
          $scope.project.definition.project_budget += '';
          $scope.project.definition.project_budget = $scope.project.definition.project_budget.replace(',', '');
          $scope.project.definition.project_budget = parseFloat( $scope.project.definition.project_budget );

          // add target_beneficiaries to projects
          angular.forEach( $scope.project.definition.target_beneficiaries, function( b, i ){
            
            // update target_beneficiaries
            $scope.project.definition.target_beneficiaries[i] = 
                  ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.definition.target_beneficiaries[i] );
            
            // add distinct
            var found = $filter('filter')( $scope.project.definition.category_type, { category_type_id: b.category_type_id }, true);
            if ( !found.length ){
              $scope.project.definition.category_type.push( { category_type_id: b.category_type_id, category_type_name: b.category_type_name } );
            }
            var found = $filter('filter')( $scope.project.definition.beneficiary_type, { beneficiary_type_id: b.beneficiary_type_id }, true);
            if ( !found.length ){
              $scope.project.definition.beneficiary_type.push( { beneficiary_type_id: b.beneficiary_type_id, beneficiary_type_name: b.beneficiary_type_name } );
            }
            
          });

          // add target_locations to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){
            
            // push update activities
            $scope.project.definition.target_locations[i] = 
                  ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.definition.target_locations[i] );
            
            // add distinct
            var found = $filter('filter')( $scope.project.definition.admin1pcode, { admin1pcode: l.admin1pcode }, true);
            if ( !found.length ){
              $scope.project.definition.admin1pcode.push( { admin1pcode: l.admin1pcode, admin1name: l.admin1name } );
            }
            var found = $filter('filter')( $scope.project.definition.admin2pcode, { admin2pcode: l.admin2pcode }, true);
            if ( !found.length ){
              $scope.project.definition.admin2pcode.push( { admin2pcode: l.admin2pcode, admin2name: l.admin2name } );
            }
            if ( $scope.project.lists.admin3.length ) {
              var found = $filter('filter')( $scope.project.definition.admin3pcode, { admin3pcode: l.admin3pcode }, true);
              if ( !found.length ){
                $scope.project.definition.admin3pcode.push( { admin3pcode: l.admin3pcode, admin3name: l.admin3name } );
              }
            }

          });


          // update target_beneficiaries
          $scope.project.definition.target_beneficiaries = 
              ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.project.definition.target_beneficiaries );

          // update target_locations
          $scope.project.definition.target_locations = 
              ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.definition.target_locations );




          
          // inform
          Materialize.toast( 'Processing...', 6000, 'note' );

          // details update
          $http({
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/project/setProject',
            data: {
              project: $scope.project.definition
            }
          }).success( function( project ){

            // enable
            $scope.project.submit = true;

            if ( project.err ) {
              Materialize.toast( 'Save failed! The project contains errors!', 6000, 'error' );
            }

            if ( !project.err ) {

              // add id to client json
              $scope.project.definition = angular.merge( $scope.project.definition, project );
              $scope.project.definition.update_dates = false;
              
              // location / beneficiary
              if( save_msg ){
                $timeout( function(){ Materialize.toast( save_msg , 3000, 'success' ); }, 600 );
              }
              
              // notification modal
              if( display_modal ){

                // modal-trigger
                $('.modal-trigger').leanModal();
                
                // new becomes active!
                var msg = $route.current.params.project === 'new' ? 'Project Created!' : 'Project Updated!';

                // update
                $timeout(function(){
                  // redirect + msg
                  $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
                  $timeout(function(){ Materialize.toast( msg, 3000, 'success' ); }, 600 );
                }, 400 );
              }
            }

          }).error(function( err ) {
            // error
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // path / msg
            var path = $scope.project.definition.project_status === 'new' ? '/cluster/projects' : '/cluster/projects/summary/' + $scope.project.definition.id;
            var msg = $scope.project.definition.project_status === 'new' ? 'Create Project Cancelled!' : 'Project Update Cancelled!';
            // redirect + msg
            $location.path( path );
            $timeout(function() { Materialize.toast( msg, 3000, 'note' ); }, 400 );
          }, 400 );

        }   

      }

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // set HRP if SOs selected
          if ( $scope.project.definition.strategic_objectives && 
                $scope.project.definition.strategic_objectives.length && 
                $scope.project.definition.admin0pcode === 'AF' ) {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'HRP' );
          }

          // reset to cover updates
          if ( !$scope.project.definition.project_hrp_code ){
            $scope.project.definition.project_hrp_code = 
                      ngmClusterHelper.getProjectHrpCode( $scope.project.definition );      
          }

          // add activity type check box list
          if ( $scope.project.definition.inter_cluster_activities ) {
            $scope.project.definition.inter_cluster_check = {};
            angular.forEach( $scope.project.definition.inter_cluster_activities, function( d, i ){
              if ( d ){
                $scope.project.definition.inter_cluster_check[ d.cluster_id ] = true;
              }
            });
          }

          // add activity type check box list
          if ( $scope.project.definition.activity_type ) {
            $scope.project.definition.activity_type_check = {};
            angular.forEach( $scope.project.definition.activity_type, function( d, i ){
              if ( d ){
                $scope.project.definition.activity_type_check[ d.activity_type_id ] = true;
              }
            });
          }

          // if Cash
          if ( $scope.project.definition.cluster_id === 'cvwg' ) {

            // set only option to true
            if ( !$scope.project.definition.activity_type ) {
              $scope.project.definition.activity_type_check = {
                'cvwg_multi_purpose_cash': true
              };
            }
            // compile activity type
            $scope.project.compileActivityType();
            // add project donor check box list
            if ( $scope.project.definition.mpc_purpose ) {
              $scope.project.definition.mpc_purpose_check = {};
              angular.forEach( $scope.project.definition.mpc_purpose, function( d, i ){
                if ( d ){
                  $scope.project.definition.mpc_purpose_check[ d.mpc_purpose_type_id ] = true;
                }
              });
            }

          }

          // add project donor check box list
          if ( $scope.project.definition.mpc_delivery_type ) {
            $scope.project.definition.mpc_delivery_type_check = {};
            angular.forEach( $scope.project.definition.mpc_delivery_type, function( d, i ){
              if ( d ){
                $scope.project.definition.mpc_delivery_type_check[ d.delivery_type_id ] = true;
              }
            });
          }

          // add project donor check box list
          if ( $scope.project.definition.project_donor ) {
            $scope.project.definition.project_donor_check = {};
            angular.forEach( $scope.project.definition.project_donor, function( d, i ){
              if ( d ){
                $scope.project.definition.project_donor_check[ d.project_donor_id ] = true;
              }
            });
          }

          // add SOs check box list
          if ( $scope.project.definition.strategic_objectives ) {
            $scope.project.definition.strategic_objectives_check = {};
            angular.forEach( $scope.project.definition.strategic_objectives, function( d, i ){
              if ( d ){
                $scope.project.definition.strategic_objectives_check[ d.objective_type_id ] = true;
              }
            });
          }
          
        }, 1000 );

      });
  }

]);
