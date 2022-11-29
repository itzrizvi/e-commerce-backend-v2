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
    shipping_method_id:Int!
    payment_method_id:Int!
    tax_amount:Float!
    order_id:Int
    type:String
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
    order_id:Int
    type:String
    POCreated_by:Staff
}

type POProductList {
    id:Int
    purchase_order_id:Int
    quantity:Int
    price:Float
    totalPrice:Float
    recieved_quantity:Int
    remaining_quantity:Int
    tenant_id:String
    product:ProductForList
}

type PurchaseOrder {
    id: Int
    po_id: String
    grandTotal_price: Float
    tax_amount: Float
    order_placed_via: String
    status: String
    comment: String
    shipping_method_id: Int
    tenant_id: String
    order_id:Int
    type:String
    vendor: Vendor
    vendorBillingAddress: AddressList
    vendorShippingAddress: AddressList
    paymentmethod: PaymentMethod
    poProductlist:[POProductList]
    POCreated_by: Staff
}

type GetPurchaseOrderList {
    message:String
    tenant_id:String
    status:Boolean
    data:[PurchaseOrderList]
}


input GetSinglePurchaseOrderInput {
    id:Int!
}

type GetSinglePurchaseOrderOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:PurchaseOrder
}

input UpdatePurchaseOrderInput {
    id:Int!
    po_id:String!
    vendor_id:Int
    vendor_billing_id:Int
    vendor_shipping_id:Int
    shipping_method_id:Int
    payment_method_id:Int
    order_placed_via:String
    order_id:Int
    type:String
    status:String
    tax_amount:Float
    comment:String
    products:JSON
}

input POStatusChangeInput{
    id:Int
    status:String
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    poSetting(data:POSettingInput):CommonOutput!
    createPurchaseOrder(data:CreatePurchaseOrderInput):CommonOutput!
    updatePurchaseOrder(data:UpdatePurchaseOrderInput):CommonOutput!
    updatePOStatus(data:POStatusChangeInput):CommonOutput!
}

extend type Query {
    getPurchaseOrderList:GetPurchaseOrderList!
    getSinglePurchaseOrder(query:GetSinglePurchaseOrderInput):GetSinglePurchaseOrderOutput
}


`;