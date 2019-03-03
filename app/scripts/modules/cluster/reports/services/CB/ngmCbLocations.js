/**
 * @name ngmReportHub.factory:ngmCbLocations
 * @description
 * # ngmCbLocations
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .filter( 'admin2CxbHostCommunityfilter', [ '$filter', function ( $filter ) {
    
    // Host Communities of Reach data capture Teknaf, Ukhia
    var host_community_filter = [ '202290', '202294' ];

    // filter 
    return function ( item ) {
      var list = item.filter(function( i ) {
        return host_community_filter.indexOf( i.admin1pcode ) !== -1; 
      });
      return list;
    };
  }])
  .filter( 'admin2CycloneShelterCxbfilter', [ '$filter', function ( $filter ) {
    
    // Host Communities of Reach data capture Teknaf, Ukhia
    var cyclone_shelter = [ '20229479', '20229063', '20229099', '20229015', '20229031', '20229039', '20229047', '20229079', '20037357', '20229415', '20229431', '20229463', '20229447' ];

    // filter 
    return function ( item ) {
      var list = item.filter(function( i ) {
        return cyclone_shelter.indexOf( i.admin2pcode ) !== -1; 
      });
      return list;
    };
  }])
  .factory( 'ngmCbLocations', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

    // ngmCbLocations
		ngmCbLocations = {

      // show the columns
      showUnion: function( target_location ){
        var display = false;
        angular.forEach( target_location, function( d, i ){
          if ( d.site_type_id === 'host_community' || d.site_type_id === 'cyclone_shelter' ) {
            display = true;
          }
        });
        return display;
      },

      // clear the Union on site type change
      changeSiteType: function( target_location ){
        // admin2
        delete target_location.admin2pcode;
        delete target_location.admin2name;
        delete target_location.admin2lng;
        delete target_location.admin2lat;
        // admin3
        delete target_location.admin2pcode;
        delete target_location.admin2name;
        delete target_location.admin2lng;
        delete target_location.admin2lat;
        // site
        delete target_location.site_id;
        delete target_location.site_name;
        delete target_location.site_lng;
        delete target_location.site_lat;
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

      // get admin2 filtered list
      getAdmin2List: function( admin2 ) {
        var list = angular.copy( admin2 ).filter(function( item ) {
          return ngmCbLocations.host_community_filter.includes( item.admin1pcode ); 
        });
        return list;
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

      // on change
      updateAdmin2: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.admin2pcode = $data;

        // if site_id
        if( target_location.admin2pcode ) {
          // select site type
          selected = $filter('filter')( lists.adminSites, { admin2pcode: target_location.admin2pcode }, true );
          if( selected && selected.length ){
            delete selected[0].id;
            selected[0].site_lng = selected[0].admin2lng;
            selected[0].site_lat = selected[0].admin2lat;
            selected[0].site_id = selected[0].admin2pcode;
            selected[0].site_name = selected[0].admin2name + ' UNION';
            angular.merge( target_location, selected[0] );
          }
        }

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
    return ngmCbLocations;

	}]);