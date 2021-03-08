/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.authentication', ['ngm.provider'])
	.config(function(dashboardProvider){
		dashboardProvider
			.widget('form.authentication', {
				title: 'ReportHub Authentication Form',
				description: 'ReportHub Authentication Form',
				controller: 'AuthenticationFormCtrl',
				templateUrl: '/scripts/app/views/view.html'
			});
	})
	.controller( 'AuthenticationFormCtrl', [
		'$scope',
		'$http',
		'$location',
		'$timeout',
		 '$filter',
		'$q',
		'ngmAuth',
		'ngmUser',
		'ngmData',
		'ngmClusterLists',
		'ngmLists',
		'config',
		'$translate',
		'$rootScope',
		function ($scope, $http, $location, $timeout, $filter, $q, ngmAuth, ngmUser, ngmData, ngmClusterLists, ngmLists, config, $translate,$rootScope){


			// 4wPlus
			if( $location.$$host === "4wplus.org" || $location.$$host === "35.229.43.63" ){
				var4wplusrh = "4wPlus";
			}else{
				var4wplusrh = "ReportHub"
			}

			// project
			$scope.panel = {

				err: false,

				var4wplusrh :var4wplusrh,

				date : new Date(),

				user: config.user ? config.user : ngmUser.get(),//ngmUser.get() ? ngmUser.get() : {},

				btnDisabled: false,

				btnActivate: config.user && config.user.status === 'deactivated' ? true : false,

				btnDeactivate: config.user && config.user.status === 'active' ? true : false,

				// editable role array:
				editRoleUrl: '/scripts/app/views/authentication/edit-role.html',

				// adminRegion
				adminRegion: [
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'AF', admin0name: 'Afghanistan' },
					// { adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'BD', admin0name: 'Bangladesh' },
					{ adminRpcode: 'AMER', adminRname: 'AMER', admin0pcode: 'COL', admin0name: 'Colombia'},
					{ adminRpcode: 'SEARO', adminRname: 'SEARO', admin0pcode: 'CB', admin0name: 'Cox Bazar' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'CD', admin0name: 'Democratic Republic of Congo' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'ET', admin0name: 'Ethiopia' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'IQ', admin0name: 'Iraq' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'KE', admin0name: 'Kenya' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'NG', admin0name: 'Nigeria' },
					{ adminRpcode: 'WPRO', adminRname: 'WPRO', admin0pcode: 'PG', admin0name: 'Papua New Guinea' },
					{ adminRpcode: 'WPRO', adminRname: 'WPRO', admin0pcode: 'PHL', admin0name: 'Philippines' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SO', admin0name: 'Somalia' },
					{ adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'SS', admin0name: 'South Sudan' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SY', admin0name: 'Syria' },
					{ adminRpcode: 'EURO', adminRname: 'EURO', admin0pcode: 'UA', admin0name: 'Ukraine' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'UR', admin0name: 'Uruk' },
					{ adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'YE', admin0name: 'Yemen' }

				],

				// programme
				programme:[
					{ programme_id: 'DRCWHOPHISP1', programme_name: 'DRCWHOPHISP1' },
					{ programme_id: 'ETWHOIMOSUPPORTP1', programme_name: 'ETWHOIMOSUPPORTP1' },
					{ programme_id: 'ETWHOIMOSUPPORTP2', programme_name: 'ETWHOIMOSUPPORTP2' },
					{ programme_id: 'ETUSAIDOFDAIMOSUPPORTP1', programme_name: 'ETUSAIDOFDAIMOSUPPORTP1' },
					{ programme_id: 'WWCDCCOOPERATIVEAGREEMENTP11', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP11' },
					{ programme_id: 'WWCDCCOOPERATIVEAGREEMENTP12', programme_name: 'WWCDCCOOPERATIVEAGREEMENTP12' },
				],

				// duty stations
				dutyStations: ngmLists.getObject( 'dutyStations' ),

				// cluster
				clusters:{
					active:{},
					'col' : {
						'education':{cluster:'Educación en Emergencias (EeE)'},
						'alojamientos_asentamientos':{cluster:'Alojamientos/Asentamientos'},
						'san':{cluster:'Seguridad Alimentaria y Nutrición (SAN'},
						'health':{cluster:'Salud'},
						'recuperacion_temprana':{cluster:'Recuperación Temprana'},
						'protection':{cluster:'Protección'},
						'wash':{cluster:'WASH'},
						'undaf':{cluster:'UNDAF'},
						'cvwg': { cluster: 'MPC' },
						'smsd':{cluster:'Sitio de Administración y Sitio de Desarrollo'}

					},
					'all': {
						'cvwg': { cluster: 'MPC' },
						'agriculture': { cluster: 'Agriculture' },
						'cccm_esnfi': { cluster: 'CCCM - Shelter' },
						'cwcwg': { cluster: 'CwCWG' },
						'coordination': { cluster: 'Coordination' },
						'education': { cluster: 'Education' },
						'eiewg': { cluster: 'EiEWG' },
						'emergency_telecommunications': { cluster: 'Emergency Telecommunications' },
						'esnfi': { cluster: 'ESNFI' },
						'fsac': { cluster: 'FSAC' },
						'fss': { cluster: 'Food Security' },
						'health': { cluster: 'Health' },
						'logistics': { cluster: 'Logistics' },
						'smsd': { cluster: 'Site Management, Site Development and DRR' },
						'nutrition': { cluster: 'Nutrition' },
						'protection': { cluster: 'Protection' },
						'rnr_chapter': { cluster: 'R&R Chapter' },
						'wash': { cluster: 'WASH' },
						'child_protection':{ cluster: 'Child Protection' }
					}
				},


				// initialize page
				init: function(){

					// fetch duty stations
					if ( !localStorage.getObject( 'dutyStations') ) {
						// activities list
						var getDutyStations = {
							method: 'GET',
							url: ngmAuth.LOCATION + '/api/list/getDutyStations'
						}
						// send request
						$q.all([ $http( getDutyStations ) ] ).then( function( results ){
							localStorage.setObject( 'dutyStations', results[0].data );
							ngmLists.setObject( 'dutyStations', results[0].data );
							$scope.panel.dutyStations = results[0].data;
						});
					}

					// set clusters
					$scope.panel.clusters.active = ngmClusterLists.getClusters('all').filter(cluster=>cluster.registration!==false);

					// if config user
					if ( config.user ) {
						$scope.panel.roles = ngmAuth.getEditableRoles();
					}

					// merge defaults with config
					$scope.panel = angular.merge( {}, $scope.panel, config );

					// set
					$http.get( ngmAuth.LOCATION + '/api/list/organizations' ).then(function( organizations ){
						localStorage.setObject( 'organizations', organizations.data );
						ngmLists.setObject( 'organizations', organizations.data );
						$scope.panel.organizations = organizations.data;
						$scope.panel.organizations_list = organizations.data;

						// filter lists
						$scope.panel.clusterByCountry();

						$timeout( function() {
							// $( 'select' ).material_select();
							$('select').formSelect();
						}, 400 );
					});

				},


				// filter cluster / org by country
				clusterByCountry: function() {

					// filter organizations, clusters
					var organizations = $scope.panel.organizations_list;

					// selected coutry
					var country = $scope.panel && $scope.panel.user && $scope.panel.user.admin0pcode ? $scope.panel.user.admin0pcode:'all';

					// COL
					if( ( !$scope.panel.user && var4wplusrh === '4wPlus' ) ||
								( $scope.panel.user && ( $scope.panel.user.admin0pcode && $scope.panel.user.admin0pcode === 'COL' ) ) ){

						// new filter
						// var organizations = [];

						// filter CLUSTERS by country
						$scope.panel.clusters.active = ngmClusterLists.getClusters('COL').filter( cluster=>cluster.registration!==false );

						// filter ORGANIZATIONS by country
						// angular.forEach( $scope.panel.organizations_list, function( item ) {
						// 	if ( item.admin0pcode.indexOf('COL') !== -1 ) {
						// 		organizations.push(item);
						// 	}
						// });
					}

					// ALL
					if( ( !$scope.panel.user && var4wplusrh !== '4wPlus') ||
								( $scope.panel.user && ( $scope.panel.user.admin0pcode && $scope.panel.user.admin0pcode !== 'COL' ) ) ){

						// new filter
						// var organizations = [];

						// filter CLUSTERS by country
						$scope.panel.clusters.active = ngmClusterLists.getClusters( country ).filter( cluster=>cluster.registration!==false );

						// filter by country
						// angular.forEach( $scope.panel.organizations_list, function( item ) {
						// 	if (item.admin0pcode.indexOf('ALL') !== -1 || item.admin0pcode.indexOf('') !== -1) {
						// 		organizations.push(item);
						// 	}
						// });
					}

					// set organizations
					// $scope.panel.organizations = organizations;

				},


				orgByCountry:function(){
					var country = $scope.panel && $scope.panel.user && $scope.panel.user.admin0pcode ? $scope.panel.user.admin0pcode : 'all';

					$scope.panel.organizations = $scope.panel.organizations.filter((x)=>{
						if ((x.admin0pcode.indexOf(country) > -1) || (x.admin0pcode.indexOf('ALL') >-1 )){
							// check if organization is inactive or active
							if (x.admin0pcode_inactive && x.admin0pcode_inactive !== '' ){
								if (x.admin0pcode_inactive.indexOf(country) < 0 && x.admin0pcode_inactive.indexOf('ALL') < 0){
									return x
								}
							}else{
								return x
							}
						}

					});
				},


				// login fn
				login: function( ngmLoginForm ){

					// if invalid
					if( ngmLoginForm.$invalid ){
						// set submitted for validation
						ngmLoginForm.$setSubmitted();
					} else {
						$scope.panel.isLogging = true;
						// login
						ngmAuth
							.login({ user: $scope.panel.user }).success( function( result ) {
								$scope.panel.isLogging = false;
								// db error!
								if( result.err || result.summary ){
									var msg = result.summary ? result.summary : result.msg;
									// Materialize.toast( msg, 6000, 'error' );
									M.toast({ html: msg, displayLength: 6000, classes: 'error' });
								}

								// success
								if ( !result.err && !result.summary ){

									// go to default org page
									$location.path( result.app_home );
									$timeout( function(){

										// Materialize.toast( $filter('translate')('welcome_back')+' ' + result.username + '!', 6000, 'note' );
										M.toast({ html: $filter('translate')('welcome_back') + ' ' + result.username + '!', displayLength: 6000, classes: 'note' });
									}, 2000);
								}

							})
							.error(function(err) {
								$scope.panel.isLogging = false;
							});

					}
				},


				// open modal by id
				openModal: function( modal ) {
					// $( '#' + modal ).openModal({ dismissible: false });
					$('#' + modal).modal({ dismissible: false });
					$('#' + modal).modal('open');
				},

				// deactivate
				updateStatus: function ( status ) {
					// set status
					$scope.panel.user.status = status;
					$scope.panel.update( true );

				},

				// delete user!
				delete: function () {

					// disable btns
					$scope.panel.btnDisabled = true;

					// return project
					ngmData.get({
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/delete',
						data: {
							user: $scope.panel.user
						}
					}).then( function( data ){

						if ( data.success ) {
							// success message
							// Materialize.toast( $filter('translate')('success')+' '+$filter('translate')('user_deleted'), 6000, 'success' );
							M.toast({ html: $filter('translate')('success') + ' ' + $filter('translate')('user_deleted'), displayLength: 6000, classes: 'success' });
							$timeout( function(){
								var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
								if ($rootScope.teamPreviouseUrl) {
									path = path = $rootScope.teamPreviouseUrl.split('#')[1];
								}
								$location.path( path );
							}, 1000 );
						} else {
							// Materialize.toast( $filter('translate')('error_try_again'), 6000, 'error' );
							M.toast({ html: $filter('translate')('error_try_again'), displayLength: 6000, classes: 'error' });
						}

					});
				},

				// update profile
				update: function( reload ) {

					// message
					$timeout(function(){
						// Materialize.toast( $filter('translate')('processing')+'...', 6000, 'note');
						M.toast({ html: $filter('translate')('processing') + '...', displayLength: 6000, classes: 'note' });
					}, 200 );

					// disable btns
					$scope.panel.btnDisabled = true;

					// cluster
					var cluster = $filter('filter')( $scope.panel.clusters.active, { cluster_id: $scope.panel.user.cluster_id } )[0].cluster;

					// merge adminRegion
					$scope.panel.user = angular.merge( {}, $scope.panel.user,
																									$filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
																									$filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0],
																								{ cluster } );

					// if immap and ET || CD
					if ( $scope.panel.user.site_name ) {
						var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
								delete dutyStation.id;
						// merge duty station
						$scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
					}
					// if Update Organization OR Cluster
					var orgUpdatedTo;
					var clusterUpdatedTo;
					if (config.user.organization_tag !== $scope.panel.user.organization_tag){
						orgUpdatedTo = $scope.panel.user.organization;
					}
					if (config.user.cluster_id !== $scope.panel.user.cluster_id){
						clusterUpdatedTo = $scope.panel.user.cluster;
					}
					// register
					ngmAuth
						.updateProfile({ user: $scope.panel.user }).success(function( result ) {

							// db error!
							if( result.err || result.summary ){
								var msg = result.msg ? result.msg : 'error!';
								// Materialize.toast( msg, 6000, msg );
								M.toast({ html: msg, displayLength: 6000, classes: 'error' });
							}

							// success
							if ( result.success ){
								// set user and localStorage (if updating own profile)
								if ( $scope.panel.user.username === ngmUser.get().username ) {
									$scope.panel.user = angular.merge( {}, $scope.panel.user, result.user );
									ngmUser.set( $scope.panel.user );
								}
								// success message

								$timeout( function(){

									//
									if (config.user.organization_tag !== $scope.panel.user.organization_tag){
										// Materialize.toast('Organization changed to ' + orgUpdatedTo, 6000, 'success');
										M.toast({ html: 'Organization changed to ' + orgUpdatedTo, displayLength: 6000, classes: 'success' });
									}
									if (config.user.cluster_id !== $scope.panel.user.cluster_id){
										// Materialize.toast('Cluster changed to ' + clusterUpdatedTo, 6000, 'success');
										M.toast({ html: 'Cluster changed to ' + clusterUpdatedTo, displayLength: 6000, classes: 'success' });
									}
									// Materialize.toast( $filter('translate')('success')+' '+$filter('translate')('profile_updated'), 6000, 'success' );
									M.toast({ html: $filter('translate')('success') + ' ' + $filter('translate')('profile_updated'), displayLength: 6000, classes: 'success' });

									// activate btn
									$scope.panel.btnDisabled = false;

									// redirect to team view and page refresh
									if ( reload ) {
										var path = ( ngmUser.get().organization === 'iMMAP' && ( ngmUser.get().admin0pcode === 'CD' || ngmUser.get().admin0pcode === 'ET' ) ) ? '/immap/team' : '/team';
										if ($rootScope.teamPreviouseUrl) {
											  path = $rootScope.teamPreviouseUrl.split('#')[1];
										}
										$location.path( path );
									}
								}, 200 );
							}

						});
				},

				// register fn
				register: function( ngmRegisterForm ){

					$scope.panel.isRegistering = true;

					// cluster
					var cluster = $filter('filter')( $scope.panel.clusters.active, { cluster_id: $scope.panel.user.cluster_id } )[0].cluster;

					// merge adminRegion
					$scope.panel.user = angular.merge( {}, $scope.panel.user,
																									$filter('filter')( $scope.panel.programme, { programme_id: $scope.panel.user.programme_id }, true)[0],
																									$filter('filter')( $scope.panel.adminRegion, { admin0pcode: $scope.panel.user.admin0pcode }, true)[0],
																									{ cluster } );

					// if immap and ET || CD
					if ( $scope.panel.user.site_name ) {
						var dutyStation = $filter('filter')( $scope.panel.dutyStations, { site_name: $scope.panel.user.site_name }, true)[0];
								delete dutyStation.id;
						// merge duty station
						$scope.panel.user = angular.merge( {}, $scope.panel.user, dutyStation );
					}

					// register
					ngmAuth
						.register({ user: $scope.panel.user }).success(function( result ) {

						$scope.panel.isRegistering = false;
						// db error!
						if( result.err || result.summary ){
							var msg = result.summary ? result.summary : result.msg;
							// Materialize.toast( msg, 6000, 'error' );
							M.toast({ html: msg, displayLength: 6000, classes: 'error' });
						}

						// success
						if ( !result.err && !result.summary ){
							// go to default org page
							if (result.status !== 'deactivated'){
								$location.path( result.app_home );
								$timeout( function(){

									// Materialize.toast( $filter('translate')('welcome')+' ' + result.username + ', '+$filter('translate')('time_to_create_a_project'), 6000, 'success' );
									M.toast({ html: $filter('translate')('welcome') + ' ' + result.username + ', ' + $filter('translate')('time_to_create_a_project'), displayLength: 6000, classes: 'success' });

								}, 2000);
							}else{
								$location.path('/cluster/pending/');
								$timeout(function () {
									M.toast({ html: result.username + ', Not Activated Yet!', displayLength: 6000, classes: 'error'  });

								}, 2000);
								ngmUser.unset();
							}
						}

					})
					.error(function(err) {
						$scope.panel.isRegistering = false;
					});

				},

				// register fn
				passwordResetSend: function( ngmResetForm ){

					// if $invalid
					if( ngmResetForm.$invalid ){
						// set submitted for validation
						ngmResetForm.$setSubmitted();
					} else {

						// user toast msg
						$timeout(function(){

							// Materialize.toast($filter('translate')('your_email_is_being_prepared'), 6000, 'note');
							M.toast({ html: $filter('translate')('your_email_is_being_prepared'), displayLength: 6000, classes: 'note' });

						}, 400);

						// resend password email
						ngmAuth.passwordResetSend({
								user: $scope.panel.user,
								url: ngmAuth.LOCATION + '/desk/#/cluster/find/'
							}).success( function( result ) {

								// go to password reset page
								$( '.carousel' ).carousel( 'prev' );

								// user toast msg
								$timeout(function(){

									// Materialize.toast($filter('translate')('email_sent_please_check_your_inbox'), 6000, 'success');
									M.toast({ html: $filter('translate')('email_sent_please_check_your_inbox'), displayLength: 6000, classes: 'success' });
								}, 400);

							}).error(function( err ) {

								// set err
								$scope.panel.err = err;

								// update
								$timeout(function(){
									// Materialize.toast( err.msg, 6000, 'error' );
									M.toast({ html: err.msg, displayLength: 6000, classes: 'error' });
								}, 400);
							});
					}

				},

				// register fn
				passwordReset: function( ngmResetPasswordForm, token ){

					// if $invalid
					if(ngmResetPasswordForm.$invalid){
						// set submitted for validation
						ngmResetPasswordForm.$setSubmitted();
					} else {

						// register
						ngmAuth.passwordReset({ reset: $scope.panel.user, token: token })
							.success( function( result ) {

							// go to default org page
							$location.path( '/' + result.app_home );

							// user toast msg
							$timeout(function(){

								// Materialize.toast( $filter('translate')('welcome_back')+' ' + + result.username + '!', 6000, 'note' );
								M.toast({ html: $filter('translate')('welcome_back') + ' ' + + result.username + '!' , displayLength: 6000, classes: 'note' });
							}, 2000);


						}).error(function(err) {
							// update
							$timeout(function(){
								// Materialize.toast( err.msg, 6000, 'error' );
								M.toast({ html: err.msg , displayLength: 6000, classes: 'error' });
							}, 1000);
						});
					}

				},

				// RnR chapter validation
				organizationDisabled: function(){

					var disabled = true;
					if ( $scope.panel.user && $scope.panel.user.admin0pcode && $scope.panel.user.cluster_id && $scope.panel.user.organization_name ) {
						// not R&R Chapter
						if ( $scope.panel.user.cluster_id !== 'rnr_chapter' ) {
							disabled = false;
						} else {
							if ( $scope.panel.user.organization === 'UNHCR' || $scope.panel.user.organization === 'IOM' ) {
								disabled = false;
							} else {
								disabled = true;
							}
						}
					}
					return disabled;
				},

				// select org
				onOrganizationSelected: function(){
					// filter
					$scope.select = $filter( 'filter' )( $scope.panel.organizations, { organization: $scope.panel.user.organization }, true );
					// merge org
					var org = angular.copy( $scope.select[0] );
					delete org.id;
					delete org.admin0pcode;
					angular.merge( $scope.panel.user, org );

					// update home page for iMMAP Ethiopia
					if ( $scope.panel.user.organization === 'iMMAP' ) {
						// add defaults as admin
						// $scope.panel.user.app_home = '/immap/';
						$scope.panel.user.app_home = '/cluster/admin/' + $scope.panel.user.adminRpcode.toLowerCase() + '/' + $scope.panel.user.admin0pcode.toLowerCase();
						$scope.panel.user.roles = [ 'COUNTRY_ADMIN', 'USER' ];

					} else {
						delete $scope.panel.user.app_home;
					}

				},


				//manage user access
				manageUserAccess:function (id) {

					if (document.getElementById(id).checked){
						var values = document.getElementById(id).value;
						if($scope.panel.user.roles.indexOf(values)=== -1){
							$scope.panel.user.roles.push(values);
							// set landing page to admin
							if ( user.roles.length > 1 ) {
								user.app_home = '/cluster/admin/';
							}
							// set landing page to org
							if ( user.roles.length === 1 && user.roles.indexOf( 'USER' ) !== -1 ) {
								user.app_home = '/cluster/organization/';
							}
						}
					} else{
						var values = document.getElementById(id).value;
						if ($scope.panel.user.roles.indexOf(values) > -1) {
							var index =$scope.panel.user.roles.indexOf(values);
							$scope.panel.user.roles.splice(index,1);
							// set landing page to org
							if ( user.roles.length === 1 && user.roles.indexOf( 'USER' ) !== -1 ) {
								user.app_home = '/cluster/organization/';
							}
						}
					}
				},

				// manage user cluster
				manageUserCluster:function(id) {
					if (document.getElementById(id).checked) {
						var values = document.getElementById(id).value;
						$scope.panel.user.cluster_id= values;
						$scope.panel.user.cluster = $scope.panel.cluster[values].cluster;
					}else{
						document.getElementById(id).checked=true;
					}
				},

				// manage user country
				manageUserCountry: function (id) {
					if (document.getElementById(id).checked) {
					var values = document.getElementById(id).value;
					$scope.panel.user.admin0name=$scope.panel.adminRegion[values].admin0name
					$scope.panel.user.admin0pcode=$scope.panel.adminRegion[values].admin0pcode
					$scope.panel.user.adminRname=$scope.panel.adminRegion[values].adminRname
					$scope.panel.user.adminRpcode=$scope.panel.adminRegion[values].adminRpcode
					}else{
						document.getElementById(id).checked = true;
					}
				},

				setPrivateProfile:function(id){
					if (document.getElementById(id).checked) {
						$scope.panel.user.anonymous = true;
					}else{
						$scope.panel.user.anonymous = false;
					}

					M.toast({ html: 'To Save Changes in Your Profile, Click Update Button', displayLength: 6000, classes: 'note' });
				}

			}

			// init page
			$scope.panel.init();

			// on page load
			angular.element(document).ready(function () {

				// give a few seconds to render
				$timeout(function() {

					// on change update icon color
					$( '#ngm-country' ).on( 'change', function() {
						if( $( this ).find( 'option:selected' ).text() ) {
							$( '.country' ).css({ 'color': 'teal' });
							// $( 'select' ).material_select();
							$('select').formSelect();
						}
					});

					// on change update icon color
					$( '#ngm-cluster' ).on( 'change', function() {
						if ( $( this ).find( 'option:selected' ).text() ) {
							$( '.cluster' ).css({ 'color': 'teal' });
						}
					});

				}, 900 );

			});

		}

]);
