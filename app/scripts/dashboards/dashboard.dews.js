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

			// parent
			ngm: $scope.$parent.ngm,

			// current user
			user: ngmUser.get(),

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
					'afghanistan': {'id':'*','name':'Afghanistan'},
					'nimroz': {'id':34,'name':'Nimroz'},
					'farah': {'id':31,'name':'Farah'},
					'hilmand': {'id':32,'name':'Hilmand'},
					'jawzjan': {'id':27,'name':'Jawzjan'},
					'kandahar': {'id':33,'name':'Kandahar'},
					'ghazni': {'id':11,'name':'Ghazni'},
					'paktika': {'id':25,'name':'Paktika'},
					'paktya': {'id':12,'name':'Paktya'},
					'kunduz': {'id':17,'name':'Kunduz'},
					'logar': {'id':5,'name':'Logar'},
					'hirat': {'id':30,'name':'Hirat'},
					'baghlan': {'id':9,'name':'Baghlan'},
					'kunar': {'id':13,'name':'Kunar'},
					'nangarhar': {'id':6,'name':'Nangarhar'},
					'uruzgan': {'id':23,'name':'Uruzgan'},
					'laghman': {'id':7,'name':'Laghman'},
					'balkh': {'id':18,'name':'Balkh'},
					'khost': {'id':26,'name':'Khost'},
					'kapisa': {'id':2,'name':'Kapisa'},
					'sar-e-pul': {'id':20,'name':'Sar-e-Pul'},
					'takhar': {'id':16,'name':'Takhar'},
					'badghis': {'id':29,'name':'Badghis'},
					'zabul': {'id':24,'name':'Zabul'},
					'wardak': {'id':4,'name':'Wardak'},
					'faryab': {'id':28,'name':'Faryab'},
					'bamyan': {'id':10,"name":'Bamyan'},
					'samangan': {'id':19,'name':'Samangan'},
					'panjsher': {'id':8,'name':'Panjsher'},
					'parwan': {'id':3,'name':'Parwan'},
					'ghor': {'id':21,'name':'Ghor'},
					'daykundi': {'id':22,'name':'Daykundi'},
					'nuristan': {'id':14,'name':'Nuristan'},
					'badakhshan': {'id':15,'name':'Badakhshan'},
					'kabul': {'id':1,'name':'Kabul'}
				}
			},

			// return rows for DEWS menu
			getRows: function(list) {
				
				// menu rows
				var rows = [];

				if(list === 'disease'){
					// for each disease
					angular.forEach($scope.dews.data.disease, function(d, key){
						
						//
						rows.push({
							'title': d.name,
							'class': 'waves-effect waves-teal',
							'param': 'disease',
							'active': d.id,
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

		// footer
		$scope.dews.footer = '<div style="background-color: #FFF; height:220px;"></div>'
							+ '<div style="background-color: ' + $scope.dews.ngm.style.lightPrimaryColor + '; height:20px;"></div>'
						   	+ '<div style="background-color: ' + $scope.dews.ngm.style.defaultPrimaryColor  + '; height:80px; padding: 10px 0px 0px 20px;">'
							+ 	'<p style="color: white;font-weight:100;">Made by <a class="grey-text" href="http://immap.org"><b>iMMAP</b></a></p>'
						   	+ '</div>';

		// set dashboard params
		$scope.dews.location = $scope.dews.data.location[$route.current.params.location];
		$scope.dews.disease = $scope.dews.data.disease[$route.current.params.disease];
		$scope.dews.title = $scope.dews.location.name + ' | ' + $scope.dews.disease.name;
		$scope.dews.subtitle = $scope.dews.disease.name + ' Disease Early Warning System Key Indicators ' + $scope.dews.location.name;

		// dews dashboard model
		var model = {
			header: {
				div: {
					'class': 'report-header',
					style: 'border-bottom: 3px ' + $scope.$parent.ngm.style.defaultPrimaryColor + ' solid;'
				},
				title: {
					title: $scope.dews.title,
					style: 'color: ' + $scope.$parent.ngm.style.defaultPrimaryColor,
				},
				subtitle: {
					'class': 'report-subtitle',
					title: $scope.dews.subtitle,
				},
				download: {
					'class': 'report-download',
					downloads:[{
						icon: {
							color: '#616161'
						},
						filename: $route.current.params.disease + '-' + moment().format(),
						hover: 'Download ' + $scope.dews.disease.name +  ' Report as CSV',
						request: {
							method: 'POST',
							url: appConfig.host + '/dews/data',
							data: {	
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
			menu: [{
				title: 'Disease',
				class: 'collapsible-header waves-effect waves-teal',
				rows: $scope.dews.getRows('disease')
			},{
				title: 'Province',
				class: 'collapsible-header waves-effect waves-teal',
				rows: $scope.dews.getRows('province')				
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
								url: appConfig.host + '/dews/indicator',
								data: {
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
						config: {
							title: 'Individual Cases',
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
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
						config: {
							title: 'Deaths',							
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/indicator',
								data: {
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
						config: {
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/calendar',
								data: {
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
						config: {
							height: '520px',
							display: {
								type: 'marker'
							},
							request: {
								method: 'POST',
								url: appConfig.host + '/dews/map',
								data: {
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
						style: 'padding:0px; height: 320px;',
						config: {
							html: $scope.dews.footer
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