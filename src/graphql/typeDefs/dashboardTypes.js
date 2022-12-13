const { gql } = require("apollo-server-express");


module.exports = gql`

# Dashboard Based Input and Types ########################
##########################################################


type GetDashboardAnyalytics {
    orderCount:Int
    customerCount:Int
    todayProductSoldCount:Int
    revenueCount:Int
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getDashboardAnalytics:GetDashboardAnyalytics!
}


`;