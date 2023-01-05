// All Requires
const { createBrandController, updateBrandController } = require("../../controllers");


// BRAND BASED Mutation
module.exports = {
    // Brand Create Mutation
    createBrand: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Merging File To Args Data
        args.data.image = args.file;

        // Return To Controller
        return await createBrandController(args.data, db, user, isAuth, TENANTID);
    },
    // Brand Update Mutation
    updateBrand: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Merging File To Args Data
        args.data.image = args.file;

        // Return To Controller
        return await updateBrandController(args.data, db, user, isAuth, TENANTID);
    }

}