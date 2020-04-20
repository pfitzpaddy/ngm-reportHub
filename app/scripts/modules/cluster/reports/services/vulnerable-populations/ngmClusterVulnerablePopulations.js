/**
 * @name ngmReportHub.factory:ngmClusterVulnerablePopulations
 * @description
 * # ngmClusterVulnerablePopulations
 * Manages beneficiary detail options
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterVulnerablePopulations', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists ) {


		// beneficairy vulnerable populations
		var ngmClusterVulnerablePopulations = {

			// disabled add button
			addDetailDisabled: false,

			// init
			init: function( list, locations, beneficiary, timer ){
				if ( !beneficiary.vulnerable_populations ){
					beneficiary.vulnerable_populations = [{ vuln_pop_quantity:0 }];
				}
				ngmClusterVulnerablePopulations.setForm( list, locations, timer )
			},

			// set input style 
			inputChange: function( label ){
				$("label[for='" + label + "']").removeClass('error').addClass('active');
			},

			// update material_select
			updateSelect: function(){
				$timeout(function() { 
					// $( 'select' ).material_select();
					$('select').formSelect();
				}, 10 );
			},

			updateSelectById: function (id) {
				$timeout(function () { 
					$('#' + id + ' select').material_select(); 
					$('#' + id + ' select').formSelect();
				}, 10);
			},

			// update display name in object on select change
			selectChange: function( d, search_list, key, name, label, input_label ){

				// set to default
				ngmClusterVulnerablePopulations.addDetailDisabled = true;

				// if id exists
				if ( d[ key ] ) {
					$timeout(function() {
						var id = d[ key ];
						var obj = {}
						// this approach does NOT break gulp!
						obj[key] = id;
						var filter = $filter('filter')( search_list, obj, true );
						// set name
						d[ name ] = filter[0][ name ];
						d[ label ] = filter[0][ label ];
						// button enable
						if ( d[ name ] ) {
							ngmClusterVulnerablePopulations.addDetailDisabled = false;
						}
						// update form
						ngmClusterVulnerablePopulations.inputChange( input_label );
						// ngmClusterVulnerablePopulations.updateSelectById( input_label );
					}, 100 );
				}
			},

			// set form on load
			setForm: function( list, locations, timer ) {
				// small delay to spare the UI
				$timeout(function() {
					// for each location
					angular.forEach( locations, function( l, $locationIndex ){
						// for each location
						angular.forEach( l.beneficiaries, function( b, $beneficiaryIndex ){
							if ( b.vulnerable_populations ) {
								// set vulnerable populations form
								angular.forEach( b.vulnerable_populations, function ( d, i ) {
									ngmClusterVulnerablePopulations.setList( list, $locationIndex, $beneficiaryIndex, i, d.vuln_pop_id, b.vulnerable_populations );
								});
							}
						});
					});
				}, timer );
			},

			// add vulnerable populations
			initVulnerablePopulations: function( list, $locationIndex, $beneficiaryIndex, beneficiary ) {

				// add empty 
				if ( !beneficiary.vulnerable_populations ) {
					beneficiary.vulnerable_populations = [];
					beneficiary.vulnerable_populations.push({ vuln_pop_quantity:0 });	
				}
				
				// reset list
				if ( beneficiary.vulnerable_populations ) {
					// set vulnerable populations form
					angular.forEach( beneficiary.vulnerable_populations, function ( d, i ) {
						ngmClusterVulnerablePopulations.setList( list, $locationIndex, $beneficiaryIndex, i, d.vuln_pop_id, beneficiary.vulnerable_populations );
					});
				}
			},
			
			// manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
			setList: function( list, $locationIndex, $beneficiaryIndex, $index, vuln_pop_id, d_list ) {
				
				// list
				var list;

				// each beneficiary
				if ( !ngmClusterLists.vulnerable_populations ) {
					ngmClusterLists.vulnerable_populations = [];
				}
				if ( !ngmClusterLists.vulnerable_populations[ $locationIndex ] ) {
					ngmClusterLists.vulnerable_populations[ $locationIndex ] = [];
				}
				if ( !ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ] ) {
					ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ] = [];
				}
				if ( !ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
					ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ][ $index ] = [];
				}
				
				// set list at index
				ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );

				// remove current row from list filter
				d_list = $filter( 'filter' )( d_list, { vuln_pop_id: '!' + vuln_pop_id } );
				
				// filter partial_kits
				angular.forEach( d_list, function ( detail ) {
					if ( detail.vuln_pop_id ) {
						ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ][ $index ] = 
							$filter( 'filter' )( ngmClusterLists.vulnerable_populations[ $locationIndex ][ $beneficiaryIndex ][ $index ], { vuln_pop_id: '!' + detail.vuln_pop_id } );
					}
				});

				// update select by id
				// ngmClusterVulnerablePopulations.updateSelect();

			},

			// add vulnerable populations
			addDetail: function( list, $locationIndex, $beneficiaryIndex, beneficiary ) {
				// add empty 
				if ( !beneficiary.vulnerable_populations ) {
					beneficiary.vulnerable_populations = [];	
				}
				beneficiary.vulnerable_populations.push({ vuln_pop_quantity:0 });
				// reset list
				angular.forEach( beneficiary.vulnerable_populations, function ( d, i ) {
					ngmClusterVulnerablePopulations.setList( list, $locationIndex, $beneficiaryIndex, i, d.vuln_pop_id, beneficiary.vulnerable_populations );
				});
				// set to default
				ngmClusterVulnerablePopulations.addDetailDisabled = true;
			},

			removeDetail: function( list, $locationIndex, $beneficiaryIndex, $index, beneficiary ) {
				if ( beneficiary.vulnerable_populations.length >= 1 ) {
					beneficiary.vulnerable_populations.splice( $index, 1 );
					// set vulnerable populations form
					angular.forEach( beneficiary.vulnerable_populations, function ( d, i ) {
						ngmClusterVulnerablePopulations.setList( list, $locationIndex, $beneficiaryIndex, i, d.vuln_pop_id, beneficiary.vulnerable_populations );
					});
					// Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
					M.toast({ html: 'Please save to commit changes!', displayLength: 4000, classes: 'note' });
					// set to default
					ngmClusterVulnerablePopulations.addDetailDisabled = false;
				}
			},

		};

		// return
		return ngmClusterVulnerablePopulations;

	}]);
