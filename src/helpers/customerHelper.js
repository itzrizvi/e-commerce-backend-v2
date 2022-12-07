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
    // Add Customer Billing Addresses
    addCustomerBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { addresses } = req;

            // Array Formation For Bulk Create
            let customerBillingAddress = [];
            // Default check
            let defaultBilling = [];
            // GET Ref ID
            let ref_id;

            addresses.forEach(async (address) => {
                ref_id = address.parent_id
                if (address.isDefault) {
                    defaultBilling.push(true);
                }
                if (defaultBilling.length === 1) {

                    await customerBillingAddress.push({
                        ref_id: user.has_role === '1' ? address.parent_id : user.id,
                        ref_model: "customer",
                        phone: address.phone,
                        fax: address.fax,
                        email: address.email,
                        address1: address.address1,
                        address2: address.address2,
                        city: address.city,
                        state: address.state,
                        zip_code: address.zip_code,
                        country: address.country,
                        type: "billing",
                        status: address.status,
                        tenant_id: TENANTID,
                        created_by: user.id,
                        isDefault: address.isDefault
                    });

                }

            });

            if (defaultBilling && defaultBilling.length > 1) {
                return {
                    message: "You Can Only Select Maximum One Default Billing Address!!!",
                    status: false,
                    tenant_id: TENANTID
                }
            }

            if (defaultBilling && defaultBilling.length > 0) {

                const makesDefaultFalse = {
                    isDefault: false,
                    updated_by: user.id
                }

                await db.address.update(makesDefaultFalse, {
                    where: {
                        [Op.and]: [{
                            ref_id: user.has_role === '1' ? ref_id : user.id,
                            ref_model: "customer",
                            type: "billing",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            if (customerBillingAddress && customerBillingAddress.length > 0) {
                const createCustomerBilling = await db.address.bulkCreate(customerBillingAddress);

                if (createCustomerBilling) {
                    return {
                        tenant_id: TENANTID,
                        message: "Successfully Created Customer Billing Address.",
                        status: true,
                    }
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Customer Shipping Addresses
    addCustomerShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { addresses } = req;

            // Array Formation For Bulk Create
            let customerShippingAddress = [];
            // Default check
            let defaultShipping = [];
            // GET Ref ID
            let ref_id;

            addresses.forEach(async (address) => {

                ref_id = address.parent_id
                if (address.isDefault) {
                    defaultShipping.push(true);
                }

                if (defaultShipping.length === 1) {
                    await customerShippingAddress.push({
                        ref_id: user.has_role === '1' ? address.parent_id : user.id,
                        ref_model: "customer",
                        phone: address.phone,
                        fax: address.fax,
                        email: address.email,
                        address1: address.address1,
                        address2: address.address2,
                        city: address.city,
                        state: address.state,
                        zip_code: address.zip_code,
                        country: address.country,
                        type: "shipping",
                        status: address.status,
                        tenant_id: TENANTID,
                        created_by: user.id,
                        isDefault: address.isDefault
                    });
                }

            });

            if (defaultShipping && defaultShipping.length > 1) {
                return {
                    message: "You Can Only Select Maximum One Default Shipping Address!!!",
                    status: false,
                    tenant_id: TENANTID
                }
            }

            if (defaultShipping && defaultShipping.length > 0) {

                const makesDefaultFalse = {
                    isDefault: false,
                    updated_by: user.id
                }

                await db.address.update(makesDefaultFalse, {
                    where: {
                        [Op.and]: [{
                            ref_id: user.has_role === '1' ? ref_id : user.id,
                            ref_model: "customer",
                            type: "shipping",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            if (customerShippingAddress && customerShippingAddress.length > 0) {
                const createCustomerShipping = await db.address.bulkCreate(customerShippingAddress);

                if (createCustomerShipping) {
                    return {
                        tenant_id: TENANTID,
                        message: "Successfully Created Customer Shipping Address.",
                        status: true,
                    }
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Customer Address
    updateCustomerAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { ref_id, type, addresses } = req;

            if (addresses && addresses.length > 0) {

                // Extract New Addresses
                let newAddresses = [];
                //
                addresses.forEach(async (addrss) => {
                    if (addrss.isNew) {

                        //
                        newAddresses.push({
                            ref_id: user.has_role === '1' ? addrss.parent_id : user.id,
                            ref_model: "customer",
                            phone: addrss.phone,
                            fax: addrss.fax,
                            email: addrss.email,
                            address1: addrss.address1,
                            address2: addrss.address2,
                            city: addrss.city,
                            state: addrss.state,
                            zip_code: addrss.zip_code,
                            country: addrss.country,
                            type: type,
                            status: addrss.status,
                            tenant_id: TENANTID,
                            created_by: user.id,
                            isDefault: addrss.isDefault
                        });
                    }
                });

                //
                let oldAddresses = addresses.filter((address) => !address.isNew);

                // Differentiate By Type
                if (type === "billing") {
                    //
                    customerUpdatedBillingAddress = [];
                    // Old Address IDS
                    let oldAddressIDs = [];

                    oldAddresses.forEach(async (address) => {
                        oldAddressIDs.push(address.id);

                        //
                        customerUpdatedBillingAddress.push({
                            id: address.id,
                            ref_id: user.has_role === '1' ? address.parent_id : user.id,
                            ref_model: "customer",
                            phone: address.phone,
                            fax: address.fax,
                            email: address.email,
                            address1: address.address1,
                            address2: address.address2,
                            city: address.city,
                            state: address.state,
                            zip_code: address.zip_code,
                            country: address.country,
                            type: "billing",
                            status: address.status,
                            tenant_id: TENANTID,
                            created_by: user.id,
                            isDefault: address.isDefault
                        });


                    });

                    // console.log("BILLING", customerUpdatedBillingAddress)
                    // Delete Billing Addresses Which Were Removed
                    if (oldAddressIDs && oldAddressIDs.length > 0) {
                        await db.address.destroy({
                            where: {
                                [Op.and]: [{
                                    id: {
                                        [Op.notIn]: oldAddressIDs
                                    },
                                    ref_id,
                                    ref_model: "customer",
                                    type: type,
                                    tenant_id: TENANTID
                                }]
                            }
                        });
                    }


                    //
                    if (customerUpdatedBillingAddress && customerUpdatedBillingAddress.length > 0) {
                        //
                        customerUpdatedBillingAddress.forEach(async (element) => {
                            await db.address.update({
                                ref_id: user.has_role === '1' ? element.parent_id : user.id,
                                ref_model: "customer",
                                phone: element.phone,
                                fax: element.fax,
                                email: element.email,
                                address1: element.address1,
                                address2: element.address2,
                                city: element.city,
                                state: element.state,
                                zip_code: element.zip_code,
                                country: element.country,
                                type: type,
                                status: element.status,
                                tenant_id: TENANTID,
                                updated_by: user.id,
                                isDefault: element.isDefault
                            }, {
                                where: {
                                    [Op.and]: [{
                                        id: element.id,
                                        ref_id,
                                        ref_model: "customer",
                                        type: type,
                                        tenant_id: TENANTID
                                    }]
                                }
                            });

                        });
                    }

                    if (newAddresses && newAddresses.length > 0) {
                        const createNewCustomerBilling = await db.address.bulkCreate(newAddresses);
                        if (!createNewCustomerBilling) return { message: "New Billing Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
                    }

                    // Return Formation
                    return {
                        message: "Customer Billing Address Updated Successfully!!!",
                        tenant_id: TENANTID,
                        status: true
                    }


                } else if (type === "shipping") {

                    //
                    customerUpdatedShippingAddress = [];
                    // Old Address IDS
                    let oldAddressIDs = [];

                    oldAddresses.forEach(async (address) => {
                        oldAddressIDs.push(address.id);

                        //
                        await customerUpdatedShippingAddress.push({
                            id: address.id,
                            ref_id: user.has_role === '1' ? address.parent_id : user.id,
                            ref_model: "customer",
                            phone: address.phone,
                            fax: address.fax,
                            email: address.email,
                            address1: address.address1,
                            address2: address.address2,
                            city: address.city,
                            state: address.state,
                            zip_code: address.zip_code,
                            country: address.country,
                            type: "shipping",
                            status: address.status,
                            tenant_id: TENANTID,
                            created_by: user.id,
                            isDefault: address.isDefault
                        });

                    });

                    // console.log("SHIPPING", customerUpdatedShippingAddress)


                    // Delete Shipping Addresses Which Were Removed
                    if (oldAddressIDs && oldAddressIDs.length > 0) {
                        await db.address.destroy({
                            where: {
                                [Op.and]: [{
                                    id: {
                                        [Op.notIn]: oldAddressIDs
                                    },
                                    ref_id,
                                    ref_model: "customer",
                                    type: type,
                                    tenant_id: TENANTID
                                }]
                            }
                        });
                    }

                    //
                    if (customerUpdatedShippingAddress && customerUpdatedShippingAddress.length > 0) {
                        //
                        customerUpdatedShippingAddress.forEach(async (element) => {
                            await db.address.update({
                                ref_id: user.has_role === '1' ? element.parent_id : user.id,
                                ref_model: "customer",
                                phone: element.phone,
                                fax: element.fax,
                                email: element.email,
                                address1: element.address1,
                                address2: element.address2,
                                city: element.city,
                                state: element.state,
                                zip_code: element.zip_code,
                                country: element.country,
                                type: type,
                                status: element.status,
                                tenant_id: TENANTID,
                                updated_by: user.id,
                                isDefault: element.isDefault
                            }, {
                                where: {
                                    [Op.and]: [{
                                        id: element.id,
                                        ref_id,
                                        ref_model: "customer",
                                        type: type,
                                        tenant_id: TENANTID
                                    }]
                                }
                            });

                        });
                    }

                    if (newAddresses && newAddresses.length > 0) {
                        const createNewCustomerShipping = await db.address.bulkCreate(newAddresses);
                        if (!createNewCustomerShipping) return { message: "New Shipping Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
                    }

                    // Return Formation
                    return {
                        message: "Customer Shipping Address Updated Successfully!!!",
                        tenant_id: TENANTID,
                        status: true
                    }

                }

            } else {

                await db.address.destroy({
                    where: {
                        [Op.and]: [{
                            ref_id,
                            ref_model: "customer",
                            type: type,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Return Formation
                return {
                    message: "Customer Address Updated Successfully!!!",
                    tenant_id: TENANTID,
                    status: true
                }

            }
        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}