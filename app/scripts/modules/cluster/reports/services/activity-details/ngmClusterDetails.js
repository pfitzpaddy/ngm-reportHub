/**
 * @name ngmReportHub.factory:ngmClusterDetails
 * @description
 * # ngmClusterDetails
 * Manages beneficiary detail options
 *
 */
angular.module( 'ngmReportHub' )
	.filter('filterDetails', ['$filter','ngmClusterDetails', function ($filter, ngmClusterDetails) {
		return function (data, indices) {
			var res = '';
			if (data.locations[indices.a]['beneficiaries'][indices.b]['details'] !== undefined){
				data.locations[indices.a]['beneficiaries'][indices.b]['details'].forEach(function(d,i){
					res += d.unit_type_name +': '+d.unit_type_quantity+' | ';
				});
			}
			var details = data.locations[indices.a]['beneficiaries'][indices.b]['details'];
			res = angular.equals(details,[{}] ) || details.length === 0 ? '': res;
			res = res.match(/^undefined/) ? 'Please Click Here' : res;
			return res;
		}
	}])
	.factory('ngmClusterDetails', ['$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', '$rootScope', '$templateCache', '$templateRequest', '$compile', '$timeout',
		function ($http, $filter, $timeout, ngmAuth, ngmClusterLists, $rootScope, $templateCache, $templateRequest, $compile, $timeout ) {

		// beneficairy details
		var ngmClusterDetails = {

			// disabled add button
			addDetailDisabled: false,

			// init
			init: function( list, locations, beneficiary, timer ){
				if ( !beneficiary.details ){
					beneficiary.details = [{ unit_type_quantity:0 }];
				}
				ngmClusterDetails.setForm( list, locations, timer )
			},

			selectedDetails: [],
			openDetails: function (locationIndex, beneficiaryIndex, project) {
				ngmClusterDetails.selectedDetails = ngmClusterDetails.fetchDetails(locationIndex, beneficiaryIndex, project); 
				$rootScope.$broadcast('open_details', { id: `dt-${locationIndex}-${beneficiaryIndex}`, details: ngmClusterDetails.selectedDetails, locationIndex: locationIndex, beneficiaryIndex: beneficiaryIndex });
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
				ngmClusterDetails.addDetailDisabled = true;

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
							ngmClusterDetails.addDetailDisabled = false;
						}
						// update form
						ngmClusterDetails.inputChange( input_label );
						// ngmClusterDetails.updateSelectById( input_label );
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
							if ( b.details ) {
								// set details form
								angular.forEach( b.details, function ( d, i ) {
									ngmClusterDetails.setList( list, $locationIndex, $beneficiaryIndex, i, d.unit_type_id, b.details );
								});
							}
						});
					});
				}, timer );
			},

			// add details
			initDetails: function( list, $locationIndex, $beneficiaryIndex, beneficiary ) {
				// add empty 
				if ( !beneficiary.details ) {
					beneficiary.details = [];
					beneficiary.details.push({ unit_type_quantity:0 });	
				}
				
				// reset list
				if ( beneficiary.details ) {
					// set details form
					angular.forEach( beneficiary.details, function ( d, i ) {
						ngmClusterDetails.setList( list, $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
					});
				}
			},
			

			initDetails2: function (list, $locationIndex, $beneficiaryIndex, beneficiary, report) {
				// add empty 
				if (!beneficiary.details) {
					console.log("here")
					beneficiary.details = [];
					beneficiary.details.push({ unit_type_quantity: 0 });
				}

				// reset list
				if (beneficiary.details) {
					// set details form
					angular.forEach(beneficiary.details, function (d, i) {
						ngmClusterDetails.setList(list, $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details);
					});
				}
			},

			
			fetchDetails: function($locationIndex,$beneficiaryIndex, project){
				// console.log(ngmClusterDetails.currentReport.locations);
				return project.report.locations[$locationIndex]['beneficiaries'][$beneficiaryIndex]['details'];
			},
			
			// manages selections (removes selections from detials list for ET ESNFI partial_kits, kit_details)
			setList: function( list, $locationIndex, $beneficiaryIndex, $index, unit_type_id, d_list ) {
				
				// list
				var list;

				// each beneficiary
				if ( !ngmClusterLists.details ) {
					ngmClusterLists.details = [];
				}
				if ( !ngmClusterLists.details[ $locationIndex ] ) {
					ngmClusterLists.details[ $locationIndex ] = [];
				}
				if ( !ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ] ) {
					ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ] = [];
				}
				if ( !ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
					ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = [];
				}
				
				// set list at index
				ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = angular.copy( list );

				// remove current row from list filter
				d_list = $filter( 'filter' )( d_list, { unit_type_id: '!' + unit_type_id } );
				
				// filter partial_kits
				angular.forEach( d_list, function ( detail ) {
					if ( detail.unit_type_id ) {
						ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ] = 
							$filter( 'filter' )( ngmClusterLists.details[ $locationIndex ][ $beneficiaryIndex ][ $index ], { unit_type_id: '!' + detail.unit_type_id } );
					}
				});

				// update select by id
				// ngmClusterDetails.updateSelect();

			},

			// add details
			addDetail: function( list, $locationIndex, $beneficiaryIndex, beneficiary ) {
				// add empty 
				if ( !beneficiary.details ) {
					beneficiary.details = [];	
				}
				beneficiary.details.push({ unit_type_quantity:0 });
				// reset list
				angular.forEach( beneficiary.details, function ( d, i ) {
					ngmClusterDetails.setList( list, $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
				});
				$rootScope.$broadcast('add_detail', [list, $locationIndex, $beneficiaryIndex, beneficiary.details]);
				// set to default
				ngmClusterDetails.addDetailDisabled = true;
			},

			removeDetail: function( list, $locationIndex, $beneficiaryIndex, $index, beneficiary ) {
				
				if ( beneficiary.details.length >= 1 ) {
					beneficiary.details.splice( $index, 1 );
					// ngmClusterDetails.currentReport.locations[$locationIndex]['beneficiaries'][$beneficiaryIndex]['details'].splice($index, 1 );
					// set details form
					angular.forEach( beneficiary.details, function ( d, i ) {
						ngmClusterDetails.setList( list, $locationIndex, $beneficiaryIndex, i, d.unit_type_id, beneficiary.details );
					});
					// Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
					M.toast({ html: 'Please save to commit changes!', displayLength: 4000, classes: 'note' });
					// set to default
					ngmClusterDetails.addDetailDisabled = false;
				}else{
					var container = angular.element(document.querySelector(`#ngm-details-loader-${ $locationIndex }-${ $beneficiaryIndex }`))
					container.html('');
				}
				console.log(beneficiary.details)
			},

		};

		// return
		return ngmClusterDetails;

	}]);
