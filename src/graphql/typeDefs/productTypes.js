const { gql } = require("apollo-server-express");


module.exports = gql`

# Product Based Input and Types #########################################
#########################################################################


type Product {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_barcode:String
    tenant_id:String
    product_category:UUID
    added_by:UUID
}

input AddProductInput {
    product_name:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_category:UUID
    product_barcode:String
}


type AddProductOutput {
    message:String
    status:Boolean
    data:Product
}

input SingleProductDetailsInput {
    product_id:UUID
}

type SingleProduct {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_barcode:String
    tenant_id:String
    category: Category
    createdBy: Staff
}

type SingleProductDetails {
    message:String
    status:Boolean
    data: SingleProduct
}

input UpdateProductInput {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_category:UUID
    product_barcode:String
}

type UpdateProductOutput {
    message:String
    status:Boolean
    data:Product
}


type GetProductList {
    message:String
    status:Boolean
    data:[SingleProduct]
}



extend type Mutation {
    addProduct(data: AddProductInput):AddProductOutput!
    updateProduct(data: UpdateProductInput):UpdateProductOutput!
}

extend type Query {
    getSingleProduct(query: SingleProductDetailsInput): SingleProductDetails!
    getProductList: GetProductList!
}


`;