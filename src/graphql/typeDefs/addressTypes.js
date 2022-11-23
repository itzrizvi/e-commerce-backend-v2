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
    type: String!
    status: Boolean
    updatedAt:String
    createdAt:String
}

input Address{
    parent_id: Int!
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
    isDefault:Boolean
}

input UpdateAddress{
    id: Int
    parent_id: Int!
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
    isDefault:Boolean
    isNew:Boolean
}

type AddressList {
    id:Int
    ref_id:Int
    ref_model:String
    address1: String
    address2: String
    phone: String
    fax: String
    email: String
    city: String
    state: String
    zip_code: String
    country: String
    type:String
    status: Boolean
    tenant_id:String
}

input GetAdressListByCustomerIDInput{
    customer_id:Int!
}

type GetAdressListByCustomerIDOutput{
    message:String
    tenant_id:String
    status:Boolean
    shippingDefaultID:Int
    billingDefaultID:Int
    data:[AddressList]
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getAddressListByCustomerID(query:GetAdressListByCustomerIDInput):GetAdressListByCustomerIDOutput!
}
`