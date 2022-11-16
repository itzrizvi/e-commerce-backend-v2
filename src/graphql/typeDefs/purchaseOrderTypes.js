const { gql } = require("apollo-server-express");


module.exports = gql`

# Purchase Order Setting Based Input and Types ###########
##########################################################

input POSettingInput {
    po_prefix:String!
    po_startfrom:Int
}

input CreatePurchaseOrderInput {
    vendor_id:Int!
    vendor_billing_id:Int!
    vendor_shipping_id:Int!
    status:String!
    shipping_method_id:Int!
    payment_method_id:Int!
    tax_amount:Float!
    order_placed_via:String!
    comment:String
    products:JSON!
}

type PurchaseOrderList {
    id:Int
    po_id:String
    grandTotal_price:Float
    order_placed_via:String
    status:String
    comment:String
    vendor:Vendor
    paymentmethod:PaymentMethod
    POCreated_by:Staff
}

type GetPurchaseOrderList {
    message:String
    tenant_id:String
    status:Boolean
    data:[PurchaseOrderList]
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    poSetting(data:POSettingInput):CommonOutput!
    createPurchaseOrder(data:CreatePurchaseOrderInput):CommonOutput!
}

extend type Query {
    getPurchaseOrderList:GetPurchaseOrderList!
}


`;