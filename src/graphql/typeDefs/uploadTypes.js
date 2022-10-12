const { gql } = require("apollo-server-express");

module.exports = gql`
    extend type Mutation {
        singleUpload(file: Upload!): SuccessMessage
        multipleUpload(file: [Upload]!): SuccessMessage
        deleteSingle(name: String!): SuccessMessage
        deleteMultiple(names: [String]!): SuccessMessage
    }
    type SuccessMessage {
        message: String,
    }
`;
