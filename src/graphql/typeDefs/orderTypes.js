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


# Order Based Input and Types ##########################
########################################################

type OrderAdmin {
    id:Int
    total:Float
    sub_total:Float
    shipping_cost:Float
    discount_amount:Float
    tax_amount:Float
    tax_exempt:Boolean
    cartitems:[CartItem]
    orderfor:Customer
    paymentmethod:PaymentMethod
    coupon:Coupon
    orderstatus:OrderStatus
    added_by:Staff
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type OrderPublic {
    id:Int
    total:Float
    sub_total:Float
    shipping_cost:Float
    discount_amount:Float
    tax_amount:Float
    tax_exempt:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
    orderfrom:Customer
    paymentmethod:PaymentMethod
    coupon:Coupon
    orderstatus:OrderStatus
}

input createOrderInput {
    cart_id:Int!
    tax_exempt:Boolean!
    taxexempt_file:[Upload]
    customer_id:Int!
    payment_id:Int!
    coupon_id:Int!
    order_status_id:Int!
    billing_address_id:Int!
    shipping_address_id:Int!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addOrderStatus(data:addOrderStatusInput):CommonOutput!
    updateOrderStatus(data:UpdateOrderStatusInput):CommonOutput!
    createOrderByCustomer(data:createOrderInput):CommonOutput!
}

extend type Query {
    getSingleOrderStatus(query:GetSingleOrderStatusInput):GetSingleOrderStatusOutput!
    getOrderStatusList:GetOrderStatusListOutput!
    getPublicOrderStatusList:GetPublicOrderStatusListOutput!
}


`;