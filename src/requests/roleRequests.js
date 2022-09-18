// ALL ROLE BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// GET ALL ROLES REQUEST
const getAllRoleRequest = (body) => {
    rules = {
        role: 'required|string'
    }

    return checkBody(body, rules);
}

// CREATE ROLE REQUEST
const createRoleRequest = (body) => {
    rules = {
        role: 'required|string',
        roleNo: 'required|strict|integer'
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
    getAllRoleRequest,
    createRoleRequest
}