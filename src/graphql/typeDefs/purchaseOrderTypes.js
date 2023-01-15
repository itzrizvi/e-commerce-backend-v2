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
    shipping_account_id:Int
    payment_method_id:Int!
    tax_amount:Float!
    shipping_cost:Float!
    is_insurance:Boolean
    receiving_instruction:String
    order_id:Int
    type:String!
    comment:String
    products:JSON!
    contact_person_id:Int
}

type PurchaseOrderList {
    id:Int
    po_number:String
    rec_id:Int
    shipping_cost:Float
    is_insurance:Boolean
    receiving_instruction:String
    grandTotal_price:Float
    comment:String
    vendor:Vendor
    paymentmethod:PaymentMethod
    order_id:Int
    type:String
    POCreated_by:Staff
}

type ProductSerial {
    id:Int
    prod_id:Int
    serial:String
    rec_prod_id:Int
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
    serials:[ProductSerial]
    product:ProductForList
}

type PurchaseOrder {
    id: Int
    po_number: String
    rec_id:Int
    grandTotal_price: Float
    tax_amount: Float
    comment: String
    shipping_method_id: Int
    tenant_id: String
    shipping_cost:Float
    is_insurance:Boolean
    receiving_instruction:String
    order_id:Int
    type:String
    vendor: Vendor
    vendorBillingAddress: AddressList
    vendorShippingAddress: AddressList
    paymentmethod: PaymentMethod
    shippingMethod:ShippingMethodPublic
    poProductlist:[POProductList]
    contactPerson:ContactPerson
    shippingAccount:ShippingAccount
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
    po_number:String!
    vendor_id:Int
    vendor_billing_id:Int
    vendor_shipping_id:Int
    shipping_method_id:Int
    shipping_account_id:Int
    payment_method_id:Int
    contact_person_id:Int
    reason:String
    order_placed_via:String
    order_id:Int
    type:String
    status:String
    tax_amount:Float
    comment:String
    shipping_cost:Float
    is_insurance:Boolean
    receiving_instruction:String
    products:JSON
}

input POStatusChangeInput{
    id:Int
    status:String
}

input createReceivingInput {
    purchaseOrder_id:Int
    status:String
}

type createReceivingOutput {
    message:String
    tenant_id:String
    status:Boolean
    id:Int
}

input ViewPOPublicInput {
    param1:String!
    param2:String!
}

type POTRKDetails {
    purchaseOrder:PurchaseOrderList
    tracking_no:String
    createdAt:String
    updatedAt:String
}

input POTRKInput {
    po_id:Int
    tracking_no:String
}

type GetPOTRKListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[POTRKDetails]
}

input GetPOTRKListInput {
    po_id:Int!
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    poSetting(data:POSettingInput):CommonOutput!
    createPurchaseOrder(data:CreatePurchaseOrderInput):CommonOutput!
    updatePurchaseOrder(data:UpdatePurchaseOrderInput):CommonOutput!
    updatePOStatus(data:POStatusChangeInput):CommonOutput!
    createReceiving(data:createReceivingInput):createReceivingOutput!
    createPOTRKDetails(data:POTRKInput):CommonOutput!
}

extend type Query {
    getPurchaseOrderList:GetPurchaseOrderList!
    getPOTRKList(query:GetPOTRKListInput):GetPOTRKListOutput!
    getSinglePurchaseOrder(query:GetSinglePurchaseOrderInput):GetSinglePurchaseOrderOutput!
    viewPurchaseOrderPublic(query:ViewPOPublicInput):GetSinglePurchaseOrderOutput!
}


`;