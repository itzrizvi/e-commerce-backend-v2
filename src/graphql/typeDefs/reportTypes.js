const { gql } = require("apollo-server-express");


module.exports = gql`

# Report Based Input and Types ###########################
##########################################################

type OrderListReport {
    order_id: Int
    customer_name: String
    customer_email: String
    total_amount: Float
    sub_total: Float
    shipping_cost: Float
    discount_amount: Float
    tax_amount: Float
    tax_exempt: Boolean
    totalproducts: Int
    totalquantity: Int
    createdAt: String
    updatedAt: String
    paymentmethod: String
    orderstatus: String
    shippingmethod: String
    coupon_name: String
    coupon_code: String
    coupon_type: String
    coupon_amount: Float
}

type OrderListReportOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[OrderListReport]
}

input GetSingleOrderReportInput {
    order_id:Int!
}

type GetSingleOrderReportOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:OrderAdmin
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getOrderListReport:OrderListReportOutput!
    getSingleOrderReport(query:GetSingleOrderReportInput):GetSingleOrderReportOutput!
}


`;