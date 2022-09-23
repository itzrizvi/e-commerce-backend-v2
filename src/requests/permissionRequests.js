// Feature Permission List BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// Feature Permission List REQUEST
const assignPermissionRequest = (body) => {
    rules = {
        permissionUUIDList: 'required|string',
        staffUUID: 'required|string',
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
    assignPermissionRequest,
}