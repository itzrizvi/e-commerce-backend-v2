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
    data: [Role]
}

type User {
    uid:ID,
    id:ID
    first_name:String
    last_name:String
    email:String
    password:String
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


type Query {
    user(query: UserInput): UserOutput
    role(query: RoleInput): RoleOutput
}

type Mutation{
    createUser(data: UserInput):UserOutput
    createRole(data: RoleInput): Role
}
`;


module.exports = typeDefs;