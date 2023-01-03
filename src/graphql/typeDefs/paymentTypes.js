const { gql } = require("apollo-server-express");


module.exports = gql`

# Payment Method Based Input and Types ########################
###############################################################

type PaymentMethod {
    id:Int
    name:String
    description:String
    status:Boolean
    tenant_id:String
    added_by:Staff
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

input UpdatePaymentMethodInput {
    id:Int!
    name:String
    description:String
    status:Boolean
}

type GetPaymentMethodListAdmin {
    message:String
    status:Boolean
    tenant_id:String
    data:[PaymentMethod]
}

type PaymentMethodPublic {
    id:Int!
    name:String!
    description:String!
    status:Boolean!
    isDefault: Boolean
    tenant_id:String!
}

type GetPaymentMethodListPublic {
    message:String
    status:Boolean
    tenant_id:String
    data:[PaymentMethodPublic]
}




# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addPaymentMethod(data:addPaymentMethodInput):CommonOutput!
    updatePaymentMethod(data:UpdatePaymentMethodInput):CommonOutput!
}

extend type Query {
    getSinglePaymentMethod(query:GetSinglePaymentMethodInput):GetSinglePaymentMethodOutPut!
    getPaymentMethodListAdmin:GetPaymentMethodListAdmin!
    getPaymentMethodListPublic:GetPaymentMethodListPublic!
}


`;