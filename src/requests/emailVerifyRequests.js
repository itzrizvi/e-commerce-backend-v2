// ALL ROLE BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// GET ALL ROLES REQUEST
const emailVerifyRequest = (body) => {
    rules = {
        email: 'required|email',
        verificationCode: 'required|strict|integer'
    }

    return checkBody(body, rules);
}


//
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
    emailVerifyRequest
}