// All Requires

const { createRatingController } = require("../../controllers");

// Rating Mutation Start
module.exports = {
    // Create Ratting Mutation
    createRating: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };

        // Send to Controller
        return await createRatingController(args.data, db, user, isAuth, TENANTID);
    }
}
