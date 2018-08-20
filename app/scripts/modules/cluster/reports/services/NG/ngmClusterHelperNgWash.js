/**
 * @name ngmReportHub.factory:ngmClusterHelperNgWash
 * @description
 * # ngmClusterWashHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterHelperNgWash', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmAuth',
				'ngmClusterHelperNgWashLists',
				'ngmClusterHelperNgWashValidation',
				function( $http, $filter, $timeout, ngmAuth, ngmClusterHelperNgWashLists, ngmClusterHelperNgWashValidation ) {

		// definition
		var ngmClusterHelperNgWash = {
					
			// NG and WASH
			templateUrl: 'beneficiaries/NG/wash/',

			// beneficiaries
			ratios: {
				beneficiaries: 66.6667,
				households: 0.1666666666667, // 1/6
				boys: 0.2538,
				girls: 0.2862,
				men: 0.1833,
				women: 0.2067,
				elderly_men: 0.0329,
				elderly_women: 0.0371
			},

			// reset form
			init_material_select:function(){
				setTimeout(function(){ 
					$( '.input-field input' ).removeClass( 'invalid' );
					$( '.input-field input' ).removeClass( 'ng-touched' );
					$( '.input-field select' ).material_select(); 
				}, 10 );
			},

			// show template
			getTemplate: function( beneficiary ){
				if ( beneficiary.activity_detail_id ) {
					return ngmClusterHelperNgWashLists.keys[ beneficiary.activity_detail_id ].template
				} else {
					return false;
				}
			},

			// set input style 
			inputChange: function( label ){
				$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
			},

			// update display name in object on select change
			selectChange: function( d, list, key, name, label ){
				console.log( d );
				if ( d[ key ] ) {
					var id = d[ key ];
					var obj = {}
					var search_list = ngmClusterHelperNgWashLists.lists[ list ];
					// this approach does NOT break gulp!
					obj[key] = id;
					var filter = $filter('filter')( search_list, obj, true );
					// set name
					d[ name ] = filter[0][ name ];
					$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
					ngmClusterHelperNgWash.init_material_select();
				}
			},

			// add initial object
			detailsChange: function( $location, $beneficiary ){

				// slight timeout to capture UI changes
				$timeout(function(){
					
					// beneficiary
					if ( $beneficiary.activity_detail_id ) {

					// ngmClusterHelperNgWash keys 
					var keys = ngmClusterHelperNgWashLists.keys[ $beneficiary.activity_detail_id ];
						// in case user changes their mind ( update existing )
						if ( $beneficiary[ keys.association ] && $beneficiary[ keys.association ].length ) {
							angular.forEach( $beneficiary[ keys.association ], function( a, i ) {
								// make new
								var activity = angular.merge( {}, ngmClusterHelperNgWashLists.keys.defaults, keys.measurement );
										activity.borehole_lng = $location.site_lng;
										activity.borehole_lat = $location.site_lat;								
								$beneficiary[ keys.association ][ i ] = activity;
								// init UI
								ngmClusterHelperNgWash.init_material_select();
							});
						} else {
							// add new 
							ngmClusterHelperNgWash.addActivity( $location, $beneficiary, keys.association );
						}

					}
				}, 10 );
			},

			// add activity ( reticulation, service, maintenance )
			addActivity: function( location, beneficiary, association ) {

				// based on association and activity_detail
				var length = beneficiary[ association ] && beneficiary[ association ].length;
				var measurement = ngmClusterHelperNgWashLists.keys[ beneficiary.activity_detail_id ].measurement;
				
				// create model using ngmClusterHelperNgWash keys ( based on activity_detail )
				var activity = angular.merge( {}, ngmClusterHelperNgWashLists.keys.defaults, measurement );

				// in case of boreholes ( only saved ay db level if boreholes )
				activity.borehole_lng = location.site_lng;
				activity.borehole_lat = location.site_lat;

				// set association
				if ( !length ){
					beneficiary[ association ] = [];
				}

				// copy previous
				if ( length ) {
					var a = angular.copy( beneficiary[ association ][ length - 1 ] );
					delete a.id;
					delete a.details;
					activity = angular.merge( {}, activity, a );
				}

				// push
				beneficiary[ association ].push( activity );

				// init
				ngmClusterHelperNgWash.init_material_select();

			},

			// add new details
			addDetails: function( d, obj ){
				d.details.push( obj );
			},

			// remove beneficiary nodal
			removeModal: function( project, beneficiary, $index, name, modal ) {
				ngmClusterHelperNgWash.project = project;
				ngmClusterHelperNgWash.beneficiary = beneficiary;
				ngmClusterHelperNgWash.name = name;
				ngmClusterHelperNgWash.$index = $index;
				$( modal ).openModal({ dismissible: false });
			},

			// remove borehole
			remove: function(){
				
				// get id
				var id = ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.name ][ ngmClusterHelperNgWash.$index ].id;
				ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.name ].splice( ngmClusterHelperNgWash.$index, 1 );
				
				// calculate location totals
				ngmClusterHelperNgWash.totalActivityBeneficiaries( ngmClusterHelperNgWash.project.report.locations );

				// update db if id exists (stored in db)
				if ( id ) {
					ngmClusterHelperNgWash.project.save( false, false );
				}			
			},

			// m3 = yield*hrs*3600secs
			boreholeOutput: function( locations, b ){
				if ( b.borehole_yield_ltrs_second >=0 && 
							b.borehole_pumping_ave_daily_hours >=0 ) {
					b.borehole_m3 = b.borehole_yield_ltrs_second * b.borehole_pumping_ave_daily_hours * 3600;
					b.borehole_beneficiaires = b.borehole_m3 * ngmClusterHelperNgWash.ratios.beneficiaries;
					b.households = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.households );
					b.boys = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.boys );
					b.girls = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.girls );
					b.men = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.men );
					b.women = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.women );
					b.elderly_men = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.elderly_men );
					b.elderly_women = Math.round( b.borehole_beneficiaires * ngmClusterHelperNgWash.ratios.elderly_women );
						
					// calculate location totals
					ngmClusterHelperNgWash.totalActivityBeneficiaries( locations );

				}
			},

			// calculate comboned beneficiaries per borehole by location / activity
			totalActivityBeneficiaries: function( locations ){
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( b, j ){
						b.households = 0;
						b.boys = 0;
						b.girls = 0;
						b.men = 0;
						b.women = 0;
						b.elderly_men = 0;
						b.elderly_women = 0;
						angular.forEach( b.boreholes, function( borehole, k ){
							b.households += borehole.households;
							b.boys += borehole.boys;
							b.girls += borehole.girls;
							b.men += borehole.men;
							b.women += borehole.women;
							b.elderly_men += borehole.elderly_men;
							b.elderly_women += borehole.elderly_women;
						});
					});
				});
			},

			// validate wash activities
			validateActivities: function( locations ) {

				// collect error divs
				var elements = [];

				// WATER
				// borehole
				var boreholeLength = 0;
				var boreholeRowComplete = 0;

				// reticulation
				var reticulationLength = 0;
				var reticulationRowComplete = 0;

				// service
				var serviceLength = 0;
				var serviceRowComplete = 0;

				// maintenance
				var maintenanceLength = 0;
				var maintenanceRowComplete = 0;

				// SANITATION
				// latrines
				var latrinesLength = 0;
				var latrinesRowComplete = 0;

				// keys to validate correct form
				var keys = ngmClusterHelperNgWashLists.keys;

				// each location
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( b, j ){

						// boreholes 
						if ( b.boreholes && b.boreholes.length ) {
							boreholeLength += b.boreholes.length;
							angular.forEach( b.boreholes, function( borehole, k ){
								var result = ngmClusterHelperNgWashValidation.validateBorehole( borehole, i, j, k );
								angular.merge( elements, result.divs );
								boreholeRowComplete += result.count;
							});
						}

						// water form validations
						if ( b.water && b.water.length ) {
							angular.forEach( b.water, function( w, k ){
								if ( keys[ b.activity_detail_id ].template === 'reticulation.html' ) {
									reticulationLength ++;
									var result = ngmClusterHelperNgWashValidation.validateReticulation( w, i, j, k );
									angular.merge( elements, result.divs );
									reticulationRowComplete +=  result.count;
								}
								if ( keys[ b.activity_detail_id ].template === 'service.html' ) {
									serviceLength ++;
									var result = ngmClusterHelperNgWashValidation.validateService( b, w, i, j, k );
									angular.merge( elements, result.divs );
									serviceRowComplete +=  result.count;
								}
								if ( keys[ b.activity_detail_id ].template === 'maintenance.html' ) {
									maintenanceLength ++;
									var result = ngmClusterHelperNgWashValidation.validateMaintenance( b, w, i, j, k );
									angular.merge( elements, result.divs );
									maintenanceRowComplete +=  result.count;
								}
								if ( keys[ b.activity_detail_id ].template === 'latrines.html' ) {
									latrinesLength ++;
									var result = ngmClusterHelperNgWashValidation.validateLatrines( b, w, i, j, k );
									angular.merge( elements, result.divs );
									latrinesRowComplete +=  result.count;
								}
							});
						}

					});
				});

				// valid
				if ( boreholeLength !== boreholeRowComplete ||
							reticulationLength !== reticulationRowComplete ||
							serviceLength !== serviceRowComplete ||
							maintenanceLength !== maintenanceRowComplete ||
							latrinesLength !== latrinesRowComplete ) {
					Materialize.toast( 'Form contains errors!' , 6000, 'error' );
					$( elements[0] ).animatescroll();
					return false;
				} else {
					return true;
				}
				
			}

		}

		// return 
		return ngmClusterHelperNgWash;

	}]);
