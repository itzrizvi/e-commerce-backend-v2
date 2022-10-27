const { gql } = require("apollo-server-express");


module.exports = gql`

# Vendor Based Input and Queries ###############################################
##############################################################################


type Vendor{
    vendor_uuid: UUID!
    vendor_contact_person: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_phone_number: String
    vendor_EIN_no: String
    vendor_TAX_ID: String
    vendor_FAX_no: String
    vendor_status: Boolean!
    billing_addresses: [BillingAddressOutput]
    shipping_addresses: [ShippingAddressOutput]
}

input ShippingAddress{
    shipping_address: String!
    shipping_city: String!
    shipping_PO_code: String!
    shipping_country: String!
    shipping_status: Boolean!
}

input BillingAddress{
    billing_address: String!
    billing_city: String!
    billing_PO_code: String!
    billing_country: String!
    billing_status: Boolean!
}

type ShippingAddressOutput{
    shipping_uuid: UUID
    shipping_address: String!
    shipping_city: String!
    shipping_PO_code: String!
    shipping_country: String!
    shipping_status: Boolean!
}

type BillingAddressOutput{
    billing_uuid: UUID
    billing_address: String!
    billing_city: String!
    billing_PO_code: String!
    billing_country: String!
    billing_status: Boolean!
}

input UpdateShippingAddress{
    shipping_uuid: UUID!
    shipping_address: String!
    shipping_city: String!
    shipping_PO_code: String!
    shipping_country: String!
    shipping_status: Boolean!
}

input UpdateBillingAddress{
    billing_uuid: UUID!
    billing_address: String!
    billing_city: String!
    billing_PO_code: String!
    billing_country: String!
    billing_status: Boolean!
}

input CreateVendorInput{
    vendor_contact_person: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_status: Boolean!
    vendor_phone_number: String
    vendor_EIN_no: String
    vendor_TAX_ID: String
    vendor_FAX_no: String
    billing_address: [BillingAddress]!
    shipping_address: [ShippingAddress]!
}

input UpdateVendorInput{
    vendor_uuid: UUID!
    vendor_contact_person: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_status: Boolean!
    vendor_phone_number: String
    vendor_EIN_no: String
    vendor_TAX_ID: String
    vendor_FAX_no: String
    billing_address: [UpdateBillingAddress]!
    shipping_address: [UpdateShippingAddress]!
}

input UpdateVendorStatusInput{
    vendor_uuid: UUID!
    vendor_status: Boolean!
}

type CreateVendorOutput{
    message:String!
    status:Boolean!
}

type VendorOutput{
    message:String!
    status:Boolean!
    data: [Vendor]
}

type SingleVendorOutput{
    message:String!
    status:Boolean!
    data: Vendor
}


input GetSingleVendorInput{
    vendor_uuid:UUID!
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createVendor(data: CreateVendorInput): CreateVendorOutput!
    updateVendor(data: UpdateVendorInput): CreateVendorOutput!
    updateVendorStatus(data: UpdateVendorStatusInput): CreateVendorOutput!
}

extend type Query {
    getAllVendor: VendorOutput!
    getSingleVendor(query: GetSingleVendorInput): SingleVendorOutput!
}
`;