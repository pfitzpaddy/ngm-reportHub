/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterLocations', [ '$http', '$filter', '$timeout', 'ngmAuth', function( $http, $filter, $timeout, ngmAuth ) {

		ngmClusterLocations = {

      openAddNewLocation: false,

      new_location: {},

      // open new locaiton form in monthly report 
      openNewLocation: function( project, locations ) {
        ngmClusterLocations.new_location = ngmClusterLocations.addLocation( project.definition, locations );
        // set adminSitesSelect
        angular.forEach( project.report.locations, function( d, i ) {
          if ( !project.lists.adminSitesSelect[ i ] ) {
            project.lists.adminSitesSelect[ i ] = angular.copy( project.lists.adminSites );
          }
        });
        // trigger form update
        ngmClusterLocations.adminOnChange( project.lists, 'admin3pcode', locations.length-1, ngmClusterLocations.new_location.admin3pcode, ngmClusterLocations.new_location );
        // lists, pcode, $index, $data, target_location
        ngmClusterLocations.openAddNewLocation = !ngmClusterLocations.openAddNewLocation;
      },

      // add new_location
      addNewLocation: function( project, new_location ){
        new_location.beneficiaries = [];
        project.report.locations.push( new_location );
        ngmClusterLocations.new_location = {};
        ngmClusterLocations.openAddNewLocation = false;
      },
      
      // add location
      addLocation: function( project, locations ) {
        
        // reporter
        var inserted = {
          name: project.name,
          position: project.position,
          phone: project.phone,
          email: project.email,
          username: project.username,
          site_list_select_id: 'no',
          site_list_select_yes: 'No',
          site_list_select_disabled: true
        }

        // clone
        var length = locations.length;
        if ( length ) {
          var l = angular.copy( locations[ length - 1 ] );
          delete l.id;
          l.site_hub_id = null;
          l.site_hub_name = null;
          l.site_id = null;
          l.site_name = null;
          l.site_lat = null;
          l.site_lng = null;
          inserted = angular.merge( inserted, l );
        }
        // set targets
        return inserted;
      },

      // remove beneficiary
      removeLocation: function( project, locationIndex ) {

        // get id
        var id = project.target_locations[ locationIndex ].id;
        project.target_locations.splice( locationIndex, 1 );

        // remove at db
        $http({
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/cluster/project/removeLocation',
          data: { id: id }
        }).success( function( result ) {
          Materialize.toast( 'Project Location Removed!' , 3000, 'success' )
        }).error( function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });
      },

      showReporter: function( lists, $data, target_location ){
        var selected = [];
        target_location.username = $data;
        if( target_location.username ) {
          // filter selection
          selected = $filter('filter')( lists.users, { username: target_location.username }, true );
          if ( selected && selected.length ) {
            var reporter = {
              name: selected[0].name,
              position: selected[0].position,
              phone: selected[0].phone,
              email: selected[0].email,
              username: selected[0].username
            }
            angular.merge( target_location, reporter );
          }
        }
        return selected && selected.length ? selected[0].username : '-';
      },

      // site implementation
      showSiteImplementation: function( lists, $data, target_location ){
        var selected = [];
        target_location.site_implementation_id = $data;
        if( target_location.site_implementation_id ) {
          selected = $filter('filter')( lists.site_implementation, { site_implementation_id: target_location.site_implementation_id }, true);
          target_location.site_implementation_name = selected[0].site_implementation_name;
        }
        return selected.length ? selected[0].site_implementation_name : '-';
      },

      // get sites
      getAdminSites: function( lists, admin0pcode, pcode, $index, $data, target_location ){

        // fetch
        $timeout(function(){

          // admin3
          if ( lists.admin3.length ) {
            var selected_admin3 = $filter('filter')( lists.admin3, { admin1pcode: target_location.admin1pcode }, true );
            if ( !selected_admin3.length ){
              $http({ method: 'GET', 
                      url: ngmAuth.LOCATION + '/api/list/getAdmin3List?admin0pcode=' 
                                              + admin0pcode
                                              + '&admin1pcode=' + target_location.admin1pcode
              }).success( function( result ) {
                var selected_admin3 = $filter('filter')( lists.admin3, { admin1pcode: target_location.admin1pcode }, true );
                if ( !selected_admin3.length ){
                  lists.admin3 = lists.admin3.concat( result );
                  ngmClusterLocations.adminOnChange( lists, pcode, $index, $data, target_location );
                }
              });
            }
          }

          // admin4
          if ( lists.admin4.length ) {
            var selected_admin4 = $filter('filter')( lists.admin4, { admin1pcode: target_location.admin1pcode }, true );
            if ( !selected_admin4.length ){
              $http({ method: 'GET', 
                      url: ngmAuth.LOCATION + '/api/list/getAdmin4List?admin0pcode=' 
                                              + admin0pcode
                                              + '&admin1pcode=' + target_location.admin1pcode
              }).success( function( result ) {
                var selected_admin4 = $filter('filter')( lists.admin4, { admin1pcode: target_location.admin1pcode }, true );
                if ( !selected_admin4.length ){
                  lists.admin4 = lists.admin4.concat( result );
                  ngmClusterLocations.adminOnChange( lists, pcode, $index, $data, target_location );
                }
              });
            }
          }        

          // admin5
          if ( lists.admin5.length ) {
            var selected_admin5 = $filter('filter')( lists.admin5, { admin1pcode: target_location.admin1pcode }, true );
            if ( !selected_admin5.length ){
              $http({ method: 'GET', 
                      url: ngmAuth.LOCATION + '/api/list/getAdmin5List?admin0pcode=' 
                                              + admin0pcode
                                              + '&admin1pcode=' + target_location.admin1pcode
              }).success( function( result ) {
                var selected_admin5 = $filter('filter')( lists.admin5, { admin1pcode: target_location.admin1pcode }, true );
                if ( !selected_admin5.length ){
                  lists.admin5 = lists.admin5.concat( result );
                  ngmClusterLocations.adminOnChange( lists, pcode, $index, $data, target_location );
                }
              });
            }
          }        

          // sites
          var selected_sites = $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode }, true );
          if ( !selected_sites.length ){
            $http({ method: 'GET', 
                    url: ngmAuth.LOCATION + '/api/list/getAdminSites?admin0pcode=' 
                                            + admin0pcode
                                            + '&admin1pcode=' + target_location.admin1pcode
            }).success( function( result ) {
              var selected_sites = $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode }, true );
              if ( !selected_sites.length ){
                lists.adminSites = lists.adminSites.concat( result );
                ngmClusterLocations.adminOnChange( lists, pcode, $index, $data, target_location );
              }
            });
          }

        }, 0 );
      },
      
      // showadmin
      showAdmin: function( lists, parent_pcode, list, pcode, name, $index, $data, target_location ){

        // params
        var selected = [];

        // selection list
        if( target_location[ parent_pcode ] ) {
          
          // filter parent list
          var search_parent_admin = {}
          search_parent_admin[ parent_pcode ] = target_location[ parent_pcode ];
          lists[ list + 'Select' ][ $index ] = $filter('filter')( lists[ list ], search_parent_admin, true );

          // other (for ET lists)
          var o_index, o_other;
          angular.forEach( lists[ list + 'Select' ][ $index ], function( d, i ) {
            if ( d.admin3name === 'Other' ) { o_index = i; o_other = d; }
          });
          if ( o_other ) {
            lists[ list + 'Select' ][ $index ].splice( o_index, 1 );
            lists[ list + 'Select' ][ $index ].push( o_other );
          }

        } 

        // list selection
        target_location[ pcode ] = $data;
        if( target_location[ pcode ] ) {

          // filter
          var search_admin = {}
          search_admin[ pcode ] = target_location[ pcode ];

          // get selection
          selected = $filter( 'filter')( lists[ list + 'Select' ][ $index ], search_admin, true );
          if ( selected && selected[0] && selected[0].id ) { 
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }

          // filter sites
          lists.adminSitesSelect[ $index ] = $filter('filter')( lists.adminSites, search_admin, true );
 
        }

        // return name
        return selected && selected.length ? selected[0][ name ] : '-';
      },

      // site_type
      showSiteType: function( lists, $index, $data, target_location ){
        
        // attr
        var selected = [],
            site_list = [];

        // filter by site_type
        target_location.site_type_id = $data;
        if( target_location.site_type_id ) {

          // select site type
          selected = $filter('filter')( lists.site_type, { site_type_id: target_location.site_type_id }, true );
          if( selected[0] && selected[0] ){
            delete selected[0].id;
            target_location.site_type_id = selected[0].site_type_id;
            target_location.site_type_name = selected[0].site_type_name;
          }

        }

        // return name
        return selected.length ? selected[0].site_type_name : '-';
      },


      // on change
      adminOnChange: function( lists, pcode, $index, $data, target_location ){

        // set to null
        var site_list = [];
        target_location.site_id = null;
        target_location.site_list_select_disabled = false;

        // clear selections
        switch( pcode ) {
          case 'admin1pcode':
            delete target_location.admin2pcode;
            delete target_location.admin2name;
            delete target_location.admin3pcode;
            delete target_location.admin3name;
            delete target_location.admin4pcode;
            delete target_location.admin4name;
            delete target_location.admin5pcode;
            delete target_location.admin5name;
            break;
          case 'admin2pcode':
            delete target_location.admin3pcode;
            delete target_location.admin3name;
            delete target_location.admin4pcode;
            delete target_location.admin4name;
            delete target_location.admin5pcode;
            delete target_location.admin5name;
            break;
          case 'admin3pcode':
            delete target_location.admin4pcode;
            delete target_location.admin4name;
            delete target_location.admin5pcode;
            delete target_location.admin5name;
            break;
          case 'admin4pcode':
            delete target_location.admin5pcode;
            delete target_location.admin5name;
            break;
        }

        // filter admin
        var search_site = {}
        search_site[ pcode ] = target_location[ pcode ];

        // filter adminsites
        if( target_location.site_type_id ) {
          angular.merge( search_site, { site_type_id: target_location.site_type_id } );
        }

        // apply filter
        site_list = $filter('filter')( lists.adminSitesSelect[ $index ], search_site, true );

        // set site selected
        if ( site_list && site_list.length && target_location.site_type_id ) {
          target_location.site_list_select_id = 'yes';
          target_location.site_list_select_name = 'Yes';
          target_location.site_list_select_disabled = false;
        } else {
          target_location.site_list_select_id = 'no';
          target_location.site_list_select_name = 'No';
          target_location.site_list_select_disabled = true;
        }

      },

      // select from list?
      showListYesNo: function( lists, $index, $data, target_location ){

        // sites        
        var selected = [];

        // set sites to null
        target_location.site_list_select_id = $data;

        // disabled false
        if ( target_location.site_list_select_id && target_location.site_list_select_id === 'yes' ) {
          target_location.site_list_select_disabled = false;
        }

        if( target_location.site_list_select_id ) {
          selected = $filter('filter')( lists.site_list_select, { site_list_select_id: target_location.site_list_select_id }, true );
          target_location.site_list_select_name = selected[0].site_list_select_name;
        }
        // name
        return selected.length ? selected[0].site_list_select_name : '-';
      },

      // show sites
      showAdminSites: function( lists, $index, $data, target_location ){

        // display
        var selected = [];
        target_location.site_id = $data;
        if( target_location.site_id ) {

          // filter selection
          selected = $filter('filter')( lists.adminSitesSelect[$index], { site_id: target_location.site_id }, true);
          if ( selected[0] && selected[0].id ) { 
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }
        }
        return target_location.site_name ? target_location.site_name : '-';
      },

      // site_name
      showSiteName: function( $data, target_location ){
        if( $data ) { target_location.site_name = $data; }
        return target_location.site_name ? target_location.site_name : '';
      },

		};

    return ngmClusterLocations;

	}]);