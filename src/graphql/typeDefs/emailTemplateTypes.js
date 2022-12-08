const { gql } = require("apollo-server-express");


module.exports = gql`

# Email Template Based Input and Types ###################
##########################################################

type EmailTemplateList {
    id:Int
    email_template_id:Int
    name:String
    slug:String
    tenant_id:String
    createdAt:String
    updatedAt:String
    added_by:Staff
}


input AddEmailTemplateListInput {
    name:String!
}

input UpdateEmailTemplateListInput {
    id:Int!
    email_template_id:Int
    name:String
}

type GetAllEmailTemplateList {
    message:String
    status:Boolean
    tenant_id:String
    data:[EmailTemplateList]
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addEmailTemplateOnList(data:AddEmailTemplateListInput):CommonOutput!
    updateEmailTemplateOnList(data:UpdateEmailTemplateListInput):CommonOutput!
}

extend type Query {
    getAllEmailTemplateList:GetAllEmailTemplateList!
}


`;