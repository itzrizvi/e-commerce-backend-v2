const { gql } = require("apollo-server-express");


module.exports = gql`
    type Rating {
        id: Int
        rating_description:String
        rating:Float
        createdAt:String
        updatedAt:String
        tenant_id:String
    }

    type User {
        id:String
        first_name:String
        last_name:String
        email:String
        email_verified:Boolean
        user_status:Boolean
        updatedAt:String
        createdAt:String
    }

    type Product{
        product_id:Int
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

    input CreateRatingInput{
        product_id: Int!
        rating: Float!
        description: String
    }
    
    input GetAllRatingByProductInput{
        product_id: Int!
    }

    input GetSingleRatingInput{
        rating_id: Int!
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
        createRating(data: CreateRatingInput): CreateRatingOutput!
    }

    extend type Query {
        getAllRatingByUser: getAllRatingOutput!
        getAllRatingByProduct(query: GetAllRatingByProductInput): getAllRatingOutput!
        getSingleRating(query: GetSingleRatingInput): getSingleRatingOutput!
    }
`;