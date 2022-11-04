const { gql } = require("apollo-server-express");


module.exports = gql`

# Payment Based Input and Types ###############################
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





# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

# extend type Mutation {

# }

# extend type Query {

# }


`;