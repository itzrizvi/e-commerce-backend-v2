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
    isDefault: Boolean
    countryCode:Country
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
    country:String
    countryCode:Country
    type:String
    isDefault:Boolean
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

type State {
    state: String,
    abbreviation: String
}

type StateListOutput{
    message:String
    tenant_id:String
    status:Boolean
    data: [State]
}

type Country {
    name: String
    code: String
    status: Boolean
}

type CountryListOutput{
    message:String
    tenant_id:String
    status:Boolean
    data: [Country]
}

input CountryCode{
    code: String!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getAddressListByCustomerID(query:GetAdressListByCustomerIDInput):GetAdressListByCustomerIDOutput!
    getStateList(query: CountryCode):StateListOutput!
    getCountryList:CountryListOutput!
}
`;
