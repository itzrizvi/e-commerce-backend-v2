const { gql } = require("apollo-server-express");


module.exports = gql`

# User Based Input and Queries #######################################################
######################################################################################


type User {
    id:String
    first_name:String
    last_name:String
    email:String
    phone:String
    fax:String
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
    phone:String
    fax:String
    image:String
    status:Boolean
}

input UserInput {
    first_name:String!
    last_name:String
    email:String!
    password:String!
    phone:String
    fax:String
}

input UserProfileUpdateInput {
    first_name:String
    last_name:String
    oldPassword:String
    newPassword:String
    phone:String
    fax:String
    image:Upload
}

type UserAuthOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:AuthPayload
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    userSignUp(data: UserInput): UserAuthOutput!
    userSignIn(email: String!, password: String!): UserAuthOutput!
    userProfileUpdate(data:UserProfileUpdateInput): CommonOutput!
}


`;