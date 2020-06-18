angular.module('ngmReportHub')
    .factory('ngmClusterImportFile',
        ['ngmAuth',
            'ngmData',
            'ngmUser',
            '$timeout',
            '$filter',
            '$http',
            '$rootScope',
            '$sce',
            function (ngmAuth, ngmData, ngmUser, $timeout, $filter, $http, $rootScope, $sce) {
                var ngmClusterImportFile = {
                    templatePreview:function(){
                        preview = `	<div class="dz-preview dz-processing dz-image-preview dz-success dz-complete">
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
																		</div>`
                        return preview
                    },
                    
                    copyToClipBoard: function(id) {
                        /* Get the text field */
                        var copyText = document.getElementById(id);

                        /* Select the text field */
                        copyText.select();
                        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

                        /* Copy the text inside the text field */
                        document.execCommand("copy");

                        M.toast({ html: 'Copy too Clipboard', displayLength: 1000, classes: 'note' });
                    },
                    // set message 
                    setMessageFromFile: function (messageList, list_field,form, id_of_modal_message){
                        var message_temp = '';
                        for (var z = 0; z < messageList.length; z++) {
                            if (messageList[z].length) {
                                for (var y = 0; y < messageList[z].length; y++) {

                                    var field = messageList[z][y].property;
                                    var reason = messageList[z][y].reason;
                                    var error_label = messageList[z][y].label;
                                    if (error_label) {
                                        $(error_label).addClass('error');
                                    }
                                    // monthly report
                                    if (field === 'location' && form === 'report') {
                                        message_temp += 'For Incorrect Location please check admin1 Name, admin2 Name, site type, site implementation, site name ! \n'
                                    } else if ((field === 'activity_type_id' && form === 'report') || (field === 'activity_description_id' && form === 'report')) {
                                        message_temp += 'For Incorrect Activity Type or Activity Description \nPlease check spelling, or verify that this is a correct value for this report! \n'
                                    } 
                                    // stock
                                    else if (field === 'location' && form ==='stock') {
                                        message_temp += 'For Incorrect Location please check admin1 Name, admin2 Name, site name ! \n'
                                    } else if (field === 'stock_item_type' || (field === 'cluster_id' && form === 'stock') ) {
                                        message_temp += 'For Incorrect Stock Type or Cluster \nPlease check spelling, or verify that this is a correct value for this report! \n'
                                    } 
                                    // stock list /warehouse
                                    else if ((field === 'admin1' && form === 'stock_list') || (field === 'admin2' && form === 'stock_list')) {
                                        message_temp += 'For Incorrect (Admin1 Pcode or Admin1 Name) and (Admin2 Pcode or Admin2 Name),\nPlease Check Your Name and Code Location for Admin1 Pcode, Admin1 Name or  Admin2 Pcode, Admin1 Name are on the List! \n'
                                    } 
                                    // financial
                                    else if ((field === 'activity_type_id' && form === 'financial') || (field === 'project_donor_id' && form === 'financial')) {
                                        message_temp += 'For Incorrect Activity Type or Project Donor \nPlease check spelling, or verify that this is a correct value for this report! \n'
                                    }
                                    else {
                                        message_temp += 'For incorrect values please check spelling, or verify that this is a correct value for this report! \n'
                                    }
                                    message_temp += 'Incorrect value at: row ' + (z + 2) + ', ' + list_field[field] + ' : ' + reason + '\n';

                                }
                            }

                        }

                        // set error again if class error not added

                        $timeout(function(){
                            for (var z = 0; z < messageList.length; z++) {
                                if (messageList[z].length) {
                                    for (var y = 0; y < messageList[z].length; y++) {
                                        var error_label = messageList[z][y].label;
                                        if (error_label) {
                                            $(error_label).addClass('error');
                                        }
                                    }
                                }

                            }
                        },0)


                        // if (message_temp !== '') {
                        //     $timeout(function () {
                        //         $('#'+id_of_modal_message).modal({ dismissible: false });
                        //         $('#'+id_of_modal_message).modal('open');
                        //     })

                        // }

                        return message_temp;
                    },

                    // map file atrribute to array
                    // #warehouse
                    listheaderAttributeInFile: function(file_type) {
                         header = 
                         {  warehouse :
                            {
                                'Admin1 Pcode': 'admin1pcode',
                                'Admin1 Name': 'admin1name',
                                'Admin2 Pcode': 'admin2pcode',
                                'Admin2 Name': 'admin2name',
                                'Location Name': 'site_name'
                            },
                            stock:{
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
                                'Purpose': 'stock_item_purpose_name'
                            },
                            financial:{
                                'Cluster': 'cluster',
                                'Organization': 'organization',
                                'Country': 'admin0name',
                                'Project Title': 'project_title',
                                'Project Description': 'project_description',
                                'HRP Project Code': 'project_hrp_code',
                                'Project Budget': 'project_budget',
                                'Project Budget Currency': 'project_budget_currency',
                                'Project Donor': 'project_donor_name',
                                'Donor Grant ID': 'grant_id',
                                'Currency Recieved': 'currency_id',
                                'Ammount Received': 'project_budget_amount_recieved',
                                'Contribution Status': 'contribution_status',
                                'Date of Payment': 'project_budget_date_recieved',
                                'Incoming Funds': 'budget_funds_name',
                                'Financial Programming': 'financial_programming_name',
                                'Multi-Year Funding': 'multi_year_funding_name',
                                'Funding Per Year': 'multi_year_array',
                                'Reported on FTS': 'reported_on_fts_name',
                                'FTS ID': 'fts_record_id',
                                'Email': 'email',
                                'createdAt': 'createdAt',
                                'Comments': 'comments',
                                'Activity Type': 'activity_type_name',
                                'Funding Per Year': 'multi_year_array',
                                'Activity Description': 'activity_description_name'
                            },
                            monthly_report:{
                                'Project ID': 'project_id',
                                'Report ID': 'report_id',
                                'Target Location ID': 'target_location_reference_id',
                                'Cluster': 'cluster',
                                'Organization': 'organization',
                                'Focal Point': 'username',
                                'Email': 'email',
                                'HRP Code': 'project_hrp_code',
                                'Project Title': 'project_title',
                                'Project Code': 'project_code',
                                'Project Donors': 'donors',
                                'Programme Partners': 'programme_partners',
                                'Implementing Partners': 'implementing_partners',
                                'Country': 'admin0name',
                                'Admin1 Pcode': 'admin1pcode',
                                'Admin1 Name': 'admin1name',
                                'Admin2 Pcode': 'admin2pcode',
                                'Admin2 Name': 'admin2name',
                                'Admin3 Pcode': 'admin3pcode',
                                'Admin3 Name': 'admin3name',
                                'Site Implementation': 'site_implementation_name',
                                'Site Type': 'site_type_name',
                                'Location Name': 'site_name',
                                'Report Month': 'report_month',
                                'Report Year': 'report_year',
                                'Activity Type': 'activity_type_name',
                                'Activity Description': 'activity_description_name',
                                'Activity Details': 'activity_detail_name',
                                'Indicator': 'indicator_name',
                                'Category Type': 'category_type_name',
                                'Beneficiary Type': 'beneficiary_type_name',
                                'Beneficiary Category': 'beneficiary_category_name',
                                'HRP Beneficiary Type': 'hrp_beneficiary_type_name',
                                'Strategic Objective': 'strategic_objective_name',
                                'Strategic Objective Description': 'strategic_objective_description',
                                'Sector Objective': 'sector_objective_name',
                                'Sector Objective Description': 'sector_objective_description',
                                'Population': 'delivery_type_name',
                                'Amount': 'units',
                                'Unit Type': 'unit_type_name',
                                'Cash Transfers': 'transfer_type_value',
                                // 'Cash Delivery Type': 'mpc_delivery_type_id',
                                'Cash Delivery Type': 'mpc_delivery_type_name',
                                'Cash Mechanism Type': 'mpc_mechanism_type_name',
                                'Package Type': 'package_type_name',
                                'Households': 'households',
                                'Families': 'families',
                                'Boys': 'boys',
                                'Girls': 'girls',
                                'Men': 'men',
                                'Women': 'women',
                                'Elderly Men': 'elderly_men',
                                'Elderly Women': 'elderly_women',
                                'Total': 'total_beneficiaries',
                                'Created': 'createdAt',
                                'Last Update': 'updatedAt'
                            },
                             detail: {
                                 'Project ID': 'id',
                                 'Project Status': 'project_status',
                                 'Project Details': 'project_details',
                                 'Focal Point': 'name',
                                 'Email': 'email',
                                 'Phone': 'phone',
                                 'Project Title': 'project_title',
                                 'Project Description': 'project_description',
                                 'HRP Project Code': 'project_hrp_code',
                                 'Project Start Date': 'project_start_date',
                                 'Project End Date': 'project_end_date',
                                 'Project Budget': 'project_budget',
                                 'Project Budget Currency': 'project_budget_currency',
                                 'Project Donors': 'project_donor',
                                 'Implementing Partners': 'implementing_partners',
                                 'URL': 'url'
                             },
                             activity_type: {
                                 'Cluster': 'cluster',
                                 'Activity Type': 'activity_type_name',
                             },
                             target_location: {
                                 'Country': 'admin0name',
                                 'Admin1 Pcode': 'admin1pcode',
                                 'Admin1 Name': 'admin1name',
                                 'Admin2 Pcode': 'admin2pcode',
                                 'Admin2 Name': 'admin2name',
                                 'Admin3 Pcode': 'admin3pcode',
                                 'Admin3 Name': 'admin3name',
                                 'Site Implementation': 'site_implementation_name',
                                 'Site Type': 'site_type_name',
                                 'Location Name': 'site_name',
                                 'Implementing Partners': 'implementing_partners',
                                 'Reporter': 'username',
                             },
                             target_beneficiary: {
                                 'Cluster': 'cluster',
                                 'Activity Type': 'activity_type_name',
                                 'Activity Description': 'activity_description_name',
                                 'Activity Details': 'activity_detail_name',
                                 'Indicator': 'indicator_name',
                                 'Beneficiary Type': 'beneficiary_type_name',
                                 'HRP Beneficiary Type': 'hrp_beneficiary_type_name',
                                 'Beneficiary Category': 'beneficiary_category_name',
                                 'Amount': 'units',
                                 'Unit Types': 'unit_type_name',
                                 'Cash Transfers': 'transfer_type_value',
                                 'Cash Delivery Types': 'mpc_delivery_type_name',
                                 'Cash Mechanism Types': 'mpc_mechanism_type_name',
                                 'Package Type': 'package_type_name',
                                 'Households': 'households',
                                 'Families': 'families',
                                 'Boys': 'boys',
                                 'Girls': 'girls',
                                 'Men': 'men',
                                 'Women': 'women',
                                 'Elderly Men': 'elderly_men',
                                 'Elderly Women': 'elderly_women',
                                 'Total': 'total_beneficiaries',
                             }
                        }
                        return header[file_type]
                        
                    },

                    
                    setExcelValueToArrayofObject: function (book){
                        book_obj =[];
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
                        return book_obj;
                    },
                    setCsvValueToArrayofObject: function (array) {
                        var values_obj = [];
                        for (var y = 1; y < array.length; y++) {
                            var obj = {}
                            for (var z = 0; z < array[y].length; z++) {
                                if (
                                    // beneficiary
                                    array[0][z] === 'Families' ||
                                    array[0][z] === 'Boys' ||
                                    array[0][z] === 'Girls' ||
                                    array[0][z] === 'Men' ||
                                    array[0][z] === 'Women' ||
                                    array[0][z] === 'Elderly Men' ||
                                    array[0][z] === 'Elderly Women' ||
                                    array[0][z] === 'Total' ||
                                    array[0][z] === 'Cash Transfers' ||
                                    array[0][z] === 'Amount' ||
                                    array[0][z] === 'Households' ||
                                    array[0][z] === 'families' ||
                                    array[0][z] === 'boys' ||
                                    array[0][z] === 'girls' ||
                                    array[0][z] === 'men' ||
                                    array[0][z] === 'women' ||
                                    array[0][z] === 'elderly_men' ||
                                    array[0][z] === 'elderly_women' ||
                                    array[0][z] === 'total' ||
                                    array[0][z] === 'transfer_type_value' ||
                                    array[0][z] === 'units' ||
                                    array[0][z] === 'households' ||
                                    array[0][z] === 'site_population' ||
                                    // financial
                                    array[0][z] === 'Project Budget' ||
                                    array[0][z] === 'Ammount Received' ||
                                    // stock
                                    array[0][z] === 'Beneficiary Coverage' ||
                                    array[0][z] === 'No. in Pipeline' ||
                                    array[0][z] === 'No. in Stock' ||
                                    array[0][z] === 'Stock Year') {
                                    array[y][z] = parseInt(array[y][z]);
                                }

                                obj[array[0][z]] = array[y][z];
                            }
                            values_obj.push(obj)
                        }

                        return values_obj;
                    },
                    transform_to_obj:function(arr,header) {
						var transform_array = [];
                        for (var y = 1; y < arr.length; y++) {
                            var obj = {}
                            for (var z = 1; z < arr[y].length; z++) {
                                if (arr[y][z] === undefined) {
                                    arr[y][z] = "";
                                }
                                // obj[arr[0][z]] = arr[y][z];
                                attribute = header[arr[0][z]]
                                obj[attribute] = arr[y][z];
                            }
                            transform_array.push(obj)
                        }



                        return transform_array;
                    }


                }

                return ngmClusterImportFile;

            }]);
