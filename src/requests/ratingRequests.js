// ALL Rating BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// CREATE Rating REQUEST
const createRatingRequest = (body) => {
    rules = {
        user_id: 'required|string',
        product_id: 'required|string',
        rating: 'required|numeric',
        title: 'required|string',
        description: 'required|string'
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
    createRatingRequest,
}