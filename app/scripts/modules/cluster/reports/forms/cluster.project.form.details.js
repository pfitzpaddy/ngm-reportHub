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

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // default subset indicators ( boys, girls, men, women )
        indicators: ngmClusterHelper.getIndicators( true ),

        // keys to ignore when summing beneficiaries in template ( 2016 )
        skip: [ 'education_sessions', 'training_sessions', 'sessions', 'families', 'notes' ],

        // 
        strategic_title: config.project.cluster.toUpperCase() + ' OBJECTIVES',

        // lists
        activity_types: config.project.activity_type,
        lists: {
          strategic_objectives: ngmClusterHelper.getStrategicObjectives( config.project.cluster_id ),
          strategic_rnr_objectives: ngmClusterHelper.getRnRStrategicObjectives(),
          activity_types: ngmClusterHelper.getActivities( config.project, config.project.cluster_id, true ),
          activity_descriptions: ngmClusterHelper.getActivities( config.project, config.project.cluster_id, false ),
          category_types: ngmClusterHelper.getCategoryTypes( config.project.cluster_id ),
          beneficiary_types: moment( config.project.project_end_date ).year() === 2016 ? ngmClusterHelper.getBeneficiaries2016( config.project.cluster_id, [] ) : ngmClusterHelper.getBeneficiaries( config.project, config.project.cluster_id ),
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),
          donors: ngmClusterHelper.getDonors( config.project.cluster_id ),
          // admin1 ( with admin0 filter )
          admin1: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin1List, 
                          { admin0pcode: ngmUser.get().admin0pcode }, true ),
          // admin2 ( with admin0 filter )
          admin2: $filter( 'filter' )( localStorage.getObject( 'lists' ).admin2List, 
                          { admin0pcode: ngmUser.get().admin0pcode }, true ),
          admin2Select: [],
          // facility type
          facility_type: ngmClusterHelper.getFacilityTypes()
        },

        // templates
        templatesUrl: '/scripts/modules/cluster/views/forms/details/',
        detailsUrl: 'details.html',
        strategicObjectivesUrl: 'strategic-objectives.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        locationsUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-locations/2016/locations-health.html' : 'target-locations/locations.html',

        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.update_locations = true;
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

        // on RnR check
        getStrategicObjectives: function(){
          
          // set strategic objectives
          var id = $scope.project.definition.cluster_id;
          $scope.project.definition.strategic_objectives_check = {};
          $scope.project.strategic_title = $scope.project.definition.cluster.toUpperCase() + ' OBJECTIVES';
          $scope.project.lists.strategic_objectives = ngmClusterHelper.getStrategicObjectives( id );

          // update lists
          // beneficiairies
          $scope.project.beneficiary_types = ngmClusterHelper.getBeneficiaries( $scope.project.definition, $scope.project.definition.cluster_id );
            // true is unique filtering
          $scope.project.lists.activity_types = ngmClusterHelper.getActivities( $scope.project.definition, id, true );
          $scope.project.lists.activity_descriptions = ngmClusterHelper.getActivities( $scope.project.definition, id, false );

          // update activity_types selections
          if( !$scope.project.definition.project_rnr_chapter ){
            var activity_type = [];
            angular.forEach( $scope.project.definition.activity_type, function( d, i ){


              console.log(d.activity_type_id)
              if ( d.activity_type_id !== 'protection_interventions' && 
                    d.activity_type_id !== 'essential_services' && 
                    d.activity_type_id !== 'immediate_needs' ) {
                console.log(d.activity_type_id)
              console.log($scope.project.definition.activity_type[i]);
                activity_type.push( $scope.project.definition.activity_type[i] );
              } else {
                $scope.project.definition.activity_type_check[ d.activity_type_id ] = false;
              }
            });

            //             angular.forEach( $scope.project.definition.activity_type, function( d, i ){
            //   if ( d ){
            //     $scope.project.definition.activity_type_check[ d.activity_type_id ] = true;
            //   }
            // });
            console.log(activity_type);
            $scope.project.definition.activity_type = activity_type;
          }



          // RnR selected 
          // if ( $scope.project.definition.project_rnr_chapter ){
          //   // update beneficiary list
          //   $scope.project.beneficiary_types = ngmClusterHelper.getBeneficiaries( $scope.project.definition, $scope.project.definition.cluster_id );
          //   // get activty list
          // if ( $scope.project.definition.project_rnr_chapter ){
          //   
          //   $scope.project.lists.activity_descriptions = ngmClusterHelper.getActivities( 'rnr_chapter', false );

          //   // var activity_types = ngmClusterHelper.getActivities( 'rnr_chapter', true );
          //   // var activity_descriptions = ngmClusterHelper.getActivities( 'rnr_chapter', false );
          //   // $scope.project.lists.activity_types = $scope.project.lists.activity_types.concat( activity_types );
          //   // $scope.project.lists.activity_descriptions = $scope.project.lists.activity_descriptions.concat( activity_descriptions );
          // } else {
          //   // var activity_types = ngmClusterHelper.getActivities( 'rnr_chapter', true );
          //   // var activity_descriptions = ngmClusterHelper.getActivities( 'rnr_chapter', false );            
          // }
          // // }
        },

        // set to model on check
        setStrategicObjectives: function( $index ){
          $scope.project.definition.strategic_objectives = [];
          angular.forEach( $scope.project.definition.strategic_objectives_check, function( key, so ){
            if ( key ) {
              var objective = $filter('filter')( $scope.project.lists.strategic_objectives, { objective_type_id: so }, true);
              if( objective[0] ){
                $scope.project.definition.strategic_objectives.push( objective[0] );
              }
            }
          });

          // RnR chapter
          if ( $scope.project.definition.project_rnr_chapter ) {
            angular.forEach( $scope.project.definition.strategic_objectives_check, function( key, so ){
              if ( key ) {
                var objective = $filter('filter')( $scope.project.lists.strategic_rnr_objectives, { objective_type_id: so }, true);
                if( objective[0] ){
                  $scope.project.definition.strategic_objectives.push( objective[0] );
                }
              }
            });
          }

          // set HRP if SOs selected
          if( $scope.project.definition.strategic_objectives.length ) {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'HRP' );
          }

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
            delivery_type_name: null
          };

          // merge
          angular.merge( $scope.inserted, sadd );

          // eiewg
          if( $scope.project.definition.cluster_id === 'eiewg' ){
            $scope.inserted.category_type_id = 'category_a';
            $scope.inserted.category_type_name = 'A) Emergency Relief Needs';
          }
          
          // clone
          var length = $scope.project.definition.target_beneficiaries.length;
          if ( length ) {
            var b = angular.copy( $scope.project.definition.target_beneficiaries[ length - 1 ] );
            delete b.id;
            $scope.inserted = angular.merge( $scope.inserted, b, sadd );
          }
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
        },

        // display category
        showCategory: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.category_type_id = $data;
          if($beneficiary.category_type_id) {
            selected = $filter('filter')( $scope.project.lists.category_types, { category_type_id: $beneficiary.category_type_id }, true);
            $beneficiary.category_type_name = selected[0].category_type_name;
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

        // display activity
        showActivity: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_type_id = $data;
          if($beneficiary.activity_type_id) {
            selected = $filter('filter')( $scope.project.definition.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
            $beneficiary.activity_type_name = selected[0].activity_type_name;
          }
          return selected.length ? selected[0].activity_type_name : 'No Selection!';
        },

        // display description
        showDescription: function( $data, $beneficiary ) {
          var selected = [];
          $beneficiary.activity_description_id = $data;
          if($beneficiary.activity_description_id) {
            selected = $filter('filter')( $scope.project.lists.activity_descriptions, { activity_description_id: $beneficiary.activity_description_id }, true);
            $beneficiary.activity_description_name = selected[0].activity_description_name;
          } 
          return selected.length ? selected[0].activity_description_name : 'No Selection!';
        },

        // cash
        showCash: function(){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          angular.forEach( l, function(b){
            if( b.activity_type_id === 'cash_vouchers' || b.activity_type_id === 'food_assistance' ){
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
          // save project
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
          // remove
          $scope.project.definition.target_beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          // save
          $scope.project.save( false, 'People in Need Removed!' );
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

          // clone
          var length = $scope.project.definition.target_locations.length;
          if ( length ) {
            var l = angular.copy( $scope.project.definition.target_locations[ length - 1 ] );
            delete l.id;
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

        // update admin2
        showAdmin1Change: function($index, $data){
          // filter admin2
          $scope.project.lists.admin2Select[$index] = 
                  $filter('filter')( $scope.project.lists.admin2, { admin1pcode: $data }, true);
          // fire change event
          $scope.project.locationChange();
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

        // if locations change we will need to run an update
        locationChange: function(){
          $scope.project.definition.update_locations = true;
        },

        // save location
        saveLocation: function($index, $data) {
          // save project
          $scope.project.save( false, 'Project Location Saved!' );
          // return [200, {status: 'ok'}];
        },

        // remove location from location list
        removeLocationModal: function( $index ) {
          // set location index
          $scope.project.locationIndex = $index;
          // open confirmation modal
          $( '#location-modal' ).openModal({ dismissible: false });
        },

        // remove location
        removeLocation: function() {
          // updated
          $scope.project.definition.update_locations = true;
          // remove
          $scope.project.definition.target_locations.splice( $scope.project.locationIndex, 1 );
          // save (open modal, set)
          $scope.project.save( false, 'Project Location Removed!' );
          // return [200, {status: 'ok'}];
        },

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
              var a_type = $filter( 'filter' )( $scope.project.lists.activity_types, { activity_type_id: key }, true)[0];
              $scope.project.definition.activity_type.push( { activity_type_id: a_type.activity_type_id, activity_type_name: a_type.activity_type_name } );
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
          });
        },

        // save project
        save: function( display_modal, save_msg ){

          // groups
          $scope.project.definition.category_type = [];
          $scope.project.definition.beneficiary_type = [];
          $scope.project.definition.admin1pcode = [];
          $scope.project.definition.admin2pcode = [];

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

          });


          // update target_beneficiaries
          $scope.project.definition.target_beneficiaries = 
              ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.project.definition.target_beneficiaries );

          // update target_locations
          $scope.project.definition.target_locations = 
              ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.definition.target_locations );

          // open success modal if valid form
          // if ( $scope.clusterProjectForm.$valid ) {


            // disable btn
            $scope.project.submit = false;
            var msg = $scope.project.definition.project_status === 'new' ? 'New Project Saving! Moment...' : 'Processing...';
            // inform
            Materialize.toast( 'Processing...', 20000, 'note' );

            // details update
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/cluster/project/setProject',
              data: {
                project: $scope.project.definition
              }
            }).then( function( project ){
              
              // enable
              $scope.project.submit = true;
              
              // remove toast
              $timeout(function(){ 
                $('.toast.note').animate({ 'marginTop' : '-=80px'});
                $('.toast.note').fadeOut( 200 );
              }, 600);

              // add id to client json
              $scope.project.definition = angular.merge( $scope.project.definition, project );

              // order locations by
              $scope.project.definition.target_locations = $filter( 'orderBy' )( $scope.project.definition.target_locations, [ 'admin1name', 'admin2name', 'fac_type_name', 'fac_name' ] );
              
              // locations updated
              $scope.project.definition.update_locations = false;
              
              if( save_msg ){
                // message
                $timeout( function(){ Materialize.toast( save_msg , 3000, 'success' ) }, 400 );
              }
              
              // notification modal
              if( display_modal ){
                
                // new becomes active!
                var msg = $scope.project.definition.project_status === 'new' ? 'Project Created!' : 'Project Updated!';

                // update
                $timeout(function(){
                  
                  // redirect + msg
                  $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
                  Materialize.toast( msg, 3000, 'success' );

                }, 200 );
              }
            });

          // } else {
            
          //   // form validation takes over
          //   $scope.clusterProjectForm.$setSubmitted();
            
          //   // inform
          //   Materialize.toast( 'Please review the form for errors and try again!', 3000);

          // }

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

          // reset location update flag
          $scope.project.definition.update_locations = false;

          // order locations
          $scope.project.definition.target_locations = 
                  $filter( 'orderBy' )( $scope.project.definition.target_locations, [ 'admin1name', 'admin2name', 'fac_type_name', 'fac_name' ] );

          // reset to cover updates
          if ( !$scope.project.definition.project_hrp_code ){
            $scope.project.definition.project_hrp_code = 
                      ngmClusterHelper.getProjectHrpCode( $scope.project.definition );           
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
