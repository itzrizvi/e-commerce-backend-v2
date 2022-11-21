const { gql } = require("apollo-server-express");


module.exports = gql`

# Payment Method Based Input and Types ########################
###############################################################

type ShippingMethod {
    id:Int
    name:String
    slug:String
    description:String
    status:Boolean
    shipping_cost:Float
    tenant_id:String
    added_by:Staff
}

input AddShippingMethodInput {
    name:String!
    description:String
    status:Boolean
    shipping_cost:Float
}

input GetSingleShippingMethodInput {
    id:Int!
}

type GetSingleShippingMethodOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:ShippingMethod
}

input UpdateShippingMethodInput {
    id:Int!
    name:String
    description:String
    shipping_cost:Float
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addShippingMethod(data:AddShippingMethodInput):CommonOutput!
    updateShippingMethod(data:UpdateShippingMethodInput):CommonOutput!
}

extend type Query {
    getSingleShippingMethod(query:GetSingleShippingMethodInput):GetSingleShippingMethodOutput!
}


`;