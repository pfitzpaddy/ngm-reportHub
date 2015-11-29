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
		
		if ($scope.$parent.ngm.dashboard.model.name === 'who_dews_dashboard') {
			// set dashboard local $scope from $parent
			$scope.dews = $scope.$parent.ngm.dashboard.config;
			$scope.model = $scope.$parent.ngm.dashboard.model;
		} else {
			// create dews object
			$scope.dews = {

				// parent
				ngm: $scope.$parent.ngm,

				// current user
				user: ngmUser.get(),

				// start date = now - 6 months
				startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
				
				// end date = now
				endDate: new Date(),

				// data lookup
				data: {
					disease: {
						'all': { id:'*', name:'All'},
						'avh': { id:'avh', name:'Acute Viral Hepatitis'},
						'cchf': { id:'cchf', name:'CCHF'},
						'chickenpox': { id:'chickenpox', name:'Chickenpox'},
						'cholera': { id:'cholera', name:'Cholera'},
						'conjunctivitis': { id:'conjunctivitis', name:'Conjunctivitis'},
						'rabies': { id:'rabies', name:'Dog bites/Rabies'},
						'food-poisoning': { id:'food-poisoning', name:'Food Poisoning'},
						'psychogenic': { id:'psychogenic', name:'Mass Psychogenic'},
						'measles': { id:'measles', name:'Measles'},
						'mumps': { id:'mumps', name:'Mumps'},
						'pertussis': { id:'pertussis', name:'Pertussis'},
						'pneumonia': { id:'pneumonia', name:'Pneumonia'},
						'scabies': { id:'scabies', name:'Scabies'}
					},
					location: {
						'afghanistan': { id:'*', name:'Afghanistan'},
						'badakhshan': { id:15, name:'Badakhshan'},
						'badghis': { id:29, name:'Badghis'},
						'baghlan': { id:9, name:'Baghlan'},
						'balkh': { id:18, name:'Balkh'},
						'bamyan': { id:10,"name":'Bamyan'},
						'daykundi': { id:22, name:'Daykundi'},
						'farah': { id:31, name:'Farah'},
						'faryab': { id:28, name:'Faryab'},
						'ghazni': { id:11, name:'Ghazni'},
						'ghor': { id:21, name:'Ghor'},
						'hilmand': { id:32, name:'Hilmand'},
						'hirat': { id:30, name:'Hirat'},
						'jawzjan': { id:27, name:'Jawzjan'},
						'kabul': { id:1, name:'Kabul'},
						'kandahar': { id:33, name:'Kandahar'},
						'kapisa': { id:2, name:'Kapisa'},
						'khost': { id:26, name:'Khost'},
						'kunar': { id:13, name:'Kunar'},
						'kunduz': { id:17, name:'Kunduz'},
						'laghman': { id:7, name:'Laghman'},
						'logar': { id:5, name:'Logar'},
						'nangarhar': { id:6, name:'Nangarhar'},
						'nimroz': { id:34, name:'Nimroz'},
						'nuristan': { id:14, name:'Nuristan'},
						'paktika': { id:25, name:'Paktika'},
						'paktya': { id:12, name:'Paktya'},
						'panjsher': { id:8, name:'Panjsher'},
						'parwan': { id:3, name:'Parwan'},
						'samangan': { id:19, name:'Samangan'},
						'sar-e-pul': { id:20, name:'Sar-e-Pul'},
						'takhar': { id:16, name:'Takhar'},
						'uruzgan': { id:23, name:'Uruzgan'},
						'wardak': { id:4, name:'Wardak'},
						'zabul': { id:24, name:'Zabul'}
					}
				},

				getDownloadMenu: function() {

					// return download object
					return {
						'class': 'col s12 m4 l3 report-download',
						downloads:[{
							icon: {
								color: '#616161'
							},
							filename: $scope.dews.location.name + '-' + $scope.dews.disease.name + '-extracted-' + moment().format(),
							hover: 'Download ' + $scope.dews.location.name + ', ' + $scope.dews.disease.name +  ' Report as CSV',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/data',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
								}
							},
							metrics: {
								method: 'POST',
								url: appConfig.host + '/metrics/set',
								data: {
									organization: $scope.dews.user.organization,
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

				getMenu: function() {
					
					// 
					return [{
						title: 'Disease',
						class: 'collapsible-header waves-effect waves-teal',
						rows: $scope.dews.getRows('disease')
					},{
						title: 'Province',
						'class': 'collapsible-header waves-effect waves-teal',
						rows: $scope.dews.getRows('province')				
					}];

				},

				// return rows for DEWS menu
				getRows: function(list) {
					
					// menu rows
					var active,
						rows = [];

					if(list === 'disease'){
						// for each disease
						angular.forEach($scope.dews.data.disease, function(d, key){
							//
							rows.push({
								'title': d.name,
								'class': 'waves-effect waves-teal',
								'param': 'disease',
								'active': key,
								'href': '#/who/dews/' + $route.current.params.location + '/' + key
							});
						});

					} else {
						// for each disease
						angular.forEach($scope.dews.data.location, function(d, key){
							//
							rows.push({
								'title': d.name,
								'class': 'waves-effect waves-teal',
								'param': 'location',
								'active': key,
								'href': '#/who/dews/' + key + '/' + $route.current.params.disease
							});
						});
					}

					return rows;
				}
			}
		}

		// set dashboard params
		$scope.dews.location = $scope.dews.data.location[$route.current.params.location];
		$scope.dews.disease = $scope.dews.data.disease[$route.current.params.disease];
		$scope.dews.title = 'WHO | ' + $scope.dews.location.name + ' | ' + $scope.dews.disease.name;
		$scope.dews.subtitle = $scope.dews.disease.name + ' Disease Early Warning System Key Indicators ' + $scope.dews.location.name;

		// dews dashboard model
		$scope.model = {
			name: 'who_dews_dashboard',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					'style': 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l9 report-title',
					'style': 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
					'title': $scope.dews.title,
				},
				subtitle: {
					'class': 'col s12 m8 l9 report-subtitle',
					title: $scope.dews.subtitle,
				},
				datePicker: {
					'class': 'col s12 m4 l3',
					dates: [{
						'class': 'ngm-date',
						style: 'float:left;',
						label: 'from',
						format: 'd mmm, yyyy',
						max: $scope.dews.endDate,
						time: $scope.dews.startDate,
						onSelection: function(){
							
							// set date
							$scope.dews.startDate = new Date(this.time);
							
							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 'request': { 'data': { 'start_date': $scope.dews.startDate } } } };

							// update widget
							$scope.model.updateWidgets(update);

						}
					},{
						'class': 'ngm-date',
						style: 'float:right',
						label: 'to',
						format: 'd mmm, yyyy',
						min: $scope.dews.startDate,
						time: $scope.dews.endDate,
						onSelection: function(){
							
							// set date
							$scope.dews.endDate = new Date(this.time);

							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 'request': { 'data': { 'end_date': $scope.dews.endDate } } } };

							// update widget								
							$scope.model.updateWidgets(update);

						}
					}]
				},				
				download: $scope.dews.getDownloadMenu()
			},
			menu: $scope.dews.getMenu(),
			rows: [{
				columns: [{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Outbreaks',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,									
									indicator: '*',
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Individual Cases',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,									
									indicator: 'u5male + u5female + o5male + o5female',
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
								}
							}
						}
					}]
				},{
					styleClass: 's12 m12 l4',
					widgets: [{
						type: 'stats',
						card: 'card-panel stats-card white grey-text text-darken-2',
						broadcast: 'dateChange',
						config: {
							title: 'Deaths',							
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,									
									indicator: 'u5death + o5death',
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
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
						broadcast: 'dateChange',
						config: {
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/calendar',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,									
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
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
						broadcast: 'dateChange',
						config: {
							height: '520px',
							display: {
								type: 'marker',
							},
							defaults: {
								zoomToBounds: true
							},
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/map',
								data: {
									start_date: $scope.dews.startDate,
									end_date: $scope.dews.endDate,									
									disease: $scope.dews.disease.id,
									prov_code: $scope.dews.location.id
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
						style: 'padding:0px; height: 220px;',
						config: {
							html: '<div style="background-color: #FFF; height: 140px;"></div>' + $scope.dews.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard.config = $scope.dews;
		$scope.$parent.ngm.dashboard.model = $scope.model;
		
	}]);