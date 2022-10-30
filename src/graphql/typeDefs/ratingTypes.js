const { gql } = require("apollo-server-express");


module.exports = gql`
    type Rating {
        rating_id: UUID
        rating_title:String
        rating_description:String
        rating:Float
        createdAt:String
        updatedAt:String
        tenant_id:String
    }

    type User {
        uid:String
        first_name:String
        last_name:String
        email:String
        email_verified:Boolean
        user_status:Boolean
        updatedAt:String
        createdAt:String
    }

    type Product{
        product_id:UUID
        product_name:String
        product_slug:String
        product_description:JSON
        product_image:String
        product_sku:String
        product_regular_price:Float
        product_sale_price:Float
        product_status:String
    }

    type RatingOutput{
        message: String
        status:Boolean
        data: Rating
    }

    input CreateRoleInput{
        user_id: UUID!
        product_id: UUID!
        rating: Float!
        title: String!
        description: String
    }

    input GetAllRatingByUserInput{
        user_id: UUID!
    }
    
    input GetAllRatingByProductInput{
        product_id: UUID!
    }

    input GetSingleRatingInput{
        rating_id: UUID!
    }

    type CreateRatingOutput {
        tenant_id:String
        message:String
        status:Boolean
    }

    type getAllRatingOutput{
        message:String
        status:Boolean
        data: [Rating]
    }

    type getSingleRatingOutput{
        message:String
        status:Boolean
        data: Rating
    }

    extend type Mutation {
        createRating(data: CreateRoleInput): CreateRatingOutput!
    }

    extend type Query {
        getAllRatingByUser(query: GetAllRatingByUserInput): getAllRatingOutput!
        getAllRatingByProduct(query: GetAllRatingByProductInput): getAllRatingOutput!
        getSingleRating(query: GetSingleRatingInput): getSingleRatingOutput!
    }
`;