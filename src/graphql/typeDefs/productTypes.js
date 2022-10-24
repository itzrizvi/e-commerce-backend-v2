const { gql } = require("apollo-server-express");


module.exports = gql`

# Product Based Input and Types #########################################
#########################################################################


# type Product {
#     prod_uuid:UUID
#     prod_name:String
#     prod_slug:String
#     prod_long_desc:JSON
#     prod_short_desc:JSON
#     prod_meta_title:String
#     prod_meta_desc:JSON
#     prod_meta_keywords:JSON
#     prod_tags:JSON
#     brand_uuid:UUID
#     prod_category:UUID
#     prod_regular_price:Float
#     prod_sale_price:Float
#     discount_type_uuid:UUID
#     prod_model:String
#     prod_sku:String
#     dimension_uuid:UUID
#     prod_weight:String
#     prod_weight_class:String
#     prod_min_quantity:Int
#     prod_subtract_stock:Boolean
#     prod_outofstock_status:String
#     prod_available_from:String
#     prod_tax_included:Boolean
#     prod_thumbnail:String
#     added_by:Staff
#     tenant_id:String
#     createdAt:String
#     updatedAt:String
# }

input AddProductInput {
    prod_name:String!
    prod_long_desc:JSON!
    prod_short_desc:JSON!
    prod_meta_title:String
    prod_meta_desc:JSON
    prod_meta_keywords:JSON
    prod_tags:JSON
    prod_regular_price:Float!
    prod_sale_price:Float
    prod_model:String
    prod_sku:String!
    brand_uuid:UUID!
    prod_category:UUID!
    related_product:JSON
    prod_weight:String
    prod_weight_class:String
    prod_status:Boolean!
    prod_outofstock_status:String!
    prod_thumbnail:Upload!
    prod_gallery:[Upload]
    dimensions:JSON # Dimensions Table Properties will come as an object
    discount_type:JSON # Discount Type Table Properties will come as an object
    product_attributes:JSON # Product Attributes Table Properties Will Come as an Object
    partof_product:JSON # Part of Product Table Properties Will Come as an Object
}

type ProductForList {
    prod_uuid:UUID
    prod_name:String
    prod_slug:String
    prod_regular_price:Float
    prod_sale_price:Float
    prod_model:String
    prod_sku:String
    prod_status:Boolean
    prod_outofstock_status:String
    prod_thumbnail:String
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type GetAllProducts {
    message:String!
    status:Boolean!
    tenant_id:String
    data:[ProductForList]
}

# input SingleProductDetailsInput {
#     product_id:UUID
# }

# type SingleProduct {
#     product_id:UUID
#     product_name:String
#     product_slug:String
#     product_description:JSON
#     product_meta_tag_title:String
#     product_meta_tag_description:JSON
#     product_meta_tag_keywords:JSON
#     product_tags:JSON
#     product_image:String
#     product_image_gallery:JSON
#     product_sku:String
#     product_regular_price:Float
#     product_sale_price:Float
#     product_tax_included:Boolean
#     product_stock_quantity:Int
#     product_minimum_stock_quantity:Int
#     product_maximum_orders:Int
#     product_stock_status:String
#     product_available_from:String
#     product_status:String
#     product_barcode:String
#     tenant_id:String
#     category: Category
#     createdBy: Staff
# }

# type SingleProductDetails {
#     message:String
#     status:Boolean
#     data: SingleProduct
# }

# input UpdateProductInput {
#     product_id:UUID
#     product_name:String
#     product_slug:String
#     product_description:JSON
#     product_meta_tag_title:String
#     product_meta_tag_description:JSON
#     product_meta_tag_keywords:JSON
#     product_tags:JSON
#     product_image:String
#     product_image_gallery:JSON
#     product_sku:String
#     product_regular_price:Float
#     product_sale_price:Float
#     product_tax_included:Boolean
#     product_stock_quantity:Int
#     product_minimum_stock_quantity:Int
#     product_maximum_orders:Int
#     product_stock_status:String
#     product_available_from:String
#     product_status:String
#     product_category:UUID
#     product_barcode:String
# }

# type UpdateProductOutput {
#     message:String
#     status:Boolean
#     data:Product
# }


# type GetProductList {
#     message:String
#     status:Boolean
#     data:[SingleProduct]
# }


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addProduct(data: AddProductInput):CommonOutput!
    # updateProduct(data: UpdateProductInput):UpdateProductOutput!
}

extend type Query {
    # getSingleProduct(query: SingleProductDetailsInput): SingleProductDetails!
    getProductList: GetAllProducts!
}


`;