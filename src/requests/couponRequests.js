// ALL Coupon BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE COUPON REQUEST
const createCouponRequest = (body) => {
    rules = {
        coupon_name: 'required|string',
        coupon_code: 'required|string',
        coupon_type: 'required|string',
        coupon_startdate: 'required|string',
        coupon_enddate: 'required|string',
        coupon_description: 'string',
        coupon_amount: 'required|strict|numeric',
        coupon_maxamount: 'required|strict|numeric',
        coupon_minamount: 'required|strict|numeric',
        coupon_status: 'required|strict|boolean',
        coupon_sortorder: 'required|strict|integer'
    }

    return checkBody(body, rules);
}


// UPDATE COUPON REQUEST
const updateCouponRequest = (body) => {
    rules = {
        coupon_uuid: 'required|string',
        coupon_name: 'string',
        coupon_code: 'string',
        coupon_type: 'string',
        coupon_startdate: 'string',
        coupon_enddate: 'string',
        coupon_description: 'string',
        coupon_amount: 'strict|numeric',
        coupon_maxamount: 'strict|numeric',
        coupon_minamount: 'strict|numeric',
        coupon_status: 'strict|boolean',
        coupon_sortorder: 'strict|integer'
    }

    return checkBody(body, rules);
}

// GET SINGLE COUPON REQUEST
const getSingleCouponRequest = (body) => {
    rules = {
        coupon_uuid: 'required|string'
    }

    return checkBody(body, rules);
}


// Check Coupon Req Body
const checkBody = (body, rules) => {

    request = body;
    rules = rules;

    try {
        const validator = make(request, rules);
        if (!validator.validate()) response = { success: false, data: validator.errors().all() }
        else response = { success: true }

        return response;


    } catch (error) {
        return error
    }

}

module.exports = {
    createCouponRequest,
    updateCouponRequest,
    getSingleCouponRequest
}