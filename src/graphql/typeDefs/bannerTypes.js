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

    input BannerItemInput{
        banner_id: Int!
        title: String!
        sub_title: String
        link: String
        price: Float
        sale_price: Float
        button_text: String
        option_1: String
        option_2: String
        sort_order: Int!
        image: Upload!
    }

    type BannerItemOutput {
        message: String!
        status: Boolean!
        data: BannerItem
    }

    type Banner{
        id: Int!
        name: String
        slug: String
        status: Boolean!
        tenant_id: String
        createdAt: String
        updatedAt: String
        banner_items:[BannerItem]
    }

    type BannerItem{
        id: Int!
        banner_id: Int!
        title: String!
        sub_title: String
        link: String
        price: Float
        sale_price: Float
        button_text: String
        option_1: String
        option_2: String
        image: String
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

    input UpdateBannerItemInput {
        id: Int!
        banner_id: Int!
        title: String!
        sub_title: String
        link: String
        price: Float
        sale_price: Float
        button_text: String
        option_1: String
        option_2: String
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

    input DeleteBannerItemInput {
        banner_id: Int!
    }


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

    extend type Mutation {
        addBanner(data: BannerInput): BannerOutput
        addBannerItem(data: BannerItemInput!): BannerItemOutput
        updateBanner(data: UpdateBannerInput):CommonOutput!
        updateBannerItem(data: UpdateBannerItemInput):CommonOutput!
        deleteBannerItem(data: DeleteBannerItemInput):CommonOutput!
    }

    extend type Query {
        getSingleBanner(query: GetSingleBannerInput):GetSingleBannerOutput!
        getBannerBySlug(query: GetSingleBannerBySlugInput):GetSingleBannerBySlugOutput!
        getAllBanners:GetAllBanners!
    }


`;
