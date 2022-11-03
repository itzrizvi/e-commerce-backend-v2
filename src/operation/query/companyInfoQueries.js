const { getCompanyInfoController } = require("../../controllers");

module.exports = {
    getCompanyInfo: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };
        return await getCompanyInfoController(args.data, db, user, isAuth, TENANTID);
    }
}