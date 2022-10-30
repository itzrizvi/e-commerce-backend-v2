const { gql } = require("apollo-server-express");


module.exports = gql`

# User Based Input and Queries #######################################################
######################################################################################


type AuthPayload {
    authToken: String
    id:Int
    first_name:String
    last_name:String
    email:String
    message:String
    emailVerified:Boolean
    user_status:Boolean
    updatedAt:String
    createdAt:String
    status:Boolean
}

input UserInput {
    first_name:String
    last_name:String
    email:String
    password:String
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
}


`;