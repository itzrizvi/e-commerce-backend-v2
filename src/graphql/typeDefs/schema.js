const { gql } = require('apollo-server-express');


const typeDefs = gql`

scalar JSON
scalar JSONObject
scalar UUID


# User Based Input and Queries #######################################################
######################################################################################

type User {
    uid:ID,
    id:ID
    first_name:String
    last_name:String
    email:String
    password:String
}

type AuthPayload {
    authToken: String!
    uid:String!
    first_name:String!
    last_name:String!
    email:String!
    message:String!
    emailVerified:Boolean!
    updatedAt:String!
    createdAt:String!
}

type AdminAuthPayload {
    authToken:String!
    uid:String!
    first_name:String
    last_name:String
    email:String!
    message:String!
    emailVerified:Boolean!
    updatedAt:String
    createdAt:String
}

input UserInput {
    first_name:String
    last_name:String
    email:String
    password:String
}

input UserRecordInput {
    uid:ID,
    first_name:String
    last_name:String
    email:String
    password:String
}

type UserOutput {
    count: Int
    data: [User]
}



# Verify Email Based Input and Queries ###############################################
######################################################################################

input VerifyEmailInput {
    verificationCode:Int!
}

type VerifyEmailOutput {
    email:String!
    emailVerified:Boolean!
    isAuth:Boolean!
    message:String!
}

input resendVerificationEmailInput {
    email:String!
}

type resendVerifyEmailOutput {
    message:String!
    email:String!
}


# Forgot Password Based Input and Queries ############################################
######################################################################################

input ForgotPassInitInput {
    email:String!
}

type ForgotPassInitOutput {
    message:String!
    email:String!
}

input ForgotPassCodeMatchInput {
    email:String!
    forgotPassVerifyCode:Int!
}

type ForgotPassCodeMatchOutput {
    message:String!
    email:String!
}

input ForgotPassFinalInput {
    email:String!
    forgotPassVerifyCode:Int!
    newPassword:String!
    confirmPassword:String!
}

type ForgotPassFinalOutput {
    email:String!
    message:String!
}


# Role Based Input and Queries ###############################################
##############################################################################

type Role {
    uid: ID
    role: String
}

input RoleInput {
    role: String
}

input RoleRecordInput {
    uid: ID
    role: String
}

type RoleOutput {
    isAuth:Boolean
    Message: String!
    data: [Role]
    FetchedBy: String!
}

input CreateRoleInput {
    roleNo:Int!
    role:String!
}

type CreateRoleOutput {
    roleNo:Int!
    role:String!
    roleUUID:String!
    roleSlug:String!
    message:String!
}


# Category Based Input and Queries ###############################################
##################################################################################

input CategoryCreateInput {
    categoryName:String!
    categorySlug:String!
    categoryDescription:JSON
    categoryParentId:UUID
    categoryMetaTagTitle:String
    categoryMetaTagDescription:JSON
    categoryMetaTagKeywords:JSON
    categoryImage:String
    categorySortOrder:Int
    categoryStatus:Boolean
}

type CategoryCreateOutput {
    message:String!
    creategoryName:String!
    createdBy:String!
    role:String!
}


# Permission Based Input and Queries #########################################
##############################################################################

input FeaturePermissionListInput {
    featureName:String!
}
type FeaturePermissionListOutput {
    featureNameUUID:UUID!
    featureName:String!
    featureNameSlug:String!
}




# ROOT QUERIES AND MUTATIONS ###############################################
############################################################################

type Query {
    getAllRoles(query: RoleInput): RoleOutput
}

type Mutation{
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
    adminSignIn(email: String!, password: String!): AdminAuthPayload!
    verifyEmail(data: VerifyEmailInput): VerifyEmailOutput!
    resendVerificationEmail(data: resendVerificationEmailInput):resendVerifyEmailOutput!
    forgotPassInit(data: ForgotPassInitInput):ForgotPassInitOutput!
    forgotPassCodeMatch(data: ForgotPassCodeMatchInput):ForgotPassCodeMatchOutput!
    forgotPassFinal(data: ForgotPassFinalInput):ForgotPassFinalOutput!
    createRole(data: CreateRoleInput): CreateRoleOutput!
    createFeaturePermission(data: FeaturePermissionListInput):FeaturePermissionListOutput!
}
`;


module.exports = typeDefs;

// createRole(data: RoleInput): Role