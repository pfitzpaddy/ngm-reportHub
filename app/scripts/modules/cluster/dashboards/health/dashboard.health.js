/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller( 'DashboardHealthCtrl', [
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
			'ngmAuth',
			'ngmData',
			'$translate','$filter',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData,$translate ,$filter) {
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

				// lists
				admin1List: localStorage.getObject( 'lists' ) ? localStorage.getObject( 'lists' ).admin1List : [],
				admin2List: localStorage.getObject( 'lists' ) ? localStorage.getObject( 'lists' ).admin2List : [],

				// dashboard data
				data: {
					// menu
					menu_regions: {
						'hq': { adminRpcode: 'hq', adminRname: 'GLOBAL', admin0pcode: 'all' },
						'afro': { adminRpcode: 'afro', adminRname: 'AFRO', admin0pcode: 'all' },
						'emro': { adminRpcode: 'emro', adminRname: 'EMRO', admin0pcode: 'all' }
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

				// get print/export
				getReportRequest: function( indicator ){

					// request
					return {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/health/indicator',
						data: {
							cluster_id: 'health',
							report: 'health_' + indicator + '_' + $scope.dashboard.report,
							details: indicator,
							start_date: $scope.dashboard.startDate,
							end_date: $scope.dashboard.endDate,
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							organization_tag: $scope.dashboard.organization_tag,
							admin1pcode: $scope.dashboard.admin1pcode,
							admin2pcode: $scope.dashboard.admin2pcode,
							project_type: $scope.dashboard.project_type,
							beneficiary_type: $scope.dashboard.beneficiary_type
						}
					};
				},

				// get metrics 
				getMetricsRequest: function( format, indicator ){

					//
					return {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							cluster_id: 'health',
							organization: $scope.dashboard.user.organization,
							username: $scope.dashboard.user.username,
							email: $scope.dashboard.user.email,
							dashboard: 'health_4w',
							theme: indicator,
							format: format,
							url: $location.$$path
						}
					}
				},

				// get by indicator, extend by obj
				getIndicatorRequest: function( indicator, obj ){

					// request
					var request = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/health/indicator',
						data: {
							cluster_id: 'health',
							indicator: indicator,
							start_date: $scope.dashboard.startDate,
							end_date: $scope.dashboard.endDate,
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							organization_tag: $scope.dashboard.organization_tag,
							admin1pcode: $scope.dashboard.admin1pcode,
							admin2pcode: $scope.dashboard.admin2pcode,
							project_type: $scope.dashboard.project_type,
							beneficiary_type: $scope.dashboard.beneficiary_type
						}
					}

					// extend query
					request.data = angular.merge( request.data, obj );

					// return
					return request;	

				},

        // set URL based on user rights
				setUrl: function(){

					// user URL
					var path = '/cluster/health/4w/' + $scope.dashboard.user.adminRpcode.toLowerCase() +
															 '/' + $scope.dashboard.user.admin0pcode.toLowerCase() + 
															 '/' + $route.current.params.organization_tag + 
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
						var path = '#/cluster/health/4w/' + key + 
															 '/all' +
															 '/' + $route.current.params.organization_tag +  
															 '/all' + 
															 '/all' +
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;

						// row
						rows.push({
							'title': d.adminRname,
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
						var path = '#/cluster/health/4w/' + $route.current.params.adminR + 
															 '/' + d.admin0pcode +
															 '/' + $route.current.params.organization_tag + 
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
								url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
								data: {
									list: true,
									cluster_id: 'health',
									indicator: 'organizations',
									organization_tag: 'all', 
									report_type: 'activity',
									adminRpcode: $route.current.params.adminR,
									admin0pcode: $route.current.params.admin0,
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
								}
							};

					// fetch org list
					ngmData.get( request ).then( function( organizations  ){

						// for each
						organizations.forEach(function( d, i ){

						// URL path
						var path = '#/cluster/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + d.organization_tag +
															 '/' + $route.current.params.admin1 +
															 '/' + $route.current.params.admin2 +
															 '/' + $route.current.params.project + 
															 '/' + $route.current.params.beneficiaries + 
															 '/' + $scope.dashboard.startDate + 
															 '/' + $scope.dashboard.endDate;

							// update title to organization
							if ( $route.current.params.organization_tag === d.organization_tag && d.organization_tag !== 'all' ) {
								$scope.model.header.title.title += ' | ' + d.organization;
								$scope.model.header.subtitle.title += ', ' + d.organization + ' organization';
							}

							// menu rows
							rows.push({
								'title': d.organization,
								'param': 'organization_tag',
								'active': d.organization_tag,
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
							rows = [];

					// filter admin1 data object
					$scope.dashboard.data.admin1 = 
 									$filter( 'filter' )( $scope.dashboard.admin1List, 
                  				{ admin0pcode: $route.current.params.admin0.toUpperCase() }, true );

					// for each admin1, add to menu
					angular.forEach( $scope.dashboard.data.admin1, function( d, key ){

						// URL path
						var path = '#/cluster/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + $route.current.params.organization_tag + 
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
						// filter
						var admin1 = $filter( 'filter' )( $scope.dashboard.data.admin1, 
                  				{ admin1pcode: $route.current.params.admin1 }, true );
						
						// update model title/subtitle
						$scope.model.header.title.title += ' | ' + admin1[0].admin1name;
						$scope.model.header.subtitle.title += ', ' + admin1[0].admin1name + ' ' + admin1[0].admin1type_name;
					}

				},

				// get admin2 rows
				setAdmin2Rows: function(){

					// menu rows
					var active,
							rows = [];

					// filter admin1 data object
					$scope.dashboard.data.admin2 =
 									$filter( 'filter' )( $scope.dashboard.admin2List, 
                  				{ admin1pcode: $route.current.params.admin1 }, true );

					// for each admin1
					angular.forEach( $scope.dashboard.data.admin2, function( d, key ){

						// URL path
						var path = '#/cluster/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + $route.current.params.organization_tag + 
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
						// filter
						var admin2 = $filter( 'filter' )(  $scope.dashboard.data.admin2, 
                  				{ admin2pcode: $route.current.params.admin2 }, true );

						// update model TITLE/SUBTITLE
						$scope.model.header.title.title += ' | ' + admin2[0].admin2name;
						$scope.model.header.subtitle.title += ', ' + admin2[0].admin2name + ' ' + admin2[0].admin2type_name;
					}

				},

				// return row of beneficiaries
				getBeneficiariesRows: function() {
					
					// menu rows
					var active,
							rows = [];
							
					// for each district
					angular.forEach( $scope.dashboard.data.beneficiary_type, function( d, key ){

						// URL path
						var path = '#/cluster/health/4w/' + $route.current.params.adminR + 
															 '/' + $route.current.params.admin0 +
															 '/' + $route.current.params.organization_tag + 
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
					$scope.dashboard.organization_tag = $route.current.params.organization_tag;
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
									style: 'float:left;',
									label: 'from',
									format: 'd mmm, yyyy',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
											// URL
											var path = '/cluster/health/4w/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 + 
																					 '/' + $route.current.params.organization_tag + 
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
									style: 'float:right',
									label: 'to',
									format: 'd mmm, yyyy',
									min: $scope.dashboard.startDate,
									currentTime: $scope.dashboard.endDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.endDate ) {
											// set new date
											$scope.dashboard.endDate = date;
											// URL
											var path = '/cluster/health/4w/' + $route.current.params.adminR + 
																					 '/' + $route.current.params.admin0 + 
																					 '/' + $route.current.params.organization_tag + 
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
										url: ngmAuth.LOCATION + '/api/print',
										data: {
											cluster_id: 'health',
											report: $scope.dashboard.report,
											printUrl: $location.absUrl(),
											downloadUrl: ngmAuth.LOCATION + '/report/',
											user: $scope.dashboard.user,
											viewportWidth: 1390,
											pageLoadTime: 16400
										}
									},						
									metrics: $scope.dashboard.getMetricsRequest( 'pdf', 'health_4w' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'call',
									hover: 'Download Health Cluster Contact List as CSV',
									request: {
										method: 'POST',
										url: ngmAuth.LOCATION + '/api/health/data/contacts',
										data: {
											report: 'health_contacts_' + $scope.dashboard.report
										}
									},
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_contacts' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'assignment_turned_in',
									hover: 'Download Health Project Progress Report as CSV',
									request: $scope.dashboard.getReportRequest( 'projects' ),
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_details' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'attach_money',
									hover: 'Download Health Financial Report CSV',
									request: $scope.dashboard.getReportRequest( 'financial' ),
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_financial' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'location_on',
									hover: 'Download Health Beneficiaries by District as CSV',
									request: $scope.dashboard.getReportRequest( 'locations' ),
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_locations' )
								},{
									type: 'csv',
									color: 'blue lighten-2',
									icon: 'local_hospital',
									hover: 'Download Health Beneficiaries by Health Facility as CSV',
									request: $scope.dashboard.getReportRequest( 'health_facility' ),
									metrics: $scope.dashboard.getMetricsRequest( 'csv', 'health_facility' )
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
										html: '<a class="waves-effect waves-light btn left hide-on-small-only" href="#/cluster/projects"><i class="material-icons left">keyboard_return</i>Back to Projects</a><a class="waves-effect waves-light btn right" href="#/cluster/health/4w"><i class="material-icons left">cached</i>Reset Dashboard</a>'
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
							// 					organization_tag: $scope.dashboard.organization_tag,
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
										request: $scope.dashboard.getIndicatorRequest( 'partners', { project_status: 'active' } )
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
										request: $scope.dashboard.getIndicatorRequest( 'projects', { project_status: 'active' } )
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: 'Completed Projects for ( ' + $scope.dashboard.projectTitle + ' )',
										request: $scope.dashboard.getIndicatorRequest( 'projects', { project_status: 'complete' } )
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
										request: $scope.dashboard.getIndicatorRequest( 'beneficiaries', {} )
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
												request: $scope.dashboard.getIndicatorRequest( 'under5', {} )
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
												request: $scope.dashboard.getIndicatorRequest( 'over5', {} )
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
										request: $scope.dashboard.getIndicatorRequest( 'locations', { unique: false, conflict: false } )
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
										request: $scope.dashboard.getIndicatorRequest( 'locations', { unique: true, conflict: false } )
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
										request: $scope.dashboard.getIndicatorRequest( 'locations', { unique: true, conflict: true } )
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
				                request: $scope.dashboard.getIndicatorRequest( 'facilities', {} )
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
										request: $scope.dashboard.getIndicatorRequest( 'markers', {} )
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

			// if registered user
			if ( !ngmUser.get().guest ) {
				
				// set dashboard
				$scope.dashboard.setDashboard();

				// set dashboard menu
				$scope.dashboard.setMenu();

			} else {
				
				// not first refresh
				if ( ngmUser.get().visits !== 1 ) {

						// global / region
						if ( $route.current.params.admin0 === 'all' ) {
							angular.merge( $scope.dashboard.user, $scope.dashboard.data.menu_regions[ $route.current.params.adminR ] );	
						}

						// country selection
						if ( $route.current.params.admin0 !== 'all' ) {
							angular.merge( $scope.dashboard.user, $scope.dashboard.data.admin_region[ $route.current.params.admin0.toUpperCase() ] );	
						}
						
						// add visit
						$scope.dashboard.user.visits++;

						// update guest
						ngmUser.set( $scope.dashboard.user );

						// set dashboard with guest user
						$scope.dashboard.setDashboard();

						// set dashboard menu
						$scope.dashboard.setMenu();

				} else {

				// lists
				var requests = {
					ipApi: 'http://ip-api.com/json',
					getAdmin1List: ngmAuth.LOCATION + '/api/list/getAdmin1List',
					getAdmin2List: ngmAuth.LOCATION + '/api/list/getAdmin2List'
				}

				// send request
				$q.all([ 
					$http.get( requests.ipApi ),
					$http.get( requests.getAdmin1List ), 
					$http.get( requests.getAdmin2List ) ]).then( function( results ) {

						// set dashboard lists
						ipApi = results[0].data;
						$scope.dashboard.admin1List = results[1].data;
						$scope.dashboard.admin2List = results[2].data;

						// set in localstorage
						localStorage.setObject( 'lists', { admin1List: results[1].data, admin2List: results[2].data } );

						// update guest location
						angular.merge( $scope.dashboard.user, $scope.dashboard.data.admin_region[ ipApi.countryCode ] );

						// add visit
						$scope.dashboard.user.visits++;

						// update guest
						ngmUser.set( $scope.dashboard.user );

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