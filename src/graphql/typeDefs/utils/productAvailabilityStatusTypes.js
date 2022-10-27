const { gql } = require("apollo-server-express");


module.exports = gql`
    input ProductAvailabilityStatusInput{
        name: String!
    }

    input UpdateProductAvailabilityStatusInput{
        id: Int!,
        name: String!
    }

    input GetSingleProductAvailabilityStatusInput {
        id:Int!
    }

    type GetAllProductAvailabilityStatusOutput{
        message:String!
        status:Boolean!
        data: [ProductCondition]
    }

    type GetSingleProductAvailabilityStatusOutput{
        message:String!
        status:Boolean!
        data: ProductCondition
    }
    
    type ProductCondition{
        id: Int!
        name: String!
        slug: String!
        createdAt:String!
        updatedAt:String!
    }

    extend type Mutation {
        addProductAvailabilityStatus(data: ProductAvailabilityStatusInput): CommonOutput! 
        updateProductAvailabilityStatus(data: UpdateProductAvailabilityStatusInput): CommonOutput!
    } 

    extend type Query {
        getAllProductAvailabilityStatus: GetAllProductAvailabilityStatusOutput!
        getSingleProductAvailabilityStatus(query: GetSingleProductAvailabilityStatusInput):GetSingleProductAvailabilityStatusOutput!
    }
`;