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
    'ngmClusterBeneficiaries',
    'ngmClusterLocations',
    'ngmClusterTrainings',
    'ngmClusterHelperAf',
    'ngmClusterHelperNgWash',
    'ngmClusterHelperNgWashLists',
    'ngmClusterHelperNgWashValidation',
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
      ngmClusterLists,
      ngmClusterBeneficiaries,
      ngmClusterLocations,
      ngmClusterTrainings,
      ngmClusterHelperAf,
      ngmClusterHelperNgWash,
      ngmClusterHelperNgWashLists,
      ngmClusterHelperNgWashValidation,
      config ){


      /**** TRAINING SERVICE ****/

      // link for ngmClusterTrainings service directly into the template
        // this should be a directive - sorry Steve Jobs!
      $scope.scope = $scope;
      $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
      $scope.ngmClusterTrainings = ngmClusterTrainings;
      $scope.ngmClusterHelperNgWash = ngmClusterHelperNgWash;
      $scope.ngmClusterHelperNgWashLists = ngmClusterHelperNgWashLists;
      $scope.ngmClusterHelperNgWashValidation = ngmClusterHelperNgWashValidation;
      $scope.openAddLocation = false;
      
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
        locationsUrl: 'locations.html',
        beneficiariesTrainingUrl: 'beneficiaries/2016/beneficiaries-training.html',
        beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
        notesUrl: 'notes.html',
        addLocationUrl:'ET/esnfi/new_location.html',
        
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


        /**** Beneficiaries ****/

        // add beneficiary
        addBeneficiary: function( $parent ) {          
          $scope.inserted = ngmClusterBeneficiaries.addBeneficiary($scope.project.report.locations[$parent].beneficiaries );
          $scope.project.report.locations[$parent].beneficiaries.push( $scope.inserted );        
          
          
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

        

        
        //add new Location
        showAdmin1AddLocation: function ($data) {
         
          if($data !== null){
            $scope.selectedAdmin1Code = $data;
            $scope.project.lists.admin2Select[0] =
              $filter('filter')($scope.project.lists.admin2, { admin1pcode: $data }, true);
            
            $scope.admin2status = true;
          } else{
            $scope.admin2status = false;
          } 

        },

        showAdmin2AddLocation: function ($data) {
          if ($data !== null) {
            $scope.selectedAdmin1Code = $data;
            $scope.project.lists.admin3Select[0] =
              $filter('filter')($scope.project.lists.admin3, {
                admin1pcode: $scope.selectedAdmin1Code,
                admin2pcode: $data
              }, true);
            $scope.admin3status = true;
          } else {
            $scope.admin3status = false;
          }

        },

        siteNameNewAddLocation($data){
          console.log($data);
          if ($data !== null) {
            $scope.siteNameStatus = true;
          }else{
            $scope.siteNameStatus = false;
          }
         
        },
        

        // add location
        addLocation: function () {
          // $scope.inserted = ngmClusterLocations.addLocation($scope.project.definition);
          // $scope.project.definition.target_locations.push($scope.inserted);
          // var a = $scope.project.report.locations
          // $scope.project.report.locations.push(a);
          // console.log();
          // console.log($scope.project.report.locations);                          

        },

        addNewLocation:function($data){
          
          var a={}
          var ab = $scope.project.report.locations[0];
        
          
          
          for (key in ab) {
            if (key === '$$hashKey' || key === 'id' || key==='site_lat'){              
            }else{
              a[key] = ab[key];
            }            
            $scope.openAddLocation = false;              
          }
          chAdmin2 = $filter('filter')($scope.project.lists.admin2, { admin1pcode: $data.admin1pcode }, true);
                    
          a.admin1lat = chAdmin2[0].admin1lat;
          a.admin1lng = chAdmin2[0].admin1lng;
          a.admin1pcode = chAdmin2[0].admin1pcode;
          a.admin1name = chAdmin2[0].admin1name;
          a.admin2name = chAdmin2[0].admin2name;
          a.admin2lat = chAdmin2[0].admin2lat;
          a.admin2lng = chAdmin2[0].admin2lng;
          a.admin2pcode = chAdmin2[0].admin2pcode;          
          a.beneficiaries = [];         
          a.adminRpcode = chAdmin2[0].adminRpcode;
          a.adminRname = chAdmin2[0].adminRname;
          if ($data.site_list_select_id){
            a.site_list_select_id = $data.site_list_select_id;
          }
          if ($data.site_name) {
            a.site_name = $data.site_name;
          }
          if ($data.site_id) {
            a.site_type_id = $data.site_type_id;
          }

          $scope.project.report.locations.push(a);          
          $scope.project.save();
        
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
        validateBeneficiariesForm: function( complete, display_modal ){
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
          Materialize.toast( 'Processing Report...' , 3000, 'note');

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
              Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' );
            }

            if ( !report.err ) {

              // updated report
              $scope.project.report = report;
              $scope.project.report.submit = false;
              

              // user msg
              var msg = 'Project Report for  ' + moment.utc( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
                  msg += complete ? 'Submitted!' : 'Saved!';

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

        },

        openSesame: function (params) {
          $scope.openAddLocation = !$scope.openAddLocation;
          
          
        }

      }
      

  }

]);
