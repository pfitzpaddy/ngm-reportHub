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
			boreholeUrl: 'beneficiaries/NG/wash/borehole.html',
			reticulationUrl: 'beneficiaries/NG/wash/reticulation.html',

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

			// show 2 rows with template
			getTemplate: function( beneficiary ){
				
				var template = false;

				// borehole
				if ( beneficiary.activity_detail_id === 'borehole_upgrade' ||
              beneficiary.activity_detail_id === 'borehole_construction' ||
              beneficiary.activity_detail_id === 'borehole_rehabilitation' ) {
					template = ngmClusterHelperNgWash.boreholeUrl;
				}

				// reticulation
				if ( beneficiary.activity_detail_id === 'reticulation_construction' ||
              beneficiary.activity_detail_id === 'reticulation_rehabilitation' ) {
					template = ngmClusterHelperNgWash.reticulationUrl;
				}

				// url
				return template;
			},

			// update display name in object on borehole change
			selectChange: function( b, list, key, name, label ){
				if ( b[ key ] ) {
					var id = b[ key ];
					var search_list = ngmClusterHelperNgWashLists.lists[ list ];
					var filter = $filter('filter')( search_list, { [key]: id }, true );
					b[ name ] = filter[0][ name ];
					$("label[for='" + label + "']").css({ 'color': '#26a69a', 'font-weight': 300 });
				}
			},

			// add borehole
			addBorehole: function( location, beneficiary ){
					
				// default
				var borehole = {
					borehole_yield_ltrs_second: 0,
					borehole_pumping_ave_daily_hours: 0,
					borehole_tanks_storage_ltrs: 0,
					taps_number_connected: 0,
					borehole_taps_ave_flow_rate_ltrs_minute: 0,
					borehole_lng: location.site_lng,
					borehole_lat: location.site_lat,
          activity_start_date: moment( new Date() ).startOf( 'M' ).format('YYYY-MM-DD'),
          activity_end_date: moment( new Date() ).endOf( 'M' ).format('YYYY-MM-DD')
				}

				// existing
				var length = beneficiary.boreholes && beneficiary.boreholes.length;

				// set boreholes
				if ( !length ){
					beneficiary.boreholes = [];
				} else {
          var b = angular.copy( beneficiary.boreholes[ length - 1 ] );
          delete b.id;
          borehole = angular.merge( {}, borehole, b );
        }

        // push
				beneficiary.boreholes.push( borehole );

				// init select
				setTimeout(function(){ $( '.input-field select' ).material_select(); }, 200 );

			},

			// add borehole
			addReticulation: function( location, beneficiary ){
					
				// default
				var reticulation = {
					taps_number_connected: 0,
          activity_start_date: moment( new Date() ).startOf( 'M' ).format('YYYY-MM-DD'),
          activity_end_date: moment( new Date() ).endOf( 'M' ).format('YYYY-MM-DD')
				}

				// existing
				var length = beneficiary.reticulations && beneficiary.reticulations.length;

				// set boreholes
				if ( !length ){
					beneficiary.reticulations = [];
				} else {
          var b = angular.copy( beneficiary.reticulations[ length - 1 ] );
          delete b.id;
          reticulation = angular.merge( {}, reticulation, b );
        }

        // push
				beneficiary.reticulations.push( reticulation );

				// init select
				setTimeout(function(){ $( '.input-field select' ).material_select(); }, 200 );

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
				
				// count
				var boreholeLength = 0;
				var boreholeRowComplete = 0;

				// each borehole
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( b, j ){
						if ( b.boreholes && b.boreholes.length ) {
							boreholeLength += b.boreholes.length;
							console.log( b.boreholes )
							angular.forEach( b.boreholes, function( borehole, k ){
								boreholeRowComplete += ngmClusterHelperNgWashValidation.validateBorehole( borehole, i, j, k );
							});
						}
					});
				});

				// valid
				if ( boreholeLength === boreholeRowComplete ) {
					return true;
				} else {
					Materialize.toast( 'Boreholes form contains errors!' , 6000, 'error' );
					return false;
				}
				
			}

		}

		// return 
		return ngmClusterHelperNgWash;

	}]);
