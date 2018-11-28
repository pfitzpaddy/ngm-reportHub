/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStockForm
 * @description
 * # ClusterOrganizationStockForm
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stock', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stock', {
        title: 'Cluster Stock Reports Form',
        description: 'Cluster Stock Reports Form',
        controller: 'ClusterOrganizationStockForm',
        templateUrl: '/scripts/modules/cluster/views/forms/stock/form.html'
      });
  })
  .controller( 'ClusterOrganizationStockForm', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmAuth',
    'ngmData',
    'ngmClusterHelper',
    'ngmClusterLists',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, config ){

      // project
      $scope.report = {

        // user
        user: ngmUser.get(),
        // app style
        style: config.style,
        // form
        submit: true,
        // project
        organization: config.organization,
        // report
        report: config.report,
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        // last update
        monthlyTitleFormat: moment.utc( [ config.report.report_year, config.report.report_month, 1 ] ).format('MMMM, YYYY'),

        templatesUrl: '/scripts/modules/cluster/views/forms/stock/',
        locationsUrl: 'locations.html',
        stocksUrl: 'stocks.html',
        stockUrl: 'stock.html',
        notesUrl: 'notes.html',

        // lists
        lists: {
          clusters: ngmClusterLists.getClusters( config.organization.admin0pcode ),
          units: ngmClusterLists.getUnits( config.organization.admin0pcode ),
          stocks: localStorage.getObject( 'lists' ).stockItemsList,
          stock_status:[{
            stock_status_id: 'available',
            stock_status_name: 'Available'
          },{
            stock_status_id: 'reserved',
            stock_status_name: 'Reserved'
					}],
					stock_item_purpose:[{
						stock_item_purpose_id: 'prepositioned',
						stock_item_purpose_name: 'Prepositioned',
					},{
						stock_item_purpose_id: 'operational',
						stock_item_purpose_name: 'Operational',
					}],
					stock_targeted_groups: ngmClusterLists.getStockTargetedGroups()
        },

        // init
        init: function(){},

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            var href = '/cluster/stocks';
            if ( $scope.report.user.roles.indexOf('ADMIN') !== -1 ) { href += '/' + $scope.report.organization.id }
            $location.path( href );
          }, 200);
        },

        // add stock
        addStock: function( $parent ) {
          $scope.inserted = {
            stock_item_type: null,
            stock_item_name: null,
            unit_type_id: null,
            unit_type_name: null,
						number_in_stock:0, number_in_pipeline:0, beneficiaries_covered:0,
						stock_targeted_groups_id: null,
						stock_targeted_groups_name: null,

						
          };
          // process + clean location
          $scope.inserted =
							ngmClusterHelper.getCleanStocks( $scope.report.report, $scope.report.report.stocklocations[ $parent ], $scope.inserted );
				
          $scope.report.report.stocklocations[ $parent ].stocks.push( $scope.inserted );
        },

				// remove from array if no id
        cancelEdit: function( $parent, $index ) {
						if ( !$scope.report.report.stocklocations[ $parent ].stocks[ $index ].id ) {
							$scope.report.report.stocklocations[ $parent ].stocks.splice( $index, 1 );
						}
				},

        // cluster
        showStockCluster: function( $data, $stock ){
          var selected = [];
          $stock.cluster_id = $data;
          if($stock.cluster_id) {
            selected = $filter('filter')( $scope.report.lists.clusters, { cluster_id: $stock.cluster_id }, true);
            $stock.cluster = selected[0].cluster;
          }
          return selected.length ? selected[0].cluster : 'No Selection!';
        },

        // show stock type
        showStockType: function( $data, $stock ){
          var selected = [];
          $stock.stock_item_type = $data;
          if($stock.stock_item_type) {
            selected = $filter('filter')( $scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);
            $stock.stock_item_name = selected[0].stock_item_name;
          }
          return selected.length ? selected[0].stock_item_name : 'No Selection!';
        },

        showStockUnits: function( $data, $stock ){
          var selected = [];
          $stock.unit_type_id = $data;
          if( $stock.unit_type_id ) {
            selected = $filter('filter')( $scope.report.lists.units, { unit_type_id: $stock.unit_type_id }, true );
            if ( selected.length ){
              $stock.unit_type_name = selected[0].unit_type_name;
            }
          }
          return selected.length ? selected[0].unit_type_name : 'No Selection!';
        },

        showStockStatus: function( $data, $stock ){
          var selected = [];
          $stock.stock_status_id = $data;
          if( $stock.stock_status_id ) {
            selected = $filter('filter')( $scope.report.lists.stock_status, { stock_status_id: $stock.stock_status_id }, true );
            if ( selected.length ){
              $stock.stock_status_name = selected[0].stock_status_name;
            }
          }
          return selected.length ? selected[0].stock_status_name : 'No Selection!';
				},

				showStockPurpose: function( $data, $stock ){
          var selected = [];
          $stock.stock_item_purpose_id = $data;
          if( $stock.stock_item_purpose_id ) {
            selected = $filter('filter')( $scope.report.lists.stock_item_purpose, { stock_item_purpose_id: $stock.stock_item_purpose_id }, true );
            if ( selected.length ){
              $stock.stock_item_purpose_name = selected[0].stock_item_purpose_name;
            }
          }
          return selected.length ? selected[0].stock_item_purpose_name : 'No Selection!';
				},
				showStockTargetedGroup: function($data,$stock){
					selected = [];
					$stock.stock_targeted_groups_id =$data;
					if ($stock.stock_targeted_groups_id){
						selected = $filter('filter')($scope.report.lists.stock_targeted_groups, { stock_targeted_groups_id: $stock.stock_targeted_groups_id},true);
						if(selected.length){
							$stock.stock_targeted_groups_name = selected[0].stock_targeted_groups_name;
						}
					}
					return selected.length ? selected[0].stock_targeted_groups_name : '-';
				},

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.report.report.stocklocations[$parent].stocks[ $index ][ indicator ] = $data;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.stock_item_type &&
                $data.unit_type_id &&
                $data.stock_status_id &&
                $data.number_in_stock >= 0 && $data.number_in_pipeline >= 0 && $data.beneficiaries_covered >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // save form on enter
        keydownSaveForm: function(){
          setTimeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // remove stocks
        removeStock: function( $parent, $index ) {
          $scope.report.report.stocklocations[ $parent ].stocks.splice( $index, 1 );
					// save
          $scope.report.save( false );
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.report.cancel();
          }

        },

        // determine if all locations containt at least one beneficiaries details
        formComplete: function() {
          var valid = true;
          angular.forEach( $scope.report.report.stocklocations, function( l ){
            angular.forEach( l.stocks, function( b ){
              if ( $scope.report.rowSaveDisabled( b ) ) {
                valid = false;
              }
            });
          });
          return valid;
        },

        // enable edit report
        editReport: function(){
          $scope.report.report.report_status = 'todo';
          $scope.report.save( false, false );
				},

				// process adding previous stock report data
				addPrevStocks: function (prev_report) {

						angular.forEach(prev_report.stocklocations, function (l, i) {
							var id = l.stock_warehouse_id;

							// uncoment if rewriting all data, comment if adding rows every time on copy
							// $scope.report.report.stocklocations
							// 			.find(function (e) {return e.stock_warehouse_id === id}).stocks = [];

							angular.forEach(l.stocks, function (s, ri) {
								$scope.inserted = {
									cluster_id: s.cluster_id,
									stock_item_type: s.stock_item_type,
									stock_item_name: s.stock_item_name,
									stock_item_purpose_id: s.stock_item_name,
									stock_item_purpose_name: s.stock_item_purpose_name,
									stock_status_id: s.stock_status_id,
									stock_status_name: s.stock_status_name,
									unit_type_id: s.unit_type_id,
									unit_type_name: s.unit_type_name,
									number_in_stock: s.number_in_stock,
									number_in_pipeline: s.number_in_pipeline,
									beneficiaries_covered: s.beneficiaries_covered
								};
								var $loc = $scope.report.report.stocklocations.find(function (l) {
									return l.stock_warehouse_id === id
								});
								var copy_report = $scope.report.report;
								$scope.inserted =
									ngmClusterHelper.getCleanStocks($scope.report.report, $loc, $scope.inserted);

								$scope.report.report.stocklocations.find(function (l) {
									return l.stock_warehouse_id === id
								}).stocks.push($scope.inserted);
							});
						});
				},

				// entry copy previous report
				copyPrevReport: function () {

					var getPrevReport = {
						method: 'POST',
						url: ngmAuth.LOCATION + '/api/cluster/stock/getReport',
						data: {
							id: $route.current.params.report_id,
							previous: true
						}
					}

					ngmData.get(getPrevReport).then(function (prev_report) {

						$scope.report.addPrevStocks(prev_report);

						// toast msg n of copied rows
						var nrows = 0
						angular.forEach(prev_report.stocklocations, function (l) {
							nrows += l.stocks.length
						})
						if (!nrows) {
							if (Object.keys(prev_report).length) {
								var msg = 'No data in previous report',
										typ = 'success';
							} else {
								var msg = 'No previous report',
										typ = 'success';
							}
						} else {
								var msg = 'Copied ' + nrows + ' rows',
										typ = 'success';
						}
						Materialize.toast(msg, 3000, typ);
					}).catch(function (e) {
						Materialize.toast('Error, Not copied', 3000, 'error');
					});

				},



        // save
        save: function( complete, display_modal ) {

          // disable btn
          $scope.report.submit = false;

          // set to complete if "submit monthly report"
          $scope.report.report.report_status = complete ? 'complete' : 'todo';

          // time submitted
          $scope.report.report.report_submitted = moment().format();

          // msg
					Materialize.toast( 'Processing Stock Report...' , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/stock/setReport',
            data: {
              report: $scope.report.report
            }
          }

          // set report
          ngmData.get( setReportRequest ).then( function( report ){

            // enable
            $scope.report.submit = true;
						$scope.report.report = report;

            // report
            $scope.report.updatedAt = moment( report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );

            // user msg
            var msg = 'Stock Report for  ' + $scope.report.titleFormat + ' ';
                msg += complete ? 'Submitted!' : 'Saved!';

            // msg
            Materialize.toast( msg , 3000, 'success');
						$('.modal-trigger').leanModal();

            // Re-direct to summary
            if ( $scope.report.report.report_status !== 'complete' ) {
              if(display_modal){
                // update
                $timeout(function() {
                  // Re-direct to summary
                  $location.path( '/cluster/stocks/');
                }, 200);
              } else {
                $timeout(function() {
                  // $route.reload();
                }, 200);
              }
            } else {
              $timeout(function() {
                $location.path( '/cluster/stocks');
              }), 200;
            }

          });

        }
      }

			$scope.report.init();

  }

]);

