

angular.module('ngm.widget.upload.beneficiaries.stock.report', ['ngm.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('upload.beneficiaries.stock.report', {
                title: 'Cluster Upload Beneficiaries Stock Report',
                description: 'Display Cluster Upload Beneficiaries Stock Report',
                controller: 'ClusterUploadBeneficiariesStockCtrl',
                templateUrl: '/scripts/modules/cluster/views/cluster.upload.beneficiaries.stock.report.html',
                resolve: {
                     data: ['ngmData', 'config',function (ngmData, config) {
                        if (config.list_request) {
                            return ngmData.get(config.list_request);
                        }
                    }]
                }
            });
    })
    .controller('ClusterUploadBeneficiariesStockCtrl', [
        '$scope',
		'$window',
        '$location',
        '$timeout',
        '$filter',
        '$q',
        '$http',
        '$route',
        '$sce',
        'ngmUser',
        'ngmAuth',
        'ngmData',
        'config',
        'data',
        '$translate',
        '$filter',
        'ngmClusterImportFile',
        'ngmClusterLists',
        'ngmClusterValidation',
        'ngmClusterBeneficiaries',
        function (
            $scope,
            $window,
            $location,
            $timeout,
            $filter,
            $q,
            $http,
            $route,
            $sce,
            ngmUser,
            ngmAuth,
            ngmData,
            config,
            data,
            $translate,
            $filter,
            ngmClusterImportFile,
            ngmClusterLists,
            ngmClusterValidation,
            ngmClusterBeneficiaries
        ) {
            /**** SERVICES ****/

            // these should be a directive - sorry Steve Jobs!
            $scope.scope = $scope;
            $scope.ngmClusterImportFile = ngmClusterImportFile;
            $scope.ngmClusterLists = ngmClusterLists;
            $scope.ngmClusterValidation = ngmClusterValidation;
            $scope.ngmClusterBeneficiaries = ngmClusterBeneficiaries;
            $scope.inputString = false;
            $scope.messageFromfile=[];
            $scope.type = $route.current.params.type ? $route.current.params.type : 'beneficiaries';
            $scope.currentPage =1;
            $scope.serial = 1;
            $scope.indexCount = function (newPageNumber) {
                $scope.currentPage  = newPageNumber;
            }
            $scope.removeRecordId ='';
            
            $scope.upload = {

                /**** DEFAULTS ****/
                user: ngmUser.get(),
                style: config.style,
                itemsPerPage: 9,
                listId: 'ngm-paginate-' + Math.floor((Math.random() * 1000000)),
                search: {
                    filter: '',
                    focused: false
                },
                canEdit: ngmAuth.canDo('EDIT', { adminRpcode: $route.current.params.adminRpcode, admin0pcode: $route.current.params.admin0pcode, cluster_id: $route.current.params.cluster_id, organization_tag: $route.current.params.organization_tag }),
                openModal: function(modal){
                    $('#' + modal).modal({ dismissible: false });
                    $('#' + modal).modal('open');
                },
                closeModal: function (modal) {
                    drop_zone.removeAllFiles(true);
                    M.toast({ html: $filter('translate')('cancel_to_upload_file'), displayLength: 2000, classes: 'note' });
                },
                switchInputFile:function(){
                    $scope.inputString = !$scope.inputString;
                    $scope.upload.messageWarning = '';
                },
                organization: ngmClusterLists.getOrganizations(),
                messageWarning:'',
                text_input: '',
                configuration: {
                    previewTemplate: ngmClusterImportFile.templatePreview(),
                    completeMessage: '<i class="medium material-icons" style="color:#009688;">cloud_done</i><br/><h5 style="font-weight:300;">' + $filter('translate')('complete') + '</h5><br/><h5 style="font-weight:100;"><div id="add_doc" class="btn"><i class="small material-icons">add_circle</i></div></h5></div>',
                    acceptedFiles: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
                    maxFiles: 1,
                    parallelUploads: 1,
                    url: ngmAuth.LOCATION + '/api/uploadGDrive',
                    dictDefaultMessage:
                        `<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + '',
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



                            if (ext === 'csv') {
                                var file = drop_zone.getAcceptedFiles()[0],
                                    read = new FileReader();
                                var previews = document.querySelectorAll(".dz-preview");
                                previews.forEach(function (preview) {
                                    preview.style.display = 'none';
                                })
                                document.querySelector(".dz-default.dz-message").style.display = 'none';
                                document.querySelector(".percent-upload").style.display = 'block';
                                read.readAsBinaryString(file);
                                read.onloadend = function () {
                                    var csv_string = read.result
                                    csv_array = Papa.parse(csv_string).data;
                                    values = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);

                                    if (values.length > 0) {
                                        var count_error_beneficiaries = 0;
                                        var count_error_stock=0;
                                        if ($scope.type === 'beneficiaries'){
                                            beneficiaries_upload=[];
                                            for (var x = 0; x < values.length; x++) {
                                                values[x] = $scope.upload.addMissingBeneficiaryAtribute(values[x]);

                                                if ((!values[x].beneficiary_id) || (!values[x].activity_type_id) || (!values[x].activity_description_id) || (!values[x].cluster_id)) {
                                                    if (!$scope.messageFromfile[x]) {
                                                        $scope.messageFromfile[x] = []
                                                    }
                                                    obj = {}
                                                    if (!values[x].beneficiary_id) {
                                                        obj = { label: false, property: 'beneficiary_id', reason: '' }
                                                        obj.reason = values[x].beneficiary_id ? values[x].beneficiary_id:'missing'
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    if (!values[x].cluster_id) {
                                                        obj = { label: false, property: 'cluster_id', reason: '' }
                                                        obj.reason = values[x].cluster_id ? values[x].cluster_id:'missing'
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    if (!values[x].activity_type_id) {
                                                        obj = { label: false, property: 'activity_type_id', reason: '' }
                                                        obj.reason = values[x].activity_type_id ? values[x].activity_type_id:'missing';
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    if (!values[x].activity_description_id) {
                                                        obj = { label: false, property: 'activity_description_id', reason: '' }
                                                        obj.reason = values[x].activity_description_id ? values[x].activity_description_id:'missing'
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    count_error_beneficiaries += 1;
                                                }else{
                                                    beneficiaries_upload.push(values[x]);
                                                }


                                            }

                                        }else{
                                            stocks_upload =[];
                                            for (var x = 0; x < values.length; x++) {
                                                values[x] = $scope.upload.addMissingStockAttibute(values[x]);
                                                

                                                if ((!values[x].cluster) || (!values[x].stock_item_type)){
                                                    if (!$scope.messageFromfile[x]) {
                                                        $scope.messageFromfile[x] = []
                                                    }
                                                    if (!values[x].cluster) {
                                                        obj = { label: false, property: 'cluster_id', reason: '' }
                                                        obj.reason = values[x].cluster? values[x].cluster:'missing';
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    if (!values[x].stock_item_type) {
                                                        obj = { label: false, property: 'stock_item_type', reason: '' }
                                                        obj.reason = values[x].stock_item_type ? values[x].stock_item_type:'missing';
                                                        $scope.messageFromfile[x].push(obj)
                                                    }
                                                    count_error_stock += 1;
                                                }else{
                                                    stocks_upload.push(values[x]);
                                                }
                                            }


                                        }
                                        
                                        var upload = {};
                                        if ($scope.type === 'beneficiaries') {
                                            upload = { beneficiaries: beneficiaries_upload }
                                            url = '/api/cluster/project/setBeneficiariesById';
                                            if(count_error_beneficiaries>0){
                                                msg_info = 'Some Beneficairy Rows Succeccfully Updated'
                                            }else{
                                                msg_info = 'All Beneficairy Rows Succeccfully Updated'
                                            }
                                            
                                        } else {
                                            upload = { stocks: stocks_upload };
                                            url = '/api/cluster/stock/setStocksById';
                                            if (count_error_stock > 0) {
                                                msg_info = 'Some Stock Rows Succeccfully Updated'
                                            } else {
                                                msg_info = 'All Stock Rows Succeccfully Updated'
                                            }
                                        }
                                        M.toast({ html: $filter('translate')('processing'), displayLength: 6000, classes: 'note' });
                                        $http({
                                            method: 'POST',
                                            url: ngmAuth.LOCATION + url,
                                            data: upload
                                        }).success(function (report) {
                                            $scope.upload.addUpdatedStatus(report);
                                            $timeout(function () {
                                                // success
                                                document.querySelector(".percent-upload").style.display = 'none';
                                                $('#upload-file-report').modal('close');
                                                drop_zone.removeAllFiles(true);
                                                M.toast({ html: msg_info, displayLength: 4000, classes: 'success' });
                                                $("#upload_file").attr("disabled", true);
                                                $("#delete_file").attr("disabled", true);
                                                $("#switch_btn_file").attr("disabled", false);
                                                $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                $scope.messageFromfile=[];
                                            }, 2000)

                                        }).error(function (err) {
                                            // error
                                            $timeout(function () {
                                                document.querySelector(".percent-upload").style.display = 'none';
                                                $('#upload-file-report').modal('close');
                                                drop_zone.removeAllFiles(true);
                                                $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                M.toast({ html: 'Error', displayLength: 4000, classes: 'error' });
                                                $("#upload_file").attr("disabled", true);
                                                $("#delete_file").attr("disabled", true);
                                                $("#switch_btn_file").attr("disabled", false);
                                                $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                $scope.messageFromfile=[]
                                            }, 2000)
                                        });

                                    }else{
                                        $timeout(function () {
                                            document.querySelector(".percent-upload").style.display = 'none';
                                            $('#upload-file-report').modal('close');
                                            drop_zone.removeAllFiles(true);
                                            M.toast({ html: 'Empty File', displayLength: 4000, classes: 'error' });
                                            $("#upload_file").attr("disabled", true);
                                            $("#delete_file").attr("disabled", true);
                                            $("#switch_btn_file").attr("disabled", false);
                                            $scope.messageFromfile=[]
                                        }, 2000)
                                    }
                                }
                            } else {
                                file = drop_zone.getAcceptedFiles()[0]
                                const wb = new ExcelJS.Workbook();
                                drop_zone.getAcceptedFiles()[0].arrayBuffer().then((data) => {
                                    var values = []
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

                                        values = ngmClusterImportFile.setExcelValueToArrayofObject(book);

                                        if (values.length > 0) {
                                            var count_error_beneficiaries = 0;
                                            var count_error_stock = 0;
                                            if ($scope.type === 'beneficiaries') {
                                                beneficiaries_upload = [];
                                                for (var x = 0; x < values.length; x++) {
                                                    values[x] = $scope.upload.addMissingBeneficiaryAtribute(values[x]);

                                                    if ((!values[x].beneficiary_id) || (!values[x].activity_type_id) || (!values[x].activity_description_id) || (!values[x].cluster_id)) {
                                                        if (!$scope.messageFromfile[x]) {
                                                            $scope.messageFromfile[x] = []
                                                        }
                                                        obj = {}
                                                        if (!values[x].beneficiary_id) {
                                                            obj = { label: false, property: 'beneficiary_id', reason: '' }
                                                            obj.reason = values[x].beneficiary_id ? values[x].beneficiary_id : 'missing'
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        if (!values[x].cluster_id) {
                                                            obj = { label: false, property: 'cluster_id', reason: '' }
                                                            obj.reason = values[x].cluster_id ? values[x].cluster_id : 'missing'
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        if (!values[x].activity_type_id) {
                                                            obj = { label: false, property: 'activity_type_id', reason: '' }
                                                            obj.reason = values[x].activity_type_id ? values[x].activity_type_id : 'missing';
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        if (!values[x].activity_description_id) {
                                                            obj = { label: false, property: 'activity_description_id', reason: '' }
                                                            obj.reason = values[x].activity_description_id ? values[x].activity_description_id : 'missing'
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        count_error_beneficiaries += 1;
                                                    } else {
                                                        beneficiaries_upload.push(values[x]);
                                                    }


                                                }

                                            } else {
                                                stocks_upload = [];
                                                for (var x = 0; x < values.length; x++) {
                                                    values[x] = $scope.upload.addMissingStockAttibute(values[x]);

                                                    if ((!values[x].cluster) || (!values[x].stock_item_type)) {
                                                        if (!$scope.messageFromfile[x]) {
                                                            $scope.messageFromfile[x] = []
                                                        }
                                                        if (!values[x].cluster) {
                                                            obj = { label: false, property: 'cluster_id', reason: '' }
                                                            obj.reason = values[x].cluster ? values[x].cluster : 'missing';
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        if (!values[x].stock_item_type) {
                                                            obj = { label: false, property: 'stock_item_type', reason: '' }
                                                            obj.reason = values[x].stock_item_type ? values[x].stock_item_type : 'missing';
                                                            $scope.messageFromfile[x].push(obj)
                                                        }
                                                        count_error_stock += 1;
                                                    } else {
                                                        stocks_upload.push(values[x]);
                                                    }
                                                }


                                            }

                                            var upload = {};
                                            if ($scope.type === 'beneficiaries') {
                                                upload = { beneficiaries: beneficiaries_upload }
                                                url = '/api/cluster/project/setBeneficiariesById';
                                                if (count_error_beneficiaries > 0) {
                                                    msg_info = 'Some Beneficairy Rows Succeccfully Updated'
                                                } else {
                                                    msg_info = 'All Beneficairy Rows Succeccfully Updated'
                                                }

                                            } else {
                                                upload = { stocks: stocks_upload };
                                                url = '/api/cluster/stock/setStocksById';
                                                if (count_error_stock > 0) {
                                                    msg_info = 'Some Stock Rows Succeccfully Updated'
                                                } else {
                                                    msg_info = 'All Stock Rows Succeccfully Updated'
                                                }
                                            }
                                            M.toast({ html: $filter('translate')('processing'), displayLength: 6000, classes: 'note' });
                                            $http({
                                                method: 'POST',
                                                url: ngmAuth.LOCATION + url,
                                                data: upload
                                            }).success(function (report) {
                                                $scope.upload.addUpdatedStatus(report);
                                                $timeout(function () {
                                                    // success
                                                    document.querySelector(".percent-upload").style.display = 'none';
                                                    $('#upload-file-report').modal('close');
                                                    drop_zone.removeAllFiles(true);
                                                    M.toast({ html: msg_info, displayLength: 4000, classes: 'success' });
                                                    $("#upload_file").attr("disabled", true);
                                                    $("#delete_file").attr("disabled", true);
                                                    $("#switch_btn_file").attr("disabled", false);
                                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                    $scope.messageFromfile = [];
                                                }, 2000)

                                            }).error(function (err) {
                                                // error
                                                $timeout(function () {
                                                    document.querySelector(".percent-upload").style.display = 'none';
                                                    $('#upload-file-report').modal('close');
                                                    drop_zone.removeAllFiles(true);
                                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                    M.toast({ html: 'Error', displayLength: 4000, classes: 'error' });
                                                    $("#upload_file").attr("disabled", true);
                                                    $("#delete_file").attr("disabled", true);
                                                    $("#switch_btn_file").attr("disabled", false);
                                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                                    $scope.messageFromfile = []
                                                }, 2000)
                                            });

                                        } else {
                                            $timeout(function () {
                                                document.querySelector(".percent-upload").style.display = 'none';
                                                $('#upload-file-report').modal('close');
                                                drop_zone.removeAllFiles(true);
                                                M.toast({ html: 'Empty File', displayLength: 4000, classes: 'error' });
                                                $("#upload_file").attr("disabled", true);
                                                $("#delete_file").attr("disabled", true);
                                                $("#switch_btn_file").attr("disabled", false);
                                                $scope.messageFromfile = []
                                            }, 2000)
                                        }
                                        
                                    })
                                });
                               
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
                                $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">publish</i> <br/>` + $filter('translate')('drag_files_here_or_click_button_to_upload') + ' <br/> Please do not forget to put required sheets! <br/>with extention xlsx as per template in project downloads');
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
                            $('.dz-default.dz-message').html($scope.project.uploadFileReport.uploadFileConfig.dictDefaultMessage);
                            // $('.dz-default.dz-message').html(`<i class="medium material-icons" style="color:#009688;">error_outline</i> <br/>` + 'Please, import just one file at the time and remove exceeded file');
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
                uploadText:function(){
                    document.querySelector("#ngm-input-string").style.display = 'none';
                    document.querySelector(".percent-upload").style.display = 'block';
                    $("#input_string").attr("disabled", true);
                    $("#close_input_string").attr("disabled", true);
                    $("#switch_btn_text").attr("disabled", true);

                    if ($scope.upload.text_input ) {
                        csv_array = Papa.parse($scope.upload.text_input).data;
                        var attribute_to_check ='';
                        if($scope.type === 'beneficiaries'){
                            attribute_to_check = 'activity_type_id';
                        }else{
                            attribute_to_check = 'stock_item_type';
                        }
                        if (csv_array[0].indexOf(attribute_to_check) < 0){
                            $timeout(function () {
                                $scope.upload.messageWarning = 'Incorect Input! \n' + 'Header is Not Found';
                                $('#upload-file-report').modal('close');
                                document.querySelector("#ngm-input-string").style.display = 'block';
                                document.querySelector(".percent-upload").style.display = 'none';
                                $('#message-file-report').modal({ dismissible: false });
                                $('#message-file-report').modal('open');
                                $scope.upload.text_input = '';
                                document.querySelector("#input-string-area").style.display = 'block';
                                $scope.inputString = false;
                            }, 1000)
                            return
                        }
                        
                        values = ngmClusterImportFile.setCsvValueToArrayofObject(csv_array);

                        if (values.length > 0) {
                            var count_error_beneficiaries = 0;
                            var count_error_stock = 0;
                            if ($scope.type === 'beneficiaries') {
                                beneficiaries_upload = [];
                                for (var x = 0; x < values.length; x++) {
                                    values[x] = $scope.upload.addMissingBeneficiaryAtribute(values[x]);

                                    if ((!values[x].beneficiary_id) || (!values[x].activity_type_id) || (!values[x].activity_description_id) || (!values[x].cluster_id)) {
                                        if (!$scope.messageFromfile[x]) {
                                            $scope.messageFromfile[x] = []
                                        }
                                        obj = {}
                                        if (!values[x].beneficiary_id) {
                                            obj = { label: false, property: 'beneficiary_id', reason: '' }
                                            obj.reason = values[x].beneficiary_id ? values[x].beneficiary_id : 'missing'
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        if (!values[x].cluster_id) {
                                            obj = { label: false, property: 'cluster_id', reason: '' }
                                            obj.reason = values[x].cluster_id ? values[x].cluster_id : 'missing'
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        if (!values[x].activity_type_id) {
                                            obj = { label: false, property: 'activity_type_id', reason: '' }
                                            obj.reason = values[x].activity_type_id ? values[x].activity_type_id : 'missing';
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        if (!values[x].activity_description_id) {
                                            obj = { label: false, property: 'activity_description_id', reason: '' }
                                            obj.reason = values[x].activity_description_id ? values[x].activity_description_id : 'missing'
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        count_error_beneficiaries += 1;
                                    } else {
                                        beneficiaries_upload.push(values[x]);
                                    }


                                }

                            } else {
                                stocks_upload = [];
                                for (var x = 0; x < values.length; x++) {
                                    values[x] = $scope.upload.addMissingStockAttibute(values[x]);

                                    if ((!values[x].cluster) || (!values[x].stock_item_type)) {
                                        if (!$scope.messageFromfile[x]) {
                                            $scope.messageFromfile[x] = []
                                        }
                                        if (!values[x].cluster) {
                                            obj = { label: false, property: 'cluster_id', reason: '' }
                                            obj.reason = values[x].cluster ? values[x].cluster : 'missing';
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        if (!values[x].stock_item_type) {
                                            obj = { label: false, property: 'stock_item_type', reason: '' }
                                            obj.reason = values[x].stock_item_type ? values[x].stock_item_type : 'missing';
                                            $scope.messageFromfile[x].push(obj)
                                        }
                                        count_error_stock += 1;
                                    } else {
                                        stocks_upload.push(values[x]);
                                    }
                                }


                            }

                            var upload = {};
                            if ($scope.type === 'beneficiaries') {
                                upload = { beneficiaries: beneficiaries_upload }
                                url = '/api/cluster/project/setBeneficiariesById';
                                if (count_error_beneficiaries > 0) {
                                    msg_info = 'Some Beneficairy Rows Succeccfully Updated'
                                } else {
                                    msg_info = 'All Beneficairy Rows Succeccfully Updated'
                                }

                            } else {
                                upload = { stocks: stocks_upload };
                                url = '/api/cluster/stock/setStocksById';
                                if (count_error_stock > 0) {
                                    msg_info = 'Some Stock Rows Succeccfully Updated'
                                } else {
                                    msg_info = 'All Stock Rows Succeccfully Updated'
                                }
                            }

                            M.toast({ html: $filter('translate')('processing'), displayLength: 6000, classes: 'note' });
                            $http({
                                method: 'POST',
                                url: ngmAuth.LOCATION + url,
                                data: upload
                            }).success(function (report) {
                                $scope.upload.addUpdatedStatus(report);
                                $timeout(function () {
                                    // success
                                    document.querySelector(".percent-upload").style.display = 'none';
                                    $('#upload-file-report').modal('close');
                                    drop_zone.removeAllFiles(true);
                                    M.toast({ html: msg_info, displayLength: 4000, classes: 'success' });
                                    $("#upload_file").attr("disabled", true);
                                    $("#delete_file").attr("disabled", true);
                                    $("#switch_btn_file").attr("disabled", false);
                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                    $scope.messageFromfile = [];
                                }, 2000)

                            }).error(function (err) {
                                // error
                                $timeout(function () {
                                    document.querySelector(".percent-upload").style.display = 'none';
                                    $('#upload-file-report').modal('close');
                                    drop_zone.removeAllFiles(true);
                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                    M.toast({ html: 'Error', displayLength: 4000, classes: 'error' });
                                    $("#upload_file").attr("disabled", true);
                                    $("#delete_file").attr("disabled", true);
                                    $("#switch_btn_file").attr("disabled", false);
                                    $scope.upload.setMessageFromFile($scope.messageFromfile, $scope.type)
                                    $scope.messageFromfile = []
                                }, 2000)
                            });

                        } else {
                            $timeout(function () {
                                document.querySelector(".percent-upload").style.display = 'none';
                                $('#upload-file-report').modal('close');
                                drop_zone.removeAllFiles(true);
                                M.toast({ html: 'Empty File', displayLength: 4000, classes: 'error' });
                                $("#upload_file").attr("disabled", true);
                                $("#delete_file").attr("disabled", true);
                                $("#switch_btn_file").attr("disabled", false);
                                $scope.messageFromfile = []
                            }, 2000)
                        }

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
                },
                addMissingBeneficiaryAtribute:function(obj){
                    if (obj.implementing_partners && (typeof obj.implementing_partners === 'string')) {
                        var message_implementing_partners = ''
                        implementing_partners_string_array = obj.implementing_partners.split(',').map(function (org) {
                            return org.trim();
                        });
                        var temp = [];
                        var missing_org = [];
                        for (var index = 0; index < implementing_partners_string_array.length; index++) {
                            selected_org = $filter('filter')($scope.upload.organization, { organization_name: implementing_partners_string_array[index] }, true);
                            if (selected_org.length) {
                                temp.push(selected_org[0])
                            } else {
                                missing_org.push(implementing_partners_string_array[index])
                            }
                        }
                        obj.implementing_partners = temp;
                        if (missing_org.length > 0) {
                            var org = missing_org.join(',')
                            message_implementing_partners = { label: false, property: 'implementing_partners', reason: 'Organitazion Not in the List ( ' + org + ' )' };
                        }
                    }

                    if (obj.beneficiary_id){
                        // change property beneficiary_id to id
                        obj.id = obj.beneficiary_id;
                    }
                    if(obj.report_month_number){
                        obj.report_month = obj.report_month_number;
                    }
                    // float type
                    if (obj.admin3lat === '' || obj.admin3lng === '' || obj.admin4lat === '' || obj.admin4lng === '' || obj.admin5lat === '' || obj.admin5lng === ''){

                        if (obj.admin3lng === '') {
                            delete obj.admin3lng;
                        }
                        if (obj.admin3lat === '') {
                            delete obj.admin3lat;
                        }
                        if (obj.admin4lng === '') {
                            delete obj.admin4lng;
                        }
                        if (obj.admin4lat === '') {
                            delete obj.admin4lat;
                        }
                        if (obj.admin5lng === ''){
                            delete obj.admin5lng;
                        }
                        if (obj.admin5lat === '') {
                            delete obj.admin5lat;
                        }

                    }

                    return obj
                },
                addMissingStockAttibute:function(obj){
                    if (obj.stock_details) {
                        obj.stock_details = obj.stock_details.split(',').map(function (org) {

                            org.trim();
                            org = org.split(':')
                            var quantitiy = org[1].trim() === 'n/a' ? 0 : parseInt(org[1].trim());
                            detail_obj = {
                                unit_type_name: org[0].trim(),
                                unit_type_quantity: quantitiy
                            }
                            return detail_obj;

                        });

                    }
                    if(obj.stock_id){
                        obj.id = obj.stock_id;
                    }
                    if(obj.report_month && typeof obj.report_month === 'string'){
                       obj.report_month = moment().month(obj.report_month).format("M")
                    }
                    return obj;
                },
                setMessageFromFile: function (messageList, form) {
                    var message_temp = '';
                    for (var z = 0; z < messageList.length; z++) {
                        if (messageList[z].length) {
                            for (var y = 0; y < messageList[z].length; y++) {

                                var field = messageList[z][y].property;
                                var reason = messageList[z][y].reason;
                                if(field !== 'status'){
                                    if (form === 'beneficiaries' && (field === 'activity_type_id' || field === 'activity_description_id' || field === 'cluster_id')) {
                                        
                                            message_temp += 'For Incorrect Cluster or Activity Type or Activity Description \nPlease check spelling, or verify that this is a correct value for this report! \n'
                                    } else if (form === 'stocks' && (field === 'stock_item_type' || field === 'cluster_id')){
                                    
                                            message_temp += 'For Incorrect Stock Type or Cluster \nPlease check spelling, or verify that this is a correct value for this report! \n'
                                        
                                    } else{
                                        message_temp += 'For incorrect values please check spelling, or verify that this is a correct value for this report! \n'
                                    }

                                            
                                            
                                    message_temp += 'Incorrect value at: row ' + (z + 2) + ', ' + field + ' : ' + reason + '\n';
                                }else{
                                    message_temp += 'Row ' + (z + 2) +', '+ field +': '+ reason +'\n';
                                    message_temp += '================================================'+'\n';
                                }
                            }
                        }

                    }
                    
                    if (message_temp !== '') {

                        $scope.upload.messageWarning = message_temp;
                        $timeout(function () {
                            $('#message-file-report').modal({ dismissible: false });
                            $('#message-file-report').modal('open');
                        })

                    }
                },
                addUpdatedStatus: function(data) {
                    if($scope.type === 'beneficiaries'){
                        data = data.beneficiaries
                    }else{
                        data = data.stocks
                    }
                    
                    for (var z = 0; z < data.length; z++) {
                        if (!$scope.messageFromfile[z]) { $scope.messageFromfile[z]=[]}
                        obj = { label: false, property: 'status', reason: '' }
                        if($scope.messageFromfile[z].length<1){
                            obj.reason =  data[z].updated ? 'Record Updated': 'Not Updated';
                        }else{
                            obj.reason = 'Record Not Updated';
                        }
                        $scope.messageFromfile[z].push(obj)
                    }
                },
                getBeneficiaryTitle: function (beneficiary) {
                    // title
                    var title = beneficiary.activity_type_name;
                    // activity_description_id
                    if (beneficiary.activity_description_id) {
                        title += ', ' + beneficiary.activity_description_name;
                    }
                    // activity_detail_id
                    if (beneficiary.activity_detail_id) {
                        title += ', ' + beneficiary.activity_detail_name;
                    }
                    return title;
                },
                getStockTitle:function(item) {
                    if(item.stock_item_type){
                        title = item.stock_item_name;
                    }
                    return title
                },
                getBeneficiarylocationTitle: function (item) {

                    // default admin 1,2
                    var title = '';

                    // location_type_id
                    switch (item.site_type_id) {

                        // refugee_camp
                        case 'refugee_camp':

                            // site_type_name
                            if (item.site_type_name) {
                                title += item.site_type_name + ': ';
                            }

                            // admin1, admin2
                            title += item.admin1name + ', ' + item.admin2name;

                            // site_name
                            title += ', ' + item.site_name;

                            break;

                        // food_distribution_point
                        case 'food_distribution_point':

                            // type + title
                            title += item.site_type_name + ' ' + item.site_name + ': ';

                            // admin1, admin2
                            title += item.admin1name + ', ' + item.admin2name + ', ' + item.admin3name;

                            break;

                        // refugee_block
                        case 'refugee_block':

                            // site_type_name
                            if (item.site_type_name) {
                                title += item.site_type_name + ': ';
                            }

                            // admin1, admin2
                            title += item.admin1name + ', ' + item.admin2name;

                            // site_name
                            title += ', ' + item.site_name;

                            break;

                        // default
                        default:

                            // site_type_name
                            if (item.site_type_name) {
                                title += item.site_type_name + ': ';
                            }

                            // admin1, admin2
                            title += item.admin1name + ', ' + item.admin2name;

                            // admin levels 3,4,5
                            if (item.admin3name) {
                                title += ', ' + item.admin3name;
                            }
                            if (item.admin4name) {
                                title += ', ' + item.admin4name;
                            }
                            if (item.admin5name) {
                                title += ', ' + item.admin5name;
                            }

                            // site_name
                            title += ', ' + item.site_name;

                            break;
                    }

                    return title;
                },
                updateNameStock:function( list, key, name, item ){
                    $timeout(function () {
                        var obj = {}
                        obj[key] = item[key];
                        var select = $filter('filter')(list, obj, true);
                        

                        // set name
                        if (select.length) {
                            // name
                            item[name] = select[0][name];
                        }
                        // clear name
                        if (item[key] === null) {
                            item[name] = null;
                        }
                        
                    },0)

                },
                validateStock: function(stock,i){
                    valid = true;
                    divs =[];

                    if (!stock.cluster_id){
                        id = "label[for='" + 'ngm-stocks_cluster_id-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }

                    if (stock.admin0pcode !== 'ET'){
                        if(!stock.stock_item_purpose_id) {
                            id = "label[for='" + 'ngm-stock_item_purpose_id-' + i + "']";
                            divs.push(id);
                            $(id).addClass('error');
                            valid = false;
                        }
                    }
                    if (!stock.stock_targeted_groups_id){
                        id = "label[for='" + 'ngm-stock_targeted_groups_id-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false
                    }
                    if (!stock.stock_item_type){
                        id = "label[for='" + 'ngm-stock_item_type-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid=false
                    }
                    if(stock.admin0pcode ==='ET'){
                        if (!stock.stock_type_id){
                            id = "label[for='" + 'ngm-stock_type_id-' + i + "']";
                            divs.push(id);
                            $(id).addClass('error');
                            valid = false;
                        }
                    }

                    if (!stock.stock_status_id){
                        id = "label[for='" + 'ngm-stock_status_id-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }
                    if (stock.number_in_stock === null || stock.number_in_stock === undefined || stock.number_in_stock === NaN || stock.number_in_stock < 0 || stock.number_in_stock === '') {
                        id = "label[for='" + 'ngm-number_in_stock-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }

                    if (stock.number_in_pipeline === null || stock.number_in_pipeline === undefined || stock.number_in_pipeline === NaN || stock.number_in_pipeline < 0 || stock.number_in_pipeline === '') {
                        id = "label[for='" + 'ngm-number_in_pipeline-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }

                    if (!stock.unit_type_id){
                        id = "label[for='" + 'ngm-stock_unit_type_id-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }

                    if (stock.beneficiaries_covered === null || stock.beneficiaries_covered === undefined || stock.beneficiaries_covered === NaN || stock.beneficiaries_covered < 0 || stock.beneficiaries_covered === ''){
                        id = "label[for='" + 'ngm-stock_beneficiaries_covered-' + i + "']";
                        divs.push(id);
                        $(id).addClass('error');
                        valid = false;
                    }
                    // valid = false;
                    if(divs.length>0){
                        $timeout(function () { $(divs[0]).animatescroll() }, 100);
                    }
                    
                    
                    return valid
                    
                },
                validateBeneficiary:function(b,i){
                    valid = true;
                    divs=[];

                    if (!b.activity_type_id) {
                        id = "label[for='" + 'ngm-activity_type_id-' + i + "']";
                        $(id).addClass('error');
                        divs.push(id);
                        valid = false;
                    }
                    
                    

                    if (!b.activity_description_id) {
                        id = "label[for='" + 'ngm-activity_description_id-' + i + "']";
                        $(id).addClass('error');
                        divs.push(id);
                        valid = false;
                    }
                    
                    

                    // DETAIL
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['display_activity_detail']) {
                        if (!b.activity_detail_id) {
                            id = "label[for='" + 'ngm-activity_detail_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    

                    
                    

                    // INDICATOR
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['display_indicator']) {
                        if (!b.indicator_id) {
                            id = "label[for='" + 'ngm-indicator_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    

                    if (!b.beneficiary_type_id) {
                        id = "label[for='" + 'ngm-beneficiary_type_id-' + i + "']";
                        $(id).addClass('error');
                        divs.push(id);
                        valid = false;
                    }
                    
                    

                    if (ngmClusterBeneficiaries.form[0][i] && !ngmClusterBeneficiaries.form[0][i]['hrp_beneficiary_type_id'] && (b.admin0pcode === 'AF') && b.project_hrp_project) {

                        if (!b.hrp_beneficiary_type_id) {
                            id = "label[for='" + 'ngm-hrp-beneficiary_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                        
                        
                    }

                    // CATEGORY
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['beneficiary_category_type_id']) {
                        if (!b.beneficiary_category_id) {
                            id = "label[for='" + 'ngm-beneficiary_category_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    //CASH + PACKAGE
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_delivery_type_id']) {
                        if (!b.mpc_delivery_type_id) {
                            id = "label[for='" + 'ngm-mpc_delivery_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_mechanism_type_id']) {
                        // QUICK FIX HARDCODE TODO: REFACTOR
                        if (!b.mpc_mechanism_type_id && b.mpc_delivery_type_id !== 'in-kind') {
                            id = "label[for='" + 'ngm-mpc_mechanism_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_transfer_type_id']) {
                        if (!b.transfer_type_id && b.mpc_delivery_type_id !== 'in-kind') {
                            id = "label[for='" + 'ngm-transfer_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['mpc_package_type_id']) {
                        if (!b.package_type_id && b.mpc_delivery_type_id !== 'in-kind') {
                            id = "label[for='" + 'ngm-package_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    
                    

                    // UNIT TYPE
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['unit_type_id']) {
                        if (!b.unit_type_id) {
                            id = "label[for='" + 'ngm-unit_type_id-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    // UNITS
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['units']) {
                        if (b.units === null || b.units === undefined || b.units === NaN || b.units < 0) {
                            id = "label[for='" + 'ngm-units-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    // HH
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['households']) {
                        if (b.households === null || b.households === undefined || b.households === NaN || b.households < 0) {
                            id = "label[for='" + 'ngm-households-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    // FAMILIES
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['families']) {
                        if (b.families === null || b.families === undefined || b.families === NaN || b.families < 0) {
                            id = "label[for='" + 'ngm-families-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    // SADD
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys']) {
                        if (b.boys === null || b.boys === undefined || b.boys === NaN || b.boys < 0) {
                            id = "label[for='" + 'ngm-boys-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_0_5']) {
                        if (b.boys_0_5 === null || b.boys_0_5 === undefined || b.boys_0_5 === NaN || b.boys_0_5 < 0) {
                            id = "label[for='" + 'ngm-boys_0_5-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_6_11']) {
                        if (b.boys_6_11 === null || b.boys_6_11 === undefined || b.boys_6_11 === NaN || b.boys_6_11 < 0) {
                            id = "label[for='" + 'ngm-boys_6_11-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['boys_12_17']) {
                        if (b.boys_12_17 === null || b.boys_12_17 === undefined || b.boys_12_17 === NaN || b.boys_12_17 < 0) {
                            id = "label[for='" + 'ngm-boys_12_17-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_male']) {
                        if (b.total_male === null || b.total_male === undefined || b.total_male === NaN || b.total_male < 0) {
                            id = "label[for='" + 'ngm-total_male-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls']) {
                        if (b.girls === null || b.girls === undefined || b.girls === NaN || b.girls < 0) {
                            id = "label[for='" + 'ngm-girls-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_0_5']) {
                        if (b.girls_0_5 === null || b.girls_0_5 === undefined || b.girls_0_5 === NaN || b.girls_0_5 < 0) {
                            id = "label[for='" + 'ngm-girls_0_5-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_6_11']) {
                        if (b.girls_6_11 === null || b.girls_6_11 === undefined || b.girls_6_11 === NaN || b.girls_6_11 < 0) {
                            id = "label[for='" + 'ngm-girls_6_11-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['girls_12_17']) {
                        if (b.girls_12_17 === null || b.girls_12_17 === undefined || b.girls_12_17 === NaN || b.girls_12_17 < 0) {
                            id = "label[for='" + 'ngm-girls_12_17-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_female']) {
                        if (b.total_female === null || b.total_female === undefined || b.total_female === NaN || b.total_female < 0) {
                            id = "label[for='" + 'ngm-total_female-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['men']) {
                        if (b.men === null || b.men === undefined || b.men === NaN || b.men < 0) {
                            id = "label[for='" + 'ngm-men-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['women']) {
                        if (b.women === null || b.women === undefined || b.women === NaN || b.women < 0) {
                            id = "label[for='" + 'ngm-women-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['elderly_men']) {
                        if (b.elderly_men === null || b.elderly_men === undefined || b.elderly_men === NaN || b.elderly_men < 0) {
                            id = "label[for='" + 'ngm-elderly_men-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['elderly_women']) {
                        if (b.elderly_women === null || b.elderly_women === undefined || b.elderly_women === NaN || b.elderly_women < 0) {
                            id = "label[for='" + 'ngm-elderly_women-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }

                    // TOTAL
                    if (ngmClusterBeneficiaries.form[0][i] && ngmClusterBeneficiaries.form[0][i]['total_beneficiaries']) {
                        if (b.total_beneficiaries === null || b.total_beneficiaries === undefined || b.total_beneficiaries === NaN || b.total_beneficiaries < 0) {
                            id = "label[for='" + 'ngm-total_beneficiaries-' + i + "']";
                            $(id).addClass('error');
                            divs.push(id);
                            valid = false;
                        }
                    }
                    if (divs.length > 0) {
                        $timeout(function () { $(divs[0]).animatescroll() }, 100);
                    }
                    return valid
                },
                save:function(type,item,index){
                    // msg
                    
                    M.toast({ html:'Processing', displayLength: 3000, classes: 'note' });
                    result = type === 'beneficiaries' ? $scope.upload.validateBeneficiary(item,index) :$scope.upload.validateStock(item,index);
                    if(!result){
                        if(type === 'beneficiaries'){
                            M.toast({ html: $filter('translate')('Beneficiaries Contain Error'), displayLength: 6000, classes: 'error' });
                        }else{
                            M.toast({ html: $filter('translate')('Stock Contain Error'), displayLength: 6000, classes: 'error' });
                        }         
                        return
                    }
                     
                    
                    // setReportRequest
                    var setReportRequest = {
                        method: 'POST',
                        url: ngmAuth.LOCATION,
                        data:{}
                    }
                    var success_msg='';
                    if (type === 'beneficiaries'){
                        setReportRequest.url +='/api/cluster/project/setBeneficiaryById';
                        setReportRequest.data = { beneficiary: item}
                         success_msg = 'Beneficiary Successfully Updated'
                    }else{
                        setReportRequest.url += '/api/cluster/stock/setStockById';
                        setReportRequest.data= {stock:item}
                        success_msg = 'Stock Successfully Updated'
                    }

                    $http(setReportRequest).success(function (record) {
                        index = $scope.upload.list.findIndex(x => x.id === record.id);
                        $scope.upload.list[index] = record;
                        $timeout(function () {
                            M.toast({ html: success_msg, displayLength: 6000, classes: 'success' });
                        },3000);
                    }).error(function (err) {
                        M.toast({ html: 'Error', displayLength: 6000, classes: 'error' });
                        if (err.err){
                            M.toast({ html: err.err, displayLength: 6000, classes: 'error' });
                        }
                    });

                    
                    

                },
                removeRecord:function(item){
                    $('#remove-record-modal').modal({ dismissible: false });
                    $('#remove-record-modal').modal('open');
                    $scope.removeRecordId = item.id ? item.id : item._id;
                },
                removeRecordById:function(type){
                    var setRemoveRequest = {
                        method: 'POST',
                        url: ngmAuth.LOCATION,
                        data: { id: $scope.removeRecordId }
                    }
                    
                    if (type === 'beneficiaries') {
                        setRemoveRequest.url += '/api/cluster/report/removeBeneficiary';
                    }else{
                        setRemoveRequest.url += '/api/cluster/stock/removeStock';
                    }

                    M.toast({ html: 'Processing!', displayLength: 4000, classes: 'note' });
                    $http(setRemoveRequest).success(function (result) {
                        if (result.err) {
                            // Materialize.toast( 'Error! Please correct the ROW and try again', 4000, 'error' );
                            M.toast({ html: 'Error! Please try again', displayLength: 4000, classes: 'error' });
                        }
                        if (!result.err) { 
                            $timeout(function () {
                            index = $scope.upload.list.findIndex(x => x.id === $scope.removeRecordId);
                            $scope.upload.list.splice(index, 1);
                           
                                M.toast({ html: 'Record succesfully removed!', displayLength: 4000, classes: 'success' });
                            },3000)
                            
                         }
                    }).error(function (err) {
                        // Materialize.toast( 'Error!', 4000, 'error' );
                        $timeout(function () {
                            M.toast({ html: 'Error! Please try again!', displayLength: 4000, classes: 'error' });
                        },3000)
                        
                    });
                },
                openCloseRecord:function(index){
                    
                    
                    var start_date = moment($route.current.params.start).format('YYYY-MM-DD');
                    var end_date = moment($route.current.params.end).format('YYYY-MM-DD');
                    var item = $scope.upload.list[index];
                    if($scope.type === 'beneficiaries'){
                        $scope.detailBeneficiaries[index] = !$scope.detailBeneficiaries[index];
                        $scope.upload.lists.beneficiary_types = ngmClusterLists.getBeneficiaries(moment(end_date).year(), item.admin0pcode, item.cluster_id),
                        $scope.upload.lists.beneficiary_categories = ngmClusterLists.getBeneficiariesCategories(item.admin0pcode),
                        $scope.upload.lists.hrp_beneficiary_types= ngmClusterLists.getHrpBeneficiaries(item.admin0pcode, moment(end_date).year())
                        $scope.upload['definition']={}
                        $scope.upload['definition']['activity_type'] =[] 
                        $scope.upload.definition['activity_type'] = item.activity_type;
                        
                        $scope.beneficiariesList[index] = $scope.upload.lists;
                    }else{
                        $scope.detailStocks[index] = !$scope.detailStocks[index];
                        $scope.upload.lists.stocks = ngmClusterLists.getStockLists(item.admin0pcode)
                        $scope.stocksList[index] = $scope.upload.lists.stocks
                    }
                    
                },

                currentMonth: config.getCurrentMonth,
                prevMonth: config.getPreviousMonth,

                dateRecord:function(item){
                    month = (item.report_month+1).toString()
                   var month= moment(month).format('MMMM');
                    return month + ', ' + item.report_year
                },

                init:function(){
                    var start_date = moment($route.current.params.start).format('YYYY-MM-DD');
                    var end_date = moment($route.current.params.end).format('YYYY-MM-DD');
                    $scope.upload.lists = {
                        activity_types: ngmClusterLists.getActivities({}, true, ['activity_type_id'], true, start_date, end_date),
                        activity_descriptions: ngmClusterLists.getActivities({}, true, ['activity_description_id', 'activity_type_id'], true, start_date, end_date),
                        activity_details: ngmClusterLists.getActivities({}, true, ['activity_detail_id', 'activity_description_id', 'activity_type_id'], true, start_date, end_date),
                        activity_indicators: ngmClusterLists.getActivities({}, true, ['indicator_id', 'activity_detail_id', 'activity_description_id', 'activity_type_id'], true, start_date, end_date),
                        
                    }
                    if ($scope.type === 'beneficiaries') {
                        for (i in data.data) {
                            data.data[i]['id'] = data.data[i]._id;
                        }
                    }
                    $scope.upload.list = data.data;
                    if ($scope.type === 'beneficiaries') {
                        $scope.detailBeneficiaries = $scope.upload.list.length ? new Array($scope.upload.list.length).fill(false) : new Array(0).fill(false);
                        // set list for each item
                        $scope.beneficiariesList = new Array($scope.upload.list.length);
                    }else{
                        $scope.detailStocks = $scope.upload.list.length ? new Array($scope.upload.list.length).fill(false) : new Array(0).fill(false);
                        // set list for each item
                        $scope.stocksList = new Array($scope.upload.list.length)
                    }
                      
                    // set form for beneficiaries form    
                    if ($scope.type === 'beneficiaries') {
                        ngmClusterBeneficiaries.setBeneficiariesForm($scope.upload.lists, 0, $scope.upload.list);
                    }
                    
                    
                    

                }
                    
            }

            $scope.upload.init();
            
        }

    ])