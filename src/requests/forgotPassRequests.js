// Forgot Passsword Based Request
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// Forgot Password init REQUEST (STEP 1)
const forgotPassInitRequest = (body) => {
    rules = {
        email: 'required|email',
    }
    return checkBody(body, rules);
}


// Forgot Password Code Match REQUEST (STEP 2)
const forgotPassCodeMatchRequest = (body) => {
    rules = {
        email: 'required|email',
        forgotPassVerifyCode: 'required|strict|integer'
    }
    return checkBody(body, rules);
}


// Forgot Password Final (STEP 3)
const forgotPassFinalRequest = (body) => {
    rules = {
        email: 'required|email',
        forgotPassVerifyCode: 'required|strict|integer',
        newPassword: 'string|min:6',
        confirmPassword: 'string|min:6'
    }
    return checkBody(body, rules);
}


// Validation Check
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
    forgotPassInitRequest,
    forgotPassCodeMatchRequest,
    forgotPassFinalRequest
}