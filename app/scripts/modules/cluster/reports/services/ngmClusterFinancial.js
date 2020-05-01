angular.module('ngmReportHub')
	.factory('ngmClusterFinancial', ['$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists', 'ngmClusterDetails', 'ngmClusterHelperNgWash',
		function ($http, $filter, $timeout, ngmAuth, ngmClusterLists, ngmClusterDetails, ngmClusterHelperNgWash) {

			// beneficairies
			var ngmClusterFinancial = {

				inputChange: function (label) {
					$("label[for='" + label + "']").removeClass('error').addClass('active');
				},
				updateName: function (list, key, name, budget,project) {
					// this approach does NOT break gulp!
					$timeout(function () {
						var obj = {}
						obj[key] = budget[key];
						var select = $filter('filter')(list, obj, true);

						// set name
						if (select.length) {
							// name
							budget[name] = select[0][name];
						}
						if (key === 'activity_type_id'){
							budget.cluster = select[0].cluster;
							budget.cluster_id = select[0].cluster_id;
							project.lists.activity_descriptions2 = $filter('filter')(project.lists.activity_descriptions, { activity_type_id: budget[key] }, true);
						}
					}, 10);
				},
				updateNumber:function(key,budget){
					$timeout(function () {
						budget[key] = budget[key];					
						console.log(budget);
					}, 10);
				},
				updateText: function (key, budget) {
					$timeout(function () {
						budget[key] = budget[key];

					}, 10);
				},
				// validate Financial Form budget
				validateBudgets: function (budget, detail) {
					var elements = [];
					var notDetailOpen = [];
					budgetRow = 0;
					budgetRowComplete = 0;
					angular.forEach(budget, function (b, i) {
						budgetRow++;
						result = ngmClusterFinancial.validateBudget(b, i, detail);
						angular.merge(elements, result.divs);

						if (!result.open && result.count === 0) {
							notDetailOpen.push(result.index)
						}
						budgetRowComplete += result.count;
					});
					if (budgetRow !== budgetRowComplete && notDetailOpen.length > 0) {
						// openall
						angular.forEach(notDetailOpen, function (indexbeneficiaries) {
							b = indexbeneficiaries.budgetIndex;
							detail[b] = true;
						})

						$timeout(function () {
							angular.forEach(notDetailOpen, function (indexbeneficiaries) {
								y = indexbeneficiaries.budgetIndex;
								resultRelabel = ngmClusterFinancial.validateBudget(budget[y], y, detail);
							});

							// Materialize.toast($filter('translate')('beneficiaries_contains_errors'), 4000, 'error');
							M.toast({ html: $filter('translate')('beneficiaries_contains_errors'), displayLength: 4000, classes: 'error' });
							$timeout(function () { $(elements[0]).animatescroll() }, 100);
						}, 200);
						return false
					}

					if (budgetRow !== budgetRowComplete && notDetailOpen.length < 1) {
						// Materialize.toast($filter('translate')('Form_contains_errors'), 4000, 'error');
						M.toast({ html: $filter('translate')('Form_contains_errors'), displayLength: 4000, classes: 'error' });
						$(elements[0]).animatescroll();
						return false;
					} else {
						return true;
					}
				},
				validateBudget: function (b, i, d) {
					var id;
					var complete = true;
					var validation = { count: 0, divs: [] };

					if (!b.project_donor_id) {
						id = "label[for='" + 'ngm-project_donor_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete01');
					console.log(complete);
					if (!b.activity_type_id) {
						id = "label[for='" + 'ngm-activity_type_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete02');
					console.log(complete);
					console.log(b.project_budget_amount_recieved)
					// AMOUNT
					if (b.project_budget_amount_recieved<0) {
						id = "label[for='" + 'ngm-project_budget_amount_recieved-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete03');
					console.log(complete);
					// currency
					if (!b.currency_id) {
						id = "label[for='" + 'ngm-currency_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete04');

					console.log(complete);
					if (!b.project_budget_date_recieved) {
						id = "label[for='" + 'ngm-project_budget_date_recieved' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete05');
					console.log(complete);

					// AMOUNT
					if (!b.budget_funds_id) {
						id = "label[for='" + 'ngm-budget_funds_id-' + i + "']";
						$(id).addClass('error');
						validation.divs.push(id);
						complete = false;
					}
					console.log('complete06');
					console.log(complete);

					if (d[i]) {
						validation.open = true;
						validation.index = {};
						validation.index.budgetIndex = i;
					} else {
						validation.open = false;
						validation.index = {};
						validation.index.budgetIndex = i;
					}
					if (complete) {
						validation.count = 1;
					}
					console.log(validation)
					return validation;
				},
				validateBudgetFromFile: function(b,i,d){
					validation =[];
					if (!b.project_donor_id) {
						id = "label[for='" + 'ngm-project_donor_id-' + i + "']";
						var obj = { label: id, property: 'project_donor_id', reason: 'missing value' };
						validation.push(obj);
						
					}
					if (!b.activity_type_id) {
						id = "label[for='" + 'ngm-activity_type_id-' + i + "']";
						var obj = { label: id, property: 'activity_type_id', reason: 'missing value' };
						validation.push(obj);
						
						
					}
					
					// AMOUNT
					if (b.project_budget_amount_recieved < 0) {
						id = "label[for='" + 'ngm-project_budget_amount_recieved-' + i + "']";
						var obj = { label: id, property: 'project_budget_amount_recieved', reason: ' should >=0' };
						validation.push(obj);
						
						
					}
										
					// currency
					if (!b.currency_id) {
						id = "label[for='" + 'ngm-currency_id-' + i + "']";
						var obj = { label: id, property: 'currency_id', reason: 'missing value' };
						validation.push(obj);
						
						
					}
										
					if (!b.project_budget_date_recieved) {
						id = "label[for='" + 'ngm-project_budget_date_recieved' + i + "']";
						var obj = { label: id, property: 'project_budget_date_recieved', reason: 'missing value' };
						validation.push(obj);
						
						
					}
					
					// AMOUNT
					if (!b.budget_funds_id) {
						id = "label[for='" + 'ngm-budget_funds_id-' + i + "']";
						var obj = { label: id, property: 'budget_funds_id', reason: 'missing value' };
						validation.push(obj);
					}

					if (b.budget_funds_id && b.budget_funds_id === 'financial'){
						if (!b.financial_programming_id){
							id = "label[for='" + 'ngm-financial_programming_id-' + i + "']";
							var obj = { label: id, property: 'financial_programming_id', reason: 'missing value' };
							validation.push(obj);
							
						}
					}

					return validation 
					
					

				},
				fieldBudget:function(){
					field =  {
						'cluster':'Cluster',
						'organization':'Organization',
						'admin0name':'Country',
						'project_title':'Project Title',
						'project_description':'Project Description',
						'project_hrp_code':'HRP Project Code',
						'project_budget':'Project Budget',
						'project_budget_currency':'Project Budget Currency',
						'project_donor_name':'Project Donor',
						'project_donor_id': 'Project Donor',
						'grant_id':'Donor Grant ID',
						'currency_id':'Currency Recieved',
						'project_budget_amount_recieved':'Ammount Received',
						'contribution_status':'Contribution Status',
						'project_budget_date_recieved':'Date of Payment',
						'budget_funds_name':'Incoming Funds',
						'budget_funds_id': 'Incoming Funds',
						'financial_programming_name':'Financial Programming',
						'financial_programming_id': 'Financial Programming',
						'multi_year_funding_name':'Multi-Year Funding',
						'multi_year_funding_id': 'Multi-Year Funding',
						'multi_year_array':'Funding Per Year',
						'reported_on_fts_name':'Reported on FTS',
						'reported_on_fts_id': 'Reported on FTS',
						'fts_record_id':'FTS ID',
						'email':'Email',
						'createdAt':'createdAt',
						'comments':'Comments',
						'activity_type_name':'Activity Type',
						'activity_type_id': 'Activity Type',
						'multi_year_array': 'Funding Per Year',
						'activity_description_name': 'Activity Description',
						'activity_description_id': 'Activity Description',
					}
					return field
				}

				

			};

			// return
			return ngmClusterFinancial;

		}]);