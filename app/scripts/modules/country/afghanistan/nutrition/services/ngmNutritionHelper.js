/**
 * @name ngmReportHub.factory:ngmNutritionHelper
 * @description
 * # ngmNutritionHelper
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmNutritionHelper', [ '$location', '$q', '$http', '$filter', '$timeout', 'ngmAuth', function( $location, $q, $http, $filter, $timeout, ngmAuth ) {

    var dashboard = {

      // admin1 ( with admin0 filter from API )
      admin1: localStorage.getObject( 'lists' ).admin1List.filter(function(row){return !row.inactive}),

      // admin2 ( with admin0 filter from API )
      admin2: localStorage.getObject( 'lists' ).admin2List.filter(function(row){return !row.inactive}),
      
    };

		return {

      setParams: function( params ){
        dashboard = angular.merge({}, dashboard, params);
      },

      // get http request
      getRequest: function( url, indicator, list ){
        return {
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/' + url,
          data: {
            indicator: indicator,
            list: list,
            year: dashboard.year,
            province: dashboard.province,
            district: dashboard.district,
            organization_tag: dashboard.organization,
            week: dashboard.week,
            start_date: dashboard.startDate,
            end_date: dashboard.endDate
          }
        }
      },

      // get http request
      getMetrics: function( theme, format ){
        return {
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/metrics/set',
          data: {
            organization: dashboard.user.organization,
            username: dashboard.user.username,
            email: dashboard.user.email,
            dashboard: 'nutrition_dashboard',
            theme: theme,
            format: format,
            url: $location.$$path
          }
        }
      },

      // default menu
      getMenu: function(){

        // rows
        var rows = [];

        return {
          'id': 'nutrition-dashboard-year',
          'icon': 'search',
          'title': $filter('translate')('year'),
          'class': 'teal lighten-1 white-text',
          'rows': [{
            'title': '2018',
            'param': 'year',
            'active': '2018',
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/2018/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          },{
            'title': '2019',
            'param': 'year',
            // 'active': '2019',
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/2019/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          }]
        }
      ;

      },

      // province rows
      getProvinceRows: function(){

        // rows
        var rows = [{
          'title': $filter('translate')('all_mayus'),
            'param': 'province',
          'active': 'all',
          'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
          'href':  dashboard.url + '/' + dashboard.year + '/' + 'all' + '/' + 'all' + '/' + 'all' + '/' + dashboard.week + '/2018-01-01/' + moment().format('YYYY-MM-DD')
        }];

        angular.forEach(dashboard.admin1, function( d, i ){
            rows.push({
              'title': d.admin1name,
              'param': 'province',
              'active': d.admin1pcode,
              'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
              'href':  dashboard.url + '/' + dashboard.year + '/' + d.admin1pcode + '/' + dashboard.district + '/' + dashboard.organization + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
            });
        });

        // push to menu
        return {
          'id': 'nutrition-admin-province',
          'icon': 'location_on',
          'title': $filter('translate')('province'),
          'class': 'teal lighten-1 white-text',
          'rows': rows
        };

      },

      // province rows
      getDistrictRows: function(){

        // rows
        var rows = [{
          'title': $filter('translate')('all_mayus'),
            'param': 'district',
          'active': 'all',
          'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
          'href':  dashboard.url + '/' + dashboard.year + '/' + dashboard.province + '/' + 'all' + '/' + 'all' + '/' + dashboard.week + '/2018-01-01/' + moment().format('YYYY-MM-DD')
        }];

        angular.forEach(dashboard.admin2, function( d, i ){
          if (dashboard.province !== 'all' && d.admin1pcode === dashboard.province){
          rows.push({
            'title': d.admin2name,
            'param': 'district',
            'active': d.admin2pcode,
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/' + dashboard.year  + '/' + dashboard.province + '/' + d.admin2pcode + '/' + dashboard.organization + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          });
        }
        });

        // push to menu
        return {
          'id': 'epr-admin-province',
          'icon': 'location_on',
          'title': ('translate')('district'),
          'class': 'teal lighten-1 white-text',
          'rows': rows
        };

      },

      getOrganizationRows: function(organizations) {

            var orgRows = [];

							// for each
							organizations.forEach(function( d, i ){

								// menu rows
								orgRows.push({
									'title': d.organization,
									'param': 'organization_tag',
									'active': d.organization_tag,
									'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
                  'href': dashboard.url + '/' + dashboard.year  + '/' + dashboard.province + '/' + dashboard.district + '/' + d.organization_tag + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate 
								});

							});

              // menu
							return {
								'search': true,
								'id': 'search-cluster-organization',
								'icon': 'supervisor_account',
								'title': $filter('translate')('organization'),
								'class': 'teal lighten-1 white-text',
								'rows': orgRows
							}
      },

      // week rows
      getWeekRows: function() {

        // rows
        var rows = [{
          'title': $filter('translate')('all_mayus'),
          'param': 'week',
          'active': 'all',
          'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
          'href':  dashboard.url + '/' + dashboard.year  + '/' + dashboard.province + '/' + dashboard.district + '/' + dashboard.organization + '/all/'+ moment().startOf('year').format( 'YYYY-MM-DD' ) + '/' + moment().format('YYYY-MM-DD')
        }];

        // for each week
        for(i=1;i<54;i++){

          // set dates to week
          var week = i < 10 ? 'W0'+i : 'W'+i;
          var start_date = moment().year(dashboard.year).isoWeek( i ).startOf('isoWeek').subtract( 1, 'd' ).format( 'YYYY-MM-DD' )
          var end_date = moment().year( dashboard.year ).isoWeek( i ).startOf('isoWeek').subtract( 1, 'd' ).add( 1, 'w' ).format( 'YYYY-MM-DD' ); ;

          rows.push({
            'title': week + ' (' + start_date + ')',
            'param': 'week',
            'active': i,
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/' + dashboard.year + '/' + dashboard.province + '/'  + dashboard.district + '/' + dashboard.organization + '/'  + i + '/' + start_date + '/' + end_date
          });
        }

        // push to menu
        return {
          'id': 'epr-admin-week',
          'icon': 'date_range',
          'title': $filter('translate')('report_week'),
          'class': 'teal lighten-1 white-text',
          'rows': rows
        };

      },

      //
      getTitle: function( admin ){
        // title
        var title = $filter('translate')('nutrition_mayus')+ ' | ';
            title += admin ? 'ADMIN | ' : '';
            title += dashboard.year;

        if ( dashboard.province !== 'all' ) {
          title += ' | ' + dashboard.admin1.filter(function(row){return row.admin1pcode === dashboard.province})[0].admin1name
        }
        // if week
        if ( dashboard.week !== 'all' ) {
          title += ' | ' + dashboard.week;
        }

        // if organization
        if ( dashboard.organization !== 'all' ) {
          title += ' | ' + dashboard.organization.toUpperCase();
        }
        return title;
      },

      //
      getSubtitle: function(admin){
        // subtitle
        var subtitle = $filter('translate')('nutrition_mayus')+' ';
            subtitle += admin ? 'Admin ' : '';
            subtitle += 'Dashboard ' + dashboard.year;

        // if province
        if ( dashboard.province !== 'all' ) {
          subtitle += ', ' + dashboard.admin1.filter(function(row){return row.admin1pcode === dashboard.province})[0].admin1name + ' ' +$filter('translate')('province');
        }
        // if week
        if ( dashboard.week !== 'all' ) {
          subtitle += ', '+$filter('translate')('nutrition_mayus')+' ' + dashboard.week;
        }

        // if organization
        if ( dashboard.organization !== 'all' ) {
          subtitle += ', ' + dashboard.organization.toUpperCase();
        }
        return subtitle
      }

		}

	}]);
