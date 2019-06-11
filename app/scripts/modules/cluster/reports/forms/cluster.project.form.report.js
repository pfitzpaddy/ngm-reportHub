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
		'$window',
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
		'ngmEtClusterBeneficiaries',
		'ngmCbBeneficiaries',
		'ngmClusterDocument',
		// 'NgTableParams',
		'config','$translate','$filter',

		function( 
			$scope,
			$window,
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
			ngmEtClusterBeneficiaries,
			ngmCbBeneficiaries,
			ngmClusterDocument,
			// NgTableParams,
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
			$scope.ngmEtClusterBeneficiaries = ngmEtClusterBeneficiaries;
			$scope.ngmCbBeneficiaries = ngmCbBeneficiaries;
			$scope.ngmClusterDocument = ngmClusterDocument;
			$scope.deactivedCopybutton = false;

			// project
			$scope.project = {

				/**** DEFAULTS ****/
				user: ngmUser.get(),
				style: config.style,
				definition: config.project,
				report: config.report,
				location_group: config.location_group,
				location_limit: config.report.locations.length,
				location_beneficiary_limit: [],
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
					
					// if beneficiaries, set init load limit to help rendering of elements on big forms
					angular.forEach( $scope.project.report.locations, function( l, i ){
						if( l.beneficiaries.length ){
							$scope.project.location_limit = 1;
							for ( j=0; j<$scope.project.location_limit; j++ ){
								$scope.project.location_beneficiary_limit[ j ] = {
									beneficiary_limit:6,
									beneficiary_count:$scope.project.report.locations[j].beneficiaries.length
								}
							}
						}
					});
					
					// onscroll, update incrementLocationLimit
					$window.onscroll = function() {
						// height, position
						var scrollHeight = $(document).height();
						var scrollPosition = $(window).height() + $(window).scrollTop();

						// 0.50 of scrolling height, add location_limit
						if ( ( scrollHeight - scrollPosition ) / scrollHeight < 0.50 ) {
					    // when scroll to bottom of the page
					    $scope.project.incrementLocationLimit();
						}
					};

					// sort locations
					$scope.project.report.locations = $filter('orderBy')( $scope.project.report.locations, [ 'site_type_name','admin1name','admin2name','admin3name','site_name' ]);
					// set org users
					ngmClusterLists.setOrganizationUsersList( $scope.project.lists, config.project );
					// set form on page load
					ngmClusterHelper.setForm( $scope.project.definition, $scope.project.lists );
					// set columns / rows
					ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
					// et esnfi set details
					ngmEtClusterBeneficiaries.setForm( $scope.project.report.locations, 1350 );
					// documents upload
					$scope.project.setTokenUpload();
				},

				// incrementLocationLimit
				incrementLocationLimit: function() {

					// scroll
					for ( j=0; j<$scope.project.location_limit; j++ ){
						if ( $scope.project.location_beneficiary_limit[ j ].beneficiary_count > $scope.project.location_beneficiary_limit[ j ].beneficiary_limit  ) {
							// set holder
							if ( !$scope.project.location_beneficiary_limit[ j ] ) {
								$scope.project.location_beneficiary_limit[ j ] = {
									beneficiary_limit:0,
									beneficiary_count:$scope.project.report.locations[j].beneficiaries.length
								}
							}
							// increment
							$scope.project.location_beneficiary_limit[ j ].beneficiary_limit += 6;
							// required to update ng-repeat limitTo?
							$scope.$apply();
							ngmClusterBeneficiaries.updateSelect();
							console.log('beneficiary_limit')
							console.log($scope.project.location_beneficiary_limit[ j ].beneficiary_limit);
						}
						else if ( $scope.project.report.locations.length > $scope.project.location_limit ) {
							$scope.project.location_limit += 1;
							// required to update ng-repeat limitTo?
							$scope.$apply();
							ngmClusterBeneficiaries.updateSelect();
							console.log('location_limit')
							console.log($scope.project.location_limit);
						}
					}
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
				addBeneficiary: function( $parent ) {
					var beneficiary = ngmClusterBeneficiaries.addBeneficiary( $scope.project, $scope.project.report.locations[ $parent ].beneficiaries );
					$scope.project.report.locations[ $parent ].beneficiaries.push( beneficiary );
					// set form display for new rows
					ngmClusterBeneficiaries.setBeneficiariesInputs( $scope.project.lists, $parent, $scope.project.report.locations[ $parent ].beneficiaries.length-1, beneficiary );
					// set scroll counter
					$scope.project.location_beneficiary_limit[ $parent ].beneficiary_count++;
					// update select
					ngmClusterBeneficiaries.updateSelect();
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
					
					// location_type_id
					switch ( target_location.site_type_id ) {

						// refugee_camp
						case 'refugee_camp':

							// site_type_name
							if ( target_location.site_type_name ) {
								title += target_location.site_type_name + ': ';
							}

							// admin1, admin2
							title += target_location.admin1name + ', ' + target_location.admin2name;

							// site_name
							title += ', ' + target_location.site_name;

							break;

						// food_distribution_point
						case 'food_distribution_point':

							// type + title
							title += target_location.site_type_name + ' ' + target_location.site_name + ': ';

							// admin1, admin2
							title += target_location.admin1name + ', ' + target_location.admin2name + ', ' + target_location.admin3name;

							break;              

						// refugee_block
						case 'refugee_block':

							// site_type_name
							if ( target_location.site_type_name ) {
								title += target_location.site_type_name + ': ';
							}

							// admin1, admin2
							title += target_location.admin1name + ', ' + target_location.admin2name;

							// site_name
							title += ', ' + target_location.site_name;

							break;

						// default
						default:
							
							// site_type_name
							if ( target_location.site_type_name ) {
								title += target_location.site_type_name + ': ';
							}

							// admin1, admin2
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

							break;
					}

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
					 $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
					 ngmClusterBeneficiaries.form[ $parent ].splice( $index, 1 );
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
				validateBeneficiariesDetailsForm: function( complete, display_modal ){
					if ( ngmClusterValidation.validateDetails( $scope.project.report.locations ) ){
						if ( complete ) {
							$( '#complete-modal' ).openModal( { dismissible: false } );
						} else if ( display_modal ) {
							$( '#save-modal' ).openModal( { dismissible: false } );
						} else {
							$scope.project.save( false, false );
						}
					}
				},

				// copy previous month - backend
				copyPreviousMonth: function() {

					// set messages
					Materialize.toast( $filter( 'translate' )( 'fetching_data' ), 4000, 'note' );
					$scope.deactivedCopybutton = true;
					$scope.addBeneficiaryDisable = true;

					// set param
					if (config.report.report_month < 1) {
						var params ={
							project_id: $route.current.params.project,
							report_month: 11,
							report_year: config.report.report_year-1
						}
					} else {
						var params = {
							project_id: $route.current.params.project,
							report_month: config.report.report_month - 1,            
							report_year: config.report.report_year
						}
					}

					// setReportRequest
					var get_prev_report = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/getReport',
						data: params
					}

					// get
					ngmData.get( get_prev_report ).then( function ( prev_report ) {

						var brows = 0;
						var trows =0;
						var info = $filter('translate')('save_to_apply_changes');

						// data returned?
						angular.forEach( prev_report.locations, function(l){
							brows += l.beneficiaries.length;
							trows += l.trainings.length;
						});

						// if no data
						if( !brows && !trows ){

							// no data
							if ( Object.keys( prev_report ).length ){
								var msg = $filter( 'translate' )( 'no_data_in_previous_report' );
										typ = 'success';
							} else {
								var msg = $filter( 'translate' )( 'no_previous_report' );
										typ = 'success';
							}

							// deactive false
							$scope.addBeneficiaryDisable = false;
							$scope.deactivedCopybutton = false;
								
							// toast
							Materialize.toast( msg, 4000, typ );
							
						} else {
							
							// init message
							Materialize.toast( $filter( 'translate' )( 'copying' ), 6000, 'note' );
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

							// send message
							Materialize.toast( msg, 4000, typ );

							// set last month
							angular.forEach( $scope.project.report.locations, function( location ){
								
								// get reference_id
								var target_location_reference_id = location.target_location_reference_id
								var previous_location = prev_report.locations.find( function ( l ) {
									return l.target_location_reference_id === target_location_reference_id
								});

								// set
								location.beneficiaries = previous_location.beneficiaries
								location.trainings = previous_location.trainings;

								// forEach beneficiaries
								angular.forEach( location.beneficiaries, function( b ){
									delete b.id;
								});

								// forEach beneficiaries
								angular.forEach( location.trainings, function( t ){
									delete t.id;
									angular.forEach( t.training_participants, function( tp ){
										delete tp.id;
									});
								});

							});

							// reset form UI layout
							$timeout(function() {
								ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
							}, 10 );              

							// final message
							Materialize.toast( info, 8000, 'note' );
							$scope.addBeneficiaryDisable = false;

						}

					}).catch(function (e){

						// error
						Materialize.toast( $filter( 'translate' )( 'error_not_copied' ), 6000, 'error' );
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
						$scope.deactivedCopybutton = true;						
						return $scope.deactivedCopybutton
					} else{
						$scope.deactivedCopybutton = false;
						return $scope.deactivedCopybutton;
					}					

				},

				setTokenUpload: function () {
					ngmClusterDocument.setParam($scope.project.user.token);
				},
				uploadDocument: ngmClusterDocument.uploadDocument({
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
					}),
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
						$scope.listUpload.itemsPerListPage = 6;
					});
				},
				// validate report monthly by who incharge after report submitted
				validateReport:function(status){				
					
					Materialize.toast('Validating ... ', 3000, 'note');
					obj={report_validation:status}
					var setRequest = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/updateReportValidation',
						data: { 
							report_id: $scope.project.report.id, 
							update: obj
						}
					};
					$http(setRequest).success(function (report) {
						if (report.err) {
							// update
							Materialize.toast('Error! something went wrong', 6000, 'error');
						}
						if (!report.err) {
							$timeout(function () {
								Materialize.toast('Submitted Monthly Report is ' + status, 4000, 'success');
								$location.path('/cluster/projects/report/' + $scope.project.definition.id);
							},3000)
						}
						
					})
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
					// set validation to null after click button edit report
					if(!complete){
						if ($scope.project.report.report_validation){
							$scope.project.report.report_validation = null;
						}
					}
					// update project details of report + locations + beneficiaries
					$scope.project.report =
							ngmClusterHelper.getCleanReport( $scope.project.definition, $scope.project.report );

					// msg
					Materialize.toast( $filter('translate')('processing_report') , 6000, 'note');

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

							// sort locations
							$scope.project.report.locations = $filter('orderBy')( $scope.project.report.locations, [ 'site_type_name','admin1name','admin2name','admin3name','admin4name','admin5name','site_name' ]);

							// user msg
							var msg = $filter('translate')('project_report_for')+'  ' + moment.utc( $scope.project.report.reporting_period ).format('MMMM, YYYY') + ' ';
									msg += complete ? $filter('translate')('submitted')+'!' : $filter('translate')('saved_mayus1')+'!';

							// msg
							$timeout(function() { Materialize.toast( msg , 6000, 'success'); }, 400 );

							// set trigger
							$('.modal-trigger').leanModal();

							// Re-direct to summary
							if ( $scope.project.report.report_status !== 'complete' ) {

								// notification modal
								if( display_modal ){
									$timeout(function() {
										if ( $scope.project.location_group ) {
											$location.path( '/cluster/projects/group/' + $scope.project.definition.id + '/' + $scope.project.report.id );
										} else {
											$location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
										}
									}, 400);
								} else {
									// reset select when edit sved report
									ngmClusterBeneficiaries.updateSelect();
								}

							} else {
								$timeout(function() {
									if ( $scope.project.location_group ) {
										$location.path( '/cluster/projects/group/' + $scope.project.definition.id + '/' + $scope.project.report.id );
									} else {
										$location.path( '/cluster/projects/report/' + $scope.project.definition.id );  
									}
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
			// update list  if there are upload file or remove file
			$scope.$on('refresh:listUpload', function () {
				$scope.project.getDocument();
			})
	}

]);
