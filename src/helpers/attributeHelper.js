// ATTR HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// ATTR HELPER
module.exports = {
    // Create ATTR HELPER
    createAttribute: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request
            const { attribute_name, attribute_status, attr_group_id } = req;

            // Slugify Attr Name
            const attribute_slug = slugify(`${attribute_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Attribute
            const checkExistence = await db.attribute.findOne({
                where: {
                    [Op.and]: [{
                        attribute_slug,
                        attr_group_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Attr 
            if (checkExistence) return { message: "Already Have This Attribute For this Group!!!", status: false };

            // Create Attr
            const createAttr = await db.attribute.create({
                attribute_name,
                attribute_slug,
                attribute_status,
                attr_group_id,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createAttr) return { message: "Couldnt Create The Attribute!!!", status: false };

            // Return Formation
            return {
                message: "Attribute Created Successfully!!!",
                status: true,
                tenant_id: createAttr.tenant_id
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update ATTR HELPER
    updateAttribute: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request 
            const { attribute_id, attribute_name, attribute_status, attr_group_id } = req;

            // Create New Slug If Attr name is also Updating
            let attribute_slug;
            if (attribute_name) {
                // Slugify Attr Name
                attribute_slug = slugify(`${attribute_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist the Attribute
                const checkExistence = await db.attribute.findOne({
                    where: {
                        [Op.and]: [{
                            attribute_slug,
                            attr_group_id,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: attribute_id
                        }]
                    }
                });

                // If Found Attr 
                if (checkExistence) return { message: "Already Have This Attribute For this Group!!!", status: false };
            }

            // Update Doc for Attr
            const updateDoc = {
                attribute_name,
                attribute_slug,
                attribute_status,
                attr_group_id
            }

            // Update Attribute
            const updateAttr = await db.attribute.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id: attribute_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateAttr) return { message: "Couldnt Update Attribute!!!", status: false }

            // Return Formation
            return {
                message: "Attribute Update Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Get All ATTR HELPER
    getAllAttributes: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Association with Attribute Group and Attributes
            if (!db.attribute.hasAlias('attr_groups') && !db.attribute.hasAlias('attribute_group')) {
                await db.attribute.hasOne(db.attr_group, { sourceKey: 'attr_group_id', foreignKey: 'id', as: 'attribute_group' });
            }

            // GET ALL ATTR
            const getAllAttributes = await db.attribute.findAll({
                where: {
                    tenant_id: TENANTID
                },
                include: [{
                    model: db.attr_group, as: 'attribute_group'
                }],
                order: [
                    ['attribute_name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "All Get Attributes Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getAllAttributes
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Get Single ATTR HELPER
    getSingleAttribute: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { attribute_id } = req;

            // Association with Attribute Group and Attributes
            if (!db.attribute.hasAlias('attr_groups') && !db.attribute.hasAlias('attribute_group')) {
                await db.attribute.hasOne(db.attr_group, { sourceKey: 'attr_group_id', foreignKey: 'id', as: 'attribute_group' });
            }

            // GET Single ATTR
            const getAttribute = await db.attribute.findOne({
                where: {
                    id: attribute_id,
                    tenant_id: TENANTID
                },
                include: [{
                    model: db.attr_group, as: 'attribute_group'
                }],
                order: [
                    ['attribute_name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "Get Attribute Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getAttribute
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}