const { Op } = require("sequelize");

// Vendor HELPER
module.exports = {
    // CREATE Vendor API
    createVendor: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            // GET DATA
            const { vendor_contact_person, vendor_company_name, vendor_email, vendor_description, vendor_phone_number, vendor_EIN_no, vendor_TAX_ID, vendor_FAX_no, billing_address, shipping_address, vendor_status } = req;

            // Check The Vendor Is Already given or Not
            const checkVendorExist = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        vendor_email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkVendorExist) return { message: "Vendor already exists!", status: false }
            const createVendor = await db.vendor.create({
                vendor_contact_person,
                vendor_company_name,
                vendor_email,
                vendor_description,
                vendor_phone_number,
                vendor_EIN_no,
                vendor_TAX_ID,
                vendor_FAX_no,
                vendor_status,
                tenant_id: TENANTID
            });

            if (createVendor) {

                billing_address.forEach(ele => {
                    const { billing_address, billing_city, billing_PO_code, billing_country, billing_status } = ele
                    db.billing_address.create({
                        ref_id: createVendor.vendor_uuid,
                        ref_model: "vendor",
                        tenant_id: TENANTID,
                        billing_address,
                        billing_city,
                        billing_PO_code,
                        billing_country,
                        billing_status
                    });
                });

                shipping_address.forEach(ele => {
                    const { shipping_address, shipping_city, shipping_PO_code, shipping_country, shipping_status } = ele
                    db.shipping_address.create({
                        ref_id: createVendor.vendor_uuid,
                        ref_model: "vendor",
                        tenant_id: TENANTID,
                        shipping_address,
                        shipping_city,
                        shipping_PO_code,
                        shipping_country,
                        shipping_status
                    });
                });

                return {
                    tenant_id: createVendor.tenant_id,
                    message: "Successfully Created Vendor.",
                    status: true,
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
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
            const { vendor_uuid, vendor_contact_person, vendor_company_name, vendor_email, vendor_description, vendor_phone_number, vendor_EIN_no, vendor_TAX_ID, vendor_FAX_no, billing_address, shipping_address, vendor_status } = req


            // Check The Vendor Is Already Taken or Not
            const checkVendorExist = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        vendor_email,
                        tenant_id: TENANTID
                    }],
                    [Op.not]: [{
                        vendor_uuid
                    }]
                }
            });

            if (checkVendorExist) return { message: "Already Have This Vendor", status: false }


            // Update Doc
            const updateDoc = {
                vendor_contact_person,
                vendor_company_name,
                vendor_email,
                vendor_description,
                vendor_phone_number,
                vendor_EIN_no,
                vendor_TAX_ID,
                vendor_FAX_no,
                vendor_status,
            }

            // Update Vendor 
            const updateVendor = await db.vendor.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        vendor_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateVendor) return { message: "Update Gone Wrong!!!", status: false }

            billing_address.forEach(ele => {
                const { billing_address, billing_city, billing_PO_code, billing_country, billing_uuid, billing_status } = ele

                if (billing_uuid) {
                    db.billing_address.update({
                        billing_address,
                        billing_city,
                        billing_PO_code,
                        billing_country,
                        billing_status
                    }, {
                        where: {
                            [Op.and]: [{
                                billing_uuid,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                } else {
                    db.billing_address.create({
                        ref_id: vendor_uuid,
                        ref_model: "vendor",
                        tenant_id: TENANTID,
                        billing_address,
                        billing_city,
                        billing_PO_code,
                        billing_country,
                        billing_status
                    });
                }
            });

            shipping_address.forEach(ele => {
                const { shipping_address, shipping_city, shipping_PO_code, shipping_country, shipping_uuid, shipping_status } = ele
                if (shipping_uuid) {
                    db.shipping_address.update({
                        shipping_address,
                        shipping_city,
                        shipping_PO_code,
                        shipping_country,
                        shipping_status
                    }, {
                        where: {
                            [Op.and]: [{
                                shipping_uuid,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                } else {
                    db.shipping_address.create({
                        ref_id: vendor_uuid,
                        ref_model: "vendor",
                        tenant_id: TENANTID,
                        shipping_address,
                        shipping_city,
                        shipping_PO_code,
                        shipping_country,
                        shipping_status
                    });
                }
            });

            // Return Data
            return {
                message: "Vendor Updated Successfully!!!",
                status: true,
                tenant_id: updateVendor.tenant_id
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!", status: false }
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
            const { vendor_uuid, vendor_status } = req

            // Update Doc
            const updateDoc = {
                vendor_status
            }

            // Update Vendor Status
            const updateVendor = await db.vendor.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        vendor_uuid,
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
            if (error) return { message: "Something Went Wrong!!", status: false }
        }

    },

    // GET SINGLE Vendor
    getSingleVendor: async (req, db, user, isAuth, TENANTID) => {

        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };
        // Try Catch Block
        try {

            if (!db.vendor.hasAlias('billing_address')) {
                await db.vendor.hasMany(db.billing_address,
                    {
                        sourceKey: 'vendor_uuid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        }
                    });
            }
    
    
            if (!db.vendor.hasAlias('shipping_address')) {
                await db.vendor.hasMany(db.shipping_address,
                    {
                        sourceKey: 'vendor_uuid',
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        }
                    });
            }

            // Data From Request
            const { vendor_uuid } = req;

            // GET Single Vendor BY CODE
            const getsinglevendor = await db.vendor.findOne({
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
                        vendor_uuid,
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
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET ALL Vendor
    getAllVendor: async (db, user, isAuth, TENANTID) => {

        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };

        // Try Catch Block
        try {
        if (!db.vendor.hasAlias('billing_address')) {
            await db.vendor.hasMany(db.billing_address,
                {
                    sourceKey: 'vendor_uuid',
                    foreignKey: 'ref_id',
                    constraints: false,
                    scope: {
                        ref_model: 'vendor'
                    }
                });
        }


        if (!db.vendor.hasAlias('shipping_address')) {
            await db.vendor.hasMany(db.shipping_address,
                {
                    sourceKey: 'vendor_uuid',
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
                    model: db.billing_address,
                    separate: true,
                },
                {
                    model: db.shipping_address,
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
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}