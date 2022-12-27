// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Shipping Method HELPER
module.exports = {
    // Add Shipping Method API
    addShippingMethod: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, description, status, sort_order, internal_type } = req;

            // Check Existence
            const findShippingMethod = await db.shipping_method.findOne({
                where: {
                    [Op.and]: [{
                        name,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findShippingMethod) return { message: "Already Have This Shipping Method!!!!", status: false }

            // Add Shipping Method TO DB
            const insertShippingMethod = await db.shipping_method.create({
                name,
                description,
                status,
                sort_order,
                internal_type,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertShippingMethod) {
                return {
                    message: "Shipping Method Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Single Shipping Method API
    getSingleShippingMethod: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.shipping_method.hasAlias('user') && !db.shipping_method.hasAlias('added_by')) {

                await db.shipping_method.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET SINGLE SHIPPING METHOD
            const getShippingMethod = await db.shipping_method.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Shipping Method
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Shipping Method Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getShippingMethod
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Shipping Method API
    updateShippingMethod: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, name, description, sort_order, internal_type } = req;

            // If name also updated
            if (name) {

                // Check Existence
                const checkExist = await db.shipping_method.findOne({
                    where: {
                        [Op.and]: [{
                            name,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                if (checkExist) return { message: "Already Have This Shipping Method!!!", status: false };
            }


            // Update Doc 
            const updateDoc = {
                name,
                description,
                sort_order,
                internal_type,
                updated_by: user.id
            }

            // Update Shipping Method
            const updateShippingM = await db.shipping_method.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Formation
            if (updateShippingM) {
                return {
                    message: "Shipping Method Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Shipping Method List Admin API
    getShippingMethodListAdmin: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.shipping_method.hasAlias('user') && !db.shipping_method.hasAlias('added_by')) {

                await db.shipping_method.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET SHIPPING METHOD List
            const getshippingMethodListAdmin = await db.shipping_method.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Shipping MEthod
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ['sort_order', 'ASC']
                ]
            });


            return {
                message: "GET Shipping Method List For Admin Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getshippingMethodListAdmin
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Shipping Method List PUBLIC API
    getShippingMethodListPublic: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // GET SHIPPING METHOD List PUBLIC
            const getshippingMethodListPublic = await db.shipping_method.findAll({
                where: {
                    [Op.and]: [{
                        status: true,
                        tenant_id: TENANTID,
                        internal_type: false
                    }]
                },
                order: [
                    ['sort_order', 'ASC']
                ]
            });

            return {
                message: "GET Shipping Method List For PUBLIC Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getshippingMethodListPublic
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Shipping Method Status Change API
    shippingMethodStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, status } = req;

            // Update Doc 
            const updateDoc = {
                status,
                updated_by: user.id
            }

            // Update Shipping Method Status
            const updateShippingMStatus = await db.shipping_method.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Formation
            if (updateShippingMStatus) {
                return {
                    message: "Shipping Method Status Changed Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}