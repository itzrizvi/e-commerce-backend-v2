const { gql } = require("apollo-server-express");


module.exports = gql`

# Email Template Based Input and Types ###################
##########################################################



input AddEmailTemplateListInput {
    name:String!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    addEmailTemplateOnList(data:AddEmailTemplateListInput):CommonOutput!
}

# extend type Query {

# }


`;