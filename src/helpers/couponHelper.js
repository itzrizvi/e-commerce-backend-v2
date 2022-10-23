// All requires
const { Op } = require("sequelize");

// COUPON HELPER
module.exports = {
    // CREATE COUPON HELPER
    createCoupon: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request
            const { coupon_name,
                coupon_code,
                coupon_description,
                coupon_type,
                coupon_amount,
                coupon_maxamount,
                coupon_minamount,
                coupon_startdate,
                coupon_enddate,
                coupon_status,
                coupon_sortorder } = req;

            // Check Start Date and End Date
            if (new Date(coupon_startdate) > new Date(coupon_enddate)) {
                return { message: "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!", status: false }
            }

            // Check Coupon End Date
            if (new Date(coupon_enddate) < new Date()) {
                return { message: "Cannot Set Coupon End Date Lower than Present Date", status: false }
            }

            // Check If Already Exist the COUPON
            const checkExistence = await db.coupons.findOne({
                where: {
                    [Op.and]: [{
                        coupon_code,
                        tenant_id: TENANTID
                    }]
                }
            });
            // If Found COUPON
            if (checkExistence) return { message: "Already Have This Coupon!!!", status: false };


            // Create COUPON
            const createcoupon = await db.coupons.create({
                coupon_name,
                coupon_code,
                coupon_description,
                coupon_type,
                coupon_amount,
                coupon_maxamount,
                coupon_minamount,
                coupon_startdate,
                coupon_enddate,
                coupon_status,
                coupon_sortorder,
                tenant_id: TENANTID
            });
            if (!createcoupon) return { message: "Couldnt Create Coupon!!!", status: false }


            // Return Formation
            return {
                message: "Coupon Created Successfully!!!",
                status: true,
                tenant_id: createcoupon.tenant_id
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", isAuth: false, data: [], status: false }
            }
        }


    },
    // UPDATE COUPON HELPER
    updateCoupon: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { coupon_uuid,
                coupon_name,
                coupon_code,
                coupon_description,
                coupon_type,
                coupon_amount,
                coupon_maxamount,
                coupon_minamount,
                coupon_startdate,
                coupon_enddate,
                coupon_status,
                coupon_sortorder } = req;


            if (coupon_code) {
                // Check If Already Exist the COUPON
                const checkExistence = await db.coupons.findOne({
                    where: {
                        [Op.and]: [{
                            coupon_code,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            coupon_uuid
                        }]
                    }
                });


                // If Found COUPON
                if (checkExistence) return { message: "Already Have This COUPON!!!", status: false };
            }


            // Find Coupon
            const findCoupon = await db.coupons.findOne({
                where: {
                    [Op.and]: [{
                        coupon_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // CONDITION FOR COUPON DATES
            if (coupon_enddate) {
                // Check Coupon End Date
                if (new Date(coupon_enddate) < new Date()) {
                    return { message: "Cannot Set Coupon End Date Lower than Present Date", status: false }
                }
            }

            if (coupon_startdate && coupon_enddate) {
                // Check Start Date and End Date
                if (new Date(coupon_startdate) > new Date(coupon_enddate)) {
                    return { message: "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!", status: false }
                }
            } else if (coupon_startdate) {
                // Check Start Date and End Date
                if (new Date(coupon_startdate) > new Date(findCoupon.coupon_enddate)) {
                    return { message: "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!", status: false }
                }
            }


            // Update Doc for Coupon
            const updateDoc = {
                coupon_name,
                coupon_code,
                coupon_description,
                coupon_type,
                coupon_amount,
                coupon_maxamount,
                coupon_minamount,
                coupon_startdate,
                coupon_enddate,
                coupon_status,
                coupon_sortorder
            }

            // Update Coupon
            const updateCoupon = await db.coupons.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        coupon_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateCoupon) return { message: "Couldnt Update Coupon!!!", status: false }

            // Return Formation
            return {
                message: "Coupon Update Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET SINGLE COUPON HELPER
    getSingleCoupon: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { coupon_uuid } = req;

            // GET Single COUPON
            const getsinglecoupon = await db.coupons.findOne({
                where: {
                    [Op.and]: [{
                        coupon_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return 
            return {
                message: "Get Single Coupon Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getsinglecoupon
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET SINGLE COUPON BY CODE (PUBLIC)
    getSingleCouponByCode: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { coupon_code } = req;

            // GET Single COUPON BY CODE
            const getsinglecouponbycode = await db.coupons.findOne({
                where: {
                    [Op.and]: [{
                        coupon_code,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return 
            return {
                message: "Get Single Coupon By Coupon Code Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getsinglecouponbycode
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET ALL COUPONS (PUBLIC)
    getAllCoupons: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // GET ALL COUPONS
            const getallcoupons = await db.coupons.findAll({
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return 
            return {
                message: "Get All Coupons Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: getallcoupons
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }

}