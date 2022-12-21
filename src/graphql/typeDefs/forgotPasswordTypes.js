const { gql } = require("apollo-server-express");


module.exports = gql`

# Forgot Password Based Input and Queries ############################################
######################################################################################

input ForgotPassInitInput {
    email:String!
}

type ForgotPassInitOutput {
    message:String
    email:String
    status:Boolean
}

input ForgotPassCodeMatchInput {
    email:String!
    forgotPassVerifyCode:Int!
}

type ForgotPassCodeMatchOutput {
    message:String
    email:String
    status:Boolean
}

input ForgotPassFinalInput {
    codeHashed:String!
    forgotPassVerifyCode:Int!
    newPassword:String!
    confirmPassword:String!
}

type ForgotPassFinalOutput {
    email:String
    message:String
    status:Boolean
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    forgotPassInit(data: ForgotPassInitInput):ForgotPassInitOutput!
    forgotPassCodeMatch(data: ForgotPassCodeMatchInput):ForgotPassCodeMatchOutput!
    forgotPassFinal(data: ForgotPassFinalInput):ForgotPassFinalOutput!
}

`;