/**
 * @name ngmReportHub.factory:ngmClusterValidation
 * @description
 * # ngmClusterValidation
 * Manages browser local storage
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterValidation', 
			[ '$http',
				'$filter',
				'$timeout',
				'ngmClusterBeneficiaries',
				'ngmAuth', function( $http, $filter, $timeout, ngmClusterBeneficiaries, ngmAuth ) {

		var ngmClusterValidation = {

			// update material_select
			updateSelect: function(){
				$timeout(function(){ $( 'select' ).material_select(); }, 0 );
			},

			// validate project type
			project_details_valid: function( project ) {

				// valid
				ngmClusterValidation.project_details_valid_labels = [];

				if( !project.project_title ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-name');
				}
				if( !project.project_start_date ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-start-date');
				}
				if( !project.project_end_date ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-end-date');
				}
				if( !project.project_budget_currency ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-budget');
				}
				if( !project.project_description ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-description');
				}

				// if NO labels details valid
				return !ngmClusterValidation.project_details_valid_labels.length;
			},

			// validate if ONE activity type
			activity_type_valid: function( project ) {
				
				// valid
				ngmClusterValidation.activity_type_valid_labels = [];

				// activity types?
				if( typeof project.activity_type_check === 'undefined' ){
					ngmClusterValidation.activity_type_valid_labels.push('ngm-activity_type');
				}

				// if NO labels activities valid
				return !ngmClusterValidation.activity_type_valid_labels.length;
			},

			// validate project donor
			project_donor_valid: function( project ) {

				// valid
				ngmClusterValidation.project_donor_valid_labels = [];

				// donor
				if( !project.project_donor_check ){
					ngmClusterValidation.project_donor_valid_labels.push('ngm-project_donor');
				}

				// if NO labels activities valid
				return !ngmClusterValidation.project_donor_valid_labels.length;
			},

			// validate if ALL target beneficairies valid
			target_beneficiaries_valid: function( project ){
				var rowComplete = 0;
				angular.forEach( project.target_beneficiaries, function( d, i ){
					if ( !ngmClusterBeneficiaries.rowSaveDisabled( project, d ) ){
						rowComplete++;
					}
				});
				if( rowComplete === project.target_beneficiaries.length ){
					return true;
				} else {
					return false;
				}
			},

			// validate id ALL target locations valid
			target_locations_valid: function( project ){
				var rowComplete = 0;
				angular.forEach( project.target_locations, function( d, i ){
					if ( d.admin1pcode && d.admin1name && d.admin2pcode && d.admin2name && d.site_name ){
						rowComplete++;
					}
					// hack for eiewg
					if ( d.admin0pcode === 'AF' && d.cluster_id === 'eiewg' ) { 
						if ( d.site_implementation_id && d.site_implementation_id === 'informal' && !d.site_hub_id ) {
							rowComplete--;
						}
					}
				});
				if( project.target_locations.length && ( rowComplete === project.target_locations.length ) ){
					return true;
				} else {
					return false;
				}
			},

			// validate details
			validateDetails: function( locations ) {
				
				// collect error divs
				var elements = [];

				// WATER
				var detailsLength = 0;
				var detailsRowComplete = 0;

				// each location
				angular.forEach( locations, function( l, i ){
					angular.forEach( l.beneficiaries, function( d, j ){


						// details
						if ( d.partial_kits && d.partial_kits.length  ) {
							detailsLength ++;
							var result = ngmClusterValidation.validatePartial( d.partial_kits, i, j );
							angular.merge( elements, result.divs );
							detailsRowComplete +=  result.count;
						}

						// details
						if ( d.kit_details && d.kit_details.length  ) {
							detailsLength ++;
							var result = ngmClusterValidation.validateDetail( d.kit_details, i, j );
							angular.merge( elements, result.divs );
							detailsRowComplete +=  result.count;
						}

					});
				});

				// valid
				if ( detailsLength !== detailsRowComplete ) {
					Materialize.toast( $filter('translate')('details_contains_errors') , 6000, 'error' );
					$( elements[0] ).animatescroll();
					return false;
				} else {
					return true;
				}

			},

			// validate form
			validatePartial: function( partial_kits, i, j ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// for each details
				angular.forEach( partial_kits, function( d, k ){

					// detail
					if ( !d.detail_type_id && !d.detail_type_name ){
						id = "label[for='" + 'ngm-beneficiary-kit-'+i+'-'+j+'-'+k+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},


			// validate form
			validateDetail: function( kit_details, i, j ){
				
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// for each details
				angular.forEach( kit_details, function( d, k ){

					// quantity
					if ( d.quantity === null || d.quantity === undefined || d.quantity < 0 ){ 
						id = "label[for='" + 'ngm-beneficiary-kit-quantity-'+i+'-'+j+'-'+k+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}

					// detail
					if ( !d.detail_type_id && !d.detail_type_name ){ 
						id = "label[for='" + 'ngm-beneficiary-kit-'+i+'-'+j+'-'+k+"']";
						$( id ).css({ 'color': '#EE6E73', 'font-weight': 400 });
						validation.divs.push( id );
						complete = false;
					}
				});

				// return 1 for complete, default 0 for error
				if ( complete ) {
					validation.count = 1;
				}
				return validation;

			},

			// validate form
			validate: function( project ){

				// run validation
				$('label').css({ 'color': '#26a69a'});
				$('#ngm-target_locations').css({ 'color': '#26a69a'});
				var scrollDiv;
				var a = ngmClusterValidation.project_details_valid( project );
				var b = ngmClusterValidation.activity_type_valid( project );
				var c = ngmClusterValidation.project_donor_valid( project );
				var d = ngmClusterValidation.target_beneficiaries_valid( project );
				var e = ngmClusterValidation.target_locations_valid( project );

				// locations invalid!
				if ( !e ) {
					$('#ngm-target_locations').css({ 'color': '#EE6E73'});
					scrollDiv = $('#ngm-target_locations');
				}

				if ( !d ) {
					$('#ngm-target_beneficiaries').css({ 'color': '#EE6E73'});
					scrollDiv = $('#ngm-target_beneficiaries');
				}

				// donor
				angular.forEach( ngmClusterValidation.project_donor_valid_labels, function( l,i ){
					$('label[for=' + l + ']').css({ 'color': '#EE6E73'});
					scrollDiv = $('#ngm-project_donor_label');
				});

				// activity types
				angular.forEach( ngmClusterValidation.activity_type_valid_labels, function( l,i ){
					$('label[for=' + l + ']').css({ 'color': '#EE6E73'});
					scrollDiv = $('#ngm-activity_type_label');
				});

				// project description
				angular.forEach( ngmClusterValidation.project_details_valid_labels, function( l,i ){
					$('label[for=' + l + ']').css({ 'color': '#EE6E73'});
					scrollDiv = $('#project_details_form');
				});

				// popup
				if ( a && b && c && d && e ) {
					$( '#save-modal' ).openModal( { dismissible: false } );
				} else {
					// scroll and error
					scrollDiv.animatescroll();
					Materialize.toast( $filter('translate')('project_contains_errors'), 6000, 'error' );
				}

			},
			
			validateBeneficiaries:function(location,detail){
				var elements = [];
				var notDetailOpen =[];
				beneficiaryRow=0;
				beneficiaryRowComplete =0;
				angular.forEach(location, function (l, i) {
					angular.forEach(l.beneficiaries, function (b, j) {
						beneficiaryRow ++;
						result = ngmClusterValidation.validateBeneficiary(b,i,j,detail);
						angular.merge(elements, result.divs);
						
						if (!result.open && result.count === 0){
							notDetailOpen.push(result.index)
						}
						beneficiaryRowComplete += result.count;
					});
				})
				
				if (beneficiaryRow !== beneficiaryRowComplete && notDetailOpen.length>0){					
					// openall
					angular.forEach(notDetailOpen,function(indexbeneficiaries){
						l= indexbeneficiaries.locationIndex;
						b=indexbeneficiaries.beneficiaryIndex;						
						detail[l][b] =true;						
					})

					$timeout(function () {						
						angular.forEach(notDetailOpen, function (indexbeneficiaries) {
							x = indexbeneficiaries.locationIndex;
							y = indexbeneficiaries.beneficiaryIndex;
							resultRelabel = ngmClusterValidation.validateBeneficiary(location[x].beneficiaries[y], x, y, detail);
						});

						Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
						$timeout(function(){$(elements[0]).animatescroll()},100);
					}, 200);
					return false
				}

				if (beneficiaryRow !== beneficiaryRowComplete && notDetailOpen.length < 1) {
					Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
					$(elements[0]).animatescroll();
					return false;
				} else {
					return true;
				}
			},

			validateBeneficiary:function(b,i,j,d){
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };
				
				// DEFAULT
				if (!b.activity_type_id) {
					id = "label[for='" + 'ngm-activity_type_id-' + i + '-' + j + "']";
					$(id).toggleClass('error');
					validation.divs.push(id);
					complete = false;
				}
				if (!b.activity_description_id){
					id = "label[for='" + 'ngm-activity_description_id-' + i + '-' + j + "']";
					$(id).toggleClass('error');
					validation.divs.push(id);
					complete = false;
				}

				// DETAIL
				if (ngmClusterBeneficiaries.form[i][j]['display_activity_detail']){
					if (!b.activity_detail_id) {
						id = "label[for='" + 'ngm-activity_detail_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// FATP SAME PROVINCE
				if ( b.activity_description_id && ( 
							b.activity_description_id === 'fatp_stabilization_referrals_conflict' ||
							b.activity_description_id === 'fatp_stabilization_referrals_civilian' )){
					if(!b.injury_treatment_same_province){
						id = "label[for='" + 'ngm-injury_treatment_same_province-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// INDICATOR
				if(ngmClusterBeneficiaries.form[i][j][ 'display_indicator' ]){
					if (!b.indicator_id) {
						id = "label[for='" + 'ngm-indicator_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// BENEFICIARY
				if(!b.beneficiary_type_id ){
					id = "label[for='" + 'ngm-beneficiary_type_id-' + i + '-' + j + "']";
					$(id).toggleClass('error');
					validation.divs.push(id);
					complete = false;
				}
				
				// CATEGORY
				if (ngmClusterBeneficiaries.form[i][j]['beneficiary_category_type_id']){
					if (!b.beneficiary_category_id){
						id = "label[for='" + 'ngm-beneficiary_category_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// DELIVERY TYPE ID
				if (ngmClusterBeneficiaries.form[i][j]['beneficiary_delivery_type_id']){
					if(!b.delivery_type_id){
						id = "label[for='" + 'ngm-delivery_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				//CASH + PACKAGE
				if(ngmClusterBeneficiaries.form[i][j]['mpc_delivery_type_id']){
					if (!b.mpc_delivery_type_id){
						id = "label[for='" + 'ngm-mpc_delivery_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if (ngmClusterBeneficiaries.form[i][j]['mpc_mechanism_type_id']) {
					// QUICK FIX HARDCODE TODO: REFACTOR
					if (!b.mpc_mechanism_type_id && b.mpc_delivery_type_id !== 'in-kind' ) {
						id = "label[for='" + 'ngm-mpc_mechanism_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if (ngmClusterBeneficiaries.form[i][j][ 'mpc_transfer_type_id' ]) {
					if (!b.transfer_type_id) {
						id = "label[for='" + 'ngm-transfer_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j]['mpc_package_type_id']){
					if (!b.package_type_id){
						id = "label[for='" + 'ngm-package_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// UNITS
				if(ngmClusterBeneficiaries.form[i][j][ 'unit_type_id' ]){
					if (!b.unit_type_id) {
						id = "label[for='" + 'ngm-unit_type_id-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'units' ]){
					if( b.units === null || b.units === undefined || b.units === NaN || b.units < 0 ){
						id = "label[for='" + 'ngm-units-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}

				// HH
				if(ngmClusterBeneficiaries.form[i][j][ 'households' ]){
					if( b.households === null || b.households === undefined || b.households === NaN || b.households < 0 ){
					id = "label[for='" + 'ngm-households-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}

				// FAMILIES
				if(ngmClusterBeneficiaries.form[i][j][ 'families' ]){
					if( b.families === null || b.families === undefined || b.families === NaN || b.families < 0 ){
					id = "label[for='" + 'ngm-families-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				
				// SADD
				if(ngmClusterBeneficiaries.form[i][j][ 'boys' ]){
					if( b.boys === null || b.boys === undefined || b.boys === NaN || b.boys < 0 ){
					id = "label[for='" + 'ngm-boys-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'boys_0_5' ]){
					if( b.boys_0_5 === null || b.boys_0_5 === undefined || b.boys_0_5 === NaN || b.boys_0_5 < 0 ){
						id = "label[for='" + 'ngm-boys_0_5-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'boys_6_11' ]){
					if( b.boys_6_11 === null || b.boys_6_11 === undefined || b.boys_6_11 === NaN || b.boys_6_11 < 0 ){
						id = "label[for='" + 'ngm-boys_6_11-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'boys_12_17' ]){
					if( b.boys_12_17 === null || b.boys_12_17 === undefined || b.boys_12_17 === NaN || b.boys_12_17 < 0 ){
						id = "label[for='" + 'ngm-boys_12_17-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'total_male' ]){
					if( b.total_male === null || b.total_male === undefined || b.total_male === NaN || b.total_male < 0 ){
						id = "label[for='" + 'ngm-total_male-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'girls' ]){
					if( b.girls === null || b.girls === undefined || b.girls === NaN || b.girls < 0 ){
					id = "label[for='" + 'ngm-girls-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'girls_0_5' ]){
					if( b.girls_0_5 === null || b.girls_0_5 === undefined || b.girls_0_5 === NaN || b.girls_0_5 < 0 ){
						id = "label[for='" + 'ngm-girls_0_5-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'girls_6_11' ]){
					if( b.girls_6_11 === null || b.girls_6_11 === undefined || b.girls_6_11 === NaN || b.girls_6_11 < 0 ){
						id = "label[for='" + 'ngm-girls_6_11-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'girls_12_17' ]){
					if( b.girls_12_17 === null || b.girls_12_17 === undefined || b.girls_12_17 === NaN || b.girls_12_17 < 0 ){
						id = "label[for='" + 'ngm-girls_12_17-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j][ 'total_female' ]){
					if( b.total_female === null || b.total_female === undefined || b.total_female === NaN || b.total_female < 0 ){
						id = "label[for='" + 'ngm-total_female-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j]['men'] ){
					if( b.men === null || b.men === undefined || b.men === NaN || b.men < 0 ){
						id = "label[for='" + 'ngm-men-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j]['women'] ){
					if( b.women === null || b.women === undefined || b.women === NaN || b.women < 0 ){
						id = "label[for='" + 'ngm-women-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j]['elderly_men'] ){
					if( b.elderly_men === null || b.elderly_men === undefined || b.elderly_men === NaN || b.elderly_men < 0 ){
						id = "label[for='" + 'ngm-elderly_men-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				if(ngmClusterBeneficiaries.form[i][j]['elderly_women']){
					if( b.elderly_women === null || b.elderly_women === undefined || b.elderly_women === NaN || b.elderly_women < 0 ){
						id = "label[for='" + 'ngm-elderly_women-' + i + '-' + j + "']";
						$(id).toggleClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				

				// TOTAL
				if( b.total_beneficiaries === null || b.total_beneficiaries === undefined || b.total_beneficiaries === NaN || b.total_beneficiaries < 0 ){
					id = "label[for='" + 'ngm-total_beneficiaries-' + i + '-' + j + "']";
					$(id).toggleClass('error');
					validation.divs.push(id);
					complete = false;
				}

				// DETAILS
				if( ngmClusterBeneficiaries.form[i][j]['details'] ){
					
					// for each details
					angular.forEach( b.details, function( d, k ){

						// quantity
						if ( d.unit_type_quantity === null || d.unit_type_quantity === undefined || d.unit_type_quantity < 0 ){ 
							id = "label[for='" + 'ngm-beneficiary_detail_unit_quantity-'+i+'-'+j+'-'+k+"']";
							$(id).toggleClass('error');
							validation.divs.push( id );
							complete = false;
						}

						// detail
						if ( !d.unit_type_id && !d.unit_type_name ){
							id = "label[for='" + 'ngm-beneficiary_detail-'+i+'-'+j+'-'+k+"']";
							$(id).toggleClass('error');
							validation.divs.push( id );
							complete = false;
						}

					});
				}
				
				// return 1 for complete, default 0 for error
				if (d[i][j]) {
					validation.open = true;
					validation.index = {};
					validation.index.locationIndex = i;
					validation.index.beneficiaryIndex = j;
				} else {
					validation.open = false;
					validation.index = {};
					validation.index.locationIndex = i;
					validation.index.beneficiaryIndex = j;
				}
				if (complete) {
					validation.count = 1;
				}
				return validation;

			},

			// check person has authority to validate the report
			verified_user:function(){
				verified= false;
				permission = ngmAuth.userPermissions();
				// find higer level user role if its more than one role
				if(permission.length>1){
					var level_permission = permission.map((item) => {
						return item.LEVEL;
					});
					maxLevel = Math.max(...level_permission);
					permission =permission.filter((obj) => { return obj.LEVEL === maxLevel })
					verified = permission[0].VALIDATE;
				}else{
					verified = permission[0].VALIDATE;
				}
				return verified;
			},

		};

		// return 
		return ngmClusterValidation;

	}]);
