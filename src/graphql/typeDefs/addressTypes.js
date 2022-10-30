const { gql } = require("apollo-server-express");


module.exports = gql`
type AddressOutput{
    id: Int
    address1: String!
    address2: String!
    phone: String!
    fax: String
    email: String
    city: String!
    state: String!
    zip_code: String!
    country: String
    status: Boolean
    updatedAt:String
    createdAt:String
}

input Address{
    customer_id: Int!
    address1: String!
    address2: String!
    phone: String!
    fax: String
    email: String
    city: String!
    state: String!
    zip_code: String!
    country: String
    status: Boolean
}

input UpdateAddress{
    address_id: Int!
    address1: String!
    address2: String!
    phone: String!
    fax: String
    email: String
    city: String!
    state: String!
    zip_code: String!
    country: String
    status: Boolean
}
`