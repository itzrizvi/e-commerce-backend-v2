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




# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createContactUs(data:ContactUsInput):CommonOutput!
}

# extend type Query {

# }


`;