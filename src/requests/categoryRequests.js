// ALL Category BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// CREATE CATEGORY REQUEST
const createCategoryRequest = (body) => {
    rules = {
        categoryName: 'required|string',
        categoryDescription: 'required|string',
        categoryParentId: 'string',
        categoryMetaTagTitle: 'string',
        categoryMetaTagDescription: 'string',
        categoryMetaTagKeywords: 'string',
        categoryImage: 'required|string',
        categorySortOrder: 'strict|integer',
        categoryStatus: 'strict|boolean'
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
    createCategoryRequest
}