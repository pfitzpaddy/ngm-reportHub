/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.details', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.details', {
        title: 'Health Project Details Form',
        description: 'Display Health Project Details Form',
        controller: 'ProjectDetailsCtrl',
        templateUrl: '/scripts/modules/health/views/forms/details/form.html'
      });
  })
  .controller('ProjectDetailsCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, config){

      // get currency exchange
      // ngmData.get({
      //   method: 'GET',
      //   externalApi: true,
      //   url: 'http://www.apilayer.net/api/live?access_key=1106b426ad52b3fefced5ee9ac6beabc&currencies=USD,AFN&format=1'
      // }).then(function(data){

      //   // set live exchange
      //   $scope.project.exchange = data.quotes;

      // });

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // exchange rate
        exchange: {
          USDUSD: 1,
          USDAFN: 68.61          
        },

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // default indicators
        indicators: {
          under5male: 0,
          under5female: 0,
          over5male: 0,
          over5female: 0,
          penta3_vacc_male_under1: 0,
          penta3_vacc_female_under1: 0,
          skilled_birth_attendant: 0,
          conflict_trauma_treated: 0,
          capacity_building_sessions: 0,
          capacity_building_male: 0,
          capacity_building_female: 0,
          education_sessions: 0,
          education_male: 0,
          education_female: 0
        },

        // holder for UI options
        options: {
          list: {
            // beneficiaries
            beneficiaries: [{
              beneficiary_type: 'conflict_displaced',
              beneficiary_name: 'Conflict IDPs'
            },{
              beneficiary_type: 'health_affected_conflict',
              beneficiary_name: 'Health Affected by Conflict'
            },{
              beneficiary_type: 'training',
              beneficiary_name: 'Health Education & Capacity Building'
            },{
              beneficiary_type: 'natural_disaster_affected',
              beneficiary_name: 'Natural Disaster IDPs'
            },{
              beneficiary_type: 'refugees_returnees',
              beneficiary_name: 'Refugees & Returnees'
            },{
              beneficiary_type: 'white_area_population',
              beneficiary_name: 'White Area Population'
            }],

            // facility type
            facility_type: [{
              fac_type: 'RH',
              fac_name: 'RH'
            },{
              fac_type: 'PH',
              fac_name: 'PH'
            },{
              fac_type: 'DH',
              fac_name: 'DH'
            },{
              fac_type: 'CHC',
              fac_name: 'CHC'
            },{
              fac_type: 'CHC+FATP',
              fac_name: 'CHC + FATP'
            },{
              fac_type: 'BHC',
              fac_name: 'BHC'
            },{
              fac_type: 'BHC+FATP',
              fac_name: 'BHC + FATP'
            },{
              fac_type: 'FHH',
              fac_name: 'FHH'
            },{
              fac_type: 'SHC',
              fac_name: 'SHC'
            },{
              fac_type: 'MHT',
              fac_name: 'MHT'
            },{
              fac_type: 'FATP',
              fac_name: 'FATP'
            },{
              fac_type: 'DATC',
              fac_name: 'DATC'
            },{
              fac_type: 'rehabilitation_center',
              fac_name: 'Rehabilitation Center'
            },{
              fac_type: 'special_hospital',
              fac_name: 'Special Hospital'
            },{
              fac_type: 'local_committee',
              fac_name: 'Local Committee'
            }]

          },
          filter: {},
          selection: {
            target_beneficiaries: [],
          }
        },

        // details template
        detailsUrl: '/scripts/modules/health/views/forms/details/details.html',

        // budget
        budgetUrl: '/scripts/modules/health/views/forms/details/budget.html',

        // target beneficiaries
        targetBeneficiariesUrl: '/scripts/modules/health/views/forms/details/target-beneficiaries.html',

        // default
        targetBeneficiariesDefaultUrl: '/scripts/modules/health/views/forms/details/target-beneficiaries/target-beneficiaries-default.html',

        // training
        targetBeneficiariesTrainingUrl: '/scripts/modules/health/views/forms/details/target-beneficiaries/target-beneficiaries-training.html',

        // details template
        locationsUrl: '/scripts/modules/health/views/forms/details/target-locations.html',

        // datepicker
        datepicker: {
          onClose: function(){
            $scope.project.definition.project_start_date = moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
            $scope.project.definition.project_end_date = moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');
          }
        },

        // validate project type
        project_type_valid: function () {
          
          // valid
          var valid = false;

          // compile project_type
          angular.forEach( $scope.project.definition.project_type_check, function( t, i ) {
            // check if selected
            if ( t ){
              valid = true;

            }

          });

          return valid;

        },

        // validate project donor
        project_donor_valid: function () {
          
          // valid
          var valid = false;

          // compile project_type
          angular.forEach( $scope.project.definition.project_donor_check, function( d, i ){
            // check if selected
            if ( d ){
              valid = true;

            }

          });

          return valid;

        },        

        // add target benficiaries
        addTargetBeneficiary: function() {

          // copy selection
          var target_beneficiaries = angular.copy( $scope.project.options.selection.target_beneficiaries ); 

          // beneficiary definition
          var b = {
            beneficiary_name: target_beneficiaries.beneficiary_name,
            beneficiary_type: target_beneficiaries.beneficiary_type,
          };

          // beneficiaries + indicators
          var b = angular.merge( {}, b, $scope.project.indicators );
  
          // extend targets with projectn ngmData details & push
          $scope.project.definition.target_beneficiaries.unshift( angular.merge( {}, config.project, b ) );

          // clear selection
          $scope.project.options.selection.target_beneficiaries = {};

          // filter list
          $scope.project.options.filter.target_beneficiaries = $filter( 'filter' )( $scope.project.options.filter.target_beneficiaries, { beneficiary_type: '!' + target_beneficiaries.beneficiary_type }, true);

          // update dropdown
          $timeout(function(){
            // apply filter
            $( 'select' ).material_select();
          }, 10);

        },

        // remove target beneficiary
        removeTargetBeneficiary: function( $index ) {

          // add option to selection
          $scope.project.options.filter.target_beneficiaries.push({
            'beneficiary_type': $scope.project.definition.target_beneficiaries[$index].beneficiary_type,
            'beneficiary_name': $scope.project.definition.target_beneficiaries[$index].beneficiary_name,
          });

          // remove location at i
          $scope.project.definition.target_beneficiaries.splice( $index, 1 );

          // sort
          $scope.project.options.filter.target_beneficiaries = $filter( 'orderBy' )( $scope.project.options.filter.target_beneficiaries, 'beneficiary_name' );
          
          // update dropdown
          $timeout(function(){
            // apply filter
            $( 'select' ).material_select();

          }, 10);

        },

        // apply location dropdowns
        locationSelect: function(id, select) {

          var disabled;

          switch( select ) {

            case 'admin2':
              
              // disabled
              disabled = !$scope.project.options.selection.admin1;

              // filter admin2
              $scope.project.options.filter.admin2 = $filter('filter')( $scope.project.options.list.admin2, { admin1pcode: $scope.project.options.selection.admin1.admin1pcode }, true );

              // disable/enable
              $( id ).prop( 'disabled', disabled );

              // update dropdown
              $timeout(function(){
                $( 'select' ).material_select();
              }, 100);

              break;

            case 'hf_type':
              
              // disabled
              disabled = !$scope.project.options.selection.admin2;
              // alert user if conflict admin2 selected
              if( $scope.project.options.selection.admin2.conflict ){
                Materialize.toast('Alert! ' + $scope.project.options.selection.admin2.admin2name + ' is listed as a conflict ' + $scope.project.options.list.admin2[0].admin2type_name, 3000, 'success');
              }

              // reset dropdowns
              $scope.project.resetLocationSelect( false, false, true, true );

              // disable/enable
              $( id ).prop( 'disabled', disabled );

              // update dropdown
              $timeout(function(){
                $( 'select' ).material_select();
              }, 100);              

              break;

            case 'hf_name':
              
              // disabled
              disabled = !$scope.project.options.selection.hf_type;

              // disable/enable
              $( id ).prop( 'disabled', disabled );              

              break;

          }

        },       

        // add location
        addLocation: function(){

          // copy selection
          var selection = angular.copy( $scope.project.options.selection );

          // target location definition
          var fac = {
            fac_type: selection.hf_type.fac_type,
            fac_type_name: selection.hf_type.fac_name,
            fac_name: selection.hf_name
          };

          // admin1 + admin2 selection 
          var l = angular.merge( {}, selection.admin1, selection.admin2 );

          // admin1 + admin2 + facility
          l = angular.merge( {}, l, fac );

          // location
          var location = angular.merge( {}, config.project, l );
          delete location.id;
  
          // extend targets with project, ngmData details & push
          $scope.project.definition.target_locations.unshift( location );

          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );

        },

        // remove location from location list
        removeLocationModal: function( $index ) {

          // set location index
          $scope.project.locationIndex = $index;

          // open confirmation modal
          $('#location-modal').openModal({
            dismissible: false
          });

        },

        // confirm locaiton remove
        removeLocation: function() {

          // remove location at i
          $scope.project.definition.target_locations.splice( $scope.project.locationIndex, 1 );
          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );

        },

        // refresh dropdown options
        resetLocationSelect: function( admin1, admin2, hf_type, hf_name ){

          // reset admin1
          if ( admin1 ){
            // reset select option
            $scope.project.options.selection.admin1 = {};
            $scope.project.options.list.admin1 = angular.fromJson( localStorage.getItem( 'admin1List' ) );
            // reset dropdown
            $( '#ngm-project-admin1' ).prop( 'selectedIndex', 0 );
            $timeout(function() {
              // update
              $( 'select' ).material_select();
            }, 10 );
          }

          // reset admin2
          if ( admin2 ){
            // reset select option
            $scope.project.options.selection.admin2 = {};
            $scope.project.options.list.admin2 = angular.fromJson( localStorage.getItem( 'admin2List' ) );
            // refresh dropdown
            $('#ngm-project-admin2').prop( 'selectedIndex', 0 );
            $('#ngm-project-admin2').prop( 'disabled', true );
            $timeout(function() {
              // update
              $('select').material_select();
            }, 10);
          }

          // reset facility type
          if ( hf_type ){

            // reset select option
            $scope.project.options.selection.hf_type = {};
            // refresh dropdown
            $( '#ngm-project-hf_type' ).prop( 'selectedIndex', 0 );
            $( '#ngm-project-hf_type' ).prop( 'disabled', true );
            $timeout(function() {
              // update
              $( 'select' ).material_select();
            }, 10);
            
          }

          // reset facility name
          if ( hf_name ) {
            
            // reset select option
            $scope.project.options.selection.hf_name = '';
            // set disabled            
            $( '#ngm-project-hf_name' ).prop( 'disabled', true );
          }          

        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if( $scope.healthProjectForm.$dirty ){
            $( '#' + modal ).openModal( { dismissible: false } );
          } else{
            $scope.project.cancel();
          }

        },

        // save project
        save: function(){

          // reset to cover updates
          $scope.project.definition.project_type = [];
          $scope.project.definition.project_donor = [];
          $scope.project.definition.admin1pcode = [];
          $scope.project.definition.admin2pcode = [];
          $scope.project.definition.beneficiary_type = [];
          // explode by ","
          // $scope.project.definition.implementing_partners = $scope.project.definition.implementing_partners.split(',');

          // compile project_type
          angular.forEach( $scope.project.definition.project_type_check, function( t, key ){

            // push keys to project_type
            if ( t ) {
              $scope.project.definition.project_type.push( key );
            }

          });

          // compile project_donor
          angular.forEach( $scope.project.definition.project_donor_check, function( d, key ){

            // push keys to project_donor
            if ( d ) {
              $scope.project.definition.project_donor.push( key );
            }

          });

          // add target_beneficiaries to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_beneficiaries, function( b, i ){

            // push location ids to project
            $scope.project.definition.target_beneficiaries[i].project_title = $scope.project.definition.project_title;
            $scope.project.definition.target_beneficiaries[i].project_type = $scope.project.definition.project_type;
            $scope.project.definition.beneficiary_type.push( b.beneficiary_type );

          });

          // add target_locations to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){

            // push location ids to project
            $scope.project.definition.target_locations[i].project_title = $scope.project.definition.project_title;
            $scope.project.definition.target_locations[i].project_type = $scope.project.definition.project_type;
            $scope.project.definition.admin1pcode.push( l.admin1pcode );
            $scope.project.definition.admin2pcode.push( l.admin2pcode );

          });

          // open success modal if valid form
          if ( $scope.healthProjectForm.$valid ) {

            // disable btn
            $scope.project.submit = true;

            // inform
            Materialize.toast('Processing...', 3000, 'note');

            // details update
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProject',
              data: {
                project: $scope.project.definition
              }
            }).then( function( project ){

              // enable
              $scope.project.submit = false;

              // add id to client json
              $scope.project.definition = project;

              // notification modal
              $('#save-modal').openModal({ dismissible: false });
              
            });

          } else {
            
            // form validation takes over
            $scope.healthProjectForm.$setSubmitted();
            // inform
            Materialize.toast( 'Please review the form for errors and try again!', 3000);

          }

        },

        // re-direct on save
        redirect: function(){

          // new becomes active!
          if( $scope.project.definition.project_status === 'new' ) {
            var msg = 'Project Created!';
          } else {
            var msg = 'Project Updated!';
          }

          // redirect on success
          $timeout(function(){
            $location.path( '/health/projects/summary/' + $scope.project.definition.id );
            Materialize.toast( msg, 3000, 'success');
          }, 200);

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // if new
            if($scope.project.definition.project_status === 'new') {
              
              // Re-direct to list
              $location.path( '/health/projects' );
              Materialize.toast( 'Create Project Cancelled!', 3000, 'note' );

            } else {

              // Re-direct to summary
              $location.path( '/health/projects/summary/' + $scope.project.definition.id );
              if( $scope.project.definition.project_status !== 'complete' ) {
                Materialize.toast( 'Project Update Cancelled!', 3000, 'note' );
              }
            }

          }, 100);

        }   

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // autofocus
          $('#ngm-project-name').focus()

          // selects
          $('select').material_select();

          // modals
          $('.modal-trigger').leanModal();

          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );          

          // menu return to list
          $('#go-to-project-list').click(function(){
            $scope.project.cancel();

          });

          // maximise text area
          if ( $scope.project.definition.project_description ) {
            $( 'textarea' ).height( $('textarea')[0].scrollHeight );
          }

          // order target_locations by latest updated
          $scope.project.definition.target_locations = $filter( 'orderBy' )( $scope.project.definition.target_locations, '-createdAt' );

          // add project type check
          if ( $scope.project.definition.project_type ) {
            // set object
            $scope.project.definition.project_type_check = {};
            // set checkboxes
            angular.forEach( $scope.project.definition.project_type, function( t, i ){
              // push keys to project_type
              if ( t ){
                $scope.project.definition.project_type_check[ t ] = true;
              }

            });           

          }

          // add project donor check
          if ( $scope.project.definition.project_donor ) {
            // set object
            $scope.project.definition.project_donor_check = {};
            // set checkboxes
            angular.forEach( $scope.project.definition.project_donor, function( d, i ){
              // push keys to project_type
              if ( d ){
                $scope.project.definition.project_donor_check[ d ] = true;
              }

            });

          }


          // set list
          $scope.project.options.filter.target_beneficiaries = $scope.project.options.list.beneficiaries;

          // for each beneficiaries
          angular.forEach( $scope.project.definition.target_beneficiaries, function(d, i){
            // filter
            $scope.project.options.filter.target_beneficiaries = $filter( 'filter' )( $scope.project.options.filter.target_beneficiaries, { beneficiary_type: '!' + d.beneficiary_type }, true);

          });

          // sort
          $scope.project.options.filter.target_beneficiaries = $filter( 'orderBy' )( $scope.project.options.filter.target_beneficiaries, 'beneficiary_name' );

          // update dropdown
          $timeout(function(){
            $( 'select' ).material_select();
          }, 10);          

        }, 1000);

      });
  }

]);
