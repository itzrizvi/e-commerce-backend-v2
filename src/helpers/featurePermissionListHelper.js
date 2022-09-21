const { default: slugify } = require("slugify");




// Feature Permission List Helper
module.exports = {
    // Create Feature Permission List
    createFeaturePermission: async (req, db, user, isAuth) => {
        if (!isAuth) return { featureNameUUID: "Null", message: "Not Authorized!!" } // If Not Auth
        // Check Role IS Authorized or Nots
        const { role_no } = user;
        if (role_no === '0') return { featureNameUUID: "Null", message: "Not Authorized!!" }; // If Not Authorized the return

        // Req Data
        const featureName = req.featureName;

        // Create Slug
        const featureNameSlug = slugify(`${featureName}`, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true
        });

        // Check If Already Feature is Exists In the Permission List Table
        const findFeatureExists = await db.feature_permission_list.findOne({ where: { feature_permission_slug: featureNameSlug } });

        if (!findFeatureExists) {

            // Create Feature of Permission
            const createFeatureOfPrmsn = await db.feature_permission_list.create({
                feature_permission_name: featureName,
                feature_permission_slug: featureNameSlug
            });

            if (!createFeatureOfPrmsn) return { featureNameUUID: "Null", message: "Something Went Wrong!!" }


            return {
                featureNameUUID: createFeatureOfPrmsn.feature_permission_uuid,
                message: "Created A Feature Of Permission List Successfully!!",
                featureName: createFeatureOfPrmsn.feature_permission_name,
                featureNameSlug: createFeatureOfPrmsn.feature_permission_slug
            }

        } else {
            return { featureNameUUID: "Null", message: "This Feature Already Exists in List!!" }
        }


    }
}