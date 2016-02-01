/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportiFrameCtrl
 * @description
 * # ReportiFrameCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('ReportMenuCtrl', ['$scope', function ($scope) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// report object
		$scope.report = {

			// parent
			ngm: $scope.$parent.ngm,

			// todo
			todo: [{
				//report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="All ToDo complete!"><i class="material-icons circle white teal-text">thumb_up</i><span class="title">Disease Outbreaks</span><p>No pending ToDos!</p><a class="secondary-content"></a></a>'
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Complete Week 14"><i class="material-icons circle teal">insert_chart</i><span class="title">Week 14</span><p>Disease Outbreaks</p><a href="#/who/dews/report/active" title="Complete Week 14" class="secondary-content"><i class="material-icons">send</i></a></a>'
			}], 

			// pending
			pending: [{
				//report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="Review Week 14"><i class="material-icons circle teal">insert_chart</i><span class="title">Week 14</span><p>Disease Outbreaks</p><a href="#/who/dews/report/active" title="Review Week 14" class="secondary-content"><i class="material-icons">send</i></a></a>'
				report: '<a class="tooltipped" data-position="left" data-delay="50" data-tooltip="All reivews complete!"><i class="material-icons circle white teal-text">thumb_up</i><span class="title">Disease Outbreaks</span><p>No pending reports!</p><a class="secondary-content"></a></a>'
			}],			

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

		// panel height = window height - header - padding
		$scope.report.ngm.style.height = $scope.report.ngm.height - 160 - 10;

		// report dashboard model
		$scope.model = {
			name: 'report_dews',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					style: 'border-bottom: 3px ' + $scope.report.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m12 l12 report-title',
					title: 'WHO | DEWS | Outbreak Report',
					style: 'color: ' + $scope.report.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'col s12 m12 l12 report-subtitle',
					title: 'DEWS outbreak report',
				}
			},
			menu: [{
				'icon': 'zoom_in',
				'title': 'DEWS Report',
				'class': 'teal lighten-1 white-text',
				rows: [{
					'title': 'Active Report',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'report',
					'active': 'active',
					'href': '#/who/dews/report/active'
				},{
					'title': 'ToDo',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Pending',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Complete',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				}]
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: '<h4 class="report-work-title" style="margin-top:20px;">ToDo</h4>',
							templateUrl: '/scripts/widgets/ngm-html/template/dews_report.html',
							list: $scope.report.todo
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: '<h4 class="report-work-title">Pending</h4>',
							templateUrl: '/scripts/widgets/ngm-html/template/dews_report.html',
							list: $scope.report.pending
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel stats-card white grey-text text-darken-2',
						style: 'padding-bottom: 50px;',
						config: {
							title: '<h4 class="report-work-title" style="margin-top:20px;">Complete</h4>',
							templateUrl: '/scripts/widgets/ngm-html/template/dews_report.html',
							list: $scope.report.complete,
							page: true
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