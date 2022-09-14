const { gql } = require('apollo-server-express');


const typeDefs = gql`
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
    verificationCode:Int!
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
    email:String!
}

type VerifyEmailOutput {
    email:String!
    emailVerified:Boolean!
    isAuth:Boolean!
    message:String!
}


type Query {
    getAllRoles(query: RoleInput): RoleOutput
}

type Mutation{
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
    verifyEmail(data: VerifyEmailInput):VerifyEmailOutput
}
`;


module.exports = typeDefs;

// createRole(data: RoleInput): Role