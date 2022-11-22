const { createCartController,
    removeCartItemController,
    addSingleCartItemController,
    removeCartController } = require("../../controllers");

module.exports = {
    addCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        return await createCartController(args.data, db, user, isAuth, TENANTID);
    },
    removeCartItem: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        return await removeCartItemController(args.data, db, user, isAuth, TENANTID);
    },
    addSingleCartItem: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        return await addSingleCartItemController(args.data, db, user, isAuth, TENANTID);
    },
    removeCart: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        return await removeCartController(args.data, db, user, isAuth, TENANTID);
    },
}