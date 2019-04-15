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
    'config','$translate',

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
        config,$translate ){

      // set to $scope
      $scope.ngmClusterHelper = ngmClusterHelper;
      $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
      $scope.ngmCbLocations = ngmCbLocations;
      $scope.ngmClusterHelperCol = ngmClusterHelperCol;

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
                  $scope.project.definition.organization === 'FAO' ) ) {
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
            $scope.project.definition.location_groups_check = true;
          }

        },

        // location edit
        // locationEdit: function( $index ) {
        //   $scope.project.definition.target_locations[ $index ].update_location = true;
        // },

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
				uploadDocument: {
					openModal: function (modal) {
						$('#' + modal).openModal({ dismissible: false });
					},
					closeModal: function (modal) {
						$('#' + modal).closeModal({ dismissible: true });
						myDropzone.removeAllFiles(true);
						Materialize.toast($filter('translate')('cancel_to_upload_file'), 2000, "note");
					},
					params: {
						project_id: $route.current.params.project === 'new' ? null : $route.current.params.project,
						username: config.project.username,
						organization_tag: config.project.organization_tag,
						cluster_id: config.project.cluster_id,
						admin0pcode: config.project.admin0pcode,
						adminRpcode: config.project.adminRpcode,
						project_start_date: config.project.project_start_date,
						project_end_date: config.project.project_end_date,
					},
					previewTemplate: `	<div class="dz-preview dz-processing dz-image-preview dz-success dz-complete">
																			<div class="dz-image">
																				<img data-dz-thumbnail>
																			</div>
																			<div class="dz-details">
																				<div class="dz-size">
																					<span data-dz-size>
																				</div>
																				<div class="dz-filename">
																					<span data-dz-name></span>
																				</div>
																			</div>
																			<div data-dz-remove class=" remove-upload btn-floating red" style="margin-left:35%; "><i class="material-icons">clear</i></div> 
																		</div>`,
					completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">'+$filter('translate')('complete')+'</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
					url: ngmAuth.LOCATION + '/api/uploadGDrive',
					acceptedFiles: 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,.zip,text/plain,text/csv,video/mp4,application/mp4',
					maxFiles: 3,
					parallelUploads: 3,
					accept: function (file, done) {
						var ext = file.name.split('.').pop();
						if (file.type.indexOf('image') < 0
							&& file.type.indexOf('officedocument') < 0
							&& file.type !== 'application/msword'
							&& file.type !== 'application/vnd.ms-excel'
							&& file.type !== 'application/vnd.ms-powerpoint'
							&& file.type !== 'application/pdf'
							&& ext !== 'mp4'
							&& ext !== 'zip'
							&& ext !== 'txt'
							&& ext !== 'csv'
						) {
							this.removeFile(file);
							if (this.getQueuedFiles().length > 0) {
								document.querySelector(".dz-default.dz-message").style.display = 'block';
								$timeout(function () {
									document.querySelector(".dz-default.dz-message").style.display = 'none';
								}, 2000)
							}
							$('.dz-default.dz-message').html($scope.project.uploadDocument.notSupportedFile);
							$timeout(function () {
								$('.dz-default.dz-message').html($scope.project.uploadDocument.dictDefaultMessage);
							}, 2000)
						} else {
							done();
						}
					},
					dictDefaultMessage:
						`<i class="medium material-icons" style="color:#009688;">cloud_upload</i> <br/>`+$filter('translate')('drag_files_here_or_click_button_to_upload')+' ',
					dictMaxFilesExceeded: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>`+ $filter('translate')('exceed_file_upload_please_remove_one_of_your_file')+' ',
					tooLargeFilesSize: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>`+ $filter('translate')('file_too_large_please_remove_the_file')+' ',
					notSupportedFile: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>`+ $filter('translate')('not_supported_file_type')+' ',
					errorMessage: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Error`,
					addRemoveLinks: false,
					autoProcessQueue: false,
					headers: { 'Authorization': 'Bearer ' + ngmUser.get().token },
					init: function () {
						myDropzone = this;
						$("#upload_doc").attr("disabled", true);
						$("#delete_doc").attr("disabled", true);

						document.getElementById('upload_doc').addEventListener("click", function () {
							// enable auto process queue after uploading started
							myDropzone.autoProcessQueue = true;
							myDropzone.processQueue(); // Tell Dropzone to process all queued files.																						
						});

						document.getElementById('delete_doc').addEventListener("click", function () {
							myDropzone.removeAllFiles(true);
						});

						// when add file
						myDropzone.on("addedfile", function (file) {
							document.querySelector(".dz-default.dz-message").style.display = 'none';
							var ext = file.name.split('.').pop();
							//change preview if not image/* 
							if (ext == 'pdf') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/pdfm.png");
							}
							if (ext == 'doc' || ext == 'docx') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/docm.png");
							}
							if (ext == 'xls' || ext == 'xlsx') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/xls.png");
							}
							if (ext == 'ppt' || ext == 'pptx') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/ppt.png");
							}
							if (ext == 'zip') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/zipm.png");
							}
							if (ext == 'txt') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/txtm.png");
							}
							if (ext == 'mp4') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/mp4m.png");
							}
							if (ext !== 'pdf' && ext !== 'doc'
								&& ext !== 'docx' && ext !== 'doc'
								&& ext !== 'xls' && ext !== 'xlsx'
								&& ext !== 'ppt' && ext !== 'pptx'
								&& ext !== 'png' && ext !== 'zip'
								&& ext !== 'txt' && ext !== 'mp4') {
								$(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
							}

							// chek filesize if more than 15MB
							if (file.size > 15000000) {
								document.querySelector(".dz-default.dz-message").style.display = 'block'
								$('.dz-default.dz-message').html($scope.project.uploadDocument.tooLargeFilesSize);
								$("#upload_doc").attr("disabled", true);
								document.getElementById("upload_doc").style.pointerEvents = "none";
								$("#delete_doc").attr("disabled", true);
								document.getElementById("delete_doc").style.pointerEvents = "none";
							} else {
								$("#upload_doc").attr("disabled", false);
								$("#delete_doc").attr("disabled", false);
							}
						});

						// when remove file
						myDropzone.on("removedfile", function (file) {
							var bigFile = 0
							if (myDropzone.files.length < 1) {
								$("#upload_doc").attr("disabled", true);
								$("#delete_doc").attr("disabled", true);
								bigFile = 0;
								document.querySelector(".dz-default.dz-message").style.display = 'block';
								$('.dz-default.dz-message').html($scope.project.uploadDocument.dictDefaultMessage);
							}

							if (myDropzone.files.length <= 3 && myDropzone.files.length > 0) {
								document.querySelector(".dz-default.dz-message").style.display = 'none'
								$('.dz-default.dz-message').html($scope.project.uploadDocument.dictDefaultMessage);
								myDropzone.files.forEach((i) => {
									if (i.size > 15000000) {
										bigFile += 1
									}
								})
								// check if in files there are file have more than 8MB after remove
								if (bigFile > 0) {
									$("#upload_doc").attr("disabled", true);
									$("#delete_doc").attr("disabled", true);
									document.querySelector(".dz-default.dz-message").style.display = 'block'
									$('.dz-default.dz-message').html($scope.project.uploadDocument.tooLargeFilesSize);
								} else {
									document.getElementById("upload_doc").style.pointerEvents = 'auto';
									document.getElementById("delete_doc").style.pointerEvents = 'auto';
									$("#upload_doc").attr("disabled", false);
									$("#delete_doc").attr("disabled", false);
								}

							}
						});

						// when max file exceed
						myDropzone.on("maxfilesexceeded", function (file) {
							document.querySelector(".dz-default.dz-message").style.display = 'none';
							$('.dz-default.dz-message').html($scope.project.uploadDocument.dictMaxFilesExceeded);
							document.querySelector(".dz-default.dz-message").style.display = 'block'
							Materialize.toast("Too many file to upload", 6000, "error")
							$("#upload_doc").attr("disabled", true);
							document.getElementById("upload_doc").style.pointerEvents = "none";
							$("#delete_doc").attr("disabled", true);
							document.getElementById("delete_doc").style.pointerEvents = "none";
						});

						// when uploading
						myDropzone.on("uploadprogress", function (file, progress, bytesSent) {
							// hide preview file upload 
							var previews = document.querySelectorAll(".dz-preview");
							previews.forEach(function (preview) {
								preview.style.display = 'none';
							})

							document.querySelector(".dz-default.dz-message").style.display = 'none';
							document.querySelector(".percent-upload").style.display = 'block';
							$(".percentage").html('<div style="font-size:32px;">'+$filter('translate')('uploading')+'</div>');
						});

						// when sending file
						myDropzone.on('sending', function (file) {
							if (this.getUploadingFiles().length == 1) {

								Materialize.toast($filter('translate')('uploading'), 6000, 'note');
							}
							$("#upload_doc").attr("disabled", true);
						});

						// when complete
						myDropzone.on("complete", function (file) {
							if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
								myDropzone.removeAllFiles(true);
							}
						});

						// reset
						this.on("reset", function () {

							document.getElementById("upload_doc").style.pointerEvents = 'auto';
							document.getElementById("delete_doc").style.pointerEvents = 'auto';
						});
					},
					success: function () {
						if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
							msg = $filter('translate')('file_uploaded');
							typ = 'success';
							Materialize.toast(msg, 6000, typ);

							document.querySelector(".percent-upload").style.display = 'none';
							document.querySelector(".dz-default.dz-message").style.display = 'block';
							$('#upload-file').closeModal({ dismissible: true });
							// $rootScope.$broadcast('refresh:doclist');
							$scope.project.getDocument();
						}
					},
					error: function (file, response) {
						document.querySelector(".percent-upload").style.display = 'none';
						if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && !response.err) {
							typ = 'error';
							Materialize.toast(response, 6000, typ);
						}
						if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && response.err) {
							myDropzone.removeAllFiles(true);
							$timeout(function () {
								typ = 'error';
								Materialize.toast(response.err, 6000, typ);
								if (response.err.indexOf('canceled') < 0) {

									Materialize.toast($filter('translate')('upload_canceled'), 6000, typ);
								}
							}, 500);
						}
					}
				},
				manageDocument: {
					openPreview: function (modal, link) {
						$('#' + modal).openModal({ dismissible: false });
						$scope.linkPreview = "https://drive.google.com/file/d/" + link + "/preview";
					},
					setLink: function () {

						return $sce.trustAsResourceUrl($scope.linkPreview);
					},
					removeFile: function () {
						// IF API READY TO USE

						Materialize.toast($filter('translate')('deleting', 6000, 'note');
						$http({
							method: 'DELETE',
							url: ngmAuth.LOCATION + '/api/deleteGDriveFile/' + $scope.fileId,
							headers: { 'Authorization': 'Bearer ' + $scope.project.user.token },
						})
							.success(function (result) {
								$timeout(function () {
									msg = $filter('translate')('file_deleted');
									typ = 'success';
									Materialize.toast(msg, 6000, typ);
									// $rootScope.$broadcast('refresh:doclist');
									$scope.project.getDocument();
								}, 2000);
							})
							.error(function (err) {
								$timeout(function () {
									msg = $filter('translate')('error_file_not_deleted');
									typ = 'error';
									Materialize.toast(msg, 6000, typ);
								}, 2000);
							})
					},
					setRemoveId: function (modal, id) {
						$('#' + modal).openModal({ dismissible: false });
						$scope.fileId = id;
					},
					setDonwloadLink: function (id) {
						var donwloadLink = "https://drive.google.com/uc?export=download&id=" + id;
						return donwloadLink;
					},
					extentionIcon: function (text) {
						text = text.toLowerCase().replace(/\./g, '')
						if (text == 'pdf' || text == 'doc' || text == 'docx' || text == 'ppt' || text == 'pptx' || text == 'xls' || text == 'xlsx') {
							return 'insert_drive_file'
						}
						if (text == 'png' || text == 'jpg' || text == 'jpeg') {
							return 'photo_size_select_actual'
						}
						if (text == 'mp4') {
							return 'play_arrow'
						}
						return 'attach_file'
					},
					extentionColor: function (text) {
						text = text.toLowerCase().replace(/\./g, '')
						if (text == 'pdf' || text == 'doc' || text == 'docx' || text == 'ppt' || text == 'pptx' || text == 'xls' || text == 'xlsx') {
							return '#2196f3 !important'
						}
						if (text == 'png' || text == 'jpg' || text == 'jpeg') {
							return '#f44336 !important'
						}
						if (text == 'mp4') {
							return '#f44336 !important'
						}
						return '#26a69a !important'
					},
					setThumbnailfromGdrive: function (id) {
						img = "https://drive.google.com/thumbnail?authuser=0&sz=w320&id=" + id;
						return img
					},
				},
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

          // update target_beneficiaries
          $scope.project.definition.target_beneficiaries =
              ngmClusterHelper.getCleanTargetBeneficiaries( $scope.project.definition, $scope.project.definition.target_beneficiaries );

          // update target_locations
          $scope.project.definition.target_locations =
              ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.definition.target_locations );


          // inform
          Materialize.toast( $filter('translate')('processing'), 60000, 'note' );

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

              $('.toast').remove();

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
  }

]);
