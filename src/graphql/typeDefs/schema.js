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
const vendorTypes = require("./vendorTypes");
const customerTypes = require("./customerTypes");
const productConditionTypes = require('./utils/productConditionTypes');
const productAvailabilityStatusTypes = require('./utils/productAvailabilityStatusTypes');
const addressTypes = require('./addressTypes');
const companyInfoTypes = require('./companyInfoTypes');
const cartTypes = require('./cartTypes');
const paymentTypes = require('./paymentTypes');
const taxClassTypes = require('./taxClassTypes');
const orderTypes = require('./orderTypes');
const wishListTypes = require('./wishListTypes');
const filterPaginationTypes = require('./filterPaginationTypes');
const purchaseOrderTypes = require('./purchaseOrderTypes');
const shippingMethodTypes = require('./shippingMethodTypes');
const contactUsTypes = require('./contactUsTypes');
const receivingTypes = require('./receivingTypes');
const quoteTypes = require('./quoteTypes');
const emailTemplateTypes = require('./emailTemplateTypes');
const dashboardTypes = require('./dashboardTypes');
const reportTypes = require('./reportTypes');
const stripeType = require('./stripeType');


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
type Query{
    getPing:CommonOutput!
}
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
    ratingTypes,
    vendorTypes,
    customerTypes,
    productConditionTypes,
    productAvailabilityStatusTypes,
    addressTypes,
    companyInfoTypes,
    cartTypes,
    paymentTypes,
    taxClassTypes,
    orderTypes,
    wishListTypes,
    filterPaginationTypes,
    purchaseOrderTypes,
    shippingMethodTypes,
    contactUsTypes,
    receivingTypes,
    quoteTypes,
    emailTemplateTypes,
    dashboardTypes,
    reportTypes,
    stripeType
]
