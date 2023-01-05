// All Requires
const { addTaxClassController, updateTaxClassController } = require("../../controllers");


// Tax Class Mutation Start
module.exports = {
    // Add Tax Class Mutation
    addTaxClass: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await addTaxClassController(args.data, db, user, isAuth, TENANTID);
    },
    // UPDATE Tax Class Mutation
    updateTaxClass: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Send to Controller
        return await updateTaxClassController(args.data, db, user, isAuth, TENANTID);
    },

}
