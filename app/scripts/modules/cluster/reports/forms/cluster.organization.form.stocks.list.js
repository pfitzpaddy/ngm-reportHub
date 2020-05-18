/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStocksFormList
 * @description
 * # ClusterOrganizationStocksFormList
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stocks.list', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stocks.list', {
        title: 'Organization Warehouse and Stocks',
        description: 'Organization Warehouse and Stocks',
        controller: 'ClusterOrganizationStocksFormList',
        templateUrl: '/scripts/modules/cluster/views/forms/warehouse/form.html'
      });
  })
  .controller( 'ClusterOrganizationStocksFormList', [
		'$scope',
		'$rootScope',
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
    'ngmClusterValidation',
    'ngmClusterImportFile',
    'ngmLists',
    'config',
		function( $scope,
				$rootScope,
        $location,
        $timeout,
        $filter,
        $q,
        $http,
        $route,
        ngmUser,
        ngmAuth,
        ngmData,
        ngmClusterHelper,
        ngmClusterValidation,
        ngmClusterImportFile,
        ngmLists,
        config ){
      $scope.ngmClusterImportFile = ngmClusterImportFile;
      $scope.messageFromfile=[];
      $scope.inputString =false;
      // project
      $scope.report = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // budget
        budget: {
          project_budget_amount_recieved: 0,
          project_budget_date_recieved: moment().format('YYYY-MM-DD')
        },

        // project
        organization: config.organization,

        // last update
        updatedAt: moment( config.organization.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),

        // warehouseUrl
        warehouseUrl: '/scripts/modules/cluster/views/forms/warehouse/locations.html',

        // holder for UI options
        options: {
          filter: {},
          warehouse: {},
          list: {
            // admin1 ( with admin0 filter at API )
            admin1: ngmLists.getObject( 'lists' ).admin1List,
            // admin2 ( with admin0 filter at API )
            admin2: ngmLists.getObject( 'lists' ).admin2List,
            // admin3 ( with admin0 filter at API )
            admin3: ngmLists.getObject( 'lists' ).admin3List,
          }
        },

        canEdit: ngmAuth.canDo( 'EDIT', { adminRpcode: config.organization.adminRpcode, admin0pcode:config.organization.admin0pcode, cluster_id: ngmUser.get().cluster_id, organization_tag:config.organization.organization_tag } ),

        // organization
        getOrganizationHref: function() {
          var href = '#/cluster/organization';
          if ( $scope.report.user.roles.indexOf('ADMIN') !== -1 ) { href += '/' + $scope.report.organization.id }
          return href;
        },

        // setorg request
        setOrganization: function() {
          return {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/setOrganization',
            data: { organization: $scope.report.organization }
          }
        },

        // rmove stocklocation request
        removeStockLocation: function( stock_warehouse_id ){
          return {
            method: 'POST',
            url: ngmAuth.LOCATION + '/api/cluster/stock/removeStockLocation',
            data: { stock_warehouse_id: stock_warehouse_id }
          }
        },

        // helpers helper
        updateLocationSelect: function( filterAdmin2, filterAdmin3 ) {

          // filter
          if ( filterAdmin2 ) {
            // why is admin2 filter not working in ng-repeat?
            $scope.report.options.list.admin2 = localStorage.getObject( 'lists' ).admin2List;
          }

          // filter
          if ( filterAdmin3 ) {
            // why is admin2 filter not working in ng-repeat?
            $scope.report.options.list.admin3 = localStorage.getObject( 'lists' ).admin3List;
          }

          // update material_select
          ngmClusterValidation.updateSelect();

        },

				refreshWidgets: function(){
					$rootScope.$broadcast('refresh:warehouses');
					$rootScope.$broadcast('refresh:stockreports');
        },
        text_input: '',
        messageWarning: '',

        init:function(){
          // set detail location
          $scope.detailWarehouse = $scope.report.organization.warehouses.length ?
            new Array($scope.report.organization.warehouses.length).fill(false) : new Array(0).fill(false);
        },

        // add location
        addLocation: function(){

          // process + clean warehouse
          var warehouse =
              ngmClusterHelper.getCleanWarehouseLocation( ngmUser.get(), $scope.report.organization, $scope.report.options.warehouse );

          // extend targets with project, ngmData details & push
          $scope.report.organization.warehouses.push( warehouse );

          // reset
          $scope.report.options.warehouse = {};

          // update material select
          ngmClusterValidation.updateSelect();

          // Update Org with warehouse association
          ngmData.get($scope.report.setOrganization()).then( function( organization ){

            // set org
						$scope.report.organization = organization[0];

            // on success
            // Materialize.toast( 'Warehouse Location Added!', 6000, 'success');
            M.toast({ html: 'Warehouse Location Added!', displayLength: 6000, classes: 'success' });

						// refresh to update empty reportlist
						// $scope.reload()
						$scope.report.refreshWidgets();

          });

        },

        // remove location from location list
        removeLocationModal: function( $index ) {
          // set location index
          $scope.report.locationIndex = $index;

          // open confirmation modal
          // $('#warehouses-modal').openModal({ dismissible: false });
          $('#warehouses-modal').modal({ dismissible: false });
          $('#warehouses-modal').modal('open');

        },

        // confirm locaiton remove
        removeLocation: function() {
          $scope.disableButton = true;
          // get warehouse to remove
          var stock_warehouse_id = $scope.report.organization.warehouses[$scope.report.locationIndex].id;

          // remove location at i
          $scope.report.organization.warehouses.splice( $scope.report.locationIndex, 1 );
          if (stock_warehouse_id){
            // send request
            $q.all([ $http($scope.report.removeStockLocation(stock_warehouse_id)) ]).then( function( results ){

              // on success
              M.toast({ html: 'Warehouse Location Removed!', displayLength: 6000, classes: 'success' });

              // refresh to update empty reportlist
              // $route.reload();
              $scope.report.refreshWidgets();

            });
          }
          $scope.disableButton = false;

        },

        // upload file ware house
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
          uploadFileConfig: {
            previewTemplate: ngmClusterImportFile.templatePreview(),
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
                attribute_headers_obj = ngmClusterImportFile.listheaderAttributeInFile('warehouse');//$scope.report.uploadFileReport.obj_header;
                if (ext === 'csv') {
                  var file = drop_zone.getAcceptedFiles()[0],
                    read = new FileReader();

                  read.readAsBinaryString(file);

                  read.onloadend = function () {
                    var csv_string = read.result
                    csv_array = Papa.parse(csv_string).data;

                    if (csv_array[0].indexOf('Admin1 Pcode') < 0) {
                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      $scope.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                      $timeout(function () {
                        $('#upload-file-warehouse').modal('close');
                        document.querySelector(".dz-default.dz-message").style.display = 'block';
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#message-file-warehouse').modal({ dismissible: false });
                        $('#message-file-warehouse').modal('open');
                        $("#switch_btn_file").attr("disabled", false);
                      }, 1000)
                      return
                    };
                    var values = [];
                    values_obj = [];
                    values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
                    // map the header to the attribute name
                    for (var index = 0; index < values_obj.length; index++) {
                      obj_true = {};
                      angular.forEach(values_obj[index], function (value, key) {

                        atribute_name = attribute_headers_obj[key];
                        obj_true[atribute_name] = value;

                      })
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

                        if ((!values[x].admin1pcode) || (!values[x].admin1name) || (!values[x].admin1pcode) || (!values[x].admin2name) || (!values[x].site_name)) {
                          if (!$scope.messageFromfile[x]) {
                            $scope.messageFromfile[x] = []
                          }
                          obj = {}
                          if ((!values[x].admin1pcode)) {
                            obj = { label: false, property: 'admin1pcode', reason: 'Missing Value' }
                            $scope.messageFromfile[x].push(obj);
                          }
                          if ((!values[x].admin1name)) {
                            obj = { label: false, property: 'admin1name', reason: 'Missing Value' }
                            $scope.messageFromfile[x].push(obj);
                          }
                          if ((!values[x].admin2pcode)) {
                            obj = { label: false, property: 'admin2pcode', reason: 'Missing Value' }
                            $scope.messageFromfile[x].push(obj);
                          }
                          if ((!values[x].admin2name)) {
                            obj = { label: false, property: 'admin2name', reason: 'Missing Value' }
                            $scope.messageFromfile[x].push(obj);
                          }

                          count_error += 1;

                        } else {
                          $scope.report.setWareHouseFromFile(values[x],x)
                        }
                      }

                    }

                    $timeout(function () {
                      document.querySelector(".percent-upload").style.display = 'none';
                      $('#upload-file-warehouse').modal('close');
                      drop_zone.removeAllFiles(true);


                      $scope.report.setMessageInputFromFile($scope.messageFromfile)
                      // cek errror
                      if (count_error > 0 || values.length < 1) {
                        if ((count_error === values.length) || (values.length < 1)) {
                          M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                          M.toast({ html: 'No, Location Added!', displayLength: 4000, classes: 'error' });
                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                          M.toast({ html: 'Some Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                          M.toast({ html: info, displayLength: 6000, classes: 'note' });
                        }

                      } else {
                        var info = $filter('translate')('save_to_apply_changes');
                        M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                        M.toast({ html: 'Some Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                        M.toast({ html: info, displayLength: 6000, classes: 'note' });
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
                      var book_obj = [];

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

                      if (book[0][0].indexOf('Admin1 Pcode') < 0) {
                        var previews = document.querySelectorAll(".dz-preview");
                        previews.forEach(function (preview) {
                          preview.style.display = 'none';
                        })
                        document.querySelector(".dz-default.dz-message").style.display = 'none';
                        document.querySelector(".percent-upload").style.display = 'block';
                        $scope.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                        $timeout(function () {
                          $('#upload-file-warehouse').modal('close');
                          document.querySelector(".dz-default.dz-message").style.display = 'block';
                          document.querySelector(".percent-upload").style.display = 'none';
                          $('#message-file-warehouse').modal({ dismissible: false });
                          $('#message-file-warehouse').modal('open');
                        }, 1000)
                        return
                      };
                      // get value and change to object

                      book_obj = ngmClusterImportFile.setExcelValueToArrayofObject(book);
                      // map the header to the attribute name
                      for (var index = 0; index < book_obj.length; index++) {
                        obj_true = {};
                        angular.forEach(book_obj[index], function (value, key) {

                          atribute_name = attribute_headers_obj[key];
                          obj_true[atribute_name] = value;

                        })
                        result.push(obj_true);
                      }

                      var previews = document.querySelectorAll(".dz-preview");
                      previews.forEach(function (preview) {
                        preview.style.display = 'none';
                      })
                      document.querySelector(".dz-default.dz-message").style.display = 'none';
                      document.querySelector(".percent-upload").style.display = 'block';
                      // $scope.answer = result;

                      if (result.length > 0) {
                        var count_error = 0
                        for (var x = 0; x < result.length; x++) {
                          if ((!result[x].admin1pcode) || (!result[x].admin1name) || (!result[x].admin1pcode) || (!result[x].admin2name) || (!result[x].site_name)) {
                            if (!$scope.messageFromfile[x]) {
                              $scope.messageFromfile[x] = []
                            }
                            obj = {}
                            if ((!result[x].admin1pcode)){
                              obj = { label: false, property: 'admin1pcode', reason: 'Missing Value' }
                              $scope.messageFromfile[x].push(obj);
                            }
                            if ((!result[x].admin1name)) {
                              obj = { label: false, property: 'admin1name', reason: 'Missing Value' }
                              $scope.messageFromfile[x].push(obj);
                            }
                            if ((!result[x].admin2pcode)) {
                              obj = { label: false, property: 'admin2pcode', reason: 'Missing Value' }
                              $scope.messageFromfile[x].push(obj);
                            }
                            if ((!result[x].admin2name)) {
                              obj = { label: false, property: 'admin2name', reason: 'Missing Value' }
                              $scope.messageFromfile[x].push(obj);
                            }
                            
                            if ((!result[x].site_name)){
                              obj = { label: false, property: 'site_name', reason: 'Missing Value' }
                              $scope.messageFromfile[x].push(obj);
                            }
                            count_error += 1;

                          } else {
                            $scope.report.setWareHouseFromFile(result[x], x)
                          }
                        }
                      }
                     
                      $timeout(function () {
                        document.querySelector(".percent-upload").style.display = 'none';
                        $('#upload-file-warehouse').modal('close');
                        drop_zone.removeAllFiles(true);
                        $scope.report.setMessageInputFromFile($scope.messageFromfile)
                        // erroor
                        if (count_error > 0 || result.length < 1) {
                          if ((count_error === result.length) || (result.length < 1)) {
                            M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                            M.toast({ html: 'No, Location Added!', displayLength: 4000, classes: 'error' });
                          } else {
                            var info = $filter('translate')('save_to_apply_changes');
                            M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                            M.toast({ html: 'Some Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                            M.toast({ html: info, displayLength: 6000, classes: 'note' });
                          }

                        } else {
                          var info = $filter('translate')('save_to_apply_changes');
                          M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                          M.toast({ html: 'All Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                          M.toast({ html: info, displayLength: 6000, classes: 'note' });
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
            attribute_headers_obj = ngmClusterImportFile.listheaderAttributeInFile('warehouse');//$scope.report.uploadFileReport.obj_header;
            if ($scope.report.text_input) {
              csv_array = Papa.parse($scope.report.text_input).data;
              if (csv_array[0].indexOf('Admin1 Pcode') < 0) {
                $timeout(function () {
                  $scope.report.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                  $('#upload-file-warehouse').modal('close');
                  document.querySelector("#ngm-input-string").style.display = 'block';
                  document.querySelector(".percent-upload").style.display = 'none';
                  $('#message-file-warehouse').modal({ dismissible: false });
                  $('#message-file-warehouse').modal('open');
                  $scope.project.report.text_input = '';
                  document.querySelector("#input-string-area").style.display = 'block';
                  $scope.inputString = false;
                }, 1000)
                return
              };
              var values = [];
              values_obj = [];
              // get value and change to object
              values_obj = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);
              // map the header to the attribute name
              for (var index = 0; index < values_obj.length; index++) {
                obj_true = {};
                angular.forEach(values_obj[index], function (value, key) {

                  atribute_name = attribute_headers_obj[key];
                  obj_true[atribute_name] = value;

                })
                values.push(obj_true);
              }

              if (values.length > 0) {

                var count_error = 0;
                for (var x = 0; x < values.length; x++) {
                  if ((!values[x].admin1pcode) || (!values[x].admin1name) || (!values[x].admin1pcode) || (!values[x].admin2name) || (!values[x].site_name)) {
                    if (!$scope.messageFromfile[x]) {
                      $scope.messageFromfile[x] = []
                    }
                    obj = {}
                    if ((!values[x].admin1pcode)) {
                      obj = { label: false, property: 'admin1pcode', reason: 'Missing Value' }
                      $scope.messageFromfile[x].push(obj);
                    }
                    if ((!values[x].admin1name)) {
                      obj = { label: false, property: 'admin1name', reason: 'Missing Value' }
                      $scope.messageFromfile[x].push(obj);
                    }
                    if ((!values[x].admin2pcode)) {
                      obj = { label: false, property: 'admin2pcode', reason: 'Missing Value' }
                      $scope.messageFromfile[x].push(obj);
                    }
                    if ((!values[x].admin2name)) {
                      obj = { label: false, property: 'admin2name', reason: 'Missing Value' }
                      $scope.messageFromfile[x].push(obj);
                    }

                    count_error += 1;

                  } else {
                    $scope.report.setWareHouseFromFile(values[x], x)
                  }
                }

              }
              // set warning if error exist
              $scope.report.setMessageInputFromFile($scope.messageFromfile)

              $timeout(function () {
                document.querySelector("#ngm-input-string").style.display = 'block';
                document.querySelector(".percent-upload").style.display = 'none';
                $('#upload-file-warehouse').modal('close');
                $scope.report.text_input = '';

                // need to simplify this
                if (count_error > 0 || values.length < 1) {
                  if ((count_error === values.length) || (values.length < 1)) {
                    M.toast({ html: 'Import Fail!', displayLength: 2000, classes: 'error' });
                    M.toast({ html: 'No, Location Added!', displayLength: 4000, classes: 'error' });
                  } else {
                    var info = $filter('translate')('save_to_apply_changes');
                    M.toast({ html: 'Some Row Succeccfully added !', displayLength: 2000, classes: 'success' });
                    M.toast({ html: 'Some Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                    M.toast({ html: info, displayLength: 6000, classes: 'note' });
                  }

                } else {
                  var info = $filter('translate')('save_to_apply_changes');
                  M.toast({ html: 'Import File Success!', displayLength: 2000, classes: 'success' });
                  M.toast({ html: 'All Warehouse, Successfully Added!', displayLength: 4000, classes: 'note' });
                  M.toast({ html: info, displayLength: 6000, classes: 'note' });

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
        setWareHouseFromFile:function(obj,index){
          var selected_admin1 = $filter('filter')($scope.report.options.list.admin1, { admin1pcode: obj.admin1pcode, admin1name: obj.admin1name }, true);
          var selected_admin2 = $filter('filter')($scope.report.options.list.admin2, { admin1pcode: obj.admin1pcode, admin1name: obj.admin1name,admin2pcode: obj.admin2pcode, admin2name: obj.admin2name }, true);
          $scope.report.options.warehouse.admin1 = selected_admin1[0]
          $scope.report.options.warehouse.admin2 = selected_admin2[0]
          if(!$scope.report.options.warehouse['site_type']){
            $scope.report.options.warehouse['site_type']={};
            if (!$scope.report.options.warehouse['site_type']['site_name']){
              $scope.report.options.warehouse['site_type']['site_name']={}
            }
          }
          $scope.report.options.warehouse.site_type.site_name = obj.site_name;
          // set message if admin1 or admin2 is not in the list
          if (!selected_admin1.length || !selected_admin2.length) {
            if (!selected_admin1.length) {
              obj = { label: false, property: 'admin1', reason: 'Not In The List' };
              $scope.messageFromfile[index].push(obj);
            }
            if (!selected_admin2.length) {
              obj = { label: false, property: 'admin2', reason: 'Not In The List' };
              $scope.messageFromfile[index].push(obj);
            }
          };
          if (selected_admin1.length && selected_admin2.length){
            var warehouse = ngmClusterHelper.getCleanWarehouseLocation(ngmUser.get(), $scope.report.organization, $scope.report.options.warehouse);
            $scope.report.organization.warehouses.push(warehouse);
            
            $scope.detailWarehouse[$scope.report.organization.warehouses.length - 1] = true;
          }
          // reset warehouses
          $scope.report.options.warehouse = {};
        },
        switchInputFile: function () {
          $scope.inputString = !$scope.inputString;
          $scope.report.messageWarning = '';
        },
        setMessageInputFromFile: function(listErrorMessage){
          var message_temp = '';

          message_temp = ngmClusterImportFile.setMessageFromFile($scope.messageFromfile, ngmClusterValidation.fieldWarehouse(), 'stock_list', 'message-file-warehouse')
          if (message_temp !== '') {
              $scope.report.messageWarning = message_temp;
              $timeout(function () {
                $('#message-file-warehouse').modal({ dismissible: false });
                $('#message-file-warehouse').modal('open');
              })

          }
        },
        openDetailWareHouse:function(index){
          $scope.detailWarehouse[index] = !$scope.detailWarehouse[index];
        },
        updateLocationWarehouse:function(warehouse,key){
          console.log(key)
          if (key === 'admin1pcode'){
            // remove admin2 and admin3
            delete warehouse.admin2pcode;
            delete warehouse.admin2name;
            delete warehouse.admin2lng;
            delete warehouse.admin2lat;
            delete warehouse.admin3pcode;
            delete warehouse.admin3name;
            delete warehouse.admin3lng;
            delete warehouse.admin3lat;

            var new_admin1 = $filter('filter')($scope.report.options.list.admin1,{admin1pcode:warehouse.admin1pcode}, true);
            delete new_admin1[0].id
            warehouse = angular.merge(warehouse,new_admin1[0])
          }
          if(key === 'admin2pcode'){
            // remove admin2 and admin3
            delete warehouse.admin3pcode;
            delete warehouse.admin3name;
            delete warehouse.admin3lng;
            delete warehouse.admin3lat;
            var new_admin2 = $filter('filter')($scope.report.options.list.admin2, {admin2pcode: warehouse.admin2pcode }, true);
            delete new_admin2[0].id
            warehouse = angular.merge(warehouse,new_admin2[0])
          }
          if(key === 'admin3pcode'){
            var new_admin3 = $filter('filter')($scope.report.options.list.admin3, {  admin3pcode: warehouse.admin3pcode}, true);
            delete new_admin3[0].id
            warehouse = angular.merge(warehouse,new_admin3[0]);
          }
          
        },
        saveUpdatedLocation:function(index){
          $scope.disableButton = true;
          // Update Org with warehouse association
          $scope.report.openDetailWareHouse(index)
          ngmData.get($scope.report.setOrganization()).then(function (organization) {

            // set org
            $scope.report.organization = organization[0];

            // on success
            // Materialize.toast( 'Warehouse Location Added!', 6000, 'success');
            M.toast({ html: 'Warehouse Updated!', displayLength: 6000, classes: 'success' });

            // refresh to update empty reportlist
            // $scope.reload()
            $scope.report.refreshWidgets();
            $scope.disableButton = false;
          });
        }
      };
      
      // run init
      $scope.report.init()
			// set event listener to update data
			if (config.refreshEvent) {
				$scope.$on(config.refreshEvent, function () {
					// update organization object coming from config
					if(config.organization) config.organization = $scope.report.organization;
					$timeout(function () { $scope.$emit('widgetReload'); }, 0);
				})
			}
  }

]);
