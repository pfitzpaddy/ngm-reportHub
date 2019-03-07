/**
 * @name ngmReportHub.factory:ngmDroughtHelper
 * @description
 * # ngmDroughtHelper
 */
angular.module('ngmReportHub')
	.factory('ngmDroughtHelper', ['$location', '$q', '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', function ($location, $q, $http, $filter, $timeout, ngmAuth, ngmClusterLists) {

		var dashboard = {

			// admin1 ( with admin0 filter from API )
			admin1: localStorage.getObject('lists').admin1List.filter(function (row) { return !row.inactive }),

			// admin2 ( with admin0 filter from API )
			admin2: localStorage.getObject('lists').admin2List.filter(function (row) { return !row.inactive }),

		};

		return {

			setParams: function (params) {
				dashboard = angular.merge({}, dashboard, params);
				
			},

			// get http request --change add month and cluster
			getRequest: function (url, indicator, list) {
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/' + url,
					data: {
						indicator: indicator,
						list: list,
						status_plan: dashboard.statusPlan,
						year: dashboard.year,
						cluster: dashboard.cluster,
						province: dashboard.province,
						district: dashboard.district,
						organization_tag: dashboard.organization,
						month: dashboard.month,
						start_date: dashboard.startDate,
						end_date: dashboard.endDate
					}
				}
			},
			getLatestUpdate:function (url) {
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/' + url,
					data: {
						status_plan: dashboard.statusPlan,						
					}
				}
			},

			// get http request
			getMetrics: function (theme, format) {
				return {
					method: 'POST',
					url: ngmAuth.LOCATION + '/api/metrics/set',
					data: {
						organization: dashboard.user.organization,
						username: dashboard.user.username,
						email: dashboard.user.email,
						dashboard: 'drought_dashboard',
						theme: theme,
						format: format,
						url: $location.$$path
					}
				}
			},

			// default menu
			getMenu: function () {

				// rows
				var rows = [];

				return {
					'id': 'drought-dashboard-year',
					'icon': 'search',
					'title': 'Year',
					'class': 'teal lighten-1 white-text',
					'rows': [{
						'title': '2018',
						'param': 'year',
						'active': '2018',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': dashboard.url + '/' + dashboard.statusPlan + '/2018/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					}, {
						'title': '2019',
						'param': 'year',
						// 'active': '2019',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': dashboard.url + '/' + dashboard.statusPlan + '/2019/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					}]
				}
					;

			},

			// province rows
			getProvinceRows: function () {

				// rows
				var rows = [{
					'title': 'All',
					'param': 'province',
					'active': 'all',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/' + 'all' + '/' + 'all' + '/' + 'all' + '/' + dashboard.month + '/2018-01-01/' + moment().format('YYYY-MM-DD')
				}];

				angular.forEach(dashboard.admin1, function (d, i) {
					
					rows.push({
						'title': d.admin1name,
						'param': 'province',
						'active': d.admin1pcode,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/'+ d.admin1pcode + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					});
				});

				// push to menu
				return {
					'id': 'drought-admin-province',
					'icon': 'location_on',
					'title': 'Province',
					'class': 'teal lighten-1 white-text',
					'rows': rows
				};

			},

			// province rows
			getDistrictRows: function () {

				// rows
				var rows = [{
					'title': 'All',
					'param': 'district',
					'active': 'all',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + 'all' + '/' + 'all' + '/' + dashboard.month + '/2018-01-01/' + moment().format('YYYY-MM-DD')
				}];

				angular.forEach(dashboard.admin2, function (d, i) {
					
					if (dashboard.province !== 'all' && d.admin1pcode === dashboard.province) {
						
						rows.push({
							'title': d.admin2name,
							'param': 'district',
							'active': d.admin2pcode,
							'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
							'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + d.admin2pcode + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
						});
					}
				});

				// push to menu
				return {
					'id': 'drought-province',
					'icon': 'location_on',
					'title': 'District',
					'class': 'teal lighten-1 white-text',
					'rows': rows
				};

			},

			getOrganizationRows: function (organizations) {
				
				var orgRows = [];

				// for each
				organizations.forEach(function (d, i) {

					// menu rows
					orgRows.push({
						'title': d.organization,
						'param': 'organization',
						'active': d.organization_tag,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + d.organization_tag + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					});

				});

				// menu
				return {
					'search': true,
					'id': 'search-cluster-organization',
					'icon': 'supervisor_account',
					'title': 'Organization',
					'class': 'teal lighten-1 white-text',
					'rows': orgRows
				}
			},

			
			getMonthRows: function () {				
				// rows
				var rows = [{
					'title': 'All',
					'param': 'month',
					'active': 'all',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/all/' + moment().startOf('year').format('YYYY-MM-DD') + '/' + moment().format('YYYY-MM-DD')
				}];

				// for each month
				for (i = 0; i < 12; i++) {				
					var monthName = moment.months(i).format('MMM')
					var start_date = moment().year(dashboard.year).month(i).startOf('month').format('YYYY-MM-DD')
					var end_date = moment().year(dashboard.year).month(i).endOf('month').format('YYYY-MM-DD');
					rows.push({
						'title': monthName,
						'param': 'month',
						'active': i,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': dashboard.url + '/' + dashboard.statusPlan+ '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + i + '/' + start_date + '/' + end_date
					});
				}
				return {
					'id': 'drought-admin-month',
					'icon': 'date_range',
					'title': 'Report Month',
					'class': 'teal lighten-1 white-text',
					'rows': rows
				};

			},

			getClusterRows: function (admin0pcode){
				// rows
				var clusters = ngmClusterLists.getClusters(admin0pcode);
				var rows = [{
					'title': 'All',
					'param': 'cluster',
					'active': 'all',
					'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + 'all' + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
				}];

				for(i=0;i<clusters.length;i++){
					var clusterName = clusters[i].cluster;
					var clusterId = clusters[i].cluster_id
					rows.push({
						'title': clusterName,
						'param': 'cluster',
						'active': clusterId,
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + clusterId + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization +'/'+ dashboard.month + '/' + dashboard.startDate+ '/' + dashboard.endDate
					});
				}
				return {
					'id': 'drought-cluster',
					'icon': 'camera',
					'title': 'Clusters',
					'class': 'teal lighten-1 white-text',
					'rows': rows
				};

			},

			getPlanRows:function () {
				var rows = [
					// {
					// 	'title': 'All',
					// 	'param': 'cluster',
					// 	'active': 'all',
					// 	'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
					// 	'href': dashboard.url + '/' + dashboard.statusPlan + '/' + dashboard.year + '/' + 'all' + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					// },
					{
						'title': 'All',
						'param': 'status_plan',
						'active': 'all',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/response/afghanistan/drought/dashboard/all' + '/' + dashboard.year + '/' + dashboard.cluster  + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					},
					{
						'title': 'Displaced',
						'param': 'status_plan',
						'active': 'displaced',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/response/afghanistan/drought/dashboard/displaced' + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					},
					{
						'title': 'Non-Displaced',
						'param': 'status_plan',
						'active': 'non_displaced',
						'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
						'href': '#/response/afghanistan/drought/dashboard/non_displaced' + '/' + dashboard.year + '/' + dashboard.cluster + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.month + '/' + dashboard.startDate + '/' + dashboard.endDate
					},
			];

				return {
					'id': 'drought-plan',
					'icon': 'recent_actors',
					'title': 'Population Type',
					'class': 'teal lighten-1 white-text',
					'rows': rows
				};
				
			},
			getTitle:function(){
				var title;
				if (dashboard.user.roles.indexOf('SUPERADMIN') !== -1) {
					title = dashboard.user.admin0pcode
				} else if (dashboard.user.roles.indexOf('ADMIN') !== -1) {
					title = dashboard.user.admin0pcode + ' | ' + dashboard.user.cluster
				} else {					
					title = dashboard.user.admin0pcode + ' | ' + dashboard.user.cluster + ' | ' + dashboard.user.organization
				}
				return title;
			},
			getSubtitle:function () {
				var subtitle;
				if( dashboard.month !== 'all'){
					var monthName = moment.months(parseInt(dashboard.month));
				}else{
					var monthName = 'All Months'
				}
				if (dashboard.statusPlan === 'all'){
					subtitle = 'All ' + ' | ' + monthName+ ' | ' + dashboard.year;
				} else if(dashboard.statusPlan === 'displaced'){
					subtitle = 'Displaced' + ' | ' + monthName + ' | ' + dashboard.year;
				} else{
					subtitle = ' Non Displaced' + ' | ' + monthName + ' | ' + dashboard.year;
				}
				return subtitle
			}

		}

	}]);