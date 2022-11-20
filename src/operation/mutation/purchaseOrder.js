// All Requires
const { poSettingController,
    createPurchaseOrderController,
    updatePurchaseOrderController } = require("../../controllers");


// PO Mutation Start
module.exports = {
    // PO SETTING Mutation
    poSetting: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await poSettingController(args.data, db, user, isAuth, TENANTID);
    },
    // Create PO Mutation
    createPurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createPurchaseOrderController(args.data, db, user, isAuth, TENANTID);
    },
    // Update PO Mutation
    updatePurchaseOrder: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updatePurchaseOrderController(args.data, db, user, isAuth, TENANTID);
    },


}
