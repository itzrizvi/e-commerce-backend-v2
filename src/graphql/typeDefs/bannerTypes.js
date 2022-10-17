const { gql } = require("apollo-server-express");

module.exports = gql`
    extend type Mutation {
        addBanner(data: BannerInput): BannerOutput
    }

    input BannerInput{
        banner_name: String!
        banner_status: Boolean!
        banner_image: [BannerImageInput]!
    }

    input BannerImageInput{
        title: String!
        link: String
        sort_order: Int!
        image: Upload!
    }

    type BannerOutput {
        message: String!
        status: Boolean!
    }

    type Banner{
        banner_uuid: UUID
    }
`;
