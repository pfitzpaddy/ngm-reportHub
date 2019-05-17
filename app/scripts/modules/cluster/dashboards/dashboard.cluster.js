/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardClusterCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardClusterCtrl', [
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
			'$translate',
			'$filter',
		function ( $scope, $q, $http, $location, $route, $rootScope, $window, $timeout, $filter, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists,$translate, $filter ) {
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
					clusters: ngmClusterLists.getClusters( $route.current.params.admin0pcode ),
					admin1: localStorage.getObject( 'lists' ) ? localStorage.getObject( 'lists' ).admin1List : [],
					admin2: localStorage.getObject( 'lists' ) ? localStorage.getObject( 'lists' ).admin2List : [],
					admin3: localStorage.getObject( 'lists' ) ? localStorage.getObject( 'lists' ).admin3List : []
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
						'href': '/desk/#/cluster/5w/hq/all'
					},{
						'title': 'AFRO',
						'param': 'adminRpcode',
						'active': 'afro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/5w/afro/all'
					},{
						'title': 'AMER',
						'param': 'adminRpcode',
						'active': 'amer',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/5w/amer/all'
					},{
						'title': 'EMRO',
						'param': 'adminRpcode',
						'active': 'emro',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/5w/emro/all'
					},{
						'title': 'SEARO',
						'param': 'adminRpcode',
						'active': 'searo',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '/desk/#/cluster/5w/searo/all'
					}
					]
				}],

				// admin
				getPath: function( cluster_id, activity_type_id, organization_tag, admin1pcode, admin2pcode ){

					if ( cluster_id !== 'rnr_chapter' ) {
						var path = '/cluster/5w/' + $scope.dashboard.adminRpcode +
																	'/' + $scope.dashboard.admin0pcode +
																	'/' + admin1pcode +
																	'/' + admin2pcode +
																	'/' + cluster_id +
																	'/' + activity_type_id +
																	'/' + organization_tag +
																	'/' + $scope.dashboard.beneficiaries.join('+') +
																	'/' + $scope.dashboard.startDate +
																	'/' + $scope.dashboard.endDate;
					} else {
						var path = '/cluster/5w/' + $scope.dashboard.adminRpcode +
																	'/' + $scope.dashboard.admin0pcode +
																	'/' + admin1pcode +
																	'/' + admin2pcode +
																	'/' + cluster_id +
																	'/' + activity_type_id +
																	'/' + organization_tag +
																	'/returnee_undocumented+returnee_documented+refugee_pakistani' +																	
																	'/' + $scope.dashboard.startDate +
																	'/' + $scope.dashboard.endDate;
					}

					return path;
				},

        // set URL based on user rights
				setUrl: function(){

					// get url
					var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );

					// if current location is not equal to path
					if ( path !== $location.$$path ) {
						$location.path( path );
					}

				},

				//
				getRequest: function( obj ){
					var request = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/indicator',
						data: {
							adminRpcode: $scope.dashboard.adminRpcode,
							admin0pcode: $scope.dashboard.admin0pcode,
							admin1pcode: $scope.dashboard.admin1pcode,
							admin2pcode: $scope.dashboard.admin2pcode,
							cluster_id: $scope.dashboard.cluster_id,
							activity_type_id: $scope.dashboard.activity_type_id,
							organization_tag: $scope.dashboard.organization_tag,
							beneficiaries: $scope.dashboard.beneficiaries,
							start_date: $scope.dashboard.startDate,
							end_date: $scope.dashboard.endDate
						}
					}

					request.data = angular.merge(request.data, obj);

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
							dashboard: 'cluster_dashboard',
							theme: theme,
							format: format,
							url: $location.$$path
						}
					}
				},

				// downloads
				getDownloads: function(){

					var downloads = [{
						id: 'cluster_dashboard_pdf',
						type: 'pdf',
						color: 'blue',
						icon: 'picture_as_pdf',
						hover: $filter('translate')('download_dashboard_as_pdf'),
						request: {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/print',
							data: {
								report:  $scope.dashboard.cluster_id + '_cluster_dashboard-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
								printUrl: $location.absUrl(),
								downloadUrl: ngmAuth.LOCATION + '/report/',
								user: $scope.dashboard.user,
								pageLoadTime: $scope.dashboard.pageLoadTime,
								viewportWidth: 1400
							}
						},
						metrics: $scope.dashboard.getMetrics( 'cluster_dashboard_pdf', 'pdf' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'call',
						hover: $filter('translate')('download_cluster_contact_list_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'contacts', report: $scope.dashboard.cluster_id_filename + '_contacts_list-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cluster_contact_list', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'assignment_turned_in',
						hover: $filter('translate')('download_ocha_hrp_report_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'ocha_report', report: $scope.dashboard.cluster_id_filename + '_ocha_hrp_report-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cluster_ocha_report', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'attach_money',
						hover: $filter('translate')('download_ocha_financial_report_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'financial_report', report: $scope.dashboard.cluster_id_filename + '_ocha_financial_report-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cluster_financial_report', 'csv' )
					},{
						id: 'training_participants',
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'wc',
						hover: $filter('translate')('download_training_participants_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'training_participants', report: $scope.dashboard.cluster_id_filename + '_training_participants_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'training_participants', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'group',
						hover: $filter('translate')('download_beneficiary_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'beneficiaries', report: $scope.dashboard.activity_filename + $scope.dashboard.cluster_id_filename + '_beneficiary_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'beneficiary_data', 'csv' )
					},{
						type: 'csv',
						color: 'blue lighten-2',
						icon: 'show_chart',
						hover: $filter('translate')('download_stock_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'stocks', report: $scope.dashboard.cluster_id_filename + '_stock_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'stocks', 'csv' )
					}];

					// ng wash dls
					var ng_wash_dl = [{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'compare_arrows',
						hover: $filter('translate')('download_accountability_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'accountability', report: $scope.dashboard.activity_filename + $scope.dashboard.cluster_id_filename + '_accountability_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'accountability_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'radio_button_checked',
						hover: $filter('translate')('download_borehol_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'boreholes', report: $scope.dashboard.cluster_id_filename + '_boreholes_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'borehole_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'local_activity',
						hover: $filter('translate')('download_cash_programming_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'cash', report: $scope.dashboard.cluster_id_filename + '_cash_programming-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'cash_programming', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'spa',
						hover: $filter('translate')('download_hygiene_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'hygiene', report: $scope.dashboard.cluster_id_filename + '_hygiene_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'hygiene_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'wc',
						hover: $filter('translate')('download_sanitarian_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'sanitation', report: $scope.dashboard.cluster_id_filename + '_sanitation_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'sanitation_data', 'csv' )
					},{
						type: 'csv',
						color: 'teal lighten-3',
						icon: 'local_drink',
						hover: $filter('translate')('download_water_data_as_csv'),
						request: $scope.dashboard.getRequest( { csv: true, indicator: 'water', report: $scope.dashboard.cluster_id_filename + '_water_data-extracted-from-' + $scope.dashboard.startDate + '-to-' + $scope.dashboard.endDate + '-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ) } ),
						metrics: $scope.dashboard.getMetrics( 'water_data', 'csv' )
					}];

					// NG, wash and Admin
					if ( $scope.dashboard.admin0pcode === 'ng' &&
								$scope.dashboard.cluster_id === 'wash' &&
								$scope.dashboard.user.roles.indexOf( 'ADMIN' ) !== -1  ) {
						downloads = downloads.concat ( ng_wash_dl );
					}

					// blocking download
					const canDownload = ngmAuth.canDo( 'DASHBOARD_DOWNLOAD', { 
															adminRpcode: $scope.dashboard.adminRpcode.toUpperCase(), 
															admin0pcode: $scope.dashboard.admin0pcode.toUpperCase(), 
															cluster_id: $scope.dashboard.cluster_id, 
															organization_tag: $scope.dashboard.organization_tag } )
					// filter downloads list
					if (!canDownload){
						downloads = downloads.filter(x => x.id === 'cluster_dashboard_pdf')
					}
					return downloads;
				},

				//
				setMenu: function(){

					// rows
					var orgRows = [],
							clusterRows = [],
							provinceRows = [],
							districtRows = [],
							request = $scope.dashboard.getRequest( { list: true, indicator: 'organizations' } );

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
										'href': '/desk/#/cluster/5w/afro/cd'
									},{
										'title': 'Ethiopia',
										'param': 'admin0pcode',
										'active': 'et',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/afro/et'
									},{
										'title': 'Nigeria',
										'param': 'admin0pcode',
										'active': 'ng',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/afro/ng'
									},{
										'title': 'South Sudan',
										'param': 'admin0pcode',
										'active': 'ss',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/afro/ss'
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
										'href': '/desk/#/cluster/5w/emro/af'
									},{
										'title': 'Somalia',
										'param': 'admin0pcode',
										'active': 'so',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/emro/so'
									},{
										'title': 'Syria',
										'param': 'admin0pcode',
										'active': 'sy',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/emro/sy'
									},{
										'title': 'Yemen',
										'param': 'admin0pcode',
										'active': 'ye',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/emro/ye'
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
										'href': '/desk/#/cluster/5w/searo/bd'
									},{
										'title': 'Cox Bazar',
										'param': 'admin0pcode',
										'active': 'cb',
										'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
										'href': '/desk/#/cluster/5w/searo/cb'
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
										'href': '/desk/#/cluster/5w/amer/col'
									}]
								}
							}
							$scope.model.menu.push(menu[$scope.dashboard.adminRpcode]);
						}
					}

					// get orgs
					ngmData.get( request ).then( function( organizations  ){

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
							var path = $scope.dashboard.getPath( d.cluster_id, 'all', $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
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

						// activity menu 
						if ( $scope.dashboard.cluster_id === 'protection' ) {
						
							$scope.model.menu.push({
								'search': false,
								'id': 'search-cluster-activity',
								'icon': 'assignment_turned_in',
								'title': $filter('translate')('activity'),
								'class': 'teal lighten-1 white-text',
								'rows': [{
									'title': $filter('translate')('all_mayus'),
									'param': 'activity_type_id',
									'active': 'all',
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + $scope.dashboard.getPath( $scope.dashboard.cluster_id, 'all', $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode )
								},{
									'title': 'CPiE',
									'param': 'activity_type_id',
									'active': 'cpie',
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + $scope.dashboard.getPath( $scope.dashboard.cluster_id, 'cpie', $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode )
								},{
									'title': 'GBV',
									'param': 'activity_type_id',
									'active': 'gbv',
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
									'href': '/desk/#' + $scope.dashboard.getPath( $scope.dashboard.cluster_id, 'gbv', $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode )
								}]
							});
						}

						// organizations
						organizations.forEach(function( d, i ){
							if ( d ) {
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, d.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
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
						if ($scope.dashboard.menu_items.includes('organization_tag') && $scope.dashboard.user.username !== 'welcome') {
				
							$scope.model.menu.push({
								'search': true,
								'id': 'search-cluster-organization',
								'icon': 'supervisor_account',
								'title': $filter('translate')('organization'),
								'class': 'teal lighten-1 white-text',
								'rows': orgRows
							});

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
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag, d.admin1pcode, 'all' );
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
								var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, d.admin2pcode );
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
					$scope.dashboard.title = '5W'
				
					// admin0
					if ( $scope.dashboard.admin0pcode === 'all' ) {
						$scope.dashboard.title = '5W | ' + $scope.dashboard.adminRpcode.toUpperCase()
					}

					if ( $scope.dashboard.admin0pcode !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.admin0pcode.toUpperCase();
					}
					// cluster
					if ( $scope.dashboard.cluster_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.cluster.cluster.toUpperCase();
					}
					// activity
					if ( $scope.dashboard.activity_type_id !== 'all' ) {
						$scope.dashboard.title += ' | ' + $scope.dashboard.activity_type_id.toUpperCase();
					}
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
					$scope.dashboard.subtitle = '5W Dashboard '+ $filter('translate')('for')+' ';
					// admin0
					if ( $scope.dashboard.admin0pcode === 'all' ) {
						$scope.dashboard.subtitle = '5W Dashboard '+ $filter('translate')('for') + ' ' + $scope.dashboard.adminRpcode.toUpperCase();
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
					if ( $scope.dashboard.activity_type_id !== 'all' ) {
						$scope.dashboard.subtitle += ', ' + $scope.dashboard.activity_type_id.toUpperCase();
					}
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
					$scope.dashboard.beneficiaries = $route.current.params.beneficiaries.split('+');
					$scope.dashboard.activity_type_id = $route.current.params.activity_type_id;

					// plus dashboard_visits
					$scope.dashboard.user.dashboard_visits++;
					localStorage.setObject( 'auth_token', $scope.dashboard.user );

					// report name
					$scope.dashboard.report += moment().format( 'YYYY-MM-DDTHHmm' );

					// filename cluster needs to be mpc for cvwg
					// TODO refactor/update cvwg
					$scope.dashboard.cluster_id_filename = $scope.dashboard.cluster_id !== 'cvwg' ? $scope.dashboard.cluster_id : 'mpc'

					if ($route.current.params.activity_type_id!=='all'){
						$scope.dashboard.activity_filename = $route.current.params.activity_type_id + '_';
					}

					if ($route.current.params.activity_type_id==='all'){
						$scope.dashboard.activity_filename = '';
					}

					$scope.dashboard.beneficiaries_row = [{
						styleClass: 's12 m12 l4',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: $filter('translate')('individual_households'),
								request: $scope.dashboard.getRequest({ indicator: 'households_population' })
							}
						}]
					}, {
						styleClass: 's12 m12 l4',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: $filter('translate')('individual_beneficiaries'),
								request: $scope.dashboard.getRequest({ indicator: 'beneficiaries_population' })
							}
						}]
					}, {
						styleClass: 's12 m12 l4',
						widgets: [{
							type: 'stats',
							style: 'text-align: center;',
							card: 'card-panel stats-card white grey-text text-darken-2',
							config: {
								title: $filter('translate')('services_to_beneficiaries'),
								request: $scope.dashboard.getRequest({ indicator: 'beneficiaries' })
							}
						}]
					}];

					if ($scope.dashboard.admin0pcode.toUpperCase() === 'AF') {
						$scope.dashboard.beneficiaries_row = [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'stats',
								style: 'text-align: center;',
								card: 'card-panel stats-card white grey-text text-darken-2',
								config: {
									title: $filter('translate')('services_to_beneficiaries'),
									request: $scope.dashboard.getRequest({ indicator: 'beneficiaries' })
								}
							}]
						}]						
					}

					// model
					$scope.model = {
						name: 'cluster_dashboard',
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
											var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
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
											var path = $scope.dashboard.getPath( $scope.dashboard.cluster_id, $scope.dashboard.activity_type_id, $scope.dashboard.organization_tag, $scope.dashboard.admin1pcode, $scope.dashboard.admin2pcode );
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
										templateUrl: '/scripts/widgets/ngm-html/template/cluster.dashboard.html'
									}
								}]
							}]
						},{
							columns: [{
								styleClass: 's12 m6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('active_organizations'),
										request: $scope.dashboard.getRequest( { indicator: 'organizations' } )
									}
								}]
							},{
								styleClass: 's12 m6',
								widgets: [{
									type: 'stats',
									style: 'text-align: center;',
									card: 'card-panel stats-card white grey-text text-darken-2',
									config: {
										title: $filter('translate')('active_projects'),
										request: $scope.dashboard.getRequest( { indicator: 'projects' } )
									}
								}]
							}]
						},{
							columns: $scope.dashboard.beneficiaries_row
						},{
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
						},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'html',
									card: 'card-panel',
									style: 'padding:0px;',
									config: {
										html: '<h2 class="col s12 report-title" style="margin-top: 20px; padding-bottom: 5px; font-size: 3.0rem; color: #2196F3; border-bottom: 3px #2196F3 solid;">'+$filter('translate')('project_locations')+'</h2>'
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
										title: $filter('translate')('active_locations'),
										request: $scope.dashboard.getRequest( { indicator: 'locations' } )
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
										request: $scope.dashboard.getRequest( { indicator: 'markers' } )
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

					// remove training participants for AF
					if ($scope.dashboard.admin0pcode.toUpperCase() === 'AF'){
						$scope.model.header.download.downloads = $scope.model.header.download.downloads.filter(function( obj ) {
							return obj.id !== 'training_participants';
						  });
					}
					
					// disallow public download
					if ($scope.dashboard.user.username === 'welcome'){
						$scope.model.header.download.downloads = $scope.model.header.download.downloads.filter(function( obj ) {
							return obj.id === 'cluster_dashboard_pdf';
						  });
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
					var visit = angular.merge( $scope.dashboard.getMetrics( $scope.dashboard.cluster_id + '_cluster_dashboard', 'view' ), { async: true } );
					$http( visit ).success( function( data ) {;
		         // success
		      }).error( function( data ) {;
		         console.log('error!');
		      });

				}

			};

			// if lists
			if ( $scope.dashboard.lists.admin1.length ) {

				// set dashboard
				$scope.dashboard.init();

				// assign to ngm app scope ( for menu )
				$scope.dashboard.ngm.dashboard.model = $scope.model;

			}

			// if none
			if ( !$scope.dashboard.lists.admin1.length ) {

				// lists
				var requests = {
					getAdmin1List: ngmAuth.LOCATION + '/api/list/getAdmin1List',
					getAdmin2List: ngmAuth.LOCATION + '/api/list/getAdmin2List'
				}

				// send request
				$q.all([
					$http.get( requests.getAdmin1List ),
					$http.get( requests.getAdmin2List ) ]).then( function( results ) {

					// set dashboard lists
					$scope.dashboard.lists.admin1 = results[0].data;
					$scope.dashboard.lists.admin2 = results[1].data;

					// set in localstorage
					localStorage.setObject( 'lists', { admin1List: results[0].data, admin2List: results[1].data } );

					// set dashboard
					$scope.dashboard.init();

					// assign to ngm app scope ( for menu )
					$scope.dashboard.ngm.dashboard.model = $scope.model;

				});

			}

		}

	]);
