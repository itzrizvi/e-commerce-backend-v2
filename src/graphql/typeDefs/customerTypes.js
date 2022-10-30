const { gql } = require("apollo-server-express");


module.exports = gql`

# Customer Based Input and Queries #######################################################
######################################################################################

input CustomerInput {
    first_name:String!
    last_name:String!
    email:String!
    password:String!
    status: Boolean!
    send_mail: Boolean!
}

type Customer{
    uid: UUID!
    first_name: String!
    last_name: String!
    email: String!
    email_verified: Boolean!
    user_status: Boolean!
    image: String
    billing_addresses: [BillingAddressOutput]
    shipping_addresses: [ShippingAddressOutput]
}

type CreateCustomerOutput{
    status: Boolean!
    message: String!
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
    customer_id: UUID!
}

input CustomerShippingAddress{
    customer_id: UUID!
    shipping_address: String!
    shipping_city: String!
    shipping_PO_code: String!
    shipping_country: String!
    shipping_status: Boolean!
}

input CustomerBillingAddress{
    customer_id: UUID!
    billing_address: String!
    billing_city: String!
    billing_PO_code: String!
    billing_country: String!
    billing_status: Boolean!
}

extend type Mutation {
    addCustomer(data: CustomerInput): CreateCustomerOutput!
    addCustomerBillingAddress(data: CustomerBillingAddress): CreateCustomerOutput!
    addCustomerShippingAddress(data: CustomerShippingAddress): CreateCustomerOutput!
    updateCustomerBillingAddress(data: UpdateBillingAddress): CreateCustomerOutput!
    updateCustomerShippingAddress(data: UpdateShippingAddress): CreateCustomerOutput!
}
extend type Query {
    getAllCustomer: getAllCustomerOutput!
    getSingleCustomer(query: GetSingleCustomerInput): SingleCustomerOutput!
}
`;