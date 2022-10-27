const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

module.exports = {
    createProductAvailabilityStatus: async (req, db, TENANTID) => {
        try {
            // Data From Request
            const { name } = req;
            // Slugify Product AvailabilityStatus
            const product_availability_status_slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Product AvailabilityStatus
            const checkExistence = await db.product_availability_status.findOne({
                where: {
                    [Op.and]: [{
                        slug: product_availability_status_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Product AvailabilityStatus
            if (checkExistence) return { message: "Already Have This Product Availability Status!!!", status: false };

            // Create Product Condition
            const createProductAvailabilityStatus = await db.product_availability_status.create({
                name,
                slug: product_availability_status_slug,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createProductAvailabilityStatus) return { message: "Could not Create The Product Availability Status", status: false };

            // Return Formation
            return {
                message: "Product Availability Status Created Successfully!!!",
                status: true,
                tenant_id: createProductAvailabilityStatus.tenant_id
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    updateProductAvailabilityStatus: async (req, db, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request
            const { id, name } = req;

            // Create New Slug
            const product_availability_status_slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Production AvailabilityStatus
            const checkExistence = await db.product_availability_status.findOne({
                where: {
                    [Op.and]: [{
                        slug: product_availability_status_slug,
                        tenant_id: TENANTID
                    }],
                    [Op.not]: [{
                        id
                    }]
                }
            });

            // If Found Production AvailabilityStatus
            if (checkExistence) return { message: "Already Have This Product Availability Status!!!", status: false };

            // Update Production AvailabilityStatus
            const updateProductionAvailabilityStatus = await db.product_availability_status.update({
                name,
                slug: product_availability_status_slug
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updateProductionAvailabilityStatus) return { message: "Product Availability Status Update Gone Wrong!!!", status: false }

            // Return Formation
            return {
                message: "Product Availability Status Update Success!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getAllProductAvailabilityStatus: async (db, TENANTID) => {
        // Try Catch Block
        try {
            const allProductAvailabilityStatus = await db.product_availability_status.findAll({
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ['name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "All Get Product Availability Status Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: allProductAvailabilityStatus
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getSingleProductAvailabilityStatus: async (req, db, TENANTID) => {
        try {
            // Data From Request
            const { id } = req;
            const singleProductionAvailabilityStatus = await db.product_availability_status.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // return 
            return {
                message: "GET Single Production Availability Status Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singleProductionAvailabilityStatus
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}