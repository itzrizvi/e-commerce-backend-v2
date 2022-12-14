const { gql } = require("apollo-server-express");


module.exports = gql`
    type Rating {
        id: Int
        rating_description:String
        rating:Float
        product:ProductForList
        createdAt:String
        updatedAt:String
        tenant_id:String
        ratedBy:Customer
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

    type GetTopRatedProducts {
        message:String
        status:Boolean
        tenant_id:String
        data:[ProductForList]
    }

    input GetRatingsByUserInput {
        user_id:Int!
    }

    type GetRatingsByUserOutput {
        message:String
        status:Boolean
        tenant_id:String
        data: [Rating]
    }

    extend type Mutation {
        createRating(data: CreateRatingInput): CreateRatingOutput!
    }

    extend type Query {
        getAllRatingByUser: getAllRatingOutput!
        getAllRatingByProduct(query: GetAllRatingByProductInput): getAllRatingOutput!
        getSingleRating(query: GetSingleRatingInput): getSingleRatingOutput!
        getTopRatedProducts: GetTopRatedProducts!
        getRatingsByUserID(query:GetRatingsByUserInput):GetRatingsByUserOutput!
    }
`;