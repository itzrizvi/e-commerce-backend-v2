const { getSingleContactUsMsgController,
    getContactUsMsgListController } = require("../../controllers");


// Contact Us BASED QUERY
module.exports = {
    // GET SINGLE CONTACT US MESSAGE QUERIES
    getSingleContactUsMsg: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getSingleContactUsMsgController(args.query, db, user, isAuth, TENANTID);
    },
    // GET CONTACT US MSG LIST QUERIES
    getContactUsMsgList: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }

        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await getContactUsMsgListController(db, TENANTID);
    }

}