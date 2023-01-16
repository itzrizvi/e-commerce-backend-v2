const { gql } = require("apollo-server-express");

module.exports = gql`

# Banner Slider Based Input and Queries ##############################################
######################################################################################

    input BannerInput{
        banner_name: String!
        banner_status: Boolean!
        content: String
        layout_type:String!
    }

    type BannerOutput {
        message: String!
        status: Boolean!
        id: Int
    }

    type Banner{
        id: Int!
        name: String
        slug: String
        content: String
        layout_type:String
        status: Boolean!
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    input UpdateBannerInput {
        banner_id: Int!
        name: String!
        content: String
        layout_type:String!
        status: Boolean
    }

    input GetSingleBannerInput {
        banner_id: Int!
    }

    type GetSingleBannerOutput {
        message: String
        status: Boolean
        tenant_id: String
        data:Banner
    }

    type GetAllBanners {
        message: String
        status: Boolean
        tenant_id: String
        data:[Banner]
    }

    input GetSingleBannerBySlugInput {
        banner_slug: String!
    }

    type GetSingleBannerBySlugOutput {
        message: String
        status: Boolean
        tenant_id: String
        data:Banner
    }


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

    extend type Mutation {
        addBanner(data: BannerInput): BannerOutput
        updateBanner(data: UpdateBannerInput):CommonOutput!
    }

    extend type Query {
        getSingleBanner(query: GetSingleBannerInput):GetSingleBannerOutput!
        getBannerBySlug(query: GetSingleBannerBySlugInput):GetSingleBannerBySlugOutput!
        getAllBanners:GetAllBanners!
    }


`;
