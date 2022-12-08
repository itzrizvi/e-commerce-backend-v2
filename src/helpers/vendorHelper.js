const { Op } = require("sequelize");

// Vendor HELPER
module.exports = {
    // CREATE Vendor API
    createVendor: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            // GET DATA
            const { contact_person, company_name, email, description, phone_number, EIN_no, TAX_ID, FAX_no, status } = req;

            // Check The Vendor Is Already given or Not
            const checkVendorExist = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkVendorExist) return { message: "Vendor already exists!", status: false }
            const createVendor = await db.vendor.create({
                contact_person,
                company_name,
                email,
                description,
                phone_number,
                EIN_no,
                TAX_ID,
                FAX_no,
                status,
                tenant_id: TENANTID
            });

            return {
                tenant_id: createVendor.tenant_id,
                message: "Successfully Created Vendor.",
                status: true,
                id: createVendor.id
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },
    // Update Vendor API
    updateVendor: async (req, db, user, isAuth, TENANTID) => {

        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const { id, contact_person, company_name, email, description, phone_number, EIN_no, TAX_ID, FAX_no, status } = req


            // Check The Vendor Is Already Taken or Not
            const checkVendorExist = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }],
                    [Op.not]: [{
                        id
                    }]
                }
            });

            if (checkVendorExist) return { message: "Already Have This Vendor", status: false }


            // Update Doc
            const updateDoc = {
                contact_person,
                company_name,
                email,
                description,
                phone_number,
                EIN_no,
                TAX_ID,
                FAX_no,
                status,
            }

            // Update Vendor 
            const updateVendor = await db.vendor.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateVendor) return { message: "Update Gone Wrong!!!", status: false }

            // Return Data
            return {
                message: "Vendor Updated Successfully!!!",
                status: true,
                tenant_id: updateVendor.tenant_id
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },
    // Update Vendor Status API
    updateVendorStatus: async (req, db, user, isAuth, TENANTID) => {

        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const { id, status } = req

            // Update Doc
            const updateDoc = {
                status
            }

            // Update Vendor Status
            const updateVendor = await db.vendor.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateVendor) return { message: "Update Gone Wrong!!!", status: false }

            // Return Data
            return {
                message: "Vendor Status Updated Successfully!!!",
                status: true,
                tenant_id: updateVendor.tenant_id
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },
    // GET SINGLE Vendor
    getSingleVendor: async (req, db, user, isAuth, TENANTID) => {

        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };
        // Try Catch Block
        try {

            if (!db.vendor.hasAlias('addresses')) {
                await db.vendor.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        }
                    });
            }

            // Data From Request
            const { id } = req;

            // GET Single Vendor BY CODE
            const getsinglevendor = await db.vendor.findOne({
                include: [
                    {
                        model: db.address,
                        separate: true,
                    }
                ],
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return 
            return {
                message: "Get Single Vendor!!!",
                status: true,
                tenant_id: TENANTID,
                data: getsinglevendor
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET ALL Vendor
    getAllVendor: async (db, user, isAuth, TENANTID) => {

        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };

        // Try Catch Block
        try {
            if (!db.vendor.hasAlias('addresses')) {
                await db.vendor.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        }
                    });
            }

            // GET ALL Vendor
            const getallvendor = await db.vendor.findAll({
                include: [
                    {
                        model: db.address,
                        separate: true,
                    }
                ],
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return 
            return {
                message: "Get All Vendor Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getallvendor
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    updateVendorAddress: async (req, db, user, isAuth, TENANTID) => {
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
                            ref_id: addrss.parent_id,
                            ref_model: "vendor",
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
                    vendorUpdatedBillingAddress = [];
                    // Old Address IDS
                    let oldAddressIDs = [];

                    oldAddresses.forEach(async (address) => {
                        oldAddressIDs.push(address.id);

                        //
                        vendorUpdatedBillingAddress.push({
                            id: address.id,
                            ref_id: address.parent_id,
                            ref_model: "vendor",
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

                    // console.log("BILLING", vendorUpdatedBillingAddress)
                    // Delete Billing Addresses Which Were Removed
                    if (oldAddressIDs && oldAddressIDs.length > 0) {
                        await db.address.destroy({
                            where: {
                                [Op.and]: [{
                                    id: {
                                        [Op.notIn]: oldAddressIDs
                                    },
                                    ref_id,
                                    ref_model: "vendor",
                                    type: type,
                                    tenant_id: TENANTID
                                }]
                            }
                        });
                    }


                    //
                    if (vendorUpdatedBillingAddress && vendorUpdatedBillingAddress.length > 0) {
                        //
                        vendorUpdatedBillingAddress.forEach(async (element) => {
                            await db.address.update({
                                ref_id: element.parent_id,
                                ref_model: "vendor",
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
                                        ref_model: "vendor",
                                        type: type,
                                        tenant_id: TENANTID
                                    }]
                                }
                            });

                        });
                    }

                    if (newAddresses && newAddresses.length > 0) {
                        const createNewVendorBilling = await db.address.bulkCreate(newAddresses);
                        if (!createNewVendorBilling) return { message: "New Billing Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
                    }

                    // Return Formation
                    return {
                        message: "Vendor Billing Address Updated Successfully!!!",
                        tenant_id: TENANTID,
                        status: true
                    }


                } else if (type === "shipping") {

                    //
                    vendorUpdatedShippingAddress = [];
                    // Old Address IDS
                    let oldAddressIDs = [];

                    oldAddresses.forEach(async (address) => {
                        oldAddressIDs.push(address.id);

                        //
                        await vendorUpdatedShippingAddress.push({
                            id: address.id,
                            ref_id: address.parent_id,
                            ref_model: "vendor",
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

                    // console.log("SHIPPING", vendorUpdatedShippingAddress)


                    // Delete Shipping Addresses Which Were Removed
                    if (oldAddressIDs && oldAddressIDs.length > 0) {
                        await db.address.destroy({
                            where: {
                                [Op.and]: [{
                                    id: {
                                        [Op.notIn]: oldAddressIDs
                                    },
                                    ref_id,
                                    ref_model: "vendor",
                                    type: type,
                                    tenant_id: TENANTID
                                }]
                            }
                        });
                    }

                    //
                    if (vendorUpdatedShippingAddress && vendorUpdatedShippingAddress.length > 0) {
                        //
                        vendorUpdatedShippingAddress.forEach(async (element) => {
                            await db.address.update({
                                ref_id: element.parent_id,
                                ref_model: "vendor",
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
                                        ref_model: "vendor",
                                        type: type,
                                        tenant_id: TENANTID
                                    }]
                                }
                            });

                        });
                    }

                    if (newAddresses && newAddresses.length > 0) {
                        const createNewVendorShipping = await db.address.bulkCreate(newAddresses);
                        if (!createNewVendorShipping) return { message: "New Shipping Address Couldn't Inserted!!!", status: false, tenant_id: TENANTID }
                    }

                    // Return Formation
                    return {
                        message: "Vendor Shipping Address Updated Successfully!!!",
                        tenant_id: TENANTID,
                        status: true
                    }

                }

            } else {

                await db.address.destroy({
                    where: {
                        [Op.and]: [{
                            ref_id,
                            ref_model: "vendor",
                            type: type,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Return Formation
                return {
                    message: "Vendor Address Updated Successfully!!!",
                    tenant_id: TENANTID,
                    status: true
                }

            }
        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Vendor Billing Addresses
    addVendorBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { addresses } = req;

            // Array Formation For Bulk Create
            let vendorBillingAddress = [];
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

                    await vendorBillingAddress.push({
                        ref_id: address.parent_id,
                        ref_model: "vendor",
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
                            ref_id,
                            ref_model: "vendor",
                            type: "billing",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            if (vendorBillingAddress && vendorBillingAddress.length > 0) {
                const createVendorBilling = await db.address.bulkCreate(vendorBillingAddress);

                if (createVendorBilling) {
                    return {
                        tenant_id: TENANTID,
                        message: "Successfully Created Vendor Billing Address.",
                        status: true,
                    }
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Vendor Shipping Addresses
    addVendorShippingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { addresses } = req;

            // Array Formation For Bulk Create
            let vendorShippingAddress = [];
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
                    await vendorShippingAddress.push({
                        ref_id: address.parent_id,
                        ref_model: "vendor",
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
                            ref_id,
                            ref_model: "vendor",
                            type: "shipping",
                            tenant_id: TENANTID
                        }]
                    }
                });
            }

            if (vendorShippingAddress && vendorShippingAddress.length > 0) {
                const createVendorShipping = await db.address.bulkCreate(vendorShippingAddress);

                if (createVendorShipping) {
                    return {
                        tenant_id: TENANTID,
                        message: "Successfully Created Vendor Shipping Address.",
                        status: true,
                    }
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}