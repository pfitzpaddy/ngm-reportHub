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
    'ngmAuth',
    'ngmData',
    'ngmClusterHelper',
    'ngmClusterHelperAf',
    'ngmClusterHelperForm',
    'ngmClusterHelperTargetBeneficiaries',
    'ngmClusterHelperTargetLocations',
    'config',
    function( 
        $scope, 
        $location, 
        $timeout,
        $filter,
        $q,
        $http,
        $route,
        ngmUser,
        ngmAuth,
        ngmData,
        ngmClusterHelper,
        ngmClusterHelperAf,
        ngmClusterHelperForm,
        ngmClusterHelperTargetBeneficiaries,
        ngmClusterHelperTargetLocations,
        config ){

      // set default
      if( !config.project.project_budget_currency ){
        config.project.project_budget_currency = 'usd';
      }

      // project
      $scope.project = {

        // attr
        user: ngmUser.get(),
        style: config.style,
        submit: true,
        newProject: $route.current.params.project === 'new' ? true : false,
        definition: config.project,
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),
        indicators: ngmClusterHelper.getIndicators( true ),
        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],

        // lists
        lists: {

          // users
          users: [],
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          units: ngmClusterHelper.getUnits( config.project.admin0pcode ),
          delivery_types: ngmClusterHelper.getDeliveryTypes(),
          mpc_purpose: ngmClusterHelper.getMpcPurpose(),
          mpc_delivery_types: ngmClusterHelper.getMpcDeliveryTypes(),

          // lists
          transfers: ngmClusterHelper.getTransfers( 30 ),
          clusters: ngmClusterHelper.getClusters( config.project.admin0pcode ),
          activity_types: ngmClusterHelper.getActivities( config.project, true, true ),
          activity_descriptions: ngmClusterHelper.getActivities( config.project, true, false ),
          strategic_objectives: ngmClusterHelper.getStrategicObjectives(config.project.admin0pcode, moment(config.project.project_start_date).year(), moment(config.project.project_end_date).year() ),
          category_types: ngmClusterHelper.getCategoryTypes(),
          beneficiary_types: moment( config.project.project_end_date ).year() === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries( config.project.admin0pcode ),
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          donors: ngmClusterHelper.getDonors( config.project.admin0pcode, config.project.cluster_id ),
          
          // lists on load
          admin1: localStorage.getObject( 'lists' ).admin1List,
          admin2: localStorage.getObject( 'lists' ).admin2List,
          admin3: localStorage.getObject( 'lists' ).admin3List,
          // master list for sites fetch on admin1 change
          adminSites:[],
         
          // this is for row by row filters
          admin2Select: [],
          admin3Select: [],
          adminSitesSelect: [],
          site_implementation: ngmClusterHelper.getSiteImplementation( config.project.admin0pcode, config.project.cluster_id ),
          site_list_select:[{ site_list_select_id: 'yes', site_list_select_name: 'Yes'},{ site_list_select_id: 'no', site_list_select_name: 'No'}],
          site_type: ngmClusterHelper.getSiteTypes( config.project.cluster_id, config.project.admin0pcode ),

          // eiewg
          schools:[],
          hub_schools: [],
          hub_sites: [],
          new_site:[{ new_site_id: 'yes', new_site_name: 'Yes' },{ new_site_id: 'no', new_site_name: 'No' }]

        },

        // url
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',

        // templates
        detailsUrl: 'details.html',
        strategicObjectivesUrl: 'strategic-objectives.html',
        
        // targets
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        contactDetailsUrl: 'contact-details.html',
        locationsUrl: config.project.cluster_id === 'eiewg' ? 'target-locations/locations-eiewg.html' : 'target-locations/locations.html',



        /**** FORM ****/


        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.update_dates = true;
            // set new start / end date
            $scope.project.definition.project_start_date = moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');
            // get strategic objectives
            $scope.project.lists.strategic_objectives =  ngmClusterHelper.getStrategicObjectives($scope.project.definition.admin0pcode,
              moment( new Date( $scope.project.definition.project_start_date ) ).year(), moment( new Date( $scope.project.definition.project_end_date ) ).year() )
          }
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          $scope.project.cancel();
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
        },

        // remove from array if no id
        cancelEdit: function( key, $index ) {
          if ( !$scope.project.definition[ key ][ $index ].id ) {
            $scope.project.definition[ key ].splice( $index, 1 );
          }
        },

        // set new project user
        updateContactUser: function( $data ) {
          var user = $filter('filter')($scope.project.lists.users, { username: $data.username }, true)[0];
          $scope.project.updateContact( user );
        },

        // update project user values
        updateContact: function( touser ) {
          if ( touser ) {
            $scope.project.definition.username = touser.username;
            $scope.project.definition.name = touser.name;
            $scope.project.definition.email = touser.email;
            $scope.project.definition.position = touser.position;
            $scope.project.definition.phone = touser.phone;
          }
        },

        // toggle for HRP status
        setHrpStatus: function() {
          // set true / false
          $scope.project.definition.project_hrp_project = !$scope.project.definition.project_hrp_project;
          // set hrp in project_hrp_code
          if( $scope.project.definition.project_hrp_project ) {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'HRP' );
          } else {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'HRP', 'OTH' );
          }
        },



        /**** AFGHANISTAN ( ngmClusterHelperAf.js ) ****/


        // update organization if acbar partner
        updateAcbarOrganization: function(){
          ngmClusterHelperAf.updateAcbarOrganization( $scope.project.definition );
        },

        // strategic objectives
        setStrategicObjectives: function( cluster_id ) {
          $scope.project.definition.strategic_objectives = 
                  ngmClusterHelperAf.setStrategicObjectives( $scope.project.definition, $scope.project.lists, cluster_id );
        },

        // strategic objective years
        getSOyears: function(){
          return Object.keys( $scope.project.lists.strategic_objectives );
        },

        // preps for 2018 #TODO delete
        categoryShow2017: function(){
          return moment()<moment('2018-02-01')
        },

        // injury sustained same province field
        showFatpTreatmentSameProvince: function(){
          return ngmClusterHelperAf.showFatpTreatmentSameProvince( $scope.project.definition );
        },

        // treatment same province
        showTreatmentSameProvince: function ( $data, $beneficiary ) {
          return ngmClusterHelperAf.showTreatmentSameProvince( $data, $beneficiary );
        },



        /**** TARGET BENEFICIARIES ( ngmClusterHelperTargetBeneficiaries.js ) ****/


        // update inidcators
        updateInput: function( $index, indicator, $data ){
          $scope.project.definition.target_beneficiaries[ $index ][ indicator ] = $data;
        },

        // add beneficiary
        addBeneficiary: function() {
          $scope.inserted = ngmClusterHelperTargetBeneficiaries.addBeneficiary( $scope.project.definition.target_beneficiaries );
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
        },

        // remove beneficiary from list
        removeBeneficiaryModal: function( $index ) {
          $scope.project.beneficiaryIndex = $index;
          $( '#beneficiary-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary from db
        removeBeneficiary: function() {
          var id = $scope.project.definition.target_beneficiaries[ $scope.project.beneficiaryIndex ].id;
          $scope.project.definition.target_beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          ngmClusterHelperTargetBeneficiaries.removeBeneficiary( id );
        },

        // activity
        showActivity: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showActivity( $scope.project.definition, $data, $beneficiary );
        },

        // description
        showDescription: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showDescription( $scope.project.lists, $data, $beneficiary );
        },

        // cash delivery
        showCashDelivery: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showCashDelivery( $scope.project.lists, $data, $beneficiary );
        },

        // package types
        showPackageTypes: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showPackageTypes( $data, $beneficiary );
        },

        // category
        showCategory: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showCategory( $scope.project.lists, $data, $beneficiary );
        },

        // beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showBeneficiary( $scope.project.lists, $data, $beneficiary );
        },

        // delivery
        showDelivery: function( $data, $beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.showDelivery( $scope.project.lists, $data, $beneficiary );
        },

        // cash
        showCash: function() {
          return ngmClusterHelperTargetBeneficiaries.showCash( $scope.project.definition );
        },

        // package
        showPackage: function() {
          return ngmClusterHelperTargetBeneficiaries.showPackage( $scope.project.definition );
        },

         // package
        enablePackage: function( beneficiary ) {
          return ngmClusterHelperTargetBeneficiaries.enablePackage( beneficiary );
        },

        // units
        showUnits: function(){
          return ngmClusterHelperTargetBeneficiaries.showUnits( $scope.project.definition );
        },

        // unit type
        showUnitTypes: function( $data, $beneficiary ){
          return ngmClusterHelperTargetBeneficiaries.showUnitTypes( $scope.project.lists, $data, $beneficiary );
        },

        // transfer type
        showTransferTypes: function( $data, $beneficiary ){
          return ngmClusterHelperTargetBeneficiaries.showTransferTypes( $scope.project.lists, $data, $beneficiary );
        },

        // hhs
        showHouseholds: function(){
          return ngmClusterHelperTargetBeneficiaries.showHouseholds( $scope.project.definition );
        },

        // families
        showFamilies: function(){
          return ngmClusterHelperTargetBeneficiaries.showFamilies( $scope.project.definition );
        },

        // men
        showMen: function(){
          return ngmClusterHelperTargetBeneficiaries.showMen( $scope.project.definition );
        },

        // women
        showWomen: function(){
          return ngmClusterHelperTargetBeneficiaries.showWomen( $scope.project.definition );
        },

        // eld men
        showEldMen: function(){
          return ngmClusterHelperTargetBeneficiaries.showEldMen( $scope.project.definition );
        },

        // eld women
        showEldWomen: function(){
          return ngmClusterHelperTargetBeneficiaries.showEldWomen( $scope.project.definition );
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterHelperTargetBeneficiaries.rowSaveDisabled( $data );
        },

        // save beneficiary
        saveBeneficiary: function() {
          $scope.project.save( false, 'People in Need Saved!' );
        },



        /**** TARGET LOCATIONS ( ngmClusterHelperTargetLocations.js ) ****/


        // add location
        addLocation: function() {
          $scope.inserted = ngmClusterHelperTargetLocations.addLocation( $scope.project.definition );
          $scope.project.definition.target_locations.push( $scope.inserted );
        },

        // location edit
        locationEdit: function( $index ) {
          $scope.project.definition.target_locations[ $index ].update_location = true;
        },

        // save location
        saveLocation: function() {
          $scope.project.save( false, 'Project Location Saved!' );
        },

        // remove location from location list
        removeLocationModal: function( $index ) {
          $scope.project.locationIndex = $index;
          $( '#location-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary
        removeLocation: function() {
          ngmClusterHelperTargetLocations.removeLocation( $scope.project.definition, $scope.project.locationIndex );
        },

        // project focal point
        showReporter: function( $data, target_location ){
          return ngmClusterHelperTargetLocations.showReporter( $scope.project.lists, $data, target_location )
        },

        // site implementation
        showSiteImplementation: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showSiteImplementation( $scope.project.lists, $index, $data, target_location );
        },

        // admin1
        showAdmin1: function( $data, target_location ){
          return ngmClusterHelperTargetLocations.showAdmin1( $scope.project.lists, $data, target_location );
        },

        // fetch lists
        getAdminSites: function( target_location ){
          ngmClusterHelperTargetLocations.getAdminSites( $scope.project.lists, target_location );
        },

        // show admin2
        showAdmin2: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showAdmin2( $scope.project.lists, $index, $data, target_location );
        },

        // show admin3
        showAdmin3: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showAdmin3( $scope.project.lists, $index, $data, target_location );
        },

        // site_type
        showSiteType: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showSiteType( $scope.project.lists, $index, $data, target_location );
        },

        // on change
        siteTypeOnChange: function( $index, $data, target_location ){
          $timeout(function() {
            ngmClusterHelperTargetLocations.siteTypeOnChange( $scope.project.lists, $index, $data, target_location );
          }, 0 );
        },

        // select from list?
        showListYesNo: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showListYesNo( $scope.project, $index, $data, target_location );
        },

        // yes/no
        yesNoOnChange: function( target_location ){
          target_location.site_name = null;
          target_location.site_id = null ;
        },

        // show sites
        showAdminSites: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showAdminSites( $scope.project.lists, $index, $data, target_location );
        },

        // site_name
        showSiteName: function( $data, target_location ){
          if( $data ) { target_location.site_name = $data; }
          return target_location.site_name ? target_location.site_name : '';
        },



        /****** EiEWG ( ngmClusterHelperAf.js ) ************/


        showYesNo: function( $index, $data, target_location ){
          return ngmClusterHelperAf.showYesNo( $scope.project.lists, $index, $data, target_location );
        },

        showSchoolNameLabel: function( project ){
          return ngmClusterHelperAf.showSchoolNameLabel( $scope.project.definition );
        },

        showHubSchoolNameLabel: function( project ){
          return ngmClusterHelperAf.showHubSchoolNameLabel( $scope.project.definition );
        },

        showSchools: function( $index, $data, target_location ){
          return ngmClusterHelperAf.showSchools( $scope.project.lists, $index, $data, target_location );
        },

        showHubSchools: function( $index, $data, target_location ){
          return ngmClusterHelperAf.showHubSchools( $scope.project.lists, $index, $data, target_location );
        },

        loadSchools: function( $index, $data, target_location ){
          ngmClusterHelperAf.loadSchools( $scope.project.lists, $index, $data, target_location );
        },



        /**** CLUSTER HELPER ( ngmClusterHelper.js ) ****/


        // compile cluster activities
        compileInterClusterActivities: function(){
          ngmClusterHelper.compileInterClusterActivities( $scope.project.definition, $scope.project.lists );
        },

        // compile cluster activities
        compileMpcPurpose: function(){
          ngmClusterHelper.compileMpcPurpose( $scope.project.definition, $scope.project.lists );
        },

        // compile activity_type
        compileActivityType: function(){
          ngmClusterHelper.compileActivityType( $scope.project.definition, $scope.project.lists );
        },

        // compile project_donor
        compileDonor: function(){
          ngmClusterHelper.compileDonor( $scope.project.definition, $scope.project.lists );
        },



        /**** FORM ( ngmClusterHelperForm.js ) ****/


        // validate project type
        project_details_valid: function() {
          return ngmClusterHelperForm.project_details_valid( $scope.project.definition );
        },

        // validate if ONE activity type
        activity_type_valid: function() {
          return ngmClusterHelperForm.activity_type_valid( $scope.project.definition );
        },

        // validate project donor
        project_donor_valid: function() {
          return ngmClusterHelperForm.project_donor_valid( $scope.project.definition );
        },

        // validate if ALL target beneficairies valid
        target_beneficiaries_valid: function(){
          return ngmClusterHelperForm.target_beneficiaries_valid( $scope.project.definition );
        },

        // validate id ALL target locations valid
        target_locations_valid: function(){
          return ngmClusterHelperForm.target_locations_valid( $scope.project.definition );
        },

        // validate form
        validate: function(){
          ngmClusterHelperForm.validate( $scope.project.definition );
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

            // add categories
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
            url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
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

        }

      }


      // set org users
      ngmClusterHelper.setOrganizationUsers( $scope.project.lists, config.project );

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

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
                $scope.project.definition.strategic_objectives_check[ d.objective_type_id + ':' + (d.objective_year?d.objective_year:'') ] = true;
              }
            });
          }

          // fetch lists for project details
          if ( $scope.project.definition.id ) {
            angular.forEach( $scope.project.definition.target_locations, function( t, i ){
              if ( t ){
                $scope.project.getAdminSites( t );
              }
            });
          }

        }, 1000 );

      });
  }

]);
