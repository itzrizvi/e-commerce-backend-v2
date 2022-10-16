// ALL STAFF/ADMIN BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// UPDATE ADMIN/STAFF  REQUEST
const updateAdminRequest = (body) => {
    rules = {
        uid: 'required|string',
        first_name: 'string',
        last_name: 'string',
        password: 'string',
        roleUUID: 'array',
        user_status: 'boolean',
        sendEmail: 'required|boolean'
    }

    return checkBody(body, rules);
}

// GET SINGLE ADMIN/STAFF  REQUEST
const getSingleAdminRequest = (body) => {
    rules = {
        uid: 'required|string'
    }

    return checkBody(body, rules);
}

// ADMIN/STAFF PASSWORD CHANGE  REQUEST
const adminPasswordChangeRequest = (body) => {
    rules = {
        uid: 'required|string',
        oldPassword: 'required|string|min:6',
        newPassword: 'required|string|min:6',
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
    updateAdminRequest,
    getSingleAdminRequest,
    adminPasswordChangeRequest
}