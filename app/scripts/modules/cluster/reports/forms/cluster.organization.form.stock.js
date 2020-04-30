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
    'ngmClusterValidation',
    'config','$translate',
    function ($scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmAuth, ngmData, ngmClusterHelper, ngmClusterLists, ngmLists, ngmClusterValidation, config,$translate ){
      $scope.messageFromfile = [];
      $scope.inputString = false;
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

        text_input: '',
        messageWarning: '',

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
        addStockFromFile: function ($parent, stock,$indexFile){
         var insert = {
            stock_item_type: null,
            stock_item_name: null,
            unit_type_id: null,
            unit_type_name: null,
            number_in_stock: 0, number_in_pipeline: 0, beneficiaries_covered: 0,
            stock_targeted_groups_id: null,
            stock_targeted_groups_name: null
          };
          stock_default = ngmClusterHelper.getCleanStocks($scope.report.report, $scope.report.report.stocklocations[$parent], insert);
          // merge
          stock = angular.merge({}, stock_default, stock);
          $scope.report.report.stocklocations[$parent].stocks.push(stock);
          if (!$scope.report.detailItem[$parent]) {
            $scope.report.detailItem[$parent] = [];
          }
          $scope.report.detailItem[$parent][$scope.report.report.stocklocations[$parent].stocks.length - 1] = false;
          if (!$scope.report.addDetailDisabled[$parent]) {
            $scope.report.addDetailDisabled[$parent] = []
          }
          $scope.report.addDetailDisabled[$parent][$scope.report.report.stocklocations[$parent].stocks.length - 1] = false;

          // For stock details
          var stock_index = $scope.report.report.stocklocations[$parent].stocks.length - 1;
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
                  if (!$scope.report.lists.detail_list[$parent]) {
                    $scope.report.lists.detail_list[$parent] = [];
                  }

                  if (!$scope.report.lists.detail_list[$parent][stock_index]) {
                    $scope.report.lists.detail_list[$parent][stock_index] = [];
                  }
                  if (!$scope.report.lists.detail_list[$parent][stock_index][k]) {
                    $scope.report.lists.detail_list[$parent][stock_index][k] = [];
                  }
                  $scope.report.lists.detail_list[$parent][stock_index][k] = angular.copy(list_details_item);
                   if(e.unit_type_name){
                     selected = $filter('filter')($scope.report.lists.detail_list[$parent][stock_index][k], { unit_type_name : e.unit_type_name});
                     if(selected.length){
                       e.unit_type_id = selected[0].unit_type_id;
                     }
                   }

                })
              }
          $scope.messageFromfile[$indexFile] = ngmClusterValidation.validationStockInputFromFile(stock, $scope.report.organization.admin0pcode);
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
                if (s.donors && s.donors.length) {
                  $scope.inserted.donors = s.donors;
                }
                //implementing partner exist
                if (s.implementing_partners && s.implementing_partners.length) {
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



        // import file function
        uploadFileReport: {
          openModal: function (modal) {
            // $('#' + modal).openModal({ dismissible: false });
            $('#' + modal).modal({ dismissible: false });
            $('#' + modal).modal('open');
          },
          closeModal: function (modal) {
            drop_zone.removeAllFiles(true);
            M.toast({ html: $filter('translate')('cancel_to_upload_file'), displayLength: 2000, classes: 'note' });
          },
          obj_header: {
            'Organization ID': 'organization_id',
            'Report ID': 'report_id',
            'Organization': 'organization',
            'Username': 'username',
            'Email': 'email',
            'Country': 'admin0name',
            'Admin1 Pcode': 'admin1pcode',
            'Admin1 Name': 'admin1name',
            'Admin2 Pcode': 'admin2pcode',
            'Admin2 Name': 'admin2name',
            'Admin3 Pcode': 'admin3pcode',
            'Admin3 Name': 'admin3name',
            'Warehouse Name': 'site_name',
            'Stock Month': 'report_month',
            'Stock Year': 'report_year',
            'Cluster': 'cluster',
            'Stock Type': 'stock_item_name',
            'Stock Details': 'stock_details',
            'Status': 'stock_status_name',
            'No. in Stock': 'number_in_stock',
            'No. in Pipeline': 'number_in_pipeline',
            'Units': 'unit_type_name',
            'Beneficiary Coverage': 'beneficiaries_covered',
            'Targeted Group': 'stock_targeted_groups_name',
            'Remarks': 'remarks',
            'Created': 'createdAt',
            'Last Update': 'updatedAt',
            'Purpose':'stock_item_purpose_name'
          },
          uploadFileConfig: {
            previewTemplate: `	<div class="dz-preview dz-processing dz-image-preview dz-success dz-complete">
																			<div class="dz-image">
																				<img data-dz-thumbnail>
																			</div>
																			<div class="dz-details">
																				<div class="dz-size">
																					<span data-dz-size>
																				</div>
																				<div class="dz-filename">
																					<span data-dz-name></span>
																				</div>
																			</div>
																			<div data-dz-remove class=" remove-upload btn-floating red" style="margin-left:35%; "><i class="material-icons">clear</i></div>
																		</div>`,
            completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">' + $filter('translate')('complete') + '</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
            acceptedFiles: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
            maxFiles: 1,
            parallelUploads: 1,
            url: ngmAuth.LOCATION + '/api/uploadGDrive',
            dictDefaultMessage:
              `<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please upload file with extention .csv or xlxs !',
            notSupportedFile: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + $filter('translate')('not_supported_file_type') + ' ',
            errorMessage: `<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>Error`,
            addRemoveLinks: false,
            autoProcessQueue: false,
            init: function () {
              drop_zone = this;
              // upload_file and delete_file is ID for button upload and cancel
              $("#upload_file").attr("disabled", true);
              $("#delete_file").attr("disabled", true);

              document.getElementById('upload_file').addEventListener("click", function () {
                $("#upload_file").attr("disabled", true);
                $("#delete_file").attr("disabled", true);
                $("#switch_btn_file").attr("disabled", true);
                var ext = drop_zone.getAcceptedFiles()[0].name.split('.').pop();
                attribute_headers_obj = $scope.report.uploadFileReport.obj_header;
                if (ext === 'csv') {
                  var file = drop_zone.getAcceptedFiles()[0],
                    read = new FileReader();

                  read.readAsBinaryString(file);

                  read.onloadend = function () {
                    var csv_string = read.result
                    csv_array = Papa.parse(csv_string).data;
                    
                    if (csv_array[0].indexOf('Stock Type') < 0) {
                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      $scope.report.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                      $timeout(function () {
                        $('#upload-monthly-file-stock').modal('close');
                        document.querySelector(".dz-default.dz-message").style.display = 'block';
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#message-monthly-file-stock').modal({ dismissible: false });
                        $('#message-monthly-file-stock').modal('open');
                        $("#switch_btn_file").attr("disabled", false);
                      }, 1000)
                      return
                    };
                    var values = [];
                    values_obj = [];
                    // get value and change to object
                    for (var y = 1; y < csv_array.length; y++) {
                      var obj = {}
                      for (var z = 0; z < csv_array[y].length; z++) {
                        if (csv_array[0][z] === 'Beneficiary Coverage' ||
                          csv_array[0][z] === 'No. in Pipeline' ||
                          csv_array[0][z] === 'No. in Stock' ||
                          csv_array[0][z] === 'Stock Year' ) {
                          csv_array[y][z] = parseInt(csv_array[y][z]);
                        }

                        obj[csv_array[0][z]] = csv_array[y][z];
                      }
                      values_obj.push(obj)
                    }
                    // map the header to the attribute name
                    for (var index = 0; index < values_obj.length; index++) {
                      obj_true = {};
                      angular.forEach(values_obj[index], function (value, key) {

                        atribute_name = attribute_headers_obj[key];
                        obj_true[atribute_name] = value;

                      })
                      obj_true = $scope.report.addMissingAttributeFromFile(obj_true);
                      values.push(obj_true);
                    }
                    
                    if (values.length > 0) {
                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      var count_error = 0;
                      
                      for (var x = 0; x < values.length; x++) {
                        index = $scope.report.report.stocklocations.findIndex(j =>
                          (j.site_name === values[x].site_name) &&
                          (j.admin1name === values[x].admin1name) &&
                          (j.admin2name === values[x].admin2name) &&
                          (j.admin3name ? (j.admin3name === values[x].admin3name) : true));
                        
                        if (index < 0 || !values[x].stock_item_type) {
                          if (!$scope.messageFromfile[x]) {
                            $scope.messageFromfile[x] = []
                          }
                          obj = {}
                          if (index < 0) {
                            obj = { label: false, property: 'location', reason: '' }
                            obj.reason = 'Location not Found : ' + values[x].admin1name + ', ' + values[x].admin2name;
                            if (values[x].admin3name) {
                              obj.reason += ', ' + values[x].admin3name
                            }
                            if (values[x].site_name) {
                              obj.reason += ', ' + values[x].site_name
                            }

                            $scope.messageFromfile[x].push(obj)
                          }
                          if (!values[x].stock_item_type){
                            obj = { label: false, property:'stock_item_type', reason:''}
                            obj.reason = values[x].stock_item_type;
                            $scope.messageFromfile[x].push(obj)
                          }
                          count_error += 1;

                        } else {
                          $scope.report.addStockFromFile(index,values[x],x)
                        }
                      }

                    }

                    $timeout(function () {
                      document.querySelector(".percent-upload").style.display = 'none';
                      $('#upload-monthly-file-stock').modal('close');
                      drop_zone.removeAllFiles(true);
                      

                      var message_temp = '';

                      for (var z = 0; z < $scope.messageFromfile.length; z++) {
                        if ($scope.messageFromfile[z].length) {
                          for (var y = 0; y < $scope.messageFromfile[z].length; y++) {

                            var field = $scope.messageFromfile[z][y].property;
                            var reason = $scope.messageFromfile[z][y].reason;
                            var error_label = $scope.messageFromfile[z][y].label;
                            if (error_label) {
                              $(error_label).addClass('error');
                            }
                            if (field === 'location') {
                              message_temp += 'For Incorrect Location please check admin1 Name, admin2 Name, site name ! \n'
                            } else if (field === 'stock_item_type') {
                              message_temp += 'For Incorrect Stock Type \nPlease check spelling, or verify that this is a correct value for this report! \n'
                            }
                            else {
                              message_temp += 'For incorrect values please check spelling, or verify that this is a correct value for this report! \n'
                            }
                            message_temp += 'Incorrect value at: row ' + (z + 2) + ', ' + ngmClusterValidation.fieldNameStock()[field] + ' : ' + reason + '\n';

                          }
                        }

                      }

                      if (message_temp !== '') {
                        
                        $scope.report.report.messageWarning = message_temp;
                        $timeout(function () {
                          $('#message-monthly-file-stock').modal({ dismissible: false });
                          $('#message-monthly-file-stock').modal('open');
                        })

                      }
                      // cek errror
                      if (count_error > 0 || values.length < 1) {
                        if ((count_error === values.length) || (values.length < 1)) {
                          M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                          M.toast({ html: info, displayLength: 4000, classes: 'note' });
                        }

                      } else {
                        var info = $filter('translate')('save_to_apply_changes');
                        M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                        M.toast({ html: info, displayLength: 4000, classes: 'note' });
                      }


                      // reset error message
                      $scope.messageFromfile = [];
                      $("#upload_file").attr("disabled", true);
                      $("#delete_file").attr("disabled", true);
                      $("#switch_btn_file").attr("disabled", false);
                    }, 2000)
                  }


                } else {
                  file = drop_zone.getAcceptedFiles()[0]
                  const wb = new ExcelJS.Workbook();
                  drop_zone.getAcceptedFiles()[0].arrayBuffer().then((data) => {
                    var result = []
                    wb.xlsx.load(data).then(workbook => {
                      const book = [];
                      const book_obj = [];

                      workbook.eachSheet((sheet, index) => {
                        // get only the first sheet
                        if (index === 1) {
                          const sh = [];
                          sheet.eachRow(row => {
                            sh.push(row.values);
                          });
                          book.push(sh);
                        }
                      });
                      
                      if (book[0][0].indexOf('Stock Type') < 0) {
                        var previews = document.querySelectorAll(".dz-preview");
                        previews.forEach(function (preview) {
                          preview.style.display = 'none';
                        })
                        document.querySelector(".dz-default.dz-message").style.display = 'none';
                        document.querySelector(".percent-upload").style.display = 'block';
                        $scope.report.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                        $timeout(function () {
                          $('#upload-monthly-file-stock').modal('close');
                          document.querySelector(".dz-default.dz-message").style.display = 'block';
                          document.querySelector(".percent-upload").style.display = 'none';
                          $('#message-monthly-file-stock').modal({ dismissible: false });
                          $('#message-monthly-file-stock').modal('open');
                        }, 1000)
                        return
                      };
                      // get value and change to object
                      for (var x = 0; x < book.length; x++) {
                        for (var y = 1; y < book[x].length; y++) {
                          var obj = {}
                          for (var z = 1; z < book[x][y].length; z++) {
                            if (book[x][y][z] === undefined) {
                              book[x][y][z] = "";
                            }
                            obj[book[x][0][z]] = book[x][y][z];
                          }
                          book_obj.push(obj)
                        }
                      }
                      // map the header to the attribute name
                      for (var index = 0; index < book_obj.length; index++) {
                        obj_true = {};
                        angular.forEach(book_obj[index], function (value, key) {

                          atribute_name = attribute_headers_obj[key];
                          obj_true[atribute_name] = value;

                        })
                        obj_true = $scope.report.addMissingAttributeFromFile(obj_true);
                        result.push(obj_true);
                      }

                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      // $scope.answer = result;
                      
                      if (result.length > 0 || (!result[x].stock_item_type)) {
                        var count_error = 0
                        for (var x = 0; x < result.length; x++) {
                          index = $scope.report.report.stocklocations.findIndex(j => 
                            (j.site_name.toString() === result[x].site_name.toString()) &&
                            (j.admin1name === result[x].admin1name) &&
                            (j.admin2name === result[x].admin2name) &&
                            (j.admin3name ? (j.admin3name === result[x].admin3name) : true))

                          if (index < 0 || (!result[x].stock_item_type)) {
                            if (!$scope.messageFromfile[x]) {
                              $scope.messageFromfile[x] = []
                            }
                            obj = {}
                            if (index < 0) {
                              obj = { label: false, property: 'location', reason: '' }
                              obj.reason = 'Location not Found : ' + result[x].admin1name + ', ' + result[x].admin2name;
                              if (result[x].admin3name) {
                                obj.reason += ', ' + result[x].admin3name
                              }
                              if (result[x].site_name) {
                                obj.reason += ', ' + result[x].site_name
                              }
                              $scope.messageFromfile[x].push(obj)
                            }
                            if (!result[x].stock_item_type) {
                              obj = { label: false, property: 'stock_item_type', reason: '' }
                              obj.reason = result[x].stock_item_type;
                              $scope.messageFromfile[x].push(obj)
                            }
                            
                            count_error += 1;
                          } else {
                            $scope.report.addStockFromFile(index, result[x], x)
                          }
                        }
                      }
                      $timeout(function () {
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#upload-monthly-file-stock').modal('close');
                        drop_zone.removeAllFiles(true);
                        

                        var message_temp = '';

                        for (var z = 0; z < $scope.messageFromfile.length; z++) {

                          if ($scope.messageFromfile[z].length) {
                            for (var y = 0; y < $scope.messageFromfile[z].length; y++) {

                              var field = $scope.messageFromfile[z][y].property;
                              var reason = $scope.messageFromfile[z][y].reason;
                              var error_label = $scope.messageFromfile[z][y].label;
                              if (error_label) {
                                $(error_label).addClass('error');
                              }
                              if (field === 'location') {
                                message_temp += 'For Incorrect Location please check admin1 Name, admin2 name, site type, site implementation, site name ! \n'
                              } else if (field === ('stock_item_type')) {
                                message_temp += 'For Incorrect Stock Type \nPlease check spelling, or verify that this is a correct value for this report! \n'
                              }
                              else {
                                message_temp += 'For incorrect values please check spelling, or verify that this is a correct value for this report! \n'
                              }
                              message_temp += 'Incorrect value at: row ' + (z + 2) + ', ' + ngmClusterValidation.fieldNameStock()[field] + ' : ' + reason + '\n';

                            }
                          }

                        }

                        if (message_temp !== '') {

                          $scope.report.report.messageWarning = message_temp;
                          $timeout(function () {
                            $('#message-monthly-file-stock').modal({ dismissible: false });
                            $('#message-monthly-file-stock').modal('open');
                          })

                        }
                        // erroor
                        if (count_error > 0 || result.length < 1) {
                          if ((count_error === result.length) || (result.length < 1)) {
                            M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                          } else {
                            var info = $filter('translate')('save_to_apply_changes');
                            M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                            M.toast({ html: info, displayLength: 4000, classes: 'note' });
                          }

                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                          M.toast({ html: info, displayLength: 4000, classes: 'note' });
                        }
                        // reset error message
                        $scope.messageFromfile = [];
                        $("#upload_file").attr("disabled", true);
                        $("#delete_file").attr("disabled", true);
                        $("#switch_btn_file").attr("disabled", false);
                      }, 2000)

                    })
                  })
                }
              });

              document.getElementById('delete_file').addEventListener("click", function () {
                drop_zone.removeAllFiles(true);
              });

              // when add file
              drop_zone.on("addedfile", function (file) {

                document.querySelector(".dz-default.dz-message").style.display = 'none';
                var ext = file.name.split('.').pop();
                //change preview if not image/*
                $(file.previewElement).find(".dz-image img").attr("src", "images/elsedoc.png");
                $("#upload_file").attr("disabled", false);
                $("#delete_file").attr("disabled", false);

              });

              // when remove file
              drop_zone.on("removedfile", function (file) {

                if (drop_zone.files.length < 1) {
                  // upload_file and delete_file is ID for button upload and cancel
                  $("#upload_file").attr("disabled", true);
                  $("#delete_file").attr("disabled", true);

                  document.querySelector(".dz-default.dz-message").style.display = 'block';
                  $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please upload file with extention .csv or xlxs !');
                }

                if ((drop_zone.files.length < 2) && (drop_zone.files.length > 0)) {
                  document.querySelector(".dz-default.dz-message").style.display = 'none';
                  $("#upload_file").attr("disabled", false);
                  $("#delete_file").attr("disabled", false);
                  document.getElementById("upload_file").style.pointerEvents = "auto";
                  document.getElementById("delete_file").style.pointerEvents = "auto";

                }
              });

              drop_zone.on("maxfilesexceeded", function (file) {
                document.querySelector(".dz-default.dz-message").style.display = 'none';
                $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + 'Please, import just one file at the time and remove exceeded file');
                document.querySelector(".dz-default.dz-message").style.display = 'block'
                // Materialize.toast("Too many file to upload", 6000, "error")
                M.toast({ html: "Too many file to upload", displayLength: 2000, classes: 'error' });
                $("#upload_file").attr("disabled", true);
                document.getElementById("upload_file").style.pointerEvents = "none";
                $("#delete_file").attr("disabled", true);
                document.getElementById("delete_file").style.pointerEvents = "none";
              });

              // reset
              this.on("reset", function () {
                // upload_file and delete_file is ID for button upload and cancel
                document.getElementById("upload_file").style.pointerEvents = 'auto';
                document.getElementById("delete_file").style.pointerEvents = 'auto';
              });
            },

          },
          uploadText: function () {

            document.querySelector("#ngm-input-string").style.display = 'none';
            document.querySelector(".percent-upload").style.display = 'block';
            $("#input_string").attr("disabled", true);
            $("#close_input_string").attr("disabled", true);
            $("#switch_btn_text").attr("disabled", true);
            attribute_headers_obj = $scope.report.uploadFileReport.obj_header;
            if ($scope.report.text_input) {
              csv_array = Papa.parse($scope.report.text_input).data;
              if (csv_array[0].indexOf('Stock Type') < 0) {


                $timeout(function () {
                  $scope.report.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                  $('#upload-monthly-file-stock').modal('close');
                  document.querySelector("#ngm-input-string").style.display = 'block';
                  document.querySelector(".percent-upload").style.display = 'none';
                  $('#message-monthly-file-stock').modal({ dismissible: false });
                  $('#message-monthly-file-stock').modal('open');
                  $scope.project.report.text_input = '';
                  document.querySelector("#input-string-area").style.display = 'block';
                  $scope.inputString = false;
                }, 1000)
                return
              };
              var values = [];
              values_obj = [];
              // get value and change to object
              for (var y = 1; y < csv_array.length; y++) {
                var obj = {}
                for (var z = 0; z < csv_array[y].length; z++) {
                  if (csv_array[0][z] === 'Beneficiary Coverage' ||
                    csv_array[0][z] === 'No. in Pipeline' ||
                    csv_array[0][z] === 'No. in Stock' ||
                    csv_array[0][z] === 'Stock Year' ) {
                    csv_array[y][z] = parseInt(csv_array[y][z]);
                  }

                  obj[csv_array[0][z]] = csv_array[y][z];
                }
                values_obj.push(obj)
              }
              // map the header to the attribute name
              for (var index = 0; index < values_obj.length; index++) {
                obj_true = {};
                angular.forEach(values_obj[index], function (value, key) {

                  atribute_name = attribute_headers_obj[key];
                  obj_true[atribute_name] = value;

                })
                obj_true = $scope.report.addMissingAttributeFromFile(obj_true);
                values.push(obj_true);
              }

              if (values.length > 0) {

                var count_error = 0;
                for (var x = 0; x < values.length; x++) {
                  index = $scope.report.report.stocklocations.findIndex(j =>
                    (j.site_name === values[x].site_name) &&
                    (j.admin1name === values[x].admin1name) &&
                    (j.admin2name === values[x].admin2name) &&
                    (j.admin3name ? (j.admin3name === values[x].admin3name) : true));
                  if (index < 0 || (!values[x].stock_item_type)) {
                    if (!$scope.messageFromfile[x]) {
                      $scope.messageFromfile[x] = []
                    }
                    obj = {}
                    index = -1
                    if (index < 0) {
                      obj = { label: false, property: 'location', reason: '' }
                      obj.reason = 'Location not Found : ' + values[x].admin1name + ', ' + values[x].admin2name;
                      if (values[x].admin3name) {
                        obj.reason += ', ' + values[x].admin3name
                      }
                      if (values[x].site_name) {
                        obj.reason += ', ' + values[x].site_name
                      }
                      

                      $scope.messageFromfile[x].push(obj)
                    }
                    if (!values[x].stock_item_type) {
                      obj = { label: false, property: 'stock_item_type', reason: '' }
                      obj.reason = values[x].stock_item_type;
                      $scope.messageFromfile[x].push(obj)
                    }
                    
                    count_error += 1;

                  } else {
                    $scope.report.addStockFromFile(index, values[x], x)
                  }
                }

              }
              // set warning if error exist
              var message_temp = '';
              for (var z = 0; z < $scope.messageFromfile.length; z++) {
                if ($scope.messageFromfile[z].length) {
                  for (var y = 0; y < $scope.messageFromfile[z].length; y++) {

                    var field = $scope.messageFromfile[z][y].property;
                    var reason = $scope.messageFromfile[z][y].reason;
                    var error_label = $scope.messageFromfile[z][y].label;
                    if (error_label) {
                      $(error_label).addClass('error');
                    }
                    if (field === 'location') {
                      message_temp += 'For Incorrect Location please check admin1 Name, admin2 Name, site type, site implementation, site name ! \n'
                    } else if (field === 'stock_item_type') {
                      message_temp += 'For Stock Type \nPlease check spelling, or verify that this is a correct value for this report! \n'
                    }
                    else {
                      message_temp += 'For incorrect values please check spelling, or verify that this is a correct value for this report! \n'
                    }
                    message_temp += 'Incorrect value at: row ' + (z + 2) + ', ' + ngmClusterValidation.fieldNameStock()[field] + ' : ' + reason + '\n';

                  }
                }

              }

              $timeout(function () {
                document.querySelector("#ngm-input-string").style.display = 'block';
                document.querySelector(".percent-upload").style.display = 'none';
                $('#upload-monthly-file-stock').modal('close');
                $scope.report.text_input = '';

                if (message_temp !== '') {

                  $scope.report.report.messageWarning = message_temp;
                  $timeout(function () {
                    $('#message-monthly-file-stock').modal({ dismissible: false });
                    $('#message-monthly-file-stock').modal('open');
                  })

                }
                // need to simplify this
                if (count_error > 0 || values.length < 1) {
                  if ((count_error === values.length) || (values.length < 1)) {
                    M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                  } else {
                    var info = $filter('translate')('save_to_apply_changes');
                    M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                    M.toast({ html: info, displayLength: 4000, classes: 'note' });
                  }

                } else {
                  var info = $filter('translate')('save_to_apply_changes');
                  M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                  M.toast({ html: info, displayLength: 4000, classes: 'note' });
                  
                }


                document.querySelector("#input-string-area").style.display = 'block';
                $scope.inputString = false;
              }, 2000)



            } else {
              $timeout(function () {
                document.querySelector("#ngm-input-string").style.display = 'block';
                document.querySelector(".percent-upload").style.display = 'none';
                $("#close_input_string").attr("disabled", false);
                $("#input_string").attr("disabled", false);
                $("#switch_btn_text").attr("disabled", false);
                M.toast({ html: 'Please Type something!', displayLength: 2000, classes: 'success' });
              }, 2000)

            }
            // reset error message
            $scope.messageFromfile = [];
          }

        },
        addMissingAttributeFromFile: function (obj) {
          if (obj.cluster) {
            selected_cluster = $filter('filter')($scope.report.lists.clusters, { cluster: obj.cluster }, true);
            if (selected_cluster.length){
              obj.cluster_id = selected_cluster[0].cluster_id;
            }
          }
          if (obj.stock_item_name){
            selected_stock_item = $filter('filter')($scope.report.lists.stocks, { stock_item_name: obj.stock_item_name }, true);
            if (selected_stock_item.length) {
              obj.stock_item_type = selected_stock_item[0].stock_item_type;
            };
          }
          if (obj.stock_status_name){
            selected_stock_status = $filter('filter')($scope.report.lists.stock_status, { stock_status_name: obj.stock_status_name }, true);
            if (selected_stock_status.length) {
              obj.stock_status_id = selected_stock_status[0].stock_status_id;
            }

          }
          if (obj.unit_type_name){
            selected_unit = $filter('filter')($scope.report.lists.units, { unit_type_name: obj.unit_type_name }, true);
            if (selected_unit.length) {
              obj.unit_type_id = selected_unit[0].unit_type_id;
            }
          }
          if(obj.stock_targeted_groups_name){
            selected_targeted = $filter('filter')($scope.report.lists.stock_targeted_groups, { stock_targeted_groups_name: obj.stock_targeted_groups_name }, true);
            if (selected_targeted.length) {
              obj.stock_targeted_groups_id = selected_targeted[0].stock_targeted_groups_id;
            }
          }

          if (obj.stock_type_name){
            selected_stn = $filter('filter')($scope.report.lists.types, { stock_type_name: obj.stock_type_name }, true);
            if (selected_stn.length) {
              obj.stock_type_id = selected_stn[0].stock_type_id;
            }
          }
          if( obj.stock_details){
            obj.stock_details= obj.stock_details.split(',').map(function (org) {

              org.trim();
              org = org.split(':')
             var quantitiy = org[1].trim() === 'n/a' ? 0 : parseInt(org[1].trim);
              detail_obj ={
                unit_type_name: org[0].trim(),
                unit_type_quantity: quantitiy
              }
              return detail_obj;

            });

          }
          if (obj.stock_item_purpose_name){
            selected_purpose = $filter('filter')($scope.report.lists.stock_item_purpose, { stock_item_purpose_name: obj.stock_item_purpose_name }, true);
            if (selected_purpose.length) {
              obj.stock_item_purpose_id = selected_purpose[0].stock_item_purpose_id;
            }
          }
          return obj
        },
        copyToClipBoard: function () {
          /* Get the text field */
          var copyText = document.getElementById("ngm-missing-value-stock");

          /* Select the text field */
          copyText.select();
          copyText.setSelectionRange(0, 99999); /*For mobile devices*/

          /* Copy the text inside the text field */
          document.execCommand("copy");

          M.toast({ html: 'Copy too Clipboard', displayLength: 1000, classes: 'note' });
        },
        switchInputFile: function () {
          $scope.inputString = !$scope.inputString;
          $scope.report.report.messageWarning = '';
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

