const { gql } = require("apollo-server-express");


module.exports = gql`

# Report Based Input and Types ###########################
##########################################################

type OrderListReportOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:[OrderAdmin]
}

input GetSingleOrderReportInput {
    order_id:Int!
}

type GetSingleOrderReportOutput {
    message:String
    status:Boolean
    tenant_id:String
    data:OrderAdmin
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Query {
    getOrderListReport:OrderListReportOutput!
    getSingleOrderReport(query:GetSingleOrderReportInput):GetSingleOrderReportOutput!
}


`;