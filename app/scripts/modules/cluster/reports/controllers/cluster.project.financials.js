/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterProjectFinancialsCtrl
 * @description
 * # ClusterProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ClusterProjectFinancialsCtrl', [
			'$scope', 
			'$route', 
			'$q', 
			'$http', 
			'$location', 
			'$anchorScroll',
			'$timeout', 
			'ngmAuth',
			'ngmData',
			'ngmUser', 
	function ( $scope, $route, $q, $http, $location, $anchorScroll, $timeout, ngmAuth, ngmData, ngmUser ) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// init empty model
		$scope.model = {
			rows: [{}]
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm,

			// placeholder
			project: {},

			// placeholder
			definition: {},
			
			// current user
			user: ngmUser.get(),

			// report name placeholder (is updated below)
			report: 'monthly_report',

			// get project
			getProject: $http({
				method: 'POST',
				url: ngmAuth.LOCATION + '/api/cluster/project/getProject',
				data: {
					id: $route.current.params.project
				}
			}),

			// set project details
			setProjectDetails: function( data ){

				// project
				$scope.report.project = data[0].data;

				// set report for downloads
				$scope.report.report = $scope.report.project.organization + '_' + $scope.report.project.cluster + '_' + $scope.report.project.project_title.replace(/\ /g, '_') + '_extracted-' + moment().format( 'YYYY-MM-DDTHHmm' );

				// add project code to subtitle?
				var text = 'Financial Reports for ' + $scope.report.project.project_title;
				var subtitle = $scope.report.project.project_code ?  $scope.report.project.project_code + ' - ' + text : text;

				// report dashboard model
				$scope.model = {
					name: 'cluster_project_report',
					header: {
						div: {
							'class': 'col s12 m12 l12 report-header',
							style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
						},
						title: {
							'class': 'col s12 m9 l9 report-title truncate',
							style: 'font-size: 3.4rem; color: ' + $scope.report.ngm.style.defaultPrimaryColor,
							title: $scope.report.project.admin0name.toUpperCase().substring(0, 3) + ' | ' + $scope.report.project.cluster.toUpperCase() + ' | ' + $scope.report.project.organization + ' | ' + $scope.report.project.project_title
						},
						subtitle: {
							'class': 'col s12 m12 l12 report-subtitle truncate hide-on-small-only',
							'title': subtitle
						},
						download: {}
					},
					rows: [{		
						columns: [{
							styleClass: 's12 m12 l12',
							widgets: [{
								type: 'project.financials',
								config: {
									style: $scope.report.ngm.style,
									project: $scope.report.project
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
				}

				// assign to ngm app scope
				$scope.report.ngm.dashboard.model = $scope.model;

			}			

		}

		// send request
		$q.all([ $scope.report.getProject ]).then( function( results ){

			// assign
			$scope.report.setProjectDetails( results );

		});
		
	}]);