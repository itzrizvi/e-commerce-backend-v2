const { gql } = require("apollo-server-express");


module.exports = gql`

# Payment Method Based Input and Types ########################
###############################################################

type PaymentMethod {
    id:Int!
    name:String!
    slug:String!
    description:String!
    status:Boolean!
    tenant_id:String!
    added_by:Staff!
}

input addPaymentMethodInput {
    name:String!
    description:String!
    status:Boolean!
}

input GetSinglePaymentMethodInput {
    paymentMethod_id:Int!
}

type GetSinglePaymentMethodOutPut {
    message:String
    status:Boolean
    tenant_id:String
    data:PaymentMethod
}





# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addPaymentMethod(data:addPaymentMethodInput):CommonOutput!
}

extend type Query {
    getSinglePaymentMethod(query:GetSinglePaymentMethodInput):GetSinglePaymentMethodOutPut!
}


`;