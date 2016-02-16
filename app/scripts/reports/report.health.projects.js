/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectsCtrl
 * @description
 * # ReportHealthProjectsCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportHealthProjectsCtrl', ['$scope', '$location', 'ngmData', 'ngmUser', function ($scope, $location, ngmData, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// 
		$scope.model = {
			rows: [{}]			
		}

		// empty Project
		$scope.report = {
			
			// parent
			ngm: $scope.$parent.ngm

		};


		// report object
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// complete
			complete: [{
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Review Week 1"><i class="material-icons circle white teal-text">done</i><span class="title">Week 1</span><p>Disease Outbreaks</p><a href="" title="Download Week 1" class="secondary-content"><i class="material-icons">send</i></a></a>'
			},{
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Review Week 2"><i class="material-icons circle white teal-text">done</i><span class="title">Week 2</span><p>Disease Outbreaks</p><a href="" title="Download Week 2" class="secondary-content"><i class="material-icons">send</i></a></a>'
			},{
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Review Week 3"><i class="material-icons circle white teal-text">done</i><span class="title">Week 3</span><p>Disease Outbreaks</p><a href="" title="Download Week 3" class="secondary-content"><i class="material-icons">send</i></a></a>'
			},{
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Review Week 4"><i class="material-icons circle white teal-text">done</i><span class="title">Week 4</span><p>Disease Outbreaks</p><a href="" title="Download Week 4" class="secondary-content"><i class="material-icons">send</i></a></a>'
			}]

		}

		// report dashboard model
		$scope.model = {
			name: 'report_health_overview',
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
			menu: [{
				'icon': 'location_on',
				'title': 'Projects',
				// 'class': 'teal lighten-1 white-text',
				'class': 'teal-text',
				rows: [{
					'title': 'Create New Project',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'project',
					'active': 'active',
					'href': '#/health/projects/new'
				}]
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel white grey-text text-darken-2',
						config: {
							html: '<a class="waves-effect waves-light btn" href="#/health/projects/new"><i class="material-icons left">add_circle_outline</i>Add New Project</a>'
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel white grey-text text-darken-2',
						config: {
							title: 'Active',
							icon: 'edit',
							templateUrl: '/scripts/widgets/ngm-html/template/health.project.list.html',							
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/getProjectList',
								data: {
									organization_id: ngmUser.get().organization_id,
									project_status: 'active'
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
						card: 'card-panel white grey-text text-darken-2',
						style: 'padding-bottom: 50px;',
						config: {
							title: 'Complete',
							icon: 'done',
							// page: true,
							templateUrl: '/scripts/widgets/ngm-html/template/health.project.list.html',							
							request: {
								method: 'POST',
								url: 'http://' + $location.host() + '/api/health/getProjectList',
								data: {
									organization_id: ngmUser.get().organization_id,
									project_status: 'complete'
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