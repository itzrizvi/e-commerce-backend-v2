const { gql } = require("apollo-server-express");


module.exports = gql`

# Vendor Based Input and Queries ###############################################
##############################################################################


type Vendor{
    vendor_uuid: UUID!
    vendor_name: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_address: String!
    vendor_city: String!
    vendor_country: String!
    vendor_status: Boolean!
}

input CreateVendorInput{
    vendor_name: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_address: String!
    vendor_city: String!
    vendor_country: String!
    vendor_status: Boolean!
}

input UpdateVendorInput{
    vendor_uuid: UUID!
    vendor_name: String!
    vendor_company_name: String
    vendor_email: String!
    vendor_description: String
    vendor_address: String!
    vendor_city: String!
    vendor_country: String!
    vendor_status: Boolean!
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