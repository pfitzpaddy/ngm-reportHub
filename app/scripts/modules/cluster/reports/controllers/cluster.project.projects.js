/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectProjectsCtrl
 * @description
 * # ClusterProjectProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module( 'ngmReportHub' )
	.controller('ClusterProjectProjectsCtrl', ['$scope', '$location', '$route', 'ngmAuth', 'ngmData', 'ngmUser', 'ngmClusterHelper', '$translate', '$filter', '$rootScope', function ($scope, $location, $route, ngmAuth, ngmData, ngmUser, ngmClusterHelper, $translate, $filter, $rootScope ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = $scope.$parent.ngm.dashboard.model;

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// user
			user: ngmUser.get(),

			// user Menu
			userMenuItems: ngmAuth.getMenuParams('PROJECT'),

			// user restricted
			userRestricted: ngmAuth.getRouteParams('PROJECT'),

			// form to add new project
			newProjectUrl: '#/cluster/projects/details/new',

			// report download title
			report_title: ngmUser.get().organization_tag  +'_projects-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),

			// title
			title: ngmUser.get().organization + ' | ' + ngmUser.get().admin0name.toUpperCase().substring( 0, 3 ) + ' | '+$filter('translate')('projects_mayus1'),

			// subtitle
			subtitle: $filter('translate')('projects_for_mayus1')+' ' + ngmUser.get().organization + ' ' + ngmUser.get().admin0name,

			// get url
			getMenuUrl: function( cluster_id ){

				// default
				var url = '/desk/#/cluster/projects/list';
				
				// url
				url += '/' + $route.current.params.adminRpcode + '/' + $route.current.params.admin0pcode + '/' + $route.current.params.organization_tag + '/' + cluster_id;
				
				return url;
			},

			// organization
			getOrganizationHref: function() {
				var href = '#/cluster/organization';
				if ( $route.current.params.organization_id ) { href += '/' + $route.current.params.organization_id }
				return href;
			},

			// get organization
			getOrganization: function( organization_id ){

				// return http
				var request = {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/getOrganization',
					data: {
						'organization_id': organization_id
					}
				}

				// return
				return request;
			},

			// set the header titles
			setTitles: function(){
				
				// if org_id, get org data
				// if ( $route.current.params.organization_id ) {

					// fetch org data
				// 	ngmData
				// 		.get( $scope.report.getOrganization( $scope.report.organization_id ) )
				// 		.then( function( organization ){
								
				// 			// set titles
				// 			$scope.model.header.download.downloads[0].request.data.report = organization.organization_tag  +'_projects-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );
				// 			$scope.model.header.title.c = organization.organization + ' | ' + organization.admin0name.toUpperCase().substring( 0, 3 ) + ' | '+$filter('translate')('projects_mayus1');
				// 			$scope.model.header.subtitle.title = $filter('translate')('projects_for_mayus1')+' ' + organization.organization + ' ' + organization.admin0name;
				// 			$scope.report.title = organization.organization + ' | ' + organization.admin0name.toUpperCase().substring(0, 3) + ' | ' + $filter('translate')('projects_mayus1');
				// 		});

				// }

					var countrylist = {
						all:'All',
						af: 'Afghanistan', bd: 'Bangladesh', cb: 'Cox Bazar',
						cd: 'Democratic Republic of Congo', et: 'Ethiopia',
						so: 'Somalia', ss: 'South Sudan', sy: 'Syria', ua: 'Ukraine',
						ye: 'Yemen', ng: 'Nigeria', col: 'Colombia'
					};				
					$scope.model.header.download.downloads[0].request.data.report = ''
					$scope.model.header.title.title = '';
					$scope.model.header.subtitle.title = ''
					$scope.report.title = '';
					if ($route.current.params.adminRpcode === 'all'){
						$scope.model.header.download.downloads[0].request.data.report = 'all'
						$scope.model.header.title.title = 'HQ'
						$scope.model.header.subtitle.title = 'All ' + $filter('translate')('projects_for_mayus1') + ' All Region '  
						$scope.report.title = 'HQ'
					}
					if ($route.current.params.adminRpcode !== 'all' && $route.current.params.admin0pcode === 'all') {
						$scope.model.header.download.downloads[0].request.data.report = $scope.report.adminRpcode
						$scope.model.header.title.title = $scope.report.adminRpcode.toUpperCase()
						$scope.model.header.subtitle.title = 'All ' + $filter('translate')('projects_for_mayus1') + ' Region ' + $scope.report.adminRpcode.toUpperCase()
						$scope.report.title = $scope.report.adminRpcode.toUpperCase
					}
					if ($route.current.params.admin0pcode !== 'all') {
						$scope.model.header.download.downloads[0].request.data.report = (countrylist[$scope.report.admin0pcode]).toLowerCase()
						$scope.model.header.title.title = (countrylist[$scope.report.admin0pcode]).toUpperCase().substring(0, 3)
						$scope.model.header.subtitle.title = 'All ' + $filter('translate')('projects_for_mayus1') + ' ' + (countrylist[$scope.report.admin0pcode])
						$scope.report.title = (countrylist[$scope.report.admin0pcode]).toUpperCase().substring(0, 3)
					}
					if($route.current.params.organization_tag !== 'all'){
						$scope.model.header.download.downloads[0].request.data.report = $scope.model.header.download.downloads[0].request.data.report + '_' + $scope.report.organization_tag
						$scope.model.header.title.title = $scope.model.header.title.title + " | " + $scope.report.organization_tag.toUpperCase()
						$scope.model.header.subtitle.title = $scope.model.header.subtitle.title + ' | Organization ' + $scope.report.organization_tag.toUpperCase()
						$scope.report.title = $scope.report.title + " | " + $scope.report.organization_tag.toUpperCase()
					}

					if ($route.current.params.cluster_id !== 'all') {
						$scope.model.header.download.downloads[0].request.data.report = $scope.model.header.download.downloads[0].request.data.report+'_'+ $scope.report.cluster_id
						$scope.model.header.title.title = $scope.model.header.title.title + " | " + $scope.report.cluster_id.toUpperCase()
						$scope.model.header.subtitle.title = $scope.model.header.subtitle.title +' | Cluster '+ $scope.report.cluster_id.toUpperCase()
						$scope.report.title = $scope.report.title + " | " + $scope.report.cluster_id.toUpperCase()
					}
					$scope.model.header.download.downloads[0].request.data.report = $scope.model.header.download.downloads[0].request.data.report + '_projects-extracted-' + moment().format('YYYY-MM-DDTHHmm');
					$scope.model.header.title.title = $scope.model.header.title.title + ' | ' + $filter('translate')('projects_mayus1');
					$scope.report.title = $scope.report.title + " | " + $scope.report.cluster_id.toUpperCase() + ' | ' + $filter('translate')('projects_mayus1');
			},

			// set Region Menu
			setRegionMenu: function () {				
				url = '/desk/#/cluster/projects/list';
				var region = ngmClusterHelper.getRegionMenu(url);
				$scope.model.menu.push(region);
			},

			// set Country Menu
			setCountryMenu: function (region) {
				
				var url = '/desk/#/cluster/projects/list/';
				var menu = ngmClusterHelper.getCountryMenu(url);				
				$scope.model.menu.push(menu[region]);
			},

			// set Organization Menu
			setOrgMenu: function () {
				// organization Menu

				var filterOrg;
				var region = $route.current.params.adminRpcode ? $route.current.params.adminRpcode : ngmUser.get().adminRpcode;
				var country = $route.current.params.admin0pcode ? $route.current.params.admin0pcode : ngmUser.get().admin0pcode;
				var cluster = $route.current.params.cluster_id ? $route.current.params.cluster_id : ngmUser.get().cluster_id;
				if ($route.current.params.admin0pcode !== 'all' && $route.current.params.cluster_id !== 'all') {

					filterOrg = {
						adminRpcode: region,
						admin0pcode: country,
						cluster_id: cluster,
					}
					// because afhanistan have one organization for one country
					if ($route.current.params.admin0pcode === 'af') {
						delete filterOrg.cluster_id
					}
				}
				if ($route.current.params.admin0pcode !== 'all' && $route.current.params.cluster_id === 'all') {
					filterOrg = {
						adminRpcode: region,
						admin0pcode: country,
					}
				}
				if ($route.current.params.adminRpcode !== 'all' && $route.current.params.admin0pcode === 'all') {
					filterOrg = {
						adminRpcode: region
					}
				}
				if ($route.current.params.adminRpcode === 'all') {
					filterOrg = {};
				}

				var req = {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/getOrganizationsByFilter',
					data: { filter: filterOrg }
				};
				ngmData.get(req).then(function (org) {

					
					
					var urlOrganization = '/desk/#/cluster/projects/list/' + $route.current.params.adminRpcode + '/' + $route.current.params.admin0pcode + '/';
					// org = org.filter((value, index, self) => self.map(x => x.organization_tag).indexOf(value.organization_tag) == index)
					listOrg = [{
						'title': $filter('translate')('all_min1'),
						'param': 'organization_tag',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': urlOrganization + 'all/' + $route.current.params.cluster_id
					}]
					angular.forEach(org, function (o, i) {
						listOrg.push({
							'title': o.organization,
							'param': 'organization_tag',
							'active': o.organization_tag,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': urlOrganization + o.organization_tag + '/' + $route.current.params.cluster_id
						});
					})
					orgMenu = {
						'search': true,
						'id': 'search-org',
						'icon': 'people',
						'title': 'Organization',
						'class': 'teal lighten-1 white-text',
						'rows': listOrg
					};
					$scope.model.menu.push(orgMenu);
				});
			},

			//set Cluster Menu
			setClusterMenu: function () {
				var region = $route.current.params.adminRpcode ? $route.current.params.adminRpcode : ngmUser.get().adminRpcode;
				var country = $route.current.params.admin0pcode ? $route.current.params.admin0pcode : ngmUser.get().admin0pcode;
				var organization_tag = $route.current.params.organization_tag ? $route.current.params.organization_tag : ngmUser.get().organization_tag;
				filterCluster = {
					adminRpcode: region,
					admin0pcode: country,
					organization_tag: organization_tag,
				}
				if ($route.current.params.admin0pcode !== 'all' && $route.current.params.organization_tag === 'all') {
					filterCluster = {
						adminRpcode: region,
						admin0pcode: country,
					}
				}
				if ($route.current.params.adminRpcode !== 'all' && $route.current.params.admin0pcode === 'all') {
					filterCluster = {
						adminRpcode: region
					}
				}
				if ($route.current.params.adminRpcode === 'all') {
					filterCluster = {};
				}
				ngmData
					.get(request = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/project/getProjectSectors',
						data: { filter : filterCluster }
					})
					.then(function (sectors) {
						sectorRows = [{
							'title': $filter('translate')('all_min1'),
							'param': 'cluster_id',
							'active': 'all',
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': $scope.report.getMenuUrl('all')
						}];
						// for each sector
						angular.forEach(sectors, function (d, i) {
							sectorRows.push({
								'title': (($scope.report.user.admin0pcode.toLowerCase() !== 'col' && d.cluster_id === 'health') ? 'Health' : d.cluster),
								'param': 'cluster_id',
								'active': d.cluster_id,
								'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
								'href': $scope.report.getMenuUrl(d.cluster_id)
							});
						});
						var cluster = {
							'search': true,
							'id': 'search-sector',
							'icon': 'camera',
							'title': 'Sector',
							'class': 'teal lighten-1 white-text',
							'rows': sectorRows
						}
						$scope.model.menu.push(cluster);
					});
			},

			// set menu
			setMenu: function (userMenuItems){
				// get menu
				// ngmData
				// 	.get( request = {
				// 					method: 'POST',
				// 					url: ngmAuth.LOCATION + '/api/cluster/project/getProjectSectors',
				// 					data: { organization_id: $scope.report.organization_id }
				// 	} )
				// 	.then( function( sectors ){

				// 		// for each sector
				// 		angular.forEach( sectors, function( d, i ){
				// 			$scope.model.menu[ 0 ].rows.push({
				// 				'title': d.cluster,
				// 				'param': 'cluster_id',
				// 				'active': d.cluster_id,
				// 				'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
				// 				'href': $scope.report.getMenuUrl( d.cluster_id )
				// 			});
				// 		});
				// 	});
				if (userMenuItems.includes('adminRpcode')) {
					$scope.report.setRegionMenu();
				}
				if (userMenuItems.includes('admin0pcode')) {
					$scope.report.setCountryMenu($scope.report.adminRpcode.toLowerCase());
				}
				if (userMenuItems.includes('cluster_id')) {
					$scope.report.setClusterMenu();
				}

				if (userMenuItems.includes('organization_tag')) {
					$scope.report.setOrgMenu();
				}

			},
			getQuery:function(){
				query={};
				if ($scope.report.adminRpcode !== 'all') {
					query.adminRpcode = $scope.report.adminRpcode;
				};

				if ($scope.report.admin0pcode !== 'all') {
					query.admin0pcode = $scope.report.admin0pcode;
				};

				if ($route.current.params.cluster_id !== 'all') {
					query.cluster_id = $scope.report.cluster_id;
				}

				if ($route.current.params.organization_tag !== 'all') {
					query.organization_tag = $scope.report.organization_tag;
				}
				var admin_org = ["OCHA", "iMMAP"];
				if ($scope.report.user.roles.find(rol => rol === "COUNTRY") &&
					$scope.report.user.admin0pcode === "COL" && //delete to enable for all countries
					admin_org.includes($scope.report.user.organization)) {

					query = {						
						admin0pcode: $scope.report.user.admin0pcode
					};
				}
				return query;
			},
			// fetches request for project list
			getProjectRequest: function( project_status ) {
				
				// filter
				// var filter = {
				// 		organization_tag: $scope.report.organization_tag,
				// 		project_status: project_status
				// 	}

				var filter ={
					project_status: project_status
				}
				if ($scope.report.adminRpcode !== 'all') {
					filter.adminRpcode = $scope.report.adminRpcode;
				};

				if ($scope.report.admin0pcode !== 'all') {
					filter.admin0pcode = $scope.report.admin0pcode;
				};

				if ($route.current.params.cluster_id !== 'all') {
					filter.cluster_id = $scope.report.cluster_id;
				}

				if ($route.current.params.organization_tag !== 'all') {
					filter.organization_tag = $scope.report.organization_tag;
				}
				// if ($route.current.params.admin0pcode && $route.current.params.admin0pcode !== 'all') {
				// 	filter = {
				// 		adminRpcode: $scope.report.adminRpcode,
				// 		admin0pcode: $scope.report.admin0pcode,
				// 		project_status: project_status
				// 	}
				// }
				// if ($route.current.params.adminRpcode !== 'all' && $route.current.params.admin0pcode === 'all') {
				// 	filter = {
				// 		adminRpcode: $scope.report.adminRpcode,
				// 		project_status: project_status
				// 	}
				// }
				// if ($route.current.params.adminRpcode === 'all') {
				// 	filter = { project_status: project_status }
				// }


					var admin_org = ["OCHA", "iMMAP"];
				    if( $scope.report.user.roles.find(rol => rol === "COUNTRY") && 
						$scope.report.user.admin0pcode === "COL" && //delete to enable for all countries
						admin_org.includes($scope.report.user.organization)){
					    
					    filter = {
							project_status: project_status,
							admin0pcode: $scope.report.user.admin0pcode 
						};
					}
				
				// add cluster
				// if ( $scope.report.cluster_id !== 'all' ) {
				// 	filter = angular.merge( filter, { cluster_id: $scope.report.cluster_id } );
				// }
				
				
				
				// get projects
				var request = {
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/project/getProjectsList',
							data: { filter: filter }
						}

				// return
				return request;

			},			
			setUrl:function(){
				if ($scope.report.userRestricted.length){
					out_zone =false
					$scope.report.userRestricted.forEach(function (e) {
						if($route.current.params[e] !== $scope.report[e]){
							out_zone = true	
						}
					})
					if(out_zone){
						path = '/cluster/projects/list/' + $scope.report.adminRpcode + '/' + $scope.report.admin0pcode + '/' + $scope.report.organization_tag + '/' + $scope.report.cluster_id;
						$location.path(path);
					}
				}
			},

			// init
			init: function() {

				// org id
				$scope.report.organization_id =
						$route.current.params.organization_id ? $route.current.params.organization_id : ngmUser.get().organization_id;

				// org tag
				$scope.report.organization_tag =
						$route.current.params.organization_tag ? $route.current.params.organization_tag : ngmUser.get().organization_tag;

				// sector
				$scope.report.cluster_id = 
						$route.current.params.cluster_id ? $route.current.params.cluster_id : ngmUser.get().cluster_id;
				
				// country
				$scope.report.admin0pcode = $route.current.params.admin0pcode ? $route.current.params.admin0pcode : ngmUser.get().admin0pcode;

				// region
				$scope.report.adminRpcode = $route.current.params.adminRpcode ? $route.current.params.adminRpcode : ngmUser.get().adminRpcode;
				
				// restricted zone
				if ($scope.report.userRestricted.length) {					
					for (const key of $scope.report.userRestricted) {
						$scope.report[key] = $scope.report.user[key].toLowerCase()						
					}					
				}
				// console.log($)
				$scope.report.setUrl();

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_list',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
							title: $scope.report.subtitle
						},
						download: {
							'class': 'col s12 m3 l3 hide-on-small-only',
							downloads: [{
								type: 'csv',
								color: 'blue lighten-2',
								icon: 'assignment',
								hover: $filter('translate')('download_project_summaries_as_csv'),
								request: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/cluster/project/getProjects',
									data: {
										details: 'projects',
										report: $scope.report.report_title +'_projects-extracted-' + moment().format( 'YYYY-MM-DDTHHmm' ),
										query: $scope.report.getQuery(),
										csv:true
									}
								},
								metrics: {
									method: 'POST',
									url: ngmAuth.LOCATION + '/api/metrics/set',
									data: {
										organization: $scope.report.user.organization,
										username: $scope.report.user.username,
										email: $scope.report.user.email,
										dashboard: 'projects list',
										theme: 'organization_projects_details',
										format: 'csv',
										url: $location.$$path

									}
								}
							}]

						}
					},
					menu:[],
					// menu:[{
					// 	// 'search': true,
					// 	'id': 'search-sector',
					// 	'icon': 'camera',
					// 	'title': 'Sector',
					// 	'class': 'teal lighten-1 white-text',
					// 	'rows': [{
					// 		'title': $filter('translate')('all_min1'),
					// 		'param': 'cluster_id',
					// 		'active': 'all',
					// 		'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					// 		'href': $scope.report.getMenuUrl( 'all' )
					// 	}]
					// }],
					rows: [{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'html',
								card: 'white grey-text text-darken-2',
								style: 'padding: 20px;',
								config: {
									html: '<a class="btn-flat waves-effect waves-teal left hide-on-small-only" href="' + $scope.report.getOrganizationHref() + '"><i class="material-icons left">keyboard_return</i>'+$filter('translate')('back_to_organization')+'</a><a class="waves-effect waves-light btn right" href="' + $scope.report.newProjectUrl + '"><i class="material-icons left">add_circle_outline</i>'+$filter('translate')('add_new_project')+'</a>'
								}
							}]
						}]
					},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'list',
									card: 'white grey-text text-darken-2',
									config: {
										titleIcon: 'alarm_on',
										// color: 'teal lighten-4',
										color: 'orange lighten-1',
										textColor: 'white-text',
										title: 'Plan',
										icon: 'edit',
										request: $scope.report.getProjectRequest('plan'),
										templateUrl: '/scripts/widgets/ngm-list/template/hide_list.html',
									}
								}]
							}]
						},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'alarm_on',
									// color: 'teal lighten-4',
									color: 'blue lighten-1',
									textColor: 'white-text',
									title: $filter('translate')('active_projects'),
									icon: 'edit',
									request: $scope.report.getProjectRequest( 'active' )
								}
							}]
						}]
					},{
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'list',
								card: 'white grey-text text-darken-2',
								config: {
									titleIcon: 'done_all',
									// color: 'lime lighten-4',
									color: 'blue lighten-1',
									textColor: 'white-text',
									title: $filter('translate')('completed_projects'),
									icon: 'done',
									request: $scope.report.getProjectRequest( 'complete' )
								}
							}]
						}]
					},{
							columns: [{
								styleClass: 's12 m12 l12',
								widgets: [{
									type: 'list',
									card: 'white grey-text text-darken-2',
									config: {
										titleIcon: 'alarm_on',
										// color: 'teal lighten-4',
										color: 'grey lighten-1',
										textColor: 'white-text',
										title: 'Not Implemented',
										icon: 'edit',
										request: $scope.report.getProjectRequest('not_implemented'),
										templateUrl: '/scripts/widgets/ngm-list/template/hide_list.html',
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
									html: $scope.report.ngm.footer
								}
							}]
						}]
					}]
				};

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

				// set title
				$scope.report.setTitles();
				
				// set menus
				// $scope.report.setMenu();
				$scope.report.setMenu($scope.report.userMenuItems);
			}

		}		
		// init
		$scope.report.init();
		$scope.$on('$locationChangeSuccess', function (evt, absNewUrl, absOldUrl){
			
			var absOldUrl = absOldUrl.substring(absOldUrl.indexOf("/#") + 1);
			$rootScope.projecListPreviouseUrl = absOldUrl;
		}) 
		
	}]);
