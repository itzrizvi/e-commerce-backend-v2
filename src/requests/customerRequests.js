// ALL Customer BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// CREATE Customer REQUEST
const createCustomerRequest = (body) => {
    rules = {
        first_name: 'required|string',
        last_name: 'required|string',
        email: 'required|email',
        password: 'required|string',
        status: 'required|boolean',
        send_mail: 'required|boolean',
    }

    return checkBody(body, rules);
}

// Add Customer Billing Address REQUEST
const addCustomerBillingAddressRequest = (body) => {
    rules = {
        customer_id: 'required|string',
        billing_address: 'required|string',
        billing_city: 'required|string',
        billing_PO_code: 'required|string',
        billing_country: 'required|string'
    }

    return checkBody(body, rules);
}

// Add Customer Shipping Address REQUEST
const addCustomerShippingAddressRequest = (body) => {
    rules = {
        customer_id: 'required|string',
        shipping_address: 'required|string',
        shipping_city: 'required|string',
        shipping_PO_code: 'required|string',
        shipping_country: 'required|string'
    }

    return checkBody(body, rules);
}


// Update Customer Billing Address REQUEST
const updateCustomerBillingAddressRequest = (body) => {
    rules = {
        billing_id: 'required|string',
        billing_address: 'required|string',
        billing_city: 'required|string',
        billing_PO_code: 'required|string',
        billing_country: 'required|string'
    }

    return checkBody(body, rules);
}
// Update Customer Shipping Address REQUEST
const updateCustomerShippingAddressRequest = (body) => {
    rules = {
        shipping_id: 'required|string',
        shipping_address: 'required|string',
        shipping_city: 'required|string',
        shipping_PO_code: 'required|string',
        shipping_country: 'required|string'
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
    createCustomerRequest,
    addCustomerBillingAddressRequest,
    addCustomerShippingAddressRequest,
    updateCustomerBillingAddressRequest,
    updateCustomerShippingAddressRequest
}