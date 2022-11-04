const { gql } = require("apollo-server-express");


module.exports = gql`

# Order Status Based Input and Types ##########################
###############################################################

type OrderStatus {
    id:Int!
    name:String!
    slug:String!
    description:String!
    status:Boolean!
    tenant_id:String!
    added_by:Staff
}
type OrderStatusPublic {
    id:Int!
    name:String!
    slug:String!
    description:String!
    status:Boolean!
    tenant_id:String!
}

input addOrderStatusInput {
    name:String!
    description:String!
    status:Boolean!
}

input UpdateOrderStatusInput {
    id:Int!
    name:String
    description:String
    status:Boolean
}

input GetSingleOrderStatusInput {
    orderstatus_id:Int!
}

type GetSingleOrderStatusOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:OrderStatus
}


type GetOrderStatusListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[OrderStatus]
}

type GetPublicOrderStatusListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[OrderStatusPublic]
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addOrderStatus(data:addOrderStatusInput):CommonOutput!
    updateOrderStatus(data:UpdateOrderStatusInput):CommonOutput!
}

extend type Query {
    getSingleOrderStatus(query:GetSingleOrderStatusInput):GetSingleOrderStatusOutput!
    getOrderStatusList:GetOrderStatusListOutput!
    getPublicOrderStatusList:GetPublicOrderStatusListOutput!
}


`;