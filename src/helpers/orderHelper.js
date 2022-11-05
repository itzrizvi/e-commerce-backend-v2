// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Order HELPER
module.exports = {
    // Add Order Status API
    addOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, description, status } = req;

            // Order Status Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findOrderStatus = await db.order_status.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findOrderStatus) return { message: "Already Have This Order Status!!!!", status: false }

            // Add Payment Method TO DB
            const insertOrderStatus = await db.order_status.create({
                name,
                slug,
                description,
                status,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertOrderStatus) {
                return {
                    message: "Order Status Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update Order Status API
    updateOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, name, description, status } = req;

            // If name also updated
            let slug
            if (name) {
                // Order Status Slug
                slug = slugify(`${name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check Existence
                const checkExist = await db.order_status.findOne({
                    where: {
                        [Op.and]: [{
                            slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                if (checkExist) return { message: "Already Have This Order Status!!!", status: false };
            }


            // Update Doc 
            const updateDoc = {
                name,
                slug,
                description,
                status,
                updated_by: user.id
            }

            // Update Order Status
            const updateorderstatus = await db.order_status.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Formation
            if (updateorderstatus) {
                return {
                    message: "Order Status Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Single Order Status API
    getSingleOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { orderstatus_id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.order_status.hasAlias('user') && !db.order_status.hasAlias('added_by')) {

                await db.order_status.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET SINGLE ORDER STATUS
            const getorderstatus = await db.order_status.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Order Status
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id: orderstatus_id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Order Status Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatus
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Order Status List Admin
    getOrderStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.order_status.hasAlias('user') && !db.order_status.hasAlias('added_by')) {

                await db.order_status.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET ORDER STATUS List
            const getorderstatuslist = await db.order_status.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Order Status
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                }
            });


            return {
                message: "GET Order Status List For Admin Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatuslist
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Order Status List PUBLIC
    getPublicOrderStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // GET ORDER STATUS List
            const getorderstatuslist = await db.order_status.findAll({
                where: {
                    [Op.and]: [{
                        status: true,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Order Status List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatuslist
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Add Order Status API
    createOrderByCustomer: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { cart_id,
                tax_exempt,
                customer_id,
                payment_id,
                coupon_id,
                order_status_id,
                billing_address_id,
                shipping_address_id,
                taxexempt_file } = req;






        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}