// ALL USER BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// ADMIN SIGN IN REQUEST
const adminSignInRequest = (body) => {
    rules = {
        email: 'required|email',
        password: 'string|min:6'
    }

    return checkBody(body, rules);
}


// Check Admin Req Body
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

module.exports = { adminSignInRequest }