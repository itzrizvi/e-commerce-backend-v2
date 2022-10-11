const { gql } = require("apollo-server-express");

module.exports = gql`
    extend type Mutation {
        singleUpload(file: Upload!): SuccessMessage
        multipleUpload(file: [Upload]!): SuccessMessage
        deleteSingle(folder: String, key: String!, ext: String!): SuccessMessage
        deleteMultiple(keyExt: [keyExt]!): SuccessMessage
    }
    type SuccessMessage {
        message: String,
    }

    input keyExt {
        folder: String,
        key: String!,
        ext: String!
    }
`;
