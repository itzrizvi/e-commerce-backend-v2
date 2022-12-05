const { gql } = require("apollo-server-express");


module.exports = gql`

# Quote Based Input and Types ############################
##########################################################

type QuoteItem {
    id:Int
    quote_id:Int
    price:Float
    quantity:Float
    total_price:Float
    product:ProductForList
    createdBy:Int
    updatedBy:Int
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type Quote {
    id:Int
    status:String
    grand_total:Float
    tenant_id:String
    createdAt:String
    updatedAt:String
    quoteitems:[QuoteItem]
    quotedby:Staff
}

input AddToQuoteInput {
    user_id:Int!
    product_id:Int!
    quantity:Int
}

input SubmitQuoteInput {
    quote_id:Int!
    user_id:Int!
    note:String
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addToQuote(data:AddToQuoteInput):CommonOutput!
    submitQuote(data:SubmitQuoteInput):CommonOutput!
}

# extend type Query {

# }


`;