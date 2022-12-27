const { gql } = require("apollo-server-express");


module.exports = gql`

# Payment Method Based Input and Types ########################
###############################################################

type ShippingMethod {
    id:Int
    name:String
    description:String
    status:Boolean
    sort_order:Int
    internal_type:Boolean
    tenant_id:String
    added_by:Staff
}

type ShippingMethodPublic {
    id:Int
    name:String
    description:String
    status:Boolean
    sort_order:Int
    tenant_id:String
}

type ShippingAccount {
    id:Int
    name:String
    account:String
    description:String
    status:Boolean
    sort_order:Int
    tenant_id:String
    createdAt:String
    updatedAt:String
}

input AddShippingMethodInput {
    name:String!
    description:String
    status:Boolean
    sort_order:Int
    internal_type:Boolean
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
    sort_order:Int
    internal_type:Boolean
}

type GetShippingMethodListPublic {
    message:String
    tenant_id:String
    status:Boolean
    data:[ShippingMethodPublic]
}
type GetShippingMethodListAdmin {
    message:String
    tenant_id:String
    status:Boolean
    data:[ShippingMethod]
}

input ShippingStatusChangeInput {
    id:Int!
    status:Boolean!
}

type GetShippingAccounListAdmin {
    message:String
    status:Boolean
    tenant_id:String
    data:[ShippingAccount]
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addShippingMethod(data:AddShippingMethodInput):CommonOutput!
    updateShippingMethod(data:UpdateShippingMethodInput):CommonOutput!
    shippingMethodStatus(data:ShippingStatusChangeInput):CommonOutput!
}

extend type Query {
    getSingleShippingMethod(query:GetSingleShippingMethodInput):GetSingleShippingMethodOutput!
    getShippingMethodListAdmin:GetShippingMethodListAdmin!
    getShippingMethodListPublic:GetShippingMethodListPublic!
    getShippingAccountListAdmin:GetShippingAccounListAdmin!
}


`;