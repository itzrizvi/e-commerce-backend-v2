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
    brand_slug:String
    category_slug:String
}


type FilterPaginationOutput {
    data:[ProductForList]
    totalCount:Int
    pageNumber:Int
    totalPage:Int
    perPage:Int
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