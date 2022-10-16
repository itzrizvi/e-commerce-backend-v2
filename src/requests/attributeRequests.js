// ALL Attribute BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;


// CREATE Attr Group REQUEST
const createAttrGroupRequest = (body) => {
    rules = {
        attr_group_name: 'required|string',
        attrgroup_sortorder: 'required|strict|integer',
        attrgroup_status: 'required|strict|boolean'
    }

    return checkBody(body, rules);
}


// Update ATTR Group  REQUEST
const updateAttrGroupRequest = (body) => {
    rules = {
        attr_group_uuid: 'required|string',
        attr_group_name: 'string',
        attrgroup_sortorder: 'strict|integer',
        attrgroup_status: 'strict|boolean'
    }

    return checkBody(body, rules);
}



// Check Attribute Req Body
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
    createAttrGroupRequest,
    updateAttrGroupRequest
}