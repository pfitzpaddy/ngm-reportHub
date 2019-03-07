/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormDetailsCtrl
 * @description
 * # ClusterProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.details', [ 'ngm.provider' ])
  .config( function( dashboardProvider){

    

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
    'ngmClusterLists',
    'ngmClusterHelper',
    'ngmClusterBeneficiaries',
    'ngmClusterLocations',
    'ngmClusterValidation',
    'ngmClusterHelperAf',
    'config', '$translate',
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
        ngmClusterLists,
        ngmClusterHelper,
        ngmClusterBeneficiaries,
        ngmClusterLocations,
        ngmClusterValidation,
        ngmClusterHelperAf,
        config,$translate){

      // project
      $scope.project = {

        // defaults
        user: ngmUser.get(),
        style: config.style,
        submit: true,
        newProject: $route.current.params.project === 'new' ? true : false,
        definition: config.project,
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // lists ( project, mpc transfers )
        lists: ngmClusterLists.setLists( config.project, 30 ),
        
        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.update_dates = true;
            // set new start / end date
            $scope.project.definition.project_start_date = 
                moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = 
                moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');
            // get strategic objectives
            $scope.project.lists.strategic_objectives =  
                  ngmClusterLists.getStrategicObjectives($scope.project.definition.admin0pcode,
                    moment( new Date( $scope.project.definition.project_start_date ) ).year(), 
                    moment( new Date( $scope.project.definition.project_end_date ) ).year() )
          }
        },


        /**** TEMPLATES ****/

        // url
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',
        // details
        detailsUrl: 'details.html',
        strategicObjectivesUrl: 'strategic-objectives.html',
        contactDetailsUrl: 'contact-details.html',
        // targets
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        locationsUrl: 'target-locations/locations.html',
        locationsAddUrl: 'target-locations/add.location.html',


        // init lists
        init: function() {
          // usd default currency
          if( !$scope.project.definition.project_budget_currency ){
            $scope.project.definition.project_budget_currency = 'usd';
          }
          // set org users
          ngmClusterLists.setOrganizationUsersList( $scope.project.lists, config.project );
          // set form on page load
          ngmClusterHelper.setForm( $scope.project.definition, $scope.project.lists );
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
            $timeout( function() { Materialize.toast( msg, 3000, 'note' ); }, 400 );
          }, 400 );
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

        // injury sustained same province as field hospital
        showFatpTreatmentSameProvince: function(){
          return ngmClusterHelperAf.showFatpTreatmentSameProvince( $scope.project.definition.target_beneficiaries );
        },

        // treatment same province
        showTreatmentSameProvince: function ( $data, $beneficiary ) {
          return ngmClusterHelperAf.showTreatmentSameProvince( $data, $beneficiary );
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
          ngmClusterHelperAf.loadSchools( $scope.project.lists, $index, $data, $scope.project.definition.admin0pcode, target_location );
        },        


        /**** TARGET BENEFICIARIES ( ngmClusterHelperBeneficiaries.js ) ****/

        // update inidcators
        updateInput: function( $index, indicator, $data ){
          $scope.project.definition.target_beneficiaries[ $index ][ indicator ] = $data;
        },

        // add beneficiary
        addBeneficiary: function() {
          $scope.inserted = ngmClusterBeneficiaries.addBeneficiary( $scope.project.definition.target_beneficiaries );
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
        },

        // remove beneficiary from list
        removeTargetBeneficiaryModal: function( $index ) {
          $scope.project.beneficiaryIndex = $index;
          $( '#beneficiary-modal' ).openModal({ dismissible: false });
        },

        // remove beneficiary from db
        removeTargetBeneficiary: function() {
          var id = $scope.project.definition.target_beneficiaries[ $scope.project.beneficiaryIndex ].id;
          $scope.project.definition.target_beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          ngmClusterBeneficiaries.removeTargetBeneficiary( id );
        },

        // activity
        showActivity: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showActivity( $scope.project.definition, $data, $beneficiary, true );
        },

        // description
        showDescription: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showDescription( $scope.project.lists, $data, $beneficiary );
        },

        // details
        showDetails: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showDetails( $scope.project.lists, $data, $beneficiary );
        },

        // cash delivery
        showCashDelivery: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showCashDelivery( $scope.project.lists, $data, $beneficiary );
				},

				//cash mechanism
				showCashMechanism: function ($data, $beneficiary) {
					return ngmClusterBeneficiaries.showCashMechanism($scope.project.lists, $data, $beneficiary);
				},

        // package types
        showPackageTypes: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showPackageTypes( $data, $beneficiary );
        },

        // category
        showCategory: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showCategory( $scope.project.lists, $data, $beneficiary );
        },

        // beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showBeneficiary( $scope.project.lists, $data, $beneficiary );
        },

        // delivery
        showDelivery: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showDelivery( $scope.project.lists, $data, $beneficiary );
        },

        // cash
        showCash: function() {
          return ngmClusterBeneficiaries.showCash( $scope.project.definition.target_beneficiaries );
				},
				
				//check activivity_description and cluster_id of beneficiary
				checkClusterOfActivity: function ($beneficiary) {
					return ngmClusterBeneficiaries.checkClusterOfActivity($beneficiary, 'esnfi', $scope.project.lists.mpc_delivery_types);
				},
				// show delivery fiels
				showDeliveryfield: function () {					
					return ngmClusterBeneficiaries.showDeliveryfield($scope.project.definition.target_beneficiaries, 'esnfi', $scope.project.lists.mpc_delivery_types);
				},
				// disable mechanism option
				showMechanismOption: function ($activityDescription) {
					return ngmClusterBeneficiaries.showMechanismOption($scope.project.lists.mpc_delivery_types, $activityDescription);
				},

        // show package
        showPackage: function() {
          return ngmClusterBeneficiaries.showPackage( $scope.project.definition.target_beneficiaries );
        },

         // enable package
        enablePackage: function( beneficiary ) {
          return ngmClusterBeneficiaries.enablePackage( beneficiary );
        },

        // units
        showUnits: function(){
          return ngmClusterBeneficiaries.showUnits( $scope.project.definition.target_beneficiaries );
        },

        // unit type
        showUnitTypes: function( $data, $beneficiary ){
          return ngmClusterBeneficiaries.showUnitTypes( $scope.project.lists, $data, $beneficiary );
        },

        // transfer type
        showTransferTypes: function( $data, $beneficiary ){
          return ngmClusterBeneficiaries.showTransferTypes( $scope.project.lists, $data, $beneficiary );
        },

        // hhs
        showHouseholds: function(){
          return ngmClusterBeneficiaries.showHouseholds( $scope.project.definition.target_beneficiaries );
        },

        // families
        showFamilies: function(){
          return ngmClusterBeneficiaries.showFamilies( $scope.project.definition.target_beneficiaries );
        },

        // men
        showMen: function(){
          return ngmClusterBeneficiaries.showMen( $scope.project.definition.target_beneficiaries );
        },

        // women
        showWomen: function(){
          return ngmClusterBeneficiaries.showWomen( $scope.project.definition.target_beneficiaries );
        },

        // eld men
        showEldMen: function(){
          return ngmClusterBeneficiaries.showEldMen( $scope.project.definition.target_beneficiaries );
        },

        // eld women
        showEldWomen: function(){
          return ngmClusterBeneficiaries.showEldWomen( $scope.project.definition.target_beneficiaries );
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
        },

        // save beneficiary
        saveBeneficiary: function() {
          $scope.project.save( false, 'People in Need Saved!' );
        },


        /**** TARGET LOCATIONS ( ngmClusterLocations.js ) ****/

        // add location
        addLocation: function() {
          $scope.inserted = ngmClusterLocations.addLocation( $scope.project.definition, $scope.project.definition.target_locations );
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
          ngmClusterLocations.removeLocation( $scope.project.definition, $scope.project.locationIndex );
        },

        // project focal point
        showReporter: function( $data, target_location ){
          return ngmClusterLocations.showReporter( $scope.project.lists, $data, target_location )
        },

        // site implementation
        showSiteImplementation: function( $data, target_location ){
          return ngmClusterLocations.showSiteImplementation( $scope.project.lists, $data, target_location );
        },

        // showadmin
        showAdmin: function( parent_pcode, list, pcode, name, $index, $data, target_location ){
          return ngmClusterLocations.showAdmin( $scope.project.lists, parent_pcode, list, pcode, name, $index, $data, target_location );
        },

        // fetch lists
        getAdminSites: function( pcode, $index, $data, target_location ){
          ngmClusterLocations.getAdminSites( $scope.project.lists, $scope.project.definition.admin0pcode, pcode, $index, $data, target_location );
        },

        // on change
        adminOnChange: function( pcode, $index, $data, target_location ){
          $timeout(function() {
            ngmClusterLocations.adminOnChange( $scope.project.lists, pcode, $index, $data, target_location );
          }, 0 );
        },

        // site_type
        showSiteType: function( $index, $data, target_location ){
          return ngmClusterLocations.showSiteType( $scope.project.lists, $index, $data, target_location );
        },

        // select from list?
        showListYesNo: function( $index, $data, target_location ){
          return ngmClusterLocations.showListYesNo( $scope.project.lists, $index, $data, target_location );
        },

        // yes/no
        yesNoOnChange: function( target_location ){
          target_location.site_id = null ;
          // target_location.site_name = null;
        },

        // show sites
        showAdminSites: function( $index, $data, target_location ){
          return ngmClusterLocations.showAdminSites( $scope.project.lists, $index, $data, target_location );
        },

        // site_name
        showSiteName: function( $data, target_location ){
          return ngmClusterLocations.showSiteName( $data, target_location );
        },


        /**** CANCEL EDIT ( beneficiaries or locations ) ****/

        // remove from array if no id
        cancelEdit: function( key, $index ) {
          if ( !$scope.project.definition[ key ][ $index ].id ) {
            $scope.project.definition[ key ].splice( $index, 1 );
          }
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


        /**** FORM ( ngmClusterValidation.js ) ****/

        // validate project type
        project_details_valid: function() {
          return ngmClusterValidation.project_details_valid( $scope.project.definition );
        },

        // validate if ONE activity type
        activity_type_valid: function() {
          return ngmClusterValidation.activity_type_valid( $scope.project.definition );
        },

        // validate project donor
        project_donor_valid: function() {
          return ngmClusterValidation.project_donor_valid( $scope.project.definition );
        },

        // validate if ALL target beneficairies valid
        target_beneficiaries_valid: function(){
          return ngmClusterValidation.target_beneficiaries_valid( $scope.project.definition );
        },

        // validate id ALL target locations valid
        target_locations_valid: function(){
          return ngmClusterValidation.target_locations_valid( $scope.project.definition );
        },

        // validate form
        validate: function(){
          ngmClusterValidation.validate( $scope.project.definition );
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
          Materialize.toast( $filter('translate')('processing'), 6000, 'note' );

          // details update
          $http({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
            data: { project: $scope.project.definition }
          }).success( function( project ){

            // enable
            $scope.project.submit = true;

            // error
            if ( project.err ) { Materialize.toast( $filter('translate')('save_failed_the_project_contains_error')+'!', 6000, 'error' ); }

            // if success
            if ( !project.err ) {

              // add id to client json
              $scope.project.definition = angular.merge( $scope.project.definition, project );
              $scope.project.definition.update_dates = false;

              // save
              if( save_msg ){ Materialize.toast( save_msg , 3000, 'success' ); }

              // notification modal
              if( display_modal ){

                // modal-trigger
                $('.modal-trigger').leanModal();

                // save msg
                var msg = $scope.project.newProject ? $filter('translate')('project_created')+'!' : 'Project Updated!';

                // save, redirect + msg
                $timeout(function(){
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

      // init project
      $scope.project.init();
  }

]);
