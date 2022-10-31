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
    id:Int!
    customer_group_name:String
    customergroup_description:String
    customergroup_sortorder:Int
    customergroup_status:Boolean
}

type CustomerGroup {
    id:Int
    customer_group_name:String
    customer_group_slug:String
    customergroup_description:String
    customergroup_sortorder:Int
    customergroup_status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type GetAllCustomerGroupsOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[CustomerGroup]
}

input GetSingleCustomerGroupInput {
    customer_group_id:Int!
}

type GetSingleCustomerGroupOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:CustomerGroup
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createCustomerGroup(data: CreateCustomerGroupInput):CommonOutput!
    updateCustomerGroup(data: UpdateCustomerGroupInput):CommonOutput!
}

extend type Query {
    getAllCustomerGroups:GetAllCustomerGroupsOutput!
    getSingleCustomerGroup(query: GetSingleCustomerGroupInput):GetSingleCustomerGroupOutput!
}`;