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
          site_list_select_yes: 'No'
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
      getAdmin4: function( lists, target_location ){
        $timeout(function(){
          var selected = $filter('filter')( lists.admin4sites, { admin1pcode: target_location.admin1pcode }, true );
          if ( !selected.length ){
            $http({ method: 'GET', 
                    url: ngmAuth.LOCATION + '/api/list/getAdmin4List?admin0pcode=' 
                                            + target_location.admin0pcode
                                            + '&admin1pcode=' + target_location.admin1pcode
            }).success( function( result ) {
              lists.admin4sites = lists.admin4sites.concat( result );
            });
          }
        }, 0 );
      },

      // get sites
      getAdmin5: function( lists, target_location ){
        $timeout(function(){
          var selected = $filter('filter')( lists.admin5sites, { admin1pcode: target_location.admin1pcode }, true );
          if ( !selected.length ){
            $http({ method: 'GET', 
                    url: ngmAuth.LOCATION + '/api/list/getAdmin5List?admin0pcode=' 
                                            + target_location.admin0pcode
                                            + '&admin1pcode=' + target_location.admin1pcode
            }).success( function( result ) {
              lists.admin5sites = lists.admin5sites.concat( result );
            });
          }
        }, 0 );
      },

      // get sites
      getAdminSites: function( lists, target_location ){
        $timeout(function(){
          var selected = $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode }, true );
          if ( !selected.length ){
            $http({ method: 'GET', 
                    url: ngmAuth.LOCATION + '/api/list/getAdminSites?admin0pcode=' 
                                            + target_location.admin0pcode
                                            + '&admin1pcode=' + target_location.admin1pcode
            }).success( function( result ) {
              lists.adminSites = lists.adminSites.concat( result );
            });
          }
        }, 0 );
      },

      // admin1
      showAdmin1: function( lists, $data, target_location ){
        var selected = [];
        target_location.admin1pcode = $data;
        if( target_location.admin1pcode ) {

          // filter selection
          selected = $filter('filter')( lists.admin1, { admin1pcode: target_location.admin1pcode }, true);
          if ( selected[0] && selected[0].id ) { 
            delete selected[0].id;
            angular.merge( target_location, selected[0] );
          }
        }

        // return name
        return selected.length ? selected[0].admin1name : '-';
      },

      // admin2
      showAdmin2: function( lists, $index, $data, target_location ){

        // exists
        if ( target_location && 
              target_location.admin1pcode ) {

          lists.admin2Select[$index] =
                  $filter('filter')( lists.admin2, { admin1pcode: target_location.admin1pcode }, true );

          // update
          var selected = [];
          target_location.admin2pcode = $data;
          if( target_location.admin2pcode ) {
            
            // filter selection
            selected = $filter('filter')( lists.admin2Select[$index], { admin2pcode: target_location.admin2pcode }, true );
            if ( selected[0] && selected[0].id ) { 
              delete selected[0].id;
              angular.merge( target_location, selected[0] );
            }
            
            // filter sites
            lists.adminSitesSelect[$index] = 
                $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode }, true );
            // if no admin3sites
            if ( !lists.adminSitesSelect[$index].length ) {
              target_location.site_list_select_id = 'no';
              target_location.site_list_select_name = 'No';
            }

          }

        }

        return selected && selected.length ? selected[0].admin2name : '-';
      },

      // admin3
      showAdmin3: function( lists, $index, $data, target_location ){

        // other lists
        var index, 
            other;

        // exists
        if ( target_location && 
              target_location.admin1pcode &&
              target_location.admin2pcode ) {

          // filter admin3
          lists.admin3Select[$index] =
                  $filter('filter')( lists.admin3, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode }, true);
          // other (for ET lists)
          angular.forEach( lists.admin3Select[$index], function( d, i ) {
            if ( d.admin3name === 'Other' ) { index = i; other = d; }
          });
          if ( other ) {
            lists.admin3Select[$index].splice( index, 1 );
            lists.admin3Select[$index].push( other );
          }

          // select
          var selected = [];
          target_location.admin3pcode = $data;
          if( target_location.admin3pcode ) {

            // filter selection
            selected = $filter('filter')( lists.admin3Select[$index], { admin3pcode: target_location.admin3pcode }, true);
            if( selected[0] && selected[0].id ){
              delete selected[0].id;
              angular.merge( target_location, selected[0] );
            }

            // filter sites
            lists.adminSitesSelect[$index] = 
                $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode,
                                                        admin3pcode: target_location.admin3pcode }, true );
            // if no admin3sites
            if ( !lists.adminSitesSelect[$index].length ) {
              target_location.site_list_select_id = 'no';
              target_location.site_list_select_name = 'No';
            }

          }

        }

        // return name
        return selected && selected.length ? selected[0].admin3name : '-';
      },

      // admin4
      showAdmin4: function( lists, $index, $data, target_location ){

        // other lists
        var index, 
            other;

        // exists
        if ( target_location && 
              target_location.admin1pcode &&
              target_location.admin2pcode &&
              target_location.admin3pcode ) {

          // filter admin3
          lists.admin4Select[$index] =
                  $filter('filter')( lists.admin4, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode,
                                                        admin3pcode: target_location.admin3pcode }, true );

          // select
          var selected = [];
          target_location.admin4pcode = $data;
          if( target_location.admin4pcode ) {

            // filter selection
            selected = $filter('filter')( lists.admin4Select[$index], { admin4pcode: target_location.admin4pcode }, true );
            if( selected[0] && selected[0].id ){
              delete selected[0].id;
              angular.merge( target_location, selected[0] );
            }

            // filter sites
            lists.adminSitesSelect[$index] = 
                $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode,
                                                        admin3pcode: target_location.admin3pcode,
                                                        admin4pcode: target_location.admin4pcode }, true );
            // if no admin3sites
            if ( !lists.adminSitesSelect[$index].length ) {
              target_location.site_list_select_id = 'no';
              target_location.site_list_select_name = 'No';
            }

          }

        }

        // return name
        return selected && selected.length ? selected[0].admin4name : '-';
      },

      // admin5
      showAdmin5: function( lists, $index, $data, target_location ){

        // other lists
        var index, 
            other;

        // exists
        if ( target_location && 
              target_location.admin1pcode &&
              target_location.admin2pcode &&
              target_location.admin3pcode &&
              target_location.admin4pcode ) {

          // filter admin3
          lists.admin5Select[$index] =
                  $filter('filter')( lists.admin5, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode,
                                                        admin3pcode: target_location.admin3pcode,
                                                        admin4pcode: target_location.admin4pcode }, true );

          // select
          var selected = [];
          target_location.admin5pcode = $data;
          if( target_location.admin5pcode ) {

            // filter selection
            selected = $filter('filter')( lists.admin5Select[$index], { admin5pcode: target_location.admin5pcode }, true );
            if( selected[0] && selected[0].id ){
              delete selected[0].id;
              angular.merge( target_location, selected[0] );
            }

            // filter sites
            lists.adminSitesSelect[$index] = 
                $filter('filter')( lists.adminSites, { admin1pcode: target_location.admin1pcode, 
                                                        admin2pcode: target_location.admin2pcode,
                                                        admin3pcode: target_location.admin3pcode,
                                                        admin4pcode: target_location.admin4pcode,
                                                        admin5pcode: target_location.admin5pcode }, true );
            // if no admin3sites
            if ( !lists.adminSitesSelect[$index].length ) {
              target_location.site_list_select_id = 'no';
              target_location.site_list_select_name = 'No';
            }

          }

        }

        // return name
        return selected && selected.length ? selected[0].admin5name : '-';
      },

      // site_type
      showSiteType: function( lists, $index, $data, target_location ){
        
        var selected = [],
            site_list = [];

        // filter by site_type
        target_location.site_type_id = $data;
        target_location.site_list_select_disabled = true;
        if( target_location.site_type_id ) {
          selected = $filter('filter')( lists.site_type, { site_type_id: target_location.site_type_id }, true );
          if( selected[0] && selected[0] ){
            delete selected[0].id;
            target_location.site_type_id = selected[0].site_type_id;
            target_location.site_type_name = selected[0].site_type_name;
          }

          // site list
          if ( target_location.admin3pcode ) {  
            site_list = $filter('filter')( lists.adminSitesSelect[$index], { 
              admin1pcode: target_location.admin1pcode, 
              admin2pcode: target_location.admin2pcode,
              admin3pcode: target_location.admin3pcode,
              site_type_id: target_location.site_type_id
            }, true );
          } else {
            site_list = $filter('filter')( lists.adminSitesSelect[$index], { 
              admin1pcode: target_location.admin1pcode,
              admin2pcode: target_location.admin2pcode,
              site_type_id: target_location.site_type_id
            }, true );
          }
          // enable / disabled
          if ( !site_list ){ site_list = [] }
          target_location.site_list_select_disabled = !site_list.length;

        }
        return selected.length ? selected[0].site_type_name : '-';
      },

      // on change
      siteTypeOnChange: function( lists, $index, $data, target_location ){

        var site_list = [];
        target_location.site_id = null ;
        target_location.site_name = null;

        // site list
        if ( target_location.admin3pcode ) {  
          site_list = $filter('filter')( lists.adminSitesSelect[$index], { 
            admin1pcode: target_location.admin1pcode, 
            admin2pcode: target_location.admin2pcode,
            admin3pcode: target_location.admin3pcode,
            site_type_id: target_location.site_type_id
          }, true );
        } else {
          site_list = $filter('filter')( lists.adminSitesSelect[$index], { 
            admin1pcode: target_location.admin1pcode,
            admin2pcode: target_location.admin2pcode,
            site_type_id: target_location.site_type_id
          }, true );
        }
        // enable / disabled
        if ( !site_list ){ site_list = [] }
        target_location.site_list_select_disabled = !site_list.length;

        // set site selected
        if ( site_list.length ) {
          target_location.site_list_select_id = 'yes';
          target_location.site_list_select_name = 'Yes';
        } else {
          target_location.site_list_select_id = 'no';
          target_location.site_list_select_name = 'No';
        }

      },

      // select from list?
      showListYesNo: function( lists, $index, $data, target_location ){

        // sites        
        var selected = [];

        // set sites to null
        target_location.site_list_select_id = $data;

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