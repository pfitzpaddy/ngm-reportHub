/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:Dashboard4wProjectPlanCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('Dashboard4wProjectPlanCtrl', [
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
			'ngmClusterHelper',
			'ngmClusterLists',
			'ngmLists',
			'$translate',
			'$filter',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmLists, $translate, $filter ) {
			this.awesomeThings = [
				'HTML5 Boilerplate',
				'AngularJS',
				'Karma'
			];

			// init empty model
			$scope.model = $scope.$parent.ngm.dashboard.model;
		

			// create dews object
			$scope.dashboard = {

				// parent
				ngm: $scope.$parent.ngm,

				// current user
				user: ngmUser.get(),

				// when 'hq'
				pageLoadTime: 18900,

				// report start
				startDate: moment( $route.current.params.start ) .format( 'YYYY-MM-DD' ),

				// report end
				endDate: moment( $route.current.params.end ).format( 'YYYY-MM-DD' ),

				// last update
				updatedAt: '',

				// current report
				report: $location.$$path.replace(/\//g, '_') + '-extracted-',

		
				// lists
				lists: {
					clusters: ngmClusterLists.getClusters( $route.current.params.admin0pcode ).filter(cluster=>cluster.filter!==false),
					admin1: ngmLists.getObject( 'lists' ) ? ngmLists.getObject( 'lists' ).admin1List : [],
					admin2: ngmLists.getObject( 'lists' ) ? ngmLists.getObject( 'lists' ).admin2List : [],
					admin3: ngmLists.getObject( 'lists' ) ? ngmLists.getObject( 'lists' ).admin3List : [],
					//call to function in ngmClusterLists that return exchange rate from EURO to USD
				//	exchangeratescurrenciesCOL: $scope.dashboard.getExchangeRatesCurrenciesCOL(),
				},

				// filtered data
				data: {
					cluster: false,
					admin1: false, 
					admin2: false,
					admin3: false
				},

				menu_items: ngmAuth.getMenuParams('DASHBOARD'),

				menu: [{
					'id': 'search-region',
					'icon': 'person_pin',
					'title': $filter('translate')('region'),
					'class': 'teal lighten-1 white-text',
					'rows': [{
						'title': 'HQ',
						'param': 'adminRpcode',
						'active': 'hq',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/4wprojectplan/hq/all'
					},{
						'title': 'AFRO',
						'param': 'adminRpcode',
						'active': 'afro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/4wprojectplan/afro/all'
					},{
						'title': 'AMER',
						'param': 'adminRpcode',
						'active': 'amer',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/4wprojectplan/amer/all'
					},{
						'title': 'EMRO',
						'param': 'adminRpcode',
						'active': 'emro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/4wprojectplan/emro/all'
					},{
						'title': 'SEARO',
						'param': 'adminRpcode',
						'active': 'searo',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/4wprojectplan/searo/all'
					}
					]
				}],

				// admin
				getPath: function( cluster_id, activity_type,organization_tag, project_type_component, hrpplan, implementer, donor, admin1pcode, admin2pcode, startDate, endDate  ){

					if ( cluster_id !== 'rnr_chapter' ) {
						var path = '/cluster/4wprojectplan/' + $scope.dashboard.adminRpcode +
																	'/' + $scope.dashboard.admin0pcode +
																	'/' + admin1pcode +
																	'/' + admin2pcode +
																	'/' + cluster_id +
																	'/' + activity_type +
																	'/' + organization_tag +
																	'/' + project_type_component +
																	'/' + hrpplan +
																	'/' + implementer+
																	'/' + donor +
																//	'/' + $scope.dashboard.beneficiaries.join('+') +
																	'/' + startDate +
																	'/' + endDate;
					} else {
						var path = '/cluster/4wprojectplan/' + $scope.dashboard.adminRpcode +
																	'/' + $scope.dashboard.admin0pcode +
																	'/' + admin1pcode +
																	'/' + admin2pcode +
																	'/' + cluster_id +
																	'/' + activity_type +
																	'/' + organization_tag +
																	'/' + project_type_component +
																	'/' + hrpplan +
																	'/' + implementer+
																	'/' + donor +
																	'/returnee_undocumented+returnee_documented+refugee_pakistani' +																	
																	'/' + $scope.dashboard.startDate+
																	'/' + $scope.dashboard.endDate;
					}

					return path;
				},

        // set URL based on user rights
				setUrl: function(){

					// get url
					var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );

					// if current location is not equal to path
					if ( path !== $location.$$path ) {
						$location.path( path );
					}

				},

				//
				getRequest: function( obj ){
					var request = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/indicator4wprojectplan',
						data: {
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							admin1pcode: $scope.dashboard.admin1pcode,
							admin2pcode: $scope.dashboard.admin2pcode,
							cluster_id: $scope.dashboard.cluster_id,
							organization_tag: $scope.dashboard.organization_tag,
							project_type_component: $scope.dashboard.project_type_component,
							hrpplan: $scope.dashboard.hrpplan,
							implementer_tag: $scope.dashboard.implementer_tag,
							donor_tag: $scope.dashboard.donor_tag,
							activity_type: $scope.dashboard.activity_type,
							//beneficiaries: $scope.dashboard.beneficiaries,
							start_date: $scope.dashboard.startDate,
							end_date: $scope.dashboard.endDate,
							//coptousd: $scope.dashboard.cop
							cop: 3200,
							eur: $scope.dashboard.eurotousd,
						}
					}

					request.data = angular.merge(request.data, obj);

					return request;
				},

				// request
				getProjectsRequest: function( obj ){
					// constructs like sql query
					var request = {
						query: {
							// dinamically construct
						}
					}

					if ( $scope.dashboard.adminRpcode!=='all' ){
						request.query.adminRpcode = $scope.dashboard.adminRpcode;
					};

					if ( $scope.dashboard.admin0pcode!=='all' ){
						request.query.admin0pcode = $scope.dashboard.admin0pcode;
					};

					if ( $route.current.params.cluster_id!=='all' ){
						request.query.cluster_id = $route.current.params.cluster_id;
					}

					if ( $route.current.params.organization_tag!=='all' ){
						request.query.organization_tag = $route.current.params.organization_tag;
					}

					//start date and end date params to filter by project_start_date an project_end_date

					request.query.project_start_date = $route.current.params.start;
					request.query.project_end_date = $route.current.params.end;

					if( $route.current.params.donor_tag !== 'all'){
						request.query.donor_id = $route.current.params.donor_tag;
					}


					// query depenging on role
					switch ($scope.dashboard.role){
						case 'ADMIN':
							request.query.cluster_id = $scope.dashboard.cluster_id;
							break;
						case 'USER':
							request.query.organization_tag = $scope.dashboard.organization_tag;
					}

					request = angular.merge(request, obj);

					return request;
				},

				// metrics
				getMetrics: function( theme, format ){
					return {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/metrics/set',
						data: {
							organization: $scope.dashboard.user.organization,
							username: $scope.dashboard.user.username,
							email: $scope.dashboard.user.email,
						//	dashboard: 'cluster_dashboard',
						    dashboard: '4wprojectplan_dashboard',
							theme: theme,
							format: format,
							url: $location.$$path
						}
					}
				},

				// downloads
				getDownloads: function(){

					// downloads
					var downloads = [
					/*{
							type: 'pdf',
							color: 'blue',
							icon: 'picture_as_pdf',
							hover: $filter('translate')('download_admin_as_pdf'),
							request: {
								method: 'POST',
								url: ngmAuth.LOCATION + '/api/print',
								data: {
									report: $scope.dashboard.report_file_name,
									printUrl: $location.absUrl(),
									downloadUrl: ngmAuth.LOCATION + '/report/',
									user: $scope.dashboard.user,
								}
							},
							metrics: $scope.dashboard.getMetrics( 'print', 'pdf' )
					},*/{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment',
						hover: $filter('translate')('download_project_summaries_as_csv'),
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/project/getProjects',
							data: $scope.dashboard.getProjectsRequest( { report: $scope.dashboard.cluster_id_filename +'_projects' + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
						},
						metrics: $scope.dashboard.getMetrics( 'projects_summary', 'csv' )
					}/*,{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment_late',
						hover: $filter('translate')('download')+' ' + $scope.dashboard.report_type.charAt(0).toUpperCase() + $scope.dashboard.report_type.slice(1) + ' '+$filter('translate')('reports_todo')+',',
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
							data: angular.merge( $scope.dashboard.getRequest( 'reports_due', true ), { report: $scope.dashboard.cluster_id_filename + '_' + $scope.dashboard.report_type +'_reports_due_' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
						},
						metrics: $scope.dashboard.getMetrics( 'reports_due', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment_turned_in',
						hover: $filter('translate')('download')+ ' ' + $scope.dashboard.report_type.charAt(0).toUpperCase() + $scope.dashboard.report_type.slice(1) + ' ' +$filter('translate')('reports_completed'),
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/admin/indicator',
							data: angular.merge($scope.dashboard.getRequest( 'reports_submitted', true ), { report: $scope.dashboard.cluster_id_filename + '_' + $scope.dashboard.report_type + '_reports_complete_' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ), csv: true } )
						},
							metrics: $scope.dashboard.getMetrics( 'reports_complete', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'attach_money',
						hover: $filter('translate')('download_projects_financials_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'financial_report', report: $scope.dashboard.cluster_id_filename + '_ocha_financial_report-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cluster_financial_report', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'group',
						hover: $filter('translate')('download_beneficiary_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'beneficiaries', report: $scope.dashboard.activity_filename + $scope.dashboard.cluster_id_filename + '_beneficiary_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'beneficiary_data', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'show_chart',
						hover: $filter('translate')('download_stock_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'stocks', report: $scope.dashboard.cluster_id_filename + '_stock_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'stocks', 'csv' )
					}*/];

					// ng wash dls
					/*var ng_wash_dl = [{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'compare_arrows',
						hover: $filter('translate')('download_accountability_dara_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'accountability', report: $scope.dashboard.activity_filename + $scope.dashboard.cluster_id_filename + '_accountability_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'accountability_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'radio_button_checked',
						hover: $filter('translate')('download_borehole_dara_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'boreholes', report: $scope.dashboard.cluster_id_filename + '_boreholes_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'borehole_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'local_activity',
						hover: $filter('translate')('download_cash_programming_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'cash', report: $scope.dashboard.cluster_id_filename + '_cash_programming-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cash_programming', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'spa',
						hover: $filter('translate')('download_hygiene_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'hygiene', report: $scope.dashboard.cluster_id_filename + '_hygiene_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'hygiene_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'wc',
						hover: $filter('translate')('download_sanitation_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'sanitation', report: $scope.dashboard.cluster_id_filename + '_sanitation_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'sanitation_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'local_drink',
						hover: $filter('translate')('download_water_data_as_csv'),
						request: $scope.dashboard.getCsvRequest( { csv: true, indicator: 'water', report: $scope.dashboard.cluster_id_filename + '_water_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'water_data', 'csv' )
					}];

					// NG, wash and Admin
					if ( $scope.dashboard.admin0pcode === 'NG' &&
								$scope.dashboard.cluster_id === 'wash' &&
								$scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1  ) {
						downloads = downloads.concat ( ng_wash_dl );
					}*/

					// example of blocking download
					const canDownload = ngmAuth.canDo('DASHBOARD_DOWNLOAD', {
						adminRpcode: $scope.dashboard.adminRpcode.toUpperCase(),
						admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(),
						cluster_id: $scope.dashboard.cluster_id,
						organization_tag: $scope.dashboard.organization_tag
					})
					// remove download button
					if (!canDownload) {
						setTimeout(function () {
							$scope.model.header.download.class += ' hide';
						},10)
					}

					// return
					return downloads;
				},

				//
				setMenu: function(){

					// rows
					var orgRows = [],
							clusterRows = [], 
							provinceRows = [],
							districtRows = [],
							yearRows = [],
							donorsRows = [],
							implementingPartnersRows = [],
							activitiesRows = [],
							project_type_componentRows = [],
							ishrpoptions = [],

						//	request = $scope.dashboard.getRequest( { list: true, indicator: 'organizations' } );
						request = $scope.dashboard.getRequest( { list: true, indicator: 'organizations_4wdashboard_projectplan' } );


					if ($scope.dashboard.menu_items.includes('adminRpcode')){
						$scope.model.menu = $scope.dashboard.menu;
					}

					if ($scope.dashboard.menu_items.includes('admin0pcode')){
						if ( $scope.dashboard.adminRpcode !== 'hq' ) {

							var menu = {
								'afro': {
									'id': 'search-country',
									'icon': 'person_pin',
									'title': $filter('translate')('country'),
									'class': 'teal lighten-1 white-text',
									'rows': [{
										'title': 'Democratic Republic of Congo',
										'param': 'admin0pcode',
										'active': 'cd',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/afro/cd'
									},{
										'title': 'Ethiopia',
										'param': 'admin0pcode',
										'active': 'et',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/afro/et'
									},{
										'title': 'Nigeria',
										'param': 'admin0pcode',
										'active': 'ng',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/afro/ng'
									},{
										'title': 'South Sudan',
										'param': 'admin0pcode',
										'active': 'ss',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/afro/ss'
									}]
								},
								'emro': {
									'id': 'search-country',
									'icon': 'person_pin',
									'title': $filter('translate')('country'),
									'class': 'teal lighten-1 white-text',
									'rows': [{
										'title': 'Afghanistan',
										'param': 'admin0pcode',
										'active': 'af',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/emro/af'
									},{
										'title': 'Somalia',
										'param': 'admin0pcode',
										'active': 'so',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/emro/so'
									},{
										'title': 'Syria',
										'param': 'admin0pcode',
										'active': 'sy',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/emro/sy'
									},{
										'title': 'Yemen',
										'param': 'admin0pcode',
										'active': 'ye',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/emro/ye'
									}]
								},
								'searo': {
									'id': 'search-country',
									'icon': 'person_pin',
									'title': $filter('translate')('country'),
									'class': 'teal lighten-1 white-text',
									'rows': [{
										'title': 'Bangladesh',
										'param': 'admin0pcode',
										'active': 'bd',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/searo/bd'
									},{
										'title': 'Cox Bazar',
										'param': 'admin0pcode',
										'active': 'cb',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/searo/cb'
									}]
								},
								'amer': {
									'id': 'search-country',
									'icon': 'person_pin',
									'title': $filter('translate')('country'),

									'class': 'teal lighten-1 white-text',
									'rows': [{
										'title': 'Colombia',
										'param': 'admin0pcode',
										'active': 'col',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/4wprojectplan/amer/col'
									}]
								}
							}
							$scope.model.menu.push(menu[$scope.dashboard.adminRpcode]);
						}
					}

					// get orgs
					ngmData.get( request ).then( function( organizations  ){


						/*if($scope.dashboard.user.roles.indexOf('COUNTRY_ADMIN')  !== -1  )  {
						 						
						 		$scope.dashboard.organization_tag = 'all';

					       }else{
                      }*/


                      //years
						yearsList = [
						{'year_id':'2010','year_name':'2010'},
						{'year_id':'2011','year_name':'2011'},
						{'year_id':'2012','year_name':'2012'},
						{'year_id':'2013','year_name':'2013'},
						{'year_id':'2014','year_name':'2014'},
						{'year_id':'2015','year_name':'2015'},
						{'year_id':'2016','year_name':'2016'},
						{'year_id':'2017','year_name':'2017'},
						{'year_id':'2018','year_name':'2018'},
						{'year_id':'2019','year_name':'2019'},
						{'year_id':'2020','year_name':'2020'},
						{'year_id':'2021','year_name':'2021'},
						{'year_id':'2022','year_name':'2022'},
						{'year_id':'2023','year_name':'2023'},
						{'year_id':'2024','year_name':'2024'},
						{'year_id':'2025','year_name':'2025'},
						{'year_id':'2026','year_name':'2026'},
						{'year_id':'2027','year_name':'2027'},
						{'year_id':'2028','year_name':'2028'},
						{'year_id':'2029','year_name':'2029'},
						{'year_id':'2030','year_name':'2030'}];

						angular.forEach( yearsList, function(d,i){

							//startDate = moment( d.year_id+'-01-01' ) .format( 'YYYY-MM-DD' );
							startDate = moment(new Date(d.year_id+'-01-01')).format('YYYY-MM-DD')

							endDate = moment( d.year_id+'-12-31' ) .format( 'YYYY-MM-DD' );
							

							var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, startDate, endDate );


		                     //nuevo path
							//var path = $scope.dashboard.getPath($scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag,  $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, startDate, endDate);


							yearRows.push({
								'title':d.year_name,
								'param':'year_id',
								'active':d.year_id,
								'class':'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path,
							
							});

						});

						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster-year',
							'icon': 'date_range',
							'title': $filter('translate')('year'),
							'class': 'teal lighten-1 white-text',
							'rows': yearRows
						});


						// set organization
						if ( $scope.dashboard.organization_tag !== 'all' ) {
							var org = $filter( 'filter' )( organizations, { organization_tag: $scope.dashboard.organization_tag } );
							if ( org.length ) {
								$scope.dashboard.organization = org[0].organization;
								$scope.dashboard.setTitle();
								$scope.dashboard.setSubtitle();
							}
						}

						// clusters
						$scope.dashboard.lists.clusters.unshift({ cluster_id: 'all', cluster: 'ALL' });
						angular.forEach( $scope.dashboard.lists.clusters, function(d,i){
							var path = $scope.dashboard.getPath( d.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
							clusterRows.push({
								'title': d.cluster,
								'param': 'cluster_id',
								'active': d.cluster_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path
							});
						});

						// add to menu
						$scope.model.menu.push({
							'search': true,
							'id': 'search-cluster-cluster',
							'icon': 'camera',
							'title': 'Cluster',
							'class': 'teal lighten-1 white-text',
							'rows': clusterRows
						});

						

						// organizations
						organizations.forEach(function( d, i ){
							if ( d ) {
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, d.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
								orgRows.push({
									'title': d.organization,
									'param': 'organization_tag',
									'active': d.organization_tag,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + path
								});
							}
						});


						// organization & disable if public
						//if ($scope.dashboard.menu_items.includes('organization_tag') && $scope.dashboard.user.username !== 'welcome') {
				
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-organization',
								'icon': 'supervisor_account',
								'title': $filter('translate')('executor'),
								'class': 'teal lighten-1 white-text',
								'rows': orgRows
							});

					   // };



					   //implementing_partners

					 implementingPartners = $scope.dashboard.getRequest({list:true, indicator: 'implementing_partners_list_4wdashboard_projectplan'});

					ngmData.get( implementingPartners ).then( function( partners  ){


						  	partners.data.unshift({
												id : 'all',
						   		organization_tag: 'all',
						   		organization: $filter('translate')('all_mayus'),
						   		organization_type:'all',
						   		admin0pcode:'COL',
						   		organization_name : $filter('translate')('all_mayus')
										});
						  	///console.log("ACTIVIDADES: ",partners.data);


						angular.forEach(partners.data,function(d,i){
					   		if(d){
					   			var path = $scope.dashboard.getPath($scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, d.organization_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate);
					   			implementingPartnersRows.push({
					   				'title':d.organization,
					   				'param':'organization_tag',
					   				'active':d.organization_tag,
					   				'class':'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					   				'href':'/desk/#'+path

					   			});

					   		}


					   	});

					   		//console.log("PARTNERS ROWS: ",implementingPartnersRows);


					   		$scope.model.menu.push({ 
								'search': true,
								'id': 'search-cluster-implementingpartners',
								'icon': 'people',
								'title': $filter('translate')('implementer'),
								'class': 'teal lighten-1 white-text',
								'rows': implementingPartnersRows
							});
							//console.log("MENU: ",$scope.model.menu);

					   	if ( $scope.dashboard.implementer_tag !== 'all' ) {
							var implementer_tag = $filter( 'filter' )( partners.data, { organization_tag: $scope.dashboard.implementer_tag } );
							if ( implementer_tag.length ) {
								$scope.dashboard.implementer_tag = implementer_tag[0].organization_tag;
							
							}
						}

					   

					});



					    //DONORS

					   // donorsProject = $scope.dashboard.getRequest({list:true, indicator:'project_donors'});
					    //console.log("DONORS: ",donorsProject);

					    ngmData.get($scope.dashboard.donorsProject).then(function(donors){

					    	donors.data.unshift({
					    		project_donor_id :'all',
					    		project_donor_name: $filter('translate')('all_mayus'),
					    	});

					    	angular.forEach(donors.data,function(d,i){
					    		if(d){

					    		var path = $scope.dashboard.getPath($scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, d.project_donor_id, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate);
					   		 donorsRows.push({
					   				'title':d.project_donor_name,
					   				'param':'project_donor_id',
					   				'active':d.project_donor_id,
					   				'class':'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					   				'href':'/desk/#'+path

					    	});
					   	    }

					    });
					    		//console.log("DONORS ROWS: ",donorsRows);


					   		$scope.model.menu.push({ 
								'search': true,
								'id': 'search-cluster-donorsproject',
								'icon': 'attach_money',
								'title': $filter('translate')('donor'),
								'class': 'teal lighten-1 white-text',
								'rows': donorsRows
							});
						//	console.log("MENU: ",$scope.model.menu);

					   	if ( $scope.dashboard.donor_tag !== 'all' ) {
							var donor_tag = $filter( 'filter' )( donors.data, { project_donor_id: $scope.dashboard.donor_tag } );
							if ( donor_tag.length ) {
								$scope.dashboard.donor_tag = donor_tag[0].project_donor_id;
							
							}
						}
					});


					     //Activity Type

					   activitiesActivityType = $scope.dashboard.getRequest( { list: true, indicator: 'activities_activity_type'});

					   ngmData.get( activitiesActivityType ).then( function( activities  ){

					   	activities.data.unshift({
					   		activity_type_id: 'all',
					   		activity_type_name: $filter('translate')('all_mayus')

					   	});

				
					   	angular.forEach(activities.data , function(d,i){


					   if(d){
					    		var path = $scope.dashboard.getPath($scope.dashboard.cluster_id, d.activity_type_id, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate)
                                activitiesRows.push({
                                	'title': d.activity_type_name,
                                	'param': 'activity_type_id',
                                	'active': d.activity_type_id,
                                	'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                                	'href': '/desk/#'+path

                                });
					    	}
					    });



				
							$scope.model.menu.push({ 
								'search': true,
								'id': 'search-cluster-activitytype',
								'icon': 'supervisor_account',
								'title': $filter('translate')('activity_type'),
								'class': 'teal lighten-1 white-text',
								'rows': activitiesRows
							});

							if ( $scope.dashboard.activity_type !== 'all' ) {
							var activity_type = $filter( 'filter' )( activities.data, { activity_type_id: $scope.dashboard.activity_type } );
							if ( activity_type.length ) {
								//$scope.dashboard.hrpplan = hrpoption[0].option_id;
								$scope.dashboard.activity_type_title = activity_type[0].activity_type_name;
								$scope.dashboard.setTitle();
								$scope.dashboard.setSubtitle();
							}
						}

					   });



    				

					   if($scope.dashboard.admin0pcode === 'col'){

						   	project_type_components_list = [
						   {project_type_component_id:'all',project_type_component_name:$filter('translate')('all_mayus')},
						   {project_type_component_id:'hrp_plan',project_type_component_name:'Humanitario'},
						   {project_type_component_id:'interagencial_plan',project_type_component_name:'Paz y Desarrollo'},
						   {project_type_component_id:'rmrp_plan',project_type_component_name:'Flujos Migratorios Mixtos'}
						   ];

					   }else{
					   	project_type_components_list = [
						   {project_type_component_id:'all',project_type_component_name:$filter('translate')('all_mayus')}
						   ]

					   }

					   angular.forEach( project_type_components_list, function(d,i){
							var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, d.project_type_component_id, $scope.dashboard.hrpplan , $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
							project_type_componentRows.push({
								'title': d.project_type_component_name,
								'param': 'project_type_component_id',
								'active': d.project_type_component_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path
							});
						});

							$scope.model.menu.push({
								'search': false,
								'id': 'search-cluster-projecttypecomponent',
								'icon': 'supervisor_account',
								'title': $filter('translate')('project_type'),
								'class': 'teal lighten-1 white-text',
								'rows': project_type_componentRows
							});

							// set hrpplan
						if ( $scope.dashboard.project_type_component !== 'all' ) {
							var projtypecomp = $filter( 'filter' )( project_type_components_list, { project_type_component_id: $scope.dashboard.project_type_component } );
							//console.log(hrpoption);
							if ( projtypecomp.length ) {
								$scope.dashboard.project_type_component = projtypecomp[0].project_type_component_id;
								/*$scope.dashboard.hrpplantitle = hrpoption[0].option_name;
								$scope.dashboard.setTitle();
								$scope.dashboard.setSubtitle();*/
							}
						}


					    //is hrp ?

					    if($scope.dashboard.admin0pcode === 'col'){
					    	 ishrpoptionsList = [
								    {'option_name':$filter('translate')('all_mayus'),'option_id':'all'}
								    ,{'option_name': 'Si','option_id':true},
								    {'option_name': 'No','option_id':false}
								    ];
					    }else{

					    	ishrpoptionsList = [{'option_name':$filter('translate')('all_mayus'),'option_id':'all'}];

					    };

					   
					    //console.log("FECHA INICIO EN HRP OPTIONS: ",$scope.dashboard.startDate);
					    angular.forEach( ishrpoptionsList, function(d,i){
							var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, d.option_id, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
							ishrpoptions.push({
								'title': d.option_name,
								'param': 'option_id',
								'active': d.option_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': '/desk/#' + path
							});
						});

							$scope.model.menu.push({
								'search': false,
								'id': 'search-cluster-ishrpoption',
								'icon': 'supervisor_account',
								'title': 'HRP ?',
								'class': 'teal lighten-1 white-text',
								'rows': ishrpoptions
							});

							// set hrpplan
						if ( $scope.dashboard.hrpplan !== 'all' ) {
							var hrpoption = $filter( 'filter' )( ishrpoptionsList, { option_id: $scope.dashboard.hrpplan } );
							//console.log(hrpoption);
							if ( hrpoption.length ) {
								$scope.dashboard.hrpplan = hrpoption[0].option_id;
								$scope.dashboard.hrpplantitle = hrpoption[0].option_name;
								///$scope.dashboard.setTitle();
								//$scope.dashboard.setSubtitle();
							}
						}




						// if country selected
						if ( $scope.dashboard.admin0pcode !== 'all' ) {

							// admin1
							var admin1List = $filter( 'filter' )( $scope.dashboard.lists.admin1, { admin0pcode: $scope.dashboard.admin0pcode.toUpperCase() }, true );
							// add all
							admin1List.unshift({
								admin1pcode: 'all',
								admin1name: $filter('translate')('all_mayus'),
							});
							angular.forEach( admin1List, function(d,i){
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, d.admin1pcode, 'all',$scope.dashboard.startDate, $scope.dashboard.endDate );
								provinceRows.push({
									'title': d.inactive ? d.admin1name + ' (Old)' : d.admin1name,
									'param': 'admin1pcode',
									'active': d.admin1pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + path
								});
							});
							var title = $filter( 'filter' )( $scope.dashboard.lists.admin1, { admin0pcode: $scope.dashboard.admin0pcode.toUpperCase() }, true )[0];
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-admin1',
								'icon': 'location_on',
								'title': title.admin1type_name,
								'class': 'teal lighten-1 white-text',
								'rows': provinceRows
							});

						}

						// if country selected
						if ( $scope.dashboard.admin1pcode !== 'all' ) {

							// admin1
							var admin2List = $filter( 'filter' )( $scope.dashboard.lists.admin2, { admin1pcode: $scope.dashboard.admin1pcode.toUpperCase() }, true );
							// add all
							admin2List.unshift({
								admin2pcode: 'all',
								admin2name: $filter('translate')('all_mayus'),
							});
							angular.forEach( admin2List, function(d,i){
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, d.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
								districtRows.push({
									'title': d.admin2name,
									'param': 'admin2pcode',
									'active': d.admin2pcode,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + path
								});
							});
							var title = $filter( 'filter' )( $scope.dashboard.lists.admin2, { admin1pcode: $scope.dashboard.admin1pcode.toUpperCase() }, true )[0];
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-admin2',
								'icon': 'location_on',
								'title': title.admin2type_name,
								'class': 'teal lighten-1 white-text',
								'rows': districtRows
							});

						}

					});

				},

				setCluster: function(){
					if ( $scope.dashboard.cluster_id === 'cvwg' ) {
						$scope.dashboard.cluster = { cluster_id: 'cvwg', cluster: 'MPC' };
					} else {
						$scope.dashboard.cluster = $filter( 'filter' )( $scope.dashboard.lists.clusters,
														{ cluster_id: $scope.dashboard.cluster_id }, true )[0];
					}
				},

				// filter
				setAdmin1: function(){
					$scope.dashboard.data.admin1 = $filter( 'filter' )( $scope.dashboard.lists.admin1,
														{ admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(),
															admin1pcode: $scope.dashboard.admin1pcode }, true )[0];
				},

				setAdmin2: function(){
					$scope.dashboard.data.admin2 = $filter( 'filter' )( $scope.dashboard.lists.admin2,
														{ admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(),
															admin1pcode: $scope.dashboard.admin1pcode,
															admin2pcode: $scope.dashboard.admin2pcode }, true )[0];
				},

				//
				setTitle: function(){
					// title
					$scope.dashboard.title = $filter('translate')('4W')
				
					// admin0
					if ( $scope.dashboard.admin0pcode === 'all' ) {
						$scope.dashboard.title = $filter('translate')('4W')+' | ' + $scope.dashboard.adminRpcode.toUpperCase()
					}

					if ( $scope.dashboard.admin0pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.admin0pcode.toUpperCase();
					}
					// cluster
					if ( $scope.dashboard.cluster_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.cluster.cluster.toUpperCase();
					}
					// activity
					/*if ( $scope.dashboard.activity_type_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.activity_type_id.toUpperCase();
					}*/
					// org
					if ( $scope.dashboard.organization_tag !== 'all' ) {
						var org = $scope.dashboard.organization ? ' | ' + $scope.dashboard.organization : '';
						$scope.dashboard.title += org;
					}

					// admin1
					if ( $scope.dashboard.admin1pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin1.admin1name;
					}
					// admin2
					if ( $scope.dashboard.admin2pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.data.admin2.admin2name;
					}
					// update of rendered title
					if ( $scope.model.header && $scope.model.header.title ){
						$scope.model.header.title.title = $scope.dashboard.title;
					}
				},

				// subtitle
				setSubtitle: function(){
					// subtitle
					$scope.dashboard.subtitle = $filter('translate')('4WDASHBOARD')+' '+ $filter('translate')('for')+' ';
					// admin0
					if ( $scope.dashboard.admin0pcode === 'all' ) {
						$scope.dashboard.subtitle = $filter('translate')('4WDASHBOARD')+' '+ $filter('translate')('for') + ' ' + $scope.dashboard.adminRpcode.toUpperCase();
					}

					if ( $scope.dashboard.admin0pcode !== 'all' ) {
						$scope.dashboard.subtitle +=  $scope.dashboard.admin0pcode.toUpperCase();
					}
					// cluster
					if ( $scope.dashboard.cluster_id === 'all' ) {
						$scope.dashboard.subtitle += ', '+$filter('translate')('all_clusters');
					}	else {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.cluster.cluster.toUpperCase() + ' cluster';
					}
					// activity
					/*if ( $scope.dashboard.activity_type_id !== 'all' ) {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.activity_type_id.toUpperCase();
					}*/
					// org
					if ( $scope.dashboard.organization_tag === 'all' ) {
						$scope.dashboard.subtitle += ', '+ $filter('translate')('all_organizations');
					} else {
						var org =  $scope.dashboard.organization ? ', ' + $scope.dashboard.organization + ' ' + $filter('translate')('organization') : '';
						$scope.dashboard.subtitle += org;
					}
					// admin1
					if ( $scope.dashboard.admin1pcode === 'all' ) {
						$scope.dashboard.subtitle += ', '+ $filter('translate')('all_provinces');
					} else {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin1.admin1name.toUpperCase() + ' '+ $filter('translate')('province');
					}
					// admin2
					if ( $scope.dashboard.admin2pcode !== 'all' ) {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.data.admin2.admin2name.toUpperCase() + ' ' + $filter('translate')('district');
					}
					// update of rendered title
					if ( $scope.model.header && $scope.model.header.subtitle ){
						$scope.model.header.subtitle.title = $scope.dashboard.subtitle;
					}
				},

				// set dashboard
				init: function(){

					// variables
					$scope.dashboard.adminRpcode = $route.current.params.adminRpcode;
					$scope.dashboard.admin0pcode = $route.current.params.admin0pcode;
					$scope.dashboard.admin1pcode = $route.current.params.admin1pcode;
					$scope.dashboard.admin2pcode = $route.current.params.admin2pcode;
					$scope.dashboard.cluster_id = $route.current.params.cluster_id;
					$scope.dashboard.organization_tag = $route.current.params.organization_tag;
					$scope.dashboard.project_type_component = $route.current.params.project_type_component;
					$scope.dashboard.hrpplan = $route.current.params.hrpplan;
					$scope.dashboard.implementer_tag = $route.current.params.implementer_tag;
					$scope.dashboard.donor_tag = $route.current.params.donor_tag;
					$scope.dashboard.activity_type = $route.current.params.activity_type;
					$scope.dashboard.donorsProject = $scope.dashboard.getRequest({list:true, indicator:'project_donors'});



					// plus dashboard_visits
					$scope.dashboard.user.dashboard_visits++;
					localStorage.setObject( 'auth_token', $scope.dashboard.user );
					ngmLists.setObject( 'auth_token', $scope.dashboard.user );

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// filename cluster needs to be mpc for cvwg
					// TODO refactor/update cvwg
					$scope.dashboard.cluster_id_filename = $scope.dashboard.cluster_id !== 'cvwg' ? $scope.dashboard.cluster_id : 'mpc'

					if ($route.current.params.organization_tag!=='all'){
						$scope.dashboard.cluster_id_filename = $route.current.params.organization_tag + '_' + $scope.dashboard.cluster_id_filename;
					}

					if ($route.current.params.activity_type!=='all'){
						$scope.dashboard.activity_filename = $route.current.params.activity_type + '_';
					}

					if ($route.current.params.activity_type==='all'){
						$scope.dashboard.activity_filename = '';
					} 


					



					$scope.dashboard.beneficiaries_row = [ 
					
					{
								styleClass: 's12 m6 l6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('executing_organizations'),
										request: $scope.dashboard.getRequest( { indicator: 'organizations_4wdashboard_projectplan' } )
									}
								}]
						},
						{
						styleClass: 's12 m6 l6',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: $filter('translate')('implementing_organizations'),
								request: $scope.dashboard.getRequest({ indicator: 'total_implementing_partners_4wdashboard_projectplan' })
							}
						}]
					}/*, 
					{
						styleClass: 's12 m12 l6',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: $filter('translate')('donors'),
								request: $scope.dashboard.getRequest({ indicator: 'total_donors_4wdashboard_projectplan' })
							}
						}]
					}*/
					 ];

					

					// model
					$scope.model = {
						//name: 'cluster_dashboard',
						name: '4wprojectplan_dashboard',
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
									label: $filter('translate')('from'),
									format: 'd mmm, yyyy',
									min: '2017-01-01',
									max: $scope.dashboard.endDate,
									currentTime: $scope.dashboard.startDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.startDate ) {
											// set new date
											$scope.dashboard.startDate = date;
											var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate );
											$location.path( path );
										}
									}
								},{
									style: 'float:right',
									label: $filter('translate')('to'),
									format: 'd mmm, yyyy',
									min: $scope.dashboard.startDate,
									currentTime: $scope.dashboard.endDate,
									onClose: function(){
										// set date
										var date = moment(new Date(this.currentTime)).format('YYYY-MM-DD')
										if ( date !== $scope.dashboard.endDate ) {
											// set new date
											$scope.dashboard.endDate = date;
											var path = $scope.dashboard.getPath(  $scope.dashboard.cluster_id, $scope.dashboard.activity_type, $scope.dashboard.organization_tag, $scope.dashboard.project_type_component, $scope.dashboard.hrpplan, $scope.dashboard.implementer_tag, $scope.dashboard.donor_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode, $scope.dashboard.startDate, $scope.dashboard.endDate  );
											$location.path( path );
										}
									}
								}]
							},
							download: {
								'class': 'col s12 m4 l4 hide-on-small-only',
								downloads: $scope.dashboard.getDownloads()
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
										request: $scope.dashboard.getRequest( { indicator: 'latest_update' } ),
										templateUrl: '/scripts/widgets/ngm-html/template/cluster.dashboard4wprojectplan.html'

									}
								}]
							}]
						},{
							columns: [
							{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('total_projects'),
										request: $scope.dashboard.getRequest( { indicator: 'projects_4wdashboard_projectplan' } )
									}
								}]
							},
							{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('total_beneficiaries_population'),
										request: $scope.dashboard.getRequest( { indicator: 'total_beneficiariespopulation_4wdashboard_projectplan' } )
									}
								}]
							},
							{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('total_financing')+' US$',
										request: $scope.dashboard.getRequest( { indicator: 'total_financing_4wdashboard_projectplan' } )
									}
								}]
							}/*,
							{
								styleClass: 's12 m4',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('executing_organizations'),
										request: $scope.dashboard.getRequest( { indicator: 'organizations_4wdashboard_projectplan' } )
									}
								}]
							}*/
							]
						},{
							columns: $scope.dashboard.beneficiaries_row
						}/*,{
							columns: [{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'highchart',
									style: 'height: 180px;',
									card: 'card-panel chart-stats-card white grey-text text-darken-2',
									config: {
										title: {
											text: $filter('translate')('children'),
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
												name: $filter('translate')('children'),
												size: '100%',
												innerSize: '80%',
												showInLegend:false,
												dataLabels: {
													enabled: false
												},
												request: $scope.dashboard.getRequest({ indicator: 'pieChart', chart_for:'children'})												
																						}]
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'highchart',
									style: 'height: 180px;',
									card: 'card-panel chart-stats-card white grey-text text-darken-2',
									config: {
										title: {
											text: $filter('translate')('adult')
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
												name: $filter('translate')('adult'),
												size: '100%',
												innerSize: '80%',
												showInLegend:false,
												dataLabels: {
													enabled: false
												},
												request: $scope.dashboard.getRequest({ indicator: 'pieChart', chart_for: 'adult' })												
											}]
										}
									}
								}]
							},{
								styleClass: 's12 m12 l4',
								widgets: [{
									type: 'highchart',
									style: 'height: 180px;',
									card: 'card-panel chart-stats-card white grey-text text-darken-2',
									config: {
										title: {
											text: $filter('translate')('elderly')
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
												name: $filter('translate')('elderly'),
												size: '100%',
												innerSize: '80%',
												showInLegend:false,
												dataLabels: {
													enabled: false
												},
												request: $scope.dashboard.getRequest({ indicator: 'pieChart', chart_for: 'elderly' })												
											}]
										}
									}
								}]
							}]
						}*/,{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">'+$filter('translate')('project_target_locations')+'</h2>'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m12',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('target_locations'),
										request: $scope.dashboard.getRequest( { indicator: 'target_locations_4wdashboard_projectplan' } )
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
													layerOptions: {
														continuousWorld: true
													}
												}
											},
											overlays: {
												projects: {
													name: 'Projects',
													type: 'markercluster',
													visible: true,
													layerOptions: {
															maxClusterRadius: 90
													}
												}
											}
										},
										//request: $scope.dashboard.getRequest( { indicator: 'markers' } )
										request: $scope.dashboard.getRequest( { indicator: 'markers4wDasbhboardProjectPlan' } )

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

					// set
					$scope.dashboard.setUrl();
					$scope.dashboard.setMenu();
					$scope.dashboard.setCluster();
					$scope.dashboard.setAdmin1();
					$scope.dashboard.setAdmin2();
					$scope.dashboard.setTitle();
					$scope.dashboard.setSubtitle();

					// dashboard metrics
					var visit = angular.merge( $scope.dashboard.getMetrics( $scope.dashboard.cluster_id + /*'_cluster_dashboard'*/'_4wprojectplan_dashboad', 'view' ), { async: true } );
					$http( visit ).success( function( data ) {;
		         // success
		      }).error( function( data ) {;
		       //  console.log('error!');
		      });

				}

			};

			// if lists
			if ( $scope.dashboard.lists.admin1.length ) {

				var requests = {

					//call to back and return exchange rate from EURO to USD
					currenciees: ngmAuth.LOCATION + '/api/cluster/exchangeRatesCurrenciesProjectPlanDashboard'


				};

				$q.all([
					$http.get( requests.currenciees   )]).then(function(results){
						//exchange rate from EURO to USD
						$scope.dashboard.eurotousd = results[0].data[0];

						// set dashboard
						$scope.dashboard.init();

						// assign to ngm app scope ( for menu )
						$scope.dashboard.ngm.dashboard.model = $scope.model;
					});


			}

			// if none
			if ( !$scope.dashboard.lists.admin1.length ) {

				// lists
				var requests = {
					getAdmin1List: ngmAuth.LOCATION + '/api/list/getAdmin1List',
					getAdmin2List: ngmAuth.LOCATION + '/api/list/getAdmin2List',
					currenciees: ngmAuth.LOCATION + '/api/cluster/exchangeRatesCurrenciesProjectPlanDashboard'
				}

				// send request
				$q.all([
					$http.get( requests.getAdmin1List ),
					$http.get( requests.getAdmin2List ),
					$http.get( requests.currenciees) ]).then( function( results ) {

					// set dashboard lists
					$scope.dashboard.lists.admin1 = results[0].data;
					$scope.dashboard.lists.admin2 = results[1].data;
					//exchange rate from EURO to USD
					$scope.dashboard.eurotousd = results[2].data[0];

					// set in localstorage
					localStorage.setObject( 'lists', { admin1List: results[0].data, admin2List: results[1].data } );
					ngmLists.setObject( 'lists', { admin1List: results[0].data, admin2List: results[1].data } );

					// set dashboard
					$scope.dashboard.init();

					// assign to ngm app scope ( for menu )
					$scope.dashboard.ngm.dashboard.model = $scope.model;

				});

			}

		}

	]);


