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

    input UpdateCouponInput {
        coupon_uuid: UUID!
        coupon_name: String
        coupon_code: String
        coupon_description: String
        coupon_type: String
        coupon_amount: Float
        coupon_maxamount: Float
        coupon_minamount: Float
        coupon_startdate: String
        coupon_enddate: String
        coupon_status: Boolean
        coupon_sortorder: Int
    }

    type Coupon {
        coupon_uuid: UUID
        coupon_name: String
        coupon_code: String
        coupon_description: String
        coupon_type: String
        coupon_amount: Float
        coupon_maxamount: Float
        coupon_minamount: Float
        coupon_startdate: String
        coupon_enddate: String
        coupon_status: Boolean
        coupon_sortorder: Int
        tenant_id: String
        createdAt: String
        updatedAt: String
    }

    input GetSingleCouponInput {
        coupon_uuid: UUID!
    }

    type GetSingleCouponOutput {
        message: String
        status: Boolean
        tenant_id: String
        data: Coupon
    }

    input GetSingleCouponByCodeInput {
        coupon_code: String!
    }

    type GetSingleCouponByCodeOutput {
        message: String
        status: Boolean
        tenant_id: String
        data: Coupon
    }



# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

    extend type Mutation {
        createCoupon(data:CreateCouponInput):CommonOutput!
        updateCoupon(data:UpdateCouponInput):CommonOutput!
    }

    extend type Query {
        getSingleCoupon(query:GetSingleCouponInput):GetSingleCouponOutput!
        getSingleCouponByCode(query:GetSingleCouponByCodeInput):GetSingleCouponByCodeOutput!
    }


`;