// ALL Customer Group BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE Customer Group REQUEST
const createCustomerGroupGroupRequest = (body) => {
    rules = {
        customer_group_name: 'required|string',
        customergroup_description: 'string',
        customergroup_sortorder: 'required|strict|integer',
        customergroup_status: 'required|strict|boolean'
    }

    return checkBody(body, rules);
}

// Update Customer Group REQUEST
const updateCustomerGroupRequest = (body) => {
    rules = {
        customer_group_uuid: 'required|string',
        customer_group_name: 'string',
        customergroup_description: 'string',
        customergroup_sortorder: 'strict|integer',
        customergroup_status: 'strict|boolean'
    }

    return checkBody(body, rules);
}

// GET Single Customer Group Request
const getSingleCustomerGroupRequest = (body) => {
    rules = {
        customer_group_uuid: 'required|string'
    }

    return checkBody(body, rules);
}



// Check Customer Group Req Body
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
    createCustomerGroupGroupRequest,
    updateCustomerGroupRequest,
    getSingleCustomerGroupRequest
}