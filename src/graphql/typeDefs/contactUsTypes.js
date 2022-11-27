const { gql } = require("apollo-server-express");


module.exports = gql`

# Contact us Based Input and Types ########################
##########################################################

type ContactUsMedia {
    id:Int
    image:String
    tenant_id:String
}

type ContactUs {
    id:Int!
    name:String
    email:String
    phone:String
    subject:String
    message:String
    tenant_id:String
    isRead:Boolean
    images:[ContactUsMedia]
}

input ContactUsInput {
    name:String!
    email:String!
    phone:String
    subject:String!
    message:String!
    images:[Upload]
}

input GetSingleContactMessageInput {
    id:Int!
}

type GetSingleContactMessageOutput {
    message:String
    status:Boolean
    tenant_id:String
    data: ContactUs
}

type GetContactMessageList {
    message:String
    tenant_id:String
    status:Boolean
    data:[ContactUs]
}

type GetUnreadMsgList {
    message:String
    tenant_id:String
    status:Boolean
    data:[ContactUs]
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createContactUs(data:ContactUsInput):CommonOutput!
}

extend type Query {
    getSingleContactUsMsg(query:GetSingleContactMessageInput):GetSingleContactMessageOutput!
    getContactUsMsgList:GetContactMessageList!
    getContactUsUnreadMsgList:GetUnreadMsgList!
}


`;