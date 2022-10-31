// ATTR GROUP HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// ATTR GROUP HELPER
module.exports = {
    // Create ATTR GROUP HELPER
    createAttrGroup: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request
            const { attr_group_name, attrgroup_sortorder, attrgroup_status } = req;

            // Slugify Attr Group Name
            const attr_group_slug = slugify(`${attr_group_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Attribute Group
            const checkExistence = await db.attr_group.findOne({
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
            const createAttrGroup = await db.attr_group.create({
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
                message: "Attribute Group Created Successfully!!!",
                status: true,
                tenant_id: createAttrGroup.tenant_id
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update ATTR GROUP HELPER
    updateAttrGroup: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { attr_group_id, attr_group_name, attrgroup_sortorder, attrgroup_status } = req;

            // Create New Slug If Attr Group name is also Updating
            let attr_group_slug;
            if (attr_group_name) {
                // Slugify Attr Group Name
                attr_group_slug = slugify(`${attr_group_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist the Attribute Group
                const checkExistence = await db.attr_group.findOne({
                    where: {
                        [Op.and]: [{
                            attr_group_slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: attr_group_id
                        }]
                    }
                });

                // If Found Attr Group
                if (checkExistence) return { message: "Already Have This Attribute Group!!!", status: false };
            }

            // Update Doc for Attr Group
            const updateDoc = {
                attr_group_name,
                attr_group_slug,
                attrgroup_status,
                attrgroup_sortorder
            }

            // Update Attribute Group
            const updateAttrGroup = await db.attr_group.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id: attr_group_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateAttrGroup) return { message: "Attribute Group Update Gone Wrong!!!", status: false }

            // Return Formation
            return {
                message: "Attribute Group Update Success!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET ALL ATTR GROUP HELPER
    getAllAttrGroups: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Association with Attribute Group and Attributes
            if (!db.attr_group.hasAlias('attribute') && !db.attr_group.hasAlias('attributes')) {
                await db.attr_group.hasMany(db.attribute, { sourceKey: 'id', foreignKey: 'attr_group_id', as: 'attributes' });
            }

            // GET ALL ATTR GROUPS
            const allAttrGroups = await db.attr_group.findAll({
                where: {
                    tenant_id: TENANTID
                },
                include: [{
                    model: db.attribute, as: 'attributes',
                    seperate: true,
                    order: [{ model: db.attribute }, 'attribute_name', 'ASC']
                }],
                order: [
                    ['attr_group_name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "All Get Attribute Group Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: allAttrGroups
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },
    // GET SINGLE ATTR GROUP HELPER
    getSingleAttrGroup: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { attr_group_id } = req;

            // Association with Attribute Group and Attributes
            if (!db.attr_group.hasAlias('attributes')) {
                await db.attr_group.hasMany(db.attribute, { sourceKey: 'id', foreignKey: 'attr_group_id', as: 'attributes' });
            }
            // GET Single ATTR Group
            const singleAttrGroup = await db.attr_group.findOne({
                where: {
                    [Op.and]: [{
                        id: attr_group_id,
                        tenant_id: TENANTID
                    }]
                },
                include: [{
                    model: db.attribute, as: 'attributes',
                    seperate: true,
                    order: [{ model: db.attribute }, 'attribute_name', 'ASC']
                }]
            });

            // return 
            return {
                message: "GET Single Attribute Group Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singleAttrGroup
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }

}