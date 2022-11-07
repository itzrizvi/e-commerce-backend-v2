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
    id:Int
    name:String
    slug:String
    description:String
    status:Boolean
    tenant_id:String
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


type OrderItem {
    id:Int
    order_id:Int
    product:ProductForList
    price:Float
    quantity:Int
    tenant_id:String
}

type TaxExemptFiles {
    id:Int
    order_id:Int
    file_name:String
    tenant_id:String
}

type OrderPayment {
    id:Int
    order_id:Int
    billingAddress:AddressList
    amount:Float
    provider_id:Int
    status:String
    tenant_id:String
}

type OrderAdmin {
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
    orderitems:[OrderItem]
    paymentmethod:PaymentMethod
    payment:OrderPayment
    orderstatus:OrderStatusPublic
    customer:Customer
    shippingAddress:AddressList
    taxExemptFiles:[TaxExemptFiles]
    coupon:Coupon
    added_by:Staff
}

# type OrderPublic {
#     id:Int
#     total:Float
#     sub_total:Float
#     shipping_cost:Float
#     discount_amount:Float
#     tax_amount:Float
#     tax_exempt:Boolean
#     tenant_id:String
#     createdAt:String
#     updatedAt:String
#     orderfrom:Customer
#     paymentmethod:PaymentMethod
#     coupon:Coupon
#     orderstatus:OrderStatus
# }

input createOrderByCustomerInput {
    cart_id:Int!
    tax_exempt:Boolean!
    taxexempt_file:[Upload]
    payment_id:Int!
    coupon_id:Int
    order_status_id:Int!
    billing_address_id:Int!
    shipping_address_id:Int!
}

input createOrderByAdminInput {
    customer_id:Int!
    cart_id:Int!
    tax_exempt:Boolean!
    taxexempt_file:[Upload]
    payment_id:Int!
    coupon_id:Int
    order_status_id:Int!
    billing_address_id:Int!
    shipping_address_id:Int!
}

type OrderList {
    id:Int
    customer:Customer
    payment:PaymentMethod
    total:Float
    sub_total:Float
    shipping_cost:Float
    discount_amount:Float
    tax_amount:Float
    orderStatus:OrderStatusPublic
    tax_exempt:Boolean
    createdAt:String
    updatedAt:String
}


type GetOrderListForAdmin {
    message:String
    status:Boolean
    tenant_id:String
    data:[OrderList]
}

input GetSingleOrderAdminInput {
    order_id:Int!
}

type GetSingleOrderAdminOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:OrderAdmin
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addOrderStatus(data:addOrderStatusInput):CommonOutput!
    updateOrderStatus(data:UpdateOrderStatusInput):CommonOutput!
    createOrderByCustomer(data:createOrderByCustomerInput):CommonOutput!
    createOrderByAdmin(data:createOrderByAdminInput):CommonOutput!
}

extend type Query {
    getSingleOrderStatus(query:GetSingleOrderStatusInput):GetSingleOrderStatusOutput!
    getOrderStatusList:GetOrderStatusListOutput!
    getPublicOrderStatusList:GetPublicOrderStatusListOutput!
    getOrderlistAdmin:GetOrderListForAdmin!
    getSingleOrderAdmin(query:GetSingleOrderAdminInput):GetSingleOrderAdminOutput!
}


`;