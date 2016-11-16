/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectAppCtrl
 * @description
 * # ClusterProjectAppCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectAppCtrl', ['$scope', '$location', '$q', '$http', '$route', 'ngmData', 'ngmUser', function ( $scope, $location, $q, $http, $route, ngmData, ngmUser ) {
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
			newProjectUrl: '#/cluster/projects/details/new',

			// placeholders
			title: '',
			subtitle: '',

			// province lists
			admin1ListRequest: {
				method: 'POST',
				url: 'http://' + $location.host() + '/api/location/getAdmin1List',
				data: {
					'admin0pcode': ngmUser.get().admin0pcode
				}
			},

			// district lists
			admin2ListRequest: {
				method: 'POST',
				url: 'http://' + $location.host() + '/api/location/getAdmin2List',
				data: {
					'admin0pcode': ngmUser.get().admin0pcode
				}				
			},

			// get organization
			getOrganization: function( organization_id ){

				// return http
				return {
					method: 'POST',
					url: 'http://' + $location.host() + '/api/getOrganization',
					data: {
						'organization_id': organization_id
					}
				}
			}

		}

		// localStorage.removeItem( 'provinceList' );

		// get all lists 
		// if ( localStorage.getItem( 'lists' ) ) {

			// send request
			$q.all([ $http( $scope.report.admin1ListRequest ), $http( $scope.report.admin2ListRequest ) ]).then( function( results ){

				// set lists to local storage
				localStorage.setItem( 'lists', true );
				localStorage.setItem( 'admin1List', JSON.stringify(results[0].data) );
				localStorage.setItem( 'admin2List', JSON.stringify(results[1].data) );

			});

		// }

		// org id
		$scope.report.organization_id = $route.current.params.organization_id ? $route.current.params.organization_id : ngmUser.get().organization_id;

		// get data
		ngmData.get( $scope.report.getOrganization( $scope.report.organization_id ) ).then( function( organization ){

			// set model titles
			$scope.model.header.title.title = organization.admin0name.toUpperCase().substring(0, 3) + ' | ' + organization.cluster.toUpperCase() + ' | ' + organization.organization_display_name + ' | Projects';
			$scope.model.header.subtitle.title = organization.cluster + ' projects for ' + organization.organization_display_name + ' ' + organization.admin0name;

		});

		// report dashboard model
		$scope.model = {
			name: 'cluster_project_list',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
					title: $scope.report.title
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle hide-on-small-only',
					title: $scope.report.subtitle
				}
			},
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
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/cluster/project/getProjectsList',
								data: {
									filter: { 
										organization_id: $scope.report.organization_id,
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
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/cluster/project/getProjectsList',
								data: {
									filter: { 
										organization_id: $scope.report.organization_id,
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
