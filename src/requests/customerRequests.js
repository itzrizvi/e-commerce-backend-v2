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
    createCustomerRequest
}