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

input UpdateCustomerGroupInput {
    customer_group_uuid:UUID!
    customer_group_name:String
    customergroup_description:String
    customergroup_sortorder:Int
    customergroup_status:Boolean
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createCustomerGroup(data: CreateCustomerGroupInput):CommonOutput!
    updateCustomerGroup(data: UpdateCustomerGroupInput):CommonOutput!
}

# extend type Query {

# }


`;