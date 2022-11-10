const { getCompanyInfoController } = require("../../controllers");

module.exports = {
    getCompanyInfo: async (root, args, { db, TENANTID }, info) => {
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        return await getCompanyInfoController(db, TENANTID);
    }
}