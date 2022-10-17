const { gql } = require('apollo-server-express');
// All Type Defs
const uploadTypeDefs = require("../typeDefs/uploadTypes");
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

type SuccessMessage {
    message: String
}


# ROOT QUERIES AND MUTATIONS ###############################################
############################################################################

type Query 
type Mutation 
`;

// Export Type Defs
module.exports = [
    typeDefs,
    uploadTypeDefs,
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
    customerGroupTypeDefs
]
