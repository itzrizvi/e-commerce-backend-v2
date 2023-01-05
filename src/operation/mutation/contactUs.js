// All Requires
const { createContactUsController } = require("../../controllers");


// Contact Us Mutation Start
module.exports = {
    // Create Contact Us Mutation
    createContactUs: async (root, args, { db, TENANTID }, info) => {
        // Return If Not Have TENANT ID
        if (!TENANTID || TENANTID == "undefined") return { message: "TENANT ID IS MISSING!!!", status: false }

        // Send to Controller
        return await createContactUsController(args.data, db, TENANTID);
    }

}
