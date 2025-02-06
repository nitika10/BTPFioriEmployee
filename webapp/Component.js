/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/employee/f/empfiori/model/models",
        'sap/ui/core/routing/HashChanger'
    ],
    function (UIComponent, Device, models, HashChanger) {
        "use strict";

        return UIComponent.extend("com.employee.f.empfiori.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                HashChanger.getInstance().replaceHash('')


                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);