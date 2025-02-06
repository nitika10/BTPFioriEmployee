sap.ui.define([
	"sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
], function(
	Controller, JSONModel, MessageBox
) {
	"use strict";
	let oEditModel
	return Controller.extend("com.employee.f.empfiori.controller.Detail", {
      onInit: function () {
        oEditModel = new JSONModel({
          edit: false,
        })
        this.getView().setModel(oEditModel, 'editModel')

        var oSelectedEmpModel = new JSONModel({
          employeeDetailArray: [],
        })
        this.getView().setModel(oSelectedEmpModel, 'employee')
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter
          .getRoute('detail')
          .attachPatternMatched(this._onObjectMatched, this)
      },

      _onObjectMatched: function (oEvent) {
        let oSelectedEmpModel = this.getView().getModel('employee')
        oSelectedEmpModel.setProperty('/employeeDetailArray', [])
        let sPath = window.decodeURIComponent(
          oEvent.getParameter('arguments').EmpId,
        )
        var oEmpModel = this.getOwnerComponent().getModel()
        let employeeDetail = oEmpModel.getData(sPath)
        oSelectedEmpModel.getData().employeeDetailArray.push(employeeDetail)
        oSelectedEmpModel.refresh()
        console.log
      },

      onUpdate: function (oEvent) {
        oEditModel.setProperty('/edit', true)
      },

      onDelete: function (oEvent) {
        var oDataModel = this.getOwnerComponent().getModel()
        let sEmpId = oEvent
          .getSource()
          .getBindingContext('employee')
          .getProperty('EmpId')
        console.log({ sEmpId })
        oDataModel.remove(`/EmployeeSet('${sEmpId}')`, {
          success: function (_oData, oResponse) {
            if (oResponse.statusCode === '204') {
              MessageBox.success('Successfully Deleted ID ' + sEmpId)
            } else {
              MessageBox.error('No Response Recieved')
            }
            console.log(oResponse)
            oDataModel.refresh(true)
          },
          error: function (oResponse) {
            var error = JSON.parse(oResponse.responseText).error.message.value
            MessageBox.error(error)
            console.log(oResponse)
          },
        })
      },

      onCancel: function (oEvent) {
        oEditModel.setProperty('/edit', false)
      },

      onSaveUpdate: function (oEvent) {
        // Odatamodel ref
        let oDataModel = this.getOwnerComponent().getModel()

        // local employee model
        let oEmpContext = oEvent.getSource().getBindingContext('employee')

        //employee data for playload
        let updatedEmployeeData = oEmpContext.getObject()

        // set up payload
        let oPayload = {
          EmpId: updatedEmployeeData.EmpId,
          EmpName: updatedEmployeeData.EmpName,
          EmpDept: updatedEmployeeData.EmpDept,
          EmpPost: updatedEmployeeData.EmpPost,
          EmpGender: updatedEmployeeData.EmpGender,
          EmpMobNo: updatedEmployeeData.EmpMobNo
        }

        oDataModel.update(`/EmployeeSet('${oPayload.EmpId}')`, oPayload, {
          method: 'PUT',
          success: function (data) {
            MessageBox.success('Updated')
            console.log(data)
          },
          error: function (response) {
            MessageBox.error(response)
          },
        })
      },
	});
});