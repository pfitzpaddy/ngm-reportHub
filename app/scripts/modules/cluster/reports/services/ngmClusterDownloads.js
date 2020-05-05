/**
 * @name ngmReportHub.factory:ngmClusterDownloads
 * @description
 * # ngmClusterDownloads
 * Manages client downloads
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterDownloads', [ '$http', '$location', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists',
							function( $http, $location, $filter, $timeout, ngmAuth, ngmClusterLists ) {

		var ngmClusterDownloads = {

			downloadPopulationsLists: function( project, start_date, end_date ) {

				let lists = ngmClusterLists.setLists( project, start_date, end_date, 10 );

				// XLSX processing
				const workbook = new ExcelJS.Workbook();

				let worksheetPopulationGroups = workbook.addWorksheet('Beneficiary Types');
				let worksheetHrpPopulationGroups = workbook.addWorksheet('HRP Beneficiary Types');
				let worksheetCategories = workbook.addWorksheet('Beneficiary Categories');
				let worksheetPopulation = workbook.addWorksheet('Population');

				// xlsx headers
				const boldHeader = sheet => sheet.getRow(1).font = { bold: true };

				worksheetPopulationGroups.columns = [
					{ header: 'Year', key: 'year', width: 10 },
					{ header: 'Cluster', key: 'cluster', width: 20 },
					{ header: 'Beneficiary Type', key: 'beneficiary_type_name', width: 60 }
				];
				boldHeader(worksheetPopulationGroups);

				worksheetHrpPopulationGroups.columns = [
					{ header: 'Year', key: 'year', width: 10 },
					{ header: 'Cluster', key: 'cluster', width: 20 },
					{ header: 'Beneficiary Type', key: 'hrp_beneficiary_type_name', width: 60 }
				];
				boldHeader(worksheetHrpPopulationGroups);

				worksheetCategories.columns = [
					{ header: 'Beneficiary Category', key: 'beneficiary_category_name', width: 20 }
				];
				boldHeader(worksheetCategories);

				worksheetPopulation.columns = [
					{ header: 'Population', key: 'delivery_type_name', width: 20 }
				];
				boldHeader(worksheetPopulation);

				// add rows

				// transform array of cluster_ids to comma separated clusters
				let beneficiary_types = lists.beneficiary_types.map(function (b) {
					cluster = b.cluster_id.map(function (cid) {
						cluster = lists.clusters.filter(c => c.cluster_id === cid)[0];
						if (cluster) return cluster.cluster;
						return false;
					}).filter(c => c).sort().join(', ');
					beneficiary_type_name = b.beneficiary_type_name;
					year = b.year ? b.year : "";
					return {
						year,
						cluster,
						beneficiary_type_name
					};
				});

				// transform array of cluster_ids to comma separated clusters
				let hrp_beneficiary_types = lists.hrp_beneficiary_types.map(function (b) {
					cluster = b.cluster_id.map(function (cid) {
						cluster = lists.clusters.filter(c => c.cluster_id === cid)[0];
						if (cluster) return cluster.cluster;
						return false;
					}).filter(c => c).sort().join(', ');
					hrp_beneficiary_type_name = b.hrp_beneficiary_type_name;
					year = b.year ? b.year : "";
					return {
						year,
						cluster,
						hrp_beneficiary_type_name,
					};
				});

				worksheetPopulationGroups.addRows(beneficiary_types);
				worksheetHrpPopulationGroups.addRows(hrp_beneficiary_types);
				worksheetCategories.addRows(lists.beneficiary_categories);
				worksheetPopulation.addRows(lists.delivery_types);

				// return buffer
				return workbook.xlsx.writeBuffer();

			},

			downloadProjectPlan: function( project ) {

				let project_copy = angular.copy( project );

				// XLSX processing
				const workbook = new ExcelJS.Workbook();

				let worksheetProjectDetails = workbook.addWorksheet('Project Details');
				let worksheetActivityTypes = workbook.addWorksheet('Activity Types');
				let worksheetTargetBeneficiaries = workbook.addWorksheet('Target Beneficiaries');
				let worksheetTargetLocations = workbook.addWorksheet('Target Locations');

				// xlsx headers
				const boldHeader = sheet => sheet.getRow(1).font = { bold: true };

				worksheetProjectDetails.columns = [
					{ header: 'Project ID', key: 'id', width: 10 },
					{ header: 'Project Status', key: 'project_status', width: 20 },
					{ header: 'Project Details', key: 'project_details', width: 20 },
					{ header: 'Focal Point', key: 'name', width: 20 },
					{ header: 'Email', key: 'email', width: 20 },
					{ header: 'Phone', key: 'phone', width: 20 },
					{ header: 'Project Title', key: 'project_title', width: 20 },
					{ header: 'Project Description', key: 'project_description', width: 20 },
					{ header: 'HRP Project Code', key: 'project_hrp_code', width: 20 },
					{ header: 'Project Start Date', key: 'project_start_date', width: 20 },
					{ header: 'Project Start Date', key: 'project_end_date', width: 20 },
					{ header: 'Project Budget', key: 'project_budget', width: 20 },
					{ header: 'Project Budget Currency', key: 'project_budget_currency', width: 20 },
					{ header: 'Project Donors', key: 'project_donor', width: 20 },
					{ header: 'Implementing Partners', key: 'implementing_partners', width: 50 },
					{ header: 'URL', key: 'url', width: 50 },
				];
				boldHeader(worksheetProjectDetails);

				worksheetActivityTypes.columns = [
					{ header: 'Cluster', key: 'cluster', width: 10 },
					{ header: 'Activity Type', key: 'activity_type_name', width: 50 }
				];
				boldHeader(worksheetActivityTypes);

				worksheetTargetBeneficiaries.columns = [
					{ header: 'Cluster', key: 'cluster', width: 10 },
					{ header: 'Activity Type', key: 'activity_type_name', width: 30 },
					{ header: 'Activity Description', key: 'activity_description_name', width: 30 },
					{ header: 'Activity Details', key: 'activity_detail_name', width: 30 },
					{ header: 'Indicator', key: 'indicator_name', width: 60 },
					{ header: 'Beneficiary Type', key: 'beneficiary_type_name', width: 50 },
					{ header: 'HRP Beneficiary Type', key: 'hrp_beneficiary_type_name', width: 50 },
					{ header: 'Beneficiary Category', key: 'beneficiary_category_name', width: 50 },
					{ header: 'Amount', key: 'units', width: 20 },
					{ header: 'Unit Types', key: 'unit_type_name', width: 20 },
					{ header: 'Cash Transfers', key: 'transfer_type_value', width: 20 },
					{ header: 'Cash Delivery Types', key: 'mpc_delivery_type_name', width: 20 },
					{ header: 'Cash Mechanism Types', key: 'mpc_mechanism_type_name', width: 20 },
					{ header: 'Package Type', key: 'package_type_name', width: 20 },
					{ header: 'Households', key: 'households', width: 20 },
					{ header: 'Families', key: 'families', width: 20 },
					{ header: 'Boys', key: 'boys', width: 20 },
					{ header: 'Girls', key: 'girls', width: 20 },
					{ header: 'Men', key: 'men', width: 20 },
					{ header: 'Women', key: 'women', width: 20 },
					{ header: 'Elderly Men', key: 'elderly_men', width: 20 },
					{ header: 'Elderly Women', key: 'elderly_women', width: 20 },
					{ header: 'Total', key: 'total_beneficiaries', width: 20 },
				];
				boldHeader(worksheetTargetBeneficiaries);

				worksheetTargetLocations.columns = [
					{ header: 'Country', key: 'admin0name', width: 20 },
					{ header: 'Admin1 Pcode', key: 'admin1pcode', width: 20 },
					{ header: 'Admin1 Name', key: 'admin1name', width: 20 },
					{ header: 'Admin2 Pcode', key: 'admin2pcode', width: 20 },
					{ header: 'Admin2 Name', key: 'admin2name', width: 20 },
					{ header: 'Admin3 Pcode', key: 'admin3pcode', width: 20 },
					{ header: 'Admin3 Name', key: 'admin3name', width: 20 },
					{ header: 'Site Implementation', key: 'site_implementation_name', width: 20 },
					{ header: 'Site Type', key: 'site_type_name', width: 20 },
					{ header: 'Location Name', key: 'site_name', width: 20 },
					{ header: 'Implementing Partners', key: 'implementing_partners', width: 30 },
					{ header: 'Reporter', key: 'username', width: 30 },
				];
				boldHeader(worksheetTargetLocations);

				// add rows

				project_copy.project_start_date = moment(project_copy.project_start_date).format( 'YYYY-MM-DD' );
				project_copy.project_end_date = moment(project_copy.project_end_date).format( 'YYYY-MM-DD' );

				propToString = (array, prop) => Array.isArray(array) && array.map(d => d[prop]).filter(e => e).sort().join(', ') || "";

				project_copy.project_details = propToString(project_copy.project_details, 'project_detail_name');
				project_copy.project_donor = propToString(project_copy.project_donor, 'project_donor_name');
				project_copy.implementing_partners = propToString(project_copy.implementing_partners, 'organization');
				project_copy.programme_partners = propToString(project_copy.programme_partners, 'organization');

				Array.isArray(project_copy.target_locations) && project_copy.target_locations.forEach(function (tl) {
					tl.implementing_partners = propToString(tl.implementing_partners, 'organization');
				});

				project_copy.url = $location.absUrl();

				worksheetProjectDetails.addRow(project_copy);
				worksheetActivityTypes.addRows(project_copy.activity_type);
				worksheetTargetBeneficiaries.addRows(project_copy.target_beneficiaries);
				worksheetTargetLocations.addRows(project_copy.target_locations);

				// return buffer
				return workbook.xlsx.writeBuffer();

			},

			downloadStockLists: function(admin0pcode, warehouses) {

				let lists = ngmClusterLists.getStockLists(admin0pcode);

				// XLSX processing
				const workbook = new ExcelJS.Workbook();

				let worksheetStockItems = workbook.addWorksheet('Stock Items');
				let worksheetLocations = workbook.addWorksheet('Locations');
				let worksheetUnits = workbook.addWorksheet('Units');
				let worksheetStatus = workbook.addWorksheet('Status');
				let worksheetPurpose = workbook.addWorksheet('Purpose');
				let worksheetPopulationGroups = workbook.addWorksheet('Targeted Groups');

				// xlsx headers
				const boldHeader = sheet => sheet.getRow(1).font = { bold: true };

				worksheetStockItems.columns = [
					{ header: 'Cluster', key: 'cluster', width: 10 },
					{ header: 'Stock Type', key: 'stock_item_name', width: 30 },
					{ header: 'Details', key: 'details', width: 30 }
				];
				boldHeader(worksheetStockItems);

				worksheetLocations.columns = [
					{ header: 'Country', key: 'admin0name', width: 30 },
					{ header: 'Admin1 Pcode', key: 'admin1pcode', width: 30 },
					{ header: 'Admin1 Name', key: 'admin1name', width: 30 },
					{ header: 'Admin2 Pcode', key: 'admin2pcode', width: 30 },
					{ header: 'Admin2 Name', key: 'admin2name', width: 30 },
					{ header: 'Admin3 Pcode', key: 'admin3pcode', width: 30 },
					{ header: 'Admin3 Name', key: 'admin3name', width: 30 },
					{ header: 'Location Name', key: 'site_name', width: 30 }
				];
				boldHeader(worksheetLocations);

				worksheetUnits.columns = [
					{ header: 'Units', key: 'unit_type_name', width: 10 }
				];
				boldHeader(worksheetUnits);

				worksheetStatus.columns = [
					{ header: 'Type', key: 'stock_type_name', width: 10 },
					{ header: 'Status', key: 'stock_status_name', width: 10 }
				];
				boldHeader(worksheetStatus);

				worksheetPurpose.columns = [
					{ header: 'Purpose', key: 'stock_item_purpose_name', width: 10 }
				];
				boldHeader(worksheetPurpose);

				worksheetPopulationGroups.columns = [
					{ header: 'Targeted Group', key: 'stock_targeted_groups_name', width: 10 }
				];
				boldHeader(worksheetPopulationGroups);

				// add rows
				worksheetStockItems.addRows(lists.stocks);

				let locations = warehouses ? warehouses : [];

				worksheetLocations.addRows(locations);
				worksheetUnits.addRows(lists.units);
				worksheetStatus.addRows(lists.stock_status);
				worksheetPurpose.addRows(lists.stock_item_purpose);
				worksheetPopulationGroups.addRows(lists.stock_targeted_groups);

				// return buffer
				return workbook.xlsx.writeBuffer();

			},
		}

		// return
		return ngmClusterDownloads;

	}]);
