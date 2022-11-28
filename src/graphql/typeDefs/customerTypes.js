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


extend type Mutation {
    addCustomer(data: CustomerInput): AddCustomerOutput!
    addCustomerBillingAddress(data: Address): AddAddressOutput!
    addCustomerShippingAddress(data: Address): AddAddressOutput!
    updateCustomerAddress(data: UpdateAddress): CommonOutput!
}
extend type Query {
    getAllCustomer: getAllCustomerOutput!
    getSingleCustomer(query: GetSingleCustomerInput): SingleCustomerOutput!
}
`;