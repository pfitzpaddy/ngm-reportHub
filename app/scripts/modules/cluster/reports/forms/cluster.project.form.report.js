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
		'ngmClusterValidation',
		'ngmClusterDetails',
		'ngmClusterHelperAf',
		'ngmClusterHelperNgWash',
		'ngmClusterHelperNgWashLists',
		'ngmClusterHelperNgWashValidation',
		'ngmClusterHelperCol',
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
			ngmClusterValidation,
			ngmClusterDetails,
			ngmClusterHelperAf,
			ngmClusterHelperNgWash,
			ngmClusterHelperNgWashLists,
			ngmClusterHelperNgWashValidation,
			ngmClusterHelperCol,
			ngmCbBeneficiaries,
			ngmClusterDocument,
			// NgTableParams,
			config,$translate,$filter ){


			/**** SERVICES ****/

			// these should be a directive - sorry Steve Jobs!
			$scope.scope = $scope;
			$scope.ngmClusterLists = ngmClusterLists;
			$scope.ngmClusterLocations = ngmClusterLocations;
			$scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
			$scope.ngmClusterValidation = ngmClusterValidation;
			$scope.ngmClusterDetails = ngmClusterDetails;
			$scope.ngmClusterHelperNgWash = ngmClusterHelperNgWash;
			$scope.ngmClusterHelperNgWashLists = ngmClusterHelperNgWashLists;
			$scope.ngmClusterHelperNgWashValidation = ngmClusterHelperNgWashValidation;
			$scope.ngmClusterHelperCol = ngmClusterHelperCol;
			$scope.ngmCbBeneficiaries = ngmCbBeneficiaries;
			$scope.ngmClusterDocument = ngmClusterDocument;
			$scope.deactivedCopybutton = false;

			// page scrolled
			$scope._top_scrolled = 0
			// project
			$scope.project = {

				/**** DEFAULTS ****/ 
				user: ngmUser.get(),
				style: config.style,
				definition: config.project,
				report: config.report,
				location_group: config.location_group,
				location_limit: config.report.locations.length,
				canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.project.adminRpcode, admin0pcode:config.project.admin0pcode, cluster_id: config.project.cluster_id, organization_tag:config.project.organization_tag } ),
				updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
				monthlyTitleFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMMM, YYYY'),
				monthNameFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMM'),
				previousMonth: moment.utc([config.report.report_year, config.report.report_month, 1]).subtract(1,'month').format("MMMM, YYYY"),
				nonProjectDates: moment.utc(config.project.project_start_date).startOf('month') > moment.utc(config.report.reporting_period).startOf('month')
													|| moment.utc(config.project.project_end_date).endOf('month') < moment.utc(config.report.reporting_period).startOf('month'),

				// lists ( project, mpc transfers )
				lists: ngmClusterLists.setLists( config.project, 10 ),


				/**** TEMPLATES ****/

				// url
				templatesUrl: '/scripts/modules/cluster/views/forms/report/',
				// templates
				locationsUrl: 'location/locations.html',
				addLocationUrl: 'location/add.location.html',
				beneficiariesDefaultUrl: 'beneficiaries/2016/beneficiaries-health-2016.html',
				template_activity_date: 'beneficiaries/activity-details/activity-date.html',
				template_activity_details: 'beneficiaries/activity-details/activity-details.html',
				notesUrl: 'notes.html',
				uploadUrl: 'report-upload.html',

				// ######### FOR-TRAINING TEST
				// fsac_assessment: 'beneficiaries/AF/assessment_fsac_absnumber_v2.html',
				//percentage
				fsac_assessment: 'beneficiaries/AF/fsac_percentage.html',

				// init lists
				init: function() {
					// usd default currency
					if( !$scope.project.definition.project_budget_currency ){
						$scope.project.definition.project_budget_currency = 'usd';
					}

					// sort locations
					$scope.project.report.locations = $filter('orderBy')( $scope.project.report.locations, [ 'site_type_name','admin1name','admin2name','admin3name','admin4name','admin5name','site_name' ]);
					// set location / beneficiaries limits
					$scope.project.setLocationsLimit( $scope.project.lists, $scope.project.report.locations );
					// set beneficiaries form
					ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );

					
					// documents upload
					$scope.project.setTokenUpload();
					// for minimize-maximize beneficiary form

					$scope.detailBeneficiaries = {};
					$scope.project.beneficiary_search;
					$scope.beneficiary_search_input = false;
					
					// init search
					$scope.searchToogle = function () {
						$('#search_').focus();
						$scope.beneficiary_search_input = $scope.beneficiary_search_input ? false : true;;
					}

					// page limits
					angular.forEach($scope.project.report.locations,function(e,i){
						$scope.detailBeneficiaries[i] = $scope.project.report.locations[i].beneficiaries.length ?
																						new Array($scope.project.report.locations[i].beneficiaries.length).fill(false) : new Array(0).fill(false);
						if ($scope.project.report.locations[i].beneficiaries.length){
							$scope.detailBeneficiaries[i][0] = true;
						}
					})
				},

				// sets title for each location / activity
				getBeneficiaryTitle: function( $locationIndex, $beneficiaryIndex ){
					// beneficiary
					var beneficiary = $scope.project.report.locations[ $locationIndex ].beneficiaries[ $beneficiaryIndex ];
					// title
					var title = beneficiary.activity_type_name;
					// activity_description_id
					if ( beneficiary.activity_description_id ) {
						title += ', ' + beneficiary.activity_description_name;
					}
					// activity_detail_id
					if ( beneficiary.activity_detail_id ) {
						title += ', ' + beneficiary.activity_detail_name;
					}
					return title;
				},

				// set location / beneficiaries limits
				setLocationsLimit: function(){

					// if beneficiaries, set init load limit to help rendering of elements on big forms
					var set_limit = true;
					$scope.project.limitToShowSearch=0
					angular.forEach( $scope.project.report.locations, function( l, i ){
						if( set_limit && l.beneficiaries.length ){
							set_limit = false;
							$scope.project.location_limit = i+1;
							$scope.project.limitToShowSearch = l.beneficiaries.length;
						}
					});

					// if rendered all locations
					if ($scope.project.report.locations.length === $scope.project.location_limit) {
            $scope.project.allRendered = true;
					}

					// onscroll, update incrementLocationLimit
					$window.onscroll = function() {

						// if form is not fully rendered
						if (!$scope.project.allRendered){

							// height, position
							var top = $(window).scrollTop();

							if (top > $scope._top_scrolled) {
								// scroll down
								// save total traversed from top
								$scope._top_scrolled = top;
								var scrollHeight = $(document).height();
								var scrollPosition = $(window).height() + top;

								// 0.50 of scrolling height, add location_limit
								if ( ( scrollHeight - scrollPosition ) / scrollHeight < 0.50 ) {
									// when scroll to bottom of the page
									$scope.project.incrementLocationLimitByOneAutoSelect();
								}
							}
						}

					}
				},

				// incrementLocationLimit by one location if using materializeSelect directive
				incrementLocationLimitByOneAutoSelect: function() {

					// increment
					if ( $scope.project.report.locations.length > $scope.project.location_limit ) {
						$scope.project.location_limit += 1;
						// required to update ng-repeat limitTo?
						$timeout(function(){
							$scope.$apply();
						},0)
					}

					// if all rendered
					if ($scope.project.report.locations.length === $scope.project.location_limit) {
						// and all last location beneficiaries rendered
						$scope.project.allRendered = true;
					}

				},

				// beneficairies template
				beneficiariesUrl: function() {
					var template;
					if ( $scope.project.report.report_year === 2016 ) {
						template = 'beneficiaries/2016/beneficiaries.html';
					// } else if ( $scope.project.report.admin0pcode === 'NG' ) {
					// 	template ='beneficiaries/NG/beneficiaries.html';
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
						// $( '#' + modal ).openModal( { dismissible: false } );
						$('#' + modal).modal({ dismissible: false });
						$('#' + modal).modal('open');
					} else {
						$scope.project.cancel();
					}
				},


				/**** BENEFICIARIES ****/

				// add beneficiary
				addBeneficiary: function( $parent ) {
					var beneficiary = ngmClusterBeneficiaries.addBeneficiary( $scope.project, $scope.project.report.locations[ $parent ].beneficiaries );
					$scope.project.setBeneficiary( $parent, beneficiary );
				},

				// add NG WASH beneficiary
				addNgWashBeneficiary: function( $parent ) {
					var beneficiary = ngmClusterHelperNgWash.addBeneficiary( $scope.project.report.locations[ $parent ].beneficiaries );
					$scope.project.setBeneficiary( $parent, beneficiary );
				},

				setBeneficiary: function( $parent, beneficiary ){
					// set implementing if location has set implementing partner;
					if($scope.project.report.locations[$parent].implementing_partners && $scope.project.report.locations[$parent].implementing_partners.length>0){
						beneficiary.implementing_partners = $scope.project.report.locations[$parent].implementing_partners;
					}
					$scope.project.report.locations[ $parent ].beneficiaries.push( beneficiary );
					// Open card panel detail beneficiaries form
					if(!$scope.detailBeneficiaries[$parent]){
						$scope.detailBeneficiaries[$parent]=[];
					}
					$scope.detailBeneficiaries[$parent][$scope.project.report.locations[$parent].beneficiaries.length-1] = true;
					// set form display for new rows
					ngmClusterBeneficiaries.setBeneficiariesInputs( $scope.project.lists, $parent, $scope.project.report.locations[ $parent ].beneficiaries.length-1, beneficiary );					
				},

				// remove beneficiary nodal
				removeBeneficiaryModal: function( $parent, $index ) {
					// if ( ngmClusterValidation.validateBeneficiaries($scope.project.report.locations, $scope.detailBeneficiaries) ){
						if (!$scope.project.report.locations[$parent].beneficiaries[$index].id) {
							$scope.project.report.locations[$parent].beneficiaries.splice($index, 1);
							$scope.project.activePrevReportButton();
						} else{
							if ( ngmClusterBeneficiaries.beneficiaryFormComplete( $scope.project.definition, $scope.project.report.locations ) ){
									$scope.project.locationIndex = $parent;
									$scope.project.beneficiaryIndex = $index;
								// $( '#beneficiary-modal' ).openModal({ dismissible: false });
								$('#beneficiary-modal').modal({ dismissible: false });
								$('#beneficiary-modal').modal('open');
							}
						}
					// }
				},

				// remove beneficiary
				removeBeneficiary: function() {
					var id = $scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries[ $scope.project.beneficiaryIndex ].id;
					$scope.project.report.locations[ $scope.project.locationIndex ].beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
					// ngmClusterBeneficiaries.updateSelectById('ngm-' + $scope.project.locationIndex);
					$scope.project.activePrevReportButton();
					ngmClusterBeneficiaries.removeBeneficiary( $scope.project, id );
				},


				// remove report modal
				removeReportModal: function() {
					$( '#remove-report-modal' ).openModal({ dismissible: false });
					$( '#remove-report-modal').modal({ dismissible: false });
					$( '#remove-report-modal').modal('open');
				},

				// remove report
				removeReport: function() {
					ngmClusterBeneficiaries.removeReport($scope.project, $scope.project.report.id, function (err) {
						if (!err) {
							$timeout(function () {
									$location.path('/cluster/projects/report/' + $scope.project.definition.id);
							}, 400);
						}
					});
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
				// rowSaveDisabled: function( $data ){
				// 	return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
				// },

				// remove from array if no id
				cancelEdit: function( $parent, $index ) {
					if ( !$scope.project.report.locations[ $parent ].beneficiaries[ $index ].id ) {
					 $scope.project.report.locations[ $parent ].beneficiaries.splice( $index, 1 );
					 ngmClusterBeneficiaries.form[ $parent ].splice( $index, 1 );
					//  ngmClusterBeneficiaries.updateSelectById('ngm-' + $parent);
					}
				},

				// validate form ( ng wash )
				validateWashNgBeneficiariesForm: function( complete, display_modal ){
					if ( ngmClusterHelperNgWashValidation.validateActivities( $scope.project.report.locations ) ){
						if ( complete ) {
							// $( '#complete-modal' ).openModal( { dismissible: false } );
							$('#complete-modal').modal({ dismissible: false });
							$('#complete-modal').modal('open');
						} else if ( display_modal ) {
							// $( '#save-modal' ).openModal( { dismissible: false } );
							$('#save-modal').modal({ dismissible: false });
							$('#save-modal').modal('open');
						} else {
							// arg1: set report status from 'todo' to 'complete' & re-direct
							// arg2: save & re-direct 
							// arg3: alert admin via email of user edit of 'complete' report
							$scope.project.save( false, false, false );
						}
					}
				},

				// validate form ( ng wash )
				validateBeneficiariesDetailsForm: function( complete, display_modal ){
					if (ngmClusterValidation.validateBeneficiaries($scope.project.report.locations, $scope.detailBeneficiaries, $scope.project.definition.admin0pcode, $scope.project.definition.project_hrp_project) ){
						if ( complete ) {
							// $( '#complete-modal' ).openModal( { dismissible: false } );
							$('#complete-modal').modal({ dismissible: false });
							$('#complete-modal').modal('open');
						} else if ( display_modal ) {
							// $( '#save-modal' ).openModal( { dismissible: false } );
							$('#save-modal').modal({ dismissible: false });
							$('#save-modal').modal('open');
						} else {
							// arg1: set report status from 'todo' to 'complete' & re-direct
							// arg2: save & re-direct
							// arg3: alert admin via email of user edit of 'complete' report
							$scope.project.save( false, false, false );
						}
					}
				},

				// copy previous month - backend
				copyPreviousMonth: function() {

					// set messages
					// Materialize.toast( $filter( 'translate' )( 'fetching_data' ), 4000, 'note' );
					M.toast({ html: $filter('translate')('fetching_data'), displayLength: 4000, classes: 'note' });
					$scope.deactivedCopybutton = true;
					$scope.addBeneficiaryDisable = true;

					// set param
					if ( $scope.project.report.report_month < 1) {
						var params = {
							project_id: $route.current.params.project,
							report_month: 11,
							report_year: $scope.project.report.report_year-1
						}
					} else {
						var params = {
							project_id: $route.current.params.project,
							report_month: $scope.project.report.report_month - 1,
							report_year: $scope.project.report.report_year
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
						var info = $filter('translate')('save_to_apply_changes');

						// data returned?
						angular.forEach( prev_report.locations, function(l){
							brows += l.beneficiaries.length;
						});

						// if no data
						if( !brows ){

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
							// Materialize.toast( msg, 4000, typ );
							M.toast({ html: msg, displayLength: 4000, classes: typ });

						} else {

							// init message
							// Materialize.toast( $filter( 'translate' )( 'copying' ), 6000, 'note' );
							M.toast({ html: $filter('translate')('copying'), displayLength: 6000, classes: 'note' });
							if ( brows > 0 ){
								var msg = "Copied Beneficiaries " + brows + ' rows';
										typ = 'success';
							}

							// send message
							// Materialize.toast( msg, 4000, typ );
							M.toast({ html: msg, displayLength: 4000, classes: typ });

							var current_report = angular.copy( $scope.project.report );
							if (current_report.locations) {
								delete current_report.locations;
								delete current_report.cluster_id;
								delete current_report.cluster;
							}
							// set last month
							angular.forEach($scope.project.report.locations, function (location, locationIndex ){

								// get reference_id
								var target_location_reference_id = location.target_location_reference_id
								var previous_location = prev_report.locations.find( function ( l ) {
									return l.target_location_reference_id === target_location_reference_id
								});

								// current location (for report defaults)

								// current month to last month
								// while ($scope.project.location_beneficiary_limit[locationIndex].beneficiary_limit < previous_location.beneficiaries.length) {
								// 	$scope.project.location_beneficiary_limit[locationIndex].beneficiary_limit += 6
								// }
								location.beneficiaries = previous_location.beneficiaries;
								$scope.detailBeneficiaries[locationIndex][0] = true;

								// forEach beneficiaries
								angular.forEach( location.beneficiaries, function( b ){
									angular.merge( b, current_report );
									delete b.id;
									delete b.createdAt;
									delete b.updatedAt;
									delete b.report_submitted;
								});

							});

							// reset form UI layout
							$timeout(function() {
								ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
							}, 10 );

							// final message
							// Materialize.toast( info, 8000, 'note' );
							M.toast({ html: info, displayLength: 8000, classes: 'note' });
							$scope.addBeneficiaryDisable = false;

						}

					}).catch(function (e){

						// error
						// Materialize.toast( $filter( 'translate' )( 'error_not_copied' ), 6000, 'error' );
						M.toast({ html: $filter('translate')('error_not_copied'), displayLength: 6000, classes: 'error' });
						$scope.addBeneficiaryDisable = false;
						$scope.deactivedCopybutton = false;

					})

				},

				// active deactivate copy previoust month
				activePrevReportButton: function(){

					$scope.beneficiariesCount= 0;
					$scope.project.report.locations.forEach(function(l){
						if ( l.beneficiaries && l.beneficiaries.length ) {
							 $scope.beneficiariesCount += l.beneficiaries.length;
						 }
					});

					if ($scope.project.definition.project_status === 'complete' || $scope.project.report.report_status !== 'todo' || (( $scope.beneficiariesCount >0 ) )){
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

					// Materialize.toast('Validating ... ', 3000, 'note');
					M.toast({ html: 'Validating... ', displayLength: 3000, classes: 'note' });
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
							// Materialize.toast('Error! something went wrong', 6000, 'error');
							M.toast({ html: 'Error! something went wrong', displayLength: 6000, classes: 'error' });
						}
						if (!report.err) {
							$timeout(function () {
								// Materialize.toast('Submitted Monthly Report is ' + status, 4000, 'success');
								M.toast({ html: 'Submitted Monthly Report is', displayLength: 4000, classes: 'success' });
								$location.path('/cluster/projects/report/' + $scope.project.definition.id);
							},3000)
						}

					})
				},
				// openClose: true,
				openCloseDetailBeneficiaries: function ($parent, $index) {
					$scope.detailBeneficiaries[$parent][$index] = !$scope.detailBeneficiaries[$parent][$index];
				},
				totalBeneficiary: function (beneficiary) {
					total = 0;
					total += beneficiary.boys +
						beneficiary.men +
						beneficiary.elderly_men + beneficiary.girls +
						beneficiary.women +
						beneficiary.elderly_women;
					return total
				},
				// save
				save: function( complete, display_modal, email_alert ){ 

					// set labels to active (green)
					$( 'label' ).removeClass( 'invalid' ).addClass( 'active' );
					$( 'input' ).removeClass( 'invalid' ).addClass( 'active' );
					// if textarea
					$( 'textarea[name="notes"]' ).removeClass( 'invalid' ).addClass( 'active' );

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
					// Materialize.toast( $filter('translate')('processing_report') , 6000, 'note');
					M.toast({ html: $filter('translate')('processing_report'), displayLength: 6000, classes: 'note' });

					// setReportRequest
					var setReportRequest = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/report/setReport',
						data: { email_alert: email_alert, report: $scope.project.report }
					}

					// set report
					$http( setReportRequest ).success( function( report ){

						if ( report.err ) {
							// update
							// Materialize.toast( 'Error! '+$filter('translate')('please_correct_the_row_and_try_again'), 6000, 'error' );
							M.toast({ html: 'Error! ' + $filter('translate')('please_correct_the_row_and_try_again'), displayLength: 6000, classes: 'error' });
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
							$timeout(function() { 
								// Materialize.toast( msg , 6000, 'success'); 
								M.toast({ html: msg, displayLength: 6000, classes: 'success' });
							}, 400 );

							// set trigger
							// $('.modal-trigger').leanModal();
							$('.modal-trigger').modal();

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
									// reset when edit saved report
									ngmClusterBeneficiaries.setLocationsForm( $scope.project.lists, $scope.project.report.locations );
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
						// Materialize.toast( 'Error!', 6000, 'error' );
						M.toast({ html: 'Error', displayLength: 6000, classes: 'error' });
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
