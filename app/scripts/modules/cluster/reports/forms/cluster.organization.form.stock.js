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
    'ngmClusterLists', 'ngmLists',
    'config','$translate',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmLists, config,$translate ){

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

        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.organization.adminRpcode, admin0pcode:config.organization.admin0pcode, cluster_id: ngmUser.get().cluster_id, organization_tag:config.organization.organization_tag } ),

        // lists
        lists: {
          clusters: ngmClusterLists.getClusters( config.organization.admin0pcode ).filter(cluster=>cluster.filter!==false),
          units: ngmClusterLists.getUnits( config.organization.admin0pcode ),
          stocks: ngmLists.getObject( 'lists' ).stockItemsList,
          stock_status:[{
            admin0pcode: 'AF',
            stock_status_id: 'available',
            stock_status_name: 'Available'
          },{
            admin0pcode: 'AF',
            stock_status_id: 'reserved',
            stock_status_name: 'Reserved'
					},{
            admin0pcode: 'ET',
            stock_type_id:'stock',
            stock_type_name:'Stock',
            stock_status_id: 'safety_stock',
            stock_status_name: 'Safety Stock'
					},{
            admin0pcode: 'ET',
            stock_type_id:'stock',
            stock_type_name:'Stock',
            stock_status_id: 'in_stock',
            stock_status_name: 'In Stock'
					},{
            admin0pcode: 'ET',
            stock_type_id:'pipeline',
            stock_type_name:'Pipeline',
            stock_status_id: 'under_procurement',
            stock_status_name: 'Under Procurement'
					},{
            admin0pcode: 'ET',
            stock_type_id:'pipeline',
            stock_type_name:'Pipeline',
            stock_status_id: 'proposal_approved',
            stock_status_name: 'Proposal Approved'
					},{
              admin0pcode: 'ET',
              stock_type_id: 'pipeline',
              stock_type_name: 'Pipeline',
              stock_status_id: 'pipeline',
              stock_status_name: 'Pipeline'
					}],
					stock_item_purpose:[{
						stock_item_purpose_id: 'prepositioned',
						stock_item_purpose_name: 'Prepositioned',
					},{
						stock_item_purpose_id: 'operational',
						stock_item_purpose_name: 'Operational',
					}],
          stock_targeted_groups: ngmClusterLists.getStockTargetedGroups(),
          donors: ngmClusterLists.getDonors(config.organization.admin0pcode,''),
          organizations: ngmClusterLists.getOrganizations(config.organization.admin0pcode),
          types:[{stock_type_id:'stock',stock_type_name:'Stock'},{stock_type_id:'pipeline',stock_type_name:'Pipeline'}]
        },

        detailItem :[],
        // addDetailDisabled:false,
        addDetailDisabled: [],

        // init
        init: function(){
          $scope.report.report.stocklocations = $filter('orderBy')( $scope.report.report.stocklocations, [ 'admin1name','admin2name','admin3name','admin4name','admin5name','site_name' ]);
          // set open close details stock
          angular.forEach($scope.report.report.stocklocations,function(e,i){
            $scope.report.detailItem[i] = $scope.report.report.stocklocations[i].stocks.length ?
              new Array($scope.report.report.stocklocations[i].stocks.length).fill(false) : new Array(0).fill(false);
            $scope.report.addDetailDisabled[i] = $scope.report.report.stocklocations[i].stocks.length ?
              new Array($scope.report.report.stocklocations[i].stocks.length).fill(false) : new Array(0).fill(false);
            
              // set list for stock_details
            if ($scope.report.report.stocklocations[i].stocks.length){
              angular.forEach($scope.report.report.stocklocations[i].stocks,function(stock,j){
                if (stock.stock_details && stock.stock_details.length) {
                var list_details_item = []
                var filter = $filter('filter')($scope.report.lists.stocks, { stock_item_type: stock.stock_item_type }, true);
                if (filter[0].details) {
                  list_details_item = typeof filter[0].details === 'string' ? JSON.parse(filter[0].details) : filter[0].details;
                }     
                  angular.forEach(stock.stock_details, function (e, k) {
                    if (!$scope.report.lists.detail_list) {
                      $scope.report.lists.detail_list = []
                    }
                    if (!$scope.report.lists.detail_list[i]) {
                      $scope.report.lists.detail_list[i] = [];
                    }

                    if (!$scope.report.lists.detail_list[i][j]) {
                      $scope.report.lists.detail_list[i][j] = [];
                    }
                    if (!$scope.report.lists.detail_list[i][j][k]) {
                      $scope.report.lists.detail_list[i][j][k] = [];
                    }
                    $scope.report.lists.detail_list[i][j][k] = angular.copy(list_details_item);

                  })
                }
              })
            }

          })



				},

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
              
          if($scope.inserted.stock_details){
            $scope.inserted.stock_details=[];
          }

          $scope.report.report.stocklocations[ $parent ].stocks.push( $scope.inserted );
         
          if (!$scope.report.detailItem[$parent]) {
             $scope.report.detailItem[$parent] = [];
          }
          $scope.report.detailItem[$parent][$scope.report.report.stocklocations[$parent].stocks.length - 1] = false;
          if (!$scope.report.addDetailDisabled[$parent]){
            $scope.report.addDetailDisabled[$parent] =[]
          }
          $scope.report.addDetailDisabled[$parent][$scope.report.report.stocklocations[$parent].stocks.length - 1] = false;
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
          return selected.length ? selected[0].cluster : $filter('translate')('no_selection')+'!';
        },

        // show stock type
        showStockType: function( $data, $stock,$locationIndex,$stockIndex ){
          var selected = [];
          $stock.stock_item_type = $data;
          if($stock.stock_item_type) {
            selected = $filter('filter')( $scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);
            $stock.stock_item_name = selected[0].stock_item_name;
          }
          $scope.report.showDetail($stock, $locationIndex, $stockIndex );
          return selected.length ? selected[0].stock_item_name : $filter('translate')('no_selection')+'!';
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
          return selected.length ? selected[0].unit_type_name : $filter('translate')('no_selection')+'!';
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
          return selected.length ? selected[0].stock_status_name : $filter('translate')('no_selection')+'!';
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
          return selected.length ? selected[0].stock_item_purpose_name : $filter('translate')('no_selection')+'!';
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
        showDonor:function($data,$stock){
          selected = [];
          if (!$stock.donors) {
            $stock.donors = [{ donor_id: '' }]
          }
          // $stock.project_donor_id = $data;
          // if ($stock.project_donor_id) {
          //   selected = $filter('filter')($scope.report.lists.donors, { project_donor_id: $stock.project_donor_id }, true);
          //   if (selected.length) {
          //     $stock.project_donor_name = selected[0].project_donor_name;
          //     var obj_donor = { donor_id: $stock.project_donor_id, donor_name: $stock.project_donor_name }
          //     if (!$stock.donors){
          //       $stock.donors =[]
          //       $stock.donors.push(obj_donor);
          //     }
             
          //   }
           
          // }
          $stock.donors[0].donor_id = $data;
          if ($stock.donors[0].donor_id) {
            selected = $filter('filter')($scope.report.lists.donors, { project_donor_id: $stock.project_donor_id }, true);
            if (selected.length) {
              $stock.donors[0].donor_name = selected[0].project_donor_name;
            }
          }

          return selected.length ? selected[0].project_donor_name : '-';
        },
        showImplementingPartner: function ($data, $stock) {
          selected = [];
          if (!$stock.implementing_partners){
            $stock.implementing_partners = [{ organization_tag:''}]
          }
          // $stock.organization_tag = $data;
          
          // if ($stock.organization_tag) {
          //   selected = $filter('filter')($scope.report.lists.organizations, { organization_tag: $stock.organization_tag }, true);
          //   if (selected.length) {
          //     $stock.organization = selected[0].organization;
          //   }
          // }
          $stock.implementing_partners[0].organization_tag = $data;
          if ($stock.implementing_partners[0].organization_tag){
            selected = $filter('filter')($scope.report.lists.organizations, { organization_tag: $stock.implementing_partners[0].organization_tag }, true);
            if (selected.length) {
              $stock.implementing_partners[0].organization = selected[0].organization;
            }
          }
          return selected.length ? selected[0].organization : '-';
        },
        showTypes: function ($data, $stock){
          selected = [];
          $stock.stock_type_id = $data;
          if ($stock.stock_type_id) {
            selected = $filter('filter')($scope.report.lists.types, { stock_type_id: $stock.stock_type_id }, true);
            if (selected.length) {
              $stock.stock_type_name = selected[0].stock_type_name;
            }
          }

          return selected.length ? selected[0].stock_type_name : '-';
        },
        showDetail: function ($stock, $locationIndex, $stockIndex ){
          var detail_item = $filter('filter')($scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type},true);
          if (detail_item.length && detail_item[0].details.length){
            $scope.report.detailItem[$locationIndex][$stockIndex] = true
          }else{
            $scope.report.detailItem[$locationIndex][$stockIndex] = false
            if ($stock.stock_details){
              $stock.stock_details = [];
            }
          }

          // check if $stock.stock_details exist and the stock_item_type change set $stock.stock_details to empty array
          if ($stock.stock_details && $stock.stock_details.length > 0) {
           if($stock.stock_details[0].unit_type_id){
            var checking = $filter('filter')($scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);
            var array_checking = typeof checking[0].details === 'string' ? JSON.parse(checking[0].details) : checking[0].details;
            index = array_checking.findIndex(x => x.unit_type_id === $stock.stock_details[0].unit_type_id);
            if (index < 0) {
              $stock.stock_details = [];
            }
           }
          }
        },
        // add details
        addDetailStock: function (stock, $locationIndex, $stockIndex) {
          // add empty 
          if (!stock.stock_details) {
            stock.stock_details = [];
          }
          stock.stock_details.push({ unit_type_quantity: 0 });
          var list_details_item =[]
          var filter= $filter('filter')($scope.report.lists.stocks, { stock_item_type: stock.stock_item_type }, true);
         
          if(filter[0].details){
            list_details_item = typeof filter[0].details === 'string' ? JSON.parse(filter[0].details):filter[0].details;
          }
          angular.forEach(stock.stock_details,function(e,i){
            if(!$scope.report.lists.detail_list){
              $scope.report.lists.detail_list =[]
            }
            if (!$scope.report.lists.detail_list[$locationIndex]){
              $scope.report.lists.detail_list[$locationIndex] =[];
            }

            if (!$scope.report.lists.detail_list[$locationIndex][$stockIndex]){
              $scope.report.lists.detail_list[$locationIndex][$stockIndex] = [];
            }
            if (!$scope.report.lists.detail_list[$locationIndex][$stockIndex][i]){
              $scope.report.lists.detail_list[$locationIndex][$stockIndex][i] = [];
            }
            $scope.report.lists.detail_list[$locationIndex][$stockIndex][i] = angular.copy(list_details_item);

          })
          $scope.report.addDetailDisabled[$locationIndex][$stockIndex] = true;
        },
        selectChangeStockDetail: function (stock, search_list, detail, key, name, $locationIndex, $stockIndex){
          $scope.report.addDetailDisabled[$locationIndex][$stockIndex] = true;
           
          if(detail[key]){
            $timeout(function () {
            id = detail[key];
            obj ={};
            obj[key] = id;
            //check if already have that item
            check_duplicate = $filter('filter')(stock.stock_details, obj, true)
            if(check_duplicate.length>1){
              M.toast({ html: 'Item Already Exist', displayLength: 4000, classes: 'note' });
              detail[key] ='';
            }else{
              var filter = $filter ('filter') (search_list,obj,true);
              detail[name] = filter[0][name];
              $scope.report.addDetailDisabled[$locationIndex][$stockIndex]= false;
            }
            }, 10)
          }
        },
        removeStockDetail: function (list,stock, $locationIndex,$stockIndex,$index){
          if (stock.stock_details.length >= 1){
            stock.stock_details.splice($index, 1);
            M.toast({ html: 'Please save to commit changes!', displayLength: 4000, classes: 'note' });
            $scope.report.addDetailDisabled[$locationIndex][$stockIndex]= false;
          }
        },
        showRemark:function($stock){
          if ($stock && $stock.stock_item_type){
            var filter = $filter('filter')($scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);

            if(filter.length && filter[0].remarks){
              return true;
            }
          }
          return false;
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
          if (config.organization.admin0pcode === 'ET'){
            var detailRowDisabled = false;
            
            if ($data.stock_details && $data.stock_details.length){
              var count_error_detail =0;
              angular.forEach($data.stock_details,function(e){
                 if (!e.unit_type_id){
                   count_error_detail +=1
                 }
               })
              if (count_error_detail >0){
                detailRowDisabled = true;
              }
            }
            if (($data.implementing_partners && !$data.implementing_partners[0].organization_tag) || ($data.donors && !$data.donors[0].donor_id) || detailRowDisabled){
              disabled =true;
            }

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
					var id = $scope.report.report.stocklocations[ $parent ].stocks[$index].id;
					$scope.report.report.stocklocations[ $parent ].stocks.splice( $index, 1 );
					if (id) $scope.report.removeStockRequest(id);
				},

				// remove beneficiary
				removeStockRequest: function( id ) {
					// update
					$http({
							method: 'POST',
							url: ngmAuth.LOCATION + '/api/cluster/stock/removeStock',
							data: { id: id }
					}).success( function( result ){
						if ( result.err ) {
							// Materialize.toast( 'Error! Please correct the ROW and try again', 4000, 'error' );
							M.toast({ html: 'Error! Please correct the ROW and try again', displayLength: 4000, classes: 'error' });
						}
						if ( !result.err ) { $scope.report.save( false ); }
					}).error(function( err ) {
						// Materialize.toast( 'Error!', 4000, 'error' );
						M.toast({ html: 'Error!', displayLength: 4000, classes: 'error' });
					});
				},

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            // $( '#' + modal ).openModal( { dismissible: false } );
            $('#' + modal).modal({ dismissible: false });
            $('#' + modal).modal('open');
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
          // remove cluster id from report
          delete prev_report.cluster_id
          delete prev_report.cluster
						angular.forEach(prev_report.stocklocations, function (l, i) {
              // remove cluster from location
              delete l.cluster_id
              delete l.cluster
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
                  beneficiaries_covered: s.beneficiaries_covered,
                  stock_targeted_groups_id: s.stock_targeted_groups_id,
                  stock_targeted_groups_name: s.stock_targeted_groups_name
								};
                //donor exist
                if (s.donors.length) {
                  $scope.inserted.donors = s.donors;
                }
                //implementing partner exist
                if (s.implementing_partners.length) {
                  $scope.inserted.implementing_partners = s.implementing_partners;
                }
                 //stock details exist
                if (s.stock_details) {
                  $scope.inserted.stock_details = s.stock_details;
                }
                
								var $loc = $scope.report.report.stocklocations.find(function (l) {
									return l.stock_warehouse_id === id
								});
								if ($loc){
									var copy_report = $scope.report.report;
									$scope.inserted =
										ngmClusterHelper.getCleanStocks($scope.report.report, $loc, $scope.inserted);

									$scope.report.report.stocklocations.find(function (l) {
										return l.stock_warehouse_id === id
									}).stocks.push($scope.inserted);
								}
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
								var msg = $filter('translate')('no_data_in_previous_report'),
										typ = 'success';
							} else {
								var msg = $filter('translate')('no_previous_report'),
										typ = 'success';
							}
						} else {
								var msg = $filter('translate')('copied')+' ' + nrows + ' '+$filter('translate')('rows'),
										typ = 'success';
						}
            // Materialize.toast(msg, 6000, typ);
            M.toast({ html: msg, displayLength: 6000, classes: typ });
					}).catch(function (e) {
            // Materialize.toast($filter('translate')('error_not_copied'), 6000, 'error');
            M.toast({ html: $filter('translate')('error_not_copied'), displayLength: 6000, classes: 'error' });
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
          // Materialize.toast( $filter('translate')('processing_stock_report') , 6000, 'note');
          M.toast({ html: $filter('translate')('processing_stock_report'), displayLength: 6000, classes: 'note' });

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
            var msg = $filter('translate')('stock_report_for')+' ' + $scope.report.monthlyTitleFormat + ' ';
                msg += complete ? $filter('translate')('submitted')+'!' : $filter('translate')('saved_mayus1')+'!';

            // msg
            // Materialize.toast( msg , 6000, 'success');
            M.toast({ html: msg, displayLength: 6000, classes: 'success' });
            // $('.modal-trigger').leanModal();
            $('.modal-trigger').modal();

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

