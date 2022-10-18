// ALL Banner BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE Banner REQUEST
const createBannerRequest = (body) => {
    rules = {
        banner_name: 'required|string',
        banner_status: 'required|strict|boolean'
    }

    return checkBody(body, rules);
}

// Update Banner REQUEST
const updateBannerRequest = (body) => {
    rules = {
        banner_uuid: 'required|string',
        banner_name: 'string',
        banner_status: 'strict|boolean'
    }

    return checkBody(body, rules);
}

// CREATE Banner REQUEST
const createBannerImageRequest = (body) => {
    rules = {
        banner_id: 'required|string',
        title: 'required|string',
        sort_order: 'required|numeric'
    }

    return checkBody(body, rules);
}

// UPDATE Banner REQUEST
const updateBannerImageRequest = (body) => {
    rules = {
        banner_uuid: 'required|string',
        title: 'string',
        link: 'string',
        sort_order: 'numeric'
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
    createBannerRequest,
    createBannerImageRequest,
    updateBannerRequest,
    updateBannerImageRequest
}