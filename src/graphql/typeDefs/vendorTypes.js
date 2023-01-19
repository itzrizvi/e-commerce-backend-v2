const { gql } = require("apollo-server-express");


module.exports = gql`

# Vendor Based Input and Queries ###############################################
##############################################################################


type ContactPerson {
    id:Int
    ref_id:Int
    ref_model:String
    name:String
    email:String
    phone:String
    fax:String
    status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
}


type Vendor {
    id: Int!
    contactPersons: [ContactPerson]
    contact_person: String
    email: String
    phone_number: String
    FAX_no: String
    company_name: String
    description: String
    EIN_no: String
    TAX_ID: String
    status: Boolean
    addresses: [AddressOutput]
    createdAt:String
    updatedAt:String
}


input CreateVendorInput {
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

input UpdateVendorInput {
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
    message:String
    status:Boolean
    id: Int
}

type UpdateVendorOutput{
    message:String
    status:Boolean
}

type VendorOutput {
    message:String
    status:Boolean
    tenant_id:String
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


input AddVendorBillingAddressInput {
    addresses:[Address]
}

input AddVendorShippingAddressInput {
    addresses:[Address]
}

input UpdateVendorAddressInput {
    ref_id:Int!
    type:String!
    addresses:[UpdateAddress]
}

input ContactPersonInputType {
    name:String!
    email:String!
    phone:String
    fax:String
    status:Boolean!
}

input CreateContactPersonInput {
    ref_id:Int!
    type:String!
    contact_persons: [ContactPersonInputType]
}

input ContactPersonUpdateInputType {
    id:Int
    name:String!
    email:String!
    phone:String
    fax:String
    status:Boolean!
    isNew:Boolean!
}

input UpdateContactPersonInput {
    ref_id:Int!
    type:String!
    contact_persons: [ContactPersonUpdateInputType]
}

input VendorSearchInput {
    searchQuery:String
}

type VendorSearchOutput {
    status: Boolean
    message: String
    tenant_id:String
    data: [Vendor]
}

input GetContactPersonInput {
    id:Int!
    type:String!
    status:Boolean!
}

type GetContactPersonOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ContactPerson]
}

input VendorFilterInput {
    searchQuery:String # company_name, email, phone
    status:String
    vendorEntryStartDate:String
    vendorEntryEndDate:String
    vendorUpdatedStartDate:String
    vendorUpdatedEndDate:String
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createVendor(data: CreateVendorInput): CreateVendorOutput!
    updateVendor(data: UpdateVendorInput): UpdateVendorOutput!
    addVendorBillingAddress(data: AddVendorBillingAddressInput): CommonOutput!
    addVendorShippingAddress(data: AddVendorShippingAddressInput): CommonOutput!
    updateVendorStatus(data: UpdateVendorStatusInput): CreateVendorOutput!
    updateVendorAddress(data: UpdateVendorAddressInput): CommonOutput!
    createContactPerson(data:CreateContactPersonInput):CommonOutput!
    updateContactPerson(data:UpdateContactPersonInput):CommonOutput!
}

extend type Query {
    getAllVendor(query:VendorFilterInput): VendorOutput!
    getSearchedVendors(query: VendorSearchInput): VendorSearchOutput!
    getSingleVendor(query: GetSingleVendorInput): SingleVendorOutput!
    getContactPerson(query:GetContactPersonInput):GetContactPersonOutput!
}
`;