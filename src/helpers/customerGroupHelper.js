// CUSTOMER GROUP HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// CUSTOMER GROUP HELPER
module.exports = {
    // Create CUSTOMER GROUP HELPER
    createCustomerGroup: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request
            const { customer_group_name, customergroup_status, customergroup_sortorder, customergroup_description } = req;

            // Slugify Customer Group Name
            const customer_group_slug = slugify(`${customer_group_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Customer Group
            const checkExistence = await db.customer_groups.findOne({
                where: {
                    [Op.and]: [{
                        customer_group_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Customer Group
            if (checkExistence) return { message: "Already Have This Customer Group!!!", status: false };

            // Create Customer Group
            const createCustomerGrp = await db.customer_groups.create({
                customer_group_name,
                customer_group_slug,
                customergroup_description,
                customergroup_sortorder,
                customergroup_status,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createCustomerGrp) return { message: "Couldnt Create The Attribute Group", status: false };

            // Return Formation
            return {
                message: "Customer Group Created Successfully!!!",
                status: true,
                tenant_id: createCustomerGrp.tenant_id
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update Customer Group Helper
    updateCustomerGroup: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { customer_group_uuid,
                customer_group_name,
                customergroup_sortorder,
                customergroup_status,
                customergroup_description } = req;

            // Create New Slug If Customer Group name is also Updating
            let customer_group_slug;
            if (customer_group_name) {
                // Slugify Customer Group Name
                customer_group_slug = slugify(`${customer_group_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check If Already Exist the Customer Group
                const checkExistence = await db.customer_groups.findOne({
                    where: {
                        [Op.and]: [{
                            customer_group_slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            customer_group_uuid
                        }]
                    }
                });

                // If Found Customer Group
                if (checkExistence) return { message: "Already Have This Customer Group!!!", status: false };
            }

            // Update Doc for Customer Group
            const updateDoc = {
                customer_group_name,
                customer_group_slug,
                customergroup_description,
                customergroup_status,
                customergroup_sortorder
            }

            // Update Customer Group
            const updateCustomerGrp = await db.customer_groups.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        customer_group_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateCustomerGrp) return { message: "Customer Group Update Gone Wrong!!!", status: false }

            // Return Formation
            return {
                message: "Customer Group Update Success!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Get All Customer Group Helper
    getAllCustomerGroups: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // GET ALL Customer GROUPS
            const allCustomerGroups = await db.customer_groups.findAll({
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ['customer_group_name', 'ASC']
                ],
            });

            // Return 
            return {
                message: "All Get Customer Group Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: allCustomerGroups
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }

}