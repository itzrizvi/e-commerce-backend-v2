const { gql } = require("apollo-server-express");


module.exports = gql`

# Product Attribute Based Input and Types ###############################
#########################################################################

#### ATTRIBUTE GROUP ######################

input CreateAttributeGroupInput{
    attr_group_name:String!
    attrgroup_sortorder:Int!
    attrgroup_status:Boolean!
}

input UpdateAttributeGroupInput{
    attr_group_id:UUID!
    attr_group_name:String
    attrgroup_sortorder:Int
    attrgroup_status:Boolean
}

type AttributeGroup {
    attr_group_id:UUID
    attr_group_name:String
    attr_group_slug:String
    attrgroup_sortorder:Int
    attrgroup_status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
    attributes:[Attribute]
}

type GetAllAttrGroups{
    message:String
    status:Boolean
    tenant_id:String
    data:[AttributeGroup]
}

input GetSingleAttrGroupInput{
    attr_group_id:UUID!
}

type GetSingleAttrGroup {
    message:String
    status:Boolean
    tenant_id:String
    data:AttributeGroup
}


#### ATTRIBUTE ############################

input CreateAttributeInput{
    attribute_name:String!
    attribute_status:Boolean!
    attr_group_id:UUID!
}

input UpdateAttributeInput{
    attribute_id:UUID!
    attribute_name:String
    attribute_status:Boolean
    attr_group_id:UUID
}

type Attribute {
    attribute_id:UUID
    attribute_name:String
    attribute_slug:String
    attribute_status:Boolean
    attr_group_id:UUID
    tenant_id:String
    createdAt:String
    updatedAt:String
    attribute_group:AttributeGroup
}

type GetAllAttributes {
    message:String
    status:Boolean
    tenant_id:String
    data:[Attribute]
}

input GetSingleAttributeInput{
    attribute_id:UUID!
}

type GetSingleAttribute {
    message:String
    status:Boolean
    tenant_id:String
    data:Attribute
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {

    createAttrGroup(data: CreateAttributeGroupInput):CommonOutput!
    updateAttrGroup(data: UpdateAttributeGroupInput):CommonOutput!

    createAttribute(data: CreateAttributeInput):CommonOutput!
    updateAttribute(data: UpdateAttributeInput):CommonOutput!
}

extend type Query {
    getAllAttrGroups: GetAllAttrGroups!
    getSingleAttrGroup(query: GetSingleAttrGroupInput): GetSingleAttrGroup!

    getAllAttributes:GetAllAttributes!
    getSingleAttribute(query: GetSingleAttributeInput):GetSingleAttribute!
}


`;