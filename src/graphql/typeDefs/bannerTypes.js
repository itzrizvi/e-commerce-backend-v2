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
        banner_id: Int!
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
        id: Int!
        name: String
        slug: String
        status: Boolean!
        tenant_id: String
        createdAt: String
        updatedAt: String
        banner_images:[BannerImage]
    }

    type BannerImage{
        id: Int!
        banner_id: Int!
        title: String!
        image:String
        link: String
        sort_order: Int!
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    input UpdateBannerInput {
        banner_id: Int!
        name: String
        status: Boolean
    }

    input UpdateBannerImageInput {
        id: Int!
        title: String
        link: String
        sort_order: Int
        image: Upload
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

    input DeleteBannerImageInput {
        banner_id: Int!
    }


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

    extend type Mutation {
        addBanner(data: BannerInput): BannerOutput
        addBannerImage(data: BannerImageInput!): BannerImageOutput
        updateBanner(data: UpdateBannerInput):CommonOutput!
        updateBannerImage(data: UpdateBannerImageInput):CommonOutput!
        deleteBannerImage(data: DeleteBannerImageInput):CommonOutput!
    }

    extend type Query {
        getSingleBanner(query: GetSingleBannerInput):GetSingleBannerOutput!
        getBannerBySlug(query: GetSingleBannerBySlugInput):GetSingleBannerBySlugOutput!
        getAllBanners:GetAllBanners!
    }


`;
