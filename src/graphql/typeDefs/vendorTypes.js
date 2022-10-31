const { gql } = require("apollo-server-express");


module.exports = gql`

# Vendor Based Input and Queries ###############################################
##############################################################################


type Vendor{
    id: Int!
    contact_person: String!
    company_name: String
    email: String!
    description: String
    phone_number: String
    EIN_no: String
    TAX_ID: String
    FAX_no: String
    status: Boolean!
    addresses: [AddressOutput]
}



input CreateVendorInput{
    contact_person: String!
    company_name: String
    email: String!
    description: String
    status: Boolean!
    phone_number: String
    EIN_no: String
    TAX_ID: String
    FAX_no: String
}

input UpdateVendorInput{
    id: Int!
    contact_person: String!
    company_name: String
    email: String!
    description: String
    status: Boolean!
    phone_number: String
    EIN_no: String
    TAX_ID: String
    FAX_no: String
}

input UpdateVendorStatusInput{
    id: Int!
    status: Boolean!
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
    id:Int!
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createVendor(data: CreateVendorInput): CreateVendorOutput!
    updateVendor(data: UpdateVendorInput): CreateVendorOutput!
    addVendorBillingAddress(data: Address): CommonOutput!
    addVendorShippingAddress(data: Address): CommonOutput!
    updateVendorStatus(data: UpdateVendorStatusInput): CreateVendorOutput!
    updateVendorAddress(data: UpdateAddress): CommonOutput!
}

extend type Query {
    getAllVendor: VendorOutput!
    getSingleVendor(query: GetSingleVendorInput): SingleVendorOutput!
}
`;