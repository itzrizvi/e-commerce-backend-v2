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
    promo_type:String
    promo_id:Int
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
    discount_amount:Float
    tax_amount:Float
    shipping_cost:Float
    tax_exempt:Boolean
    tenant_id:String
    po_id:Int
    po_number:String
    note:String
    shippingAccount:ShippingAccount
    createdAt:String
    updatedAt:String
    orderitems:[OrderItem]
    paymentmethod:PaymentMethod
    payment:OrderPayment
    orderstatus:OrderStatusPublic
    customer:Customer
    contactperson:ContactPerson
    shippingAddress:AddressList
    shippingmethod:ShippingMethod
    taxExemptFiles:[TaxExemptFiles]
    coupon:Coupon
    added_by:Staff
    shippingMethod:ShippingMethodPublic
}

type OrderCustomer {
    id:Int
    total:Float
    sub_total:Float
    discount_amount:Float
    tax_amount:Float
    tax_exempt:Boolean
    note:String
    po_number:String
    tenant_id:String
    createdAt:String
    updatedAt:String
    contactperson:ContactPerson
    orderitems:[OrderItem]
    paymentmethod:PaymentMethod
    payment:OrderPayment
    orderstatus:OrderStatusPublic
    customer:Customer
    shippingAddress:AddressList
    taxExemptFiles:[TaxExemptFiles]
    coupon:Coupon
    shippingMethod:ShippingMethodPublic
    shippingAccount:ShippingAccount
}

input createOrderByCustomerInput {
    cart_id:Int!
    person_id:Int
    tax_exempt:Boolean!
    taxexempt_file:[Upload]
    payment_id:Int!
    shipping_method_id:Int!
    note:String
    po_number:String
    coupon_id:Int
    order_status_slug:String!
    billing_address_id:Int!
    shipping_address_id:Int!
}

input createOrderByAdminInput {
    customer_id:Int!
    person_id:Int
    tax_exempt:Boolean
    taxexempt_file:[Upload]
    payment_id:Int!
    coupon_id:Int
    note:String
    po_number:String
    shipping_account_id:Int
    order_status_id:Int
    billing_address_id:Int!
    shipping_address_id:Int!
    shipping_method_id:Int
    orderProducts:JSON
}

type OrderList {
    id:Int
    customer:Customer
    paymentmethod:PaymentMethod
    total:Float
    po_id:Int
    po_number:String
    sub_total:Float
    discount_amount:Float
    tax_amount:Float
    orderStatus:OrderStatusPublic
    orderitems:[OrderItem]
    productCount:Int
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

input GetSingleOrderCustomerInput {
    order_id:Int!
}

type GetSingleOrderCustomerOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:OrderCustomer
}

input UpdateOrderInput {
    order_id:Int!
    person_id:Int
    shipping_address_id:Int
    billing_address_id:Int
    shipping_method_id:Int
    payment_id:Int
    note:String
    po_number:String
    coupon_id:Int
    shipping_account_id:Int
    tax_exempt:Boolean
    taxexempt_file:[Upload]
    order_status_id:Int
    orderItems:JSON
}

input OrderStatusChangeInput {
    order_id:Int!
    order_status_id:Int!
}

input GetOrderListByCustomerIDInput {
    customer_id:Int!
}

type GetOrderListByCustomerIDOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[OrderList]
}

input CancelOrderByCustomerInput {
    order_status_id:Int!
    order_id:Int!
}

type OrderHistory {
    id:Int
    operation:String
    order_id:Int
    tenant_id:String
    activity_by:Staff
}

input GetOrderHistoryInput {
    id:Int!
}

type GetOrderHistoryOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[OrderHistory]
}

type OrderPlaceOutput {
    message:String
    status:Boolean
    tenant_id:String
    id:Int
}

input orderListInput {
    searchQuery:String
    paymentmethods:[Int]
    statuses:[Int]
    updatedby:[Int]
    productIds:[Int]
    orderEntryStartDate:String
    orderEntryEndDate:String
    orderUpdatedStartDate:String
    orderUpdatedEndDate:String
}

type GetOrderUpdateAdmins {
    message:String
    status:Boolean
    tenant_id:String
    data:[Staff]
}

input searchOrderInput {
    searchQuery:Int
}


# ORDER RMA LOOKUP TYPES #############################################

type OrderRMALookup {
    category:String
    code:String
    name:String
    status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
    added_by:Staff
}

input GetOrderRMALookupListInput {
    category:String!
    code:String!
}

type GetOrderRMAListLookupOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[OrderRMALookup]
}

# ORDER RMA TYPES #############################################

type ProductForRMA {
    id:Int
    prod_name:String
    cost:Float
    prod_partnum:String
    prod_sku:String
    productCondition:ProductCondition
    dimensions:ProductDimension
    weight:ProductWeight
}

type OrderRMA {
    id:Int
    order:OrderList
    create_date:String
    rma_type:String
    handling_fee:Float
    return_tax:Float
    refund_shipping:Float
    rma_status:String
    email:String
    comment:String
    added_by:Staff
    tenant_id:String
    createdAt:String
    updatedAt:String
    orderrmadetails:[OrderRMADetail]
    orderrmardetails:[OrderRMARDetail]
    orderrmas:[OrderRMAS]
}

