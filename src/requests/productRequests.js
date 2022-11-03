// ALL Category BASED REQUEST FORMATION
// All Requires
const { make } = require('simple-body-validator');
let rules = {}, request, response;

// Add Product REQUEST
const addProductRequest = (body) => {
    rules = {
        prod_name: 'required|string',
        prod_long_desc: 'required|string',
        prod_short_desc: 'required|string',
        prod_meta_title: 'string',
        prod_meta_desc: 'string',
        prod_meta_keywords: 'string',
        prod_tags: 'string',
        prod_regular_price: 'required|strict|numeric',
        prod_sale_price: 'strict|numeric',
        prod_partnum: 'required|string',
        prod_sku: 'required|string',
        brand_id: 'required|string',
        prod_category: 'required|string',
        related_product: 'array',
        prod_weight: 'string',
        prod_weight_class: 'string',
        prod_status: 'required|boolean',
        taxable: 'boolean',
        prod_outofstock_status: 'required|string',
        dimensions: 'object',
        discount_type: 'array',
        product_attributes: 'array',
        partof_product: 'array'
    }

    return checkBody(body, rules);
}


// Update Product Request
const updateProductRequest = (body) => {
    rules = {
        prod_id: 'required|string',
        prod_name: 'string',
        prod_long_desc: 'string',
        prod_short_desc: 'string',
        prod_meta_title: 'string',
        prod_meta_desc: 'string',
        prod_meta_keywords: 'string',
        prod_tags: 'string',
        prod_regular_price: 'numeric',
        prod_sale_price: 'numeric',
        prod_partnum: 'string',
        prod_sku: 'string',
        brand_id: 'string',
        prod_category: 'string',
        related_product: 'array',
        prod_weight: 'string',
        prod_weight_class: 'string',
        prod_status: 'boolean',
        taxable: 'boolean',
        prod_outofstock_status: 'string',
        dimensions: 'object',
        discount_type: 'array',
        product_attributes: 'array',
        partof_product: 'array'
    }

    return checkBody(body, rules);
}

// Get Single Product Request
const getSingleProductRequest = (body) => {
    rules = {
        prod_id: 'required|string'
    }

    return checkBody(body, rules);
}

// Update Product Thumbnail Request
const updateThumbnailRequest = (body) => {
    rules = {
        prod_id: 'required|string'
    }

    return checkBody(body, rules);
}

// Delete Gallery Image Request
const deleteGalleryImageRequest = (body) => {
    rules = {
        prod_id: 'required|string',
        prod_gallery_id: 'required|string',
    }

    return checkBody(body, rules);
}


// Upload Product Gallery Image Request
const uploadGalleryImageRequest = (body) => {
    rules = {
        prod_id: 'required|string'
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
    addProductRequest,
    updateProductRequest,
    getSingleProductRequest,
    updateThumbnailRequest,
    deleteGalleryImageRequest,
    uploadGalleryImageRequest
}