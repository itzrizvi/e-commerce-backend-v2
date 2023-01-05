// Customer GROUP BASED QUERY
const { getAllCustomerGroupsController, getSingleCustomerGroupController } = require("../../controllers");

// Customer GROUP QUERIES
module.exports = {
    // GET ALL Customer GROUPS
    getAllCustomerGroups: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAllCustomerGroupsController(db, user, isAuth, TENANTID);
    },
    // GET SINGLE Customer Group
    getSingleCustomerGroup: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleCustomerGroupController(args.query, db, user, isAuth, TENANTID);
    }

}