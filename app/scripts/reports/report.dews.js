'use strict';

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
				report: '<i class="material-icons circle teal">insert_chart</i><span class="title">Week 14</span><p>Disease Outbreaks</p><a href="#/who/dews/report/active" title="Review Week 14" class="secondary-content"><i class="material-icons">send</i></a>'
			}], 

			// pending
			pending: [{
				report: '<i class="material-icons circle white teal-text">thumb_up</i><span class="title">Disease Outbreaks</span><p>No pending reports!</p><a class="secondary-content"></a>'
			}],			

			// complete
			complete: [{
				report: '<i class="material-icons circle white teal-text">done</i><span class="title">Week 1</span><p>Disease Outbreaks</p><a href="" title="Review Week 1" class="secondary-content"><i class="material-icons">send</i></a>'
			},{
				report: '<i class="material-icons circle white teal-text">done</i><span class="title">Week 2</span><p>Disease Outbreaks</p><a href="" title="Review Week 2" class="secondary-content"><i class="material-icons">send</i></a>'
			},{
				report: '<i class="material-icons circle white teal-text">done</i><span class="title">Week 3</span><p>Disease Outbreaks</p><a href="" title="Review Week 3" class="secondary-content"><i class="material-icons">send</i></a>'
			},{
				report: '<i class="material-icons circle white teal-text">done</i><span class="title">Week 4</span><p>Disease Outbreaks</p><a href="" title="Review Week 4" class="secondary-content"><i class="material-icons">send</i></a>'
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
				title: 'DEWS Report',
				'class': 'collapsible-header waves-effect waves-teal',
				rows: [{
					'title': 'Active Report',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'active',
					'href': '#/who/dews/report/active'
				},{
					'title': 'ToDo',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Pending',
					'class': 'waves-effect waves-teal',
					'param': 'report',
					'active': 'false',
					'href': '#/who/dews/report'
				},{
					'title': 'Complete',
					'class': 'waves-effect waves-teal',
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
							title: '<h2 class="report-title">ToDo</h2>',
							template: 'widgets/ngm-html/template/dews_report.html',
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
							title: '<h2 class="report-title">Pending</h2>',
							template: 'widgets/ngm-html/template/dews_report.html',
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
						style: 'padding-bottom: 60px;',
						config: {
							title: '<h2 class="report-title">Complete</h2>',
							template: 'widgets/ngm-html/template/dews_report.html',
							list: $scope.report.complete,
							page: true
						}
					}]
				}]				
				// columns: [{
				// 	styleClass: 's12 m12 l12',
				// 	widgets: [{
				// 		type: 'iframe',
				// 		card: '',
				// 		style: 'padding-top: 30px; height: 1425px;',
				// 		config: {
				// 			div: '.paper',
				// 			url: 'http://52.24.183.157:3000/_/#YYYz',
				// 		}
				// 	}]
				// }]
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'html',
						card: 'card-panel',
						style: 'padding:0px; height: 120px;',
						config: {
							html: '<div style="background-color: #FFF; height: 140px;"></div>' + $scope.report.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard.model = $scope.model;
		
	}]);