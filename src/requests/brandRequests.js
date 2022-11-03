// ALL BRAND BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE BRAND REQUEST
const createBrandRequest = (body) => {
    rules = {
        brandName: 'required|string',
        brandDescription: 'string',
        brandStatus: 'strict|boolean',
        brandSortOrder: 'required|strict|integer',
        categories: 'required|array',
    }

    return checkBody(body, rules);
}

// GET SINGLE BRAND REQUEST
const getSingleBrandRequest = (body) => {
    rules = {
        brand_id: 'required|string'
    }

    return checkBody(body, rules);
}


// Update BRAND REQUEST
const updateBrandRequest = (body) => {
    rules = {
        brand_id: 'required|string',
        brand_name: 'string',
        brand_description: 'string',
        brand_status: 'strict|boolean',
        brand_sort_order: 'strict|integer',
        categories: 'array',
    }

    return checkBody(body, rules);
}


// GET PRODUCTS BY BRAND REQUEST
const getProductsByBrandRequest = (body) => {
    rules = {
        brand_id: 'required|string'
    }

    return checkBody(body, rules);
}



// Check Staff/Admin Req Body
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
    createBrandRequest,
    getSingleBrandRequest,
    updateBrandRequest,
    getProductsByBrandRequest
}