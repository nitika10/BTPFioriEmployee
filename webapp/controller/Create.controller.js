sap.ui.define(
    [
      'sap/ui/core/mvc/Controller',
      'sap/ui/model/json/JSONModel',
      'sap/m/MessageBox'
    ],
    function (Controller, JSONModel, MessageBox) {
      'use strict'
  
      return Controller.extend('com.crud.project.crudproject.controller.Create', {
        onInit: function () {
          let oRouter = this.getOwnerComponent().getRouter()
          oRouter
            .getRoute('create')
            .attachPatternMatched(this._onObjectMatched, this)
          oRouter.attachRouteMatched(this._onRouteMatched, this)
          let createModel = new JSONModel()
  
          let arrEmp = { 
            EmpId: '',
            EmpName: '',
            EmpPost: '',
            EmpDept: '',
            EmpGender: '',
            EmpMobNo: ''
          }
          createModel.setData(arrEmp)
          this.getView().setModel(createModel, 'createEmp')
        },
  
        _onRouteMatched: function (oEvent) {
          let sRoute = oEvent.getParameters('name')
          if (sRoute !== 'create') {
            this._resetEmployeeModel()
          }
        },
        _resetEmployeeModel: function () {
          let oEmpModel = this.getView().getModel('createEmp')
          // oEmpModel.setData({
          //   EmpId: '1004',
          //   EmpName: 'Abcdef',
          //   EmpPost: 'Manager',
          //   EmpDept: 'Fiori',
          //   EmpGender: 'Female',
          //   EmpMobNo: '9898989898'
          // })
          oEmpModel.setData({
            EmpId: '',
            EmpName: '',
            EmpPost: '',
            EmpDept: '',
            EmpGender: '',
            EmpMobNo: ''
          })
          oEmpModel.refresh()
        },
        _onObjectMatched: function (oEvent) {
          console.log(oEvent)
        },
        OnCreate: function () {
          let oData = this.getView().getModel('createEmp').getData()
          let oModel = this.getOwnerComponent().getModel()
          let that = this
          oModel.create('/EmployeeSet', oData, {
            success: function (msg) {
              that._validateResponse(msg)
            },
            error: function (msg) {
              let errMsg = JSON.parse(msg.responseText).error.message.value
              MessageBox.error(errMsg)
            },
          })
        },
        _validateResponse: function (msg) {
          if (msg.Message === 'Successfully Created') {
            MessageBox.success(msg.Message)
            /**
             * @type {sap.ui.model.odata.v2.ODataModel}
             */
            let oDataModel = this.getOwnerComponent().getModel()
            oDataModel.refresh(true)
            return
          }
          if (msg.Message === 'Employee Already Exist') {
            MessageBox.information(msg.Message)
            return
          }
          if (msg.Message === 'Missing Employee ID') {
            MessageBox.warning(msg.Message)
            return
          }
          if (msg.Message === 'Error') {
            MessageBox.error(msg.Message)
            return
          }
        }
      })
    },
  )