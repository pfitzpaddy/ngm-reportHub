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
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, ngmClusterHelper, config ){

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

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
          activity_types: ngmClusterHelper.getActivities( config.project.cluster_id, true ),
          activity_descriptions: ngmClusterHelper.getActivities( config.project.cluster_id, false ),
          beneficiary_types: ngmClusterHelper.getBeneficiaries( config.project.cluster_id, [] ),
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          donors: ngmClusterHelper.getDonors(),
          // admin1 ( with admin0 filter )
          admin1: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin1List, 
                          { admin0pcode: ngmUser.get().admin0pcode }, true ),
          // admin2 ( with admin0 filter )
          admin2: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin2List, 
                          { admin0pcode: ngmUser.get().admin0pcode }, true ),
          // facility type
          facility_type: ngmClusterHelper.getFacilityTypes()
        },

        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',
        detailsUrl: 'details.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        locationsUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-locations/2016/locations-health.html' : 'target-locations/locations.html',

        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.project_start_date = moment( $scope.project.definition.project_start_date ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = moment( $scope.project.definition.project_end_date ).format('YYYY-MM-DD');
          }
        },

        // cancel
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 100);
        },

        // add beneficiary
        addBeneficiary: function() {
          $scope.inserted = {
            activity_type_id: null,
            activity_type_name: null,
            activity_description_id: null,
            activity_description_name: null,
            beneficiary_type_id: null,
            beneficiary_type_name: null,
            families: 0, boys: 0, girls: 0, men:0, women:0
          };

          // process + clean location
          $scope.inserted = 
              ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.inserted );
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
        },

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id });
            $beneficiary.activity_type_name = selected[0].activity_type_name;
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id });
            $beneficiary.activity_description_name = selected[0].activity_description_name;
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // display beneficiary
        showBeneficiary: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.beneficiary_type_id = $data;
          if($beneficiary.beneficiary_type_id) {
            selected = $filter('filter')( $scope.project.lists.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id });
            $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
          }
          return selected.length ? selected[0].beneficiary_type_name : 'No Selection!';
        },

        // update inidcators
        updateInput: function( $index, indicator, $data ){
          $scope.project.definition.target_beneficiaries[ $index ][ indicator ] = $data;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.activity_type_id && $data.activity_description_id && $data.beneficiary_type_id &&
                $data.families >= 0 && $data.boys >= 0 && $data.girls >= 0 && $data.men >= 0 && $data.women >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // save beneficiary
        saveBeneficiary: function() {
          // save project
          $scope.project.save( false );
          // message
          $timeout( function(){ Materialize.toast( 'Beneficiaries in Need Added!' , 3000, 'success' ) }, 600 );
          // return [200, {status: 'ok'}];
        },

        // remove beneficiary
        removeBeneficiary: function( $index ) {
          // remove
          $scope.project.definition.target_beneficiaries.splice( $index, 1 );
          // save
          $scope.project.save( false );
          // message
          $timeout( function(){ Materialize.toast( 'Beneficiaries in Need Removed!' , 3000, 'success' ) }, 600 );
          // return [200, {status: 'ok'}];
        },

        // add location
        addLocation: function() {
          $scope.inserted = {
            admin1pcode: null,
            admin1name: null,
            admin2pcode: null,
            admin2name: null,
            fac_type_id: null,
            fac_type_name: null,
            fac_name: null
          };

          // process + clean location 
          $scope.inserted = 
              ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.inserted );  
          $scope.project.definition.target_locations.push( $scope.inserted );
        },

        showAdmin1: function($data, $location){
          var selected = [];
          $location.admin1pcode = $data;
          if($location.admin1pcode) {
            selected = $filter('filter')( $scope.project.lists.admin1, { admin1pcode: $location.admin1pcode });
            delete selected[0].id;
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].admin1name : 'No Selection!';
        },

        // admin2
        showAdmin2: function($data, $location){
          var selected = [];
          $location.admin2pcode = $data;
          if($location.admin2pcode) {
            selected = $filter('filter')( $scope.project.lists.admin2, { admin2pcode: $location.admin2pcode });
            delete selected[0].id;
            angular.merge($location, selected[0]);
          }
          return selected.length ? selected[0].admin2name : 'No Selection!';
        },

        // fac_type
        showFacType: function($data, $location){
          var selected = [];
          $location.fac_type_id = $data;
          if($location.fac_type_id) {
            selected = $filter('filter')( $scope.project.lists.facility_type, { fac_type_id: $location.fac_type_id });
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

        // save location
        saveLocation: function($index, $data) {

          console.log(JSON.stringify($scope.project.definition.target_locations))

          // $scope.project.definition.target_locations[$index] = 
          //       angular.merge($scope.project.definition.target_locations[$index], $data);

          // save project
          $scope.project.save( false );
          // message
          $timeout( function(){ Materialize.toast( 'Project Location Added!' , 3000, 'success' ) }, 600 );
          // return [200, {status: 'ok'}];
        },

        // remove location
        removeLocation: function( $index ) {
          // remove
          $scope.project.definition.target_locations.splice( $index, 1 );
          // save
          $scope.project.save( false );
          // message
          $timeout( function(){ Materialize.toast( 'Project Location Removed!' , 3000, 'success' ) }, 600 );
          // return [200, {status: 'ok'}];
        },

        // on show form
        showForm: function(){
          // $timeout(function() { window.scrollTo(0,0); }, 100);
        },

        // add target benficiaries
        // addTargetBeneficiary: function() {

        //   // process + clean location 
        //   var target_beneficiaries = 
        //       ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.project.indicators, $scope.project.options.target_beneficiaries );

        //   // 
        //   target_beneficiaries.beneficiary_type = 'conflict_idps';
        //   target_beneficiaries.beneficiary_name = 'Conflict IDPs';

        //   // add target_beneficiaries
        //   $scope.project.definition.target_beneficiaries.unshift( target_beneficiaries );

        //   // clear selection
        //   $scope.project.options.target_beneficiaries = {};

        //   // filter / sort target_beneficiaries
        //   $scope.project.options.list.beneficiaries 
        //       = ngmClusterHelper.getBeneficiaries( $scope.project.definition.cluster_id, $scope.project.definition.target_beneficiaries );

        //   // update material select
        //   ngmClusterHelper.updateSelect();

        // },

        // // remove target beneficiary
        // removeTargetBeneficiary: function( $index ) {

        //   // remove location at i
        //   $scope.project.definition.target_beneficiaries.splice( $index, 1 );

        //   // filter / sort
        //   $scope.project.options.list.beneficiaries 
        //       = ngmClusterHelper.getBeneficiaries( $scope.project.definition.cluster_id, $scope.project.definition.target_beneficiaries );

        //   // update material select
        //   ngmClusterHelper.updateSelect();

        // },

        // // add location
        // addLocation: function(){

        //   // process + clean location 
        //   var location = 
        //       ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.options.location );

        //   // extend targets with project, ngmData details & push
        //   $scope.project.definition.target_locations.push( location );

        //   // reset
        //   $scope.project.options.location = {};

        //   // update material select
        //   ngmClusterHelper.updateSelect();

        // },

        // // remove location from location list
        // removeLocationModal: function( $index ) {

        //   // set location index
        //   $scope.project.locationIndex = $scope.project.definition.target_locations.length-1 - $index;

        //   // open confirmation modal
        //   $('#location-modal').openModal({ dismissible: false });

        // },

        // // confirm locaiton remove
        // removeLocation: function() {

        //   // remove location at i
        //   $scope.project.definition.target_locations.splice( $scope.project.locationIndex, 1 );

        // },

        // validate project type
        project_details_valid: function () {
          // valid
          var valid = false;
          if(
            $scope.project.definition.project_title &&
            $scope.project.definition.project_start_date &&
            $scope.project.definition.project_end_date &&
            $scope.project.definition.project_budget &&
            $scope.project.definition.project_budget_currency &&
            $scope.project.definition.project_status &&
            $scope.project.definition.project_description
          ){
            valid = true;
          }
          
          return valid;
        },

        // validate project type
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

        // validate target beneficiary
        target_beneficiaries_valid: function(){
          var valid = false;
          angular.forEach( $scope.project.definition.target_beneficiaries, function( d, i ){
            if ( !$scope.project.rowSaveDisabled(d) ){
              valid = true;
            }
          });
          return valid;
        },

        // validate target locations
        target_locations_valid: function(){
          var valid = false;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ){
            if(
              d.admin1pcode &&
              d.admin1name &&
              d.admin2pcode &&
              d.admin2name &&
              d.fac_type_id &&
              d.fac_type_name &&
              d.fac_name
            ){
             valid = true; 
            }
          });
          return valid;
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          // $scope.clusterProjectForm.$dirty ?
              // $( '#' + modal ).openModal( { dismissible: false } ) : $scope.project.cancel();
          $scope.project.cancel();
        },

        // compile activity_type 
        compileActivityType: function(){
          $scope.project.definition.activity_type = [];
          angular.forEach( $scope.project.definition.activity_type_check, function( t, key ){
            if ( t ) {
              var a_type = $filter( 'filter' )( $scope.project.lists.activity_types, { activity_type_id: key })[0];
              $scope.project.definition.activity_type.push( { activity_type_id: a_type.activity_type_id, activity_type_name: a_type.activity_type_name } );
            }
          });
        },

        // compile project_donor
        compileDonor: function(){
          $scope.project.definition.project_donor = [];
          angular.forEach( $scope.project.definition.project_donor_check, function( d, key ){
            if ( d ) {
              var donor = $filter( 'filter' )( $scope.project.lists.donors, { project_donor_id: key })[0];
              $scope.project.definition.project_donor.push( donor );
            }
          });
        },

        // save project
        save: function( display_modal ){

          // reset to cover updates
          $scope.project.definition.beneficiary_type = [];
          $scope.project.definition.admin1pcode = [];
          $scope.project.definition.admin2pcode = [];

          // add target_beneficiaries to projects
          angular.forEach( $scope.project.definition.target_beneficiaries, function( b, i ){
            // update target_beneficiaries
            $scope.project.definition.target_beneficiaries[i] = 
                  ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.definition.target_beneficiaries[i] );
            // add type to project
            $scope.project.definition.beneficiary_type.push( { beneficiary_type_id: b.beneficiary_type_id, beneficiary_type_name: b.beneficiary_type_name } );
          });

          // add target_locations to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){
            // push update activities
            $scope.project.definition.target_locations[i] = 
                  ngmClusterHelper.updateActivities( $scope.project.definition, $scope.project.definition.target_locations[i] );            
            // add locations to project
            $scope.project.definition.admin1pcode.push( { admin1pcode: l.admin1pcode, admin1name: l.admin1name } );
            $scope.project.definition.admin2pcode.push( { admin2pcode: l.admin2pcode, admin2name: l.admin2name } );
          });

          // open success modal if valid form
          // if ( $scope.clusterProjectForm.$valid ) {

            // disable btn
            $scope.project.submit = true;
            // inform
            Materialize.toast('Processing...', 3000, 'note');

            // details update
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/cluster/project/setProject',
              data: {
                project: $scope.project.definition
              }
            }).then( function( project ){
              // enable
              $scope.project.submit = false;
              // add id to client json
              $scope.project.definition = angular.merge({}, $scope.project.definition, project);
              // notification modal
              if(display_modal){
                $( '#save-modal' ).openModal({ dismissible: false });
              }
            });

          // } else {
            
          //   // form validation takes over
          //   $scope.clusterProjectForm.$setSubmitted();
            
          //   // inform
          //   Materialize.toast( 'Please review the form for errors and try again!', 3000);

          // }

        },

        // re-direct on save
        redirect: function(){

          // new becomes active!
          var path = '/cluster/projects/summary/' + $scope.project.definition.id;
          var msg = $scope.project.definition.project_status === 'new' ? 'Project Created!' : 'Project Updated!';

          // update
          $timeout(function(){
            
            // redirect + msg
            $location.path( path );
            Materialize.toast( msg, 3000, 'success' );

          }, 200 );

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
            Materialize.toast( msg, 3000, 'note' );
          }, 100 );

        }   

      }

      // on page load
      angular.element( document ).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // if activity_type is one set as default
          if( !$scope.project.definition.target_beneficiaries.length ){
            // $scope.project.addBeneficiary();
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

          // add project donor check box list
          if ( $scope.project.definition.project_donor ) {
            $scope.project.definition.project_donor_check = {};
            angular.forEach( $scope.project.definition.project_donor, function( d, i ){
              if ( d ){
                $scope.project.definition.project_donor_check[ d.project_donor_id ] = true;
              }
            });
          }

        }, 1000 );

      });
  }

]);
