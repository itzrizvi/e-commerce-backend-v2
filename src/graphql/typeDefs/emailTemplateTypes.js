const { gql } = require("apollo-server-express");


module.exports = gql`

# Email Template Based Input and Types ###################
##########################################################



input AddEmailTemplateListInput {
    name:String!
}

input UpdateEmailTemplateListInput {
    id:Int!
    email_template_id:Int
    name:String
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addEmailTemplateOnList(data:AddEmailTemplateListInput):CommonOutput!
    updateEmailTemplateOnList(data:UpdateEmailTemplateListInput):CommonOutput!
}

# extend type Query {

# }


`;