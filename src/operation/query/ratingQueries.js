// ROLE BASED QUERY

const { getAllRatingController } = require("../../controllers");

module.exports = {
    // GET ALL ROLES QUERY
    getAllRating: async (root, args, { db, user, isAuth, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID) return { message: "TENANT ID IS MISSING!!!", status: false }
        // Return To Controller
        const data = await getAllRatingController(args.query, db, user, isAuth, TENANTID);
        console.log(data);
        return data;
    }
}