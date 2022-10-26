const { gql } = require("apollo-server-express");


module.exports = gql`

# Product Based Input and Types #########################################
#########################################################################

type ProductDimension {
    prod_dimension_uuid:UUID
    length:String
    width:String
    height:String
    dimension_class:String
}

type DiscountType {
    discount_type_uuid:UUID
    customer_group:CustomerGroup
    discount_quantity:Int
    discount_priority:Int
    discount_price:Float
    discount_startdate:String
    discount_enddate:String
}

type ProductGallery {
    prod_gallery_uuid:UUID
    prod_uuid:UUID
    prod_image:String
}

type PartofProduct {
    partof_product_uuid:UUID
    prod_quantity:Int
    part_product:Product
}

type ProductAttributes {
    prod_attr_uuid:UUID
    attribute_type:String
    attribute_value:String
    attribute_data:Attribute
}

type RelatedProduct {
    related_prod_uuid:UUID
    related_prod:Product
}

type Product {
    prod_uuid:UUID
    prod_name:String
    prod_slug:String
    prod_long_desc:JSON
    prod_short_desc:JSON
    prod_meta_title:String
    prod_meta_desc:JSON
    prod_meta_keywords:JSON
    prod_tags:JSON
    brand:Brand
    category:Category
    part_of_products:[PartofProduct]
    prod_attributes:[ProductAttributes]
    related_products:[RelatedProduct]
    prod_regular_price:Float
    prod_sale_price:Float
    discount_type:DiscountType
    prod_model:String
    prod_sku:String
    dimensions:ProductDimension
    prod_weight:String
    prod_weight_class:String
    prod_outofstock_status:String
    prod_thumbnail:String
    gallery:[ProductGallery]
    created_by:Staff
    tenant_id:String
    createdAt:String
    updatedAt:String
}

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

input GetSingleProductInput {
    prod_uuid:UUID!
}

type GetSingleProductOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: Product
}

input UpdateThumbnailInput {
    prod_uuid:UUID!
    prod_thumbnail:Upload!
}

input GalleryImageDeleteInput {
    prod_uuid:UUID!
    prod_gallery_uuid:UUID!
}

input GalleryImageUploadInput {
    prod_uuid:UUID!
    gallery_img:Upload!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addProduct(data: AddProductInput):CommonOutput!
    updateThumbnail(data: UpdateThumbnailInput):CommonOutput!
    deleteGalleryImage(data: GalleryImageDeleteInput):CommonOutput!
    uploadGalleryImage(data: GalleryImageUploadInput):CommonOutput!
    # updateProduct(data: UpdateProductInput):UpdateProductOutput!
}

extend type Query {
    getSingleProduct(query: GetSingleProductInput): GetSingleProductOutput!
    getProductList: GetAllProducts!
}


`;