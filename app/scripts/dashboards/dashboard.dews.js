'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDewsCtrl', ['$scope', '$http', '$route', 'appConfig', function ($scope, $http, $route, appConfig) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$scope.dews = {

			data: {
				'avh': 'Acute Viral Hepatitis',
				'cchf': 'CCHF',
				'chickenpox': 'Chickenpox',
				'cholera': 'Cholera',
				'conjunctivitis': 'Conjunctivitis',
				'rabies': 'Dog bites/Rabies',
				'food-poisoning': 'Food poisoning',
				'psychogenic': 'Mass psychogenic',
				'measles': 'Measles',
				'mumps': 'Mumps',
				'pertussis': 'Pertussis',
				'pneumonia': 'Pneumonia',
				'scabies': 'Scabies'
			},

			// return rows for DEWS menu
			getRows: function() {
				
				// menu rows
				var rows = [];

				// for each disease
				angular.forEach($scope.dews.data, function(d, key){
					rows.push({
						'title': d,
						'class': 'waves-effect waves-teal',
						'param': 'disease',
						'active': key,
						'href': '#/dashboard/' + key
					});
				});

				return rows;
			}
		}

		var model = {
			title: {
				
				// div style
				divClass: 'report-header',
				divStyle: 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;',
				
				// title style
				title: $scope.dews.data[$route.current.params.disease],
				titleStyle: 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
				
				// subtitle
				subtitle: 'Disease Early Warning System Key Indicators for ' + $scope.dews.data[$route.current.params.disease],
				subtitleClass: 'report-subtitle',
				
				// downloads
				downloadClass: 'report-download',
				// downloads: [{
				//  	title: 'Download ' + $scope.dews.data[$route.current.params.disease] +  ' Report as CSV',
				//  	color: 'grey',
				// 	icon: 'ic_assignment_returned',
				// 	url: appConfig.host + ':1337/dews/map?disease=' + $scope.dews.data[$route.current.params.disease]
				// }]
			},
			subtitle: 'MoPH Disease Early Warning System Key Indicators',
			menu: [{
				'title': 'Disease',
				'class': 'collapsible-header waves-effect waves-teal',
				'rows': $scope.dews.getRows()
			}],
			rows: [{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Outbreaks',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/outbreaks',
								data: {
									indicator: 'total',
									disease: $scope.dews.data[$route.current.params.disease]
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Individual Cases',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/incidents',
								data: {
									type: 'incidents',
									indicator: 'total',
									disease: $scope.dews.data[$route.current.params.disease]
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Deaths',							
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/incidents',
								data: {
									type: 'deaths',
									indicator: 'total',
									disease: $scope.dews.data[$route.current.params.disease]
								}
							}
						}
					}]
				}],
			},{
				columns: [{
					styleClass: 's12 m12 l12',
					widgets: [{
						type: 'calHeatmap',
						card: 'card-panel',
						style: 'padding-top:5px;',
						config: {
							request: {
								method: 'GET',
								url: appConfig.host + ':1337/dews/calendar?disease=' + $scope.dews.data[$route.current.params.disease]
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
							display: {
								type: 'marker'
							},
							request: {
								method: 'GET',
								url: appConfig.host + ':1337/dews/map?disease=' + $scope.dews.data[$route.current.params.disease]
							}							
						}
					}]
				}]
			}]
		};

		$scope.name = 'dews_dashboard';
		$scope.model = model;

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard = $scope.model;
		
	}]);