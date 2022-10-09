const { gql } = require('apollo-server-express');
const uploadTypeDefs = require("../typeDefs/uploadTypes");

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

# User Based Input and Queries #######################################################
######################################################################################

type User {
    uid:ID,
    id:ID
    first_name:String
    last_name:String
    email:String
    password:String
}

type AuthPayload {
    authToken: String
    uid:String
    first_name:String
    last_name:String
    email:String
    message:String
    emailVerified:Boolean
    user_status:Boolean
    updatedAt:String
    createdAt:String
    status:Boolean
}

input UserInput {
    first_name:String
    last_name:String
    email:String
    password:String
}



# Admin Staff Based Input and Queries ################################################
######################################################################################

type AdminAuthPayload {
    authToken:String
    uid:String
    first_name:String
    last_name:String
    email:String
    message:String
    emailVerified:Boolean
    user_status:Boolean
    updatedAt:String
    createdAt:String
    status:Boolean
}

input AdminSignUpInput {
    first_name:String!
    last_name:String!
    email:String!
    password:String!
    roleUUID:JSON!
    userStatus:Boolean!
}

type AdminSignUpOutput {
    message:String
    status:Boolean
    tenant_id:String
}


type Staff {
    uid:UUID
    first_name:String
    last_name:String
    email:String
    roles:[Role]
    user_status:Boolean
    email_verified:Boolean
}

type GetALLStaffOutput {
    data:[Staff]
    isAuth:Boolean
    message:String
    status:Boolean
}

input UpdateAdminInput {
    uid:UUID!
    first_name:String
    last_name:String
    password:String
    roleUUID:JSON
    user_status:Boolean
}




# Verify Email Based Input and Queries ###############################################
######################################################################################

input VerifyEmailInput {
    verificationCode:Int!
}

type VerifyEmailOutput {
    email:String
    emailVerified:Boolean
    isAuth:Boolean
    message:String
    status:Boolean
}

input resendVerificationEmailInput {
    email:String!
}

type resendVerifyEmailOutput {
    message:String
    status:Boolean
    email:String
}


# Forgot Password Based Input and Queries ############################################
######################################################################################

input ForgotPassInitInput {
    email:String!
}

type ForgotPassInitOutput {
    message:String
    email:String
    status:Boolean
}

input ForgotPassCodeMatchInput {
    email:String!
    forgotPassVerifyCode:Int!
}

type ForgotPassCodeMatchOutput {
    message:String
    email:String
    status:Boolean
}

input ForgotPassFinalInput {
    email:String!
    forgotPassVerifyCode:Int!
    newPassword:String!
    confirmPassword:String!
}

type ForgotPassFinalOutput {
    email:String
    message:String
    status:Boolean
}


# Role Based Input and Queries ###############################################
##############################################################################

type Role {
    role_uuid: UUID
    role_no: Float
    role:String
    role_slug:String
    role_status:Boolean
    role_description:String
    createdAt:String
    updatedAt:String
    tenant_id:String
    permissions:[PermissionData]
}

type RoleOutput {
    message: String
    status:Boolean
    data: [Role]
}

input CreateRoleWithPermissionInput {
    role:String!
    role_status:Boolean!
    roleDescription:String!
    permissionsData:JSON!
}

type CreateRoleWithPermissionOutput {
    tenant_id:String
    message:String
    status:Boolean
}

input UpdateRoleInput {
    role_uuid:UUID
    role:String
    role_status:Boolean
    roleDescription:String
}

type UpdateRoleOutput {
    message:String
    status:Boolean
    tenant_id:String
}

input UpdateRolePermissionsInput {
    permissionsData:JSONObject
}
type UpdateRolePermissionsOutput {
    message:String
    status:Boolean
    tenant_id:String
}

input DeleteRoleInput {
    role_uuid:UUID
}

type DeleteRoleOutput {
    message:String
    status:Boolean
}

type SingleRole {
    role_uuid: UUID
    role_no: Float
    role:String
    role_slug:String
    role_status:Boolean
    role_description:String
    permissions:[PermissionData]
    createdAt:String
    updatedAt:String
    tenant_id:String
}

input GetSingleRoleInput {
    role_uuid:UUID
}

type GetSingleRoleOutput {
    message:String
    status:Boolean
    data:SingleRole
}


# Roles Permission Based Input and Queries #########################################
##############################################################################

type PermissionData {
    permission_data_uuid:UUID
    role_no:Int
    tenant_id:String
    role_uuid:UUID
    edit_access:Boolean
    read_access:Boolean
    rolesPermission:RolesPermission
}

input RolesPermissionInput {
    permissionName:String!
    permissionStatus:Boolean!
}

type RolesPermissionOutput {
    tenant_id:String
    message:String
    status:Boolean
}

type RolesPermission {
    roles_permission_uuid:UUID
    roles_permission_name:String
    roles_permission_slug:String
    roles_permission_status:Boolean
    tenant_id:String
    createdAt:String
    updatedAt:String
}

type GetAllRolesPermission {
    isAuth:Boolean
    message: String
    status:Boolean
    tenant_id:String
    data: [RolesPermission]
}

input GetSingleRolesPermissionInput {
    roles_permission_uuid:UUID!
}
type GetSingleRolesPermissionOutput {
    message:String
    tenant_id:String
    status:Boolean
    data:RolesPermission
}

input UpdateRolesPermissionInput {
    roles_permission_uuid:UUID!
    roles_permission_name:String
    roles_permission_status:Boolean
}

