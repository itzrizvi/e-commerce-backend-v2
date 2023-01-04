const { getAllCustomerController,
    getSingleCustomerController,
    getSearchedCustomersController,
    getContactPersonListByCustomerIDController,
} = require("../../controllers/customer");

// Customer BASED QUERY
module.exports = {
    // GET ALL Vendor QUERY
    getAllCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getAllCustomerController(db, user, isAuth, TENANTID);
    },
    getSingleCustomer: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        return await getSingleCustomerController(args.query, db, user, isAuth, TENANTID);
    },
    getSearchedCustomers: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        // Return To Controller
        return await getSearchedCustomersController(args.query, db, user, isAuth, TENANTID);
    },
    getContactPersonListByCustomerID: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        if (user.id != args.query.customer_id) return { message: "Not Authorized", status: false }

        // Return To Controller
        return await getContactPersonListByCustomerIDController(args.query, db, TENANTID);
    }
}