/**
 * @name ngmReportHub.factory:ngmCbSectorLocations
 * @description
 * # ngmCbSectorLocations
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmCbSectorLocations', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

    // ngmCbSectorLocations
		ngmCbSectorLocations = {

      // show the columns
      showUnion: function( target_location ){
        var display = false;
        angular.forEach( target_location, function( d, i ){
          if ( d.site_type_id === 'host_community' ) {
            display = true;
          }
        });
        return display;
      },

      // admin2
      displaySiteType: function( lists, $index, $data, target_location ){
        
        // attr
        var selected;

        // filter by site_type
        target_location.site_type_id = $data;
        if( target_location.site_type_id ) {
          // select site type
          selected = $filter('filter')( lists.site_type, { site_type_id: target_location.site_type_id }, true );
          if( selected && selected.length ){
            delete selected[0].id;
            target_location.site_type_id = selected[0].site_type_id;
            target_location.site_type_name = selected[0].site_type_name;
          }
        }

        // return name
        return selected && selected.length ? selected[0].site_type_name : '-';
      },

      // admin2
      displayAdmin2: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.admin2pcode = $data;
        // if admin2pcode
        if( target_location.admin2pcode ) {
          // select site type
          selected = $filter('filter')( lists.adminSites, { admin2pcode: target_location.admin2pcode }, true );
          if( selected && selected.length ){
            delete selected[0].id;
            target_location.admin2pcode = selected[0].admin2pcode;
            target_location.admin2name = selected[0].admin2name;
          }
        }

        // return name
        return selected && selected.length ? selected[0].admin2name : '-';
      },

      // site
      displaySites: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.site_id = $data;

        // if site_id
        if( target_location.site_id ) {
          // select site type
          selected = $filter('filter')( lists.adminSites, { site_id: target_location.site_id }, true );
          if( selected && selected.length ){
            delete selected[0].id;
            target_location.site_id = selected[0].site_id;
            target_location.site_name = selected[0].site_name;
          }
        }

        // return name
        return selected && selected.length ? selected[0].site_name : '-';
      },

      // on change
      updateSite: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.site_id = $data;

        // if site_id
        if( target_location.site_id ) {
          // select site type
          selected = $filter('filter')( lists.adminSites, { site_id: target_location.site_id }, true );
          if( selected && selected.length ){
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }
        }

      }

    }

    // return
    return ngmCbSectorLocations;

	}]);