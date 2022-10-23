const { gql } = require('apollo-server-express');
// All Type Defs
const uploadTypeDefs = require("../typeDefs/uploadTypes");
const bannerTypes = require("../typeDefs/bannerTypes");
const userTypeDefs = require("./userTypes");
const adminTypeDefs = require("./adminTypes");
const verifyEmailTypeDefs = require("./verifyEmailTypes");
const forgotPasswordTypeDefs = require("./forgotPasswordTypes");
const roleTypeDefs = require("./roleTypes");
const rolesPermissionTypeDefs = require("./rolesPermissionTypes");
const brandTypeDefs = require("./brandTypes");
const categoryTypeDefs = require("./categoryTypes");
const attributeTypeDefs = require("./attributeTypes");
const productTypeDefs = require("./productTypes");
const customerGroupTypeDefs = require("./customerGroupTypes");
const couponTypeDefs = require("./couponTypes");
const ratingTypes = require("./ratingTypes");


// Type Defs and Scalars
const typeDefs = gql`

scalar JSON
scalar JSONObject
scalar UUID
scalar Upload

# Common Output Type #################################################################
######################################################################################
type CommonOutput {
    message:String
    status:Boolean
    tenant_id:String
}

type TokenOutput{
    status: Boolean!
}

type SuccessMessage {
    message: String
}


# ROOT QUERIES AND MUTATIONS ###############################################
############################################################################

type Mutation {
    validateToken(token: String): TokenOutput!
}
type Query
`;

// Export Type Defs
module.exports = [
    typeDefs,
    uploadTypeDefs,
    bannerTypes,
    userTypeDefs,
    adminTypeDefs,
    verifyEmailTypeDefs,
    forgotPasswordTypeDefs,
    roleTypeDefs,
    rolesPermissionTypeDefs,
    brandTypeDefs,
    categoryTypeDefs,
    attributeTypeDefs,
    productTypeDefs,
    customerGroupTypeDefs,
    couponTypeDefs,
    ratingTypes
]
