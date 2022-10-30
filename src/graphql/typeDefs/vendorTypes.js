const { gql } = require("apollo-server-express");


module.exports = gql`

# Vendor Based Input and Queries ###############################################
##############################################################################


type Vendor{
    vendor_id: Int!
    vendor_contact_person: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_phone_number: String
    vendor_EIN_no: String
    vendor_TAX_ID: String
    vendor_FAX_no: String
    vendor_status: Boolean!
    billing_addresses: [AddressOutput]
    shipping_addresses: [AddressOutput]
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
}

input UpdateVendorInput{
    vendor_id: Int!
    vendor_contact_person: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_status: Boolean!
    vendor_phone_number: String
    vendor_EIN_no: String
    vendor_TAX_ID: String
    vendor_FAX_no: String
    billing_address: [UpdateAddress]!
    shipping_address: [UpdateAddress]!
}

input UpdateVendorStatusInput{
    vendor_id: Int!
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
    vendor_id:Int!
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