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
        prod_model: 'string',
        prod_sku: 'required|string',
        brand_uuid: 'required|string',
        prod_category: 'required|string',
        related_product: 'array',
        prod_weight: 'string',
        prod_weight_class: 'string',
        prod_status: 'required|boolean',
        prod_outofstock_status: 'required|string',
        dimensions: 'object',
        discount_type: 'object',
        product_attributes: 'array',
        partof_product: 'array'
    }

    return checkBody(body, rules);
}


// Update Product Request
const updateProductRequest = (body) => {
    rules = {
        product_name: 'string',
        product_slug: 'string',
        product_description: 'string',
        product_meta_tag_title: 'string',
        product_meta_tag_description: 'string',
        product_meta_tag_keywords: 'string',
        product_tags: 'string',
        product_image: 'string',
        product_image_gallery: 'string',
        product_sku: 'string',
        product_regular_price: 'strict|numeric',
        product_sale_price: 'strict|numeric',
        product_tax_included: 'strict|boolean',
        product_stock_quantity: 'strict|numeric',
        product_minimum_stock_quantity: 'strict|numeric',
        product_maximum_orders: 'strict|numeric',
        product_stock_status: 'string',
        product_available_from: 'string',
        product_status: 'string',
        product_category: 'string',
        product_barcode: 'string'
    }

    return checkBody(body, rules);
}

// Get Single Product Request
const getSingleProductRequest = (body) => {
    rules = {
        prod_uuid: 'required|string'
    }

    return checkBody(body, rules);
}

// Update Product Thumbnail Request
const updateThumbnailRequest = (body) => {
    rules = {
        prod_uuid: 'required|string'
    }

    return checkBody(body, rules);
}

// Delete Gallery Image Request
const deleteGalleryImageRequest = (body) => {
    rules = {
        prod_uuid: 'required|string',
        prod_gallery_uuid: 'required|string',
    }

    return checkBody(body, rules);
}


// Upload Product Gallery Image Request
const uploadGalleryImageRequest = (body) => {
    rules = {
        prod_uuid: 'required|string'
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