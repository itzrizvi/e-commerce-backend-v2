const { gql } = require("apollo-server-express");


module.exports = gql`

# Wish List Based Input and Types ########################
##########################################################

type WishList {
    wishedProducts:[ProductForList]
    wishedBy:User
    created_by:Int
    updated_by:Int
    tenant_id:String
}

input AddWishListInput {
    product_id:Int!
}

input RemoveProductsFromWishListInput {
    product_id:Int!
}

type GetWishListOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:WishList
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addWishList(data: AddWishListInput):CommonOutput!
    removeFromWishList(data:RemoveProductsFromWishListInput):CommonOutput!
}

extend type Query {
    getWishList:GetWishListOutput!
}


`;