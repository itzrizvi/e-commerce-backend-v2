const { gql } = require("apollo-server-express");


module.exports = gql`

# Tax Class Based Input and Types ########################
##########################################################

type TaxClass {
    id:Int!
    zip_code:Int!
    tax_amount:Float!
    tenant_id:String!
    added_by:Staff!
}

type TaxClassPublic {
    id:Int!
    zip_code:Int!
    tax_amount:Float!
    tenant_id:String!
}

input addTaxClassInput {
    zip_code:Int!
    tax_amount:Float!
}

input GetSingleTaxClassAdminInput {
    taxClass_id:Int!
}

type GetSingleTaxClassAdminOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:TaxClass
}

input GetSingleTaxClassPublicInput {
    taxClass_id:Int!
}

type GetSingleTaxClassPublicOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:TaxClassPublic
}

type GetTaxClassList {
    message:String
    status:Boolean
    tenant_id:String
    data:[TaxClass]
}

input UpdateTaxClassInput {
    id:Int!
    zip_code:Int
    tax_amount:Float
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addTaxClass(data:addTaxClassInput):CommonOutput!
    updateTaxClass(data:UpdateTaxClassInput):CommonOutput!
}

extend type Query {
    getSingleTaxClassAdmin(query:GetSingleTaxClassAdminInput):GetSingleTaxClassAdminOutput!
    getSingleTaxClassPublic(query:GetSingleTaxClassPublicInput):GetSingleTaxClassPublicOutput!
    getTaxClassList:GetTaxClassList!
}


`;