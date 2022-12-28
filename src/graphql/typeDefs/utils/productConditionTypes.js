const { gql } = require("apollo-server-express");

module.exports = gql`
    input ProductConditionInput{
        name: String!
        status:Boolean!
    }

    input UpdateProductConditionInput{
        id: Int!
        name: String
        status:Boolean
    }

    input GetSingleProductConditionInput {
        id:Int!
    }

    type GetAllProductConditionOutput{
        message:String
        status:Boolean
        data: [ProductCondition]
    }

    type GetSingleProductConditionOutput{
        message:String
        status:Boolean
        data: ProductCondition
    }
    
    type ProductCondition{
        id: Int
        name: String
        slug: String
        status:Boolean
        createdAt:String
        updatedAt:String
    }

    extend type Mutation {
        addProductCondition(data: ProductConditionInput): CommonOutput! 
        updateProductCondition(data: UpdateProductConditionInput): CommonOutput!
    } 

    extend type Query {
        getAllProductCondition: GetAllProductConditionOutput!
        getSingleProductCondition(query: GetSingleProductConditionInput):GetSingleProductConditionOutput!
    }
`;