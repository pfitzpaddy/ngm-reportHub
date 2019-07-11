/**
 * @name ngmReportHub.factory:ngmCbLocations
 * @description
 * # ngmCbLocations
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
  .filter( 'admin1CxbRefugeeCampfilter', [ '$filter', function ( $filter ) {
    
    // Host Communities of Reach data capture Teknaf, Ukhia
    var refugee_camp_filter = [ '202290', '202294' ];

    // filter 
    return function ( item ) {
      var list = item.filter(function( i ) {
        return refugee_camp_filter.indexOf( i.admin1pcode ) !== -1; 
      });
      return list;
    };
  }])
  .filter( 'admin2CxbRefugeeCampfilter', [ '$filter', function ( $filter ) {
    
    // Refugee Camps admin2pcode
    var refugee_camp_filter = [ '20229015', '20229031', '20229479', '20229063', '2022907', '20229079' ];

    // filter 
    return function ( item ) {
      var list = item.filter(function( i ) {
        return refugee_camp_filter.indexOf( i.admin2pcode ) !== -1; 
      });
      return list;
    };
  }])
  // .filter( 'admin2CycloneShelterCxbfilter', [ '$filter', function ( $filter ) {
    
  //  // Host Communities of Reach data capture Teknaf, Ukhia
  //  var cyclone_shelter_filter = [ '20229479', '20229063', '20229099', '20229015', '20229031', '20229039', '20229047', '20229079', '20037357', '20229415', '20229431', '20229463', '20229447' ];

  //  // filter 
  //  return function ( item ) {
  //    var list = item.filter(function( i ) {
  //      return cyclone_shelter_filter.indexOf( i.admin2pcode ) !== -1; 
  //    });
  //    return list;
  //  };
  // }])
  .factory( 'ngmCbLocations', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

    // ngmCbLocations
    ngmCbLocations = {

      // Host Communities of Reach data capture Teknaf, Ukhia
      host_community_filter: [ '202290', '202294' ],

      // init
      init: function( target_locations ) {
        ngmCbLocations.showColumns.active = ngmCbLocations.showColumns.defaults;
        ngmCbLocations.setColumns( target_locations );
      },

      // SHOW / HIDE COLUMNS

      // columns
      showColumns: {
        defaults:{
          'ward': false,
          'camp': false,
          'site': false,
          'location_dropdown': false,
          'food_distribution_point': false,
          'columns': []
        }
      },

      // show the column
      setColumns: function( target_locations ){

        // let form catch up
        $timeout(function() {

          // for each location
          angular.forEach( target_locations, function( d, i ){

            // set empty column
            if ( !ngmCbLocations.showColumns.active.columns[ i ] ){
              ngmCbLocations.showColumns.active.columns[ i ] = [];
            }

            // ward header, columns
            if ( d.site_type_id === 'ward' || d.site_type_id === 'host_community' ) {
              ngmCbLocations.showColumns.active[ 'ward' ] = true;
              ngmCbLocations.showColumns.active.columns[ i ][ 'ward' ] = true;
            }

            // camp header, columns
            if ( d.site_type_id === 'refugee_block' ||
                  d.site_type_id === 'nutrition_center' ||
                  d.site_type_id === 'retail_store' ||
                  d.site_type_id === 'health_facility_camp' ) {
              ngmCbLocations.showColumns.active[ 'camp' ] = true;
              ngmCbLocations.showColumns.active.columns[ i ][ 'camp' ] = true;
            }

            // site header, columns
            if ( d.site_type_id === 'access_road' ||
                  d.site_type_id === 'access_road_and_drainage' ||
                  d.site_type_id === 'bamboo_bridge' ||
                  d.site_type_id === 'canal_re_excavation' ||
                  d.site_type_id === 'culvert' ||
                  d.site_type_id === 'cyclone_shelter' ||
                  d.site_type_id === 'dam' ||
                  d.site_type_id === 'drainage' ||
                  d.site_type_id === 'enbankment' ||
                  d.site_type_id === 'fencing' ||
                  d.site_type_id === 'pathway' ||
                  d.site_type_id === 'pathway_and_canal_pond_re_excavation' ||
                  d.site_type_id === 'pathway_and_drainage' ||
                  d.site_type_id === 'rehabilitation_cyclone_shelters' ||
                  d.site_type_id === 'road_construction' ||
                  d.site_type_id === 'road_rehabilitation' ||
                  d.site_type_id === 'slope_protection' ||
                  d.site_type_id === 'stair' ) {
              ngmCbLocations.showColumns.active[ 'site' ] = true;
              ngmCbLocations.showColumns.active.columns[ i ][ 'site' ] = true;
            }

            // camp header, columns
            if ( d.site_type_id === 'food_distribution_point' ) {
              ngmCbLocations.showColumns.active[ 'food_distribution_point' ] = true;
              ngmCbLocations.showColumns.active.columns[ i ][ 'food_distribution_point' ] = true;
            }

            console.log( ngmCbLocations.showColumns )

          });

        }, 0 );

      },

      // clear the Union on site type change
      changeLocation: function( project, type, target_location ) {
          
        // location
        if ( type === 'location' ) {

          // admin2
          delete target_location.admin1pcode;
          delete target_location.admin1name;
          delete target_location.admin1lng;
          delete target_location.admin1lat;

        }

        // admin1
        if ( type === 'location' || type === 'admin1' ) {

          // admin2
          delete target_location.admin2pcode;
          delete target_location.admin2name;
          delete target_location.admin2lng;
          delete target_location.admin2lat;

        }

        // admin1 || admin2
        if ( type === 'location' || type === 'admin1' || type === 'admin2' ) {

          // admin3
          delete target_location.admin3pcode;
          delete target_location.admin3name;
          delete target_location.admin3lng;
          delete target_location.admin3lat;
        }

        // admin4
        if ( type === 'location' || type === 'admin3' || type === 'food_distribution_point' ) {

          // admin4
          delete target_location.admin4pcode;
          delete target_location.admin4name;
          delete target_location.admin4lng;
          delete target_location.admin4lat;
        }

        // admin1, admin2, admin3
        if ( type === 'location' || type === 'admin1' || type === 'admin2' || type === 'admin3' ) {

          // site
          delete target_location.site_id;
          delete target_location.site_lng;
          delete target_location.site_lat;
        }

        // add location groups (timeout to allow form to assign value)
        $timeout(function() {
          if ( project.location_groups_check && target_location.admin2pcode ) {
            target_location.location_group_id = target_location.admin2pcode;
            target_location.location_group_type = target_location.admin2type_name;
            target_location.location_group_name = target_location.admin2name;
          }
        }, 10);

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

      // admin1
      displayAdmin1: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.admin1pcode = $data;
        // if admin1pcode
        if( target_location.admin1pcode ) {
          // select site type
          selected = $filter('filter')( lists.admin1, { admin1pcode: target_location.admin1pcode }, true );
          if( selected && selected.length ){
            // remove id
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }
        }

        // return name
        return selected && selected.length ? selected[0].admin1name : '-';
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
          selected = $filter('filter')( lists.admin2, { admin2pcode: target_location.admin2pcode }, true );
          if( selected && selected.length ){
            // remove id
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }
        }

        // return name
        return selected && selected.length ? selected[0].admin2name : '-';
      },

      // admin3
      displayAdmin3: function( lists, $index, $data, target_location ){

        // attr
        var selected = [];

        // filter by site_type
        target_location.admin3pcode = $data;
        // if admin2pcode
        if( target_location.admin3pcode ) {
          // select site type
          selected = $filter('filter')( lists.admin3, { admin3pcode: target_location.admin3pcode }, true );
          if( selected && selected.length ){
            // remove id
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
            if ( ngmCbLocations.showColumns.active.columns[ $index ][ 'site' ] &&
                  !target_location.site_lng && 
                  !target_location.site_lat ) {
              target_location.site_lng = selected[0].admin3lng;
              target_location.site_lat = selected[0].admin3lat;
            }
            if ( ngmCbLocations.showColumns.active.columns[ $index ][ 'site' ] &&
                  !target_location.site_id ) {
              target_location.site_id = selected[0].admin3pcode + '_' + target_location.site_type_id.replace( '_camp', '' ).toUpperCase() + '_' + new Date().getTime();
            }
          }
        }

        // return name
        return selected && selected.length ? selected[0].admin3name : '-';
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
            if ( target_location.site_type_id === 'refugee_camp' ) {
              selected[0].admin3pcode = selected[0].site_id;
              selected[0].admin3name = selected[0].site_name;
              selected[0].admin3lng = selected[0].site_lng;
              selected[0].admin3lat = selected[0].site_lat;
            }
            angular.merge( target_location, selected[0] );
          }
        }

      }

    }

    // return
    return ngmCbLocations;

  }]);