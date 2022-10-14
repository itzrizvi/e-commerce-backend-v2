// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// BRAND HELPER
module.exports = {
    // Create Brand HELPER
    createAttrGroup: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From 
            const { attr_group_name, attrgroup_sortorder, attrgroup_status } = req;

            // Slugify Attr Group Name
            const attr_group_slug = slugify(`${attr_group_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Brand
            const checkExistence = await db.attr_groups.findOne({
                where: {
                    [Op.and]: [{
                        attr_group_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Attr Group
            if (checkExistence) return { message: "Already Have This Attribute Group!!!", status: false };

            // Create Attr Group
            const createAttrGroup = await db.attr_groups.create({
                attr_group_name,
                attr_group_slug,
                attrgroup_sortorder,
                attrgroup_status,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createAttrGroup) return { message: "Couldnt Create The Attribute Group", status: false };

            // Return Formation
            return {
                message: "Attribute Created Successfully!!!",
                status: true,
                tenant_id: createAttrGroup.tenant_id
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },

}