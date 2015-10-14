'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDewsCtrl', ['$scope', '$http', '$location', '$route', 'appConfig', 'ngmUser', function ($scope, $http, $location, $route, appConfig, ngmUser) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		// dews object
		$scope.dews = {

			// current user
			user: ngmUser.getUser(),

			// data lookup
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

		// dews dashboard model
		var model = {
			header: {
				div: {
					'class': 'report-header',
					style: 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					title: $scope.dews.data[$route.current.params.disease],
					style: 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'report-subtitle',
					title: 'Disease Early Warning System Key Indicators for ' + $scope.dews.data[$route.current.params.disease],
				},
				download: {
					'class': 'report-download',
					downloads:[{
						icon: {
							color: '#616161'
						},
						filename: $route.current.params.disease + '-' + moment().format(),
						hover: 'Download ' + $scope.dews.data[$route.current.params.disease] +  ' Report as CSV',
						request: {
							method: 'GET',
							url: appConfig.host + ':1337/dews/data?disease=' + $scope.dews.data[$route.current.params.disease]
						},
						metrics: {
							method: 'POST',
							url: appConfig.host + ':1337/metrics/set',
							data: {
								organisation: $scope.dews.user.organisation,
								username: $scope.dews.user.username,
								email: $scope.dews.user.email,
								dashboard: 'dews',
								theme: $route.current.params.disease,
								format: 'csv',
								url: $location.$$path
							}
						}
					}]
				}
			},
			menu: [{
				title: 'Disease',
				class: 'collapsible-header waves-effect waves-teal',
				rows: $scope.dews.getRows()
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