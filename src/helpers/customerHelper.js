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
            const checkUserExist = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkUserExist) return { message: "User already exists!", status: false }

            const createUser = await db.user.create({
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
            if (!db.user.hasAlias('addresses')) {
                await db.user.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }


            // GET ALL User
            const getallusers = await db.user.findAll({
                include: [
                    {
                        model: db.address,
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
                message: "Get All Customer Success!!!",
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

            if (!db.user.hasAlias('addresses')) {
                await db.user.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }

            // Data From Request
            const { customer_id } = req;

            // GET Single Customer BY CODE
            const getsinglecustomer = await db.user.findOne({
                include: [
                    {
                        model: db.address,
                        separate: true,
                    }
                ],
                where: {
                    [Op.and]: [{
                        id: customer_id,
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
            const {parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status } = req
            const createBilling = db.address.create({
                ref_id: parent_id,
                ref_model: "customer",
                tenant_id: TENANTID,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                type : "billing",
                status,
                phone,
                fax,
                email
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
             const {parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status } = req
             const createShipping = db.address.create({
                 ref_id: parent_id,
                 ref_model: "customer",
                 tenant_id: TENANTID,
                 address1,
                 address2,
                 city,
                 state,
                 zip_code,
                 country,
                 type : "shipping",
                 status,
                 phone,
                 fax,
                 email
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
    updateCustomerAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };
        try {
            const {parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status} = req
            const updateAddress = db.address.update({
                 address1,
                 address2,
                 city,
                 state,
                 zip_code,
                 country,
                 status,
                 phone,
                 fax,
                 email
            }, {
                where: {
                    [Op.and]: [{
                        id: parent_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if(updateAddress){
                return {
                    tenant_id: updateAddress.tenant_id,
                    message: "Successfully Updated Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}