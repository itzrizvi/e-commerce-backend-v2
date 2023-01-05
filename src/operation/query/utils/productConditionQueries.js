const { allProductConditionController,
    getSingleProductConditionController } = require("../../../controllers");

module.exports = {
    // GET ALL ATTR
    getAllProductCondition: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // // Return If No Auth
        // if (!user || !isAuth) return { message: "Not Authorized", status: false };
        // if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await allProductConditionController(db, TENANTID);
    },
    getSingleProductCondition: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleProductConditionController(args.query, db, TENANTID);
    }

}