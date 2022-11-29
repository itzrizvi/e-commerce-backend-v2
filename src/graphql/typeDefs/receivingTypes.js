const { gql } = require("apollo-server-express");


module.exports = gql`
    
    type ReceivingProduct {
        id:Int
        status:String
        tenant_id:String
        purchaseOrder:PurchaseOrder
        added_by:Staff
    }
    
    input GetSingleReceivingProductInput {
        id:Int!
    }

    type GetSingleReceivingProductOutput {
        message:String
        status:Boolean
        tenant_id:String
        data:ReceivingProduct
    }

    type GetReceivingProductList {
        message:String
        status:Boolean
        tenant_id:String
        data:[ReceivingProduct]
    }

    input UpdateRecevingProductInput {
        id:Int!
        status:String
        receivedProducts:JSON
    }


    extend type Mutation {
        updateReceiving(data: UpdateRecevingProductInput): CommonOutput!
    }

    extend type Query {
        getSingleReceivingProduct(query:GetSingleReceivingProductInput):GetSingleReceivingProductOutput!
        getReceivingProductList:GetReceivingProductList!
    }
`;