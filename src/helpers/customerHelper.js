const { Op } = require("sequelize");
const { verifierEmail } = require("../utils/verifyEmailSender");
const bcrypt = require('bcrypt');
const { crypt } = require("../utils/hashes");
const config = require('config');

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

            // Email verification Code generate
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            const createUser = await db.user.create({
                first_name,
                last_name,
                email,
                user_status: status,
                verification_code: verificationCode,
                tenant_id: TENANTID,
                created_by: user.id
            });

            if (createUser) {
                // IF SEND EMAIL IS TRUE
                if (send_mail) {
                    let codeHashed = crypt(createUser.email); // TODO ->> SEND THIS ON SET PASSWORD PARAMS
                    // SET PASSWORD URL
                    const setPasswordURL = config.get("ADMIN_URL").concat(config.get("SET_PASSWORD"));
                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: email,
                        subject: "Registration Successfully From Primer Server Parts",
                        message: `Your 6 Digit Verification Code is ${createUser.verification_code}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your SET NEW PASSWORD Link is: ${setPasswordURL.concat(codeHashed)}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);
                }

                return {
                    tenant_id: createUser.tenant_id,
                    message: "Successfully Created User.",
                    status: true,
                    id: createUser.id
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    addCustomerBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            const { parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status, isDefault } = req
            const createBilling = await db.address.create({
                ref_id: user.has_role === '1' ? parent_id : user.id,
                ref_model: "customer",
                tenant_id: TENANTID,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                type: "billing",
                status,
                phone,
                fax,
                email,
                created_by: user.has_role === '1' ? parent_id : user.id,
                updated_by: user.has_role === '1' ? parent_id : user.id
            });

            if (createBilling) {

                // Is Default
                if (isDefault) {
                    const createDefault = await db.default_address.create({
                        customer_id: user.has_role === '1' ? parent_id : user.id,
                        address_type: "billing",
                        address_id: createBilling.id,
                        tenant_id: TENANTID,
                        created_by: user.has_role === '1' ? parent_id : user.id
                    });
                    if (!createDefault) return { message: "Default Address Insert Failed!!!", status: false }
                }


                return {
                    tenant_id: createBilling.tenant_id,
                    message: "Successfully Created Billing Address.",
                    status: true,
                    id: createBilling.id
                }
            }
        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    addCustomerShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            const { parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status, isDefault } = req
            const createShipping = await db.address.create({
                ref_id: user.has_role === '1' ? parent_id : user.id,
                ref_model: "customer",
                tenant_id: TENANTID,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                type: "shipping",
                status,
                phone,
                fax,
                email,
                created_by: user.has_role === '1' ? parent_id : user.id,
                updated_by: user.has_role === '1' ? parent_id : user.id
            });

            if (createShipping) {

                // Is Default
                if (isDefault) {
                    const createDefault = await db.default_address.create({
                        customer_id: user.has_role === '1' ? parent_id : user.id,
                        address_type: "shipping",
                        address_id: createShipping.id,
                        tenant_id: TENANTID,
                        created_by: user.has_role === '1' ? parent_id : user.id
                    });
                    if (!createDefault) return { message: "Default Address Insert Failed!!!", status: false }
                }

                return {
                    tenant_id: createShipping.tenant_id,
                    message: "Successfully Created Shipping Address.",
                    status: true,
                    id: createShipping.id
                }
            }
        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    updateCustomerAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {

            const { id, phone, fax, email, address1, address2, city, state, zip_code, country, status, isDefault, parent_id } = req
            const updateAddress = await db.address.update({
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                status,
                phone,
                fax,
                email,
                updated_by: user.has_role === '1' ? parent_id : user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateAddress) {

                //
                const findAddres = await db.address.findOne({
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!findAddres) return { message: "Coulnd't Found Adress!!!", status: false }

                if (isDefault) {

                    //
                    const findDefaultAddres = await db.default_address.findOne({
                        where: {
                            [Op.and]: [{
                                address_id: id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    if (findDefaultAddres) {

                        db.default_address.update({
                            address_id: id,
                            updated_by: user.has_role === '1' ? parent_id : user.id
                        }, {
                            where: {
                                [Op.and]: [{
                                    customer_id: user.has_role === '1' ? parent_id : user.id,
                                    tenant_id: TENANTID
                                }]
                            }
                        });

                    } else {
                        db.default_address.create({
                            customer_id: user.has_role === '1' ? parent_id : user.id,
                            address_type: findAddres.type,
                            address_id: id,
                            tenant_id: TENANTID,
                            created_by: user.has_role === '1' ? parent_id : user.id
                        });
                    }

                }


                return {
                    tenant_id: updateAddress.tenant_id,
                    message: "Successfully Updated Address.",
                    status: true,
                }
            }
        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}