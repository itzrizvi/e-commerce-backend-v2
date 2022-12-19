const { gql } = require("apollo-server-express");


module.exports = gql`

# Dashboard Based Input and Types ########################
##########################################################


type GetDashboardAnyalytics {
    message:String
    tenant_id:String
    status:Boolean
    totalCustomer:Int
    newCustomer:Int
    verifiedCustomer:Int
    orderCount:Int
    totalShippedOrder:Int
    todayShippedOrder:Int
    shippingInProgress:Int
    newOrderCount:Int
    totalQuotes:Int
    todayQuotes:Int
    recentPurchaseOrders:[PurchaseOrderList]
    recentOrders:[OrderList]
    recentQuotes:[SubmittedQuote]
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getDashboardAnalytics:GetDashboardAnyalytics!
}


`;