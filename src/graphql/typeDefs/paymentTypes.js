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
    created_by:Staff!
}

input addPaymentMethodInput {
    name:String!
    description:String!
    status:Boolean!
}





# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addPaymentMethod(data:addPaymentMethodInput):CommonOutput!
}

# extend type Query {

# }


`;