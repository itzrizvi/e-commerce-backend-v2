const { gql } = require("apollo-server-express");


module.exports = gql`

# Purchase Order Setting Based Input and Types ###########
##########################################################

input POSettingInput {
    po_prefix:String!
    po_startfrom:Int
}

input POTRKDetailsInputForPO {
    tracking_no:String!
}

input POInvoiceInputForPO {
    invoice_no:String!
    invoice_date:String!
    invoice_path:String!
}

input POMFGDOCInputForPO {
    doc_path:String!
}

input CreatePurchaseOrderInput {
    vendor_id:Int!
    shipping_method_id:Int!
    shipping_account_id:Int
    payment_method_id:Int!
    tax_amount:Float
    shipping_cost:Float
    is_insurance:Boolean
    receiving_instruction:String
    order_id:Int
    type:String!
    comment:String
    products:JSON!
    contact_person_id:Int
    status:Int!
    # poTRKdetails:POTRKDetailsInputForPO
    # poInvoice:POInvoiceInputForPO
    # poMFGDoc:POMFGDOCInputForPO
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
    createdAt:String
    updatedAt:String
    postatus:POStatus
    potrkdetails:[POTRKDetails]
    poactivitites:[POActivitites]
    poinvoices:[POInvoice]
    pomfgdoc:[POMFGDOC]
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
    potrkdetails:[POTRKDetails]
    poactivitites:[POActivitites]
    poinvoices:[POInvoice]
    pomfgdoc:[POMFGDOC]
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

input UpdatePOTRKDetailsInputForPO {
    tracking_no:String
}

input UpdatePOInvoiceInputForPO {
    invoice_no:String
    invoice_date:String
    invoice_path:String
}

input UpdatePOMFGDOCInputForPO {
    doc_path:String
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
    poTRKdetails:UpdatePOTRKDetailsInputForPO
    poInvoice:UpdatePOInvoiceInputForPO
    poMFGDoc:UpdatePOMFGDOCInputForPO
}

input POStatusChangeInput{
    id:Int
    status:Int
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
    po_id:Int
    purchaseOrder:PurchaseOrderList
    tracking_no:String
    createdAt:String
    updatedAt:String
}

input POTRKInput {
    po_id:Int!
    tracking_no:String!
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

type POActivitites {
    po_id:Int
    purchaseOrder:PurchaseOrderList
    comment:String
    createdAt:String
    updatedAt:String
}

input POActivityInput {
    po_id:Int!
    comment:String!
}

input GetPOActivityListInput {
    po_id:Int!
}

type GetPOActivityListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[POActivitites]
}

type POInvoice {
    po_id:Int
    purchaseOrder:PurchaseOrderList
    invoice_no:String
    invoice_date:String
    invoice_path:String
    createdAt:String
    updatedAt:String
}

input POInvoiceInput {
    po_id:Int!
    invoice_no:String!
    invoice_date:String!
    invoice_path:String!
}

input GetPOInvoiceListInput {
    po_id:Int!
}

type GetPOInvoiceListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[POInvoice]
}

type POMFGDOC {
    po_id:Int
    purchaseOrder:PurchaseOrderList
    doc_path:String
    createdAt:String
    updatedAt:String
}

input POMFGDOCInput {
    po_id:Int!
    doc_path:String!
}

input GetPOMFGDOCListInput {
    po_id:Int!
}

type GetPOMFGDOCListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[POMFGDOC]
}

type POStatus {
    id:Int
    name:String
    slug:String
    status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
}

input POStatusInput {
    name:String
    status:Boolean
}

type GetAllPOStatus {
    message:String
    status:Boolean
    tenant_id:String
    data:[POStatus]
}


input POListFilters {
    searchQuery:String
    ponumbers:[String]
    productIDS:[Int]
    has_order:Boolean
    types:[String]
    statuses:[Int]
    poEntryStartDate:String
    poEntryEndDate:String
    poUpdatedStartDate:String
    poUpdatedEndDate:String
}

type PONUMBERS {
    po_number:String
}

type GetPONumberList {
    message:String
    status:Boolean
    tenant_id:String
    data:[PONUMBERS]
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
    createPOActivity(data:POActivityInput):CommonOutput!
    createPOInvoice(data:POInvoiceInput):CommonOutput!
    createMFGDOC(data:POMFGDOCInput):CommonOutput!
    createPOStatus(data:POStatusInput):CommonOutput!
}

extend type Query {
    getPurchaseOrderList(query:POListFilters):GetPurchaseOrderList!
    getPOTRKList(query:GetPOTRKListInput):GetPOTRKListOutput!
    getPOActivityList(query:GetPOActivityListInput):GetPOActivityListOutput!
    getPOInvoiceList(query:GetPOInvoiceListInput):GetPOInvoiceListOutput!
    getPOMFGDOCList(query:GetPOMFGDOCListInput):GetPOMFGDOCListOutput!
    getSinglePurchaseOrder(query:GetSinglePurchaseOrderInput):GetSinglePurchaseOrderOutput!
    viewPurchaseOrderPublic(query:ViewPOPublicInput):GetSinglePurchaseOrderOutput!
    getPOStatusList:GetAllPOStatus!
    getPONumbers:GetPONumberList!
}


`;