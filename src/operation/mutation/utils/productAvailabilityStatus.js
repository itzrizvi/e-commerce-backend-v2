const { addProductAvailabilityStatusController, updateProductAvailabilityStatusController } = require("../../../controllers");

module.exports = {
    addProductAvailabilityStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await addProductAvailabilityStatusController(args.data, db, TENANTID);
    },
    updateProductAvailabilityStatus: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        return await updateProductAvailabilityStatusController(args.data, db, TENANTID);
    }
}