const { gql } = require("apollo-server-express");


module.exports = gql`

# Product Based Input and Types #########################################
#########################################################################

type ProductDimension {
    id:Int
    length:String
    width:String
    height:String
    dimension_class:String
}

type DiscountType {
    id:Int
    customer_group:CustomerGroup
    discount_quantity:Int
    discount_priority:Int
    discount_price:Float
    discount_startdate:String
    discount_enddate:String
}

type ProductGallery {
    id:Int
    prod_id:Int
    prod_image:String
}

type PartofProduct {
    id:Int
    prod_quantity:Int
    part_product:Product
}

type ProductAttributes {
    id:Int
    attribute_type:String
    attribute_value:String
    attribute_data:Attribute
}

type RelatedProduct {
    id:Int
    related_prod:Product
}

type Product {
    id:Int
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
    discount_type:[DiscountType]
    prod_partnum:String
    prod_sku:String
    prod_status:Boolean
    taxable:Boolean
    is_featured:Boolean
    is_sale:Boolean
    is_serial:Boolean
    prod_condition:String
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
    prod_partnum:String!
    prod_sku:String!
    brand_id:Int!
    prod_category:Int!
    related_product:JSON
    prod_weight:String
    prod_weight_class:String
    prod_status:Boolean!
    taxable:Boolean
    is_featured:Boolean
    is_sale:Boolean
    is_serial:Boolean
    prod_condition:String
    prod_outofstock_status:String!
    prod_thumbnail:Upload!
    prod_gallery:[Upload]
    dimensions:JSON # Dimensions Table Properties will come as an object
    discount_type:JSON # Discount Type Table Properties will come as an object
    product_attributes:JSON # Product Attributes Table Properties Will Come as an Object
    partof_product:JSON # Part of Product Table Properties Will Come as an Object
}

type ProductForList {
    id:Int
    prod_name:String
    prod_slug:String
    prod_short_desc:JSON
    prod_regular_price:Float
    prod_sale_price:Float
    prod_partnum:String
    prod_sku:String
    prod_status:Boolean
    taxable:Boolean
    is_featured:Boolean
    is_sale:Boolean
    is_serial:Boolean
    prod_condition:String
    prod_outofstock_status:String
    prod_thumbnail:String
    category:Category
    brand:Brand
    prod_attributes:[ProductAttributes]
    ratings:[Rating]
    overallRating:Float
    totalRating:Int
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
    prod_id:Int!
}

type GetSingleProductOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: Product
}

input UpdateThumbnailInput {
    prod_id:Int!
    prod_thumbnail:Upload!
}

input GalleryImageDeleteInput {
    prod_id:Int!
    prod_gallery_id:Int!
}

input GalleryImageUploadInput {
    prod_id:Int!
    gallery_img:[Upload!]
}

input UpdateProductInput {
    prod_id:Int
    prod_name:String
    prod_long_desc:JSON
    prod_short_desc:JSON
    prod_meta_title:String
    prod_meta_desc:JSON
    prod_meta_keywords:JSON
    prod_tags:JSON
    prod_regular_price:Float
    prod_sale_price:Float
    prod_partnum:String
    prod_sku:String
    brand_id:Int
    prod_category:Int
    prod_weight:String
    prod_weight_class:String
    prod_status:Boolean
    taxable:Boolean
    is_featured:Boolean
    is_sale:Boolean
    prod_condition:String
    prod_outofstock_status:String
    related_product:JSON
    dimensions:JSON # Dimensions Table Properties will come as an object
    discount_type:JSON # Discount Type Table Properties will come as an object
    product_attributes:JSON # Product Attributes Table Properties Will Come as an Object
    partof_product:JSON # Part of Product Table Properties Will Come as an Object
}

input RecentViewProductInput{
    product_id: Int!
}


type GetFeaturedProducts {
    message:String
    tenant_id:String
    status:Boolean
    data:[ProductForList]
}


type GetOnSaleProducts {
    message:String
    tenant_id:String
    status:Boolean
    data:[ProductForList]
}

input GetRecentViewProductInput {
    max: Int!
}

type GetRecentViewProductOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ProductForList]
}



type PublicProductView {
    id:Int
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
    prod_attributes:[ProductAttributes]
    related_products:[RelatedProduct]
    prod_regular_price:Float
    prod_sale_price:Float
    prod_partnum:String
    prod_sku:String
    prod_status:Boolean
    taxable:Boolean
    is_featured:Boolean
    is_sale:Boolean
    prod_condition:String
    dimensions:ProductDimension
    prod_weight:String
    prod_weight_class:String
    prod_outofstock_status:String
    prod_thumbnail:String
    gallery:[ProductGallery]
    tenant_id:String
    createdAt:String
    updatedAt:String
}

input PublicProductViewInput {
    prod_id:Int!
}

type PublicProductViewOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: PublicProductView
}

input GetSingleProductBySlugInput {
    prod_slug:String!
}

type GetSingleProductBySlugOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: Product
}

input GetProductsByIDInput {
    prod_ids:[Int]!
}

type GetProductsByIDOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: [ProductForList]
}

input SearchProductInput {
    category_id:Int
    searchQuery:String
}

type SearchProductOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: [ProductForList]
}

input AddRecentViewProductByArrayInput {
    product_ids:JSON!
}

type GetLatestProducts {
    message:String
    status:Boolean
    tenant_id:String
    data:[ProductForList]
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addProduct(data: AddProductInput):CommonOutput!
    updateThumbnail(data: UpdateThumbnailInput):CommonOutput!
    deleteGalleryImage(data: GalleryImageDeleteInput):CommonOutput!
    uploadGalleryImage(data: GalleryImageUploadInput):CommonOutput!
    updateProduct(data: UpdateProductInput):CommonOutput!
    recentViewProduct(data: RecentViewProductInput): CommonOutput!
    addRecentViewProductByArray(data: AddRecentViewProductByArrayInput): CommonOutput!
}

extend type Query {
    getSingleProduct(query: GetSingleProductInput): GetSingleProductOutput!
    publicProductView(query: PublicProductViewInput): PublicProductViewOutput!
    getProductList: GetAllProducts!
    getFeaturedProducts: GetFeaturedProducts!
    getRecentViewProduct(query: GetRecentViewProductInput): GetRecentViewProductOutput!
    getSingleProductBySlug(query: GetSingleProductBySlugInput): GetSingleProductBySlugOutput!
    getProductsByIDs(query: GetProductsByIDInput): GetProductsByIDOutput!
    getOnSaleProducts: GetOnSaleProducts!
    getSearchedProducts(query:SearchProductInput): SearchProductOutput!
    getLatestProducts: GetLatestProducts!
}


`;