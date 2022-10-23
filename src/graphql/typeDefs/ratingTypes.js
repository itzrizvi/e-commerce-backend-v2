const { gql } = require("apollo-server-express");


module.exports = gql`
    type Rating {
        rating_uuid: UUID
        user: User
        product: Product
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
        emailVerified:Boolean
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
        user_uuid: UUID!
        product_uuid: UUID!
        rating: Float!
        title: String!
        description: String
    }

    input GetAllRatingInput{
        user_uuid: UUID
        product_uuid: UUID
    }

    type CreateRatingOutput {
        tenant_id:String
        message:String
        status:Boolean
    }

    type getAllRatingOutput{
        message:String
        status:Boolean
        data: Rating
    }

    extend type Mutation {
        createRating(data: CreateRoleInput): CreateRatingOutput!
    }

    extend type Query {
        getAllRating(query: GetAllRatingInput): Rating!
    }
`;