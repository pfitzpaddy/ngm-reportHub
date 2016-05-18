/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectAppCtrl', ['$scope', '$location', '$q', '$http', 'ngmData', 'ngmUser', function ($scope, $location, $q, $http, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// report object
		$scope.report = {

			// ngm
			ngm: $scope.$parent.ngm,

			// form to add new project
			newProjectUrl: '#/health/projects/details/new',

			// province lists
			provinceListRequest: $http({
				method: 'GET',
				url: 'http://' + $location.host() + '/api/location/getProvinceList'
			}),

			// district lists
			districtListRequest: $http({
				method: 'GET',
				url: 'http://' + $location.host() + '/api/location/getDistrictList'
			})

		}

		// get all lists 
		// if ( localStorage.getItem( 'lists' ) ) {

			// send request
			$q.all([ $scope.report.provinceListRequest, $scope.report.districtListRequest ]).then( function( results ){

				// set lists to local storage
				localStorage.setItem( 'lists', true );
				localStorage.setItem( 'provinceList', JSON.stringify(results[0].data) );
				localStorage.setItem( 'districtList', JSON.stringify(results[1].data) );

			});

		// }

		// report dashboard model
		$scope.model = {
			name: 'report_health_list',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: ngmUser.get().organization + ' | Health Projects',
					style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'Health projects for ' + ngmUser.get().organization,
				}
			},
			// menu: [{
			// 	'icon': 'add_circle_outline',
			// 	'title': 'Add New Project',
			// 	'class': 'teal-text',
			// 	'href': $scope.report.newProjectUrl
			// 	// rows: [{
			// 	// 	'title': 'Add New Project',
			// 	// 	'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
			// 	// 	'param': 'project',
			// 	// 	'active': 'active',
			// 	// 	'href': $scope.report.newProjectUrl
			// 	// }]
			// }],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'white grey-text text-darken-2',
						style: 'padding: 20px;',
						config: {
							html: '<a class="waves-effect waves-light btn" href="' + $scope.report.newProjectUrl + '"><i class="material-icons left">add_circle_outline</i>Add New Project</a>'
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
							color: 'blue lighten-4',
							// textColor: 'white-text',
							title: 'Active',
							icon: 'edit',
							newProjectUrl: $scope.report.newProjectUrl,
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/project/getProjectsList',
								data: {
									filter: { 
										organization_id: ngmUser.get().organization_id,
										project_status: 'active'
									}
								}
							}
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
							color: 'blue lighten-4',
							title: 'Complete',
							icon: 'done',
							newProjectUrl: $scope.report.newProjectUrl,
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/project/getProjectsList',
								data: {
									filter: { 
										organization_id: ngmUser.get().organization_id,
										project_status: 'complete'
									}
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
							html: $scope.report.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.report.ngm.dashboard.model = $scope.model;
		
	}]);