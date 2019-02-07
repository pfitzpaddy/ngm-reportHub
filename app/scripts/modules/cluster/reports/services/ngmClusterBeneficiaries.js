/**
 * @name ngmReportHub.factory:ngmClusterHelper
 * @description
 * # ngmClusterHelper
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterBeneficiaries', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterHelperNgWash',
              function( $http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterHelperNgWash ) {

    // beneficairies
		var ngmClusterBeneficiaries = {

      // default columns
      form: {
        defaults: {
          columns: {
            detail: false,
            indicator: false,
            category_type_id: false,
            delivery_type_id: false,
            mpc_delivery_type_id: false,
            mpc_mechanism_type_id: false,
            package_type_id: false,
            units: false,
            unit_type_id: false,
            transfer_type_id: false,
            households: false,
            families: false,
            boys: true,
            girls: true,
            men: true,
            women: true,
            elderly_men: false,
            elderly_women: false
          },
          rows:[{
            detail: false,
            indicator: false,
            boys: true,
            girls: true,
            men: true,
            women: true
          }]
        },
        active:[{}]
      },        

      // datepicker (NG)
      datepicker: {
        startOnClose: function( beneficiary, value ) {
          if (!value) { value =  moment( new Date() ).startOf( 'M' ); }
          beneficiary.activity_start_date = moment.utc( value ).format( 'YYYY-MM-DD' );
        },
        endOnClose: function( beneficiary, value ) {
          if (!value) { value =  moment( new Date() ).endOf( 'M' ); }
          beneficiary.activity_end_date = moment.utc( value ).format( 'YYYY-MM-DD' );
        },
        distributionStartOnClose: function( location, $beneficiaryIndex, $index, value ) {
          location.beneficiaries[ $beneficiaryIndex ].distribution_start_date = moment.utc( value ).format( 'YYYY-MM-DD' );
        },
        distributionEndOnClose: function( location, $beneficiaryIndex, $index, value ) {
          location.beneficiaries[ $beneficiaryIndex ].distribution_end_date = moment.utc( value ).format( 'YYYY-MM-DD' );
          location.beneficiaries[ $beneficiaryIndex ].distribution_status = 'complete';
        },        
      },

      // update display name in object on select change
      selectChange: function( project, d, list, key, name, label ){
        if ( d[ key ] ) {
          var id = d[ key ];
          var obj = {}
          var search_list = project.lists[ list ];
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
      addBeneficiary: function ( beneficiaries, defaults ) {

        // inserted
        var inserted = {};
        var sadd = {
          units: 0,
          sessions: 0,
          cash_amount: 0,
          households: 0,
          families: 0,
          boys: 0,
          girls: 0,
          men:0,
          women:0,
          elderly_men:0,
          elderly_women:0,
					total_beneficiaries:0,
					// hh_assements:0,
					// hh_assements_poor_before:0,
					// hh_assements_poor_after:0,
					// hh_assements_percentage:0,
					// hh_surveyed:0,
					// hh_acceptable:0,
					// hh_acceptable_pmd:0,
					// hh_borderline:0,
					// hh_borderline_pmd:0,
					// hh_poor:0,
					// hh_poor_pmd:0
        };

        // merge
        angular.merge( inserted, sadd, defaults );

        // clone
        var length = beneficiaries.length;
        if ( length ) {
          var b = angular.copy( beneficiaries[ length - 1 ] );
          delete b.id;
					delete b.injury_treatment_same_province;
          inserted = angular.merge( inserted, b, sadd, defaults );
          inserted.transfer_type_id = 0;
					inserted.transfer_type_value = 0;
					if (inserted.mpc_delivery_type_id || inserted.mpc_mechanism_type_id || inserted.package_type_id || inserted.unit_type_id){
						inserted.mpc_delivery_type_id= null;
						inserted.mpc_delivery_type_name= null;
						inserted.mpc_mechanism_type_id = null;
						inserted.mpc_mechanism_type_name= null ;
						inserted.package_type_id=null;
						inserted.package_type_name= null;
						inserted.unit_type_id=null;
						inserted.unit_type_name=null;
					}
        }

				// return new beneficiary
        return inserted;
			},


      /* ESNFI KITS */

      // show distribution date
      showDistributionDate: function( beneficiary ){
        var display = beneficiary.cluster_id === 'esnfi' && 
                        ( beneficiary.activity_type_id === 'hardware_materials_distribution' || 
                            beneficiary.activity_type_id ==='cash_vouchers' );

        // set values
        if ( display && !beneficiary.distribution_start_date ) {
          beneficiary.distribution_start_date = moment.utc( new Date() ).format( 'YYYY-MM-DD' );
          beneficiary.distribution_status = 'ongoing';
        }

        return display;
      },


      // show add kit detials
      showPartialKits: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ){
        var display = beneficiary.cluster_id === 'esnfi' && 
                        beneficiary.activity_description_id === 'partial_kits';

        // defaults to 1 entry
        if ( display && !beneficiary.partial_kits ) {
          beneficiary.partial_kits = [{}];
        }

        // set kits
        ngmClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'partial_kits', ngmClusterLists.getPartialKits() );

        return display;
      },

      // show add kit detials
      showKitDetails: function( $locationIndex, $beneficiaryIndex, $index, beneficiary ){
        var display = beneficiary.cluster_id === 'esnfi' &&
                        beneficiary.activity_description_id === 'loose_items';

        // defaults to 1 entry
        if ( display && !beneficiary.kit_details ) {
          beneficiary.kit_details = [{}];
        }

        // set kits
        ngmClusterBeneficiaries.setKits( $locationIndex, $beneficiaryIndex, $index, 'kit_details', ngmClusterLists.getKitDetails() );

        return display;
      },

      // kits
      setKits( $locationIndex, $beneficiaryIndex, $index, key, list ) {
        // first list
        if ( !ngmClusterLists[ key ][ $locationIndex ] ) {
          ngmClusterLists[ key ][ $locationIndex ] = [];
        }
        if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] ) {
          ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ] = [];
        }
        if ( !ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] ){
          ngmClusterLists[ key ][ $locationIndex ][ $beneficiaryIndex ][ $index ] = list;
        }
      },

      // ethiopia esnfi onchange
      descriptionChange: function( $locationIndex, $beneficiaryIndex, lists, $beneficiary ) {

        var kits;
        if ( $beneficiary && $beneficiary.activity_type_id ) {

          if ( $beneficiary.activity_type_id === 'hardware_materials_distribution' ) {

            // set
            $timeout(function() {

              if ( $beneficiary.activity_description_id !== 'partial_kits' ) {
                kits = 'kit_details';
              } else {
                kits = 'partial_kits';
              }

              $beneficiary[ kits ] = [{}];
              $beneficiary = ngmClusterBeneficiaries.setKitDetails( lists.activity_descriptions, $beneficiary );
              angular.forEach( $beneficiary[ kits ] , function ( d, i ) {
                ngmClusterLists.setDetailList( kits, $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
              });

            }, 100 );

          }
        }
      },

      // set kit details
      setKitDetails: function( list, $beneficiary ){
        var kit = $filter('filter')( list, { activity_description_id: $beneficiary.activity_description_id }, true );
        if ( kit[0].kit_details.length ) {
          $beneficiary.kit_details = kit[0].kit_details;
        }
        return $beneficiary;
      },

      // add kit-detail
      addPartialKits: function ( $locationIndex, $beneficiaryIndex, $beneficiary ) {
        delete $beneficiary.kit_details;
        $beneficiary.partial_kits.push({});
        // reset list
        angular.forEach( $beneficiary.partial_kits, function ( d, i ) {
          ngmClusterLists.setDetailList( 'partial_kits', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.partial_kits );
        });
        if ( $beneficiary.partial_kits.length < 1 ) {
          Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 6000, 'note' );
        }
      },

      // remove kit-details
      removePartialKit: function( project, $beneficiary, $locationIndex, $beneficiaryIndex, $index ) {
        if ( $beneficiary.partial_kits.length >= 2 ) {
          $beneficiary.partial_kits.splice( $index, 1);
          // reset list
          angular.forEach( $beneficiary.partial_kits, function ( d, i ) {
            ngmClusterLists.setDetailList( 'partial_kits', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.partial_kits );
          });
          Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
        } else {
          Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
        }
      },
      
      // add kit-detail
      addKitDetail: function ( $locationIndex, $beneficiaryIndex, $beneficiary ) {
        delete $beneficiary.partial_kits;
        $beneficiary.kit_details.push({});
        // reset list
        angular.forEach( $beneficiary.kit_details, function ( d, i ) {
          ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
        });
        if ( $beneficiary.kit_details.length < 1 ) {
          Materialize.toast( 'Note: Please add at least 1 kit item to submit!' , 6000, 'note' );
        }
      },

      // remove kit-details
      removeKitDetail: function( project, $beneficiary, $locationIndex, $beneficiaryIndex, $index ) {
        if ( $beneficiary.kit_details.length >= 2 ) {
          $beneficiary.kit_details.splice( $index, 1);
          // reset list
          angular.forEach( $beneficiary.kit_details, function ( d, i ) {
            ngmClusterLists.setDetailList( 'kit_details', $locationIndex, $beneficiaryIndex, i, d.detail_type_id, $beneficiary.kit_details );
          });
          Materialize.toast( 'Please save to commit changes!' , 4000, 'note' );
        } else {
          Materialize.toast( 'Minimum of 1 Kit Items required!' , 4000, 'note' );
        }
      },

      // remove target_beneficiary from db
      removeTargetBeneficiary: function( id ) {
        $http({
          method: 'POST',
          url: ngmAuth.LOCATION + '/api/cluster/project/removeBeneficiary',
          data: { id: id }
        }).success( function( result ) {
          Materialize.toast( 'People in Need Removed!' , 4000, 'success' );
        }).error( function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });
      },

      // remove beneficiary
      removeBeneficiary: function( project, id ) {
        // update
        $http({
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/report/removeBeneficiary',
            data: { id: id }
        }).success( function( result ){
          if ( result.err ) { Materialize.toast( 'Error! Please correct the ROW and try again', 6000, 'error' ); }
          if ( !result.err ) { project.save( false, false ); }
        }).error(function( err ) {
          Materialize.toast( 'Error!', 6000, 'error' );
        });
      },


      /* BENEFICIARIES FORM */ 

      // show activity (generic)
      displayActivity: function( project, $data, $beneficiary ){
        var selected = [];
        $beneficiary.activity_type_id = $data;
        if( $beneficiary.activity_type_id && project.activity_type.length ) {
          selected = $filter('filter')( project.activity_type, { activity_type_id: $beneficiary.activity_type_id }, true);
          if ( selected.length ) {
            // set activity_type_name
            $beneficiary.cluster_id = selected[0].cluster_id;
            $beneficiary.cluster = selected[0].cluster;
            $beneficiary.activity_type_name = selected[0].activity_type_name;
          }
        }
        return selected.length ? selected[0].activity_type_name : '-';
      },

      // show descipriton (generic)
      displayDescription: function( lists, $data, $beneficiary, row ){
        var selected = [];
        $beneficiary.activity_description_id = $data;
        if( $beneficiary.activity_description_id ) {
          selected = $filter('filter')( lists.activity_descriptions, { 
                                            cluster_id: $beneficiary.cluster_id,
                                            activity_description_id: $beneficiary.activity_description_id }, true );
          if ( selected.length ) {
            
            // set activity_description_name
            $beneficiary.activity_description_name = selected[0].activity_description_name;

            // add indicator ( if exists and no dropdown )
            if ( row && !row.indicator && row.indicator_id ) {
              $beneficiary.indicator_id = selected[0].indicator_id;
              $beneficiary.indicator_name = selected[0].indicator_name;
            }

          }
        }
        return selected.length ? selected[0].activity_description_name : '-';
      },

      // display category
      displayDetails: function( lists, $data, $beneficiary, row ) {
        var selected = [];
        $beneficiary.activity_detail_id = $data;
        if( $beneficiary.activity_detail_id ) {
          selected = $filter('filter')( lists.activity_details, { 
                                            cluster_id: $beneficiary.cluster_id, 
                                            activity_description_id: $beneficiary.activity_description_id,
                                            activity_detail_id: $beneficiary.activity_detail_id }, true );
          if( selected.length ) {
            
            // set activity_detail_name
            $beneficiary.activity_detail_name = selected[0].activity_detail_name;
            
            // add indicator ( if exists and no dropdown )
            if ( row && !row.indicator && row.indicator_id ) {
              $beneficiary.indicator_id = selected[0].indicator_id;
              $beneficiary.indicator_name = selected[0].indicator_name;
            }

          }
        }
        return selected.length ? selected[0].activity_detail_name : '-';
      },

      // display category
      displayIndicator: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.indicator_id = $data;
        if( $beneficiary.indicator_id ) {
          selected = $filter('filter')( lists.activity_indicators, { indicator_id: $beneficiary.indicator_id }, true);
          if( selected.length ) {
            // $beneficiary.indicator_id = selected[0].indicator_id;
            $beneficiary.indicator_name = selected[0].indicator_name;
          }
        }
        return selected.length ? selected[0].indicator_name : '-';
      },
      
      // cholera response
      displayCholera: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.activity_cholera_response_id = $data;
        if( $beneficiary.activity_cholera_response_id ) {
          selected = $filter('filter')( lists.activity_cholera_response, { activity_cholera_response_id: $beneficiary.activity_cholera_response_id }, true);
          if( selected.length ) {
            $beneficiary.activity_cholera_response_name = selected[0].activity_cholera_response_name;
          }
        }
        return selected.length ? selected[0].activity_cholera_response_name : '-';
      },

      // display beneficiary
      displayBeneficiary: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.beneficiary_type_id = $data;
        if( $beneficiary.beneficiary_type_id ) {
          selected = $filter('filter')( lists.beneficiary_types, { beneficiary_type_id: $beneficiary.beneficiary_type_id, cluster_id: $beneficiary.cluster_id }, true);
        }
        if ( selected.length ) {
          $beneficiary.beneficiary_type_name = selected[0].beneficiary_type_name;
        }
        return selected.length ? selected[0].beneficiary_type_name : '-';
      },

      // display delivery
      displayDelivery: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.delivery_type_id = $data;
        if( $beneficiary.delivery_type_id ) {
          selected = $filter('filter')( lists.delivery_types, { delivery_type_id: $beneficiary.delivery_type_id }, true);
          $beneficiary.delivery_type_name = selected[0].delivery_type_name;
        }
        return selected.length ? selected[0].delivery_type_name : '-';
      },

      // unit types
      displayUnitTypes: function( lists, $data, $beneficiary ){
        var selected = [];
        $beneficiary.unit_type_id = $data;
        if($beneficiary.unit_type_id) {
          selected = $filter('filter')( lists.units, { unit_type_id: $beneficiary.unit_type_id }, true);
          if( selected.length ) {
            $beneficiary.unit_type_name = selected[0].unit_type_name;
          }
        }
        return selected.length ? selected[0].unit_type_name : '-';
      },

      // display delivery ( cash )
      displayCashDelivery: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.mpc_delivery_type_id = $data;
        if( $beneficiary.mpc_delivery_type_id ) {
          // selection
          selected = $filter('filter')( lists.mpc_delivery_types, { mpc_delivery_type_id: $beneficiary.mpc_delivery_type_id }, true );
          if ( selected.length ) {
            $beneficiary.mpc_delivery_type_name = selected[0].mpc_delivery_type_name;
          }
        }
        return selected.length ? selected[0].mpc_delivery_type_name : '-';
      },

      // display mechanism ( cash )
      displayCashMechanism: function ( lists, $data, $beneficiary ){
        var selected = [];
        $beneficiary.mpc_mechanism_type_id = $data;
        if ($beneficiary.mpc_mechanism_type_id) {
          // selection
					selected = $filter('filter')(lists.mpc_mechanism_type, { mpc_mechanism_type_id: $beneficiary.mpc_mechanism_type_id }, true);
          if (selected.length) {
            $beneficiary.mpc_mechanism_type_name = selected[0].mpc_mechanism_type_name;
          }
        }
        return selected.length ? selected[0].mpc_mechanism_type_name : '-';
      },

      // display package
      displayPackageTypes: function( $data, $beneficiary ) {
        var selected = [];
        $beneficiary.package_type_id = $data;
        if( $beneficiary.package_type_id ) {
          // selection
          selected = $filter('filter')( [{
            'package_type_id': 'standard',
            'package_type_name': 'Standard'
          }, {
            'package_type_id': 'non-standard',
            'package_type_name': 'Non-standard'
          }], { package_type_id: $beneficiary.package_type_id }, true );
          if ( selected.length ) {
            $beneficiary.package_type_name = selected[0].package_type_name;
          }
        }
        return selected.length ? selected[0].package_type_name : '-';
      },

      // display category
      displayCategory: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.category_type_id = $data;
        if($beneficiary.category_type_id) {
          selected = $filter('filter')( lists.category_types, { category_type_id: $beneficiary.category_type_id }, true);
          if( selected.length ) {
            $beneficiary.category_type_name = selected[0].category_type_name;
          }
        }
        return selected.length ? selected[0].category_type_name : '-';
      },

      // transfer_type_id
      displayTransferTypes: function( lists, $data, $beneficiary ) {
        var selected = [];
        $beneficiary.transfer_type_id = $data;
        if($beneficiary.transfer_type_id) {
          selected = $filter('filter')( lists.transfers, { transfer_type_id: $beneficiary.transfer_type_id }, true);
          if( selected.length ) {
            $beneficiary.transfer_type_value = selected[0].transfer_type_value;
          }
        }else{
          $beneficiary.transfer_type_id = 0;
          $beneficiary.transfer_type_value = 0;
        }
        return selected.length ? selected[0].transfer_type_value : 0;
			},
			
			//unit_type just for cash afg
			// show unit just for cash
			displayCashUnit: function (beneficiary, admin0pcode) {
				var unitCash = false;
				if (beneficiary.activity_description_id && admin0pcode == 'AF') {
					if (beneficiary.activity_description_id.indexOf('cash') !== -1 || beneficiary.activity_description_id.indexOf('package') !== -1) {
						if (beneficiary.mpc_delivery_type_id) {
							if (beneficiary.mpc_delivery_type_id === 'cash') {
								unitCash = true;
							} else {
								unitCash = false;
							}
						} else {
							unitCash = true;
						}
					}
				}
				return unitCash
			},

			//nullify mpc_delivery_type_id
			nullMpcDelivery: function ($locationIndex, $beneficiary, $index) {

				if (ngmClusterBeneficiaries.form.active[$locationIndex].columns['mpc_delivery_type_id'] !== 0) {
					$beneficiary.mpc_delivery_type_id = null;
					$beneficiary.mpc_delivery_type_name = null;
				}
				return $beneficiary
			},

      
      /* SHOW AND HIDE TARGETS */

      // for each location ( monhtly report )
      setLocationsForm: function( lists, locations ) {

        // set form
        angular.forEach( locations, function( location, location_index ){
          ngmClusterBeneficiaries.setBeneficiariesForm( lists, location_index, location.beneficiaries );
        });
      },

      // show target columns
      setBeneficiariesForm: function ( lists, location_index, beneficiaries ) {

        // set defaults
        ngmClusterBeneficiaries.form.active[ location_index ] = angular.copy( ngmClusterBeneficiaries.form.defaults );

        // check target_beneficiaries
        if ( beneficiaries.length ) {
          angular.forEach( beneficiaries, function( beneficiary, row_index ){
            ngmClusterBeneficiaries.setBeneficiariesFormTargets( lists, location_index, beneficiary, row_index );
          });
        }
      },

      // set columns, rows
      setBeneficiariesFormTargets: function( lists, location_index, beneficiary, row_index ) {

        // set default
        if ( !ngmClusterBeneficiaries.form.active[ location_index ] ) {
          ngmClusterBeneficiaries.form.active[ location_index ] = { 
            columns: angular.copy( ngmClusterBeneficiaries.form.defaults.columns ),
            rows: angular.copy( ngmClusterBeneficiaries.form.defaults.rows )
          };
        }
        
        // let UI catch up
        $timeout(function() {

          // if activity_description_id
          if ( beneficiary && beneficiary.activity_description_id ) {

            // 3 different types of lists
            var search = {
              list_activity_descriptions: $filter('filter')( lists.activity_descriptions, { activity_description_id: beneficiary.activity_description_id }, true ),
              list_activity_details: $filter('filter')( lists.activity_details, { activity_description_id: beneficiary.activity_description_id }, true ),
              list_activity_indicators: $filter('filter')( lists.activity_indicators, { activity_description_id: beneficiary.activity_description_id }, true )
            }

            // default
            angular.forEach( search.list_activity_descriptions, function( row, i ){
              // for each row
              ngmClusterBeneficiaries.setColumnsRows( location_index, row, row_index );
            });

            // by activity_detail_id
            if ( beneficiary.activity_detail_id ) {
              search.list_activity_details = $filter('filter')( search.list_activity_details, { activity_detail_id: beneficiary.activity_detail_id }, true )
              // for each activity details
              angular.forEach( search.list_activity_details, function( row, i ){
                // for each value, column
                ngmClusterBeneficiaries.setColumnsRows( location_index, row, row_index );
              });
            }

            // by indicator_id
            if ( beneficiary.indicator_id ) {
              search.list_activity_indicators = $filter('filter')( search.list_activity_indicators, { indicator_id: beneficiary.indicator_id }, true )
              // // for each indicators
              angular.forEach( search.list_activity_indicators, function( row, i ){
                // for each value, column
                ngmClusterBeneficiaries.setColumnsRows( location_index, row, row_index );
              });
            }

          }
        }, 0 );
      },

      // set columns, rows
      setColumnsRows: function( location_index, row, row_index ) {
        // first row ( reset )
        if ( row_index === 0 ){
          ngmClusterBeneficiaries.form.active[ location_index ].columns = angular.merge( {}, ngmClusterBeneficiaries.form.defaults.columns, row );
        } else {
          // set columns
          angular.forEach( row, function( value, column ){
            if ( value ) {
              ngmClusterBeneficiaries.form.active[ location_index ].columns[ column ] = value;
            }
          });
        } 
        // set row
        ngmClusterBeneficiaries.form.active[ location_index ].rows[ row_index ] = angular.merge( {}, ngmClusterBeneficiaries.form.defaults.rows[ 0 ], row );
      },


      /* VALIDATION */

      // ennsure all locations contain at least one complete beneficiaries
      beneficiaryFormComplete: function( project, locations ) {
        var beneficiaries = 0;
        var rowComplete = 0;
        angular.forEach( locations, function( l ){
          if( l.beneficiaries ) {
            beneficiaries += l.beneficiaries.length;
            if ( l.beneficiaries.length ) {
              angular.forEach( l.beneficiaries, function( b ){
                if ( !ngmClusterBeneficiaries.rowSaveDisabled( project, b ) ) {
                  rowComplete++;
                }
              });
            }
          }
        });
        // return
        if( rowComplete >= beneficiaries ){ return true; } else { return false; }
      },

      // disable save form
      rowSaveDisabled: function( project, $data ){
        var disabled = true;
        switch ( project.admin0pcode ) {

          case 'AF':
            if ( $data.activity_type_id && 
                  $data.activity_description_id &&
                  $data.beneficiary_type_id &&
                  $data.delivery_type_id &&
                  $data.units >= 0 &&
                  $data.sessions >= 0 &&
                  $data.households >= 0 &&
                  $data.families >= 0 &&
                  $data.boys >= 0 &&
                  $data.girls >= 0 &&
                  $data.men >= 0 &&
                  $data.women >= 0 &&
                  $data.elderly_men >= 0 &&
                  $data.elderly_women >= 0 ) {
              disabled = false;
            }
            break;

          case 'ET':
            if ( $data.activity_type_id && 
                  $data.activity_description_id &&
                  $data.beneficiary_type_id &&
                  $data.units >= 0 &&
                  $data.sessions >= 0 &&
                  $data.households >= 0 &&
                  $data.families >= 0 &&
                  $data.boys >= 0 &&
                  $data.girls >= 0 &&
                  $data.men >= 0 &&
                  $data.women >= 0 &&
                  $data.elderly_men >= 0 &&
                  $data.elderly_women >= 0 ) {

              if ( $data.cluster_id === 'esnfi' ) {
                if ( $data.activity_description_id === 'loose_items' ) {
                  if ( $data.partial_kits && $data.partial_kits.length >= 1 && $data.households >= 1 ) {
                    disabled = false;
                  }
                  if ( $data.kit_details && $data.kit_details.length >= 1 && $data.households >= 1 ) {
                    disabled = false;
                  }
                } else if ( $data.households >= 1 ) {
                  disabled = false;
                }
              } else {
                disabled = false;
              }
            }
            break;

          case 'NG':
            if ( $data.activity_type_id && 
                  $data.activity_description_id &&
                  $data.beneficiary_type_id ) {
              disabled = false;
            }
            break;

          default:
            if ( $data.activity_type_id && 
                  $data.activity_description_id &&
                  $data.beneficiary_type_id &&
                  $data.units >= 0 &&
                  $data.sessions >= 0 &&
                  $data.households >= 0 &&
                  $data.families >= 0 &&
                  $data.boys >= 0 &&
                  $data.girls >= 0 &&
                  $data.men >= 0 &&
                  $data.women >= 0 &&
                  $data.elderly_men >= 0 &&
                  $data.elderly_women >= 0 ) {
                disabled = false;
            }
        }
        // return
        return disabled;
			},
			setAssessmentAtribute:function (b) {
				var b_copy =angular.copy(b);
				if(!b_copy.id && !b_copy.hh_surveyed){
					b_copy.hh_surveyed = 0;
					b_copy.hh_acceptable = 0;
					b_copy.hh_acceptable_pmd = 0;
					b_copy.hh_borderline = 0;
					b_copy.hh_borderline = 0;
					b_copy.hh_borderline_pmd = 0;
					b_copy.hh_poor = 0;
					b_copy.hh_poor_pmd = 0;
				}

				return b_copy
			},


      /**** STOCKS? ****/

      // stocks?
      rowSessionsDisabled: function( $beneficiary ){
        var disabled = true;
        if( ( $beneficiary.cluster_id !== 'eiewg' )
              && ( $beneficiary.activity_description_id )
              && ( $beneficiary.activity_description_id.indexOf( 'education' ) !== -1 || $beneficiary.activity_description_id.indexOf( 'training' ) !== -1 ) ) {
          disabled = false
        }
        return disabled;
      }

		};

    // return
    return ngmClusterBeneficiaries;

	}]);
