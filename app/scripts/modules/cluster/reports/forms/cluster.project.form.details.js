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
        ngmClusterHelperTargetBeneficiaries,
        ngmClusterHelperTargetLocations,
        config ){

      // set default
      if( !config.project.project_budget_currency ){
        config.project.project_budget_currency = 'usd';
      }

      // set org
      $http({
        method: 'POST',
        url: ngmAuth.LOCATION + '/api/getOrganizationUsers',
        data: {
          admin0pcode: config.project.admin0pcode,
          cluster_id: config.project.cluster_id,
          organization: config.project.organization,
          status: 'active'
        }
      }).success( function( user ) {
        // return
        $scope.project.lists.users = user;
      }).error( function( err ) {
        //
      });

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
        lists: {

          // users
          users: [],
          
          // currencies
          currencies: ngmClusterHelper.getCurrencies( config.project.admin0pcode ),

          // units
          units: ngmClusterHelper.getUnits( config.project.admin0pcode ),

          // delivery
          delivery_types: ngmClusterHelper.getDeliveryTypes(),

          // mpc purpose
          mpc_purpose: ngmClusterHelper.getMpcPurpose(),
          
          // mpc delivery
          mpc_delivery_types: ngmClusterHelper.getMpcDeliveryTypes(),

          // etc
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







          // sites
          site_implementation: ngmClusterHelper.getSiteImplementation( config.project.cluster_id ),
          site_list_select:[{ site_list_select_id: 'yes', site_list_select_name: 'Yes'},{ site_list_select_id: 'no', site_list_select_name: 'No'}],
          site_type: ngmClusterHelper.getSiteTypes( config.project.cluster_id, config.project.admin0pcode ),
          sites:[],





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
        
        // contacts
        contactDetailsUrl: 'contact-details.html',
        
        // locations
        locationsUrl: function() {
          
          // default is by country
          var template = 'target-locations/locations-' + config.project.admin0pcode + '.html';;

          // else
          if ( config.project.cluster_id === 'eiewg' ) {
            template = 'target-locations/locations-eiewg.html';
          }
          if ( config.project.admin0pcode !== 'ET' && 
                config.project.admin0pcode !== 'NG' )  {
            template = 'target-locations/locations.html';
          }

          return template;
        },








        
        // cancel project
        cancel: function() {
          $timeout(function() {
            $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
          }, 400);
        },








        // FORM

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












        /**** AFGHANISTAN ****/

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



        /**** TARGET BENEFICIARIES ****/

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
          // get id, remove from UI, remove from db
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



        /**** TARGET LOCATIONS ****/

        // add location
        addLocation: function() {
          $scope.inserted = ngmClusterHelperTargetLocations.addLocation( $scope.project.definition );
          $scope.project.definition.target_locations.push( $scope.inserted );
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
          // location.site_hub_id = null;
          // location.site_hub_name = null;
        },

        // show sites
        showAdminSites: function( $index, $data, target_location ){
          return ngmClusterHelperTargetLocations.showAdminSites( $scope.project.lists, $index, $data, target_location );
        },

        // site_name
        showSiteName: function( $data, target_location ){
          if( $data ) { console.log($data); target_location.site_name = $data; }
          return target_location.site_name ? target_location.site_name : '';
        },


























        // new site?
        showYesNo: function($index, $data, location){
          var selected = [];
          location.new_site_id = $data;
          if(location.new_site_id) {
            selected = $filter('filter')( $scope.project.lists.new_site, { new_site_id: location.new_site_id }, true );
            location.new_site_name = selected[0].new_site_name;
          }
          return selected.length ? selected[0].new_site_name : 'No Selection!';
        },












        // load sites (ET, NG)
        // loadAdmin3Sites: function( $index, target_location ){

        //   // timeout to get admin3 value
        //   $timeout(function(){

        //     // reset client
        //     if (!target_location.id) {
        //       target_location.site_name = null;
        //       target_location.site_id = null;
        //     }

        //     // list storage
        //     if (!$scope.project.lists.sites[$index]) {
        //       $scope.project.lists.sites[$index] = [];
        //     }
        //     // list storage by pcode2
        //     if (!$scope.project.lists.sites[$index][target_location.admin3pcode]) {
        //       $scope.project.lists.sites[$index][target_location.admin3pcode] = [];
        //     }

        //     // set lists
        //       // timeout will enable admin2 to be selected (if user changes admin2 retrospectively)
        //     if ( target_location.admin1pcode 
        //           && target_location.admin2pcode  
        //           && target_location.admin3pcode ) {

        //       // if already existing
        //       if( $scope.project.lists.sites[$index][target_location.admin3pcode] 
        //             && $scope.project.lists.sites[$index][target_location.admin3pcode].length ) {
        //         // do nothing!
        //       } else {
        //         // else fetch!
        //         if( !target_location.id ){
        //           Materialize.toast( 'Loading Sites!' , 6000, 'note' );
        //         }
        //         $http({
        //           method: 'GET', url: ngmAuth.LOCATION + '/api/list/getAdmin3Sites?admin0pcode=' + target_location.admin0pcode
        //                                                 + '&admin1pcode=' + target_location.admin1pcode 
        //                                                 + '&admin2pcode=' + target_location.admin2pcode 
        //                                                 + '&admin3pcode=' + target_location.admin3pcode
        //         }).success( function( result ) {
        //           // sites
        //           $scope.project.lists.sites[$index][target_location.admin3pcode] = result;

        //           // filter
        //           var site_type = $filter('filter')( result, { site_type_id: target_location.site_type_id }, true );

        //           // set to no if no results or type
        //           if ( !result.length || !site_type.length ) {
        //             target_location.site_list_select_id = 'no';
        //             target_location.site_list_select_name = 'No';
        //           } else {
        //             target_location.site_list_select_id = 'yes';
        //             target_location.site_list_select_name = 'Yes';
        //           }

        //         }).error( function( err ) {
        //           Materialize.toast( 'Sites List Error!', 6000, 'error' );
        //         });
        //       }
        //     }
        //   }, 10 );
        // },







        /** EiEWG ************/

        // show the label heading
        showSchoolNameLabel: function(){
          var display = false;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ) {
            if ( d.new_site_id ) {
              display = true;
            }
          });
          return display;
        },

        // show the label heading
        showHubSchoolNameLabel: function(){
          var display = false;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ) {
            if ( d.new_site_id && d.site_implementation_id === 'informal' ) {
              display = true;
            }
          });
          return display;
        },

        // show schools
        showSchools: function($index, $data, location){

          var selected = [];
          location.site_id = $data;
          if( location.site_id && $scope.project.lists.schools[$index] && $scope.project.lists.schools[$index][location.admin2pcode] ) {
            selected = $filter('filter')( $scope.project.lists.schools[$index][location.admin2pcode], { site_id: location.site_id }, true);
            if (selected.length) {
              location.site_name = selected[0].site_name;
              location.site_lng = selected[0].site_lng;
              location.site_lat = selected[0].site_lat;
            }
          }
          return location.site_name ? location.site_name : 'No Selection!';
        },

        // hub school
        showHubSchools: function($index, $data, location){
          var selected = [];
          location.site_hub_id = $data;
          if( location.site_hub_id && $scope.project.lists.hub_schools[$index] && $scope.project.lists.hub_schools[$index][location.admin2pcode] ) {
            selected = $filter('filter')( $scope.project.lists.hub_schools[$index][location.admin2pcode], { site_id: location.site_hub_id }, true);
            if (selected.length) {
              location.site_hub_name = selected[0].site_name;
              if( location.new_site_id === 'yes' ){
                location.site_lng = selected[0].site_lng;
                location.site_lat = selected[0].site_lat;
              }
            }
          }
          return location.site_hub_name;
        },

        // load schools
        loadSchools: function( $index, $data, target_location ){

          // reset client
          if (!target_location.id) {
            target_location.site_name = null;
            target_location.site_id = null;
            target_location.site_hub_id = null;
            target_location.site_hub_name = null;
          }

          // list storage
          if (!$scope.project.lists.schools[$index]) {
            $scope.project.lists.schools[$index] = [];
            $scope.project.lists.hub_schools[$index] = [];
          }
          // list storage by pcode2
          if (!$scope.project.lists.schools[$index][target_location.admin2pcode]) {
            $scope.project.lists.schools[$index][target_location.admin2pcode] = [];
            $scope.project.lists.hub_schools[$index][target_location.admin2pcode] = [];
          }

          // if kabul remove so that PD schools are displayed
          if ( $scope.project.lists.schools[$index][target_location.admin2pcode].length && target_location.admin2pcode === '101' ) {
            $scope.project.lists.schools[$index][target_location.admin2pcode] = [];
            $scope.project.lists.hub_schools[$index][target_location.admin2pcode] = [];
          }

          // set lists
            // timeout will enable admin2 to be selected (if user changes admin2 retrospectively)
          $timeout(function(){
            if ( target_location.admin1pcode && target_location.admin2pcode && target_location.admin2name ) {
              // if already existing
              if( $scope.project.lists.schools[$index][target_location.admin2pcode] && $scope.project.lists.schools[$index][target_location.admin2pcode].length ) {
                // do nothing!
              } else {
                // else fetch!
                if( !target_location.id ){
                  Materialize.toast( 'Loading Schools!' , 6000, 'note' );
                }
                $http({
                  method: 'GET', url: ngmAuth.LOCATION + '/api/list/getAdmin2Sites?cluster_id=' + $scope.project.definition.cluster_id + '&admin0pcode=' + target_location.admin0pcode + '&admin1pcode=' + target_location.admin1pcode + '&admin2pcode=' + target_location.admin2pcode + '&admin2name=' + target_location.admin2name
                }).success( function( result ) {
                  if ( target_location.admin1pcode && target_location.admin2pcode && !result.length ) {
                    Materialize.toast( 'No Schools for ' + target_location.admin1name +', ' + target_location.admin2name + '!' , 6000, 'success' );
                  }
                  // set
                  $scope.project.lists.schools[$index][target_location.admin2pcode] = result;
                  $scope.project.lists.hub_schools[$index][target_location.admin2pcode] = result;
                }).error( function( err ) {
                  Materialize.toast( 'Schools List Error!', 6000, 'error' );
                });
              }
            }
          }, 10 );
        },

        /** EiEWG END ************/











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
            url: ngmAuth.LOCATION + '/api/cluster/project/removeLocation',
            data: { id: id }
          }).success( function( result ) {

          }).error( function( err ) {
            Materialize.toast( 'Error!', 6000, 'error' );
          });

        },











        // validate project type
        project_details_valid: function () {
          // valid
          $scope.project.project_details_valid_labels = [];

          if( !$scope.project.definition.project_title ){
            $scope.project.project_details_valid_labels.push('ngm-project-name');
          }
          if( !$scope.project.definition.project_start_date ){
            $scope.project.project_details_valid_labels.push('ngm-start-date');
          }
          if( !$scope.project.definition.project_end_date ){
            $scope.project.project_details_valid_labels.push('ngm-end-date');
          }
          if( !$scope.project.definition.project_budget_currency ){
            $scope.project.project_details_valid_labels.push('ngm-project-budget');
          }
          if( !$scope.project.definition.project_description ){
            $scope.project.project_details_valid_labels.push('ngm-project-description');
          }

          // if NO labels details valid
          return !$scope.project.project_details_valid_labels.length;
        },

        // validate if ONE activity type
        activity_type_valid: function () {
          // valid
          $scope.project.activity_type_valid_labels = [];

          // activity types?
          if( typeof $scope.project.definition.activity_type_check === 'undefined' ){
            $scope.project.activity_type_valid_labels.push('ngm-activity_type');
          }

          // if NO labels activities valid
          return !$scope.project.activity_type_valid_labels.length;
        },

        // validate project donor
        project_donor_valid: function () {
          // valid
          $scope.project.project_donor_valid_labels = [];

          // activity types?
          if( !$scope.project.definition.project_donor_check ){
            $scope.project.project_donor_valid_labels.push('ngm-project_donor');
          }

          // if NO labels activities valid
          return !$scope.project.project_donor_valid_labels.length;
        },

        // validate if ALL target beneficairies valid
        target_beneficiaries_valid: function(){
          var rowComplete = 0;
          angular.forEach( $scope.project.definition.target_beneficiaries, function( d, i ){
            if ( !$scope.project.rowSaveDisabled(d) ){
              rowComplete++;
            }
          });
          if( rowComplete === $scope.project.definition.target_beneficiaries.length ){
            return true;
          } else {
            return false;
          }
        },






        // AFGHANISTAN




        // preps for 2018 #TODO delete
        categoryShow2017: function(){
          return moment()<moment('2018-02-01')
        },

        // injury sustained same province field
        showFatpTreatmentSameProvince: function( ){
          var display = false;
          var l = $scope.project.definition.target_beneficiaries;
          if( l && $scope.project.definition.admin0pcode === 'AF'  ){
            angular.forEach( l, function(b){
                if( b.activity_description_id === 'fatp_stabilization_referrals_conflict' ||
                    b.activity_description_id === 'fatp_stabilization_referrals_civilian' ){
                      display = true;
              }
            });
          }
          return display;
        },

        showTreatmentSameProvince: function ($data, $beneficiary) {
          var selected = [{}];
          // will show blank for all activities except
          if ($beneficiary.activity_description_id !== 'fatp_stabilization_referrals_conflict' &&
            $beneficiary.activity_description_id !== 'fatp_stabilization_referrals_civilian') {
            delete $beneficiary.injury_treatment_same_province;
            selected[0].text = '-'
          // will show if not selected
          } else if ($data == null) {
            delete $beneficiary.injury_treatment_same_province;
            selected[0].text = 'Not Selected!'
          // will show if selected
          } else {
            $beneficiary.injury_treatment_same_province = $data;
            var selected = $filter('filter')([{
              'choise': true,
              'text': 'Yes'
            }, {
              'choise': false,
              'text': 'No'
            }], {
              choise: $beneficiary.injury_treatment_same_province
            });
          }
          return selected[0].text;
        },













        // validate id ALL target locations valid
        target_locations_valid: function(){
          var rowComplete = 0;
          angular.forEach( $scope.project.definition.target_locations, function( d, i ){
            if ( d.admin1pcode && d.admin1name && d.admin2pcode && d.admin2name && d.site_name ){
              rowComplete++;
            }
            // hack for eiewg
            if ( d.admin0pcode === 'AF' && d.cluster_id === 'eiewg' ) { 
              if ( d.site_implementation_id && d.site_implementation_id === 'informal' && !d.site_hub_id ) {
                rowComplete--;
              }
            }
          });
          if( $scope.project.definition.target_locations.length && ( rowComplete === $scope.project.definition.target_locations.length ) ){
            return true;
          } else {
            return false;
          }
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
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













        // AFG

        // strategic objectives
        compileStrategicObjectives: function( $index ){

          var strategic_objectives = [];

          // each SO
          angular.forEach( $scope.project.definition.strategic_objectives_check, function( key, so ){

            if ( key ) {
              var so_obj = so.split(":");
              // "health_objective_2:2018"
              // old 2017 SO has no year, update db or use this hunch
              if (so_obj[1]==="")so_obj[1]=2017;
              // default
              var objective = $filter('filter')( $scope.project.lists.strategic_objectives[so_obj[1]][ $scope.project.definition.cluster_id ], { objective_type_id: so_obj[0] }, true );
              if( objective[0] ){
                strategic_objectives.push( objective[0] );
              }

              // intercluster
              angular.forEach( $scope.project.definition.inter_cluster_activities, function( d, i ){
                var objective = $filter('filter')( $scope.project.lists.strategic_objectives[so_obj[1]][ d.cluster_id ], { objective_type_id: so_obj[0] }, true );
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
          $scope.project.definition.mpc_purpose_type_id = '';
          $scope.project.definition.mpc_purpose_type_name = '';


          // mpc purpose
          angular.forEach( $scope.project.definition.mpc_purpose_check, function( t, key ){
            if ( t ) {
              var a_type = $filter( 'filter' )( $scope.project.lists.mpc_purpose, { mpc_purpose_type_id: key }, true)[0];
              if ( a_type ) {
                $scope.project.definition.mpc_purpose.push( a_type );
                $scope.project.definition.mpc_purpose_cluster_id += a_type.cluster_id + ', ';
                $scope.project.definition.mpc_purpose_type_id += a_type.mpc_purpose_type_id + ', ';
                $scope.project.definition.mpc_purpose_type_name += a_type.mpc_purpose_type_name + ', ';
              }
            }
          });

          // trim last character of string
          // refactor
          $scope.project.definition.mpc_purpose_cluster_id = $scope.project.definition.mpc_purpose_cluster_id.slice( 0, -2 );
          $scope.project.definition.mpc_purpose_type_id = $scope.project.definition.mpc_purpose_type_id.slice( 0, -2 );
          $scope.project.definition.mpc_purpose_type_name = $scope.project.definition.mpc_purpose_type_name.slice( 0, -2 );
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

        // validate form
        validate: function(){

          // run validation
          $('label').css({ 'color': '#26a69a'});
          $('#ngm-target_locations').css({ 'color': '#26a69a'});
          var scrollDiv;
          var a = $scope.project.project_details_valid();
          var b = $scope.project.activity_type_valid();
          var c = $scope.project.project_donor_valid();
          var d = $scope.project.target_beneficiaries_valid();
          var e = $scope.project.target_locations_valid();

          // locations invalid!
          if ( !e ) {
            $('#ngm-target_locations').css({ 'color': '#EE6E73'});
            scrollDiv = $('#ngm-target_locations');
          }

          if ( !d ) {
            $('#ngm-target_beneficiaries').css({ 'color': '#EE6E73'});
            scrollDiv = $('#ngm-target_beneficiaries');
          }

          // donor
          angular.forEach( $scope.project.project_donor_valid_labels, function( l,i ){
            $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
            scrollDiv = $('#ngm-project_donor_label');
          });

          // activity types
          angular.forEach( $scope.project.activity_type_valid_labels, function( l,i ){
            $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
            scrollDiv = $('#ngm-activity_type_label');
          });

          // project description
          angular.forEach( $scope.project.project_details_valid_labels, function( l,i ){
            $('label[for=' + l + ']').css({ 'color': '#EE6E73'});
            scrollDiv = $('#project_details_form');
          });

          // popup
          if ( a && b && c && d && e ) {
            $( '#save-modal' ).openModal( { dismissible: false } );
          } else {
            // scroll and error
            scrollDiv.animatescroll();
            Materialize.toast( 'Project has Errors!', 6000, 'error' );
          }

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
          // if ( $scope.project.definition.id && $scope.project.definition.admin0pcode === 'ET' ) {
          //   angular.forEach( $scope.project.definition.target_locations, function( d, i ){
          //     if ( d ){
          //       $scope.project.loadAdmin3Sites( i, d );
          //     }
          //   });
          // }








        }, 1000 );

      });
  }

]);
