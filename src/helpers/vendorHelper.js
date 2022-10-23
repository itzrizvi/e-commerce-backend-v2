const { Op } = require("sequelize");

// Vendor HELPER
module.exports = {
    // CREATE Vendor API
    createVendor: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try{
            // GET DATA
            const { vendor_name, vendor_company_name, vendor_email, vendor_description, vendor_address, vendor_city, vendor_country, vendor_status } = req;

            // Need to implement this user buy or not this product after order module finished
            // To DO

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
                vendor_name,
                vendor_company_name,
                vendor_email,
                vendor_description,
                vendor_address,
                vendor_city,
                vendor_country,
                vendor_status,
                tenant_id: TENANTID
            });

            if(createVendor){
                return {
                    tenant_id: createVendor.tenant_id,
                    message: "Successfully Created Vendor.",
                    status: true,
                }
            }

        }catch (error) {
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
            const {vendor_uuid, vendor_name, vendor_company_name, vendor_email, vendor_description, vendor_address, vendor_city, vendor_country, vendor_status} = req


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
                vendor_name,
                vendor_company_name,
                vendor_email,
                vendor_description,
                vendor_address,
                vendor_city,
                vendor_country,
                vendor_status
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
            const {vendor_uuid, vendor_status} = req

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
        console.log(TENANTID);
        // Try Catch Block
        try {

            // Data From Request
            const { vendor_uuid } = req;

            // GET Single Vendor BY CODE
            const getsinglevendor = await db.vendor.findOne({
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
            // GET ALL Vendor
            const getallvendor = await db.vendor.findAll({
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