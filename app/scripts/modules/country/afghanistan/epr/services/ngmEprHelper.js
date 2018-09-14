/**
 * @name ngmReportHub.factory:ngmEprHelper
 * @description
 * # ngmEprHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmEprHelper', [ '$location', '$q', '$http', '$filter', '$timeout', 'ngmAuth', function( $location, $q, $http, $filter, $timeout, ngmAuth ) {

    //
    var dashboard = {
      data: {
        region: {
          'all': {
            name: 'All'
          },
          'central': {
            name: 'Central',
            prov: [ 8,3,4,5,2,1 ]
          },
          'central_highlands': {
            name: 'Central Highlands',
            prov: [ 10,22 ]
          },
          'east': {
            name: 'East',
            prov: [ 13,7,14,6 ]
          },
          'north': {
            name: 'North',
            prov: [ 27,28,18,19,20 ]
          },
          'north_east': {
            name: 'North East',
            prov: [ 15,9,17,16 ]
          },
          'south': {
            name: 'South',
            prov: [ 32,23,34,24,33 ]
          },
          'south_east': {
            name: 'South East',
            prov: [  26,25,12,11 ]
          },
          'west': {
            name: 'West',
            prov: [ 31,21,29,30 ]
          }
        },
        province: {
          '15': 'Badakhshan',
          '29': 'Badghis',
          '9': 'Baghlan',
          '18': 'Balkh',
          '10': 'Bamyan',
          '22': 'Daykundi',
          '31': 'Farah',
          '28': 'Faryab',
          '11': 'Ghazni',
          '21': 'Ghor',
          '32': 'Hilmand',
          '30': 'Hirat',
          '27': 'Jawzjan',
          '1': 'Kabul',
          '33': 'Kandahar',
          '2': 'Kapisa',
          '26': 'Khost',
          '13': 'Kunar',
          '17': 'Kunduz',
          '7': 'Laghman',
          '5': 'Logar',
          '6': 'Nangarhar',
          '34': 'Nimroz',
          '14': 'Nuristan',
          '25': 'Paktika',
          '12': 'Paktya',
          '8': 'Panjsher',
          '3': 'Parwan',
          '19': 'Samangan',
          '20': 'Sar-e-Pul',
          '16': 'Takhar',
          '23': 'Uruzgan',
          '4': 'Wardak',
          '24': 'Zabul',
        }
      }
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
            region: dashboard.region,
            province: dashboard.province,
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
            dashboard: 'epr_admin',
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
        // for each
        for(var k in dashboard.data.region){
          rows.push({
            'title': dashboard.data.region[k].name,
            'param': 'region',
            'active': k,
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href': dashboard.url + '/' + dashboard.year + '/' + k + '/all/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          });
        };

        return [{
          'id': 'epr-admin-year',
          'icon': 'search',
          'title': 'Year',
          'class': 'teal lighten-1 white-text',
          'rows': [{
            'title': '2017',
            'param': 'year',
            'active': '2017',
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/2017/' + dashboard.region + '/' + dashboard.province + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          },{
            'title': '2018',
            'param': 'year',
            'active': '2018',
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/2018/' + dashboard.region + '/' + dashboard.province + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          }]
        },{
          'id': 'epr-admin-region',
          'icon': 'location_on',
          'title': 'Region',
          'class': 'teal lighten-1 white-text',
          'rows': rows
        }];

      },

      // province rows
      getProvinceRows: function(){

        // rows
        var rows = [];
        // provinces by region
        var provinces = dashboard.data.region[dashboard.region].prov;

        // angular
        angular.forEach(provinces, function( d, i ){
          rows.push({
            'title': dashboard.data.province[d],
            'param': 'province',
            'active': d,
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/' + dashboard.year + '/' + dashboard.region + '/' + d + '/' + dashboard.week + '/' + dashboard.startDate + '/' + dashboard.endDate
          });
        });

        // push to menu
        return {
          'id': 'epr-admin-province',
          'icon': 'location_on',
          'title': 'Province',
          'class': 'teal lighten-1 white-text',
          'rows': rows
        };

      },

      // week rows
      getWeekRows: function() {

        // rows
        var rows = [{
          'title': 'All',
          'param': 'week',
          'active': 'all',
          'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
          'href':  dashboard.url + '/' + dashboard.year + '/' + dashboard.region + '/' + dashboard.province + '/all/2017-01-01/' + moment().format('YYYY-MM-DD')
        }];

        // for each week
        for(i=1;i<54;i++){

          // set dates to week
          var week = i < 10 ? 'W0'+i : 'W'+i;
          var start_date = moment().year( dashboard.year ).week( i ).subtract( 1, 'd' ).format( 'YYYY-MM-DD' );
          var end_date = moment().year( dashboard.year ).week( i ).subtract( 1, 'd' ).add( 1, 'w' ).format( 'YYYY-MM-DD' ); ;

          rows.push({
            'title': week,
            'param': 'week',
            'active': i,
            'class': 'grey-text text-darken-2 waves-effect waves-teal waves-teal-lighten-4',
            'href':  dashboard.url + '/' + dashboard.year + '/' + dashboard.region + '/' + dashboard.province + '/' + week + '/' + start_date + '/' + end_date
          });
        }

        // push to menu
        return {
          'id': 'epr-admin-week',
          'icon': 'date_range',
          'title': 'Report Week',
          'class': 'teal lighten-1 white-text',
          'rows': rows
        };

      },

      //
      getTitle: function( admin ){
        // title
        var title = 'EPR | ';
            title += admin ? 'ADMIN | ' : '';
            title += dashboard.year;
        // region
        if ( dashboard.region !== 'all' ) {
          title += ' | ' + dashboard.data.region[dashboard.region].name;
        }
        // if province
        if ( dashboard.province !== 'all' ) {
          title += ' | ' + dashboard.data.province[dashboard.province]
        }
        // if week
        if ( dashboard.week !== 'all' ) {
          title += ' | ' + dashboard.week;
        }
        return title;
      },

      //
      getSubtitle: function(admin){
        // subtitle
        var subtitle = 'EPR ';
            subtitle += admin ? 'Admin ' : '';
            subtitle += 'Dashboard ' + dashboard.year;
        // region
        if ( dashboard.region !== 'all' ) {
          subtitle += ' for ' + dashboard.data.region[dashboard.region].name + ' Region';
        }
        // if province
        if ( dashboard.province !== 'all' ) {
          subtitle += ', ' + dashboard.data.province[dashboard.province] + ' Province';
        }
        // if week
        if ( dashboard.week !== 'all' ) {
          subtitle += ', EPR ' + dashboard.week;
        }
        return subtitle
      }

		}

	}]);
