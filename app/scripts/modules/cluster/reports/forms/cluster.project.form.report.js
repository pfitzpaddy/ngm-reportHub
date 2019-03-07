/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFormReportCtrl
 * @description
 * # ClusterProjectFormReportCtrl
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.project.report', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('project.report', {
        title: 'Cluster Reports Form',
        description: 'Cluster Reports Form',
        controller: 'ClusterProjectFormReportCtrl',
        templateUrl: '/scripts/modules/cluster/views/forms/report/form.html'
      });
  })
  .controller( 'ClusterProjectFormReportCtrl', [
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
    'ngmClusterLocations',
    'ngmClusterBeneficiaries',
    'ngmClusterTrainings',
    'ngmClusterValidation',
    'ngmClusterHelperAf',
    'ngmClusterHelperNgWash',
    'ngmClusterHelperNgWashLists',
    'ngmClusterHelperNgWashValidation',
    'config','$translate','$filter',
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
      ngmClusterLists,
      ngmClusterLocations,
      ngmClusterBeneficiaries,
      ngmClusterTrainings,
      ngmClusterValidation,
      ngmClusterHelperAf,
      ngmClusterHelperNgWash,
      ngmClusterHelperNgWashLists,
      ngmClusterHelperNgWashValidation,
      config ,$translate,$filter){


      /**** TRAINING SERVICE ****/

      // link for ngmClusterTrainings service directly into the template
        // this should be a directive - sorry Steve Jobs!
      $scope.scope = $scope;
      $scope.ngmClusterLists = ngmClusterLists;
      $scope.ngmClusterLocations = ngmClusterLocations;
      $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
      $scope.ngmClusterTrainings = ngmClusterTrainings;
      $scope.ngmClusterValidation = ngmClusterValidation;
      $scope.ngmClusterHelperNgWash = ngmClusterHelperNgWash;
      $scope.ngmClusterHelperNgWashLists = ngmClusterHelperNgWashLists;
      $scope.ngmClusterHelperNgWashValidation = ngmClusterHelperNgWashValidation;

      // project
      $scope.project = {

        // defaults
        user: ngmUser.get(),
        style: config.style,
        definition: config.project,
        report: config.report,
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        monthlyTitleFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMMM, YYYY'),
        monthNameFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMM'),

        // lists ( project, mpc transfers )
        lists: ngmClusterLists.setLists( config.project, 10 ),

        
        /**** TEMPLATES ****/

        // url
        templatesUrl: '/scripts/modules/cluster/views/forms/report/',
        // templates
        locationsUrl: 'location/locations.html',
        addLocationUrl: 'location/add.location.html',
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        template_distribution_date: 'beneficiaries/ET/distribution_date.html',
        template_partial_kits: 'beneficiaries/ET/partial_kits.html',
        template_kit_details: 'beneficiaries/ET/kit_details.html',
        notesUrl: 'notes.html',

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
        
        // beneficairies template
        beneficiariesUrl: function() {
          var template;
          if ( $scope.project.report.report_year === 2016 ) {
            template = 'beneficiaries/2016/beneficiaries.html';
          } else if ( $scope.project.report.admin0pcode === 'NG' ) {
            template ='beneficiaries/NG/beneficiaries.html';
          } else {
            template ='beneficiaries/beneficiaries.html';
          }
          return template;
        },
        
        // cancel monthly report
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
          }, 400);
        },

        // save form on enter
        keydownSaveForm: function(){
          $timeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.project.report.locations[ $parent ].beneficiaries[ $index ][ indicator ] = $data;
        },


        /**** Afghanistan ****/

        reportingYear: function(){
          return moment().subtract(1,'M').year();
        },

        // preps for 2018 #TODO delete
        categoryShow2017: function(){
          return moment()<moment('2018-02-01')
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.project.cancel();
          }
        },

        // injury sustained same province as field hospital
        showFatpTreatmentSameProvince: function( $locationIndex ){
          return ngmClusterHelperAf.showFatpTreatmentSameProvince( $scope.project.report.locations[ $locationIndex ].beneficiaries )
        },

        // treatment same province
        showTreatmentSameProvince: function ( $data, $beneficiary ) {
          return ngmClusterHelperAf.showTreatmentSameProvince( $data, $beneficiary );
        },


        /**** BENEFICIARIES ****/

        // add beneficiary
        addBeneficiary: function( $parent, defaults ) {
          $scope.inserted = ngmClusterBeneficiaries.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries, defaults );
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

        // add beneficiary
        addNgWashBeneficiary: function( $parent ) {
          $scope.inserted = ngmClusterHelperNgWash.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries );
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

				// remove beneficiary nodal
        removeBeneficiaryModal: function( $parent, $index ) {
          if ( ngmClusterBeneficiaries.beneficiaryFormComplete( $scope.project.definition, $scope.project.report.locations ) ){
              $scope.project.locationIndex = $parent;
              $scope.project.beneficiaryIndex = $index;
            $( '#beneficiary-modal' ).openModal({ dismissible: false });
          }
        },

        // remove beneficiary
        removeBeneficiary: function() {
          var id = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ].id;
          $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
          ngmClusterBeneficiaries.removeBeneficiary( $scope.project, id );
        },


        
        /**** LOCATIONS ****/

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
        },

        // show sites
        showAdminSites: function( $index, $data, target_location ){
          return ngmClusterLocations.showAdminSites( $scope.project.lists, $index, $data, target_location );
        },

        // site_name
        showSiteName: function( $data, target_location ){
          return ngmClusterLocations.showSiteName( $data, target_location );
        },


        /**** ACTIVITIES ****/

        // activity
        showActivity: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showActivity( $scope.project.definition, $data, $beneficiary );
        },

        // description
        showDescription: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showDescription( $scope.project.lists, $data, $beneficiary );
        },

        // details
        showDetails: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showDetails( $scope.project.lists, $data, $beneficiary );
        },

        // cholera
        showCholera: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.showCholera( $scope.project.lists, $data, $beneficiary );
        },

        // cash delivery
        showCashDelivery: function( $data, $beneficiary ) {					
          return ngmClusterBeneficiaries.showCashDelivery( $scope.project.lists, $data, $beneficiary );
				},
				//cash mechanism
				showCashMechanism: function ($data, $beneficiary ){
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

        // show cash
        showCash: function( $locationIndex ) {
					return ngmClusterBeneficiaries.showCash( $scope.project.report.locations[ $locationIndex ].beneficiaries );
				},
				
				//check activivity_description and cluster_id of beneficiary
				checkClusterOfActivity: function ($beneficiary) {					
					return ngmClusterBeneficiaries.checkClusterOfActivity($beneficiary, 'esnfi', $scope.project.lists.mpc_delivery_types);
					
				},
				// show delivery fiels
				showDeliveryfield:function($beneficiary){					
					return ngmClusterBeneficiaries.showDeliveryfield($beneficiary, 'esnfi', $scope.project.lists.mpc_delivery_types);
				},
				// disable mechanism option
				showMechanismOption:function($activityDescription){
					return ngmClusterBeneficiaries.showMechanismOption($scope.project.lists.mpc_delivery_types,$activityDescription);
				},
        // enable cash
        enableCash: function( $data, $beneficiary ) {
          return ngmClusterBeneficiaries.enableCash( $data, $beneficiary );
        },

        // show package
        showPackage: function( $locationIndex ) {
          return ngmClusterBeneficiaries.showPackage( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // enable package
        enablePackage: function( beneficiary ) {
          return ngmClusterBeneficiaries.enablePackage( beneficiary );
        },

        // units
        showUnits: function( $locationIndex ){
          return ngmClusterBeneficiaries.showUnits( $scope.project.report.locations[ $locationIndex ].beneficiaries );
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
        showHouseholds: function( $locationIndex ){
          return ngmClusterBeneficiaries.showHouseholds( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // families
        showFamilies: function( $locationIndex ){
          return ngmClusterBeneficiaries.showFamilies( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // men
        showMen: function( $locationIndex ){
          return ngmClusterBeneficiaries.showMen( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // women
        showWomen: function( $locationIndex ){
          return ngmClusterBeneficiaries.showWomen( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // eld men
        showEldMen: function( $locationIndex ){
          return ngmClusterBeneficiaries.showEldMen( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // eld women
        showEldWomen: function( $locationIndex ){
          return ngmClusterBeneficiaries.showEldWomen( $scope.project.report.locations[ $locationIndex ].beneficiaries );
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
        },

        // remove from array if no id
        cancelEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
            $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
          }
        },

        // validate form ( ng wash )
        validateWashNgBeneficiariesForm: function( complete, display_modal ){
          if ( ngmClusterHelperNgWashValidation.validateActivities( $scope.project.report.locations ) ){
            if ( complete ) {
              $( '#complete-modal' ).openModal( { dismissible: false } );
            } else if ( display_modal ) {
              $( '#save-modal' ).openModal( { dismissible: false } );
            } else {
              $scope.project.save( false, false );
            }
          }
        },

        // validate form ( ng wash )
        validateBeneficiariesDetailsForm: function( rowform, complete, display_modal ){
          if ( ngmClusterValidation.validateDetails( rowform, $scope.project.report.locations ) ){
            if ( complete ) {
              $( '#complete-modal' ).openModal( { dismissible: false } );
            } else if ( display_modal ) {
              $( '#save-modal' ).openModal( { dismissible: false } );
            } else {
              $scope.project.save( false, false );
            }
          }
        },


        // save
        save: function( complete, display_modal ){

          // if textarea
          $( 'textarea[name="notes"]' ).removeClass( 'ng-untouched' ).addClass( 'ng-touched' );
          $( 'textarea[name="notes"]' ).removeClass( 'invalid' ).addClass( 'valid' );

          // report
          // $scope.project.report.submit = true;
          $scope.project.report.report_status = complete ? 'complete' : 'todo';
          $scope.project.report.report_submitted = moment().format();

          // update project details of report + locations + beneficiaries
          $scope.project.report =
              ngmClusterHelper.getCleanReport( $scope.project.definition, $scope.project.report );

          // msg
          Materialize.toast( $filter('translate')('processing_report') , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/setReport',
            data: { report: $scope.project.report }
          }

          // set report
          $http( setReportRequest ).success( function( report ){

            if ( report.err ) {
              // update
              Materialize.toast( 'Error! '+$filter('translate')('please_correct_the_row_and_try_again'), 6000, 'error' );
            }

            if ( !report.err ) {

              // updated report
              $scope.project.report = report;
              $scope.project.report.submit = false;

              // user msg
              var msg = $filter('translate')('project_report_for')+'  ' + moment.utc( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
                  msg += complete ? $filter('translate')('submitted')+'!' : $filter('translate')('saved_mayus1')+'!';

              // msg
              $timeout(function() { Materialize.toast( msg , 3000, 'success'); }, 600 );

              // set trigger
              $('.modal-trigger').leanModal();

              // Re-direct to summary
              if ( $scope.project.report.report_status !== 'complete' ) {

                // notification modal
                if( display_modal ){
                  $timeout(function() {
                    $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                  }, 400);
                }

              } else {
                $timeout(function() {
                  $location.path( '/cluster/projects/report/' + $scope.project.definition.id );
                }, 400);
              }
            }
          }).error(function( err ) {
            // update
            Materialize.toast( 'Error!', 6000, 'error' );
          });;

        }

      }

      // init project
      $scope.project.init();
  }

]);
