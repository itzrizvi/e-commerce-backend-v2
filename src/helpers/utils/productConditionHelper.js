const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

module.exports = {
    createProductCondition: async (req, db, TENANTID) => {
        try {
            // Data From Request
            const { name } = req;
            // Slugify Product Condition
            const product_condition_slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Product Condition
            const checkExistence = await db.product_condition.findOne({
                where: {
                    [Op.and]: [{
                        slug: product_condition_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Product Condition
            if (checkExistence) return { message: "Already Have This Product Condition!!!", status: false };

            // Create Product Condition
            const createProductCondition = await db.product_condition.create({
                name,
                slug: product_condition_slug,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createProductCondition) return { message: "Could not Create The Product Condition", status: false };

            // Return Formation
            return {
                message: "Product Condition Created Successfully!!!",
                status: true,
                tenant_id: createProductCondition.tenant_id
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    updateProductCondition: async (req, db, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request
            const { id, name } = req;

            // Create New Slug
            const product_condition_slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Production Condition
            const checkExistence = await db.product_condition.findOne({
                where: {
                    [Op.and]: [{
                        slug: product_condition_slug,
                        tenant_id: TENANTID
                    }],
                    [Op.not]: [{
                        id
                    }]
                }
            });

            // If Found Production Condition
            if (checkExistence) return { message: "Already Have This Product Condition!!!", status: false };
            
            // Update Production Condition
            const updateProductionCondition = await db.product_condition.update({
                name,
                slug: product_condition_slug
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updateProductionCondition) return { message: "Product Condition Update Gone Wrong!!!", status: false }

            // Return Formation
            return {
                message: "Product Condition Update Success!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getAllProductCondition: async (db, TENANTID) => {
        // Try Catch Block
        try {
            const allProductCondition = await db.product_condition.findAll({
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ['name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "All Get Product Condition Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: allProductCondition
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getSingleProductCondition: async (req, db, TENANTID) => {
        try {
            // Data From Request
            const { id } = req;
            const singleProductionCondition = await db.product_condition.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // return 
            return {
                message: "GET Single Production Condition Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singleProductionCondition
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}