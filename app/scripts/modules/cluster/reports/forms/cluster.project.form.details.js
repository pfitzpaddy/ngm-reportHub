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
		'$sce',
    'ngmUser',
    'ngmAuth',
    'ngmData',
    'ngmClusterLists',
    'ngmClusterHelper',
    'ngmClusterBeneficiaries',
    'ngmClusterLocations',
    'ngmClusterValidation',
    'ngmClusterHelperAf',
    'ngmCbLocations',
    'ngmClusterHelperCol',
    'ngmCbBeneficiaries',
		'ngmClusterDocument',
    'config',
    '$translate',

    function( 
        $scope, 
        $location, 
        $timeout,
        $filter,
        $q,
        $http,
				$route,
				$sce,
        ngmUser,
        ngmAuth,
        ngmData,
        ngmClusterLists,
        ngmClusterHelper,
        ngmClusterBeneficiaries,
        ngmClusterLocations,
        ngmClusterValidation,
        ngmClusterHelperAf,
        ngmCbLocations,
        ngmClusterHelperCol,
        ngmCbBeneficiaries,
				ngmClusterDocument,
        config,
        $translate ){

      // set to $scope
      $scope.ngmClusterHelper = ngmClusterHelper;
      $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
      $scope.ngmCbLocations = ngmCbLocations;
      $scope.ngmClusterHelperCol = ngmClusterHelperCol;
			$scope.ngmCbBeneficiaries = ngmCbBeneficiaries;
			$scope.ngmClusterDocument = ngmClusterDocument;

      // project
      $scope.project = {

        
        // defaults
        user: ngmUser.get(),
        style: config.style,
        submit: true,
        newProject: $route.current.params.project === 'new' ? true : false,
        definition_original: angular.copy( config.project ),
        definition: config.project,
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),
        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),

       afterSelectItem : function(item){
        //console.log(item);
         $scope.project.definition.project_donor_check[item.project_donor_id] = true ;
         //console.log("project_donor_check",$scope.project.definition.project_donor_check);
         //console.log("$scope.project.definition.project_donor",$scope.project.definition.project_donor);
         
          
       },

       searchDonor:function(query){
        return $scope.project.lists.donors.filter(function (el) {
          return el.project_donor_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
       },

       afterSelectPartner : function (item){

       //
       },

       searchPartner:function(query){
        return $scope.project.lists.organizations.filter(function (el) {
          return el.organization_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
       },

       
				searchOrgPartner: null,
				searchImplementingPartner: function (query) {

					// if (!$scope.project.definition.implementing_partners_array) {
					// 	$scope.project.definition.implementing_partners_array = [];
					// }
					if (!$scope.project.definition.implementing_partners) {
						$scope.project.definition.implementing_partners = [];
					}
					return $scope.project.lists.organizations.filter(function (el) {
						return el.organization.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
				},
				addNewImplementingPartner: function (chip) {
					// $scope.project.definition.target_locations.forEach(function (el) {
					// 	delete chip.organization_type
					// 	delete chip.id
					// 	delete chip.organization_name
					// 	if (!el.partners) {
					// 		el.partners = [];
					// 		el.partners.push(chip);
					// 	} else {
					// 		el.partners.push(chip);
					// 	}

					// })
					// $scope.project.stringfyImplementingPartner()
					if ($scope.project.definition.target_locations.length >0){
						$scope.project.definition.target_locations.forEach(function (el) {
							delete chip.organization_type
							delete chip.id
							delete chip.organization_name
							if (!el.implementing_partners) {
								el.implementing_partners = [];
								el.implementing_partners.push(chip);
							} else {
								el.implementing_partners.push(chip);
							}
	
						})
					}
					
				},
				removeImplementingPartner: function (chip) {
					// $scope.project.definition.target_locations.forEach(function (el) {

					// 	index = el.partners.indexOf(chip);
					// 	el.partners.splice(index, 1);

					// 	if (el.partners.length < 1) {
					// 		delete el.partners;
					// 	}

					// })
					// $scope.project.stringfyImplementingPartner()
					if ($scope.project.definition.target_locations.length > 0){
						$scope.project.definition.target_locations.forEach(function (el) {
	
							index = el.implementing_partners.indexOf(chip);
							el.implementing_partners.splice(index, 1);
	
							if (el.implementing_partners.length < 1) {
								delete el.implementing_partners;
							}
	
						})
					}

				},
				// stringfyImplementingPartner: function () {
				// 	var string = [];
				// 	if ($scope.project.definition.implementing_partners_array) {
				// 		array = $scope.project.definition.implementing_partners_array;
				// 		array.forEach(function (el) {
				// 			// string += el.organization
				// 			string.push(el.organization)
				// 		})
				// 		$scope.project.definition.implementing_partners = string.join(', ')
				// 	}
				// },
        // cluster
        displayIndicatorCluster: {
          'AF': [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'gbv', 'rnr_chapter', 'wash' ],
          'CB': [ 'wash', 'protection' ]
        },

        // activity details
        showActivityDetailsColumn: false,
        showActivityDetailsColumnRow: [],

        // indicator
        showIndicatorColumn: false,
        showIndicatorColumnRow: [],

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
				uploadUrl:'project-upload.html',
        // targets
        targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
        targetBeneficiariesTrainingUrl: 'target-beneficiaries/2016/target-beneficiaries-training.html',
        targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
        locationsUrl: config.project.admin0pcode === 'CB' ? 'target-locations/CB/locations.html' : 'target-locations/locations.html',
        locationsAddUrl: 'target-locations/add.location.html',


        // init lists
        init: function() {
          // usd default currency
          if( !$scope.project.definition.project_budget_currency ){
            $scope.project.definition.project_budget_currency = 'usd';
          }

          // init
          setTimeout( function(){
            $( '#ngm-project-name' ).focus();
            $( 'select' ).material_select();
            $( 'textarea' ).height( $('textarea')[0].scrollHeight );
          }, 600 );

          // set org users
          ngmClusterLists.setOrganizationUsersList( $scope.project.lists, config.project );
          // set form on page load
          ngmClusterHelper.setForm( $scope.project.definition, $scope.project.lists );          
          // set columns / rows (lists, location_index, beneficiaries )
					ngmClusterBeneficiaries.setBeneficiariesForm( $scope.project.lists, 0, $scope.project.definition.target_beneficiaries );
					$scope.project.setTokenUpload();
					// add partner to target location if  partner not added in target location adn implementing_partners array length > 0
					// if ($scope.project.definition.implementing_partners_array){
					// 	if ($scope.project.definition.target_locations.length > 0) {
					// 		$scope.project.definition.target_locations.forEach(function (el) {
					// 			if (!el.partners) {
					// 				el.partners = angular.copy($scope.project.definition.implementing_partners_array);
					// 			} 
					// 		})
					// 	}
					// }	
					if ($scope.project.definition.implementing_partners.length >0) {
						if ($scope.project.definition.target_locations.length > 0) {
							$scope.project.definition.target_locations.forEach(function (el) {
								if (!el.implementing_partners) {
									el.implementing_partners = angular.copy($scope.project.definition.implementing_partners);
								}
							})
						}
					}		
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){
          if( modal === 'summary-modal' ) {
            // check for project changes
          }
          $scope.project.cancel();
        },

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // path / msg
            var path = $scope.project.definition.project_status === 'new' ? '/cluster/projects' : '/cluster/projects/summary/' + $scope.project.definition.id;
            var msg = $scope.project.definition.project_status === 'new' ? $filter('translate')('create_project_cancelled') : $filter('translate')('create_project_cancelled');
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
            if ( $scope.project.definition.admin0pcode === 'CB' ) {
              $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'JRP' );
            } else {
              $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'OTH', 'HRP' );
            }
          } else {
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'HRP', 'OTH' );
            $scope.project.definition.project_hrp_code = $scope.project.definition.project_hrp_code.replace( 'JRP', 'OTH' );
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
        addBeneficiary: function( defaults ) {
          
          // set beneficiaries
          $scope.inserted = ngmClusterBeneficiaries.addBeneficiary( $scope.project.definition.target_beneficiaries, defaults );
          $scope.project.definition.target_beneficiaries.push( $scope.inserted );
          
          // set columns / rows display
          ngmClusterBeneficiaries.setBeneficiariesFormTargets( $scope.project.lists, 0, $scope.inserted, $scope.project.definition.target_beneficiaries.length-1 );
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
          ngmClusterBeneficiaries.form.active[ 0 ].rows.splice( $scope.project.beneficiaryIndex, 1 );
          ngmClusterBeneficiaries.removeTargetBeneficiary( id );
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
        },

        // save beneficiary
        saveBeneficiary: function() {
          $scope.project.save( false, $filter('translate')('people_in_need_saved') );
        },


        /**** TARGET LOCATIONS GROUPING MODAL ****/

        // show report groupings option
        showLocationGroupingsOption: function() {
         
          var display = false;

          if ( $scope.project.definition.admin0pcode === 'CB' &&
                ( $scope.project.definition.organization === 'WFP' ||
                  $scope.project.definition.organization === 'FAO' ||
                  $scope.project.definition.organization === 'IOM' ||
                  $scope.project.definition.organization === 'UNHCR' ) ) {
            display = true;
          }

          return display;
        },

        // display the location group in the form
        showLocationGroup: function( $data, target_location ){
          return ngmClusterLocations.showLocationGroup( $scope.project.lists, $data, target_location )
        },

        // manage modal
        showLocationGroupingsModal: function( $event ) {

          // prevrnt defaults
          $event.preventDefault();
          $event.stopPropagation();

          // show modal
          if ( $scope.project.definition.location_groups_check ) {
            $( '#location-group-remove-modal' ).openModal({ dismissible: false });
          } else {
            $( '#location-group-add-modal' ).openModal({ dismissible: false });
          }
        },

        // set to true
        addLocationGroupdings: function() {
          // add to project
          $scope.project.definition.location_groups_check = true;
          // add to target_locations
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){
            // location group
            l.location_group_id = l.admin2pcode;
            l.location_group_type = l.admin2type_name;
            l.location_group_name = l.admin2name;
          });
        },

        // manage modal
        removeLocationGroupings: function() {
          // remove from project
          $scope.project.definition.location_groups_check = false;
          // remove from target_locations
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){
            // location group
            delete l.location_group_id;
            delete l.location_group_type;
            delete l.location_group_name;
          });
        },


        /**** TARGET LOCATIONS ( ngmClusterLocations.js ) ****/

        // add location
        addLocation: function() {
          $scope.inserted = ngmClusterLocations.addLocation( $scope.project.definition, $scope.project.definition.target_locations );
          $scope.project.definition.target_locations.push( $scope.inserted );
          // autoset location groupings
          if (  $scope.project.showLocationGroupingsOption() && $scope.project.definition.target_locations.length > 30  ) {
            $scope.project.addLocationGroupdings();
          }

        },

        // save location
        saveLocation: function() {
          $scope.project.save( false, $filter('translate')('project_location_saved') );
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
        
        // site_name_alternative
        showSiteNameAlternative: function( $data, target_location ){
          return ngmClusterLocations.showSiteNameAlternative( $data, target_location );
        },        


        
        /**** CANCEL EDIT ( beneficiaries or locations ) ****/

        // remove from array if no id
        cancelEdit: function( key, $index ) {
          if ( !$scope.project.definition[ key ][ $index ].id ) {
            $scope.project.definition[ key ].splice( $index, 1 );
            ngmClusterBeneficiaries.form.active[ 0 ].rows.splice( $index, 1 );
          }
          // set columns / rows
          ngmClusterBeneficiaries.setBeneficiariesForm( $scope.project.lists, 0, $scope.project.definition.target_beneficiaries );          
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

				/**** UPLOAD ****/
				setTokenUpload: function(){				
					ngmClusterDocument.setParam($scope.project.user.token);
				},
				// need paramter for upload for this function
				uploadDocument: ngmClusterDocument.uploadDocument({
					project_id: $route.current.params.project === 'new' ? null : $route.current.params.project,
					username: config.project.username,
					organization_tag: config.project.organization_tag,
					cluster_id: config.project.cluster_id,
					admin0pcode: config.project.admin0pcode,
					adminRpcode: config.project.adminRpcode,
					project_start_date: config.project.project_start_date,
					project_end_date: config.project.project_end_date,
				}),
				getDocument: function () {
					ngmData.get({
						method: 'GET',
						url: ngmAuth.LOCATION + '/api/listProjectDocuments/' + $route.current.params.project
					}).then(function (data) {
						// assign data
						$scope.listUpload = data;
						$scope.listUpload.id = 'ngm-paginate-' + Math.floor((Math.random() * 1000000))
						$scope.listUpload.itemsPerPage = 12;
						$scope.listUpload.itemsPerListPage = 6;
					});
				}, 

        /**** SAVE ****/
        
        // save project
        save: function( display_modal, save_msg ){

          // disable btn
          $scope.project.submit = false;

          // project_status
          if ( $scope.project.definition.project_status === 'new' ) {
            $scope.project.definition.project_status = 'active';
          }

          // parse budget
          $scope.project.definition.project_budget += '';
          $scope.project.definition.project_budget = $scope.project.definition.project_budget.replace(',', '');
          $scope.project.definition.project_budget = parseFloat( $scope.project.definition.project_budget );

          // groups
          $scope.project.definition.location_groups = [];

          // add location_groups
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){
            // location group
            if ( $scope.project.definition.location_groups_check ) {
              var found = $filter('filter')( $scope.project.definition.location_groups, { location_group_id: l.admin2pcode }, true );
              if ( !found.length ){
                $scope.project.definition.location_groups.push( { location_group_id: l.admin2pcode, location_group_type: l.admin2type_name, location_group_name: l.admin2name } );
              }
            }
          });

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
              if( save_msg ){ Materialize.toast( save_msg , 6000, 'success' ); }

              // notification modal
              if( display_modal ){

                // modal-trigger
                $('.modal-trigger').leanModal();

                // save msg
                var msg = $scope.project.newProject ? $filter('translate')('project_created')+'!' : $filter('translate')('project_updated');

                // save, redirect + msg
                $timeout(function(){
                  $location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
                  $timeout(function(){ Materialize.toast( msg, 6000, 'success' ); }, 400 );
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
			$scope.project.getDocument();
			// update list  if there are upload file or remove file
			$scope.$on('refresh:listUpload', function () {
				$scope.project.getDocument();				
			})
  }

]);
