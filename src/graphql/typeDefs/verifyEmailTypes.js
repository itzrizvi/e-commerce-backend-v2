const { gql } = require("apollo-server-express");


module.exports = gql`

# Verify Email Based Input and Queries ###############################################
######################################################################################

input VerifyEmailInput {
    verificationCode:Int!
}

type VerifyEmailOutput {
    email:String
    emailVerified:Boolean
    isAuth:Boolean
    message:String
    status:Boolean
}

input resendVerificationEmailInput {
    email:String!
}

type resendVerifyEmailOutput {
    message:String
    status:Boolean
    email:String
}

# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    verifyEmail(data: VerifyEmailInput): VerifyEmailOutput!
    resendVerificationEmail(data: resendVerificationEmailInput):resendVerifyEmailOutput!
}


`;