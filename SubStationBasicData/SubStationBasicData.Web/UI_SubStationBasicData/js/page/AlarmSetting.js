$(function() {
    loadDatagrid("first");
    initPageAuthority();
});
function onOrganisationTreeClick(node) {
    $('#productLineName').textbox('setText', node.text);
    $('#organizationId').val(node.OrganizationId);
    loadDatagrid("last");
}
//初始化页面的增删改查权限
function initPageAuthority() {
    $.ajax({
        type: "POST",
        url: "AlarmSetting.aspx/AuthorityControl",
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,//同步执行
        success: function (msg) {
            var authArray = msg.d;
            //增加
            //if (authArray[1] == '0') {
            //    $("#add").linkbutton('disable');
            //}
            //修改
            if (authArray[2] == '0') {
                $("#edit").linkbutton('disable');
            }
            //删除
            //if (authArray[3] == '0') {
            //    $("#delete").linkbutton('disable');
            //}
        }
    });
}
//var enAble = [{ "value": "1", "text": "是" }, { "value": "0", "text": "否" }];
function loadDatagrid(loadType) {
    if ("first" == loadType) {
        $('#gridMain_ReportTemplate').treegrid({
            columns: [[
                { field: 'Name', title: '名称', width: 200 },           
                { field: 'EnergyAlarmValue', title: '能耗报警值', width: 80, editor: 'text' },
                { field: 'AlarmTypeE', title: '是否有效', width: 60, align: 'center',
                    //editor: { type: 'radio', options: { data: enAble, valueField: "value", textField: "text", panelHeight: 'auto', } },
                    //editor: { type: 'combobox', options: { data: enAble, valueField: "value", textField: "text", panelHeight: 'auto', editable: false } },
                    formatter: function (value, row, index) {
                        if (row.EnergyAlarmValue != "") {
                            if (row.AlarmType == 1 || row.AlarmType == 3) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }                      
                    }          
                },
                { field: 'PowerAlarmValue', title: '功率报警值', width: 80, editor: 'text' },
                { field: 'AlarmTypeP', title: '是否有效', width: 60, align: 'center',
                    //editor: { type: 'combobox', options: { data: enAble, valueField: "value", textField: "text", panelHeight: 'auto', editable: false } },
                    formatter: function (value, row, index) {
                        if (row.PowerAlarmValue != "") {
                            if (row.AlarmType == 2 || row.AlarmType == 3) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }                     
                    }
                },
                { field: 'CoalDustConsumptionAlarm', title: '煤耗报警值', width: 80, editor: 'text' },
                { field: 'AlarmTypeC', title: '是否有效', width: 60, align: 'center',
                    //editor: { type: 'combobox', options: { data: enAble, valueField: "value", textField: "text" }, panelHeight: 'auto' },
                    formatter: function (value, row, index) {
                        if (row.CoalDustConsumptionAlarm != "") {
                            if (row.AlarmType == 1 || row.AlarmType == 3) {
                                return value = "是";
                            } else {
                                return value = "否";
                            }
                        }
                    }
                },
                {
                    field: 'edit', title: '编辑', width: 60, formatter: function (value, row, index) {
                        var str = "";
                        str = '<a href="#" onclick="editAlarm(\'' + row.ID + '\')"><img class="iconImg" src = "/lib/extlib/themes/images/ext_icons/notes/note_edit.png" title="编辑页面"/>编辑</a>';                      
                        return str;
                    }
                }
            ]],
            fit: true,
            toolbar: "#toolbar_ReportTemplate",
            rownumbers: true,
            singleSelect: true,
            striped: true,
            //onClickRow: onClickRow,
            idField: 'ID',
            treeField: 'Name',
            data: []
        })
    }
    else {
        var organizationId = $('#organizationId').val();
        $.ajax({
            type: "POST",
            url: "AlarmSetting.aspx/GetData",
            data: '{organizationId: "' + organizationId+ '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                m_MsgData = jQuery.parseJSON(msg.d);
                $('#gridMain_ReportTemplate').treegrid("loadData", m_MsgData);
            },
            error: handleError
        }); 
    }
}
function handleError() {
    $('#gridMain_ReportTemplate').treegrid('loadData', []);
    $.messager.alert('失败', '获取数据失败');
}
function RefreshFun() {
    loadDatagrid("last");
}
var alarmValueE = '';
var alarmValueP = '';
var mID = '';
function editAlarm(alarmId) {
    mID = alarmId;
    $('#gridMain_ReportTemplate').treegrid('select', alarmId);
    var data = $('#gridMain_ReportTemplate').treegrid('getSelected');
    $("#productionName").textbox('setText', data.Name);
    $("#energyAlarmvalue").numberbox('setValue', data.EnergyAlarmValue);
    if (data.AlarmType == 1) {
        alarmValueE = "1";
        alarmValueP = "0";
    }
    if (data.AlarmType == 2) {
        alarmValueE = "0";
        alarmValueP = "1";
    }
    if (data.AlarmType == 3) {
        alarmValueE = "1";
        alarmValueP = "1";
    }
    if (data.AlarmType == 4) {
        alarmValueE = "0";
        alarmValueP = "0";
    }
    $("#alarmTypeE").combobox('setValue', alarmValueE);
    $("#powerAlarmValue").numberbox('setValue', data.PowerAlarmValue);
    $("#alarmTypeP").combobox('setValue', alarmValueP);
    $("#coalAlarmValue").numberbox('setValue', data.CoalDustConsumptionAlarm);
    $('#editAlarmInfo').window('open');
}
var mAlarmType = '';
function saveAlarmInfo() {
    var mEnergyAlarmValue = $('#energyAlarmvalue').numberbox('getValue');
    var malarmValueE = $('#alarmTypeE').combobox('getValue');
    var mPowerAlarmValue = $('#powerAlarmValue').numberbox('getValue');
    var malarmValueP = $('#alarmTypeP').combobox('getValue');
    var mCoalAlarmValue = $('#coalAlarmValue').numberbox('getValue');
    if (malarmValueE == "1" && malarmValueP == "0") {
        mAlarmType = "1";
    }
    if (malarmValueE == "0" && malarmValueP == "1") {
        mAlarmType = "2";
    }
    if (malarmValueE == "1" && malarmValueP == "1") {
        mAlarmType = "3";
    }
    if (malarmValueE == "0" && malarmValueP == "0") {
        mAlarmType = "4";
    }
    $.ajax({
        type: "POST",
        url: "AlarmSetting.aspx/SaveAlarmInfo",
        data: "{mID:'" + mID + "',mEnergyAlarmValue:'" + mEnergyAlarmValue + "',mPowerAlarmValue:'" + mPowerAlarmValue + "',mCoalAlarmValue:'" + mCoalAlarmValue + "',mAlarmType:'" + mAlarmType + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var myData = msg.d;
            if (myData == 1) {
                $.messager.alert('提示', '操作成功！');
                $('#editAlarmInfo').window('close');
                RefreshFun();
            }
            else {
                $.messager.alert('提示', '操作失败！');
                RefreshFun();
            }
        },
        error: function () {
            $.messager.alert('提示', '操作失败！');
            RefreshFun();
        }      
    });
}
//function cellStyler(value, row, index) {
//    if (row.AlarmType==0) {
//        return 'background-color:#ffee00;color:red;';
//    }
//}

