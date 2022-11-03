const { gql } = require("apollo-server-express");


module.exports = gql`

# Admin Staff Based Input and Queries ################################################
######################################################################################

type AdminAuthPayload {
    authToken:String
    id:String
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

input AdminSignUpInput {
    first_name:String!
    last_name:String!
    email:String!
    role_ids:JSON!
    userStatus:Boolean!
    sendEmail:Boolean!
}

type AdminSignUpOutput {
    message:String
    status:Boolean
    tenant_id:String
}


type Staff {
    id:Int
    first_name:String
    last_name:String
    email:String
    image:String
    roles:[Role]
    user_status:Boolean
    email_verified:Boolean
}

type GetALLStaffOutput {
    data:[Staff]
    isAuth:Boolean
    message:String
    status:Boolean
}

input UpdateAdminInput {
    id:Int!
    first_name:String
    last_name:String
    role_ids:JSON
    user_status:Boolean
    sendEmail:Boolean!
}

input GetSingleAdminInput {
    id:Int!
}

type GetSingleAdminOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:Staff
}

input AdminPasswordChangeInput {
    id:Int!
    oldPassword:String!
    newPassword:String!
}

input SetPasswordInput {
    codeHashed:String!
    verificationCode:Int!
    newPassword:String!
    confirmPassword:String!
}

input ResetPasswordInput {
    email:String!
    permissionName:String!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    adminSignUp(data: AdminSignUpInput): AdminSignUpOutput!
    adminSignIn(email: String!, password: String!): AdminAuthPayload!
    adminUpdate(data: UpdateAdminInput, file:Upload): CommonOutput!
    adminPasswordChange(data: AdminPasswordChangeInput): CommonOutput!
    setPassword(data:SetPasswordInput): CommonOutput!
    resetPassword(data:ResetPasswordInput): CommonOutput!
}

extend type Query {
    getAllStaff: GetALLStaffOutput!
    getSingleAdmin(query: GetSingleAdminInput): GetSingleAdminOutput!
}


`;