const { getAddressListByCustomerIDController, getStateListController, getCountryListController } = require("../../controllers");


// Address BASED QUERY
module.exports = {
    // GET ADDRESS LIST BY CUSTOMER ID
    getAddressListByCustomerID: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAddressListByCustomerIDController(args.query, db, user, TENANTID);
    },
    getStateList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getStateListController(db, args, TENANTID);
    },
    getCountryList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getCountryListController(db, TENANTID);
    }
}