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
		'ngmClusterImportFile',
		'config',
		'$translate',
		'$rootScope',

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
				ngmClusterImportFile,
				config,
				$translate,
				$rootScope ){
			// set to $scope
			$scope.ngmClusterHelper = ngmClusterHelper;
			$scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
			$scope.ngmClusterLocations = ngmClusterLocations;
			$scope.ngmCbLocations = ngmCbLocations;
			$scope.ngmCbBeneficiaries = ngmCbBeneficiaries;
			$scope.ngmClusterDocument = ngmClusterDocument;
			$scope.ngmClusterImportFile = ngmClusterImportFile;

			// remove location from paginated array
			$rootScope.$on('remove_location', function(evt, id){
				$scope.paginated_target_locations = $scope.paginated_target_locations.reduce((p, c) => (c.id !== id && p.push(c), p), []);
			});

			//ngmClusterHelperCol

			$scope.ngmClusterHelperCol = function(funct, data){

				return ngmClusterHelperCol.run($scope, funct, data);
			};

			// var for import File
			$scope.messageFromfile = {project_detail_message :[],target_beneficiaries_message:[],target_locations_message:[]};
			$scope.inputString = false;

			//Infinite scroll implementation for locations
			const LOCATION_COUNT = 10;
			$scope.count = LOCATION_COUNT;
			$scope.start = 0;
			$scope.end = LOCATION_COUNT;
			$scope.paginated_target_locations= [],
			$scope.isLoading = false;

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
					$scope.project.definition.project_donor_check[item.project_donor_id] = true ;
					if ($scope.project.definition.target_locations.length >0){
						$scope.project.definition.target_locations.forEach(function (el) {
							el.project_donor = item;
						});
					}
			 	},

				searchDonor:function(query){
					return $scope.project.lists.donors.filter(function (el) {
						return el.project_donor_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
				},

			 	afterSelectPartner : function (item){},

			 	searchPartner:function(query){
					return $scope.project.lists.organizations.filter(function (el) {
						return el.organization_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
				},

                //COL classifications

			 	searchundaf_desarrollo_paz:null,
			 	searchacuerdos_de_paz: null,
			 	searchdac_oecd_development_assistance_committee: null,
			 	searchods_objetivos_de_desarrollo_sostenible: null,


				// searchOrgPartner: null,
				// searchImplementingPartner: function (query) {
				// 	if ( !$scope.project.definition.implementing_partners ) {
				// 		$scope.project.definition.implementing_partners = [];
				// 	}
				// 	return $scope.project.lists.organizations.filter(function (el) {
				// 		return (el.organization_name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
				// 			el.organization.toLowerCase().indexOf(query.toLowerCase()) > -1);
				// 	});
				// },

				// addNewImplementingPartner: function( chip ){
				// 	chip.organization_id = chip.id;
				// 	delete chip.id;
				// 	if ( $scope.project.definition.target_locations.length > 0 ){
				// 		$scope.project.definition.target_locations.forEach( function ( el ) {
				// 			if ( !el.implementing_partners) {
				// 				el.implementing_partners = [];
				// 			}
				// 			el.implementing_partners.push( chip );
				// 		});
				// 	}
				// },
				// removeImplementingPartner: function( chip ){
				// 	if ( $scope.project.definition.target_locations.length > 0 ){
				// 		$scope.project.definition.target_locations.forEach( function ( el, index ) {
				// 			if( el.implementing_partners.length ) {
				// 				el.implementing_partners.splice( index, 1 );
				// 			}
				// 			if ( el.implementing_partners.length === 0 ) {
				// 				delete el.implementing_partners;
				// 			}
				// 		});
				// 	}
				// },

				// cluster
				displayIndicatorCluster: {
					'AF': [ 'agriculture', 'cvwg', 'eiewg', 'education', 'esnfi', 'fsac', 'health', 'nutrition', 'protection', 'gbv', 'rnr_chapter', 'wash' ],
					'CB': [ 'wash', 'protection' ]
				},

				// lists ( project, mpc transfers )
				lists: ngmClusterLists.setLists( config.project, config.project.project_start_date, config.project.project_end_date, 30 ),

				// datepicker
				datepicker: {
					onClose: function(){
						// set new start / end date
						$scope.project.definition.project_start_date =
								moment( new Date( $scope.project.definition.project_start_date ) ).format('YYYY-MM-DD');
						$scope.project.definition.project_end_date =
								moment( new Date( $scope.project.definition.project_end_date ) ).format('YYYY-MM-DD');

						// get strategic objectives
						$scope.project.checkStrategicObjectiveYear();

						// update lists
						$timeout(function () {
							var userscopy = $scope.project.lists.users;
							$scope.project.lists = ngmClusterLists.setLists(config.project, $scope.project.definition.project_start_date, $scope.project.definition.project_end_date, 30);
							$scope.project.lists.users = userscopy;
						}, 0)
					}
				},


				/**** TEMPLATES ****/

				// url
				templatesUrl: '/scripts/modules/cluster/views/forms/details/',
				// details
				detailsUrl: 'details.html',
				// strategic objectives
				strategicObjectivesUrl: 'strategic-objectives.html',
				// contact details
				contactDetailsUrl: 'contact-details.html',

				// COL classificaitons
				classificiationsUrl: 'project-classifications/classifications.html',
				//budgetbydonor COL

				projectDonorCOL: '/scripts/widgets/ngm-html/template/COL/projectdonor.html',

				//responseComponents
				responseComponentsCOL: '/scripts/widgets/ngm-html/template/COL/responsecomponents.html',

				// target beneficiaries
				targetBeneficiariesDefaultUrl: 'target-beneficiaries/2016/target-beneficiaries-default.html',
				targetBeneficiariesUrl: moment( config.project.project_end_date ).year() === 2016 ? 'target-beneficiaries/2016/target-beneficiaries.html' : 'target-beneficiaries/target-beneficiaries.html',
				// target locations
				// locationsUrl: config.project.admin0pcode === 'CB' ? 'target-locations/CB/locations.html' : 'target-locations/locations.html',
				locationsUrl: config.project.admin0pcode === 'CB' ? 'target-locations/CB/locations.html' : ( config.project.admin0pcode === 'AF' || config.project.admin0pcode === 'ET' ? 'target-locations/locations-reform.html' : 'target-locations/locations.html'),
				// upload
				uploadUrl:'project-upload.html',

				// for import from file
				text_input: '',
				messageWarning: '',

				// init lists
				init: function() {
					// usd default currency
					if( !$scope.project.definition.project_budget_currency ){
						$scope.project.definition.project_budget_currency = 'usd';
					}
					// set target beneficiaries order to match ui
					$scope.project.definition.target_beneficiaries = $filter('orderBy')( $scope.project.definition.target_beneficiaries, 'createdAt' );
					// set org users
					ngmClusterLists.setOrganizationUsersList( $scope.project.lists, config.project );
					// set form on page load
					ngmClusterHelper.setForm( $scope.project.definition, $scope.project.lists );
					// set beneficiaries form
					ngmClusterBeneficiaries.setBeneficiariesForm( $scope.project.lists, 0, $scope.project.definition.target_beneficiaries );
					// set form inputs
					ngmCbLocations.setLocationsForm( $scope.project, $scope.project.definition.target_locations );
					// Set limited amount of locations
					$scope.paginated_target_locations = $scope.project.definition.target_locations.slice($scope.start, $scope.end);
					// set admin1,2,3,4,5 && site_type && site_implementation
					ngmClusterLocations.setLocationAdminSelect($scope.project, $scope.project.definition.target_locations);
					// documents uploads
					$scope.project.setTokenUpload();
					// implementing partners
					if ($scope.project.definition.implementing_partners.length > 0) {
						if ($scope.project.definition.target_locations.length > 0) {
							$scope.project.definition.target_locations.forEach(function (el) {
								if (!el.implementing_partners) {
									el.implementing_partners = angular.copy($scope.project.definition.implementing_partners);
								}
							})
						}
					}

					// detailBeneficiaries
					$scope.detailBeneficiaries = $scope.project.definition.target_beneficiaries.length ?
																			new Array($scope.project.definition.target_beneficiaries.length).fill(true) : new Array(0).fill(true);
					// if  target beneficiaries more than 30;
					if ($scope.project.definition.target_beneficiaries.length > 30) {
						for (i = 1; i < $scope.detailBeneficiaries.length; i++) {
							$scope.detailBeneficiaries[i] = false;
						}
					};
					// detailLocation
					$scope.detailLocation = $scope.project.definition.target_locations.length ?
																			new Array($scope.project.definition.target_locations.length).fill(true) : new Array(0).fill(true);
					// if  target location more than 30;
					if ($scope.project.definition.target_locations.length > 30) {
						for (i = 1; i < $scope.detailLocation.length; i++) {
							$scope.detailLocation[i] = false;
						}
					}

					$scope.search_input = false;
					$scope.project.filter;
					$scope.searchToogle=function(){
						$('#search_').focus();
						$scope.search_input = $scope.search_input ? false : true;;
					}

					if ( $scope.project.definition.plan_component ) {
						$scope.project.definition.hrp_plan = $scope.project.definition.plan_component.includes('hrp_plan');
						$scope.project.definition.rmrp_plan = $scope.project.definition.plan_component.includes('rmrp_plan');
						$scope.project.definition.interagencial_plan = $scope.project.definition.plan_component.includes('interagencial_plan');

					 $scope.project.definition.humanitarian_component = $scope.project.definition.plan_component.includes('humanitarian_component');
					$scope.project.definition.construccion_de_paz_component = $scope.project.definition.plan_component.includes('construccion_de_paz_component');
					$scope.project.definition.desarrollo_sostenible_component = $scope.project.definition.plan_component.includes('desarrollo_sostenible_component');
					$scope.project.definition.flujos_migratorios_component = $scope.project.definition.plan_component.includes('flujos_migratorios_component');

					}/*else{
						$scope.project.definition.hrp_plan = false;
						$scope.project.definition.rmrp_plan = false;
						$scope.project.definition.interagencial_plan = false;

					 $scope.project.definition.humanitarian_component = false;
					$scope.project.definition.construccion_de_paz_component = false;
					$scope.project.definition.desarrollo_sostenible_component = false;
					$scope.project.definition.flujos_migratorios_component = false;

					}*/
					// init stategic objectic list
					$scope.project.checkStrategicObjectiveYear()

					// AF set disabled to general
					// if ($scope.project.definition.target_beneficiaries.length > 0 && $scope.project.definition.admin0pcode === 'AF'){
					// 	angular.forEach($scope.project.definition.target_beneficiaries,function(e,i){
					// 		if (ngmClusterBeneficiaries.form[0][i]['beneficiary_category_type_id'] && !e.beneficiary_category_id){
					// 			e.beneficiary_category_id = $scope.project.lists.beneficiary_categories[0].beneficiary_category_id;
					// 			e.beneficiary_category_name = $scope.project.lists.beneficiary_categories[0].beneficiary_category_name;
					// 		}
					// 	})
					// }

					// set the project.lists.project_details same as project.definition.project_details
					// if project.definition.project_details exist and project.lists.project_details is empty
					if ($scope.project.definition.project_details && $scope.project.definition.project_details.length
									&& $scope.project.lists.project_details && $scope.project.lists.project_details.length < 1) {
						$scope.project.lists.project_details = angular.copy($scope.project.definition.project_details);
					}


				},
				// Push objects, in chunk of 10s to the location array to make rendering easy
				addMoreItems: function(){
					$scope.start = $scope.end;
					$scope.end += $scope.count;
					var paginated = $scope.project.definition.target_locations.slice($scope.start, $scope.end);
					setTimeout(function(){
						paginated.forEach(function (loc, index) {
							$scope.paginated_target_locations.push(loc);
						});
					},100);
					// Control loading notification
					$scope.isLoading = $scope.end >= $scope.project.definition.target_locations.length - 1 ? false : true;
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
						var path = $scope.project.definition.project_status === 'new' ? '/cluster/projects/list' : '/cluster/projects/summary/' + $scope.project.definition.id;
						var msg = $scope.project.definition.project_status === 'new' ? $filter('translate')('create_project_cancelled') : $filter('translate')('create_project_cancelled');
						// redirect + msg
						$location.path( path );
						$timeout( function() {
							// Materialize.toast( msg, 4000, 'note' );
							M.toast({ html: msg, displayLength: 4000, classes: 'note' });
						}, 400 );
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
						if ($scope.project.definition.target_beneficiaries.length>0 && $scope.project.definition.admin0pcode === 'AF'){
							angular.forEach($scope.project.definition.target_beneficiaries,function(b){
								if (b.hrp_beneficiary_type_id) {
									b.hrp_beneficiary_type_id='';
									b.hrp_beneficiary_type_name='';
								}
							})
						}
					}
				},

				setYesorNoSiteList: function (location, id) {
					if (document.getElementById(id).checked) {
						location.site_list_select_id = 'yes'
					} else {
						location.site_list_select_id = 'no'
					}
					ngmClusterLocations.updateYesorNo($scope.project.lists, location);
				},


				/**** AFGHANISTAN ( ngmClusterHelperAf.js ) ****/

				// update organization if acbar partner
				updateAcbarOrganization: function(){
					ngmClusterHelperAf.updateAcbarOrganization( $scope.project.definition );
				},

				updateProjectDetails:function(id){
					var list_project = $scope.project.lists.project_details;

					if(!$scope.project.definition.project_details){
						$scope.project.definition.project_details =[];
					}
					if(document.getElementById(id).checked){
						selected = $filter('filter')(list_project,{project_detail_id : id},true);
						$scope.project.definition.project_details.push(selected[0]);

						if (id === 'acbar_partner'){
							$scope.project.updateAcbarOrganization();
						}

					}else{
						if ($scope.project.definition.project_details.length>0){
							index = $scope.project.definition.project_details.findIndex(value => value.project_detail_id === id);
							if(index>-1){
								$scope.project.definition.project_details.splice(index,1);
							}
						}else{
							$scope.project.definition.project_details = [];

						}
					}

				},
				checkProjectDetail:function(id){
					if (!$scope.project.definition.project_details){
						return false
					}else{
						// check if project_detail_id in details is exist on the list
						if ($scope.project.definition.project_details.length) {
								var temp_list = $scope.project.lists.project_details;
								var count_missing =0;
								angular.forEach($scope.project.definition.project_details, (e) => {
									missing_index = temp_list.findIndex(value => value.project_detail_id === e.project_detail_id);
									// if project_detail_id is not in the temp list then push missing project_detail_id to temp list
									if (missing_index < 0) {
										temp_list.push(e);
										count_missing += 1;
									}
								});

								if(count_missing>0){
									// set project.lists.project_details same as temp list if some of project_detail_id is missing
									$scope.project.lists.project_details = temp_list;
								}
						};

						index = $scope.project.definition.project_details.findIndex(value => value.project_detail_id === id);
						if(index >-1){
							return true
						}else{
							return false
						}
					}
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

				// strategic objective years check removal if year not in range
				checkStrategicObjectiveYear: function(){
					if ($scope.project.definition.strategic_objectives_check) {
							listId = Object.keys($scope.project.definition.strategic_objectives_check)
							listId.forEach(function (x, i) {
								year = x.split(':')[1] === ""? 2017 :parseInt(x.split(':')[1]);
								if (year < (moment(new Date($scope.project.definition.project_start_date)).year()) ||
									year > moment(new Date($scope.project.definition.project_end_date)).year()) {
									delete $scope.project.definition.strategic_objectives_check[x];
								}
							})
						};
					// set list strategic objective;
					$scope.project.lists.strategic_objectives =
						ngmClusterLists.getStrategicObjectives($scope.project.definition.admin0pcode,
							moment(new Date($scope.project.definition.project_start_date)).year(),
							moment(new Date($scope.project.definition.project_end_date)).year())
					$scope.project.SOyears = Object.keys($scope.project.lists.strategic_objectives);
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

				// add beneficiary
				addBeneficiary: function() {

					// scroll to activity_type when no beneficiaries
					if ( !$scope.project.definition.activity_type || !$scope.project.definition.activity_type.length ) {
						// Materialize.toast( $filter('translate')('no_project_activity_type'), 4000, 'success' );
						M.toast({ html: $filter('translate')('no_project_activity_type'), displayLength: 4000, classes: 'success' });
						$timeout(function() {
							$('#ngm-activity_type_label').animatescroll();
							$timeout(function() { $('#ngm-activity_type').css({'font-weight':600}); }, 1000 );
						}, 600 );
					}
					// set beneficiaries
					var beneficiary = ngmClusterBeneficiaries.addBeneficiary( $scope.project, $scope.project.definition.target_beneficiaries );
					$scope.project.definition.target_beneficiaries.push( beneficiary );
					// open card panel form of new add beneficiaries
					$scope.detailBeneficiaries[$scope.project.definition.target_beneficiaries.length - 1] = true;
					// set form display for new rows
					ngmClusterBeneficiaries.setBeneficiariesInputs( $scope.project.lists, 0, $scope.project.definition.target_beneficiaries.length-1, beneficiary );

				},

				addBeneficiaryFromFile: function (beneficiary, $indexFile) {
					// set implementing if location has set implementing partner;
					var beneficiary_default = ngmClusterBeneficiaries.addBeneficiary($scope.project, $scope.project.definition.target_beneficiaries);

					delete beneficiary_default.cluster_id;
					delete beneficiary_default.cluster;
					delete beneficiary_default.activity_type_id;
					delete beneficiary_default.activity_type_name;
					delete beneficiary_default.activity_description_id;
					delete beneficiary_default.activity_description_name;
					delete beneficiary_default.activity_detail_id;
					delete beneficiary_default.activity_detail_name;
					delete beneficiary_default.indicator_id;
					delete beneficiary_default.indicator_name;
					delete beneficiary_default.beneficiary_type_id;
					delete beneficiary_default.beneficiary_type_name;
					delete beneficiary_default.beneficiary_category_id;
					delete beneficiary_default.beneficiary_category_name;
					delete beneficiary_default.delivery_type_id;
					delete beneficiary_default.delivery_type_name;
					delete beneficiary_default.hrp_beneficiary_type_id;
					delete beneficiary_default.hrp_beneficiary_type_name;
					delete beneficiary_default.site_type_id
					delete beneficiary_default.site_type_name
					delete beneficiary_default.site_implementation_id;
					delete beneficiary_default.site_implementation_name;
					delete beneficiary_default.transfer_type_id;
					delete beneficiary_default.transfer_type_value;
					delete beneficiary_default.package_type_id;
					delete beneficiary_default.package_type_name;
					delete beneficiary_default.unit_type_name;
					delete beneficiary_default.mpc_delivery_type_name;
					delete beneficiary_default.mpc_delivery_type_id;
					delete beneficiary_default.mpc_mechanism_type_id;

					if (beneficiary.transfer_category_name && beneficiary.grant_type_name){
						delete beneficiary_default.transfer_category_id;
						delete beneficiary_default.transfer_category_name;
						delete beneficiary_default.grant_type_id;
						delete beneficiary_default.grant_type_name;
					}
					beneficiary = angular.merge({}, beneficiary_default, beneficiary)

					$scope.project.definition.target_beneficiaries.push(beneficiary);
					// Open card panel detail beneficiaries form
					$scope.detailBeneficiaries[$scope.project.definition.target_beneficiaries.length - 1] = true;
					// set form display for new rows
					ngmClusterBeneficiaries.setBeneficiariesInputs($scope.project.lists, 0, $scope.project.definition.target_beneficiaries.length - 1, beneficiary );


					// unit
					if (beneficiary.unit_type_name && ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['unit_type_id']) {
						selected_unit = $filter('filter')(ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['unit_type_id'], { unit_type_name: beneficiary.unit_type_name }, true);
						if (selected_unit.length) {
							beneficiary.unit_type_id = selected_unit[0].unit_type_id;
						}
					}

					if (beneficiary.mpc_delivery_type_name && ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_delivery_type_id']) {
						selected_mpc_delivery = $filter('filter')(ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_delivery_type_id'], { mpc_delivery_type_name: beneficiary.mpc_delivery_type_name }, true);
						if (selected_mpc_delivery.length) {
							beneficiary.mpc_delivery_type_id = selected_mpc_delivery[0].mpc_delivery_type_id;
						}
					}

					if (beneficiary.mpc_mechanism_type_name && ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_mechanism_type_id']) {
						selected_mpc_mechanism = $filter('filter')(ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_mechanism_type_id'], { mpc_mechanism_type_name: beneficiary.mpc_mechanism_type_name, mpc_delivery_type_id: beneficiary.mpc_delivery_type_id }, true);
						if (selected_mpc_mechanism.length) {
							beneficiary.mpc_mechanism_type_id = selected_mpc_mechanism[0].mpc_mechanism_type_id;
						}
					}
					if (beneficiary.transfer_category_name && ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_transfer_category_id']) {
						selected_transfer_category = $filter('filter')(ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_transfer_category_id'], { transfer_category_name: beneficiary.transfer_category_name }, true);
						if (selected_transfer_category.length) {
							beneficiary.transfer_category_id = selected_transfer_category[0].transfer_category_id;
						}
					}
					if (beneficiary.grant_type_name && ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_grant_type_id']) {
						selected_grant = $filter('filter')(ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]['mpc_grant_type_id'], { grant_type_name: beneficiary.grant_type_name }, true);
						if (selected_grant.length) {
							beneficiary.grant_type_id = selected_grant[0].grant_type_id;
						}
					}

					// validation for input from file
					if (ngmClusterBeneficiaries.form[0][$scope.project.definition.target_beneficiaries.length - 1]) {

						if ($scope.messageFromfile.target_beneficiaries_message[$indexFile]) {
							$scope.messageFromfile.target_beneficiaries_message[$indexFile] = $scope.messageFromfile.target_beneficiaries_message[$indexFile].concat(ngmClusterValidation.validationTargetBeneficiariesFromFile(beneficiary, 0, $scope.project.definition.target_beneficiaries.length - 1, $scope.project.definition.admin0pcode, $scope.project.definition.project_hrp_project));
						} else {
							$scope.messageFromfile.target_beneficiaries_message[$indexFile] = ngmClusterValidation.validationTargetBeneficiariesFromFile(beneficiary, 0, $scope.project.definition.target_beneficiaries.length - 1, $scope.project.definition.admin0pcode, $scope.project.definition.project_hrp_project);
						}


					}

					ngmClusterBeneficiaries.updateBeneficiaires(beneficiary)
				},

				// remove beneficiary from list
				removeTargetBeneficiaryModal: function( $index ) {
					$scope.project.beneficiaryIndex = $index;
					// $( '#beneficiary-modal' ).openModal({ dismissible: false });
					$('#beneficiary-modal').modal({ dismissible: false });
					$('#beneficiary-modal').modal('open');
				},

				// remove beneficiary from db
				removeTargetBeneficiary: function() {
					var id = $scope.project.definition.target_beneficiaries[ $scope.project.beneficiaryIndex ].id;
					$scope.project.definition.target_beneficiaries.splice( $scope.project.beneficiaryIndex, 1 );
					ngmClusterBeneficiaries.form[ 0 ].splice( $scope.project.beneficiaryIndex, 1 );
					ngmClusterBeneficiaries.removeTargetBeneficiary( id );
				},

				// disable save form
				rowSaveDisabled: function( $data ){
					return ngmClusterBeneficiaries.rowSaveDisabled( $scope.project.definition, $data );
				},

				// save beneficiary
				saveBeneficiary: function() {
					if ($scope.project.validate(false)) {
						$scope.project.save(false, $filter('translate')('people_in_need_saved'));
					}
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
						// $( '#location-group-remove-modal' ).openModal({ dismissible: false });
						$( '#location-group-remove-modal').modal({ dismissible: false });
						$( '#location-group-remove-modal').modal('open');
					} else {
						// $( '#location-group-add-modal' ).openModal({ dismissible: false });
						$( '#location-group-add-modal').modal({ dismissible: false });
						$( '#location-group-add-modal').modal('open');
					}
				},

				// set to true
				addLocationGroupings: function() {
					// add to project
					$scope.project.definition.location_groups_check = true;
					// add to target_locations
					angular.forEach( $scope.project.definition.target_locations, function( l, i ){
						// location group
						l.location_group_id = l.admin2pcode;
						l.location_group_type = l.admin2type_name;
						l.location_group_name = l.admin2name;
					});
					// save if project id exists
					if( $scope.project.definition.id ){
						$scope.project.save( false, $filter('translate')('project_updated') );
					}
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
					// save if project id exists
					if( $scope.project.definition.id ){
						$scope.project.save( false, $filter('translate')('project_updated') );
					}
				},


				/**** TARGET LOCATIONS ( ngmClusterLocations.js ) ****/

				// add location
				addLocation: function() {
					$scope.inserted = ngmClusterLocations.addLocation( $scope.project.definition, $scope.project.definition.target_locations );
					$scope.project.definition.target_locations.push( $scope.inserted );

					// add location to paginated array
					$scope.paginated_target_locations.push($scope.inserted);
					// open card panel form of new add beneficiaries
					$scope.detailLocation[$scope.project.definition.target_locations.length - 1] = true;
					// autoset location groupings
					if (  $scope.project.showLocationGroupingsOption() && $scope.project.definition.target_locations.length > 30  ) {
						$scope.project.addLocationGroupings();
					}
					// CB, run form
					if ( $scope.project.definition.admin0pcode === 'CB' ) {
						ngmCbLocations.setLocationsForm( $scope.project, $scope.project.definition.target_locations );
					}

					if ($scope.project.definition.admin0pcode !== 'CB') {
						var newLocationIndex = $scope.project.definition.target_locations.length - 1;
						// set admin1,2,3 etc for new location added
						ngmClusterLocations.filterLocations($scope.project, newLocationIndex, $scope.project.definition.target_locations[newLocationIndex])
					}
				},

				// add location
				addLocationByIndex: function( $index ) {

					// keep site_type
					$scope.project.definition.target_locations[ $index ] = {
            site_type_id: $scope.project.definition.target_locations[ $index ].site_type_id,
            site_type_name: $scope.project.definition.target_locations[ $index ].site_type_name
					}

					// re-set location
					$scope.inserted = ngmClusterLocations.addLocation( $scope.project.definition, $scope.project.definition.target_locations );
					$scope.project.definition.target_locations[ $index ] = $scope.inserted;

					// open card panel form of new add beneficiaries
					$scope.detailLocation[ $index ] = true;

					// autoset location groupings
					if (  $scope.project.showLocationGroupingsOption() && $scope.project.definition.target_locations.length > 30  ) {
						$scope.project.addLocationGroupings();
					}

					// CB, run form
					ngmCbLocations.setLocationsForm( $scope.project, $scope.project.definition.target_locations );

				},

				addLocationFormFile: function (location,index) {
					$scope.inserted = ngmClusterLocations.addLocation($scope.project.definition, []);
					location = angular.merge({},$scope.inserted,location);
					$scope.project.definition.target_locations.push(location);
					// open card panel form of new add beneficiaries
					$scope.detailLocation[$scope.project.definition.target_locations.length - 1] = true;
					// autoset location groupings
					if ($scope.project.showLocationGroupingsOption() && $scope.project.definition.target_locations.length > 30) {
						$scope.project.addLocationGroupings();
					}
					// CB, run form
					if ($scope.project.definition.admin0pcode === 'CB') {
						ngmCbLocations.setLocationsForm($scope.project, $scope.project.definition.target_locations);
					}

					if ($scope.project.definition.admin0pcode !== 'CB') {
						var newLocationIndex = $scope.project.definition.target_locations.length - 1;

						// set admin1,2,3 etc for new location added
						ngmClusterLocations.filterLocations($scope.project, newLocationIndex, $scope.project.definition.target_locations[newLocationIndex]);

						if ($scope.project.definition.target_locations[newLocationIndex].admin5pcode) {
							selected_loc = $filter('filter')(ngmClusterLocations.admin5Select[newLocationIndex], { admin5name: $scope.project.definition.target_locations[newLocationIndex].admin5name, admin5pcode: $scope.project.definition.target_locations[newLocationIndex].admin5pcode })
						} else if ($scope.project.definition.target_locations[newLocationIndex].admin4pcode) {
							selected_loc = $filter('filter')(ngmClusterLocations.admin4Select[newLocationIndex], { admin4name: $scope.project.definition.target_locations[newLocationIndex].admin4name, admin4pcode: $scope.project.definition.target_locations[newLocationIndex].admin4pcode })
						} else if ($scope.project.definition.target_locations[newLocationIndex].admin3pcode) {
							selected_loc = $filter('filter')(ngmClusterLocations.admin3Select[newLocationIndex], { admin3name: $scope.project.definition.target_locations[newLocationIndex].admin3name, admin3pcode: $scope.project.definition.target_locations[newLocationIndex].admin3pcode })
						} else {
							selected_loc = $filter('filter')(ngmClusterLocations.admin2Select[newLocationIndex], { admin2name: $scope.project.definition.target_locations[newLocationIndex].admin2name, admin2pcode: $scope.project.definition.target_locations[newLocationIndex].admin2pcode })
						}
						if (selected_loc.length) {
							delete selected_loc[0].id ;
							$scope.project.definition.target_locations[newLocationIndex] = angular.merge($scope.project.definition.target_locations[newLocationIndex], selected_loc[0]);
						}



					}
					if ($scope.messageFromfile.target_locations_message[index]) {
						$scope.messageFromfile.target_locations_message[index] = $scope.messageFromfile.target_locations_message[$index].concat(ngmClusterValidation.validationTargetLocationFromFile($scope.project.definition.target_locations[newLocationIndex], $scope.project.definition.target_locations.length - 1, $scope.detailLocation));
					} else {
						$scope.messageFromfile.target_locations_message[index] = ngmClusterValidation.validationTargetLocationFromFile($scope.project.definition.target_locations[newLocationIndex], $scope.project.definition.target_locations.length - 1, $scope.detailLocation);
					}
					// chek if username on the list or not
					if ($scope.project.definition.target_locations[newLocationIndex].username) {
						loc = $scope.project.definition.target_locations[newLocationIndex];
						var selected_user=[]
						if ($scope.project.lists.users.length) {
							selected_user = $filter('filter')($scope.project.lists.users, { username: loc.username }, true);}

						if (!selected_user.length) {
							id = "label[for='" + 'ngm-username-' + newLocationIndex + "']";
							obj = { label: id, property: 'username', reason: 'Reporter not In the List' }
							// clear username if not in the list
							$scope.project.definition.target_locations[newLocationIndex].username = '';
							$scope.messageFromfile.target_locations_message[index].push(obj);
						}
					}
				},

				checkLocationFormFile:function(location){
					var match = true;
					var obj={valid:true,reason :''}
					if (location.admin5pcode) {

						selected_admin5 = $filter('filter')($scope.project.lists.admin5, { admin5pcode: location.admin5pcode }, true)
						if (selected_admin5.length) {
							if (selected_admin5[0].admin1pcode !== location.admin1pcode ||
								selected_admin5[0].admin2pcode !== location.admin2pcode ||
								selected_admin5[0].admin3pcode !== location.admin3pcode ||
								selected_admin5[0].admin4pcode !== location.admin4pcode) {
								obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
									+ 'admin2pcode: ' + location.admin2pcode + ', '
									+ 'admin3pcode: ' + location.admin3pcode + ', '
									+ 'admin4pcode: ' + location.admin4pcode + ', '
									+ 'admin5pcode: ' + location.admin4pcode
									+ ' not matched)';
								match = false;
							}

						} else {
							match = false;
							obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
								+ 'admin2pcode: ' + location.admin2pcode + ', '
								+ 'admin3pcode: ' + location.admin3pcode + ', '
								+ 'admin4pcode: ' + location.admin4pcode + ', '
								+ 'admin5pcode: ' + location.admin4pcode
								+ ' not matched)';
						}
					} else if (location.admin4pcode){
						selected_admin4 = $filter('filter')($scope.project.lists.admin4, { admin4pcode: location.admin4pcode }, true)
						if (selected_admin4.length) {
							if (selected_admin4[0].admin1pcode !== location.admin1pcode ||
								selected_admin4[0].admin2pcode !== location.admin2pcode ||
								selected_admin4[0].admin3pcode !== location.admin3pcode) {
								obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
												  + 'admin2pcode: ' + location.admin2pcode + ', '
												  + 'admin3pcode: ' + location.admin3pcode + ', '
												  + 'admin4pcode: ' + location.admin4pcode
												  + ' not matched)';
								match = false;
							}

						} else {
							obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
								+ 'admin2pcode: ' + location.admin2pcode + ', '
								+ 'admin3pcode: ' + location.admin3pcode + ', '
								+ 'admin4pcode: ' + location.admin4pcode
								+ ' not matched)';
							match = false;
						}

					} else if (location.admin3pcode){
						selected_admin3 = $filter('filter')($scope.project.lists.admin3, { admin3pcode: location.admin3pcode }, true)
						if (selected_admin3.length) {
							if (selected_admin3[0].admin1pcode !== location.admin1pcode || selected_admin3[0].admin2pcode !== location.admin2pcode) {
								obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
												  + 'admin2pcode: ' + location.admin2pcode + ', '
												  + 'admin3pcode: ' + location.admin3pcode
												  +  ' not matched)';
								match = false;
							}

						} else {
							obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', '
								+ 'admin2pcode: ' + location.admin2pcode + ', '
								+ 'admin3pcode: ' + location.admin3pcode
								+ ' not matched)';
							match = false;
						}

					}else if( location.admin2pcode){
						selected_admin2 = $filter('filter')($scope.project.lists.admin2, { admin2pcode: location.admin2pcode},true)

						if (selected_admin2.length){
							if (selected_admin2[0].admin1pcode !== location.admin1pcode) {
								obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', ' + 'admin2pcode: ' + location.admin2pcode + ' not matched)';
								match = false;
							}

						}else{
							obj.reason = '(' + 'admin1pcode: ' + location.admin1pcode + ', ' + 'admin2pcode: ' + location.admin2pcode + ' not matched)';
							match = false;
						}

					}
					obj.valid = match
					return obj;
				},

				// save location
				saveLocation: function() {
					if($scope.project.validate(false)){
						$scope.project.save(false, $filter('translate')('project_location_saved'));
					}
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
				cancelEdit: function( key, $index, locationform ) {
					if ( !$scope.project.definition[ key ][ $index ].id ) {
						$scope.project.definition[ key ].splice( $index, 1 );
						ngmClusterBeneficiaries.form[ 0 ].splice( $index, 1 );

						// Cancel edit for paginated array
						$scope.paginated_target_locations.splice($index, 1);
						if ( key === 'target_beneficiaries' ) {
							$timeout(function(){
								// Materialize.toast( $filter('translate')('target_beneficiary_removed'), 4000, 'success' );
								M.toast({ html: $filter('translate')('target_beneficiary_removed'), displayLength: 4000, classes: 'success' });
							}, 400 );
						}
						if (  key === 'target_locations'  ) {
							$timeout(function(){
								// Materialize.toast( $filter('translate')('project_location_removed'), 4000, 'success' );
								M.toast({ html: $filter('translate')('project_location_removed'), displayLength: 4000, classes: 'success' });
							}, 400 );
						}
					} else {
						locationform.$cancel();
					}
				},



				/**** CLUSTER HELPER ( ngmClusterHelper.js ) ****/

				// compile cluster activities
				compileInterClusterActivities: function(){
					ngmClusterHelper.compileInterClusterActivities( $scope.project.definition, $scope.project.lists );
					// when new inter cluster added set new list of site_type && site_implementation
					ngmClusterLocations.setSiteTypeAndImplementationSelect($scope.project);
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
				validate: function(display_modal){
					return ngmClusterValidation.validate($scope.project.definition, $scope.detailBeneficiaries, $scope.detailLocation,display_modal);
				},

				/**** UPLOAD ****/
				setTokenUpload: function(){
					ngmClusterDocument.setParam( $scope.project.user.token );
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

				// open-close beneficiary target detail
				openCloseDetailBeneficiaries:function(index){
					$scope.detailBeneficiaries[index] = !$scope.detailBeneficiaries[index];
				},

				// open-close location target detail
				openCloseDetailLocation:function(index){
					$scope.detailLocation[index] = !$scope.detailLocation[index];
				},

				setProjectStatus: function ( status ) {

					// set project status
					$scope.project.definition.project_status = status;

					// msg
					var msg = 'Project Status is set to ';

					// actions
					switch( status ) {
						case 'not_implemented':
							msg += 'Not Implemented';
							break;
						case 'plan':
							msg +='Planned';
							// $scope.project.definition.project_start_date = moment(new Date()).format('YYYY-MM-DD');
							break;
						case 'complete':
							msg += 'Completed';
							break;
						default:
							msg += 'Active';
					}

					// toast
					// Materialize.toast( msg, 4000, 'success' );
					M.toast({ html: msg, displayLength: 4000, classes: 'success' });

					// save project
					$scope.project.save( false, $filter('translate')('people_in_need_saved') );

				},

				programmePartnersOrgStatus: function(){
					if (!$scope.project.definition.programme_partners_checked){
						// if supportive_org_checked false then remove all supportive organization
						$scope.project.definition.programme_partners =[];
					}
				},
				implementingPartnerStatus:function(){
					if(!$scope.project.definition.implementing_partners_checked){
						// remove org list if implemnting partner unchecked
						$scope.project.definition.implementing_partners = [];
					}
				},
				programmePartners:function(array){
					angular.forEach(array,function(partner){
						partner.adminRpcode = $scope.project.definition.adminRpcode;
						partner.adminRname = $scope.project.definition.adminRname,
						partner.admin0pcode=$scope.project.definition.admin0pcode;
						partner.admin0name=$scope.project.definition.admin0name;

					})
				},

				// Input From file
				uploadFileReport: {
					openModal: function (modal,import_button) {
						// $('#' + modal).openModal({ dismissible: false });
						$('#' + modal).modal({ dismissible: false });
						$('#' + modal).modal('open');
						if(import_button === 'location'){
							$scope.import_file_type = 'location';
							$('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/>  Please upload file with extention .csv or xlsx!  <br/> Use template and lists as per downloads <br/> For Target Location');
						}else if(import_button === 'beneficiary'){
							$scope.import_file_type = 'beneficiary';
							$('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please upload file with extention .csv or xlsx! <br/> Use template and lists as per downloads <br/> For Target Beneficiaries');
						}else{
							$scope.import_file_type = 'all';
							$('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.dictDefaultMessage)
						}
					},
					closeModal: function (modal) {
						drop_zone.removeAllFiles(true);
						M.toast({ html: $filter('translate')('cancel_to_upload_file'), displayLength: 2000, classes: 'note' });
					},
					uploadFileConfig: {
						previewTemplate: ngmClusterImportFile.templatePreview(),
						completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">' + $filter('translate')('complete') + '</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
						acceptedFiles: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
						maxFiles: 1,
						parallelUploads: 1,
						url: ngmAuth.LOCATION + '/api/uploadGDrive',
						accept: function (file, done) {
							var ext = file.name.split('.').pop();
							if ( $scope.import_file_type === 'all'
								&& ext === 'csv'
							) {
								this.removeFile(file);
								if (this.getQueuedFiles().length > 0) {
									document.querySelector(".dz-default.dz-message").style.display = 'block';
									$timeout(function () {
										document.querySelector(".dz-default.dz-message").style.display = 'none';
									}, 2000)
								}
								$('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.notSupportedFile + '<br/> Import Project, Accept only file with extention .xlsx');
								M.toast({ html: 'Import Project, Accept only file with extention .xlsx', displayLength: 4000, classes: 'error' });
								$timeout(function () {
									$('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.dictDefaultMessage);
									M.toast({ html: 'Please try upload your file again with extention .xlsx', displayLength: 4000, classes: 'note' });
								}, 3000)
							} else {
								done();
							}
						},
						dictDefaultMessage:
							`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please do not forget to put required sheets! <br/>with extention xlsx as per template in project downloads',
						notSupportedFile: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('not_supported_file_type') + ' ',
						errorMessage: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Error`,
						addRemoveLinks: false,
						autoProcessQueue: false,
						init: function () {
							drop_zone = this;
							// upload_file and delete_file is ID for button upload and cancel
							$("#upload_file").attr("disabled", true);
							$("#delete_file").attr("disabled", true);

							document.getElementById('upload_file').addEventListener("click", function () {
								$("#upload_file").attr("disabled", true);
								$("#delete_file").attr("disabled", true);
								$("#switch_btn_file").attr("disabled", true);
								var ext = drop_zone.getAcceptedFiles()[0].name.split('.').pop();



								if (ext === 'csv') {
									var file = drop_zone.getAcceptedFiles()[0],
										read = new FileReader();

									read.readAsBinaryString(file);

									read.onloadend = function () {
										var csv_string = read.result
										csv_array = Papa.parse(csv_string).data;

										if ($scope.import_file_type === 'location') {
											header_must_exist = 'Admin1 Pcode';
											header = ngmClusterImportFile.listheaderAttributeInFile('target_location')
										}
										if ($scope.import_file_type === 'beneficiary') {
											header_must_exist = 'Activity Type';
											header = ngmClusterImportFile.listheaderAttributeInFile('target_beneficiary')
										}


										var values = [];
										values_obj = [];
										var target_locations = [];
										target_beneficiaries = [];
										count_error_target_locations = 0;
										count_error_target_beneficiaries = 0
										// get value and change to object
										values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
										// map the header to the attribute name
										for (var index = 0; index < values_obj.length; index++) {
											obj_true = {};
											angular.forEach(values_obj[index], function (value, key) {

												atribute_name = header[key];
												obj_true[atribute_name] = value;

											})
											values.push(obj_true);
										}

										if (values.length) {
											if ($scope.import_file_type === 'location') {
												angular.forEach(values, function (t_l) {
													target_locations.push($scope.project.addMissingTargetlocationsFormFile(t_l))
												});

												for (var i = 0; i < target_locations.length; i++) {
													var match = $scope.project.checkLocationFormFile(target_locations[i])

													if ((!target_locations[i].admin1name) || (!target_locations[i].admin1pcode) ||
														(!target_locations[i].admin2name) || (!target_locations[i].admin2pcode) ||
														!match.valid) {
														if (!$scope.messageFromfile.target_locations_message[i]) { $scope.messageFromfile.target_locations_message[i] = [] }
														if (!target_locations[i].admin1pcode) {
															obj = { label: false, property: 'admin1pcode', reason: 'missing value' }
															$scope.messageFromfile.target_locations_message[i].push(obj);
														}
														if (!target_locations[i].admin1name) {
															obj = { label: false, property: 'admin1name', reason: 'missing value' }
															$scope.messageFromfile.target_locations_message[i].push(obj);
														}
														if (!target_locations[i].admin2pcode) {
															obj = { label: false, property: 'admin2pcode', reason: 'missing value' }
															$scope.messageFromfile.target_locations_message[i].push(obj);
														}
														if (!target_locations[i].admin2name) {
															obj = { label: false, property: 'admin2name', reason: 'missing value' }
															$scope.messageFromfile.target_locations_message[i].push(obj);
														}

														if(!match.valid){
															obj = { label: false, property: 'location_incorrect', reason: 'Location Not Match ' + match.reason }
															$scope.messageFromfile.target_locations_message[i].push(obj);
														}

														count_error_target_locations += 1

													} else {
														$scope.project.addLocationFormFile(target_locations[i], i)
													}
												}
											}
											if ($scope.import_file_type === 'beneficiary') {
												angular.forEach(values, function (t_l) {
													target_beneficiaries.push($scope.project.addMissingTargetbeneficiaryFromFile(t_l))
												})

												for (var b = 0; b < target_beneficiaries.length; b++) {

													if ((!target_beneficiaries[b].cluster_id) || (!target_beneficiaries[b].activity_type_id) || (!target_beneficiaries[b].activity_description_id)) {
														if (!$scope.messageFromfile.target_beneficiaries_message[b]) { $scope.messageFromfile.target_beneficiaries_message[b] = [] }
														if (!target_beneficiaries[b].cluster_id) {
															obj = { label: false, property: 'cluster_id', reason: 'Missing value' }
															$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
														}
														if (!target_beneficiaries[b].activity_type_id) {
															var obj = { label: false, property: 'activity_type_id', reason: 'missing value' };
															if (target_beneficiaries[b].activity_type_name) {
																obj.reason = 'not in the list'
															}
															$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
														}
														if (!target_beneficiaries[b].activity_description_id) {
															var obj = { label: false, property: 'activity_description_id', reason: 'missing value' };
															if (target_beneficiaries[b].activity_description_name) {
																obj.reason = 'not in the list'
															}
															$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
														}
														count_error_target_beneficiaries += 1
													} else {
														$scope.project.addBeneficiaryFromFile(target_beneficiaries[b], b)
													}
												}
											}


										}

										var previews = document.querySelectorAll(".dz-preview");
										previews.forEach(function (preview) {
											preview.style.display = 'none';
										})
										document.querySelector(".dz-default.dz-message").style.display = 'none';
										document.querySelector(".percent-upload").style.display = 'block';

										$timeout(function () {
											document.querySelector(".percent-upload").style.display = 'none';
											$('#upload-monthly-file-project').modal('close');
											drop_zone.removeAllFiles(true);

											$scope.project.setMessageForImportFile($scope.messageFromfile, ngmClusterValidation.fieldProject())


											if ((count_error_target_beneficiaries > 0) || (count_error_target_locations > 0)) {
												if (count_error_target_beneficiaries > 0) {
													if (count_error_target_beneficiaries === target_beneficiaries.length) {
														M.toast({ html: 'Target Beneficiaries Import failed!', displayLength: 4000, classes: 'error' });
													} else {
														M.toast({ html: 'Some Target Beneficiaries Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
													}
												}

												if (count_error_target_locations > 0) {
													if (count_error_target_locations === target_locations.length) {
														M.toast({ html: 'Target Location Import failed!', displayLength: 4000, classes: 'error' });
													} else {
														M.toast({ html: 'Some Target Locations Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
													}
												}
											}
											if ((count_error_target_beneficiaries < 1) || (count_error_target_locations < 1)) {
												if (count_error_target_beneficiaries < 1 && ($scope.import_file_type === 'beneficiary')) {
													if (target_beneficiaries.length) {
														M.toast({ html: 'Import Target Beneficiaries Success!', displayLength: 4000, classes: 'success' });
													}
												}
												if (count_error_target_locations < 1 && ($scope.import_file_type === 'location')) {
													if (target_locations.length) {
														M.toast({ html: 'Import Target Location Success!', displayLength: 4000, classes: 'success' });
													}
												}
											}
											// reset error message
											$scope.messageFromfile = { project_detail_message: [], target_beneficiaries_message: [], target_locations_message: [] };
											$("#upload_file").attr("disabled", true);
											$("#delete_file").attr("disabled", true);
											$("#switch_btn_file").attr("disabled", false);

										}, 2000)
									}
								} else {
									file = drop_zone.getAcceptedFiles()[0]
									const wb = new ExcelJS.Workbook();
									drop_zone.getAcceptedFiles()[0].arrayBuffer().then((data) => {
										var result = []
										var project_detail = [];
										var activity_types = [];
										var target_beneficiaries = []
										var target_locations = [];
										var count_error_project_detail = 0;
											count_error_target_locations = 0;
											count_error_target_beneficiaries = 0;
										if($scope.import_file_type === 'all'){
											wb.xlsx.load(data).then(workbook => {
												const book = [];
												const book_obj = [];
												// var project_detail = [];
												// var activity_types = [];
												// var target_beneficiaries = []
												// var target_locations = [];
												check_sheet = { 'Project Details': false, 'Activity Types': false, 'Target Beneficiaries': false, 'Target Locations': false };
												var sheet_missing = 0;
												var sheet_missing_msg = ''
												workbook.eachSheet((sheet, index) => {
													const sh = [];
													sheet.eachRow(row => {
														sh.push(row.values);
													});
													if (sheet.name === 'Project Details') {
														book[0] = sh;
														check_sheet['Project Details'] = true;
													};
													if (sheet.name === 'Activity Types') {
														book[1] = sh;
														check_sheet['Activity Types'] = true;
													};
													if (sheet.name === 'Target Beneficiaries') {
														book[2] = sh;
														check_sheet['Target Beneficiaries'] = true;
													};
													if (sheet.name === 'Target Locations') {
														book[3] = sh
														check_sheet['Target Locations'] = true;
													};
													// book.push(sh);
												});
												// check if all sheet all in there;
												for (c in check_sheet) {
													if (!check_sheet[c]) {
														sheet_missing += 1
														sheet_missing_msg += 'Sheet ' + c + ' Not Found \n'
													}
												}
												if (sheet_missing > 0) {
													if (sheet_missing_msg !== '') {
														sheet_missing_msg = 'Missing Sheet \n' + sheet_missing_msg + '\n' + 'Please do not forget to put required sheets!\n with extention xlsx as per template in project downloads \n( Project Details, Activity Types, Target Beneficiaries,Target Locations )';
														$scope.project.messageWarning = sheet_missing_msg;
													}
													var previews = document.querySelectorAll(".dz-preview");
													previews.forEach(function (preview) {
														preview.style.display = 'none';
													})
													document.querySelector(".dz-default.dz-message").style.display = 'none';
													document.querySelector(".percent-upload").style.display = 'block';
													$timeout(function () {
														document.querySelector(".percent-upload").style.display = 'none';
														$('#upload-monthly-file-project').modal('close');
														drop_zone.removeAllFiles(true);

														$('#message-file-project').modal({ dismissible: false });
														$('#message-file-project').modal('open');
													}, 2000)

													return;
												}


												for (var x = 0; x < book.length; x++) {

													header = {};
													if (x === 0) {
														header = ngmClusterImportFile.listheaderAttributeInFile('detail');//$scope.project.uploadFileReport.obj_header_detail_new;
													}
													if (x === 1) {
														header = ngmClusterImportFile.listheaderAttributeInFile('activity_type');//$scope.project.uploadFileReport.obj_header_activity_type;
													}
													if (x === 2) {
														header = ngmClusterImportFile.listheaderAttributeInFile('target_beneficiary');//$scope.project.uploadFileReport.obj_header_beneficiary;
													}
													if (x === 3) {
														header = ngmClusterImportFile.listheaderAttributeInFile('target_location');//$scope.project.uploadFileReport.obj_header_location;
													}
													// book[x] = transform_to_obj(book[x],header);
													book[x] = ngmClusterImportFile.transform_to_obj(book[x], header);

												}


												// ######## Separete into Project Detail, Target beneficiaries and Target Location
												// project detail
												project_detail = book[0];
												project_detail[0]['activity_type'] = book[1];
												project_detail[0] = $scope.project.addMissingAttributeProjectDetailFromFile(project_detail[0]);
												project_detail[0] = angular.merge({}, $scope.project.definition, project_detail[0]);
												// var count_error_project_detail = 0;

												if ($scope.messageFromfile.project_detail_message && !$scope.messageFromfile.project_detail_message[0]) { $scope.messageFromfile.project_detail_message[0] = [] }

												$scope.messageFromfile.project_detail_message[0] = ngmClusterValidation.validatiOnprojectDetailsFromFile(project_detail[0]);
												if (project_detail[0].name) {
												var selected_focal = []
												if ($scope.project.lists.users.length) {
													selected_focal = $filter('filter')($scope.project.lists.users, { name: project_detail[0].name }, true);
												}

													if (!selected_focal.length) {
														var id = "ngm-target_contact";
														var obj_focal = { label: id, property: 'name', reason: 'Focal Point not In the List', file: 'Project Details' }

														$scope.messageFromfile.project_detail_message[0].push(obj_focal);
														$('#ngm-target_contact').css({ 'color': '#EE6E73' });
													}
												}
												if ((typeof project_detail[0].activity_type_check !== 'undefined') && (project_detail[0].activity_type.length > 0) && (project_detail[0].project_donor_check) && (project_detail[0].project_donor.length > 0)) {
													delete project_detail[0].id;
													delete project_detail[0].url;
													$scope.project.definition = project_detail[0];
												} else {
													count_error_project_detail += 1;
												}
												// target beneficiaries
												if (book[2].length) {
													angular.forEach(book[2], function (t_b) {
														target_beneficiaries.push($scope.project.addMissingTargetbeneficiaryFromFile(t_b));
													})
													for (var b = 0; b < target_beneficiaries.length; b++) {
														if ((!target_beneficiaries[b].cluster_id) || (!target_beneficiaries[b].activity_type_id) || (!target_beneficiaries[b].activity_description_id)) {
															if (!$scope.messageFromfile.target_beneficiaries_message[b]) { $scope.messageFromfile.target_beneficiaries_message[b] = [] }
															if (!target_beneficiaries[b].cluster_id) {
																obj = { label: false, property: 'cluster_id', reason: 'Missing value' }
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															if (!target_beneficiaries[b].activity_type_id) {
																var obj = { label: false, property: 'activity_type_id', reason: 'missing value' };
																if (target_beneficiaries[b].activity_type_name) {
																	obj.reason = 'not in the list'
																}
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															if (!target_beneficiaries[b].activity_description_id) {
																var obj = { label: false, property: 'activity_description_id', reason: 'missing value' };
																if (target_beneficiaries[b].activity_description_name) {
																	obj.reason = 'not in the list'
																}
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															count_error_target_beneficiaries += 1
														} else {
															$scope.project.addBeneficiaryFromFile(target_beneficiaries[b], b)
														}
													}

												};
												// target_locations
												if (book[3].length) {
													angular.forEach(book[3], function (t_l) {
														target_locations.push($scope.project.addMissingTargetlocationsFormFile(t_l))
													})

													for (var i = 0; i < target_locations.length; i++) {
														var match = $scope.project.checkLocationFormFile(target_locations[i])
														if ((!target_locations[i].admin1name) || (!target_locations[i].admin1pcode) ||
															(!target_locations[i].admin2name) || (!target_locations[i].admin2pcode) ||
															!match.valid) {
															if (!$scope.messageFromfile.target_locations_message[i]) { $scope.messageFromfile.target_locations_message[i] = [] }
															if (!target_locations[i].admin1pcode) {
																obj = { label: false, property: 'admin1pcode', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin1name) {
																obj = { label: false, property: 'admin1name', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin2pcode) {
																obj = { label: false, property: 'admin2pcode', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin2name) {
																obj = { label: false, property: 'admin2name', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}

															if (!match.valid) {
																obj = { label: false, property: 'location_incorrect', reason: 'Location Not Match ' + match.reason }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}

															count_error_target_locations += 1

														} else {
															$scope.project.addLocationFormFile(target_locations[i], i)
														}
													}
												}

											})
										} else if ($scope.import_file_type === 'location'){
											var location=[];
											wb.xlsx.load(data).then(workbook => {
												var temp_location = [];
												workbook.eachSheet((sheet, index) => {
													// get only the first sheet
													// if (index === 1) {
														const sh = [];
														sheet.eachRow(row => {
															sh.push(row.values);
														});
														if (index === 1) {
															temp_location.push(sh);
														}
														// if user input excel file that contain sheet name Target Locations
														// it will be overwrite
														if (sheet.name === 'Target Locations') {
															temp_location[0] = sh;
														};
													// }
												});

												var header = ngmClusterImportFile.listheaderAttributeInFile('target_location');
												location = ngmClusterImportFile.transform_to_obj(temp_location[0], header);
												if (location.length) {
													angular.forEach(location, function (t_l) {
														target_locations.push($scope.project.addMissingTargetlocationsFormFile(t_l))
													})

													for (var i = 0; i < target_locations.length; i++) {
														var match = $scope.project.checkLocationFormFile(target_locations[i])
														if ((!target_locations[i].admin1name) || (!target_locations[i].admin1pcode) ||
															(!target_locations[i].admin2name) || (!target_locations[i].admin2pcode) ||
															!match.valid) {
															if (!$scope.messageFromfile.target_locations_message[i]) { $scope.messageFromfile.target_locations_message[i] = [] }
															if (!target_locations[i].admin1pcode) {
																obj = { label: false, property: 'admin1pcode', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin1name) {
																obj = { label: false, property: 'admin1name', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin2pcode) {
																obj = { label: false, property: 'admin2pcode', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}
															if (!target_locations[i].admin2name) {
																obj = { label: false, property: 'admin2name', reason: 'missing value' }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}

															if (!match.valid) {
																obj = { label: false, property: 'location_incorrect', reason: 'Location Not Match '+ match.reason }
																$scope.messageFromfile.target_locations_message[i].push(obj);
															}

															count_error_target_locations += 1

														} else {
															$scope.project.addLocationFormFile(target_locations[i], i)
														}
													}
												}

											})
										}else{

											var beneficiaries = [];
											wb.xlsx.load(data).then(workbook => {
												var temp_beneficiaries = [];
												workbook.eachSheet((sheet, index) => {
													// get only the first sheet
													// if (index === 1) {
														const sh = [];
														sheet.eachRow(row => {
															sh.push(row.values);
														});
														if (index === 1) {
															temp_beneficiaries.push(sh);
														}

														// if user input excel file that contain sheet name Target Locations
														// it will be overwrite
														if (sheet.name === 'Target Beneficiaries') {
															temp_beneficiaries[0] = sh;
														};
													// }
												});

												var header = ngmClusterImportFile.listheaderAttributeInFile('target_beneficiary');
												beneficiaries = ngmClusterImportFile.transform_to_obj(temp_beneficiaries[0], header);

												if (beneficiaries.length) {
													angular.forEach(beneficiaries, function (t_l) {
														target_beneficiaries.push($scope.project.addMissingTargetbeneficiaryFromFile(t_l))
													})

													for (var b = 0; b < target_beneficiaries.length; b++) {

														if ((!target_beneficiaries[b].cluster_id) || (!target_beneficiaries[b].activity_type_id) || (!target_beneficiaries[b].activity_description_id)) {
															if (!$scope.messageFromfile.target_beneficiaries_message[b]) { $scope.messageFromfile.target_beneficiaries_message[b] = [] }
															if (!target_beneficiaries[b].cluster_id) {
																obj = { label: false, property: 'cluster_id', reason: 'Missing value' }
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															if (!target_beneficiaries[b].activity_type_id) {
																var obj = { label: false, property: 'activity_type_id', reason: 'missing value' };
																if (target_beneficiaries[b].activity_type_name) {
																	obj.reason = 'not in the list'
																}
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															if (!target_beneficiaries[b].activity_description_id) {
																var obj = { label: false, property: 'activity_description_id', reason: 'missing value' };
																if (target_beneficiaries[b].activity_description_name) {
																	obj.reason = 'not in the list'
																}
																$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
															}
															count_error_target_beneficiaries += 1
														} else {
															$scope.project.addBeneficiaryFromFile(target_beneficiaries[b], b)
														}
													}
												}


											})

										}
										var previews = document.querySelectorAll(".dz-preview");
										previews.forEach(function (preview) {
											preview.style.display = 'none';
										})
										document.querySelector(".dz-default.dz-message").style.display = 'none';
										document.querySelector(".percent-upload").style.display = 'block';
										$timeout(function () {
											document.querySelector(".percent-upload").style.display = 'none';
											$('#upload-monthly-file-project').modal('close');
											drop_zone.removeAllFiles(true);


											$scope.project.setMessageForImportFile($scope.messageFromfile, ngmClusterValidation.fieldProject())

											if ((count_error_project_detail > 0) || (count_error_target_beneficiaries > 0) || (count_error_target_locations > 0)) {
												if (count_error_project_detail > 0) {
													M.toast({ html: 'Import Project Detail Fail!', displayLength: 4000, classes: 'error' });
												}
												if (count_error_target_beneficiaries > 0) {
													if (count_error_target_beneficiaries === target_beneficiaries.length) {
														M.toast({ html: 'Target Beneficiaries Import failed!', displayLength: 4000, classes: 'error' });
													} else {
														M.toast({ html: 'Some Target Beneficiaries Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
													}
												}

												if (count_error_target_locations > 0) {
													if (count_error_target_locations === target_locations.length) {
														M.toast({ html: 'Target Location Import failed!', displayLength: 4000, classes: 'error' });
													} else {
														M.toast({ html: 'Some Target Locations Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
													}
												}
											}
											if ((count_error_project_detail < 1) || (count_error_target_beneficiaries < 1) || (count_error_target_locations < 1)) {
												if (count_error_project_detail < 1 && ($scope.import_file_type === 'all')) {
													M.toast({ html: 'Import Project Detail Success!', displayLength: 4000, classes: 'success' });
												}
												if (count_error_target_beneficiaries < 1 && ($scope.import_file_type === 'all' || $scope.import_file_type === 'beneficiary')) {
													if (target_beneficiaries.length) {
														M.toast({ html: 'Import Target Beneficiaries Success!', displayLength: 4000, classes: 'success' });
													}
												}
												if (count_error_target_locations < 1 && ($scope.import_file_type === 'all' || $scope.import_file_type === 'location')) {
													if (target_locations.length) {
														M.toast({ html: 'Import Target Location Success!', displayLength: 4000, classes: 'success' });
													}
												}
											}
											// reset error message
											$scope.messageFromfile = { project_detail_message: [], target_beneficiaries_message: [], target_locations_message: [] };
											$("#upload_file").attr("disabled", true);
											$("#delete_file").attr("disabled", true);
											$("#switch_btn_file").attr("disabled", false);
										}, 2000)

									})
								}
							});

							document.getElementById('delete_file').addEventListener("click", function () {
								drop_zone.removeAllFiles(true);
							});

							// when add file
							drop_zone.on("addedfile", function (file) {

								document.querySelector(".dz-default.dz-message").style.display = 'none';
								var ext = file.name.split('.').pop();
								//change preview if not image/*
								$(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
								$("#upload_file").attr("disabled", false);
								$("#delete_file").attr("disabled", false);

							});

							// when remove file
							drop_zone.on("removedfile", function (file) {

								if (drop_zone.files.length < 1) {
									// upload_file and delete_file is ID for button upload and cancel
									$("#upload_file").attr("disabled", true);
									$("#delete_file").attr("disabled", true);

									document.querySelector(".dz-default.dz-message").style.display = 'block';
									$('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.dictDefaultMessage);//html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please do not forget to put required sheets! <br/>with extention xlsx as per template in project downloads');
								}

								if ((drop_zone.files.length < 2) && (drop_zone.files.length > 0)) {
									document.querySelector(".dz-default.dz-message").style.display = 'none';
									$("#upload_file").attr("disabled", false);
									$("#delete_file").attr("disabled", false);
									document.getElementById("upload_file").style.pointerEvents = "auto";
									document.getElementById("delete_file").style.pointerEvents = "auto";

								}
							});

							drop_zone.on("maxfilesexceeded", function (file) {
								document.querySelector(".dz-default.dz-message").style.display = 'none';
								$('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.dictDefaultMessage);
								// $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + 'Please, import just one file at the time and remove exceeded file');
								document.querySelector(".dz-default.dz-message").style.display = 'block'
								// Materialize.toast("Too many file to upload", 6000, "error")
								M.toast({ html: "Too many file to upload", displayLength: 2000, classes: 'error' });
								$("#upload_file").attr("disabled", true);
								document.getElementById("upload_file").style.pointerEvents = "none";
								$("#delete_file").attr("disabled", true);
								document.getElementById("delete_file").style.pointerEvents = "none";
							});

							// reset
							this.on("reset", function () {
								// upload_file and delete_file is ID for button upload and cancel
								document.getElementById("upload_file").style.pointerEvents = 'auto';
								document.getElementById("delete_file").style.pointerEvents = 'auto';
							});
						},

					},
					uploadText: function () {

						document.querySelector("#ngm-input-string").style.display = 'none';
						document.querySelector(".percent-upload").style.display = 'block';
						$("#input_string").attr("disabled", true);
						$("#close_input_string").attr("disabled", true);
						$("#switch_btn_text").attr("disabled", true);
						var attribute_headers_obj = ngmClusterImportFile.listheaderAttributeInFile('monthly_report');
						if ($scope.project.text_input) {
							csv_array = Papa.parse($scope.project.text_input).data;
							var header_must_exist ='';
							if ($scope.import_file_type === 'location'){
								 header_must_exist = 'Admin1 Pcode';
								header = ngmClusterImportFile.listheaderAttributeInFile('target_location')
							}
							if ($scope.import_file_type === 'beneficiary') {
								header_must_exist = 'Activity Type';
								header = ngmClusterImportFile.listheaderAttributeInFile('target_beneficiary')
							}

							if (csv_array[0].indexOf(header_must_exist) < 0) {

								$timeout(function () {
									$scope.project.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
									$('#upload-monthly-file-project').modal('close');
									document.querySelector("#ngm-input-string").style.display = 'block';
									document.querySelector(".percent-upload").style.display = 'none';
									$('#message-file-project').modal({ dismissible: false });
									$('#message-file-project').modal('open');
									$scope.project.text_input = '';
									document.querySelector("#input-string-area").style.display = 'block';
									$scope.inputString = false;
								}, 1000)
								return
							};


							var values = [];
							values_obj = [];
							var target_locations=[];
							 	target_beneficiaries=[];
								count_error_target_locations=0;
								count_error_target_beneficiaries=0
							// get value and change to object
							values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
							 // map the header to the attribute name
							for (var index = 0; index < values_obj.length; index++) {
								obj_true = {};
								angular.forEach(values_obj[index], function (value, key) {

									atribute_name =header[key];
									obj_true[atribute_name] = value;

								})
								values.push(obj_true);
							}

							if(values.length){
								if ($scope.import_file_type === 'location') {
									angular.forEach(values, function (t_l) {
										target_locations.push($scope.project.addMissingTargetlocationsFormFile(t_l))
									});

									for (var i = 0; i < target_locations.length; i++) {
										var match = $scope.project.checkLocationFormFile(target_locations[i])
										if ((!target_locations[i].admin1name) || (!target_locations[i].admin1pcode) ||
											(!target_locations[i].admin2name) || (!target_locations[i].admin2pcode) ||
											!match.valid) {
											if (!$scope.messageFromfile.target_locations_message[i]) { $scope.messageFromfile.target_locations_message[i] = [] }
											if (!target_locations[i].admin1pcode) {
												obj = { label: false, property: 'admin1pcode', reason: 'missing value' }
												$scope.messageFromfile.target_locations_message[i].push(obj);
											}
											if (!target_locations[i].admin1name) {
												obj = { label: false, property: 'admin1name', reason: 'missing value' }
												$scope.messageFromfile.target_locations_message[i].push(obj);
											}
											if (!target_locations[i].admin2pcode) {
												obj = { label: false, property: 'admin2pcode', reason: 'missing value' }
												$scope.messageFromfile.target_locations_message[i].push(obj);
											}
											if (!target_locations[i].admin2name) {
												obj = { label: false, property: 'admin2name', reason: 'missing value' }
												$scope.messageFromfile.target_locations_message[i].push(obj);
											}

											if (!match.valid) {
												obj = { label: false, property: 'location_incorrect', reason: 'Location Not Match ' + match.reason }
												$scope.messageFromfile.target_locations_message[i].push(obj);
											}

											count_error_target_locations += 1

										} else {
											$scope.project.addLocationFormFile(target_locations[i], i)
										}
									}
								}
								if ($scope.import_file_type === 'beneficiary'){
									angular.forEach(values, function (t_l) {
										target_beneficiaries.push($scope.project.addMissingTargetbeneficiaryFromFile(t_l))
									})

									for (var b = 0; b < target_beneficiaries.length; b++) {

										if ((!target_beneficiaries[b].cluster_id) || (!target_beneficiaries[b].activity_type_id) || (!target_beneficiaries[b].activity_description_id)) {
											if (!$scope.messageFromfile.target_beneficiaries_message[b]) { $scope.messageFromfile.target_beneficiaries_message[b] = [] }
											if (!target_beneficiaries[b].cluster_id) {
												obj = { label: false, property: 'cluster_id', reason: 'Missing value' }
												$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
											}
											if (!target_beneficiaries[b].activity_type_id) {
												var obj = { label: false, property: 'activity_type_id', reason: 'missing value' };
												if (target_beneficiaries[b].activity_type_name) {
													obj.reason = 'not in the list'
												}
												$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
											}
											if (!target_beneficiaries[b].activity_description_id) {
												var obj = { label: false, property: 'activity_description_id', reason: 'missing value' };
												if (target_beneficiaries[b].activity_description_name) {
													obj.reason = 'not in the list'
												}
												$scope.messageFromfile.target_beneficiaries_message[b].push(obj);
											}
											count_error_target_beneficiaries += 1
										} else {
											$scope.project.addBeneficiaryFromFile(target_beneficiaries[b], b)
										}
									}
								}


							}

							$scope.project.setMessageForImportFile($scope.messageFromfile, ngmClusterValidation.fieldProject())
							$timeout(function () {
								document.querySelector("#ngm-input-string").style.display = 'block';
								document.querySelector(".percent-upload").style.display = 'none';
								$('#upload-monthly-file-project').modal('close');
								$scope.project.text_input = '';

								if ( (count_error_target_beneficiaries > 0) || (count_error_target_locations > 0)) {
									if (count_error_target_beneficiaries > 0) {
										if (count_error_target_beneficiaries === target_beneficiaries.length) {
											M.toast({ html: 'Target Beneficiaries Import failed!', displayLength: 4000, classes: 'error' });
										} else {
											M.toast({ html: 'Some Target Beneficiaries Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
										}
									}

									if (count_error_target_locations > 0) {
										if (count_error_target_locations === target_locations.length) {
											M.toast({ html: 'Target Location Import failed!', displayLength: 4000, classes: 'error' });
										} else {
											M.toast({ html: 'Some Target Locations Rows Succeccfully added!', displayLength: 4000, classes: 'success' });
										}
									}
								}
								if ((count_error_target_beneficiaries < 1) || (count_error_target_locations < 1)) {
									if (count_error_target_beneficiaries < 1 && ($scope.import_file_type === 'beneficiary')) {
										if (target_beneficiaries.length) {
											M.toast({ html: 'Import Target Beneficiaries Success!', displayLength: 4000, classes: 'success' });
										}
									}
									if (count_error_target_locations < 1 && ( $scope.import_file_type === 'location')) {
										if (target_locations.length) {
											M.toast({ html: 'Import Target Location Success!', displayLength: 4000, classes: 'success' });
										}
									}
								}
								// reset error message
								$scope.messageFromfile = { project_detail_message: [], target_beneficiaries_message: [], target_locations_message: [] };
								document.querySelector("#input-string-area").style.display = 'block';
								$scope.inputString = false;
							}, 2000)





						} else {
							$timeout(function () {
								document.querySelector("#ngm-input-string").style.display = 'block';
								document.querySelector(".percent-upload").style.display = 'none';
								$("#close_input_string").attr("disabled", false);
								$("#input_string").attr("disabled", false);
								$("#switch_btn_text").attr("disabled", false);
								M.toast({ html: 'Please Type something!', displayLength: 2000, classes: 'success' });
							}, 2000)

						}
						// reset error message
						$scope.messageFromfile = [];
					}
				},
				addMissingAttributeFromFile: function (obj) {
					if(obj.cluster){
						selected_cluster = $filter('filter')($scope.project.lists.clusters,{cluster:obj.cluster});
						if(selected_cluster.length){
							obj.cluster_id = selected_cluster[0].cluster_id;
						}
						if( obj.cluster === 'MPC'){
							obj.cluster_id = "cvwg";
							obj.cluster = "Multi-Purpose Cash"
						}
					}
					if (obj.admin0name){
						obj.admin0name = $scope.project.user.admin0name === obj.admin0name ? obj.admin0name : $scope.project.user.admin0name;
						obj.admin0pcode = $scope.project.user.admin0pcode
					}
					// activity_type
					if (obj.activity_type_list){

						// map list to array of object
						temp = obj.activity_type_list.split(';').map((x)=> {
							x = x.split(',');
							x[0]=x[0].trim();
							x[1]=x[1].trim();
							var obj ={
								cluster : x[0],
								activity_type_name : x[1]
							}
							return obj
						});

						temp_check ={};
						temp_intercheck ={}
						temp_inter_act = []

						// add missing atribute for activity_type
						angular.forEach(temp,function(e){
							selected_act_list = $filter('filter')($scope.project.lists.activity_types, { cluster: e.cluster, activity_type_name: e.activity_type_name});
							if(selected_act_list.length){
								e.cluster_id = selected_act_list[0].cluster_id;
								e.activity_type_id = selected_act_list[0].activity_type_id;
								temp_check[selected_act_list[0].activity_type_id] = true;
								if ($scope.project.user.cluster_id !== selected_act_list[0].cluster_id){
									temp_intercheck[selected_act_list[0].cluster_id] = true;
									temp_inter_act.push({ cluster_id: selected_act_list[0].cluster_id, cluster: selected_act_list[0].cluster})
								}

							}
						})

						obj.activity_type = temp;
						obj.inter_cluster_check = temp_intercheck;
						obj.activity_type_check = temp_check;
						obj.inter_cluster_activities = temp_inter_act.filter((thing, index, self) => self.findIndex(t => t.cluster_id === thing.cluster_id) === index);

					}

					// implementing partner list
					if (obj.implementing_partners_list){
						obj.implementing_partners_checked = true;
						var impl_array =[]
						temp = obj.implementing_partners_list.split(';').map((x)=>{return x.trim();});

						angular.forEach(temp, function(e){

							selected_impl = $filter('filter')($scope.project.lists.organizations, { organization_name: e});

							if (selected_impl.length){
								impl_array.push(selected_impl[0]);
							}
						})
						obj.implementing_partners = impl_array;
					}
					// project donor
					if (obj.project_donor_list){

						temp_donor = [];
						temp_donor_check={};

						temp = obj.project_donor_list.split(';').map((x)=> x.trim());
						 angular.forEach(temp,function(e){

							selected_donor = $filter('filter')($scope.project.lists.donors,{project_donor_name:e});
							if(selected_donor.length){
								temp_donor.push(selected_donor[0]);
								temp_donor_check[selected_donor[0].project_donor_id]= true;
							}

						 })

						obj.project_donor = temp_donor;
						obj.project_donor_check = temp_donor_check;


					}

					if(obj.project_details_list){
						temp_project_details =[];
						temp = obj.project_details_list.split(';').map(x=>x.trim());

						angular.forEach(temp,function(e){
							selected_p_details = $filter('filter')($scope.project.lists.project_details, { project_detail_name:e});
							if(selected_p_details.length){
								temp_project_details.push(selected_p_details[0]);
							}
						})

						obj.project_details = temp_project_details;
					}


					// remove list
					delete obj.activity_type_list;
					delete obj.implementing_partners_list;
					delete obj.project_donor_list

					return obj

				},
				addMissingAttributeProjectDetailFromFile:function(obj){

					if (obj.implementing_partners) {
						obj.implementing_partners_checked = true;
						var impl_array = []
						temp = obj.implementing_partners.split(',').map((x) => { return x.trim(); });

						angular.forEach(temp, function (e) {

							selected_impl = $filter('filter')($scope.project.lists.organizations, { organization: e });

							if (selected_impl.length) {
								impl_array.push(selected_impl[0]);
							}
						})
						obj.implementing_partners = impl_array;
					}

					if (obj.project_details) {
						temp_project_details = [];
						temp = obj.project_details.split(',').map(x => x.trim());

						angular.forEach(temp, function (e) {
							selected_p_details = $filter('filter')($scope.project.lists.project_details, { project_detail_name: e });
							if (selected_p_details.length) {
								temp_project_details.push(selected_p_details[0]);
							}
						})

						obj.project_details = temp_project_details;
					}
					if (obj.project_details === "") {
						obj.project_details = [];
					}
					if (obj.project_donor) {

						temp_donor = [];
						temp_donor_check = {};

						temp = obj.project_donor.split(',').map((x) => x.trim());
						angular.forEach(temp, function (e) {

							selected_donor = $filter('filter')($scope.project.lists.donors, { project_donor_name: e });
							if (selected_donor.length) {
								temp_donor.push(selected_donor[0]);
								temp_donor_check[selected_donor[0].project_donor_id] = true;
							}

						})
						obj.project_donor = temp_donor;
						obj.project_donor_check = temp_donor_check;


					}
					if (obj.activity_type && obj.activity_type.length){
						temp_check = {};
						temp_intercheck = {}
						temp_inter_act = []
						temp_activity_type =[]
						// add missing atribute for activity_type
						angular.forEach(obj.activity_type, function (e) {
							selected_act_list = $filter('filter')($scope.project.lists.activity_types, { cluster: e.cluster, activity_type_name: e.activity_type_name, active: 1});
							if (selected_act_list.length) {
								e.cluster_id = selected_act_list[0].cluster_id;
								e.activity_type_id = selected_act_list[0].activity_type_id;
								temp_activity_type.push(e);
								temp_check[selected_act_list[0].activity_type_id] = true;
								if ($scope.project.user.cluster_id !== selected_act_list[0].cluster_id) {
									temp_intercheck[selected_act_list[0].cluster_id] = true;
									temp_inter_act.push({ cluster_id: selected_act_list[0].cluster_id, cluster: selected_act_list[0].cluster })
								}

							}
						})

						obj.activity_type = temp_activity_type;
						obj.inter_cluster_check = temp_intercheck;
						obj.activity_type_check = temp_check;
						obj.inter_cluster_activities = temp_inter_act.filter((thing, index, self) => self.findIndex(t => t.cluster_id === thing.cluster_id) === index);
					}
					return obj
				},
				addMissingTargetlocationsFormFile:function(obj){
					if (obj.implementing_partners) {
						var impl_array = []
						temp = obj.implementing_partners.split(',').map((x) => { return x.trim(); });

						angular.forEach(temp, function (e) {

							selected_impl = $filter('filter')($scope.project.lists.organizations, { organization: e });

							if (selected_impl.length) {
								impl_array.push(selected_impl[0]);
							}
						})
						obj.implementing_partners = impl_array;
					}

					if (obj.site_type_name){
						selected_type = $filter('filter')($scope.project.lists.site_type, { site_type_name:obj.site_type_name});
						if(selected_type.length){
							obj.site_type_id = selected_type[0].site_type_id;
						}
					}

					if (obj.site_implementation_name){
						selected_site_impl = $filter('filter')($scope.project.lists.site_implementation, { site_implementation_name: obj.site_implementation_name }, true);
						if(selected_site_impl.length){
							obj.site_implementation_id = selected_site_impl[0].site_implementation_id;
						}
					}

					return obj
				},
				addMissingTargetbeneficiaryFromFile:function(obj){
					// cluster
					if (obj.cluster) {
						selected_cluster = $filter('filter')($scope.project.lists.clusters, { cluster: obj.cluster }, true)
						if (obj.cluster === 'MPC' && !selected_cluster.length) { obj.cluster_id = 'cvwg' };
						if (selected_cluster.length) {
							obj.cluster_id = selected_cluster[0].cluster_id;
						}
					}

					// activity
					if (obj.activity_type_name) {
						selected_act = $filter('filter')($scope.project.definition.activity_type, { activity_type_name: obj.activity_type_name }, true);
						if (selected_act.length) {
							obj.activity_type_id = selected_act[0].activity_type_id;
						}
					}
					// activity description
					if (obj.activity_description_name) {
						selected_desc = $filter('filter')($scope.project.lists.activity_descriptions, {
							cluster_id: obj.cluster_id,
							activity_description_name: obj.activity_description_name,
							activity_type_id: obj.activity_type_id
						}, true);
						if (selected_desc.length) {
							obj.activity_description_id = selected_desc[0].activity_description_id;
						}
					}
					// activity_detail
					if (obj.activity_detail_name) {
						selected_activity_detail = $filter('filter')($scope.project.lists.activity_details, {
							cluster_id: obj.cluster_id,
							activity_type_id: obj.activity_type_id,
							activity_description_id: obj.activity_description_id,
							activity_detail_name: obj.activity_detail_name
						}, true);
						if (selected_activity_detail.length) {
							obj.activity_detail_id = selected_activity_detail[0].activity_detail_id
						}
					}
					// indicator
					if (obj.indicator_name) {
						selected_indicator = $filter('filter')($scope.project.lists.activity_indicators, { indicator_name: obj.indicator_name }, true);
						if (selected_indicator.length) {
							obj.indicator_id = selected_indicator[0].indicator_id;
						}
					}

					// beneficiary_type_name
					if (obj.beneficiary_type_name) {
						selected_beneficiary = $filter('filter')($scope.project.lists.beneficiary_types, { beneficiary_type_name: obj.beneficiary_type_name }, true);
						if (selected_beneficiary.length) {
							obj.beneficiary_type_id = selected_beneficiary[0].beneficiary_type_id;
						}
					}

					// beneficiary_category_id
					if (obj.beneficiary_category_name) {
						selected_beneficiary_category = $filter('filter')($scope.project.lists.beneficiary_categories, { beneficiary_category_name: obj.beneficiary_category_name })
						if (selected_beneficiary_category.length) {
							obj.beneficiary_category_id = selected_beneficiary_category[0].beneficiary_category_id;
						}
					}

					// delivery type
					if (obj.delivery_type_name) {
						selected_delivery = $filter('filter')($scope.project.lists.delivery_types, { delivery_type_name: obj.delivery_type_name }, true)
						if (selected_delivery.length) {
							obj.delivery_type_id = selected_delivery[0].delivery_type_id
						}
					}
					// hrp beneficiary
					if (obj.hrp_beneficiary_type_name) {
						selected_hrp = $filter('filter')($scope.project.lists.hrp_beneficiary_types, { hrp_beneficiary_type_name: obj.hrp_beneficiary_type_name }, true)
						if (selected_hrp.length) {
							obj.hrp_beneficiary_type_id = selected_hrp[0].hrp_beneficiary_type_id;
						}
					}
					// site_type
					if (obj.site_type_name) {
						selected_site = $filter('filter')($scope.project.lists.site_type, { site_type_name: obj.site_type_name }, true)
						if (selected_site.length) {
							obj.site_type_id = selected_site[0].site_type_id
						}
					}
					if (obj.site_implementation_name) {
						selected_site_implementation = $filter('filter')($scope.project.lists.site_implementation, { site_implementation_name: obj.site_implementation_name }, true);
						if (selected_site_implementation[0]) {
							obj.site_implementation_id = selected_site_implementation[0].site_implementation_id;
						}
					}


					// transfer value
					if (obj.transfer_type_value) {
						selected_transfer = $filter('filter')($scope.project.lists.transfers, { transfer_type_value: obj.transfer_type_value }, true)

						if (selected_transfer.length) {
							obj.transfer_type_id = selected_transfer[0].transfer_type_id;
						}
					}

					if (obj.package_type_name) {
						var package_list = [{
							'package_type_id': 'standard',
							'package_type_name': 'Standard'
						}, {
							'package_type_id': 'non-standard',
							'package_type_name': 'Non-standard'
						}];
						selected_package = $filter('filter')(package_list, { package_type_name: obj.package_type_name }, true);
						if (selected_package.length) {
							obj.package_type_id = selected_package[0].package_type_id;
						}
					}

					return obj
				},
				switchInputFile: function () {
					$scope.inputString = !$scope.inputString;
					$scope.project.messageWarning = '';
				},
				setMessageForImportFile:function(messageList,list_field){
					var message_temp = ''
					for(x in messageList){
						if(messageList[x].length){
							if (x ==='project_detail_message'){
								sheetName = 'Project Detail';
							}else if (x === 'target_locations_message'){
								sheetName = 'Target Locations'
							}else {
								sheetName = 'Target Beneficiaries';
							}
							// message_temp += 'Missing Value on Sheet '+ sheetName +'\n';
							for (var y = 0; y < messageList[x].length; y++) {
								if(messageList[x][y].length){
									message_temp += 'Missing Value on Sheet ' + sheetName + '\n';
									for (var z = 0; z < messageList[x][y].length; z++){
										var field = messageList[x][y][z].property;
										var reason = messageList[x][y][z].reason;
										var error_label = messageList[x][y][z].label;
										if (error_label) {
											// $timeout(function () {
												$(error_label).addClass('error');
											// }, 0)

										}
										if (field === 'activity_type_check' || field === 'project_donor_check') {
											message_temp += 'Missing Activity Type or Project Donor \nPlease check spelling, or verify that this is a correct value for this Project! \n'
										}
										message_temp += 'Incorrect value at row ' + (y + 2) + ', ' + list_field[field] + ' : ' + reason + '\n';

										if (field === 'activity_type_check' || field === 'project_donor' ||
											field === 'admin1pcode' || field ==='admin1name'|| field ==='admin2pcode'||field ==='admin2name'||
											field === 'cluster_id' || field === 'activity_type_id' || field === 'activity_description_id' || field === 'location_incorrect'){
											message_temp += 'Row ' + (y + 2) + ' From Sheet ' + sheetName +' will be not added\n'
										}
									}
									message_temp += '\n'
								}

							}

							$timeout(function () {
								for (x in messageList) {
									for (var y = 0; y < messageList[x].length; y++) {
										if (messageList[x][y].length) {
											for (var z = 0; z < messageList[x][y].length; z++) {
												var error_label = messageList[x][y][z].label;
												if (error_label) {
													$(error_label).addClass('error');
												}
											}
										}
									}
								}
							}, 10)

						}
					}
					if (message_temp !== '') {

						$scope.project.messageWarning = message_temp;

						$timeout(function () {
							$('#message-file-project').modal({ dismissible: false });
							$('#message-file-project').modal('open');
						})

					}
					return message_temp;
				},


				copyProject:function(){
					$location.path('/cluster/projects/details/new/' + $scope.project.definition.id);
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

					//SAVE COMPONENT-PLANS

					 $scope.project.definition.plan_component = [];

					 	if ($scope.project.definition.hrp_plan == true) {
						  $scope.project.definition.plan_component.push('hrp_plan');
						}

						if ($scope.project.definition.rmrp_plan == true) {
						  $scope.project.definition.plan_component.push('rmrp_plan');
						}

						if ($scope.project.definition.interagencial_plan == true) {
						  $scope.project.definition.plan_component.push('interagencial_plan');
						}

						if ($scope.project.definition.humanitarian_component == true) {
						  $scope.project.definition.plan_component.push('humanitarian_component');
						}

						if ($scope.project.definition.construccion_de_paz_component == true) {
						  $scope.project.definition.plan_component.push('construccion_de_paz_component');
						}

						if ($scope.project.definition.desarrollo_sostenible_component == true) {
						  $scope.project.definition.plan_component.push('desarrollo_sostenible_component');
						}

						if ($scope.project.definition.flujos_migratorios_component == true) {
						  $scope.project.definition.plan_component.push('flujos_migratorios_component');
						}






					// update target_locations
					$scope.project.definition.target_locations =
							ngmClusterHelper.getCleanTargetLocation( $scope.project.definition, $scope.project.definition.target_locations );

					// inform
					// Materialize.toast( $filter('translate')('processing'), 6000, 'note' );
					M.toast({ html: $filter('translate')('processing'), displayLength: 6000, classes: 'note' });


					// details update
					$http({
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/project/setProject',
						data: { project: $scope.project.definition }
					}).success( function( project ){

						// enable
						$scope.project.submit = true;

						// error
						if ( project.err ) {
							// Materialize.toast( $filter('translate')('save_failed_the_project_contains_error')+'!', 4000, 'error' );
							M.toast({ html: $filter('translate')('save_failed_the_project_contains_error') + '!', displayLength: 4000, classes: 'error' });
						}

						// if success
						if ( !project.err ) {

							// add id to client json
							$scope.project.definition = angular.merge( $scope.project.definition, project );

							// save
							if( save_msg ){
								// Materialize.toast( save_msg , 4000, 'success' );
								M.toast({ html: save_msg, displayLength: 4000, classes: 'success' });
							}

							// notification modal
							if( display_modal ){

								// modal-trigger
								// $('.modal-trigger').leanModal();
								$('.modal-trigger').modal();

								// save msg
								var msg = $scope.project.newProject ? $filter('translate')('project_created')+'!' : $filter('translate')('project_updated');

								// save, redirect + msg
								$timeout(function(){
									$location.path( '/cluster/projects/summary/' + $scope.project.definition.id );
									$timeout(function(){
										// Materialize.toast( msg, 4000, 'success' );
										M.toast({ html: msg, displayLength: 4000, classes: 'success' });
									}, 400 );
								}, 400 );
							}
						}

					}).error(function( err ) {
						// error
						// Materialize.toast( 'Error!', 4000, 'error' );
						M.toast({ html: 'Error', displayLength: 4000, classes: 'error' });
						// unblock save button in case of any backend / no internet errors
						$timeout(function () {
							$scope.project.submit = true;
						}, 4000);
					});

				}

			}

			// init project
			$scope.project.init();
			$scope.project.getDocument();
			// update list  if there are upload file or remove file
			$scope.$on('refresh:listUpload', function () {
				$scope.project.getDocument();
			});
			// for loading mask
			$scope.loading = true;
			$scope.$on('$includeContentLoaded', function (eve, htmlpath) {
				// Emitted every time the ngInclude content is reloaded
				// use this '/scripts/modules/cluster/views/forms/details/project-upload.html' because the last loaded
				if ( $scope.project.definition.project_status === 'new' ) {
					$timeout(function() {
						$scope.loading = false;
					}, 100 );
				} else if (htmlpath ==='/scripts/modules/cluster/views/forms/details/project-upload.html') {
					// setTimeout(() => {
					$timeout(function() {
						$scope.loading = false;
					}, 100 );
				}
			});
	}

]);
