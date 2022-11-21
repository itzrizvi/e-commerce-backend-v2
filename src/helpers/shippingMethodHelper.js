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
            const { name, description, status, shipping_cost } = req;

            // Shipping Method Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findShippingMethod = await db.shipping_method.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findShippingMethod) return { message: "Already Have This Shipping Method!!!!", status: false }

            // Add Shipping Method TO DB
            const insertShippingMethod = await db.shipping_method.create({
                name,
                slug,
                description,
                status,
                shipping_cost,
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
    // // Update Payment Method API
    // updatePaymentMethod: async (req, db, user, isAuth, TENANTID) => {
    //     // Try Catch Block
    //     try {

    //         // DATA FROM REQUEST
    //         const { id, name, description, status } = req;

    //         // If name also updated
    //         let slug
    //         if (name) {
    //             // Payment Method Slug
    //             slug = slugify(`${name}`, {
    //                 replacement: '-',
    //                 remove: /[*+~.()'"!:@]/g,
    //                 lower: true,
    //                 strict: true,
    //                 trim: true
    //             });

    //             // Check Existence
    //             const checkExist = await db.payment_method.findOne({
    //                 where: {
    //                     [Op.and]: [{
    //                         slug,
    //                         tenant_id: TENANTID
    //                     }],
    //                     [Op.not]: [{
    //                         id
    //                     }]
    //                 }
    //             });

    //             if (checkExist) return { message: "Already Have This Payment Method!!!", status: false };
    //         }


    //         // Update Doc 
    //         const updateDoc = {
    //             name,
    //             slug,
    //             description,
    //             status,
    //             updated_by: user.id
    //         }

    //         // Update Payment Method
    //         const updatePaymentM = await db.payment_method.update(updateDoc, {
    //             where: {
    //                 [Op.and]: [{
    //                     id,
    //                     tenant_id: TENANTID
    //                 }]
    //             }
    //         });


    //         // Return Formation
    //         if (updatePaymentM) {
    //             return {
    //                 message: "Payment Method Updated Successfully!!!",
    //                 status: true,
    //                 tenant_id: TENANTID
    //             }
    //         }

    //     } catch (error) {
    //         if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    //     }
    // },
    // // GET Payment Method List API
    // getPaymentMethodListAdmin: async (db, TENANTID) => {
    //     // Try Catch Block
    //     try {

    //         // Created By Associations
    //         db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
    //         db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

    //         // Check If Has Alias with Users and Roles
    //         if (!db.payment_method.hasAlias('user') && !db.payment_method.hasAlias('added_by')) {

    //             await db.payment_method.hasOne(db.user, {
    //                 sourceKey: 'created_by',
    //                 foreignKey: 'id',
    //                 as: 'added_by'
    //             });
    //         }

    //         // GET PAYMENT METHOD List
    //         const getPaymentMethodListAdmin = await db.payment_method.findAll({
    //             include: [
    //                 {
    //                     model: db.user, as: 'added_by', // Include User who created this Payment MEthod
    //                     include: {
    //                         model: db.role,
    //                         as: 'roles'
    //                     }
    //                 }
    //             ],
    //             where: {
    //                 tenant_id: TENANTID
    //             }
    //         });


    //         return {
    //             message: "GET Payment Method List For Admin Success!!!",
    //             tenant_id: TENANTID,
    //             status: true,
    //             data: getPaymentMethodListAdmin
    //         }


    //     } catch (error) {
    //         if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    //     }
    // },
    // // GET Payment Method List PUBLIC API
    // getPaymentMethodListPublic: async (db, TENANTID) => {
    //     // Try Catch Block
    //     try {

    //         // GET PAYMENT METHOD List PUBLIC
    //         const getPaymentMethodListPublic = await db.payment_method.findAll({
    //             where: {
    //                 [Op.and]: [{
    //                     status: true,
    //                     tenant_id: TENANTID
    //                 }]
    //             }
    //         });

    //         return {
    //             message: "GET Payment Method List For PUBLIC Success!!!",
    //             tenant_id: TENANTID,
    //             status: true,
    //             data: getPaymentMethodListPublic
    //         }


    //     } catch (error) {
    //         if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
    //     }
    // },
}