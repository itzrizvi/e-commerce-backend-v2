const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Feature Permission List Helper
module.exports = {
    // Create Feature Permission List
    createFeaturePermission: async (req, db, user, isAuth, TENANTID) => {

        // Req Data
        const featureName = req.featureName;
        const feature_permission_status = req.feature_permission_status;

        // Create Slug
        const featureNameSlug = slugify(`${featureName}`, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true
        });


        // Check If Already Feature is Exists In the Permission List Table
        const findFeatureExists = await db.feature_permission_list.findOne({
            where: {
                [Op.and]: [{
                    feature_permission_slug: featureNameSlug,
                    tenant_id: TENANTID
                }]
            }
        });

        if (!findFeatureExists) {

            // Create Feature of Permission
            const createFeatureOfPrmsn = await db.feature_permission_list.create({
                feature_permission_name: featureName,
                feature_permission_slug: featureNameSlug,
                feature_permission_status,
                tenant_id: TENANTID
            });

            if (!createFeatureOfPrmsn) return { message: "Something Went Wrong!!", status: false }


            return {
                featureNameUUID: createFeatureOfPrmsn.feature_permission_uuid,
                message: "Created A Feature Of Permission List Successfully!!",
                featureName: createFeatureOfPrmsn.feature_permission_name,
                featureNameSlug: createFeatureOfPrmsn.feature_permission_slug,
                feature_permission_status: createFeatureOfPrmsn.feature_permission_status,
                tenant_id: createFeatureOfPrmsn.tenant_id
            }

        } else {
            return { message: "This Feature Already Exists in List!!", status: false }
        }


    },
    // GET ALL Feature Permission
    getAllFeaturePermission: async (db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };


        try {
            // GET ALL Feature Permissions Query
            const allFeaturePermission = await db.feature_permission_list.findAll({ where: { tenant_id: TENANTID } });
            // Return Data
            return {
                isAuth: isAuth,
                message: "All Permission List GET Success!!!",
                data: allFeaturePermission,
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong", status: false }
            }
        }
    }
}