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
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    addVendorBillingAddress: async (req, db, user, isAuth, TENANTID) => {
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };
        if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };

        try {
            const {parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status } = req
            const createBilling = db.address.create({
                ref_id: parent_id,
                ref_model: "vendor",
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
    addVendorShippingAddress: async (req, db, user, isAuth, TENANTID) => {
         // Auth Check
         if (!isAuth) return { message: "Not Authorized", status: false };
         if (!user.has_role || user.has_role === '0') return { message: "Not Authorized", status: false };
 
         try {
             const {parent_id, phone, fax, email, address1, address2, city, state, zip_code, country, status } = req
             const createShipping = db.address.create({
                 ref_id: parent_id,
                 ref_model: "vendor",
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
    updateVendorAddress: async (req, db, user, isAuth, TENANTID) => {
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