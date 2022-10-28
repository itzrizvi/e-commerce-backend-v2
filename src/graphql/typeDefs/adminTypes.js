const { gql } = require("apollo-server-express");


module.exports = gql`

# Admin Staff Based Input and Queries ################################################
######################################################################################

type AdminAuthPayload {
    authToken:String
    uid:String
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
    roleUUID:JSON!
    userStatus:Boolean!
    sendEmail:Boolean!
}

type AdminSignUpOutput {
    message:String
    status:Boolean
    tenant_id:String
}


type Staff {
    uid:UUID
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
    uid:UUID!
    first_name:String
    last_name:String
    password:String
    roleUUID:JSON
    user_status:Boolean
    sendEmail:Boolean!
}

input GetSingleAdminInput {
    uid:UUID!
}

type GetSingleAdminOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:Staff
}

input AdminPasswordChangeInput {
    uid:UUID!
    oldPassword:String!
    newPassword:String!
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    adminSignUp(data: AdminSignUpInput): AdminSignUpOutput!
    adminSignIn(email: String!, password: String!): AdminAuthPayload!
    adminUpdate(data: UpdateAdminInput, file:Upload): CommonOutput!
    adminPasswordChange(data: AdminPasswordChangeInput): CommonOutput!
}

extend type Query {
    getAllStaff: GetALLStaffOutput!
    getSingleAdmin(query: GetSingleAdminInput): GetSingleAdminOutput!
}


`;