type UpdateRolesPermissionOutput {
    message:String
    tenant_id:String
    status:Boolean
}

# Category Based Input and Queries ###############################################
##################################################################################

input CategoryCreateInput {
    categoryName:String!
    categoryDescription:JSON
    categoryParentId:UUID
    categoryMetaTagTitle:String
    categoryMetaTagDescription:JSON
    categoryMetaTagKeywords:JSON
    categoryImage:String
    categorySortOrder:Int
    categoryStatus:Boolean
    isFeatured:Boolean
}

type CategoryCreateOutput {
    message:String
    tenant_id:String
    status:Boolean
    creategoryName:String
    createdBy:String
}

type SubSubCategory {
    cat_id:UUID
    cat_name:String
    cat_slug:String
    cat_descriptipn:JSON
    cat_image:String
    cat_sort_order:Int
    cat_status:Boolean
    tenant_id:String
    cat_parent_id:UUID
}

type SubCategory {
    cat_id:UUID
    cat_name:String
    cat_slug:String
    cat_descriptipn:JSON
    cat_image:String
    cat_sort_order:Int
    cat_status:Boolean
    tenant_id:String
    cat_parent_id:UUID
    subsubcategories:[SubSubCategory]
}

type Category {
    cat_id:UUID!
    cat_name:String!
    cat_slug:String!
    cat_descriptipn:JSON
    cat_image:String
    cat_sort_order:Int
    cat_status:Boolean
    tenant_id:String
    cat_parent_id:UUID
    subcategories:[SubCategory]
}

type GetCategories {
    message:String
    status:Boolean
    tenant_id:String
    categories: [Category]
}

type GetFeaturedCategories {
    message:String
    status:Boolean
    tenant_id:String
    categories: [Category]
}


# Product Based Input and Types #########################################
#########################################################################


type Product {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_barcode:String
    tenant_id:String
    product_category:UUID
    added_by:UUID
}

input AddProductInput {
    product_name:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_category:UUID
    product_barcode:String
}


type AddProductOutput {
    message:String
    status:Boolean
    data:Product
}

input SingleProductDetailsInput {
    product_id:UUID
}

type SingleProduct {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_barcode:String
    tenant_id:String
    category: Category
    createdBy: Staff
}

type SingleProductDetails {
    message:String
    status:Boolean
    data: SingleProduct
}

input UpdateProductInput {
    product_id:UUID
    product_name:String
    product_slug:String
    product_description:JSON
    product_meta_tag_title:String
    product_meta_tag_description:JSON
    product_meta_tag_keywords:JSON
    product_tags:JSON
    product_image:String
    product_image_gallery:JSON
    product_sku:String
    product_regular_price:Float
    product_sale_price:Float
    product_tax_included:Boolean
    product_stock_quantity:Int
    product_minimum_stock_quantity:Int
    product_maximum_orders:Int
    product_stock_status:String
    product_available_from:String
    product_status:String
    product_category:UUID
    product_barcode:String
}

type UpdateProductOutput {
    message:String
    status:Boolean
    data:Product
}


type GetProductList {
    message:String
    status:Boolean
    data:[SingleProduct]
}

type SuccessMessage {
    message: String
}



# ROOT QUERIES AND MUTATIONS ###############################################
############################################################################

type Query {
    getAllRoles: RoleOutput!
    getSingleRole(query: GetSingleRoleInput): GetSingleRoleOutput!

    getAllRolesPermission: GetAllRolesPermission!
    getSingleRolesPermission(query: GetSingleRolesPermissionInput): GetSingleRolesPermissionOutput!

    getAllStaff: GetALLStaffOutput!

    getAllCategories: GetCategories!
    getFeaturedCategories: GetFeaturedCategories!

    getSingleProduct(query: SingleProductDetailsInput): SingleProductDetails!
    getProductList: GetProductList!
}

type Mutation {
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!

    adminSignUp(data: AdminSignUpInput): AdminSignUpOutput!
    adminSignIn(email: String!, password: String!): AdminAuthPayload!
    adminUpdate(data: UpdateAdminInput): CommonOutput!

    verifyEmail(data: VerifyEmailInput): VerifyEmailOutput!
    resendVerificationEmail(data: resendVerificationEmailInput):resendVerifyEmailOutput!

    forgotPassInit(data: ForgotPassInitInput):ForgotPassInitOutput!
    forgotPassCodeMatch(data: ForgotPassCodeMatchInput):ForgotPassCodeMatchOutput!
    forgotPassFinal(data: ForgotPassFinalInput):ForgotPassFinalOutput!

    createRoleWithPermission(data: CreateRoleWithPermissionInput): CreateRoleWithPermissionOutput!
    updateRole(data: UpdateRoleInput): UpdateRoleOutput!
    updateRolePermissions(data: UpdateRolePermissionsInput):UpdateRolePermissionsOutput!
    deleteRole(data: DeleteRoleInput): DeleteRoleOutput!

    createRolesPermission(data: RolesPermissionInput):RolesPermissionOutput!
    updateRolesPermission(data: UpdateRolesPermissionInput):UpdateRolesPermissionOutput

    createCategory(data: CategoryCreateInput): CategoryCreateOutput!
    

    addProduct(data: AddProductInput):AddProductOutput!
    updateProduct(data: UpdateProductInput):UpdateProductOutput!
}
`;


// module.exports = typeDefs;

module.exports = [
    typeDefs,
    uploadTypeDefs
]
