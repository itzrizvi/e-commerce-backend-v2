const { gql } = require("apollo-server-express");


module.exports = gql`

# Filter And Pagination Based Input and Types ############
##########################################################

input FilterPaginationInput {
    searchQuery:String
    sortingType:String
    perPage:Int
    pageNumber:Int!
    minPrice:Int
    maxPrice:Int!
    conditions:JSON
    minRating:Float
    maxRating:Float
    brand_slug:String
    brandIds:[Int]
    category_slug:String
}


type FilterPaginationOutput {
    data:[ProductForList]
    totalCount:Int
    pageNumber:Int
    totalPage:Int
    perPage:Int
    breadCrumbs:BreadCrumbCategories
    hasPreviousPage:Boolean
    hasNextPage:Boolean
    status:Boolean
}




# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getFilterPaginatedProducts(query:FilterPaginationInput):FilterPaginationOutput!
}


`;