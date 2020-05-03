/**
 * @name ngmReportHub.factory:ngmClusterDownloads
 * @description
 * # ngmClusterDownloads
 * Manages client downloads
 *
 */
angular.module( 'ngmReportHub' )
	.factory( 'ngmClusterDownloads', [ '$http', '$filter', '$timeout', 'ngmAuth', 'ngmClusterLists',
							function( $http, $filter, $timeout, ngmAuth, ngmClusterLists ) {

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
