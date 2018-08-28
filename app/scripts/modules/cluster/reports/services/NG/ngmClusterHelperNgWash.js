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
				'ngmClusterHelperNgWashKeys',
				'ngmClusterHelperNgWashLists',
				'ngmClusterHelperNgWashValidation',
				function( $http, $filter, $timeout, ngmAuth, ngmClusterHelperNgWashKeys, ngmClusterHelperNgWashLists, ngmClusterHelperNgWashValidation ) {

		// definition
		var ngmClusterHelperNgWash = {
					
			// NG and WASH
			templateUrl: 'beneficiaries/NG/wash/',

			// beneficiaries calculations
			ratios: {

				// defaults
				households: 0.1666666666667, // 1/6
				boys: 0.2538,
				girls: 0.2862,
				men: 0.1833,
				women: 0.2067,
				elderly_men: 0.0329,
				elderly_women: 0.0371,

				// beneficiary ratios
				water:{
					beneficiaries: 66.6667
				},
				taps:{
					beneficiaries: 250
				},
				tablets:{
					beneficiaries: 1.33333333
				}
			},

			
			// TEMPLATES

			// show template
			getTemplate: function( beneficiary ){
				if ( beneficiary && beneficiary.activity_detail_id && beneficiary.activity_detail_name ) {
					return ngmClusterHelperNgWashKeys.keys[ beneficiary.activity_detail_id ].template
				} else {
					return false;
				}
			},


			// UI UPDATES

			// reset form
			init_material_select:function(){
				setTimeout(function(){ 
					$( '.input-field input' ).removeClass( 'invalid' );
					$( '.input-field input' ).removeClass( 'ng-touched' );
					$( '.input-field select' ).material_select(); 
				}, 10 );
			},

			// set input style 
			inputChange: function( label ){
				$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
			},

			// update display name in object on select change
			selectChange: function( d, list, key, name, label ){
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

			// add beneficiary
			addBeneficiary: function ( beneficiaries ) {

				// clone
				var length = beneficiaries.length;

				// inserted
				var inserted = {};
				var sadd = {
					cash_amount: 0,
					households: 0,
					boys: 0,
					girls: 0,
					men: 0,
					women: 0,
					elderly_men: 0,
					elderly_women: 0,
					total_beneficiaries: 0
				};

				// merge
				angular.merge( inserted, sadd );

				// if previous beneficiaries
				if ( length ) {
										
					var b = angular.copy( beneficiaries[ length - 1 ] );
					var keys = ngmClusterHelperNgWashKeys.keys[ b.activity_detail_id ];
					var defaults = ngmClusterHelperNgWashKeys.keys.defaults;

					// associations
					delete b.id;
					inserted = angular.merge( inserted, b, sadd );
					angular.forEach( inserted, function( d, i ){
						if ( Array.isArray( d ) ) {
							// associations
							if ( i === 'water' || 
										i === 'boreholes' ||
										i === 'sanitation' ||
										i === 'hygiene' ||
										i === 'cash' ||
										i === 'accountability') {
								angular.forEach( d, function( e, j ){
									delete e.id;
									delete e.createdAt;
									delete e.updatedAt;
									// to copy
									// e = angular.merge( {}, keys.measurement, defaults );
									angular.merge( e, keys.measurement, defaults );
								});
							}
						}
					});
				}

				// refresh UI
				ngmClusterHelperNgWash.init_material_select();

				// return
				return inserted;

			},

			// add initial object
			detailsChange: function( locations, $location, $beneficiary ){

				// slight timeout to capture UI changes
				$timeout(function(){
					
					// beneficiary
					if ( $beneficiary.activity_detail_id ) {

						// ngmClusterHelperNgWash keys 
						var keys = ngmClusterHelperNgWashKeys.keys[ $beneficiary.activity_detail_id ];
						var defaults = ngmClusterHelperNgWashKeys.keys.defaults;

						// remove all previous entries
						$beneficiary.water = [];
						$beneficiary.boreholes = [];
						$beneficiary.sanitation = [];
						$beneficiary.hygiene = [];
						$beneficiary.cash = [];
						$beneficiary.accountability = [];

						// add new
						ngmClusterHelperNgWash.addActivity( locations, $location, $beneficiary, keys.association );

					}
				}, 10 );
			},


			// ADD RECORDS

			// add activity ( reticulation, service, maintenance )
			addActivity: function( locations, location, beneficiary, association, btn_id ) {

				// based on association and activity_detail
				var length = beneficiary[ association ] ? beneficiary[ association ].length : 0;
				var keys = ngmClusterHelperNgWashKeys.keys[ beneficiary.activity_detail_id ];
				var defaults = ngmClusterHelperNgWashKeys.keys.defaults;
				
				// create model using ngmClusterHelperNgWash keys ( based on activity_detail )
				var activity = angular.merge( {}, keys.measurement, defaults );

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
					delete a.createdAt;
					delete a.updatedAt;
					activity = angular.merge( {}, a, activity );
				}

				// push
				beneficiary[ association ].push( activity );
				ngmClusterHelperNgWash.totalActivityBeneficiaries( locations );

				// ensures page does not scroll to 5W activity input form
				if ( btn_id ) { 
					$( '#' + btn_id ).animatescroll();
				}

				// init
				ngmClusterHelperNgWash.init_material_select();

			},

			// add new details
			addDetails: function( d, obj ){
				d.details.push( obj );
				setTimeout(function(){ $( '.input-field select' ).material_select(); }, 100 );
			},


			// REMOVE RECORDS

			// remove beneficiary nodal
			removeModal: function( project, beneficiary, $index, association, modal ) {
				ngmClusterHelperNgWash.project = project;
				ngmClusterHelperNgWash.beneficiary = beneficiary;
				ngmClusterHelperNgWash.removeIndex = $index;
				ngmClusterHelperNgWash.association = association;
				$( modal ).openModal({ dismissible: false });
			},

			// remove borehole
			remove: function(){
				
				// get id
				var id = ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.association ][ ngmClusterHelperNgWash.removeIndex ].id;
				ngmClusterHelperNgWash.beneficiary[ ngmClusterHelperNgWash.association ].splice( ngmClusterHelperNgWash.removeIndex, 1 );

				// calculate location totals
				ngmClusterHelperNgWash.totalActivityBeneficiaries( ngmClusterHelperNgWash.project.report.locations );

				// update db if id exists (stored in db)
				if ( id ) {
					ngmClusterHelperNgWash.project.save( false, false );
				}			
			},


			// CALCULATIONS

			// get sadd breakdowns
			bSadd: function( b ){
				var ratios = ngmClusterHelperNgWash.ratios;
				// sadd
				b.households = Math.round( b.total_beneficiaries * ratios.households );
				b.boys = Math.round( b.total_beneficiaries * ratios.boys );
				b.girls = Math.round( b.total_beneficiaries * ratios.girls );
				b.men = Math.round( b.total_beneficiaries * ratios.men );
				b.women = Math.round( b.total_beneficiaries * ratios.women );
				b.elderly_men = Math.round( b.total_beneficiaries * ratios.elderly_men );
				b.elderly_women = Math.round( b.total_beneficiaries * ratios.elderly_women );
				b.total_beneficiaries = Math.round( b.total_beneficiaries );
			},

			// borehole
			// m3 = yield*hrs*3600secs
			boreholeOutput: function( locations, b ){
				if ( b.borehole_yield_ltrs_second >=0 && 
							b.borehole_pumping_ave_daily_hours >=0 ) {
					// metrics
					b.borehole_m3 = b.borehole_yield_ltrs_second * b.borehole_pumping_ave_daily_hours * 3600;
					b.total_beneficiaries = b.borehole_m3 * ngmClusterHelperNgWash.ratios.water.beneficiaries;
					// sadd
					ngmClusterHelperNgWash.bSadd( b );
					// calculate location totals
					ngmClusterHelperNgWash.totalActivityBeneficiaries( locations );
				}
			},

			// taps * 250
			indicatorOutput: function( locations, b, key ){
				if ( b.quantity >=0 ) {
					// metrics
					b.total_beneficiaries = b.quantity * ngmClusterHelperNgWash.ratios[ key ].beneficiaries;
					// sadd
					ngmClusterHelperNgWash.bSadd( b );
					// calculate location totals
					ngmClusterHelperNgWash.totalActivityBeneficiaries( locations ); 
				}
			},

			// activity calculations by [ key ]
			indicatorSum: function( beneficiary, association, indicators ) {
				angular.forEach( indicators, function( d, i ){
					beneficiary[ d ] = 0;
				});
				// sum each [ key ] per association
				angular.forEach( beneficiary[ association ], function( a, i ){
					angular.forEach( indicators, function( d, j ){
						beneficiary[ d ] += a[ d ];
					});
				});
			},


			// TOTAL BENEFICIARIES

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
						b.total_beneficiaries = 0;
						// each association
						angular.forEach( b, function( d, k ){
							if ( Array.isArray( d ) ) {
								// associations
								if ( k === 'water' || 
											k === 'boreholes' ||
											k === 'sanitation' ||
											k === 'hygiene' ||
											k === 'cash' ||
											k === 'accountability') {
									angular.forEach( d, function( activity, l ){
										b.households += activity.households;
										b.boys += activity.boys;
										b.girls += activity.girls;
										b.men += activity.men;
										b.women += activity.women;
										b.elderly_men += activity.elderly_men;
										b.elderly_women += activity.elderly_women;
										b.total_beneficiaries += activity.total_beneficiaries;
									});
								}
							}
						});
					});
				});
			}

		}

		// return 
		return ngmClusterHelperNgWash;

	}]);
