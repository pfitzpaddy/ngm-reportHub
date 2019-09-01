/**
 * @name ngmReportHub.factory:ngmCbLocations
 * @description
 * # ngmCbLocations
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	// .filter( 'admin2CxbHostCommunityfilter', [ '$filter', function ( $filter ) {
	// 	// Host Communities of Reach data capture Teknaf, Ukhia, Chittagong
	// 	var host_community[ $index ] = [ '202290', '202294', '20' ];
	// 	// filter 
	// 	return function ( item ) {
	// 		var list = item.filter(function( i ) {
	// 			return host_community[ $index ].indexOf( i.admin1pcode ) !== -1; 
	// 		});
	// 		return list;
	// 	};
	// }])
	.factory( 'ngmCbLocations', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterBeneficiaries', function( $http, $filter, $timeout, ngmAuth, ngmClusterBeneficiaries ) {

		// ngmCbLocations
		ngmCbLocations = {

			admin1_filter:[],
			admin2_filter:[],
			admin3_filter:[],
			adminSites_filter:[],

			// bb
			bbox: {
				'CB':{ admin0name: "Cox's Bazar", xMin:20.9489082225001, yMin:91.8643348260071, xMax:22.5038276085, yMax:92.2352242316744 },
				'NG':{ admin0name: "Nigeria", xMin:2.66853, yMin:4.27301, xMax:14.6788, yMax:13.8944 },
			},

			// very crude check that the borehole is in bbox of NG
			// for now this will have to do, bbox of admin3 level would be better but for now out of scope
			boreholeBboxCheck: function( b, label ){

				// get bb
				var id = $("label[for='" + label + "']");;
				var bb = ngmCbLocations.bbox[ 'CB' ];

				// bbox test
				if ( bb.xMin <= b.site_lng && b.site_lng <= bb.xMax && bb.yMin <= b.site_lat && b.site_lat <= bb.yMax ) {
					id.removeClass( 'error' ).addClass( 'active' );
				} else {
					id.addClass('error');
 					Materialize.toast( 'Location outside ' + bb.admin0name + '!' , 4000, 'error' );
				}

			},

			// form loader
			form:[{
				'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1
			}],

			// to be read from database
			defaults:{
				form:{
					
					// defaults
					'union':{ 'reporter':1, 'admin1':1, 'admin2':1, 'site_name_text': true },
					'ward':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Ward', 'site_name_text': true },
					'host_community':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Ward' },
					'refugee_camp':{ 'reporter':1, 'admin1':1, 'admin2':1 },
					'refugee_block':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp' },
					// fss
					'retail_store':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp' },
					'food_distribution_point':{ 'reporter':1, 'food_distribution_point':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp' },
					'nutrition_center':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp'  },
					'plantation':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp' },
					// schools
					'school':{ 'reporter':1, 'admin1':1, 'admin2':1 },
					// health
					'health_facility_camp':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Camp' },
					'health_facility_host_community':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'admin3type_name': 'Ward' },
					// drr
					'access_road':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'access_road_and_drainage':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'bamboo_bridge':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'canal_re_excavation':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'culvert':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'cyclone_shelter':{ 'reporter':1, 'admin1':1, 'admin2':1, 'site_lng': 1, 'site_lat': 1 },
					'dam':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'drainage':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'enbankment':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'fencing':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'pathway':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'pathway_and_canal_pond_re_excavation':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'pathway_and_drainage':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'rehabilitation_cyclone_shelters':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'road_construction':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'road_rehabilitation':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'slope_protection':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
					'stair':{ 'reporter':1, 'admin1':1, 'admin2':1, 'admin3':1, 'site_lng': 1, 'site_lat': 1 },
				}
			},

			// set input style 
			inputChange: function( label ){
				$("label[for='" + label + "']").removeClass('error').addClass('active');
			},

			// update material_select
			updateSelect: function(){
				$timeout(function() { $( 'select' ).material_select(); }, 100 );
			},

			updateSelectById: function (id) {
				$timeout(function () { $('#' + id + ' select').material_select(); }, 10 );
			},

			
			
			// **** SET LOCATIONS FORM / INPUTS ON LOAD

			// run setLocationsForm
			setLocationsForm: function( project, target_locations ){

				// target_locations
				if( target_locations && target_locations.length ) {

					// order to match view $index
					target_locations = $filter('orderBy')( target_locations, 'createdAt' );

					// for each target_location
					angular.forEach( target_locations, function( target_location, $index ){
						ngmCbLocations.setLocationsInputs( project, $index, target_location );
					});
				}
			},

			// show form inputs
			setLocationsInputs: function ( project, $index, target_location ) {

				// add form holder
				if ( !ngmCbLocations.form[ $index ] ) {
					ngmCbLocations.form[ $index ] = [];
				}

				// set lists
				ngmCbLocations.filterLocations( project, $index, target_location );

				// form defaults from from ngmCbLocations.defaults.form_defaults
				ngmCbLocations.form[ $index ] = ngmCbLocations.defaults.form[ target_location.site_type_id ];			

			},


			// **** SET LOCATIONS FORM / INPUTS ON LOAD

			// set reporter
			setReporter:function( project, $index, target_location ){

				var selected = [];
				if( target_location.username ) {
					// filter selection
					selected = $filter('filter')( project.lists.users, { username: target_location.username }, true );
					if ( selected && selected.length ) {
						var reporter = {
							name: selected[0].name,
							position: selected[0].position,
							phone: selected[0].phone,
							email: selected[0].email,
							username: selected[0].username
						}
						target_location = angular.merge( target_location, reporter );
						ngmCbLocations.setLocationsInputs( project, $index, target_location );
					}
				}				

			},

			// set site type
			setLocationType:function( project, $index, target_location ){

				var selected = [];
				if( target_location.site_type_id ) {
					// filter selection
					selected = $filter('filter')( project.lists.site_type, { site_type_id: target_location.site_type_id }, true );
					if ( selected && selected.length ) {
						
						// target_location
						var tl = {
							// type
							site_type_id: selected[0].site_type_id,
							site_type_name: selected[0].site_type_name
						}

						// reset locations
						target_location = ngmCbLocations.resetLocations( project, 'site_type_id', target_location );

						// merge object
						target_location = angular.merge( target_location, tl );

						// ? Set in setLocationsInputs【ツ】
						// add filters
						// ngmCbLocations.filterLocations( project, $index, target_location );

						// set form inputs
						ngmCbLocations.setLocationsInputs( project, $index, target_location );
					}
				}				

			},

			// on change
			updateLocation: function( project, $index, list, key, target_location ){

				// selected
				var selected = [];

				// if site_id
				if( target_location[ key ] ) {
					var obj = {}
					obj[ key ] = target_location[ key ];
					var selected = $filter('filter')( list, obj, true );
					
					// set target_location
					if( selected && selected.length ){
						
						// remove list id
						delete selected[0].id;
						
						// reset locations
						target_location = ngmCbLocations.resetLocations( project, key, target_location );

						// merge object
						target_location = angular.merge( target_location, selected[0] );

						// siteSite
						target_location = ngmCbLocations.setSite( key, target_location );

						// add filters 
						ngmCbLocations.filterLocations( project, $index, target_location );

					}
				}

				// add location groups
				if ( project.definition.location_groups_check && target_location.admin2pcode ) {
					target_location.location_group_id = target_location.admin2pcode;
					target_location.location_group_type = target_location.admin2type_name;
					target_location.location_group_name = target_location.admin2name;
				}

			},

			resetLocations: function( project, type, target_location ){

				// location
				if ( type === 'site_type_id' ) {

					// admin2
					delete target_location.admin1pcode;
					delete target_location.admin1name;
					delete target_location.admin1lng;
					delete target_location.admin1lat;

				}

				// admin1
				if ( type === 'site_type_id' || type === 'admin1pcode' ) {

					// admin2
					delete target_location.admin2pcode;
					delete target_location.admin2name;
					delete target_location.admin2lng;
					delete target_location.admin2lat;

				}

				// admin1 || admin2
				if ( type === 'site_type_id' || type === 'admin1pcode' || type === 'admin2pcode' ) {

					// admin3
					delete target_location.admin3pcode;
					delete target_location.admin3name;
					delete target_location.admin3lng;
					delete target_location.admin3lat;
				}

				// admin4
				if ( type === 'site_type_id' || type === 'admin1pcode' || type === 'admin2pcode' || type === 'admin3pcode' ) {

					// admin4
					delete target_location.admin4pcode;
					delete target_location.admin4name;
					delete target_location.admin4lng;
					delete target_location.admin4lat;

					// site
					delete target_location.site_id;
					delete target_location.site_name;
					delete target_location.site_lng;
					delete target_location.site_lat;
				}
				
				return target_location;

			},

			// setSite
			setSite:function( key, target_location ){
				if ( key === 'admin1pcode' ) {
					target_location.site_id = target_location.admin1pcode;
					// target_location.site_name = target_location.admin1name;
					target_location.site_lng = target_location.admin1lng;
					target_location.site_lat = target_location.admin1lat;
				}
				if ( key === 'admin2pcode' ) {
					target_location.site_id = target_location.admin2pcode;
					// target_location.site_name = target_location.admin2name;
					target_location.site_lng = target_location.admin2lng;
					target_location.site_lat = target_location.admin2lat;
				}
				if ( key === 'admin3pcode' ) {
					target_location.site_id = target_location.admin3pcode;
					// target_location.site_name = target_location.admin3name;
					target_location.site_lng = target_location.admin3lng;
					target_location.site_lat = target_location.admin3lat;
				}
				return target_location;
			},

			// filterLocations
			filterLocations: function( project, $index, target_location ){

				// unique values
				var admin1 = [];
				var admin2 = [];
				var admin3 = [];
				var adminSites = [];

				// form filters 
				ngmCbLocations.admin1_filter[ $index ] = project.lists.admin1;
				ngmCbLocations.admin2_filter[ $index ] = project.lists.admin2;
				ngmCbLocations.admin3_filter[ $index ] = project.lists.admin3;
				ngmCbLocations.adminSites_filter[ $index ] = project.lists.adminSites;


				// run filter site_type_id
				ngmCbLocations.adminSites_filter[ $index ] = project.lists.adminSites.filter(function( i ) {
					// filter by site_type
					if ( i.site_type_id === target_location.site_type_id ) {
						// get unique admin 1, 2, 3
						if ( admin1.indexOf( i.admin1pcode ) === -1 ) {
							admin1.push( i.admin1pcode );
						}
						if ( admin2.indexOf( i.admin2pcode ) === -1 ) {
							admin2.push( i.admin2pcode );
						}
						if ( admin3.indexOf( i.admin3pcode ) === -1 ) {
							admin3.push( i.admin3pcode );
						}
						if ( adminSites.indexOf( i.site_id ) === -1 ) {
							adminSites.push( i.site_id );
						}
					}
					// return
					return i.site_type_id === target_location.site_type_id;
				});

				// if not union, ward
				if ( target_location.site_type_id !== 'union' && 
							target_location.site_type_id !== 'ward' && 
							target_location.site_type_id !== 'host_community' ) {
					
					// admin1
					if ( admin1.length ) {
						// run filter admin1
						ngmCbLocations.admin1_filter[ $index ] = project.lists.admin1.filter(function( i ) {
							return admin1.indexOf( i.admin1pcode ) !== -1;
						});
					}
					// admin1
					if ( admin2.length ) {
						// run filter admin2
						ngmCbLocations.admin2_filter[ $index ] = project.lists.admin2.filter(function( i ) {
							return admin2.indexOf( i.admin2pcode ) !== -1;
						});
					}
					// admin1
					if ( admin3.length ) {
						// run filter admin3
						ngmCbLocations.admin3_filter[ $index ] = project.lists.admin3.filter(function( i ) {
							return admin3.indexOf( i.admin3pcode ) !== -1;
						});
					}
				}

				// admin1pcode
				if ( target_location.admin1pcode ) {
					// run filter admin2
					ngmCbLocations.admin2_filter[ $index ] = ngmCbLocations.admin2_filter[ $index ].filter(function( i ) {
						return i.admin1pcode === target_location.admin1pcode;
					});
					// run filter admin3
					ngmCbLocations.admin3_filter[ $index ] = ngmCbLocations.admin3_filter[ $index ].filter(function( i ) {
						return i.admin1pcode === target_location.admin1pcode;
					});
					// run filter adminsites
					ngmCbLocations.adminSites_filter[ $index ] = ngmCbLocations.adminSites_filter[ $index ].filter(function( i ) {
						return i.admin1pcode === target_location.admin1pcode;
					});					
				}

				// admin2pcode
				if ( target_location.admin2pcode ) {
					// run filter admin3
					ngmCbLocations.admin3_filter[ $index ] = ngmCbLocations.admin3_filter[ $index ].filter(function( i ) {
						return i.admin2pcode === target_location.admin2pcode;
					});
					// run filter adminsites
					ngmCbLocations.adminSites_filter[ $index ] = ngmCbLocations.adminSites_filter[ $index ].filter(function( i ) {
						return i.admin2pcode === target_location.admin2pcode;
					});
				}

				// admin2pcode
				if ( target_location.admin3pcode ) {
					// run filter adminsites
					ngmCbLocations.adminSites_filter[ $index ] = ngmCbLocations.adminSites_filter[ $index ].filter(function( i ) {
						return i.admin3pcode === target_location.admin3pcode;
					});
				}

			}

		}

		// return
		return ngmCbLocations;

	}]);