type OrderRMAList {
    id:Int
    order:OrderList
    create_date:String
    rma_type:String
    handling_fee:Float
    return_tax:Float
    refund_shipping:Float
    rma_status:String
    email:String
    comment:String
    added_by:Staff
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type OrderRMADetail {
    line_id:Int
    rma_id:Int
    product:ProductForRMA
    order_id:Int
    rma_quantity:Int
    rma_receive_qty:Int
    restock_percent:Float
    restock_fee:Float
    rma_reason_type:String
    rma_receive_type:String
    rma_comment:String
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type OrderRMARDetail {
    line_id:Int
    rma_id:Int
    product:ProductForRMA
    order_id:Int
    rma_replace_qty:Int
    rma_replace_cost:Float
    rma_replace_discount:Float
    comment:String
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type OrderRMAS {
    line_id:Int
    rma_id:Int
    shipping_in_out:Boolean
    shippingmethod:ShippingMethod
    return_tracking_out:String
    return_tracking_in:String
    tenant_id:String
    createdAt:String
    updatedAt:String
}


input OrderRMADetailInput {
    product_id:Int!
    rma_quantity:Int!
    rma_receive_qty:Int!
    restock_percent:Float
    restock_fee:Float
    rma_reason_type:String
    rma_receive_type:String
    rma_comment:String
}

input UpdateOrderRMADetailInput {
    line_id:Int!
    product_id:Int
    rma_quantity:Int
    rma_receive_qty:Int
    restock_percent:Float
    restock_fee:Float
    rma_reason_type:String
    rma_receive_type:String
    rma_comment:String
}

input OrderRMARDetailInput {
    product_id:Int!
    rma_replace_qty:Int!
    rma_replace_cost:Float!
    rma_replace_discount:Float
    comment:String
}

input UpdateOrderRMARDetailInput {
    line_id:Int!
    product_id:Int
    rma_replace_qty:Int
    rma_replace_cost:Float
    rma_replace_discount:Float
    comment:String
}

input OrderRMASInput {
    shipping_in_out:Boolean!
    shipping_method:Int!
    return_tracking_out:String
    return_tracking_in:String
}

input UpdateOrderRMASInput {
    line_id:Int!
    shipping_in_out:Boolean
    shipping_method:Int
    return_tracking_out:String
    return_tracking_in:String
}

input createOrderRMAInput {
    order_id:Int!
    create_date:String!
    rma_type:String!
    handling_fee:Float
    return_tax:Float
    refund_shipping:Float
    rma_status:String
    email:String
    comment:String
    orderrmadetail:OrderRMADetailInput!
    orderrmardetail:OrderRMARDetailInput!
    orderrmas:OrderRMASInput!
}

input updateOrderRMAInput {
    id:Int!
    order_id:Int
    create_date:String
    rma_type:String
    handling_fee:Float
    return_tax:Float
    refund_shipping:Float
    rma_status:String
    email:String
    comment:String
    orderrmadetail:UpdateOrderRMADetailInput
    orderrmardetail:UpdateOrderRMARDetailInput
    orderrmas:UpdateOrderRMASInput
}

input GetOrderRMAListInput {
    id:Int
    order_id:Int
}

type GetOrderRMAListOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[OrderRMAList]
}

input GetSingleOrderRMAInput {
    id:Int!
}

type GetSingleOrderRMAOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:OrderRMA
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addOrderStatus(data:addOrderStatusInput):CommonOutput!
    updateOrderStatus(data:UpdateOrderStatusInput):CommonOutput!
    createOrderByCustomer(data:createOrderByCustomerInput):OrderPlaceOutput!
    createOrderByAdmin(data:createOrderByAdminInput):OrderPlaceOutput!
    updateOrder(data:UpdateOrderInput):CommonOutput!
    orderStatusChange(data:OrderStatusChangeInput):CommonOutput!
    orderCancelByCustomer(data:CancelOrderByCustomerInput):CommonOutput!
    createOrderRMA(data:createOrderRMAInput):CommonOutput!
    updateOrderRMA(data:updateOrderRMAInput):CommonOutput!
}

extend type Query {
    getSingleOrderStatus(query:GetSingleOrderStatusInput):GetSingleOrderStatusOutput!
    getOrderStatusList:GetOrderStatusListOutput!
    getPublicOrderStatusList:GetPublicOrderStatusListOutput!
    getOrderlistAdmin(query:orderListInput):GetOrderListForAdmin!
    getSingleOrderAdmin(query:GetSingleOrderAdminInput):GetSingleOrderAdminOutput!
    getSingleOrderCustomer(query:GetSingleOrderCustomerInput):GetSingleOrderCustomerOutput!
    getOrderListByCustomerID(query:GetOrderListByCustomerIDInput):GetOrderListByCustomerIDOutput!
    getOrderActivityHistory(query:GetOrderHistoryInput):GetOrderHistoryOutput!
    getOrderUpdateAdminList:GetOrderUpdateAdmins!
    getOrderBySearch(query:searchOrderInput):GetOrderListForAdmin!
    getOrderRMALookupList(query:GetOrderRMALookupListInput):GetOrderRMAListLookupOutput!
    getOrderRMAList(query:GetOrderRMAListInput):GetOrderRMAListOutput!
    getSingleOrderRMA(query:GetSingleOrderRMAInput):GetSingleOrderRMAOutput!
}


`;