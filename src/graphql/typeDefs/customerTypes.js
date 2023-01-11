const { gql } = require("apollo-server-express");


module.exports = gql`

# Customer Based Input and Queries #######################################################
######################################################################################

input CustomerInput {
    first_name:String!
    last_name:String!
    email:String!
    status: Boolean!
    send_mail: Boolean!
    phone:String
    fax:String
    company_name:String
}

type Customer {
    id: Int!
    first_name: String!
    last_name: String!
    email: String!
    email_verified: Boolean!
    user_status: Boolean!
    image: String
    phone:String
    fax:String
    company_name:String
    createdAt:String
    updatedAt:String
    addresses: [AddressOutput]
    contactPersons: [ContactPerson]
}


type getAllCustomerOutput{
    status: Boolean
    message: String
    data: [Customer]
}

type SingleCustomerOutput{
    status: Boolean
    message: String
    data: Customer
}

input GetSingleCustomerInput{
    customer_id: Int!
}

type AddAddressOutput {
    message:String
    status:Boolean
    tenant_id:String
    id:Int
}

type AddCustomerOutput {
    message:String
    status:Boolean
    tenant_id:String
    id:Int
}

input AddCustomerBillingAddressInput {
    addresses:[Address]
}

input AddCustomerShippingAddressInput {
    addresses:[Address]
}

input UpdateCustomerAddressInput {
    ref_id:Int!
    type:String!
    addresses:[UpdateAddress]
}

input addCustomerSingleBillingInput {
    address1: String!
    address2: String
    phone: String
    fax: String
    email: String
    city: String!
    state: String!
    zip_code: String!
    country: String!
    status: Boolean
    isDefault: Boolean
}

input addCustomerSingleShippingInput {
    address1: String!
    address2: String
    phone: String
    fax: String
    email: String
    city: String!
    state: String!
    zip_code: String!
    country: String!
    status: Boolean
    isDefault: Boolean
}

type addCustomerAddressOutput {
    message:String
    status:Boolean
    tenant_id:String
    id:Int
}

input UpdateCustomerSingleAddressInput {
    id:Int!
    type:String!
    address1: String
    address2: String
    phone: String
    fax: String
    email: String
    city: String
    state: String
    zip_code: String
    country: String
    status: Boolean
    isDefault: Boolean
}


input UpdateCustomerInput {
    id:Int!
    first_name:String
    last_name:String
    user_status:Boolean
    send_mail:Boolean
    phone:String
    fax:String
    company_name:String
}


input CustomerSearchInput {
    searchQuery:String
}

type CustomerSearchOutput {
    status: Boolean
    message: String
    tenant_id:String
    data: [Customer]
}

input GetContactPersonListInput {
    customer_id:Int!
}

type GetContactPersonListOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[ContactPerson]
}

input CustomerListInput {
    searchQuery:String
    customerStatus:String
    emailVerified:String
    customerEntryStartDate:String
    customerEntryEndDate:String
}

extend type Mutation {
    addCustomer(data: CustomerInput): AddCustomerOutput!
    addCustomerBillingAddress(data: AddCustomerBillingAddressInput): CommonOutput!
    addCustomerShippingAddress(data: AddCustomerShippingAddressInput): CommonOutput!
    updateCustomerAddress(data: UpdateCustomerAddressInput): CommonOutput!
    addCustomerSingleBillingAddress(data:addCustomerSingleBillingInput):addCustomerAddressOutput!
    addCustomerSingleShippingAddress(data:addCustomerSingleShippingInput):addCustomerAddressOutput!
    updateCustomerSingleAddress(data:UpdateCustomerSingleAddressInput):CommonOutput!
    updateCustomer(data:UpdateCustomerInput):CommonOutput!
}
extend type Query {
    getAllCustomer(query:CustomerListInput): getAllCustomerOutput!
    getSingleCustomer(query: GetSingleCustomerInput): SingleCustomerOutput!
    getSearchedCustomers(query: CustomerSearchInput): CustomerSearchOutput!
    getContactPersonListByCustomerID(query:GetContactPersonListInput):GetContactPersonListOutput!
}
`;