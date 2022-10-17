// ALL Banner BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE Banner REQUEST
const createBannerRequest = (body) => {
    rules = {
        banner_name: 'required|string',
        banner_status: 'required|strict|boolean',
        banner_image: 'required|array',
        "banner_image.title": "required|string",
        "banner_image.sort_order": "required|numeric"
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
    createBannerRequest
}