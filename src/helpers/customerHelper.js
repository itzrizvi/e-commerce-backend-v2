const { Op } = require("sequelize");
const { crypt } = require("../utils/hashes");
const config = require('config');
const { Mail } = require("../utils/email");

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
                send_mail,
                phone,
                fax,
                company_name
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
                phone,
                fax,
                company_name,
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
                    const setPasswordURL = config.get("ECOM_URL").concat(config.get("RESET_PASSWORD"));

                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "Customer Registration From Prime Server Parts"
                    const mailData = {
                        companyInfo: {
                            logo: config.get("SERVER_URL").concat("media/email-assets/logo.jpg"),
                            banner: config.get("SERVER_URL").concat("media/email-assets/banner.jpeg"),
                            companyName: config.get("COMPANY_NAME"),
                            companyUrl: config.get("ECOM_URL"),
                            shopUrl: config.get("ECOM_URL"),
                            fb: config.get("SERVER_URL").concat("media/email-assets/fb.png"),
                            tw: config.get("SERVER_URL").concat("media/email-assets/tw.png"),
                            li: config.get("SERVER_URL").concat("media/email-assets/in.png"),
                            insta: config.get("SERVER_URL").concat("media/email-assets/inst.png")
                        },
                        about: 'User Created From Prime Server Parts',
                        email: createUser.email,
                        verificationCode: createUser.verification_code,
                        passwordSetLink: setPasswordURL.concat(codeHashed),
                        message: `This Code Will Be Valid Till 20 Minutes From You Got The Email`
                    }

                    // SENDING EMAIL
                    await Mail(email, mailSubject, mailData, 'customer-sign-up-from-admin', TENANTID);
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
    getAllCustomer: async (req, db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };
        // Try Catch Block
        try {

            const { searchQuery,
                customerStatus,
                emailVerified,
                customerEntryStartDate,
                customerEntryEndDate } = req;

            if (!db.user.hasAlias('addresses')) {
                await db.user.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        as: "addresses",
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }


            const twoDateFilterWhere = customerEntryStartDate && customerEntryEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(customerEntryStartDate),
                    [Op.lte]: new Date(customerEntryEndDate),
                }]
            } : {};

            const startDateFilterWhere = (customerEntryStartDate && !customerEntryEndDate) ? {
                [Op.gte]: new Date(customerEntryStartDate)
            } : {};

            const endDateFilterWhere = (customerEntryEndDate && !customerEntryStartDate) ? {
                [Op.lte]: new Date(customerEntryEndDate)
            } : {};

            // GET ALL User
            const getallusers = await db.user.findAll({
                include: [
                    {
                        model: db.address,
                        as: "addresses",
                        separate: true,
                    }
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        has_role: '0'
                    }],
                    ...(searchQuery && {
                        [Op.or]: [
                            {
                                email: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                first_name: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                last_name: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            }
                        ]
                    }),
                    ...(customerStatus && { user_status: JSON.parse(customerStatus) }),
                    ...(emailVerified && { email_verified: JSON.parse(emailVerified) }),
                    ...((customerEntryStartDate || customerEntryEndDate) && {
                        createdAt: {
                            [Op.or]: [{
                                ...(twoDateFilterWhere && twoDateFilterWhere),
                                ...(startDateFilterWhere && startDateFilterWhere),
                                ...(endDateFilterWhere && endDateFilterWhere),
                            }],
                        }
                    }),

                },
                order: [
                    ['updatedAt', 'DESC']
                ]
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
        // Try Catch Block
        try {

            if (!db.user.hasAlias('addresses')) {
                await db.user.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        as: "addresses",
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }
            if (!db.user.hasAlias('contact_person') && !db.user.hasAlias('contactPersons')) {
                await db.user.hasMany(db.contact_person,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        },
                        as: "contactPersons"
                    });
            }

            // 
            if (!db.address.hasAlias('country') && !db.address.hasAlias('countryCode')) {
                await db.address.hasOne(db.country, {
                    sourceKey: 'country',
                    foreignKey: 'code',
                    as: 'countryCode'
                });
            }

            // Data From Request
            const { customer_id } = req;

            // GET Single Customer BY CODE
            const getsinglecustomer = await db.user.findOne({
                include: [
                    {
                        model: db.address,
                        as: "addresses",
                        separate: true,
                        include: { model: db.country, as: "countryCode" }
                    },
                    { model: db.contact_person, as: "contactPersons" }
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
                if (defaultBilling.length <= 1) {

                    await customerBillingAddress.push({
                        ref_id: user.has_role === '1' ? address.parent_id : user.id,
                        ref_model: "customer",
                        phone: address?.phone,
                        fax: address?.fax,
                        email: address?.email,
                        address1: address.address1,
                        address2: address?.address2,
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

            await addresses.forEach(async (address) => {

                ref_id = address.parent_id
                if (address.isDefault) {
                    await defaultShipping.push(true);
                }
                if (defaultShipping.length <= 1) {
                    await customerShippingAddress.push({
                        ref_id: user.has_role === '1' ? address.parent_id : user.id,
                        ref_model: "customer",
                        phone: address?.phone,
                        fax: address?.fax,
                        email: address?.email,
                        address1: address.address1,
                        address2: address?.address2,
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
    // Add Customer Single Billing Addresses
    addCustomerSingleBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { phone,
                fax,
                email,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                status,
                isDefault } = req;


            const customerSingleBillingAddress = {
                ref_id: user.id,
                ref_model: "customer",
                phone,
                fax,
                email: email ?? user.email,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                type: "billing",
                status,
                tenant_id: TENANTID,
                created_by: user.id,
                isDefault
            };


            if (isDefault) {

                const makesDefaultFalse = {
                    isDefault: false,
                    updated_by: user.id
                }

                await db.address.update(makesDefaultFalse, {
                    where: {
                        [Op.and]: [{
                            ref_id: user.id,
                            ref_model: "customer",
                            type: "billing",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            const insertAddress = await db.address.create(customerSingleBillingAddress);
            if (!insertAddress) return { message: "Address Couldn't Inserted!!!", status: false }


            // Return Formation
            return {
                message: "Customer Billing Address Added Successfully!!!",
                tenant_id: TENANTID,
                status: true,
                id: insertAddress.id
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Customer Single Shipping Addresses
    addCustomerSingleShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { phone,
                fax,
                email,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                status,
                isDefault } = req;


            const customerSingleShippingAddress = {
                ref_id: user.id,
                ref_model: "customer",
                phone,
                fax,
                email: email ?? user.email,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                type: "shipping",
                status,
                tenant_id: TENANTID,
                created_by: user.id,
                isDefault
            };


            if (isDefault) {

                const makesDefaultFalse = {
                    isDefault: false,
                    updated_by: user.id
                }

                await db.address.update(makesDefaultFalse, {
                    where: {
                        [Op.and]: [{
                            ref_id: user.id,
                            ref_model: "customer",
                            type: "shipping",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            const insertAddress = await db.address.create(customerSingleShippingAddress);
            if (!insertAddress) return { message: "Address Couldn't Inserted!!!", status: false }


            // Return Formation
            return {
                message: "Customer Shipping Address Added Successfully!!!",
                tenant_id: TENANTID,
                status: true,
                id: insertAddress.id
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Customer Addresses
    updateCustomerSingleAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id,
                type,
                phone,
                fax,
                email,
                address1,
                address2,
                city,
                state,
                zip_code,
                country,
                status,
                isDefault } = req;

            //
            if (type === "shipping") {

                const updateDoc = {
                    ref_id: user.id,
                    ref_model: "customer",
                    phone,
                    fax,
                    email: email ?? user.email,
                    address1,
                    address2,
                    city,
                    state,
                    zip_code,
                    country,
                    type: "shipping",
                    status,
                    tenant_id: TENANTID,
                    created_by: user.id,
                    isDefault
                };


                if (isDefault) {

                    const makesDefaultFalse = {
                        isDefault: false,
                        updated_by: user.id
                    }

                    await db.address.update(makesDefaultFalse, {
                        where: {
                            [Op.and]: [{
                                ref_id: user.id,
                                ref_model: "customer",
                                type: "shipping",
                                tenant_id: TENANTID
                            }]
                        }
                    });
                }

                const updateAddress = await db.address.update(updateDoc, {
                    where: {
                        [Op.and]: [{
                            id,
                            ref_id: user.id,
                            ref_model: "customer",
                            type: "shipping",
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!updateAddress) return { message: "Shipping Address Update Failed!!!", status: false }


                // Return Formation
                return {
                    message: "Customer Shipping Address Updated Successfully!!!",
                    tenant_id: TENANTID,
                    status: true
                }


            } else if (type === "billing") {


                const updateDoc = {
                    ref_id: user.id,
                    ref_model: "customer",
                    phone,
                    fax,
                    email: email ?? user.email,
                    address1,
                    address2,
                    city,
                    state,
                    zip_code,
                    country,
                    type: "billing",
                    status,
                    tenant_id: TENANTID,
                    created_by: user.id,
                    isDefault
                };


                if (isDefault) {

                    const makesDefaultFalse = {
                        isDefault: false,
                        updated_by: user.id
                    }

                    await db.address.update(makesDefaultFalse, {
                        where: {
                            [Op.and]: [{
                                ref_id: user.id,
                                ref_model: "customer",
                                type: "billing",
                                tenant_id: TENANTID
                            }]
                        }
                    });
                }

                const updateAddress = await db.address.update(updateDoc, {
                    where: {
                        [Op.and]: [{
                            id,
                            ref_id: user.id,
                            ref_model: "customer",
                            type: "billing",
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!updateAddress) return { message: "Billing Address Update Failed!!!", status: false }


                // Return Formation
                return {
                    message: "Customer Billing Address Updated Successfully!!!",
                    tenant_id: TENANTID,
                    status: true
                }


            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // UPDATE Customer API
    updateCustomer: async (req, db, user, isAuth, TENANTID) => {

        try {
            // GET DATA
            const {
                id,
                first_name,
                last_name,
                user_status,
                send_mail,
                phone,
                fax,
                company_name
            } = req;

            // Update Doc
            const updateDoc = {
                first_name,
                last_name,
                user_status,
                phone,
                fax,
                company_name
            }
            const updatecustomer = await db.user.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updatecustomer) return { message: "Customer Update Failed!!!", status: false }


            if (updatecustomer) {

                const findUpdatedUser = await db.user.findOne({
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                const { email } = findUpdatedUser;

                if (send_mail) {
                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "Profile Update From Prime Server Parts"
                    const mailData = {
                        companyInfo: {
                            logo: config.get("SERVER_URL").concat("media/email-assets/logo.jpg"),
                            banner: config.get("SERVER_URL").concat("media/email-assets/banner.jpeg"),
                            companyName: config.get("COMPANY_NAME"),
                            companyUrl: config.get("ECOM_URL"),
                            shopUrl: config.get("ECOM_URL"),
                            fb: config.get("SERVER_URL").concat("media/email-assets/fb.png"),
                            tw: config.get("SERVER_URL").concat("media/email-assets/tw.png"),
                            li: config.get("SERVER_URL").concat("media/email-assets/in.png"),
                            insta: config.get("SERVER_URL").concat("media/email-assets/inst.png")
                        },
                        about: 'Your Profile Has Been Updated on Prime Server Parts',
                        message: `Your Profile Has Been Updated From Prime Server Parts System. If Your Did not recognze it please contact with support team!!!`
                    }

                    // SENDING EMAIL
                    await Mail(email, mailSubject, mailData, 'profile-update-confirmation', TENANTID);
                }


                return {
                    tenant_id: TENANTID,
                    message: "Successfully Updated Customer.",
                    status: true,
                    id: id
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },
    // GET SEARCHED CUSTOMERS
    getSearchedCustomers: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { searchQuery } = req;


            if (!db.user.hasAlias('address') && !db.user.hasAlias('addresses')) {
                await db.user.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        as: "addresses",
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        }
                    });
            }

            // 
            if (!db.address.hasAlias('country') && !db.address.hasAlias('countryCode')) {
                await db.address.hasOne(db.country, {
                    sourceKey: 'country',
                    foreignKey: 'code',
                    as: 'countryCode'
                });
            }

            if (!db.user.hasAlias('contact_person') && !db.user.hasAlias('contactPersons')) {
                await db.user.hasMany(db.contact_person,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'customer'
                        },
                        as: "contactPersons"
                    });
            }

            let cID = parseInt(searchQuery);
            let customerID;
            let notANumber = isNaN(cID);
            if (!notANumber) {
                customerID = cID
            }

            // GET Searched Customer
            const getsearchedcustomers = await db.user.findAll({
                include: [
                    {
                        model: db.address,
                        as: "addresses",
                        separate: true,
                        include: { model: db.country, as: "countryCode" }
                    },
                    { model: db.contact_person, as: "contactPersons" }
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        has_role: '0',
                        user_status: true,
                    }],
                    ...((searchQuery && !customerID) && {
                        [Op.or]: [
                            {
                                email: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                first_name: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                last_name: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            }
                        ]
                    }),
                    ...(customerID && {
                        id: customerID
                    })
                }
            });

            // Return 
            return {
                message: "Get Searched Customer!!!",
                status: true,
                tenant_id: TENANTID,
                data: getsearchedcustomers
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET CUSTOMER Contact person List
    getContactPersonListByCustomerID: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { customer_id } = req;

            // LIST
            const getlist = await db.contact_person.findAll({
                where: {
                    [Op.and]: [{
                        ref_id: customer_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return 
            return {
                message: "Get Customer Contact Person List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getlist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}