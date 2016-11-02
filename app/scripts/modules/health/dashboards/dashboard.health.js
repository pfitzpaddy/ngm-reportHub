/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardHealthProjectsCtrl', [
			'$scope', 
			'$q', 
			'$http', 
			'$location', 
			'$route',
			'$rootScope',
			'$window', 
			'$timeout', 
			'$filter', 
			'ngmUser', 
			'ngmData', 
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmData ) {
			this.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];

			// empty model
			$scope.model = {
				rows: [{}]
			};		

			// create dews object
			$scope.dashboard = {
				
				// parent
				ngm: $scope.$parent.ngm,
				
				// current user
				user: ngmUser.get(),

				// report start
				startDate: moment( $route.current.params.start) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),
				
				// current report
				report: 'report' + $location.$$path.replace(/\//g, '_') + '-extracted-',

				// dashboard data
				data: {
					// menu
					menu_regions: {
						'hq': 'GLOBAL',
						'afro': 'AFRO',
						'emro': 'EMRO',
					},
					// admin regions
					admin_region: {
	          'AF': { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'AF', admin0name: 'Afghanistan', admin1type_name: 'Province', admin2type_name: 'District' },
	          'ET': { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'ET', admin0name: 'Ethiopia', admin1type_name: 'Region', admin2type_name: 'Wordea' },
	          'IQ': { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'IQ', admin0name: 'Iraq', admin1type_name: 'Governate', admin2type_name: 'District' },
	          'KE': { adminRpcode: 'AFRO', adminRname: 'AFRO', admin0pcode: 'KE', admin0name: 'Kenya', admin1type_name: 'County', admin2type_name: 'Constituency' },
	          'SO': { adminRpcode: 'EMRO', adminRname: 'EMRO', admin0pcode: 'SO', admin0name: 'Somalia', admin1type_name: 'Region', admin2type_name: 'District' },
	        },
	        country_regions: {
						'afro': [{ 
		        		admin0pcode: 'ET', admin0name: 'Ethiopia', admin1type_name: 'Region', admin2type_name: 'Wordea'
		        	},{
		        		admin0pcode: 'KE', admin0name: 'Kenya', admin1type_name: 'County', admin2type_name: 'Constituency'
		        	}],
	        	'emro': [{ 
		        		admin0pcode: 'AF', admin0name: 'Afghanistan', admin1type_name: 'Province', admin2type_name: 'District'
		        	},{
		        		admin0pcode: 'IQ', admin0name: 'Iraq', admin1type_name: 'Governate', admin2type_name: 'District'
		        	},{
		        		admin0pcode: 'SO', admin0name: 'Somalia', admin1type_name: 'Region', admin2type_name: 'District'
		        	}]
	        },
	        admin1: {},
	        // project					
					project_type: {
						'all': 'All PROJECTS',
						'capacity_building': 'Capacity Building of Health Staff',
						'cardio_health': 'Cardio Health',
						'community_health': 'Community Health',
						'donation': 'Donation',
						'health_education': 'Health Education',
						'outbreak_response': 'Outbreak Response',
						'phc': 'PHC',
						'physical_rehabilitation': 'Physical Rehabilitation',
						'psycho_social': 'Psycho Social',
						'trauma_care': 'Trauma Care',
						'other': 'Other'
					},
					// beneficiary
					beneficiary_type: {
						'all': 'All BENEFICIARIES',
						'conflict_displaced': 'Conflict IDPs',
	          'health_affected_conflict': 'Health Affected by Conflict',
	          'training': 'Health Education',
	          'natural_disaster_affected': 'Natural Disaster IDPs',
	          'refugees_returnees': 'Refugees & Returnees',
	          'white_area_population': 'White Area Population'
					}
				},

        // set URL based on user rights
				setUrl: function(){

					// user URL
					var path = '/health/4w/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
															 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() + 
															 '/' + $route.current.params.organization_id + 
															 '/' + $route.current.params.admin1 + 
															 '/' + $route.current.params.admin2 + 
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;
					
					// if current location is not equal to path 
					if ( path !== $location.$$path ) {
						// 
						$location.path( path );
					}

				},

				// set dashboard title
				setTitle: function() {
					
					// default
					$scope.dashboard.title = 'H4W | ' + $scope.dashboard.user.adminRname.toUpperCase();

					// admin0
					if ( $route.current.params.admin0 !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.user.admin0name.toUpperCase().substring(0, 3);
					}

					// admin1
					// if ( $route.current.params.admin1 !== 'all' ) {
					// 	$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin1[ $route.current.params.admin1 ];
					// }

					// // admin2
					// if ( $route.current.params.admin2 !== 'all' ) {
					// 	$scope.dashboard.title += ' | ' + $route.current.params.admin2;
					// }

				},

				// set dashboard title
				setSubtitle: function() {
					
					// default
					$scope.dashboard.subtitle = 'Health Cluster 4W dashboard for ' + String( $scope.dashboard.data.beneficiary_type[ $scope.dashboard.beneficiary_type ] ).toUpperCase();

					// admin0
					if ( $scope.dashboard.user.admin0pcode !== 'ALL' ) {
						$scope.dashboard.subtitle += ' in ' + $scope.dashboard.user.admin0name;
					}

					// admin1
					// if ( $route.current.params.admin1 !== 'all' ) {
					// 	$scope.dashboard.subtitle += ', ' + $route.current.params.admin1 + ' ' + $scope.dashboard.user.admin1type_name;
					// }

					// // admin2
					// if ( $route.current.params.admin2 !== 'all' ) {
					// 	$scope.dashboard.subtitle += ', ' + $route.current.params.admin2  + ' ' + $scope.dashboard.user.admin2type_name;
					// }

				},

				// set project title by project type
				setProjectsTitle: function() {
					
					// projects stats title
					$scope.dashboard.projectTitle = '';

					// foreach type
					angular.forEach( $scope.dashboard.project_type, function( d, i ){
						$scope.dashboard.projectTitle += $scope.dashboard.data.project_type[ d ] + ', ';
					});

					// remove last 2 characters
					$scope.dashboard.projectTitle = $scope.dashboard.projectTitle.slice( 0, -2 );
				},

				// set project title by project type
				setBeneficiariesTitle: function() {
					
					// beneficaries stats title
					$scope.dashboard.beneficiariesTitle = '';

					// foreach type		
					angular.forEach( $scope.dashboard.beneficiary_type, function( d, i ){
						$scope.dashboard.beneficiariesTitle += $scope.dashboard.data.beneficiary_type[d] + ', ';
					});

					// remove last 2 characters
					$scope.dashboard.beneficiariesTitle = $scope.dashboard.beneficiariesTitle.slice( 0, -2 );			

				},

				// get region rows
				getRegionRows: function(){

					// menu rows
					var active,
							rows = [];
							
					// for each region
					angular.forEach( $scope.dashboard.data.menu_regions, function( d, key ){

						// URL path
						var path = '#/health/4w/' + key + 
															 '/all' +
															 '/' + $route.current.params.organization_id +  
															 '/all' + 
															 '/all' +
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;

						// row
						rows.push({
							'title': d,
							'param': 'adminR',
							'active': key,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': path
						});
					});

					return rows;

				},

				// get country rows
				getCountryRows: function(){

					// menu rows
					var active,
							rows = [];
							
					// for each country in region
					angular.forEach( $scope.dashboard.data.country_regions[ $route.current.params.adminR ], function( d, key ){

						// URL path
						var path = '#/health/4w/' + $route.current.params.adminR + 
															 '/' + d.admin0pcode +
															 '/' + $route.current.params.organization_id + 
															 '/all' + 
															 '/all' +
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;

						if ( $scope.dashboard.user.guest ) {
							// row
							rows.push({
								'title': d.admin0name,
								'param': 'admin0',
								'active': d.admin0pcode.toLowerCase(),
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							});
						} else if ( !$scope.dashboard.user.guest && d.admin0pcode.toLowerCase() === $route.current.params.admin0 ) {
							// row
							rows.push({
								'title': d.admin0name,
								'param': 'admin0',
								'active': d.admin0pcode.toLowerCase(),
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							});							
						}

					});

					return rows;

				},

				// get country rows
				setOrganizationRows: function(){

					// menu rows
					var rows = [],
							request = {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/admin/indicator',
								data: {
									list: true,
									indicator: 'organizations',
									organization: 'all', 
									adminRpcode: $route.current.params.adminR,
									admin0pcode: $route.current.params.admin0,
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
								}
							};

					// fetch org list
					ngmData.get( request ).then( function( organizations  ){

						// filter
						organizations = $filter( 'orderBy' )( organizations, 'organization' );

						// add all
						organizations.unshift({
							organization_id: 'all',
							organization: 'ALL',
						})

						// for each
						organizations.forEach(function( d, i ){

						// URL path
						var path = '#/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + d.organization_id +
															 '/' + $route.current.params.admin1 +
															 '/' + $route.current.params.admin2 +
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;

							// update title to organization
							if ( $route.current.params.organization_id === d.organization_id && d.organization_id !== 'all' ) {
								$scope.model.header.title.title += ' | ' + d.organization;
								$scope.model.header.subtitle.title += ', ' + d.organization + ' organization';
							}

							// menu rows
							rows.push({
								'title': d.organization,
								'param': 'organization_id',
								'active': d.organization_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							});

						});

					});
	
					// add to menu
					$scope.model.menu.push({
						'search': true,
						'id': 'search-health-organization',
						'icon': 'group',
						'title': 'Organization',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					});

				},

				// get admin1 rows
				setAdmin1Rows: function(){

					// menu rows
					var active,
							rows = [],
							request = {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/location/getAdmin1List',
								data: {
									admin0pcode: $route.current.params.admin0
								}
							};

					// set admin1 data object
					$scope.dashboard.data.admin1 = {};

					// fetch admin1 list
					ngmData.get( request ).then( function( admin1  ){

						// for each admin1
						angular.forEach( admin1, function( d, key ){

							// set object
							$scope.dashboard.data.admin1[ d.admin1pcode ] = { admin1pcode: d.admin1pcode, admin1name: d.admin1name, admin1type_name: d.admin1type_name, admin1lat: d.admin1lat, admin1lng: d.admin1lng, admin1zoom: d.admin1zoom };

							// URL path
							var path = '#/health/4w/' + $route.current.params.adminR + 
																 '/' + $route.current.params.admin0 +
																 '/' + $route.current.params.organization_id + 
																 '/' + d.admin1pcode +
																 '/all' +
																 '/' + $route.current.params.project + 
																 '/' + $route.current.params.beneficiaries + 
																 '/' + $scope.dashboard.startDate + 
																 '/' + $scope.dashboard.endDate;

							// row
							rows.push({
								'title': d.admin1name,
								'param': 'admin1',
								'active': d.admin1pcode,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							});

						});

						// push on to menu
						$scope.model.menu.push({
							'search': true,
							'id': 'search-health-admin1',
							'icon': 'location_on',
							'title': $scope.dashboard.data.admin_region[ $route.current.params.admin0.toUpperCase() ].admin1type_name,
							'class': 'teal lighten-1 white-text',
							'rows': rows
						});

						// add beneficiaries to side menu
						if ( $route.current.params.admin1 === 'all' ) {
							// beneficiaries
							$scope.dashboard.getBeneficiariesRows();

						} else {
							// update model TITLE/SUBTITLE
							$scope.model.header.title.title += ' | ' + $scope.dashboard.data.admin1[ $route.current.params.admin1 ].admin1name;
							$scope.model.header.subtitle.title += ', ' + $scope.dashboard.data.admin1[ $route.current.params.admin1 ].admin1name + ' ' + $scope.dashboard.data.admin1[ $route.current.params.admin1 ].admin1type_name;

						}

					});

				},

				// get admin2 rows
				setAdmin2Rows: function(){

					// menu rows
					var active,
							rows = [],
							request = {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/location/getAdmin2List',
								data: {
									admin0pcode: $route.current.params.admin0
								}
							};

					// set admin1 data object
					$scope.dashboard.data.admin2 = {};

					// fetch admin1 list
					ngmData.get( request ).then( function( admin2  ){

						// filter the admin2 by admin1
						admin2 = $filter('filter')( admin2, { admin1pcode: $route.current.params.admin1 }, true );
	
						// for each admin1
						angular.forEach( admin2, function( d, key ){

							// set object
							$scope.dashboard.data.admin2[ d.admin2pcode ] = { admin2pcode: d.admin2pcode, admin2name: d.admin2name, admin2type_name: d.admin2type_name, admin2lat: d.admin2lat, admin2lng: d.admin2lng, admin2zoom: d.admin2zoom };

							// URL path
							var path = '#/health/4w/' + $route.current.params.adminR + 
																 '/' + $route.current.params.admin0 +
																 '/' + $route.current.params.organization_id + 
																 '/' + $route.current.params.admin1 +
																 '/' + d.admin2pcode + 
																 '/' + $route.current.params.project + 
																 '/' + $route.current.params.beneficiaries + 
																 '/' + $scope.dashboard.startDate + 
																 '/' + $scope.dashboard.endDate;

							// row
							rows.push({
								'title': d.admin2name,
								'param': 'admin2',
								'active': d.admin2pcode,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': path
							});

						});

						// push on to menu
						$scope.model.menu.push({
							'search': true,
							'id': 'search-health-admin2',
							'icon': 'location_on',
							'title': $scope.dashboard.data.admin_region[ $route.current.params.admin0.toUpperCase() ].admin2type_name,
							'class': 'teal lighten-1 white-text',
							'rows': rows
						});

						// beneficiaries
						$scope.dashboard.getBeneficiariesRows();						

						// add beneficiaries to side menu
						if ( $route.current.params.admin2 !== 'all' ) {
							// update model TITLE/SUBTITLE
							$scope.model.header.title.title += ' | ' + $scope.dashboard.data.admin2[ $route.current.params.admin2 ].admin2name;
							$scope.model.header.subtitle.title += ', ' + $scope.dashboard.data.admin2[ $route.current.params.admin2 ].admin2name + ' ' + $scope.dashboard.data.admin2[ $route.current.params.admin2 ].admin2type_name;

						}

					});

				},

				// return row of beneficiaries
				getBeneficiariesRows: function() {
					
					// menu rows
					var active,
							rows = [];
							
					// for each district
					angular.forEach( $scope.dashboard.data.beneficiary_type, function( d, key ){

						// URL path
						var path = '#/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + $route.current.params.organization_id + 
															 '/' + $route.current.params.admin1 +
															 '/' + $route.current.params.admin2 +
															 '/' + $route.current.params.project + 
															 '/' + key + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;
						
						// rows
						rows.push({
							'title': d,
							'param': 'beneficiaries',
							'active': key,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': path
						});
					});

					// add menu for beneficiaries
					$scope.model.menu.push({
						'search': false,
						'icon': 'person_pin_circle',
						'title': 'Beneficiaries',
						'class': 'teal lighten-1 white-text',
						'rows': rows
					});
				},

				// set navigation menu
				setMenu: function() {

					// hq/region level
					if( $scope.dashboard.user.guest ){
						$scope.model.menu.push({
							// 'search': true,
							'id': 'search-health-adminR',
							'icon': 'language',
							'title': 'Region',
							'class': 'teal lighten-1 white-text',
							'rows': $scope.dashboard.getRegionRows()
						});
					}

					// country level
					if( $route.current.params.adminR !== 'hq' ){
						// country
						$scope.model.menu.push({
							// 'search': true,
							'id': 'search-health-admin0',
							'icon': 'public',
							'title': 'Country',
							'class': 'teal lighten-1 white-text',
							'rows': $scope.dashboard.getCountryRows()
						});						
					} else {
						// beneficiaries
						$scope.dashboard.getBeneficiariesRows();						
					}

					// admin1 levels
					if( $route.current.params.admin0 !== 'all' ){

						// get organizations
						$scope.dashboard.setOrganizationRows();

						// makes request and sets rows & TITLES
						$scope.dashboard.setAdmin1Rows();

					} else {
						// beneficiaries
						$scope.dashboard.getBeneficiariesRows();						
					}

					// admin2 levels
					if( $route.current.params.admin1 !== 'all' ){
						// makes request and sets rows & TITLES
						$scope.dashboard.setAdmin2Rows();
					}

					// assign to ngm app scope (for menu)
					$scope.dashboard.ngm.dashboard.model = $scope.model;

				},

				// set dashboard
				setDashboard: function(){

					// variables
					$scope.dashboard.adminRpcode = $route.current.params.adminR;
					$scope.dashboard.admin0pcode = $route.current.params.admin0;
					$scope.dashboard.organization_id = $route.current.params.organization_id;
					$scope.dashboard.admin1pcode = $route.current.params.admin1;
					$scope.dashboard.admin2pcode = $route.current.params.admin2;
					$scope.dashboard.project_type = $route.current.params.project.split('+');
					$scope.dashboard.beneficiary_type = $route.current.params.beneficiaries.split('+');
					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );
				
					// set dashboard URL
					$scope.dashboard.setUrl();

					//  set title
					$scope.dashboard.setTitle();

					//  set subtitle
					$scope.dashboard.setSubtitle();

					//  set project type title
					$scope.dashboard.setProjectsTitle();

					//  set beneficiaries type title
					$scope.dashboard.setBeneficiariesTitle();
					
					// model
					$scope.model = {
						name: 'health_4w_dashboard',
						header: {
							div: {
								'class': 'col s12 m12 l12 report-header',
								'style': 'border-bottom: 3px ' + $scope.dashboard.ngm.style.defaultPrimaryColor + ' solid;'
							},
							title: {
								'class': 'col s12 m8 l8 report-title truncate',
								'style': 'font-size: 3.4rem; color: ' + $scope.dashboard.ngm.style.defaultPrimaryColor,
								'title': $scope.dashboard.title,
							},
							subtitle: {
								'class': 'col hide-on-small-only m8 l9 report-subtitle truncate',
								'title': $scope.dashboard.subtitle,
							},
							datePicker: {
								'class': 'col s12 m4 l3',
								dates: [{
									'class': 'ngm-date',
									style: 'float:left;',
									label: 'from',
									format: 'd mmm, yyyy',
									time: $scope.dashboard.startDate,
									onSelection: function(){

										// set date
										var date = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

										// if not valid
										if ( date > $scope.dashboard.endDate ) {
											Materialize.toast('Please check the dates and try again!', 4000);

										// if updated
										} else if ( $scope.dashboard.startDate !== date ) {

											// start date
											$scope.dashboard.startDate = date;

											// URL
											var path = '/health/4w/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 + 
																					 '/' + $route.current.params.organization_id + 
																					 '/' + $route.current.params.admin1 + 
																					 '/' + $route.current.params.admin2 + 
																					 '/' + $route.current.params.project + 
																					 '/' + $route.current.params.beneficiaries + 
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path );

										}

									}
								},{
									'class': 'ngm-date',
									style: 'float:right',
									label: 'to',
									format: 'd mmm, yyyy',
									time: $scope.dashboard.endDate,
									onSelection: function(){
										
										// set date
										var date = moment( new Date( this.time ) ).format( 'YYYY-MM-DD' );

										// if not valid
										if ( $scope.dashboard.startDate > date ) {
											Materialize.toast('Please check the dates and try again!', 4000);

										// if updated
										} else if ( $scope.dashboard.endDate !== date ) {

											// start date
											$scope.dashboard.endDate = date;

											// URL
											var path = '/health/4w/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 + 
																					 '/' + $route.current.params.organization_id + 
																					 '/' + $route.current.params.admin1 + 
																					 '/' + $route.current.params.admin2 + 
																					 '/' + $route.current.params.project + 
																					 '/' + $route.current.params.beneficiaries + 
																					 '/' + $scope.dashboard.startDate + 
																					 '/' + $scope.dashboard.endDate;

											// update new date
											$location.path( path );
											
										}								

									}
								}]
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: [{
									type: 'pdf',
									color: 'blue',
									icon: 'picture_as_pdf',
									hover: 'Download Health 4W as PDF',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/print',
										data: {
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: 'http://' + $location.host() + '/report/',
											user: $scope.dashboard.user,
											viewportWidth: 1280,
											pageLoadTime: 7200
										}
									},						
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_4w',
											format: 'pdf',
											url: $location.$$path
										}
									}						
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'call',
									hover: 'Download Health Cluster Contact List as CSV',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/data/contacts',
										data: {
											report: 'contacts_' + $scope.dashboard.report
										}
									},
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_contacts',
											format: 'csv',
											url: $location.$$path
										}
									}
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: 'Download Health Project Progress Report as CSV',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											report: 'health_projects_progress_' + $scope.dashboard.report,
											details: 'projects',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											adminRpcode: $scope.dashboard.adminRpcode,
											admin0pcode: $scope.dashboard.admin0pcode,
											organization_id: $scope.dashboard.organization_id,
											admin1pcode: $scope.dashboard.admin1pcode,
											admin2pcode: $scope.dashboard.admin2pcode,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type
										}
									},
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_details',
											format: 'csv',
											url: $location.$$path
										}
									}
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'attach_money',
									hover: 'Download Health Financial Report CSV',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											report: 'health_financial_' + $scope.dashboard.report,
											details: 'financial',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											adminRpcode: $scope.dashboard.adminRpcode,
											admin0pcode: $scope.dashboard.admin0pcode,
											organization_id: $scope.dashboard.organization_id,
											admin1pcode: $scope.dashboard.admin1pcode,
											admin2pcode: $scope.dashboard.admin2pcode,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type
										}
									},
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_financial',
											format: 'csv',
											url: $location.$$path
										}
									}
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'location_on',
									hover: 'Download Health Beneficiaries by District as CSV',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											report: 'health_beneficiaries_by_district_' + $scope.dashboard.report,
											details: 'locations',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											adminRpcode: $scope.dashboard.adminRpcode,
											admin0pcode: $scope.dashboard.admin0pcode,
											organization_id: $scope.dashboard.organization_id,
											admin1pcode: $scope.dashboard.admin1pcode,
											admin2pcode: $scope.dashboard.admin2pcode,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type
										}
									},
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_locations',
											format: 'csv',
											url: $location.$$path
										}
									}
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'local_hospital',
									hover: 'Download Health Beneficiaries by Health Facility as CSV',
									request: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/health/indicator',
										data: {
											report: 'health_beneficiaries_by_facility_' + $scope.dashboard.report,
											details: 'health_facility',
											start_date: $scope.dashboard.startDate,
											end_date: $scope.dashboard.endDate,
											adminRpcode: $scope.dashboard.adminRpcode,
											admin0pcode: $scope.dashboard.admin0pcode,
											organization_id: $scope.dashboard.organization_id,
											admin1pcode: $scope.dashboard.admin1pcode,
											admin2pcode: $scope.dashboard.admin2pcode,
											project_type: $scope.dashboard.project_type,
											beneficiary_type: $scope.dashboard.beneficiary_type
										}
									},
									metrics: {
										method: 'POST',
										url: 'http://' + $location.host() + '/api/metrics/set',
										data: {
											organization: $scope.dashboard.user.organization,
											username: $scope.dashboard.user.username,
											email: $scope.dashboard.user.email,
											dashboard: 'health_4w',
											theme: 'health_facility',
											format: 'csv',
											url: $location.$$path
										}
									}
								}]
							}							
						},
						menu: [],
						rows: [{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'white grey-text text-darken-2',
									style: 'margin:15px; padding-bottom:30px;',
									config: {
										id: 'dashboard-btn',
										html: '<a class="waves-effect waves-light btn left hide-on-small-only" href="#/health/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><a class="waves-effect waves-light btn right" href="#/health/4w"><i class="material-icons left">cached</i>Reset Dashboard</a>'
									}
								}]
							}]
						},{
							columns: [{
							// 	styleClass: 's12 m12 l4',
							// 	widgets: [{
							// 		type: 'stats',
							// 		style: 'text-align: center;',
							// 		card: 'card-panel stats-card white grey-text text-darken-2',
							// 		config: {
							// 			title: 'Total Health Cluster Partners',
							// 			request: {
							// 				method: 'POST',
							// 				url: 'http://' + $location.host() + '/api/health/indicator',
							// 				data: {
							// 					indicator: 'partners',
							// 					start_date: $scope.dashboard.startDate,
							// 					end_date: $scope.dashboard.endDate,
							// 					adminRpcode: $scope.dashboard.adminRpcode,
							// 					admin0pcode: $scope.dashboard.admin0pcode,
							// 					organization_id: $scope.dashboard.organization_id,
							// 					admin1pcode: $scope.dashboard.admin1pcode,
							// 					admin2pcode: $scope.dashboard.admin2pcode,
							// 					project_type: $scope.dashboard.project_type,
							// 					beneficiary_type: $scope.dashboard.beneficiary_type
							// 				}
							// 			}
							// 		}
							// 	}]
							// },{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Active Health Cluster Partners',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'partners',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_status: 'active',
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Active Projects for ( ' + $scope.dashboard.projectTitle + ' )',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'projects',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_status: 'active',
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Scheduled to Complete for ( ' + $scope.dashboard.projectTitle + ' )',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'projects',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_status: 'complete',
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Beneficiaries ( ' + $scope.dashboard.beneficiariesTitle + ' )',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'beneficiaries',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'highchart',
									style: 'height: 180px;',
									card: 'card-panel chart-stats-card white grey-text text-darken-2',
									config: {
										title: {
											text: 'Children ( Under 5 )'
										},
										display: {
											label: true,
											fractionSize: 1,
											subLabelfractionSize: 0,
											postfix: '%'
										},
										templateUrl: '/scripts/widgets/ngm-highchart/template/promo.html',
										style: '"text-align:center; width: 100%; height: 100%; position: absolute; top: 40px; left: 0;"',
										chartConfig: {
											options: {
												chart: {
													type: 'pie',
													height: 140,
													margin: [0,0,0,0],
													spacing: [0,0,0,0]
												},
												tooltip: {
													enabled: false
												}				
											},
											title: {
													text: '',
													margin: 0
											},
											plotOptions: {
													pie: {
															shadow: false
													}
											},
											series: [{
												name: 'Children (Under 5)',
												size: '100%',
												innerSize: '80%',
												showInLegend:false,
												dataLabels: {
													enabled: false
												},
												request: {
													method: 'POST',
													url: 'http://' + $location.host() + '/api/health/indicator',
													data: {
														indicator: 'under5',
														start_date: $scope.dashboard.startDate,
														end_date: $scope.dashboard.endDate,
														adminRpcode: $scope.dashboard.adminRpcode,
														admin0pcode: $scope.dashboard.admin0pcode,
														organization_id: $scope.dashboard.organization_id,
														admin1pcode: $scope.dashboard.admin1pcode,
														admin2pcode: $scope.dashboard.admin2pcode,
														project_type: $scope.dashboard.project_type,
														beneficiary_type: $scope.dashboard.beneficiary_type
													}
												}
											}]
										}
									}
								}]
							},{
								styleClass: 's12 m12 l6',
								widgets: [{
									type: 'highchart',
									style: 'height: 180px;',
									card: 'card-panel chart-stats-card white grey-text text-darken-2',
									config: {
										title: {
											text: 'Adult ( Over 5 )'
										},
										display: {
											label: true,
											fractionSize: 1,
											subLabelfractionSize: 0,
											postfix: '%'
										},
										templateUrl: '/scripts/widgets/ngm-highchart/template/promo.html',
										style: '"text-align:center; width: 100%; height: 100%; position: absolute; top: 40px; left: 0;"',
										chartConfig: {
											options: {
												chart: {
													type: 'pie',
													height: 140,
													margin: [0,0,0,0],
													spacing: [0,0,0,0]
												},
												tooltip: {
													enabled: false
												}				
											},
											title: {
													text: '',
													margin: 0
											},
											plotOptions: {
													pie: {
															shadow: false
													}
											},
											series: [{
												name: 'Adult (Over 5)',
												size: '100%',
												innerSize: '80%',
												showInLegend:false,
												dataLabels: {
													enabled: false
												},
												request: {
													method: 'POST',
													url: 'http://' + $location.host() + '/api/health/indicator',
													data: {
														indicator: 'over5',
														start_date: $scope.dashboard.startDate,
														end_date: $scope.dashboard.endDate,
														adminRpcode: $scope.dashboard.adminRpcode,
														admin0pcode: $scope.dashboard.admin0pcode,
														organization_id: $scope.dashboard.organization_id,
														admin1pcode: $scope.dashboard.admin1pcode,
														admin2pcode: $scope.dashboard.admin2pcode,
														project_type: $scope.dashboard.project_type,
														beneficiary_type: $scope.dashboard.beneficiary_type
													}
												}
											}]
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">LOCATIONS</h2>'
									}
								}]
							}]							
						},{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Total Health Facilities',
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'locations',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												unique: false,
												conflict: false,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Districts Served',
										display: {
											fractionSize: 0,
											simpleTitle: false,
											subTitlePrefix: 'out of ',
											// subTitlePostfix: ' conflict districts'
										},
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'locations',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												unique: true,
												conflict: false,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Conflict Districts Served',
										display: {
											fractionSize: 0,
											simpleTitle: false,
											subTitlePrefix: 'out of ',
											// subTitlePostfix: ' conflict districts'
										},
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'locations',											
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												unique: true,
												conflict: true,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'highchart',
									style: 'height: 280px;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Facility Type by Location',
										chartConfig: {
											options: {
												chart: {
													type: 'bar',
													height: 260,
												},
												tooltip: {
													pointFormat: '<b>{point.y:,.0f}</b>'
												},
												legend: {
													enabled: false
												}																	
											},
											title: {
												text: ''
											},
											xAxis: {
				                categories: [
				                	'RH', 
				                	'PH', 
				                	'DH',
				                	'CHC',
				                	'BHC',
				                	'FHH',
				                	'SHC',
				                	'MHT',
				                	'FATP',
				                	'DATC',
				                	'Rehabilitation Center',
				                	'Special Hospital',
				                	'BHC + FATP',
				                	'CHC + FATP',
				                ],
												labels: {
													style: {
														fontSize: '12px',
														fontFamily: 'Roboto, sans-serif'
													}
												}
											},
											yAxis: {
												min: 0,
												title: {
													text: 'No. of Facilities'
												}
											},
					            series: [{
				                name: 'Facilities',
				                color: '#7cb5ec',
				                request: {
													method: 'POST',
													url: 'http://' + $location.host() + '/api/health/indicator',
													data: {				                	
														indicator: 'facilities',
														start_date: $scope.dashboard.startDate,
														end_date: $scope.dashboard.endDate,
														adminRpcode: $scope.dashboard.adminRpcode,
														admin0pcode: $scope.dashboard.admin0pcode,
														organization_id: $scope.dashboard.organization_id,
														admin1pcode: $scope.dashboard.admin1pcode,
														admin2pcode: $scope.dashboard.admin2pcode,
														project_type: $scope.dashboard.project_type,
														beneficiary_type: $scope.dashboard.beneficiary_type
													}
				                }
					            }]
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'leaflet',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										height: '490px',
										display: {
											type: 'marker',
											zoomToBounds: true,
											// zoomCorrection: -3
										},
										defaults: {
											zoomToBounds: true
										},
										layers: {
											baselayers: {
												osm: {
													name: 'Mapbox',
													type: 'xyz',
													url: 'https://b.tiles.mapbox.com/v4/aj.um7z9lus/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
													// url: 'https://api.tiles.mapbox.com/v4/fitzpaddy.b207f20f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZml0enBhZGR5IiwiYSI6ImNpZW1vcXZiaTAwMXBzdGtrYmp0cDlkdnEifQ.NCI7rTR3PvN4iPZpt6hgKA',
													layerOptions: {
														continuousWorld: true
													}
												}
											},								
											overlays: {
												health: {
													name: 'Health',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},				
										request: {
											method: 'POST',
											url: 'http://' + $location.host() + '/api/health/indicator',
											data: {
												indicator: 'markers',
												start_date: $scope.dashboard.startDate,
												end_date: $scope.dashboard.endDate,
												adminRpcode: $scope.dashboard.adminRpcode,
												admin0pcode: $scope.dashboard.admin0pcode,
												organization_id: $scope.dashboard.organization_id,
												admin1pcode: $scope.dashboard.admin1pcode,
												admin2pcode: $scope.dashboard.admin2pcode,
												project_type: $scope.dashboard.project_type,
												beneficiary_type: $scope.dashboard.beneficiary_type
											}
										}
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px; height: 90px; padding-top:10px;',
									config: {
										html: $scope.dashboard.ngm.footer
									}
								}]
							}]						
						}]
					}

				}

			};

			// if user
			if ( $scope.dashboard.user && $scope.dashboard.user.adminRpcode ) {

				// set dashboard
				$scope.dashboard.setDashboard();

				// set dashboard menu
				$scope.dashboard.setMenu();

			} else {

				// guest user exists?
				if ( localStorage.getItem( 'guest' ) ) {

					// set user
					$scope.dashboard.user = angular.fromJson( localStorage.getItem( 'guest' ) );

					// set changes from URL
					$scope.dashboard.user.adminRpcode = $route.current.params.adminR;
					$scope.dashboard.user.adminRname = $scope.dashboard.data.menu_regions[ $route.current.params.adminR ];
					$scope.dashboard.user.admin0pcode = $route.current.params.admin0;

					// set dashboard with guest user
					$scope.dashboard.setDashboard();

					// set dashboard menu
					$scope.dashboard.setMenu();

				} else {
				
					// get location
					ngmData.get({
						method: 'GET',
						url: 'http://ip-api.com/json'
					}).then( function( results ){

						// default is global
						$scope.dashboard.user = { adminRpcode: 'HQ', adminRname: 'Global', admin0pcode: 'ALL', admin0name: 'All', guest: true, organization: 'public', username: 'public', email: 'public@gmail.com' },

						// set guest location
						angular.merge( $scope.dashboard.user, $scope.dashboard.data.admin_region[ results.countryCode ] );

						// set 'guest'
						localStorage.setItem( 'guest', JSON.stringify( $scope.dashboard.user ) );

						// set dashboard with guest user
						$scope.dashboard.setDashboard();

						// set dashboard menu
						$scope.dashboard.setMenu();

					});
				}

			}

			// assign to ngm app scope ( for menu )
			$scope.dashboard.ngm.dashboard.model = $scope.model;

		}

	]);