const { gql } = require("apollo-server-express");


module.exports = gql`

# Brand Based Input and Queries ###############################################
###############################################################################

type Brand {
    brand_id:UUID
    brand_name:String
    brand_slug:String
    brand_description:String
    brand_status:Boolean
    brand_sort_order:Int
    image:String
    tenant_id:String
    createdAt:String
    updatedAt:String
    categories:[Category]
}

input BrandCreateInput {
    brandName:String!
    brandDescription:String
    brandStatus:Boolean
    brandSortOrder:Int!
    categories:JSON!
}

type GetAllBrands{
    message:String
    tenant_id:String
    status:Boolean
    data:[Brand]
}

input GetSingleBrandInput {
    brand_id:UUID
}

type GetSingleBrandOutput{
    message:String
    tenant_id:String
    status:Boolean
    data:Brand
}

input UpdateBrandInput {
    brand_id:UUID!
    brand_name:String
    brand_status:Boolean
    brand_description:String
    brand_sort_order:Int
    categories:JSON
}

input GetProductByBrandInput {
    brand_id:UUID!
}

type GetProductByBrandOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ProductForList]

}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################
extend type Mutation {
    createBrand(data: BrandCreateInput, file:Upload):CommonOutput!
    updateBrand(data: UpdateBrandInput, file:Upload):CommonOutput!
}

extend type Query {
    getAllBrands: GetAllBrands!
    getSingleBrand(query: GetSingleBrandInput):GetSingleBrandOutput!
    getProductsByBrand(query: GetProductByBrandInput):GetProductByBrandOutput!
}


`;