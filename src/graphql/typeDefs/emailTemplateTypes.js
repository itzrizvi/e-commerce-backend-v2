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

type EmailHeaderFooter {
    id:Int
    name:String
    slug:String
    content:String
    type:String
    tenant_id:String
    createdAt:String
    updatedAt:String
    added_by:Staff
}

type EmailTemplate {
    id:Int
    name:String
    slug:String
    content:String
    tenant_id:String
    createdAt:String
    updatedAt:String
    emailHeader:EmailHeaderFooter
    emailFooter:EmailHeaderFooter
    added_by:Staff
}

#################################
input AddEmailTemplateListInput {
    name:String!
    email_template_id:Int
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

input GetSingleEmailTemplateListInput {
    id:Int!
}

type GetSingleEmailTemplateList {
    message:String
    status:Boolean
    tenant_id:String
    data:EmailTemplateList
}

################################

input AddEmailTempHFInput {
    name:String
    content:JSON
    type:String
}

input UpdateEmailTempHFInput {
    id:Int!
    name:String
    content:JSON
    type:String
}

input GetSingleEmailHeaderFooterInput {
    id:Int!
}

type GetSingleEmailHeaderFooterOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:EmailHeaderFooter
}

type GetEmailHeaderFooterListOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:[EmailHeaderFooter]
}

#####################################

input addEmailTemplateInput {
    name:String!
    content:JSON!
    header_id:Int!
    footer_id:Int!
}

input updateEmailTemplateInput {
    id:Int!
    name:String
    content:JSON
    header_id:Int
    footer_id:Int
}

input GetSingleEmailTemplateInput {
    id:Int!
}

type GetSingleEmailTemplateOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:EmailTemplate
}

type GetEmailTemplateList {
    message:String
    status:Boolean
    tenant_id:String
    data:[EmailTemplate]
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addEmailTemplateOnList(data:AddEmailTemplateListInput):CommonOutput!
    updateEmailTemplateOnList(data:UpdateEmailTemplateListInput):CommonOutput!
    addEmailTempHeaderFooter(data:AddEmailTempHFInput):CommonOutput!
    updateEmailTempHeaderFooter(data:UpdateEmailTempHFInput):CommonOutput!
    createEmailTemplate(data:addEmailTemplateInput):CommonOutput!
    updateEmailTemplate(data:updateEmailTemplateInput):CommonOutput!
}

extend type Query {
    getAllEmailTemplateList:GetAllEmailTemplateList!
    getSingleEmailTemplateList(query:GetSingleEmailTemplateListInput):GetSingleEmailTemplateList!
    getSingleEmailTempHeaderFooter(query:GetSingleEmailHeaderFooterInput):GetSingleEmailHeaderFooterOutput!
    getEmailTempHeaderFooterList:GetEmailHeaderFooterListOutput!
    getSingleEmailTemplate(query:GetSingleEmailTemplateInput):GetSingleEmailTemplateOutput!
    getEmailTemplateList:GetEmailTemplateList!
}


`;