const { gql } = require('apollo-server-express');


const typeDefs = gql`

scalar JSON
scalar JSONObject
scalar UUID

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


type Query {
    getAllRoles(query: RoleInput): RoleOutput
}

type Mutation{
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
    verifyEmail(data: VerifyEmailInput): VerifyEmailOutput!
    resendVerificationEmail(data: resendVerificationEmailInput):resendVerifyEmailOutput!
    forgotPassInit(data: ForgotPassInitInput):ForgotPassInitOutput!
    forgotPassCodeMatch(data: ForgotPassCodeMatchInput):ForgotPassCodeMatchOutput!
    forgotPassFinal(data: ForgotPassFinalInput):ForgotPassFinalOutput!
}
`;


module.exports = typeDefs;

// createRole(data: RoleInput): Role