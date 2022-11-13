// All requires
const { Op } = require("sequelize");
const moment = require('moment');

// COUPON HELPER
module.exports = {
  // CREATE COUPON HELPER
  createCoupon: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const {
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
      } = req;

      // Check Start Date and End Date
      if (new Date(coupon_startdate) > new Date(coupon_enddate)) {
        return {
          message:
            "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!",
          status: false,
        };
      }

      // Check Coupon End Date
      if (new Date(coupon_enddate) < new Date()) {
        return {
          message: "Cannot Set Coupon End Date Lower than Present Date",
          status: false,
        };
      }

      // Check If Already Exist the COUPON
      const checkExistence = await db.coupon.findOne({
        where: {
          [Op.and]: [
            {
              coupon_code,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      // If Found COUPON
      if (checkExistence)
        return { message: "Already Have This Coupon!!!", status: false };

      // Create COUPON
      const createcoupon = await db.coupon.create({
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
        tenant_id: TENANTID,
      });
      if (!createcoupon)
        return { message: "Couldnt Create Coupon!!!", status: false };

      // Return Formation
      return {
        message: "Coupon Created Successfully!!!",
        status: true,
        tenant_id: createcoupon.tenant_id,
      };
    } catch (error) {
      if (error) {
        return {
          message: "Something Went Wrong!!!",
          isAuth: false,
          data: [],
          status: false,
        };
      }
    }
  },
  // UPDATE COUPON HELPER
  updateCoupon: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const {
        coupon_id,
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
      } = req;

      if (coupon_code) {
        // Check If Already Exist the COUPON
        const checkExistence = await db.coupon.findOne({
          where: {
            [Op.and]: [
              {
                coupon_code,
                tenant_id: TENANTID,
              },
            ],
            [Op.not]: [
              {
                id: coupon_id,
              },
            ],
          },
        });

        // If Found COUPON
        if (checkExistence)
          return { message: "Already Have This COUPON!!!", status: false };
      }

      // Find Coupon
      const findCoupon = await db.coupon.findOne({
        where: {
          [Op.and]: [
            {
              id: coupon_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // CONDITION FOR COUPON DATES
      if (coupon_enddate) {
        // Check Coupon End Date
        if (new Date(coupon_enddate) < new Date()) {
          return {
            message: "Cannot Set Coupon End Date Lower than Present Date",
            status: false,
          };
        }
      }

      if (coupon_startdate && coupon_enddate) {
        // Check Start Date and End Date
        if (new Date(coupon_startdate) > new Date(coupon_enddate)) {
          return {
            message:
              "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!",
            status: false,
          };
        }
      } else if (coupon_startdate) {
        // Check Start Date and End Date
        if (new Date(coupon_startdate) > new Date(findCoupon.coupon_enddate)) {
          return {
            message:
              "Cannot Set Coupon While Coupon Start Date is Greater Than End Date!!!",
            status: false,
          };
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
        coupon_sortorder,
      };

      // Update Coupon
      const updateCoupon = await db.coupon.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id: coupon_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!updateCoupon)
        return { message: "Couldnt Update Coupon!!!", status: false };

      // Return Formation
      return {
        message: "Coupon Update Success!!!",
        status: true,
        tenant_id: TENANTID,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // GET SINGLE COUPON HELPER
  getSingleCoupon: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { coupon_id } = req;

      // GET Single COUPON
      const getsinglecoupon = await db.coupon.findOne({
        where: {
          [Op.and]: [
            {
              id: coupon_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return
      return {
        message: "Get Single Coupon Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getsinglecoupon,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
  // GET SINGLE COUPON BY CODE (PUBLIC)
  getSingleCouponByCode: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    // try {
    // Data From Request
    const { coupon_code } = req;

    // GET Single COUPON BY CODE
    const getsinglecouponbycode = await db.coupon.findOne({
      where: {
        [Op.and]: [
          {
            coupon_code,
            tenant_id: TENANTID,
          },
        ],
      },
    });

    if (getsinglecouponbycode) {

      const today = moment().locale('en').endOf('day')
      const expire_date = moment(getsinglecouponbycode.coupon_enddate).add(-1, 'day').locale('en').endOf('day')
      const start_date = moment(getsinglecouponbycode.coupon_startdate).add(-1, 'day').locale('en').startOf('day')

      if (expire_date < today) {
        return {
          message: "Expire Voucher.",
          status: false,
        };
      }

      if (start_date > today) {
        return {
          message: "Voucher will start on " + start_date.add(1, 'day').format("YYYY-MM-DD"),
          status: false,
        };
      }

      if (!getsinglecouponbycode.coupon_status) {
        return {
          message: "Voucher Unavailable.",
          status: false,
        };
      }


      return {
        message: "Voucher Code Applied to your Cart.",
        status: true,
        tenant_id: TENANTID,
        data: getsinglecouponbycode,
      };
    } else {
      return {
        message: "Invalid Voucher Code.",
        status: false,
      };
    }
    // } catch (error) {
    //   if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    // }
  },
  // GET ALL COUPONS (PUBLIC)
  getAllCoupons: async (db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // GET ALL COUPONS
      const getallcoupons = await db.coupon.findAll({
        where: {
          tenant_id: TENANTID,
        },
      });

      // Return
      return {
        message: "Get All Coupons Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: getallcoupons,
      };
    } catch (error) {
      if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false };
    }
  },
};
