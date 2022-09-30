// ALL Category BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// Add Product REQUEST
const addProductRequest = (body) => {
    rules = {
        product_name: 'required|string',
        product_description: 'required|string',
        product_meta_tag_title: 'string',
        product_meta_tag_description: 'string',
        product_meta_tag_keywords: 'string',
        product_tags: 'string',
        product_image: 'required|string',
        product_image_gallery: 'string',
        product_sku: 'required|string',
        product_regular_price: 'required|strict|numeric',
        product_sale_price: 'strict|numeric',
        product_tax_included: 'strict|boolean',
        product_stock_quantity: 'required|strict|numeric',
        product_minimum_stock_quantity: 'strict|numeric',
        product_maximum_orders: 'strict|numeric',
        product_stock_status: 'required|string',
        product_available_from: 'string',
        product_status: 'required|string',
        product_category: 'required|string',
        product_barcode: 'string'
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
    addProductRequest
}