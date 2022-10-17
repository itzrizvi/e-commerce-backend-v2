const { createBannerController } = require("../../controllers");

module.exports = {
    addBanner: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        console.log(args);
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        console.log(!user || !isAuth);
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Return To Controller
        return await createBannerController(args.data, db, user, isAuth, TENANTID);
    }
}