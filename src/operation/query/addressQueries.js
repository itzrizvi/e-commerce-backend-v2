const { getAddressListByCustomerIDController } = require("../../controllers");


// Address BASED QUERY
module.exports = {
    // GET ADDRESS LIST BY CUSTOMER ID
    getAddressListByCustomerID: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getAddressListByCustomerIDController(args.query, db, user, TENANTID);
    },
}