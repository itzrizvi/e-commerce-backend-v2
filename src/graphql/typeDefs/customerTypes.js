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
    image: String!
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

extend type Mutation {
    addCustomer(data: CustomerInput): CreateCustomerOutput!
}
extend type Query {
    getAllUser: getAllCustomerOutput!
}
`;