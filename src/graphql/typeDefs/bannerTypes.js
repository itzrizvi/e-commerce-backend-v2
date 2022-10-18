const { gql } = require("apollo-server-express");

module.exports = gql`

# Banner Slider Based Input and Queries ##############################################
######################################################################################


    input BannerInput{
        banner_name: String!
        banner_status: Boolean!
    }

    type BannerOutput {
        message: String!
        status: Boolean!
        data: Banner
    }

    input BannerImageInput{
        banner_id: UUID!
        title: String!
        link: String
        sort_order: Int!
        image: Upload!
    }

    type BannerImageOutput {
        message: String!
        status: Boolean!
        data: BannerImage
    }

    type Banner{
        banner_uuid: UUID!
        banner_name: String
        banner_slug: String
        banner_status: Boolean!
        tenant_id: Int
    }

    type BannerImage{
        banner_uuid: UUID!
        banner_id: UUID!
        title: String!
        link: String
        sort_order: Int!
    }


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

    extend type Mutation {
        addBanner(data: BannerInput): BannerOutput
        addBannerImage(data: BannerImageInput!): BannerImageOutput
    }

`;
