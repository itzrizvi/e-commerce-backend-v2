// Feature Permission List BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// Roles Permission List REQUEST
const createRolesPermissionRequest = (body) => {
    rules = {
        permissionName: 'required|string',
        permissionStatus: 'required|boolean',
    }

    return checkBody(body, rules);
}

// Roles Permission GET SINGLE REQUEST
const getSingleRolesPermissionRequest = (body) => {
    rules = {
        roles_permission_id: 'required|string'
    }

    return checkBody(body, rules);
}

// Roles Permission Update REQUEST
const updateRolesPermissionRequest = (body) => {
    rules = {
        roles_permission_id: 'required|string',
        roles_permission_name: 'string',
        roles_permission_status: 'boolean',
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
    createRolesPermissionRequest,
    getSingleRolesPermissionRequest,
    updateRolesPermissionRequest
}