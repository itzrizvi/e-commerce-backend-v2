const { gql } = require("apollo-server-express");


module.exports = gql`
    
    type ReceivingProduct {
        id:Int
        status:String
        tenant_id:String
        purchaseOrder:PurchaseOrder
        added_by:Staff
    }

    type ReceivingProductSingle {
        id:Int
        status:String
        tenant_id:String
        poProducts:[POProductList]
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
        data:ReceivingProductSingle
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
        receivingProducts:JSON
    }

    type HistoryProducts {
        product:ProductForList
        quantity:Int
        recieved_quantity:Int
        serials:[String]
    }

    type HistoryData {
        products:[HistoryProducts]
        status:String
    }

    type ReceivingHistory {
        id:Int
        data:HistoryData
        receiving_id:Int
        status:String
        tenant_id:String
        createdAt:String
        updatedAt:String
        activity_by:Staff
    }

    input GetReceivingHistoryInput {
        receiving_id:Int!
    }

    type GetReceivingHistoryOutput {
        message:String
        status:Boolean
        tenant_id:String
        data:[ReceivingHistory]
    }


    extend type Mutation {
        updateReceiving(data: UpdateRecevingProductInput): CommonOutput!
    }

    extend type Query {
        getSingleReceivingProduct(query:GetSingleReceivingProductInput):GetSingleReceivingProductOutput!
        getReceivingProductList:GetReceivingProductList!
        getReceivingHistory(query:GetReceivingHistoryInput):GetReceivingHistoryOutput!
    }
`;