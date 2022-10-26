const { Op } = require("sequelize");
const { verifierEmail } = require("../utils/verifyEmailSender");
const bcrypt = require('bcrypt');

// Customer HELPER
module.exports = {
    // CREATE Customer API
    createCustomer: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };

        try {
            // GET DATA
            const {
                first_name,
                last_name,
                email,
                password,
                status,
                send_mail
             } = req;

            // Check The User Is Already given or Not
            const checkUserExist = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkUserExist) return { message: "User already exists!", status: false }

            const createUser = await db.users.create({
                first_name,
                last_name,
                email,
                password : await bcrypt.hash(password, 10),
                user_status: status,
                tenant_id: TENANTID
            });

            if (createUser) {
                // IF SEND EMAIL IS TRUE
                if (send_mail) {
                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: email,
                        subject: "Registration Successfully From Primer Server Parts",
                        message: `Your email : ${email} and Your Password: ${password}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);
                }
                return {
                    tenant_id: createUser.tenant_id,
                    message: "Successfully Created User.",
                    status: true,
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },
    getAllCustomer: async (db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };
        // Try Catch Block
        try {
            if (!db.users.hasAlias('billing_address')) {
                await db.users.hasMany(db.billing_address,
                    {
                        sourceKey: 'uid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }


            if (!db.users.hasAlias('shipping_address')) {
                await db.users.hasMany(db.shipping_address,
                    {
                        sourceKey: 'uid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }

            // GET ALL User
            const getallusers = await db.users.findAll({
                include: [
                    {
                        model: db.billing_address,
                        separate: true,
                    },
                    {
                        model: db.shipping_address,
                        separate: true,
                    }
                ],
                where: {
                    tenant_id: TENANTID,
                    has_role: '0'
                }
            });

            // Return 
            return {
                message: "Get All Users Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getallusers
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getSingleCustomer: async (req, db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };
        // Try Catch Block
        try {

            if (!db.users.hasAlias('billing_address')) {
                await db.users.hasMany(db.billing_address,
                    {
                        sourceKey: 'uid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }
    
    
            if (!db.users.hasAlias('shipping_address')) {
                await db.users.hasMany(db.shipping_address,
                    {
                        sourceKey: 'uid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }

            // Data From Request
            const { customer_uuid } = req;

            // GET Single Customer BY CODE
            const getsinglecustomer = await db.users.findOne({
                include: [
                    {
                        model: db.billing_address,
                        separate: true,
                    },
                    {
                        model: db.shipping_address,
                        separate: true,
                    }
                ],
                where: {
                    [Op.and]: [{
                        uid: customer_uuid,
                        tenant_id: TENANTID,
                        has_role: '0'
                    }]
                }
            });

            // Return 
            return {
                message: "Get Single Customer!!!",
                status: true,
                tenant_id: TENANTID,
                data: getsinglecustomer
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    addCustomerBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };

        try {
            const {customer_uuid, billing_address, billing_city, billing_PO_code, billing_country} = req
            const createBilling = db.billing_address.create({
                ref_id: customer_uuid,
                ref_model: "customer",
                tenant_id: TENANTID,
                billing_address,
                billing_city,
                billing_PO_code,
                billing_country
            });

            if(createBilling){
                return {
                    tenant_id: createBilling.tenant_id,
                    message: "Successfully Created Billing Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    addCustomerShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };
        try {
            const {customer_uuid, shipping_address, shipping_city, shipping_PO_code, shipping_country} = req
            const createShipping = db.shipping_address.create({
                ref_id: customer_uuid,
                ref_model: "customer",
                tenant_id: TENANTID,
                shipping_address,
                shipping_city,
                shipping_PO_code,
                shipping_country
            });

            if(createShipping){
                return {
                    tenant_id: createShipping.tenant_id,
                    message: "Successfully Created Shipping Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    updateCustomerBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };
        try {
            const {billing_uuid, billing_address, billing_city, billing_PO_code, billing_country} = req
            const updateBilling = db.billing_address.update({
                billing_address,
                billing_city,
                billing_PO_code,
                billing_country
            }, {
                where: {
                    [Op.and]: [{
                        billing_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            if(updateBilling){
                return {
                    tenant_id: updateBilling.tenant_id,
                    message: "Successfully Updated Billing Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    updateCustomerShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };
        try {
            const {shipping_uuid, shipping_address, shipping_city, shipping_PO_code, shipping_country} = req
            const updateBilling = db.shipping_address.update({
                shipping_address,
                shipping_city,
                shipping_PO_code,
                shipping_country
            }, {
                where: {
                    [Op.and]: [{
                        shipping_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            if(updateBilling){
                return {
                    tenant_id: updateBilling.tenant_id,
                    message: "Successfully Updated Shipping Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}