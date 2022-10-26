// ALL Vendor BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// CREATE Vendor REQUEST
const createVendorRequest = (body) => {
    rules = {
        vendor_contact_person: 'required|string',
        vendor_email: 'required|email',
        vendor_status: 'required|boolean',
        billing_address: 'required|array',
        shipping_address: 'required|array',
    }

    return checkBody(body, rules);
}

// Update Vendor REQUEST
const updateVendorRequest = (body) => {
    rules = {
        vendor_uuid: 'required|string',
        vendor_contact_person: 'required|string',
        vendor_email: 'required|email',
        vendor_status: 'required|boolean',
        billing_address: 'required|array',
        shipping_address: 'required|array',
    }

    return checkBody(body, rules);
}


// Update Vendor Status REQUEST
const updateVendorStatusRequest = (body) => {
    rules = {
        vendor_uuid: 'required|string',
        vendor_status: 'required|boolean',
    }

    return checkBody(body, rules);
}

// Check Validation
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
    createVendorRequest,
    updateVendorRequest,
    updateVendorStatusRequest
}