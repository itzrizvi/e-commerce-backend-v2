const { gql } = require("apollo-server-express");


module.exports = gql`

# COUPON Based Input and Queries ################################################
#################################################################################

input CreateCouponInput {
    coupon_name: String!
    coupon_code: String!
    coupon_description: String
    coupon_type: String!
    coupon_amount: Float!
    coupon_maxamount: Float!
    coupon_minamount: Float!
    coupon_startdate: String!
    coupon_enddate: String!
    coupon_status: Boolean!
    coupon_sortorder: Int!
}



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createCoupon(data:CreateCouponInput):CommonOutput!
}

# extend type Query {

# }


`;