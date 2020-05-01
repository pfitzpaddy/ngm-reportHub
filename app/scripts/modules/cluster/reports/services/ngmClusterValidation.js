
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
				$timeout(function(){
					// $( 'select' ).material_select();
					$('select').formSelect();
				}, 0 );
			},

			// validate project type
			project_details_valid: function( project ) {

				// valid
				ngmClusterValidation.project_details_valid_labels = [];

				if( !project.project_title ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-name');
				}
				if(!project.project_start_date || project.project_start_date === 'Invalid date'){
					ngmClusterValidation.project_details_valid_labels.push('ngm-start-date');
				}
				if(!project.project_end_date ||  project.project_end_date === 'Invalid date'){
					ngmClusterValidation.project_details_valid_labels.push('ngm-end-date');
				}
				/*if( !project.project_start_date ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-start-date');
				}
				if( !project.project_end_date ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-end-date');
				}*/
				if( !project.project_budget_currency ){
					// ngmClusterValidation.project_details_valid_labels.push('ngm-project-budget');
					ngmClusterValidation.project_details_valid_labels.push('ngm-project_budget_currency');
				}
				if ((project.project_budget < 0) || (project.project_budget === undefined) || (project.project_budget === null) || (project.project_budget === NaN)){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-budget');
				}
				if( !project.project_description ){
					ngmClusterValidation.project_details_valid_labels.push('ngm-project-description');
				}

				// // console.log('project_details_valid');
				// // console.log(ngmClusterValidation.project_details_valid_labels.length);

				// if NO labels details valid
				return !ngmClusterValidation.project_details_valid_labels.length;
			},

			projectDescription:function(project){
				ngmClusterValidation.project_description_valid_labels=[];
				var template_text = "Please complete a Project Plan and enter a summary description including objectives...";
				var string_same_or_not = template_text.localeCompare(project.project_description);

				if (!project.project_description || (/^\s*$/).test(project.project_description)) {
					ngmClusterValidation.project_description_valid_labels.push('ngm-project-description');
				}
				return !ngmClusterValidation.project_description_valid_labels.length;

			},

			// validate if ONE activity type
			activity_type_valid: function( project ) {

				// valid
				ngmClusterValidation.activity_type_valid_labels = [];

				// activity types?
				if (typeof project.activity_type_check === 'undefined' || project.activity_type.length <1 ){
					ngmClusterValidation.activity_type_valid_labels.push('ngm-activity_type');
					//$('#ngm-activity_type').removeClass('validate');

				$('#ngm-activity_type').css({'color':'#EE6E73'});
				}else{
					$('#ngm-activity_type').css({'color':'#26a69a'});
				}

				// // console.log('activity_type_valid_labels');
				// // console.log(ngmClusterValidation.activity_type_valid_labels.length);

				// if NO labels activities valid
				return !ngmClusterValidation.activity_type_valid_labels.length;
			},

			// validate project donor
			project_donor_valid: function( project ) {

				// valid
				ngmClusterValidation.project_donor_valid_labels = [];

				// donor
				if (!project.project_donor_check || (project.project_donor.length <1)){
					ngmClusterValidation.project_donor_valid_labels.push('ngm-project_donor');
				}

				// // console.log('project_donor_valid_labels');
				// // console.log(ngmClusterValidation.project_donor_valid_labels.length);

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
					// if ( d.admin0pcode === 'AF' && d.cluster_id === 'eiewg' ) {
					// 	if ( d.site_implementation_id && d.site_implementation_id === 'informal' && !d.site_hub_id ) {
					// 		rowComplete--;
					// 	}
					// }
				});

				if( project.target_locations.length && ( rowComplete === project.target_locations.length ) ){

					return true;
				} else {

					return false;
				}
			},
			// just for AF now
			targetLocationsValidate:function(project,detail){
				ngmClusterValidation.targetLocationsValidatelabel=[];
				// new validation
				var elements = [];
				var notDetailOpen = [];
				locationRow = 0;
				locationRowComplete = 0;
				if (!project.target_locations.length){
					ngmClusterValidation.targetLocationsValidatelabel.push('#ngm-target_locations')
					$timeout(function (){M.toast({ html: 'Please Put At Least One Target Location', displayLength: 4000, classes: 'error' })},100);
					return false
				}
				angular.forEach(project.target_locations, function (l, i) {
					locationRow++;
					result = ngmClusterValidation.targetLocationValidate(l,i,detail);
					angular.merge(elements, result.divs);

					if (!result.open && result.count === 0) {
						notDetailOpen.push(result.locationIndex)
					}
					locationRowComplete += result.count;
				});

				if (locationRow !== locationRowComplete && notDetailOpen.length > 0) {
					// openall
					angular.forEach(notDetailOpen, function (indexLocation) {
						l = indexLocation;
						detail[l] = true;
					})
					ngmClusterValidation.targetLocationsValidatelabel.push(elements[0])
					$timeout(function () {
						angular.forEach(notDetailOpen, function (indexLocation) {
							x = indexLocation;
							resultRelabel = ngmClusterValidation.targetLocationValidate(project.target_locations[x], x, detail);
						})

						// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
						M.toast({ html: $filter('translate')('Target Location Contain Error'), displayLength: 4000, classes: 'error' });
						$timeout(function () { $(elements[0]).animatescroll() }, 100);
					}, 200);
					return false
				}

				if (locationRow !== locationRowComplete && notDetailOpen.length <1) {
					ngmClusterValidation.targetLocationsValidatelabel.push(elements[0])
					// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
					M.toast({ html: $filter('translate')('Target Location Contain Error'), displayLength: 4000, classes: 'error' });
					$(elements[0]).animatescroll();
					return false;
				} else {
					return true;
				}
			},
			// just for AF now
			// target_location validate
			targetLocationValidate:function(l,i,detail){

				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				if (!l.admin1pcode) {
					id = "label[for='" + 'ngm-admin1pcode-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetlocation-complete01');
				// console.log(complete);

				if (!l.admin2pcode) {
					id = "label[for='" + 'ngm-admin2pcode-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetlocation-complete02');
				// console.log(complete);

				if (!l.site_name) {
					id = "label[for='" + 'ngm-site_name-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetlocation-complete03');
				// console.log(complete);

				if (complete) {
					validation.count = 1;
				}
				if (detail[i]) {
					validation.open = true;
					validation.locationIndex = i;
				} else {
					validation.open = false;
					validation.locationIndex = i;
				}
				return validation;


			},
			// just for AF now
			targetBeneficiariesValidate: function (project, detail){
				ngmClusterValidation.targetBenfeciariesValidatelabel=[];
				// new validation
				var elements = [];
				var notDetailOpen = [];
				targetBeneficiaryRow = 0;
				targetBeneficiaryRowComplete = 0;
				angular.forEach(project.target_beneficiaries, function (b, i) {
					targetBeneficiaryRow++;
					result = ngmClusterValidation.targetBeneficiaryValidate(b, i, detail,project);
					angular.merge(elements, result.divs);

					if (!result.open && result.count === 0) {
						notDetailOpen.push(result.benficiaryIndex)
					}
					targetBeneficiaryRowComplete += result.count;
				});

				if (targetBeneficiaryRow !== targetBeneficiaryRowComplete && notDetailOpen.length > 0) {
					// openall
					angular.forEach(notDetailOpen, function (indexBeneficiary) {
						x = indexBeneficiary;
						detail[x] = true;
					})
					ngmClusterValidation.targetBenfeciariesValidatelabel.push(elements[0]);
					$timeout(function () {
						angular.forEach(notDetailOpen, function (indexBeneficiary) {
							x = indexBeneficiary;
							resultRelabel = ngmClusterValidation.targetBeneficiaryValidate(project.target_beneficiaries[x], x, detail,project);
						})

						// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
						M.toast({ html: $filter('translate')('Target Benefecaries Contain Error'), displayLength: 4000, classes: 'error' });
						$timeout(function () { $(elements[0]).animatescroll() }, 100);
					}, 200);
					return false
				}

				if (targetBeneficiaryRow !== targetBeneficiaryRowComplete && notDetailOpen.length < 1) {
					ngmClusterValidation.targetBenfeciariesValidatelabel.push(elements[0]);
					// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
					M.toast({ html: $filter('translate')('Target Beneficairies Contain Error'), displayLength: 4000, classes: 'error' });
					$(elements[0]).animatescroll();
					return false;
				} else {
					return true;
				}
			},
			// just for AF now
			targetBeneficiaryValidate(b, i, detail,project){

				// for AF need to add delivery_type_id and hrp_beneficiary_type_id
				// for

				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				if (!b.activity_type_id) {
					id = "label[for='" + 'ngm-activity_type_id-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetbeneficiary-complete01');
				// console.log(complete);

				if (!b.activity_description_id) {
					id = "label[for='" + 'ngm-activity_description_id-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetbeneficiary-complete02');
				// console.log(complete);

				// DETAIL
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['display_activity_detail']) {
					if (!b.activity_detail_id) {
						id = "label[for='" + 'ngm-activity_detail_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete03');
				// console.log(complete);

				// console.log('targetbeneficiary-complete04_skip');
				// console.log(complete);

				// INDICATOR
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['display_indicator']) {
					if (!b.indicator_id) {
						id = "label[for='" + 'ngm-indicator_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete05');
				// console.log(complete);

				if (!b.beneficiary_type_id) {
					id = "label[for='" + 'ngm-beneficiary_type_id-' + i + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log('targetbeneficiary-complete06');
				// console.log(complete);

				// if (project.project_hrp_project && project.admin0pcode ==='AF') {
				// 	if (!b.hrp_beneficiary_type_id){
				// 		id = "label[for='" + 'ngm-hrp-beneficiary_type_id-' + i + "']";
				// 		$(id).addClass('error');
				// 		validation.divs.push(id);
				// 		disabled = false;
				// 	}

				// }

				if (ngmClusterBeneficiaries.form[0][i] && !ngmClusterBeneficiaries.form[0][i]['hrp_beneficiary_type_id'] && (project.admin0pcode === 'AF') && project.project_hrp_project) {

					if (!b.hrp_beneficiary_type_id) {
						id = "label[for='" + 'ngm-hrp-beneficiary_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					// console.log('targetbeneficiary-complete06(HRP)');
					// console.log(complete);
				}

				// if (b.hasOwnProperty('delivery_type_id') && project.admin0pcode === 'AF') {
				// 	if (!b.delivery_type_id) {
				// 		id = "label[for='" + 'ngm-hrp-beneficiary_type_id-' + i + "']";
				// 		$(id).addClass('error');
				// 		validation.divs.push(id);
				// 		disabled = false;
				// 	}
				// }

				// CATEGORY
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['beneficiary_category_type_id']) {
					if (!b.beneficiary_category_id) {
						id = "label[for='" + 'ngm-beneficiary_category_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete07');
				// console.log(complete);

				// DELIVERY TYPE ID
				// if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['beneficiary_delivery_type_id']) {
				// 	if (!b.delivery_type_id) {
				// 		id = "label[for='" + 'ngm-delivery_type_id-' + i + "']";
				// 		$(id).addClass('error');
				// 		validation.divs.push(id);
				// 		complete = false;
				// 	}
				// }
				// console.log('targetbeneficiary-complete08skip');
				// console.log(complete);

				//CASH + PACKAGE
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_delivery_type_id']) {
					if (!b.mpc_delivery_type_id) {
						id = "label[for='" + 'ngm-mpc_delivery_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete09');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_mechanism_type_id']) {
					// QUICK FIX HARDCODE TODO: REFACTOR
					if (!b.mpc_mechanism_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-mpc_mechanism_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete10');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_transfer_type_id']) {
					if (!b.transfer_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-transfer_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete11');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_package_type_id']) {
					if (!b.package_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-package_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete12');
				// console.log(complete);

				// UNIT TYPE
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['unit_type_id']) {
					if (!b.unit_type_id) {
						id = "label[for='" + 'ngm-unit_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete13');
				// console.log(complete);

				// UNITS
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['units']) {
					if (b.units === null || b.units === undefined || b.units === NaN || b.units < 0) {
						id = "label[for='" + 'ngm-units-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete14');
				// console.log(complete);

				// HH
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['households']) {
					if (b.households === null || b.households === undefined || b.households === NaN || b.households < 0) {
						id = "label[for='" + 'ngm-households-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete15');
				// console.log(complete);

				// FAMILIES
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['families']) {
					if (b.families === null || b.families === undefined || b.families === NaN || b.families < 0) {
						id = "label[for='" + 'ngm-families-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete16');
				// console.log(complete);

				// SADD
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys']) {
					if (b.boys === null || b.boys === undefined || b.boys === NaN || b.boys < 0) {
						id = "label[for='" + 'ngm-boys-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete17');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_0_5']) {
					if (b.boys_0_5 === null || b.boys_0_5 === undefined || b.boys_0_5 === NaN || b.boys_0_5 < 0) {
						id = "label[for='" + 'ngm-boys_0_5-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete18');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_6_11']) {
					if (b.boys_6_11 === null || b.boys_6_11 === undefined || b.boys_6_11 === NaN || b.boys_6_11 < 0) {
						id = "label[for='" + 'ngm-boys_6_11-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete19');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_12_17']) {
					if (b.boys_12_17 === null || b.boys_12_17 === undefined || b.boys_12_17 === NaN || b.boys_12_17 < 0) {
						id = "label[for='" + 'ngm-boys_12_17-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete20');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_male']) {
					if (b.total_male === null || b.total_male === undefined || b.total_male === NaN || b.total_male < 0) {
						id = "label[for='" + 'ngm-total_male-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete21');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls']) {
					if (b.girls === null || b.girls === undefined || b.girls === NaN || b.girls < 0) {
						id = "label[for='" + 'ngm-girls-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete22');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_0_5']) {
					if (b.girls_0_5 === null || b.girls_0_5 === undefined || b.girls_0_5 === NaN || b.girls_0_5 < 0) {
						id = "label[for='" + 'ngm-girls_0_5-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete23');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_6_11']) {
					if (b.girls_6_11 === null || b.girls_6_11 === undefined || b.girls_6_11 === NaN || b.girls_6_11 < 0) {
						id = "label[for='" + 'ngm-girls_6_11-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete24');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_12_17']) {
					if (b.girls_12_17 === null || b.girls_12_17 === undefined || b.girls_12_17 === NaN || b.girls_12_17 < 0) {
						id = "label[for='" + 'ngm-girls_12_17-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete25');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_female']) {
					if (b.total_female === null || b.total_female === undefined || b.total_female === NaN || b.total_female < 0) {
						id = "label[for='" + 'ngm-total_female-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete26');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['men']) {
					if (b.men === null || b.men === undefined || b.men === NaN || b.men < 0) {
						id = "label[for='" + 'ngm-men-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete27');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['women']) {
					if (b.women === null || b.women === undefined || b.women === NaN || b.women < 0) {
						id = "label[for='" + 'ngm-women-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete28');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['elderly_men']) {
					if (b.elderly_men === null || b.elderly_men === undefined || b.elderly_men === NaN || b.elderly_men < 0) {
						id = "label[for='" + 'ngm-elderly_men-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete29');
				// console.log(complete);
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['elderly_women']) {
					if (b.elderly_women === null || b.elderly_women === undefined || b.elderly_women === NaN || b.elderly_women < 0) {
						id = "label[for='" + 'ngm-elderly_women-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}

				// console.log('targetbeneficiary-complete30');
				// console.log(complete);
				// TOTAL
				if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_beneficiaries']){
					if (b.total_beneficiaries === null || b.total_beneficiaries === undefined || b.total_beneficiaries === NaN || b.total_beneficiaries < 0) {
						id = "label[for='" + 'ngm-total_beneficiaries-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log('targetbeneficiary-complete31');
				// console.log(complete);

				if (project.admin0pcode === 'ET' && b.activity_description_id === 'loose_items') {
					if (!b.partial_kits && b.partial_kits.length < 1 && !b.households < 1) {
						disabled = false;
					}
					if (!b.kit_details && !b.kit_details.length < 1 && b.households < 1) {
						disabled = false;
					}
				} else if (b.households < 1) {
					disabled = false;
				}

				if (complete) {
					validation.count = 1;
				}
				if (detail[i]) {
					validation.open = true;
					validation.benficiaryIndex = i;
				} else {
					validation.open = false;
					validation.benficiaryIndex = i;
				}
				return validation;

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
						$( id ).addClass('error');
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
						$( id ).addClass('error');
						validation.divs.push( id );
						complete = false;
					}

					// detail
					if ( !d.detail_type_id && !d.detail_type_name ){
						id = "label[for='" + 'ngm-beneficiary-kit-'+i+'-'+j+'-'+k+"']";
						$( id ).addClass('error');
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
			validate: function( project,detailBeneficiaries,detailLocations,display_modal){


				// run validation
				$('label').removeClass( 'error' ).addClass( 'active' );
				$('#ngm-target_beneficiaries').removeClass( 'error' ).addClass( 'active' );
				$('#ngm-target_locations').removeClass( 'error' ).addClass( 'active' );
				var scrollDiv;
				var a = ngmClusterValidation.project_details_valid( project );
				var b = ngmClusterValidation.activity_type_valid( project );
				var c = ngmClusterValidation.project_donor_valid( project );
				var desc = ngmClusterValidation.projectDescription(project);
				var d = ngmClusterValidation.targetBeneficiariesValidate(project,detailBeneficiaries);
				var e = project.admin0pcode !== 'AF' ? ngmClusterValidation.target_locations_valid(project) : ngmClusterValidation.targetLocationsValidate(project,detailLocations);
				// locations invalid!
				if ( !e ) {
					$('#ngm-target_locations').addClass('error');
					scrollDiv = $('#ngm-target_locations');
					if (project.admin0pcode === 'AF'){
						scrollDiv = $(ngmClusterValidation.targetLocationsValidatelabel[0]);
					}
					$('#ngm-target_locations').css({'color':'red'});
				}else{
					$('#ngm-target_locations').css({'color':'#616161'});
				}

				if ( !d ) {
					$('#ngm-target_beneficiaries').addClass('error');
					scrollDiv = $(ngmClusterValidation.targetBenfeciariesValidatelabel[0]);//$('#ngm-target_beneficiaries');
					$('#ngm-target_beneficiaries').css({'color':'red'});

				}else{
					$('#ngm-target_beneficiaries').css({'color':'#616161'});
				}

				if (!desc) {
					$('label[for=' + 'ngm-project-description' + ']').addClass('error');
					scrollDiv = $('#ngm-project-description');
				}

				// donor
				angular.forEach( ngmClusterValidation.project_donor_valid_labels, function( l,i ){
					$('label[for=' + l + ']').addClass('error');
					// scrollDiv = $('#ngm-project_donor_label');
					scrollDiv = $('#ngm-project_donor_select');
				});

				// activity types
				angular.forEach( ngmClusterValidation.activity_type_valid_labels, function( l,i ){
					$('label[for=' + l + ']').addClass('error');
					scrollDiv = $('#ngm-activity_type_label');
				});

				// project description
				angular.forEach( ngmClusterValidation.project_details_valid_labels, function( l,i ){
					$('label[for=' + l + ']').addClass('error');
					scrollDiv = $('#project_details_form');
				});

				// popup
				if ( a && b && c && desc && d && e ) {
					if(display_modal){
						// $( '#save-modal' ).openModal( { dismissible: false } );
						$('#save-modal').modal({ dismissible: false });
						$('#save-modal').modal('open');
					}
					return true
				} else {
					// scroll and error
					scrollDiv.animatescroll();
					// Materialize.toast( $filter('translate')('project_contains_errors'),10000, 'error' );
					M.toast({ html: $filter('translate')('project_contains_errors'), displayLength: 10000, classes: 'error' });

					if(a === false){
						// Materialize.toast( $filter('translate')('information_in_project_data_is_incorrect_or_incomplete'),10000,'error' );
						M.toast({ html: $filter('translate')('information_in_project_data_is_incorrect_or_incomplete'), displayLength: 10000, classes: 'error' });
					}

					if(b === false){
						// Materialize.toast( $filter('translate')('at_least_one_activity_type_must_be_selected'),10000, 'error' );
						M.toast({ html: $filter('translate')('at_least_one_activity_type_must_be_selected'), displayLength: 10000, classes: 'error' });

					}
					if(desc === false){
						M.toast({ html: 'Please Fill the Project Description & Objective', displayLength: 10000, classes: 'error' });
					}

					if(d === false){
						// Materialize.toast( $filter('translate')('information_in_target_population_is_incorrect_or_incomplete'),10000,'error' );
						M.toast({ html: $filter('translate')('information_in_target_population_is_incorrect_or_incomplete'), displayLength: 10000, classes: 'error' });

					}

					if(e === false){

					// Materialize.toast($filter('translate')('information_in_project_target_locations_is_incorrect_or_incomplete'),10000,'error');
					M.toast({ html: $filter('translate')('information_in_project_target_locations_is_incorrect_or_incomplete'), displayLength: 10000, classes: 'error' });
				    }
					/*Materialize.toast($('<a class="btn-flat waves-effect waves-teal" style=" color:white">'+'C<span style="text-transform: lowercase">lick aquí para cerrar mensajes de error</span> </a>').on('click', function (e) {
					   $('.toast').hide();
					}));*/

					return false;


				}

			},

			// validateProjectPlan
			validateProjectPlan: function (project, detailBeneficiaries, detailLocations){
				var scrollDiv;
				var a = ngmClusterValidation.project_details_valid(project);
				var b = ngmClusterValidation.activity_type_valid(project);
				var c = ngmClusterValidation.project_donor_valid(project);
				var desc = ngmClusterValidation.projectDescription(project);
				var d = ngmClusterValidation.targetBeneficiariesValidate(project, detailBeneficiaries);
				var e = project.admin0pcode !== 'AF' ? ngmClusterValidation.target_locations_valid(project) : ngmClusterValidation.targetLocationsValidate(project, detailLocations);
				if(a && b && c && desc && d && e ){
					return true;
				}else{

					return false
				}
			},

			validateBeneficiaries:function(location,detail,admin0pcode, hrp_project_status){
				var elements = [];
				var notDetailOpen =[];
				beneficiaryRow=0;
				beneficiaryRowComplete =0;
				angular.forEach(location, function (l, i) {
					angular.forEach(l.beneficiaries, function (b, j) {
						beneficiaryRow ++;
						result = ngmClusterValidation.validateBeneficiary(b, i, j, detail, admin0pcode, hrp_project_status);
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
							resultRelabel = ngmClusterValidation.validateBeneficiary(location[x].beneficiaries[y], x, y, detail, admin0pcode, hrp_project_status);
						});

						// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
						M.toast({ html: $filter('translate')('beneficiaries_contains_errors'), displayLength: 4000, classes: 'error' });
						$timeout(function(){$(elements[0]).animatescroll()},100);
					}, 200);
					return false
				}

				if (beneficiaryRow !== beneficiaryRowComplete && notDetailOpen.length < 1) {
					// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
					M.toast({ html: $filter('translate')('beneficiaries_contains_errors'), displayLength: 4000, classes: 'error' });
					$(elements[0]).animatescroll();
					return false;
				} else {
					return true;
				}
			},

			validateBeneficiary: function (b, i, j, d, admin0pcode, hrp_project_status){
				// valid
				var id;
				var complete = true;
				var validation = { count: 0, divs: [] };

				// DEFAULT
				if (!b.activity_type_id) {
					id = "label[for='" + 'ngm-activity_type_id-' + i + '-' + j + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log( 'complete01' );
				// console.log( complete );
				if (!b.activity_description_id){
					id = "label[for='" + 'ngm-activity_description_id-' + i + '-' + j + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log( 'complete02' );
				// console.log( complete );

				// DETAIL
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['display_activity_detail'] ) ) {
					if (!b.activity_detail_id) {
						id = "label[for='" + 'ngm-activity_detail_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete03' );
				// console.log( complete );

				// console.log( 'complete04_skip' );
				// console.log( complete );

				// INDICATOR
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'display_indicator' ] ) ) {
					if (!b.indicator_id) {
						id = "label[for='" + 'ngm-indicator_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete05' );
				// console.log( complete );

				// BENEFICIARY
				if(!b.beneficiary_type_id ){
					id = "label[for='" + 'ngm-beneficiary_type_id-' + i + '-' + j + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log( 'complete06' );
				// console.log( complete );
				// remember to change this if in activities.csv  hrp_beneficiary_type_id set to 1 right now because not added it still like this
				if ( admin0pcode === 'AF' && ( !ngmClusterBeneficiaries.form[i][j]['hrp_beneficiary_type_id'] && hrp_project_status ) ) {
					// console.log(b.hrp_beneficiary_type_id)
					if (!b.hrp_beneficiary_type_id){
						id = "label[for='" + 'ngm-hrp_beneficiary_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					// console.log('complete06(HRP)');
					// console.log(complete);
				}
				// CATEGORY
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['beneficiary_category_type_id'] ) ) {
					if (!b.beneficiary_category_id){
						id = "label[for='" + 'ngm-beneficiary_category_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete07' );
				// console.log( complete );

				// DELIVERY TYPE ID
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['beneficiary_delivery_type_id'] ) ) {
					if(!b.delivery_type_id){
						id = "label[for='" + 'ngm-delivery_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete08' );
				// console.log( complete );

				//CASH + PACKAGE
				if (ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_delivery_type_id'] ) ){
					if (!b.mpc_delivery_type_id){
						id = "label[for='" + 'ngm-mpc_delivery_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete09' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_mechanism_type_id'] ) ) {
					// QUICK FIX HARDCODE TODO: REFACTOR
					if (!b.mpc_mechanism_type_id && b.mpc_delivery_type_id !== 'in-kind' ) {
						id = "label[for='" + 'ngm-mpc_mechanism_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete10' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'mpc_transfer_type_id' ] ) ) {
					if (!b.transfer_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-transfer_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete11' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_package_type_id'] ) ) {
					if (!b.package_type_id && b.mpc_delivery_type_id !== 'in-kind'){
						id = "label[for='" + 'ngm-package_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete12' );
				// console.log( complete );

				// UNIT TYPE
				if (ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'unit_type_id' ] ) ) {
					if (!b.unit_type_id) {
						id = "label[for='" + 'ngm-unit_type_id-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete13' );
				// console.log( complete );

				// UNITS
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'units' ] ) ) {
					if (b.units === null || b.units === undefined || b.units === NaN || b.units < 0 || b.units === ''){
						id = "label[for='" + 'ngm-units-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete14' );
				// console.log( complete );

				// HH
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'households' ] ) ) {
					if (b.households === null || b.households === undefined || b.households === NaN || b.households < 0 || b.households === ''){
					id = "label[for='" + 'ngm-households-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete15' );
				// console.log( complete );

				// FAMILIES
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'families' ] ) ) {
					if (b.families === null || b.families === undefined || b.families === NaN || b.families < 0 || b.families === ''){
					id = "label[for='" + 'ngm-families-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete16' );
				// console.log( complete );

				// SADD
				if (ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'boys' ] ) ) {
					if (b.boys === null || b.boys === undefined || b.boys === NaN || b.boys < 0 || b.boys === ''){
					id = "label[for='" + 'ngm-boys-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete17' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'boys_0_5' ] ) ) {
					if (b.boys_0_5 === null || b.boys_0_5 === undefined || b.boys_0_5 === NaN || b.boys_0_5 < 0 || b.boys_0_5 === ''){
						id = "label[for='" + 'ngm-boys_0_5-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete18' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'boys_6_11' ] ) ) {
					if (b.boys_6_11 === null || b.boys_6_11 === undefined || b.boys_6_11 === NaN || b.boys_6_11 < 0 || b.boys_6_11 === ''){
						id = "label[for='" + 'ngm-boys_6_11-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete19' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'boys_12_17' ] ) ) {
					if (b.boys_12_17 === null || b.boys_12_17 === undefined || b.boys_12_17 === NaN || b.boys_12_17 < 0 || b.boys_12_17 === ''){
						id = "label[for='" + 'ngm-boys_12_17-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete20' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'total_male' ] ) ) {
					if( b.total_male === null || b.total_male === undefined || b.total_male === NaN || b.total_male < 0 ){
						id = "label[for='" + 'ngm-total_male-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete21' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'girls' ] ) ) {
					if (b.girls === null || b.girls === undefined || b.girls === NaN || b.girls < 0 || b.girls === ''){
					id = "label[for='" + 'ngm-girls-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete22' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'girls_0_5' ] ) ) {
					if (b.girls_0_5 === null || b.girls_0_5 === undefined || b.girls_0_5 === NaN || b.girls_0_5 < 0 || b.girls_0_5 === ''){
						id = "label[for='" + 'ngm-girls_0_5-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete23' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'girls_6_11' ] ) ) {
					if (b.girls_6_11 === null || b.girls_6_11 === undefined || b.girls_6_11 === NaN || b.girls_6_11 < 0 || b.girls_6_11 === ''){
						id = "label[for='" + 'ngm-girls_6_11-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete24' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'girls_12_17' ] ) ) {
					if (b.girls_12_17 === null || b.girls_12_17 === undefined || b.girls_12_17 === NaN || b.girls_12_17 < 0 || b.girls_12_17 === ''){
						id = "label[for='" + 'ngm-girls_12_17-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete25' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j][ 'total_female' ] ) ) {
					if( b.total_female === null || b.total_female === undefined || b.total_female === NaN || b.total_female < 0 ){
						id = "label[for='" + 'ngm-total_female-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete26' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['men'] ) ) {
					if( b.men === null || b.men === undefined || b.men === NaN || b.men < 0  || b.men === ''){
						id = "label[for='" + 'ngm-men-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete27' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['women'] ) ) {
					if (b.women === null || b.women === undefined || b.women === NaN || b.women < 0 || b.women === ''){
						id = "label[for='" + 'ngm-women-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete28' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['elderly_men'] ) ) {
					if (b.elderly_men === null || b.elderly_men === undefined || b.elderly_men === NaN || b.elderly_men < 0 || b.elderly_men === ''){
						id = "label[for='" + 'ngm-elderly_men-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}
				// console.log( 'complete29' );
				// console.log( complete );
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['elderly_women'] ) ) {
					if (b.elderly_women === null || b.elderly_women === undefined || b.elderly_women === NaN || b.elderly_women < 0 || b.elderly_women === ''){
						id = "label[for='" + 'ngm-elderly_women-' + i + '-' + j + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
				}

				// console.log( 'complete30' );
				// console.log( complete );
				// TOTAL
				if( b.total_beneficiaries === null || b.total_beneficiaries === undefined || b.total_beneficiaries === NaN || b.total_beneficiaries < 0 ){
					id = "label[for='" + 'ngm-total_beneficiaries-' + i + '-' + j + "']";
					$(id).addClass('error');
					validation.divs.push(id);
					complete = false;
				}
				// console.log( 'complete31' );
				// console.log( complete );

				// DETAILS
				if ( ngmClusterBeneficiaries.form[i] && ( ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['details'] ) ) {

					// check for empty details
					var remove_details = false;
					angular.forEach( b.details, function( d, k ){

						// remove empty detail
						if ( !d.unit_type_id && !d.unit_type_name && !d.details ){
							remove_details = true;
						}

					});

					// no entry
					if( remove_details ){
						delete b.details;
					}

					// for each details
					angular.forEach( b.details, function( d, k ){

						// quantity
						if ( d.unit_type_quantity === null || d.unit_type_quantity === undefined || d.unit_type_quantity < 0 ){
							id = "label[for='" + 'ngm-beneficiary_detail_unit_quantity-'+i+'-'+j+'-'+k+"']";
							$(id).addClass('error');
							validation.divs.push( id );
							complete = false;
						}

						// detail error
						if ( !d.unit_type_id && !d.unit_type_name && ( d.details && d.details.length ) ) {
							id = "label[for='" + 'ngm-beneficiary_detail-'+i+'-'+j+'-'+k+"']";
							$(id).addClass('error');
							validation.divs.push( id );
							complete = false;
						}

					});
				}
				// console.log( 'complete32' );
				// console.log( complete );

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

			// fieldNameBeneficiaryMonthlyReport:function(){
			// 	var field ={
			// 		"activity_type_id":"Activity",
			// 		"activity_description_id": "Description or Specific Indicator",
			// 		"activity_detail_id": "Details",
			// 		"indicator_id": "Indicator",
			// 		"beneficiary_type_id": "Beneficiary",
			// 		"hrp_beneficiary_type_id": "HRP Beneficiary",
			// 		"delivery_type_id": "Type",
			// 		"beneficiary_category_id": "Category",
			// 		"mpc_delivery_type_id": "Implementation modality",
			// 		"mpc_mechanism_type_id": "Transfer Mechanism",
			// 		"package_type_id": "Package",
			// 		"unit_type_id": "Units",
			// 		"units": "Amount or Transfer Value",
			// 		"transfer_type_id": "Transfers",
			// 		"households": "Households",
			// 		"families": "Families",
			// 		"boys": "Boys",
			// 		"boys_0_5": "Male 0-5",
			// 		"boys_6_11": "Male 6-11",
			// 		"boys_6_12": "Male 6-12",
			// 		"boys_12_17": "Male 12-17",
			// 		"boys_13_17": "Male 13-17",
			// 		"men": "Men or Male 18-59 or Men (18 to 59)",
			// 		"elderly_men":"Eld. Men or Male 60+ or Eld. Men (60+)",
			// 		"girls": "Girls",
			// 		"girls_et_esnfi": "Girls (0 to 17)",
			// 		"girls_0_5": "Female 0-5",
			// 		"girls_6_11": "Female 6-11",
			// 		"girls_6_12": "Female 6-12",
			// 		"girls_12_17": "Female 12-17",
			// 		"girls_13_17": "Male 13-17",
			// 		"women": "Women or Female 18-59 or Women (18 to 59)",
			// 		"elderly_women": "Female 60+ or Eld. Women or Eld. Women (60+)",
			// 		"location":"Location"
			// 	}
			// 	return field;
			// },
			fieldNameBeneficiaryMonthlyReport:function(){
				field = {
					'project_id' :'Project ID',
					'report_id' :'Report ID',
					'cluster' :'Cluster',
					'cluster_id': 'Cluster',
					'organization' :'Organization',
					'username': 'Focal Point',
					'email' :'Email',
					'project_hrp_code' :'HRP Code',
					'project_title' :'Project Title',
					'project_code' :'Project Code',
					'admin0name' :'Country',
					'admin1pcode' :'Admin1 Pcode',
					'admin1name' :'Admin1 Name',
					'admin2pcode' :'Admin2 Pcode',
					'admin2name' :'Admin2 Name',
					'admin3pcode' :'Admin3 Pcode',
					'admin3name' :'Admin3 Name',
					'site_implementation_id' :'Site Implementation',
					'site_type_id' :'Site Type',
					'site_id' :'Location Name',
					'report_month' :'Report Month',
					'report_year' :'Report Year',
					'activity_type_id' :'Activity Type',
					'activity_description_id' :'Activity Description',
					'activity_detail_name':'Activity Details',
					'indicator_id' :'Indicator',
					'category_type_id' :'Category Type',
					'beneficiary_type_id' :'Beneficiary Type',
					'beneficiary_category_id' :'Beneficiary Category',
					'hrp_beneficiary_type_id' :'HRP Beneficiary Type',
					'strategic_objective_id' :'Strategic Objective',
					'strategic_objective_description' :'Strategic Objective Description',
					'sector_objective_id' :'Sector Objective',
					'sector_objective_description' :'Sector Objective Description',
					'delivery_type_id' :'Population',
					'units' :'Amount',
					'unit_type_id' :'Unit Type',
					'transfer_type_value' :'Cash Transfers',
					'transfer_type_id': 'Cash Transfers',
					'mpc_delivery_type_id' :'Cash Delivery Type',
					'package_type_id': 'Package Type',
					'households' :'Households',
					'families' :'Families',
					'boys' :'Boys',
					'girls' :'Girls',
					'men' :'Men',
					'women' :'Women',
					'elderly_men' :'Elderly Men',
					'elderly_women' :'Elderly Women',
					'total' :'Total',
					'createdAt' :'Created',
					'updatedAt':'Last Update',
					'location':'Location',
					"mpc_mechanism_type_id": "Transfer Mechanism",
					"boys_0_5": "Male 0-5",
					"boys_6_11": "Male 6-11",
					"boys_6_12": "Male 6-12",
					"boys_12_17": "Male 12-17",
					"boys_13_17": "Male 13-17",
					"girls_0_5": "Female 0-5",
					"girls_6_11": "Female 6-11",
					"girls_6_12": "Female 6-12",
					"girls_12_17": "Female 12-17",
					"girls_13_17": "Male 13-17",
					'implementing_partners': 'Implementing Partners',
					'total_beneficiaries':'Total'
				}
				return field
			},

			validationInputFromFile: function (b, i, j, admin0pcode, hrp_project_status ){
				var validation =[];
				// DEFAULT
				if (!b.activity_type_id) {
					id = "label[for='" + 'ngm-activity_type_id-' + i + '-' + j + "']";
					var obj = { label: id,property: 'activity_type_id', reason: 'missing value' };
					if (b.activity_type_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				}
				// console.log('complete01');

				if (!b.activity_description_id) {
					id = "label[for='" + 'ngm-activity_description_id-' + i + '-' + j + "']";
					var obj = { label: id, property: 'activity_description_id', reason: 'missing value' };
					if (b.activity_description_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				}
				// console.log('complete02');


				// DETAIL
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['display_activity_detail'])) {
					if (!b.activity_detail_id) {
						id = "label[for='" + 'ngm-activity_detail_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'activity_detail_id', reason: 'missing value' };
						if (b.activity_detail_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete03');


				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['display_activity_detail'] && b.activity_detail_id)){
						delete b.activity_detail_id;
						delete b.activity_detail_name;
						var obj = { label: false, property: 'activity_detail_id', reason: 'should not be reported for the activity' };
						validation.push(obj);
					// console.log('clear field 1')
				}
				// console.log('complete04_skip');


				// INDICATOR
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['display_indicator'])) {
					if (!b.indicator_id) {
						id = "label[for='" + 'ngm-indicator_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'indicator_id', reason: 'missing value' };
						if (b.indicator_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete05');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['display_indicator'] && b.indicator_id)) {
					delete b.indicator_id;
					delete b.indicator_name;
					var obj = { label: false, property: 'indicator_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 2')
				}


				// BENEFICIARY
				if (!b.beneficiary_type_id) {
					id = "label[for='" + 'ngm-beneficiary_type_id-' + i + '-' + j + "']";
					var obj = { label: id, property: 'beneficiary_type_id', reason: 'missing value' };
					if (b.beneficiary_type_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				}
				// console.log('complete06');

				// remember to change this if in activities.csv  hrp_beneficiary_type_id set to 1 right now because not added it still like this
				if (admin0pcode === 'AF' && (!ngmClusterBeneficiaries.form[i][j]['hrp_beneficiary_type_id'] && hrp_project_status)) {
					// console.log(b.hrp_beneficiary_type_id)
					if (!b.hrp_beneficiary_type_id) {
						id = "label[for='" + 'ngm-hrp_beneficiary_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'hrp_beneficiary_type_id', reason: 'missing value' };
						if (b.hrp_beneficiary_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
					// console.log('complete06(HRP)');

				}
				// CATEGORY
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['beneficiary_category_type_id'])) {
					if (!b.beneficiary_category_id) {
						id = "label[for='" + 'ngm-beneficiary_category_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'beneficiary_category_id', reason: 'missing value' };
						if (b.beneficiary_category_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete07');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['beneficiary_category_type_id'] && b.beneficiary_category_id)) {
					delete b.beneficiary_category_id;
					delete b.beneficiary_category_name;
					var obj = { label: false, property: 'beneficiary_category_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 3')
				}



				// DELIVERY TYPE ID
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['beneficiary_delivery_type_id'])) {
					if (!b.delivery_type_id) {
						id = "label[for='" + 'ngm-delivery_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'delivery_type_id', reason: 'missing value' };

						if (b.delivery_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete08');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['beneficiary_delivery_type_id'] && b.delivery_type_id)) {
					delete b.delivery_type_id;
					delete b.delivery_type_name;
					var obj = { label: false, property: 'delivery_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 4')
				}

				//CASH + PACKAGE
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_delivery_type_id'])) {
					if (!b.mpc_delivery_type_id) {
						id = "label[for='" + 'ngm-mpc_delivery_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'mpc_delivery_type_id', reason: 'missing value' };
						if (b.mpc_delivery_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj)
					}
				}
				// console.log('complete09');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['mpc_delivery_type_id'] && b.mpc_delivery_type_id)) {
					delete b.mpc_delivery_type_id;
					delete b.mpc_delivery_type_name;
					var obj = { label: false, property: 'mpc_delivery_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 5')
				}



				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_mechanism_type_id'])) {
					// QUICK FIX HARDCODE TODO: REFACTOR
					if (!b.mpc_mechanism_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-mpc_mechanism_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'mpc_mechanism_type_id', reason: 'missing value' };
						if (b.mpc_mechanism_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete10');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['mpc_mechanism_type_id'] && b.mpc_mechanism_type_id)) {
					delete b.mpc_mechanism_type_id;
					delete b.mpc_mechanism_type_name;
					var obj = { label: false, property: 'mpc_mechanism_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 6')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_transfer_type_id'])) {
					if (!b.transfer_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-transfer_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'transfer_type_id', reason: 'missing value' };

						if (b.transfer_type_value) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete11');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['mpc_transfer_type_id'] && b.transfer_type_id)) {
					delete b.transfer_type_id;
					delete b.transfer_type_value;
					var obj = { label: false, property: 'transfer_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 7')
				}

				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['mpc_package_type_id'])) {
					if (!b.package_type_id && b.mpc_delivery_type_id !== 'in-kind') {
						id = "label[for='" + 'ngm-package_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'package_type_id', reason: 'missing value' };
						if (b.package_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete12');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['mpc_package_type_id'] && b.package_type_id)) {
					delete b.package_type_id;
					delete b.package_type_name;
					var obj = { label: false, property: 'package_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 8')
				}


				// UNIT TYPE
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['unit_type_id'])) {
					if (!b.unit_type_id) {
						id = "label[for='" + 'ngm-unit_type_id-' + i + '-' + j + "']";
						var obj = { label: id, property: 'unit_type_id', reason: 'missing value' };
						if (b.unit_type_name){
							obj.reason ='not in the list'
						}
						validation.push(obj);
					}
				}
				// console.log('complete13');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['unit_type_id'] && b.unit_type_id)) {
					delete b.unit_type_id;
					delete b.unit_type_name;
					var obj = { label: false, property: 'unit_type_id', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 9')
				}

				// UNITS
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['units'])) {
					if (b.units === null || b.units === undefined || b.units === NaN || b.units < 0 || b.units === '') {
						id = "label[for='" + 'ngm-units-' + i + '-' + j + "']";
						var obj = { label: id, property: 'units', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete14');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['units'] && b.units)) {
					delete b.units;
					var obj = { label: false, property: 'units', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 10')
				}

				// HH
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['households'])) {
					if (b.households === null || b.households === undefined || b.households === NaN || b.households < 0 || b.households === '') {
						id = "label[for='" + 'ngm-households-' + i + '-' + j + "']";
						var obj = { label: id, property: 'household', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete15');
				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['households'] && b.households)) {
					delete b.households;
					var obj = { label: false, property: 'households', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 11')
				}


				// FAMILIES
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['families'])) {
					if (b.families === null || b.families === undefined || b.families === NaN || b.families < 0 || b.families === '') {
						id = "label[for='" + 'ngm-families-' + i + '-' + j + "']";
						var obj = { label: id, property: 'families', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete16');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['families'] && b.families)) {
					delete b.families;
					var obj = { label: false, property: 'families', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 12')
				}

				// SADD
				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['boys'])) {
					if (b.boys === null || b.boys === undefined || b.boys === NaN || b.boys < 0 || b.boys === '') {
						id = "label[for='" + 'ngm-boys-' + i + '-' + j + "']";
						var obj = { label: id, property: 'boys', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete17');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['boys'] && b.boys)) {
					delete b.boys;
					var obj = { label: false, property: 'boys', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 13')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['boys_0_5'])) {
					if (b.boys_0_5 === null || b.boys_0_5 === undefined || b.boys_0_5 === NaN || b.boys_0_5 < 0 || b.boys_0_5 === '') {
						id = "label[for='" + 'ngm-boys_0_5-' + i + '-' + j + "']";
						var obj = { label: id, property: 'boys_0_5', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete18');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['boys_0_5'] && b.boys_0_5)) {
					delete b.boys_0_5;
					var obj = { label: false, property: 'boys_0_5', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 14')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['boys_6_11'])) {
					if (b.boys_6_11 === null || b.boys_6_11 === undefined || b.boys_6_11 === NaN || b.boys_6_11 < 0 || b.boys_6_11 === '') {
						id = "label[for='" + 'ngm-boys_6_11-' + i + '-' + j + "']";
						var obj = { label: id, property: 'boys_6_11', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete19');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['boys_6_11'] && b.boys_6_11)) {
					delete b.boys_6_11;
					var obj = { label: false, property: 'boys_6_11', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 15')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['boys_12_17'])) {
					if (b.boys_12_17 === null || b.boys_12_17 === undefined || b.boys_12_17 === NaN || b.boys_12_17 < 0 || b.boys_12_17 === '') {
						id = "label[for='" + 'ngm-boys_12_17-' + i + '-' + j + "']";
						var obj = { label: id, property: 'boys_12_17', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete20');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['boys_12_17'] && b.boys_12_17)) {
					delete b.boys_12_17;
					var obj = { label: false, property: 'boys_12_17', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 16')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['total_male'])) {
					if (b.total_male === null || b.total_male === undefined || b.total_male === NaN || b.total_male < 0) {
						id = "label[for='" + 'ngm-total_male-' + i + '-' + j + "']";
						var obj = { label: id, property: 'total_male', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete21');

				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['girls'])) {
					if (b.girls === null || b.girls === undefined || b.girls === NaN || b.girls < 0 || b.girls === '') {
						id = "label[for='" + 'ngm-girls-' + i + '-' + j + "']";
						var obj = { label: id, property: 'girls', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete22');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['girls'] && b.girls)) {
					delete b.girls;
					var obj = { label: false, property: 'girls', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 17')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['girls_0_5'])) {
					if (b.girls_0_5 === null || b.girls_0_5 === undefined || b.girls_0_5 === NaN || b.girls_0_5 < 0 || b.girls_0_5 === '') {
						id = "label[for='" + 'ngm-girls_0_5-' + i + '-' + j + "']";
						var obj = { label: id, property: 'girls_0_5', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete23');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['girls_0_5'] && b.girls_0_5)) {
					delete b.girls_0_5;
					var obj = { label: false, property: 'girls_0_5', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 18')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['girls_6_11'])) {
					if (b.girls_6_11 === null || b.girls_6_11 === undefined || b.girls_6_11 === NaN || b.girls_6_11 < 0 || b.girls_6_11 === '') {
						id = "label[for='" + 'ngm-girls_6_11-' + i + '-' + j + "']";
						var obj = { label: id, property: 'girls_6_11', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete24');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['girls_6_11'] && b.girls_6_11)) {
					delete b.girls_6_11;
					var obj = { label: false, property: 'girls_6_11', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 19')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['girls_12_17'])) {
					if (b.girls_12_17 === null || b.girls_12_17 === undefined || b.girls_12_17 === NaN || b.girls_12_17 < 0 || b.girls_12_17 === '') {
						id = "label[for='" + 'ngm-girls_12_17-' + i + '-' + j + "']";
						var obj = { label: id, property: 'girls_12_17', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete25');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['girls_12_17'] && b.girls_12_17)) {
					delete b.girls_12_17;
					var obj = { label: false, property: 'girls_12_17', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 20')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['total_female'])) {
					if (b.total_female === null || b.total_female === undefined || b.total_female === NaN || b.total_female < 0) {
						id = "label[for='" + 'ngm-total_female-' + i + '-' + j + "']";
						var obj = { label: id, property: 'total_female', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete26');

				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['men'])) {
					if (b.men === null || b.men === undefined || b.men === NaN || b.men < 0 || b.men === '') {
						id = "label[for='" + 'ngm-men-' + i + '-' + j + "']";
						// console.log(id);
						var obj = { label: id, property: 'men', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete27');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['men'] && b.men)) {
					delete b.men;
					var obj = { label: false, property: 'men', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 21')
				}


				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['women'])) {
					if (b.women === null || b.women === undefined || b.women === NaN || b.women < 0 || b.women === '') {
						id = "label[for='" + 'ngm-women-' + i + '-' + j + "']";
						var obj = { label: id, property: 'women', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete28');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['women'] && b.women)) {
					delete b.women;
					var obj = { label: false, property: 'women', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 22')
				}

				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['elderly_men'])) {
					if (b.elderly_men === null || b.elderly_men === undefined || b.elderly_men === NaN || b.elderly_men < 0 || b.elderly_men === '') {
						id = "label[for='" + 'ngm-elderly_men-' + i + '-' + j + "']";
						var obj = { label: id, property: 'elderly_men', reason: 'should be >=0' };
						validation.push(obj);
					}
				}
				// console.log('complete29');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['elderly_men'] && b.elderly_men)) {
					delete b.elderly_men;
					var obj = { label: false, property: 'elderly_men', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 23')
				}

				if (ngmClusterBeneficiaries.form[i] && (ngmClusterBeneficiaries.form[i][j] && ngmClusterBeneficiaries.form[i][j]['elderly_women'])) {
					if (b.elderly_women === null || b.elderly_women === undefined || b.elderly_women === NaN || b.elderly_women < 0 || b.elderly_women === '') {
						id = "label[for='" + 'ngm-elderly_women-' + i + '-' + j + "']";
						var obj = { label: id, property: 'elderly_women', reason: 'should be >=0' };
						validation.push(obj);
					}
				}

				// console.log('complete30');

				if (ngmClusterBeneficiaries.form[i] && ngmClusterBeneficiaries.form[i][j] && (!ngmClusterBeneficiaries.form[i][j]['elderly_women'] && b.elderly_women)) {
					delete b.elderly_women;
					var obj = { label: false, property: 'elderly_women', reason: 'should not be reported for the activity' };
					validation.push(obj);
					// console.log('clear field 24')
				}

				// TOTAL
				if (b.total_beneficiaries === null || b.total_beneficiaries === undefined || b.total_beneficiaries === NaN || b.total_beneficiaries < 0) {
					id = "label[for='" + 'ngm-total_beneficiaries-' + i + '-' + j + "']";
					var obj = { label: id, property: 'total_beneficiaries', reason: 'should be >=0' };
					validation.push(obj);
				}
				// console.log('complete31');


				return validation

			},
			fieldNameStock:function(){
				field = {
					 'organization_id':'Organization ID',
					 'report_id':'Report ID',
					 'organization':'Organization',
					 'username':'Username',
					 'email':'Email',
					 'admin0name':'Country',
					 'admin1pcode':'Admin1 Pcode',
					 'admin1name':'Admin1 Name',
					 'admin2pcode':'Admin2 Pcode',
					 'admin2name':'Admin2 Name',
					 'admin3pcode':'Admin3 Pcode',
					 'admin3name':'Admin3 Name',
					 'site_name':'Warehouse Name',
					 'report_month':'Stock Month',
					 'report_year':'Stock Year',
					 'cluster':'Cluster',
					 'cluster_id': 'Cluster',
					 'stock_item_name':'Stock Type',
					 'stock_item_type': 'Stock Type',
					 'stock_details':'Stock Details',
					 'stock_status_name':'Status',
					 'stock_status_id': 'Status',
					 'number_in_stock':'No. in Stock',
					 'number_in_pipeline':'No. in Pipeline',
					 'unit_type_name':'Units',
					 'unit_type_id':'Units',
					 'beneficiaries_covered':'Beneficiary Coverage',
					 'stock_targeted_groups_name':'Targeted Group',
					 'remarks':'Remarks',
					 'createdAt':'Created',
					 'updatedAt':'Last Update',
					 'location': 'Location',
					'stock_item_purpose_name': 'Purpose',
					'stock_item_purpose_id': 'Purpose',

				}

				return field;
			},
			validationStockInputFromFile:function(s,admin0pcode ){
				validation =[]
				if(!s.stock_item_type ){
					var obj = { label: false, property: 'stock_item_type', reason: 'missing value' };
					if (s.stock_item_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				}
				if(!s.unit_type_id){
					var obj = { label: false, property: 'unit_type_id', reason: 'missing value' };
					if (s.unit_type_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				} 
				if(!s.stock_status_id){
					var obj = { label: false, property: 'stock_status_id', reason: 'missing value' };
					if (s.stock_status_name) {
						obj.reason = 'not in the list'
					}
					validation.push(obj);
				}
				if(admin0pcode ==='AF'){
					console.log('s')
					if (!s.stock_item_purpose_id){
						var obj = { label: false, property: 'stock_item_purpose_id', reason: 'missing value' };
						if (s.stock_status_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}
				}
				if (admin0pcode === 'ET'){
					if (!s.stock_type_id){
						var obj = { label: false, property: 'stock_type_id', reason: 'missing value' };
						if (s.stock_type_name) {
							obj.reason = 'not in the list'
						}
						validation.push(obj);
					}

					if (s.stock_details && s.stock_details.length){
						var obj = { label: false, property: 'stock_details', reason: 'missing value' };
						details_reason = "";
						count_details_error =0;
						angular.forEach(s.stock_details, function (e) {
							if (!e.unit_type_id) {
								if(e.unit_type_name){
									details_reason += e.unit_type_name +',';
								}
								count_details_error +=1;
							}
						})
						if(count_details_error >0){
							obj.reason += details_reason;
							validation.push(obj);
						}
					}
				} 
				if (s.number_in_stock === null || s.number_in_stock === undefined || s.number_in_stock === NaN || s.number_in_stock < 0){
					var obj = { label: false, property: 'number_in_stock', reason: 'should be >=0' };
					validation.push(obj);
				}
				if (s.number_in_pipeline === null || s.number_in_pipeline === undefined || s.number_in_pipeline === NaN || s.number_in_pipeline < 0){
					var obj = { label: false, property: 'number_in_pipeline', reason: 'should be >=0' };
					validation.push(obj);
				}
				if( s.beneficiaries_covered === null || s.beneficiaries_covered === undefined || s.beneficiaries_covered === NaN || s.beneficiaries_covered < 0){
					var obj = { label: false, property: 'beneficiaries_covered', reason: 'should be >=0' };
					validation.push(obj);
				}

				return validation;
			}

		};

		// return
		return ngmClusterValidation;

	}]);
