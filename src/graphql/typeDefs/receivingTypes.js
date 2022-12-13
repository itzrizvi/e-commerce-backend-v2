const { gql } = require("apollo-server-express");


module.exports = gql`
    
    type ReceivingProduct {
        id:Int
        status:String
        tenant_id:String
        purchaseOrder:PurchaseOrder
        added_by:Staff
    }

    type ReceivedProductsHistory {
        id:Int
        receiving_id:Int
        receiving_item_id:Int
        product_id:Int
        received_quantity:Int
        received_by:Staff
        tenant_id:String
        createdAt:String
        updatedAt:String
    }

    type ReceivingItem {
        id:Int
        receiving_id:Int
        product:ProductForList
        receivinghistory:[ReceivedProductsHistory]
        serials:[ProductSerial]
        quantity:Int
        price:Float
        totalPrice:Float
        received_quantity:Int
        remaining_quantity:Int
        tenant_id:String
        createdAt:String
        updatedAt:String
    }

    type ReceivingProductSingle {
        id:Int
        status:String
        tenant_id:String
        receivingitems:[ReceivingItem]
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
        receivedProducts:JSON
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