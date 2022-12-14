const { gql } = require("apollo-server-express");


module.exports = gql`

# Dashboard Based Input and Types ########################
##########################################################


type GetDashboardAnyalytics {
    message:String
    tenant_id:String
    status:Boolean
    orderCount:Int
    todayProductSoldCount:Int
    todayProductPendingCount:Int
    todayOrderPendingCount:Int
    todayDeliveredOrderCount:Int
    customerCount:Int
    revenueCount:Int
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getDashboardAnalytics:GetDashboardAnyalytics!
}


`;