//编辑行的ID
//var editingId = undefined;
//function endEditing() {
//    if (editingId == undefined) {
//        return true;
//    }
//    if (myDataGridObject.treegrid('select', editingId)) {     
//        $('#gridMain_ReportTemplate').treegrid('endEdit', editingId);
//        editIndex = undefined;
//        return true;
//    } else {
//        return false;
//    }
//}
//行单击事件

//function onClickRow(row) {
//    if (editingId != row.id) {
//        if (endEditing()) {
//            editingId = row.id;
//            $('#gridMain_ReportTemplate').treegrid('select', editingId)
//                    .treegrid('beginEdit', editingId);           
//        }
//        else {
//            $('#gridMain_ReportTemplate').treegrid('select', editingId);
//        }
//    }
//}

//撤销修改
//function reject() {
//    if (editingId != undefined) {
//        $('#gridMain_ReportTemplate').treegrid('cancelEdit', editingId);
//        editingId = undefined;
//    }
//}
//保存修改
//function saveFun() {
//    endEditing();           //关闭正在编辑
//    var organizationId = $('#organizationId').val();
//    var m_DataGridData = $('#gridMain_ReportTemplate').datagrid('getChanges', 'updated');
//    var alarmtype = '';
//    for (var i = 0; i < m_DataGridData.length; i++) {
//        var valueE = m_DataGridData[i]['AlarmTypeE'];
//        var valueP = m_DataGridData[i]['AlarmTypeP'];
//        if (valueE == '1' && valueP == '1') {
//            alarmtype = '3';
//        }
//        else if (valueE == '1' && valueP == '0') {
//            alarmtype = '1';
//        }
//        else if (valueE == '0' && valueP == '1') {
//            alarmtype = '2';
//        }
//        else {
//            alarmtype = '4';
//        }
//        m_DataGridData[i]['AlarmType'] = alarmtype;
//        m_DataGridData[i]['children'] = [];
//    }
//    if (m_DataGridData.length > 0) {
//        var m_DataGridDataJson = JSON.stringify(m_DataGridData);
//        $.ajax({
//            type: "POST",
//            url: "AlarmSetting.aspx/SaveAlarmValues",
//            data: "{organizationId:'" + organizationId + "',datagridData:'" + m_DataGridDataJson + "'}",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (msg) {
//                var m_Msg = msg.d;
//                if (m_Msg == '1') {
//                    $.messager.alert('提示', '修改成功！');
//                    loadDatagrid('last');
//                }
//                else if (m_Msg == '0') {
//                    $.messager.alert('提示', '修改失败！');
//                }
//                else if (m_Msg == '-1') {
//                    $.messager.alert('提示', '用户没有保存权限！');
//                }
//                else {
//                    $.messager.alert('提示', m_Msg);
//                }
//            }
//        });
//    }
//    else {
//        $.messager.alert('提示', '没有任何数据需要保存');
//    }
//}


