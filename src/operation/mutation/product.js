// All Requires
const { addProductController, updateProductController, updateThumbnailController } = require("../../controllers");


// Product Mutations
module.exports = {
    // Add Product Mutation
    addProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await addProductController(args.data, db, user, isAuth, TENANTID);

    },
    // Update Product Mutation
    updateThumbnail: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await updateThumbnailController(args.data, db, TENANTID);
    },
    // // Update Product Mutation
    // updateProduct: async (root, args, { db, user, isAuth, TENANTID }, info) => {
    //     if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false } // Return if No TENANT ID
    //     // Return If No Auth
    //     if (!user || !isAuth) return { message: "Not Authorized", status: false };
    //     if (user.has_role === '0') return { message: "Not Authorized", status: false };

    //     // Return To Controller
    //     return await updateProductController(args.data, db, user, isAuth, TENANTID);
    // },
}
