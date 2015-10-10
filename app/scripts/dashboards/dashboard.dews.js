'use strict';

/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:DashboardDewsCtrl
 * @description
 * # LoginCtrl
 * Controller of the ngmReportHub
 */
angular.module('ngmReportHub')
	.controller('DashboardDewsCtrl', ['$scope', '$http', 'appConfig', function ($scope, $http, appConfig) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		var model = {
			title: ' ',
			rows: [{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							//title: 'Outbreaks',
							title: 'Flood Affected',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/outbreaks',
								data: {
									indicator: 'total',
									disease: 'Measles'
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
									disease: 'Measles'
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
									disease: 'Measles'
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
						config: {}
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
							defaults: {
								center: {
									zoom: 7
								}
							}
						}
					}]
				}]
			}]	
				/*
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Province Outbreaks',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/outbreaks',
								data: {
									indicator: 'province',
									disease: 'Measles'
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
							title: 'District Outbreaks',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/outbreaks',
								data: {
									indicator: 'district',
									disease: 'Measles'
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
							title: 'Outbreaks Total',							
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/outbreaks',
								data: {
									indicator: 'total',
									disease: 'Measles'
								}
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Under 5',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'incidents',
									indicator: 'under5',
									disease: 'Measles'
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
							title: 'Over 5',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'incidents',
									indicator: 'over5',
									disease: 'Measles'
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
							title: 'Incidents',								
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'incidents',
									indicator: 'total',
									disease: 'Measles'
								}
							}
						}
					}]
				}]
			},{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						config: {
							title: 'Under 5',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'deaths',
									indicator: 'under5',
									disease: 'Measles'
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
							title: 'Over 5',
							request: {
								method: 'POST',
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'deaths',
									indicator: 'over5',
									disease: 'Measles'
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
								url: appConfig.host + ':1337/dews/indicator',
								data: {
									type: 'deaths',
									indicator: 'total',
									disease: 'Measles'
								}
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
							defaults: {
								center: {
									zoom: 7
								}
							}
						}
					}]
				}]
			}]
			*/
		};

		$scope.name = 'DEWS Dashboard';
		$scope.model = model;
		
	}]);