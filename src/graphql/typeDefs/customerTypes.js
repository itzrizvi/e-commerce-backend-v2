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
}

type Customer{
    id: Int!
    first_name: String!
    last_name: String!
    email: String!
    email_verified: Boolean!
    user_status: Boolean!
    image: String
    addresses: [AddressOutput]
}


type getAllCustomerOutput{
    status: Boolean!
    message: String!
    data: [Customer]!
}

type SingleCustomerOutput{
    status: Boolean!
    message: String!
    data: Customer!
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

extend type Mutation {
    addCustomer(data: CustomerInput): AddCustomerOutput!
    addCustomerBillingAddress(data: AddCustomerBillingAddressInput): CommonOutput!
    addCustomerShippingAddress(data: AddCustomerShippingAddressInput): CommonOutput!
    updateCustomerAddress(data: UpdateCustomerAddressInput): CommonOutput!
}
extend type Query {
    getAllCustomer: getAllCustomerOutput!
    getSingleCustomer(query: GetSingleCustomerInput): SingleCustomerOutput!
}
`;