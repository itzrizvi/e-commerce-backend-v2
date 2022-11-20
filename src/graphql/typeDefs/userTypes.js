const { gql } = require("apollo-server-express");


module.exports = gql`

# User Based Input and Queries #######################################################
######################################################################################


type User {
    id:String
    first_name:String
    last_name:String
    email:String
    email_verified:Boolean
    user_status:Boolean
    image:String
    updatedAt:String
    createdAt:String
}

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
    image:String
    status:Boolean
}

input UserInput {
    first_name:String!
    last_name:String
    email:String!
    password:String!
}

input UserProfileUpdateInput {
    first_name:String
    last_name:String
    oldPassword:String
    newPassword:String
    image:Upload
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
    userProfileUpdate(data:UserProfileUpdateInput): CommonOutput!
}


`;