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
		'$sce',
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
    'ngmClusterHelperCol',
		'NgTableParams',
    'config','$translate','$filter',

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
      ngmClusterHelperCol,
			NgTableParams,
      config,$translate,$filter ){
      

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
      $scope.ngmClusterHelperCol = ngmClusterHelperCol;
			$scope.deactivedCopybutton = false;

      // project
      $scope.project = {

        // defaults
        user: ngmUser.get(),
        style: config.style,
        definition: config.project,
        report: config.report,
        location_group: config.location_group,
        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        monthlyTitleFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMMM, YYYY'),
				monthNameFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMM'),
				previousMonth: moment.utc([config.report.report_year, config.report.report_month, 1]).subtract(1,'month').format("MMMM, YYYY"),

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
				uploadUrl: 'report-upload.html',
				// #########FOR-TRAINING TEST
				// fsac_assessment: 'beneficiaries/AF/assessment_fsac_absnumber_v2.html',
				//percentage
				fsac_assessment: 'beneficiaries/AF/fsac_percentage.html',

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
          // set columns / rows
          ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
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
            if ( $scope.project.location_group ) {
              $location.path( '/cluster/projects/group/' + $scope.project.definition.id + '/' + $scope.project.report.id );
            } else {
              $location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
            }
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

        // update inidcators ( place into array on update )
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
          // set columns / rows display
          ngmClusterBeneficiaries.setBeneficiariesFormTargets( $scope.project.lists, $parent, $scope.inserted, $scope.project.report.locations[ $parent ].beneficiaries.length-1 );
        },

        // add beneficiary
        addNgWashBeneficiary: function( $parent ) {
          $scope.inserted = ngmClusterHelperNgWash.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries );
          $scope.project.report.locations[ $parent ].beneficiaries.push( $scope.inserted );
        },

				// remove beneficiary nodal
        removeBeneficiaryModal: function( $parent, $index ) {					
					if (!$scope.project.report.locations[$parent].beneficiaries[$index].id) {		
						$scope.project.report.locations[$parent].beneficiaries.splice($index, 1);
						$scope.project.activePrevReportButton();						
					} else{
						if ( ngmClusterBeneficiaries.beneficiaryFormComplete( $scope.project.definition, $scope.project.report.locations ) ){
								$scope.project.locationIndex = $parent;
								$scope.project.beneficiaryIndex = $index;
							$( '#beneficiary-modal' ).openModal({ dismissible: false });
						}
					} 
        },

        // remove beneficiary
        removeBeneficiary: function() {
          var id = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ].id;
					$scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
					$scope.project.activePrevReportButton();
          ngmClusterBeneficiaries.removeBeneficiary( $scope.project, id );
        },


        
        /**** LOCATIONS ****/

        // return monthly report title for location
        getReportTitle: function( target_location ){

          // default admin 1,2
          var title = '';

          // site_type_name
          if ( target_location.site_type_name ) {
            title += target_location.site_type_name + ': ';
          }

          title += target_location.admin1name + ', ' + target_location.admin2name;

          // admin levels 3,4,5
          if ( target_location.admin3name ) {
            title += ', ' + target_location.admin3name;
          }
          if ( target_location.admin4name ) {
            title += ', ' + target_location.admin4name;
          }
          if ( target_location.admin5name ) {
            title += ', ' + target_location.admin5name;
          }

          // site_name
          title += ', ' + target_location.site_name;

          return title;
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

					// fsac_assessment
					showFsacAssessment:function(b){
						if (b.activity_description_id){

							if (b.activity_type_id === 'fsac_assessments' && 
								(b.activity_description_id.indexOf('sess') > -1 
								|| (b.activity_description_id) ==='fsac_pre_harvest_appraisal'))
								{
								return true
							}
						}
						return false
					},

				fsacAssessmentPercentage:function (b) {
					// version 1
					// if (b.hh_assements_poor_after>0){

					// 	b.hh_assements_percentage = (b.hh_assements_poor_after - b.hh_assements_poor_after / b.hh_assements)*100;
					// }
					// b.hh_assements_percentage =0;

					// version 2 absolute_number
					// $scope.fsac_assessment_disabled = false;
					// 	var total = b.hh_acceptable + b.hh_borderline + b.hh_poor;
					// 	var total_pmd = b.hh_acceptable_pmd + b.hh_borderline_pmd + b.hh_poor_pmd;
					// 	if (total > b.hh_surveyed || total_pmd > b.hh_surveyed){
					// 		$scope.fsac_assessment_disabled = true;
							
					// 	}
					
					// version 2 percentage
					$scope.fsac_assessment_invalid = false;
					$scope.fsac_assessment_overflow = false;
					$scope.fsac_assessment_disabled = false;
					var total = b.hh_acceptable + b.hh_borderline + b.hh_poor;
					var total_pmd = b.hh_acceptable_pmd + b.hh_borderline_pmd + b.hh_poor_pmd;

					if (total > 100 || total_pmd > 100) {
						$scope.fsac_assessment_overflow = true;
					}
					if ((b.hh_acceptable < 0 || b.hh_borderline < 0 || b.hh_poor < 0 || b.hh_acceptable_pmd < 0 || b.hh_borderline_pmd < 0 || b.hh_poor_pmd < 0) ||
						(b.hh_acceptable === undefined || b.hh_borderline === undefined || b.hh_poor === undefined || b.hh_acceptable_pmd === undefined || b.hh_borderline_pmd === undefined || b.hh_poor_pmd === undefined) || isNaN(total) || isNaN(total_pmd)) {
						$scope.fsac_assessment_invalid = true;
					}

					if ($scope.fsac_assessment_invalid ||
					$scope.fsac_assessment_overflow){
						$scope.fsac_assessment_disabled = true;
					}

					
				},

				fsacToPercentage:function(b,string){
					// b[string] = (b[string]/b.hh_surveyed)*100;
				},
				setAssessmentAtribute: function ($parent,$index){
					var beneficiary = $scope.project.report.locations[$parent].beneficiaries[$index]
					$scope.project.report.locations[$parent].beneficiaries[$index]=ngmClusterBeneficiaries.setAssessmentAtribute(beneficiary);
				},
        // disable save form
        rowSaveDisabled: function( $data ){
          return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
        },

        // remove from array if no id
        cancelEdit: function( $parent, $index ) {
          if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
						if (!$scope.project.report.locations[$parent].beneficiaries[$index].copy_prev_month){					
							 $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
						}
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

				// process adding previous report data
				addPrevReport: function(prev_report){
					angular.forEach(prev_report.locations, function(l,i){

						var project_id=l.project_id ;site_id = l.site_id; site_name = l.site_name; admin1pcode = l.admin1pcode; admin2pcode = l.admin2pcode;

						var $loc = $scope.project.report.locations.find(function (l) {							
							return (l.site_id === site_id) && (l.project_id===project_id) && (l.site_name === site_name ) &&(l.admin1pcode===admin1pcode) && (l.admin2pcode === admin2pcode);
						})

						if($loc !== undefined){

							angular.forEach(l.beneficiaries, function (b,i) {					
								$scope.insertedBeneficiary = ngmClusterHelper.getCleanBeneficiaryforCopy(b,$loc,$scope.project.report);														
								$scope.project.report.locations.find(function (l) {		
									return (l.site_id === site_id) && (l.project_id === project_id) && (l.site_name === site_name) && (l.admin1pcode === admin1pcode) && (l.admin2pcode === admin2pcode);
								}).beneficiaries.push($scope.insertedBeneficiary);
							})
							
							angular.forEach(l.trainings,function (t,j) {
								$scope.insertedTraining = ngmClusterHelper.getCleanTrainingsforCopy(t,$loc,$scope.project.report);								
								$scope.project.report.locations.find(function (l) {									
									return (l.site_id === site_id) && (l.project_id === project_id) && (l.site_name === site_name) && (l.admin1pcode === admin1pcode) && (l.admin2pcode === admin2pcode);
								}).trainings.push($scope.insertedTraining);								
							})

						} else{
							new_location = ngmClusterHelper.getCleanCopyLocation(l,$scope.project.report);
							$scope.project.report.locations.push(new_location);							
						}
					})					
				},
				
				// entry copy previous report
				copyPrevReport: function(){
					Materialize.toast('Getting Data...', 1500, 'note');
					$scope.deactivedCopybutton = true;
					$scope.addBeneficiaryDisable = true;
					var setParam ={}
					if (config.report.report_month < 1) {
						setParam ={
							id: $route.current.params.report,
							project_id: $route.current.params.project,
							month: 11,
							year: config.report.report_year-1,
							previous: true
						}
					} else{
						setParam = {
							id: $route.current.params.report,
							project_id: $route.current.params.project,
							month: config.report.report_month - 1,
							// month: config.report.report_month,							
							year: config.report.report_year,
							previous: true
						}
					}


					var getPrevReport ={
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/getReport',
						data: setParam
					}

					ngmData.get(getPrevReport).then(function (prev_report) {
						
						var brows = 0;
						var trows =0;
						var info = "Save to apply changes"
						angular.forEach(prev_report.locations, function(l){
							brows += l.beneficiaries.length;
							trows += l.trainings.length;
						})

						if(!brows && !trows){
							if(Object.keys(prev_report).length){
								var msg = "No data in previous report";
										typ = 'success';
							}else{
								var msg = "No previous report";
										typ = 'success';
							}
							$scope.deactivedCopybutton = false;
							
								Materialize.toast(msg, 3000, typ);
							
						} else{
							Materialize.toast('Copying ...', 1500, 'note');
							if ( !brows && trows > 0 ){
									var msg = 'Copied Trainings ' + trows + ' rows';
									typ = 'success';
							} else if ( brows > 0 && !trows ){
								var msg = "Copied Beneficiaries " + brows + ' rows';
									  typ = 'success';
							} else{
									var msg = 'Copied beneficiaries ' + brows + ' rows'+ " and " + 'trainings ' + trows + ' rows';
										  typ = 'success';
							}

              // reset form UI layout
              $timeout(function() {
                ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
              }, 10 );
							
							$scope.project.addPrevReport(prev_report);
							$timeout(function () {
								countNewLocation=0;
								angular.forEach($scope.project.report.locations,function(loc){
									if(!loc.id){
										countNewLocation+=1;
									}
								})
								if(countNewLocation>0){
									msg += " and "+countNewLocation+" location"
								}
								Materialize.toast(msg, 4000, typ);
								Materialize.toast(info, 4500, 'note');
							}, 1500);
						}						
						$scope.addBeneficiaryDisable = false;						
						
					}).catch(function (e){
						Materialize.toast("Error, Not copied", 3000, 'error');
						$scope.addBeneficiaryDisable = false;
						$scope.deactivedCopybutton = false;
					})
				},

				// active deactivate copy previoust month
				activePrevReportButton: function(){
					
					$scope.beneficiariesCount= 0;
					$scope.trainingsCount = 0;
					$scope.project.report.locations.forEach(function(l){
            if ( l.beneficiaries && l.beneficiaries.length ) {
  						 $scope.beneficiariesCount += l.beneficiaries.length;
  						 if(l.trainings){
  							 $scope.trainingsCount += l.trainings.length;
  						 }
             }						 
					});
					
					if( $scope.project.report.report_status !== 'todo' || (( $scope.beneficiariesCount >0 ) || ( $scope.trainingsCount> 0 ) )){
						$scope.deactivedCopybutton= true;						
						return $scope.deactivedCopybutton
					} else{
						$scope.deactivedCopybutton = false;
						return $scope.deactivedCopybutton;
					}					

				},

				// upload document report
				uploadDocument: {
					openModal: function (modal) {
						$('#' + modal).openModal({ dismissible: false });
					},
					closeModal: function (modal) {
						$('#' + modal).closeModal({ dismissible: true });
						myDropzone.removeAllFiles(true);
						Materialize.toast("Cancel to upload file", 2000, "note");
					},
					params: {
						project_id:config.project.id,
						report_id: config.report.id,
						username: ngmUser.get().username,
						organization_tag: config.report.organization_tag,
						cluster_id: config.report.cluster_id,
						admin0pcode: config.report.admin0pcode,
						adminRpcode: config.report.adminRpcode,
						reporting_period: config.report.reporting_period,
						project_start_date: config.project.project_start_date,
						project_end_date: config.project.project_end_date
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
					completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">Complete!</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
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
							if (this.getQueuedFiles().length>0){
								document.querySelector(".dz-default.dz-message").style.display = 'block';
								$timeout(function () {
									document.querySelector(".dz-default.dz-message").style.display = 'none';
								}, 2000)
							}
							$('.dz-default.dz-message').html($scope.project.uploadDocument.notSupportedFile);
							$timeout(function(){
								$('.dz-default.dz-message').html($scope.project.uploadDocument.dictDefaultMessage);
							},2000)
						} else {
							done();
						}
					},
					dictDefaultMessage:
						`<i class="medium material-icons" style="color:#009688;">cloud_upload</i> <br/>Drag files here or click button to upload `,
					dictMaxFilesExceeded:`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Exceed file upload, Please remove one of your file `,
					tooLargeFilesSize: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>File too large, Please remove the file `,
					notSupportedFile:`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Not supported file type ! `,
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
							// $('#exceed-file').openModal({ dismissible: false });
							$('.dz-default.dz-message').html($scope.project.uploadDocument.dictMaxFilesExceeded);
							document.querySelector(".dz-default.dz-message").style.display = 'block'
							Materialize.toast("Too many file to upload",3000,"error")
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
							$(".percentage").html('<div style="font-size:32px;">Uploading....! </div>');
							// uncomment  this code below, if the write to server and gdrive is work well 
							// progress = Math.round(progress)
							// $(".percentage").text(progress + '%');											

							// if(progress== 100){												
							// 	$timeout(function () {
							// 		$(".percentage").html('<i class="medium material-icons" style="color:#009688;margin-left: 38%;">check_circle_outline</i><div style="font-size:32px;">Upload Success ! </div>');
							// 		$(".progress").hide()
							// 	},1000)
							// }
						});

						// when sending file
						myDropzone.on('sending', function (file) {
							if (this.getUploadingFiles().length == 1) {
								Materialize.toast('Uploading...', 3000, 'note');
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
							msg = "File Uploaded!";
							typ = 'success';
							Materialize.toast(msg, 2000, typ);

							document.querySelector(".percent-upload").style.display = 'none';
							document.querySelector(".dz-default.dz-message").style.display = 'block';
							$('#upload-file').closeModal({ dismissible: true });
							// $rootScope.$broadcast('refresh:doclist');
							$scope.project.getDocument();
						}
					},
					error: function (file, response) {
						document.querySelector(".percent-upload").style.display = 'none';
						if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && !response.err){
							typ = 'error';
							Materialize.toast(response, 2000, typ);
						}
						if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0 && response.err) {
							myDropzone.removeAllFiles(true);
							$timeout(function () {
								typ = 'error';
								Materialize.toast(response.err, 2000, typ);
								if (response.err.indexOf('canceled') < 0) {
									Materialize.toast('Upload canceled', 2000, typ);
								}
							}, 500);
						}
					}
				},
				manageDocument:{
					openPreview:function(modal,link){
						$('#' + modal).openModal({ dismissible: false });
						$scope.linkPreview = "https://drive.google.com/file/d/" + link + "/preview";
					},
					setLink:function () {
						
						return $sce.trustAsResourceUrl($scope.linkPreview);
					},
					removeFile: function () {
						// IF API READY TO USE
						Materialize.toast("Deleting...", 2000, 'note');
						$http({
							method: 'DELETE',
							url: ngmAuth.LOCATION + '/api/deleteGDriveFile/' + $scope.fileId,
							headers: { 'Authorization': 'Bearer ' + $scope.project.user.token },
						})
							.success(function (result) {
								$timeout(function () {
									msg = "File Deleted!";
									typ = 'success';
									Materialize.toast(msg, 2000, typ);
									// $rootScope.$broadcast('refresh:doclist');
									$scope.project.getDocument();
								}, 2000);
							})
							.error(function (err) {
								$timeout(function () {
									msg = "Error, File Not Deleted!";
									typ = 'error';
									Materialize.toast(msg, 2000, typ);
								}, 2000);
							})
					},
					setRemoveId: function (modal,id) {
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
				getDocument:function(){
					ngmData.get({
						method: 'GET',
						url: ngmAuth.LOCATION + '/api/listReportDocuments/' + $route.current.params.report
					}).then(function (data) {
						// assign data
						// set for grid view
						$scope.listUpload = data;
						$scope.listUpload.id = 'ngm-paginate-' + Math.floor((Math.random() * 1000000))
						$scope.listUpload.itemsPerPage= 12,
						$scope.tableParams = new NgTableParams({
							page: 1,
							count: 6,
							sorting: { createdAt: 'desc' }
						}, {
								counts: [],
								data: data,
								total: data.length
							});
					});
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
			$scope.project.activePrevReportButton();
			$scope.project.getDocument();
  }

]);
