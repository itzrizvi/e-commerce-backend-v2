const { gql } = require("apollo-server-express");


module.exports = gql`

# Customer Group Based Input and Queries #############################################
######################################################################################

input CreateCustomerGroupInput {
    customer_group_name:String!
    customergroup_description:String
    customergroup_sortorder:Int!
    customergroup_status:Boolean!
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createCustomerGroup(data: CreateCustomerGroupInput):CommonOutput!
}

# extend type Query {

# }


`;