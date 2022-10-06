// ALL ROLE BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// CREATE ROLE REQUEST
const createRoleRequest = (body) => {
    rules = {
        role: 'required|string',
        role_status: 'required|strict|boolean',
        permissionUUIDList: 'required|string'
    }

    return checkBody(body, rules);
}

// UPDATE ROLE REQUEST
const updateRoleRequest = (body) => {
    rules = {
        role_uuid: 'string',
        role: 'string',
        role_status: 'strict|boolean',
        permissionUUIDList: 'string'
    }

    return checkBody(body, rules);
}

// DELETE ROLE REQUEST
const deleteRoleRequest = (body) => {
    rules = {
        role_uuid: 'string'
    }

    return checkBody(body, rules);
}

// GET SINGLE ROLE REQUEST
const getSingleRoleRequest = (body) => {
    rules = {
        role_uuid: 'string'
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
    createRoleRequest,
    updateRoleRequest,
    deleteRoleRequest,
    getSingleRoleRequest
}