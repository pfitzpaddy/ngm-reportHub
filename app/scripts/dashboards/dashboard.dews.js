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

		if ($scope.$parent.ngm.dashboard.model 
				&& $scope.$parent.ngm.dashboard.model.name === 'who_dews_dashboard') {
			// set dashboard local $scope from $parent
			$scope.dashboard = $scope.$parent.ngm.dashboard.config;
			$scope.model = $scope.$parent.ngm.dashboard.model;
		} else {
			// create dews object
			$scope.dashboard = {

				// parent
				ngm: $scope.$parent.ngm,

				// current user
				user: ngmUser.get(),

				// start date = now - 6 months
				startDate: new Date('January 1, 2015'),// new Date(new Date().setMonth(new Date().getMonth() - 6)),
				
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

				getDownloadPdf: function() {
					return {
						'class': 'col s12 m4 l2 report-download',
						downloads:[{
							title: 'PDF',
							type: 'pdf',
							icon: 'download_cloud',
							filename: $scope.dashboard.location.name + '-' + $scope.dashboard.disease.name + '-extracted-' + moment().format(),
							hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as PDF',
							request: {
								method: 'GET',
								url: appConfig.host + '/downloads/who-afghanistan-measles-extracted-2015-11-30T15-17-37+04-30.pdf',
							},
							metrics: {
								method: 'POST',
								url: appConfig.host + '/metrics/set',
								data: {
									organization: $scope.dashboard.user.organization,
									username: $scope.dashboard.user.username,
									email: $scope.dashboard.user.email,
									dashboard: 'dews',
									theme: $route.current.params.disease,
									format: 'pdf',
									url: $location.$$path
								}
							}
						}]
					}
				},

				getDownloadCsv: function() {
					return {
						'class': 'col s12 m4 l2 report-download',
						downloads:[{
							title: 'CSV',
							icon: 'download_cloud',
							filename: $scope.dashboard.location.name + '-' + $scope.dashboard.disease.name + '-extracted-' + moment().format(),
							hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as CSV',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/data',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
								}
							},
							metrics: {
								method: 'POST',
								url: appConfig.host + '/metrics/set',
								data: {
									organization: $scope.dashboard.user.organization,
									username: $scope.dashboard.user.username,
									email: $scope.dashboard.user.email,
									dashboard: 'dews',
									theme: $route.current.params.disease,
									format: 'csv',
									url: $location.$$path
								}
							}
						}]
					}
				},				

				getDownloadMenu: function() {

					// return download object
					return {
						'class': 'col s12 m4 l3 report-download',
						downloads:[{
							icon: 'cloud',
							filename: $scope.dashboard.location.name + '-' + $scope.dashboard.disease.name + '-extracted-' + moment().format(),
							hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as PDF',
							style: 'width: 50%;',
							title: 'PDF',
							request: {
								method: 'GET',
								url: appConfig.host + '/downloads/who-afghanistan-measles-extracted-2015-11-30T15-17-37+04-30.pdf',
							},
							metrics: {
								method: 'POST',
								url: appConfig.host + '/metrics/set',
								data: {
									organization: $scope.dashboard.user.organization,
									username: $scope.dashboard.user.username,
									email: $scope.dashboard.user.email,
									dashboard: 'dews',
									theme: $route.current.params.disease,
									format: 'pdf',
									url: $location.$$path
								}
							}
						},{
							icon: 'cloud',
							style: 'width: 50%;',
							title: 'Download CSV',
							filename: $scope.dashboard.location.name + '-' + $scope.dashboard.disease.name + '-extracted-' + moment().format(),
							hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as CSV',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/data',
								data: {
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
								}
							},
							metrics: {
								method: 'POST',
								url: appConfig.host + '/metrics/set',
								data: {
									organization: $scope.dashboard.user.organization,
									username: $scope.dashboard.user.username,
									email: $scope.dashboard.user.email,
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
						'title': 'Disease',
						'class': 'collapsible-header waves-effect waves-teal z-depth-1',
						'rows': $scope.dashboard.getRows('disease')
					},{
						'title': 'Province',
						'class': 'collapsible-header waves-effect waves-teal z-depth-1',
						'rows': $scope.dashboard.getRows('province')				
					}];

				},

				// return rows for DEWS menu
				getRows: function(list) {
					
					// menu rows
					var active,
						rows = [];

					if(list === 'disease'){
						// for each disease
						angular.forEach($scope.dashboard.data.disease, function(d, key){
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
						angular.forEach($scope.dashboard.data.location, function(d, key){
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
		$scope.dashboard.location = $scope.dashboard.data.location[$route.current.params.location];
		$scope.dashboard.disease = $scope.dashboard.data.disease[$route.current.params.disease];
		$scope.dashboard.title = 'WHO | ' + $scope.dashboard.location.name + ' | ' + $scope.dashboard.disease.name;
		$scope.dashboard.subtitle = $scope.dashboard.disease.name + ' Disease Early Warning System Key Indicators ' + $scope.dashboard.location.name;

		// dews dashboard model
		$scope.model = {
			name: 'who_dews_dashboard',
			header: {
				div: {
					'class': 'col s12 m12 l12 report-header',
					'style': 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					'class': 'col s12 m8 l8 report-title',
					'style': 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
					'title': $scope.dashboard.title,
				},
				subtitle: {
					'class': 'col hide-on-small-only m8 l9 report-subtitle',
					title: $scope.dashboard.subtitle,
				},
				datePicker: {
					'class': 'col s12 m4 l3',
					dates: [{
						'class': 'ngm-date',
						style: 'float:left;',
						label: 'from',
						format: 'd mmm, yyyy',
						max: $scope.dashboard.endDate,
						time: $scope.dashboard.startDate,
						onSelection: function(){
							
							// set date
							$scope.dashboard.startDate = new Date(this.time);
							
							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 'request': { 'data': { 'start_date': $scope.dashboard.startDate } } } };

							// update widget
							$scope.model.updateWidgets(update);

						}
					},{
						'class': 'ngm-date',
						style: 'float:right',
						label: 'to',
						format: 'd mmm, yyyy',
						min: $scope.dashboard.startDate,
						time: $scope.dashboard.endDate,
						onSelection: function(){
							
							// set date
							$scope.dashboard.endDate = new Date(this.time);

							// updated config
							var update = { 'broadcast': 'dateChange', 'config' : { 'request': { 'data': { 'end_date': $scope.dashboard.endDate } } } };

							// update widget								
							$scope.model.updateWidgets(update);

						}
					}]
				},
				download: {
					'class': 'col s12 m4 l4',
					downloads: [{
						type: 'csv',
						color: 'blue lighten-1',
						icon: 'library_books',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as CSV',
						filename: $scope.dashboard.location.name.toLowerCase() + '-' + $scope.dashboard.disease.name.toLowerCase() + '-extracted-' + moment().format(),
						request: {
							method: 'POST',
							url: appConfig.host + '/dews/data',
							data: {
								start_date: $scope.dashboard.startDate,
								end_date: $scope.dashboard.endDate,
								disease: $scope.dashboard.disease.id,
								prov_code: $scope.dashboard.location.id
							}
						},
						metrics: {
							method: 'POST',
							url: appConfig.host + '/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'dews',
								theme: $route.current.params.disease,
								format: 'csv',
								url: $location.$$path
							}
						}						
					},{
						type: 'pdf',
						color: 'blue lighten-1',
						icon: 'picture_as_pdf',
						hover: 'Download ' + $scope.dashboard.location.name + ', ' + $scope.dashboard.disease.name +  ' Report as PDF',
						filename: 'http://reporthub.immap.org/downloads/who-afghanistan-measles-extracted-2015-11-30T15-17-37+04-30.pdf',
						metrics: {
							method: 'POST',
							url: appConfig.host + '/metrics/set',
							data: {
								organization: $scope.dashboard.user.organization,
								username: $scope.dashboard.user.username,
								email: $scope.dashboard.user.email,
								dashboard: 'dews',
								theme: $route.current.params.disease,
								format: 'pdf',
								url: $location.$$path
							}
						}
					}]
				}
			},
			menu: $scope.dashboard.getMenu(),
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
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									indicator: '*',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									indicator: 'u5male + u5female + o5male + o5female',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									indicator: 'u5death + o5death',
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id
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
							layers: {
								overlays: {
									outbreaks: {
										name: 'Outbreaks',
										type: 'markercluster',
										visible: true,
										layerOptions: {
												maxClusterRadius: 90
										}
									}
								}
							},				
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/markers',
								data: {
									layer: 'outbreaks',
									start_date: $scope.dashboard.startDate,
									end_date: $scope.dashboard.endDate,									
									disease: $scope.dashboard.disease.id,
									prov_code: $scope.dashboard.location.id,
									message: '<div class="count" style="text-align:center">__{ "value": feature.properties.incidents }__</div> cases in __{ "value": feature.properties.district }__'
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
							html: '<div style="background-color: #FFF; height: 140px;"></div>' + $scope.dashboard.ngm.footer
						}
					}]
				}]
			}]
		};

		// assign to ngm app scope
		$scope.$parent.ngm.dashboard.config = $scope.dashboard;
		$scope.$parent.ngm.dashboard.model = $scope.model;
		
	}]);