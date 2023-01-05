// All Requires
const { createAttrGroupController, updateAttrGroupController } = require("../../controllers");


// Attribute Group BASED Mutation
module.exports = {
    // Create Attribute Group
    createAttrGroup: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await createAttrGroupController(args.data, db, user, isAuth, TENANTID);
    },
    // Update Attribute Group
    updateAttrGroup: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


        // Return To Controller
        return await updateAttrGroupController(args.data, db, user, isAuth, TENANTID);
    },
}