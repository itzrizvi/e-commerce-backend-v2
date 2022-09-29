const { gql } = require('apollo-server-express');


const typeDefs = gql`

scalar JSON
scalar JSONObject
scalar UUID


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
    updatedAt:String
    createdAt:String
    roleNo:String
    status:Boolean
}

input AdminSignUpInput {
    first_name:String
    last_name:String
    email:String
    password:String
    roleNo:String
}

type AdminSignUpOutput {
    authToken:String
    uid:String
    first_name:String
    last_name:String
    email:String
    message:String
    emailVerified:Boolean
    updatedAt:String
    createdAt:String
    roleNo:Float
    role:String
    roleSlug:String
    status:Boolean
}

type Staff {
    uid:UUID
    first_name:String
    last_name:String
    email:String
    roles:Role
    email_verified:Boolean
}

type GetALLStaffOutput {
    data:[Staff]
    isAuth:Boolean
    message:String
    status:Boolean
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
    createdAt:String
    updatedAt:String
    tenant_id:String
}

type RoleOutput {
    isAuth:Boolean
    message: String
    status:Boolean
    data: [Role]
}

input CreateRoleInput {
    role:String!
}

type CreateRoleOutput {
    roleNo:Float
    role:String
    roleUUID:String
    roleSlug:String
    message:String
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


# Permission Based Input and Queries #########################################
##############################################################################

input FeaturePermissionListInput {
    featureName:String!
}
type FeaturePermissionListOutput {
    featureNameUUID:String
    featureName:String
    featureNameSlug:String
    tenant_id:String
    message:String
    status:Boolean
}

type FeaturePermission {
    feature_permission_uuid:UUID
    feature_permission_name:String
    feature_permission_slug:String
}

type GetALLFeaturePermissionOutput {
    isAuth:Boolean
    message: String
    status:Boolean
    tenant_id:String
    data: [FeaturePermission]
}

input AssignPermissionInput {
    permissionUUIDList:JSON!
    staffUUID:UUID!
    roleNo:Float!
}

type AssignPermissionOutput {
    permission_uuid:UUID
    permission_list_uuid:JSON
    staff_uuid:UUID
    first_name:String
    role:String
    role_no:Float
    tenant_id:String
    message:String
    status:Boolean
}

input GetPermisssionsByStaff {
    staffUUID:UUID!
}

type Permission {
    permission_uuid:UUID
    feature_permission_list:[FeaturePermission]
}

type GetPermisssionsByStaffOutput {
    isAuth:Boolean
    tenant_id:String
    message: String
    status:Boolean
    staffData: Staff
    permissions_data:Permission
}



# ROOT QUERIES AND MUTATIONS ###############################################
############################################################################

type Query {
    getAllRoles: RoleOutput!
    getAllStaff: GetALLStaffOutput!
    getAllFeaturePermission: GetALLFeaturePermissionOutput!
    getAllPermissionByStaff(query: GetPermisssionsByStaff): GetPermisssionsByStaffOutput!
    getAllCategories: GetCategories!
    getFeaturedCategories: GetFeaturedCategories!
}

type Mutation {
    userSignUp(data: UserInput): AuthPayload!
    userSignIn(email: String!, password: String!): AuthPayload!
    adminSignUp(data: AdminSignUpInput): AdminSignUpOutput!
    adminSignIn(email: String!, password: String!): AdminAuthPayload!
    verifyEmail(data: VerifyEmailInput): VerifyEmailOutput!
    resendVerificationEmail(data: resendVerificationEmailInput):resendVerifyEmailOutput!
    forgotPassInit(data: ForgotPassInitInput):ForgotPassInitOutput!
    forgotPassCodeMatch(data: ForgotPassCodeMatchInput):ForgotPassCodeMatchOutput!
    forgotPassFinal(data: ForgotPassFinalInput):ForgotPassFinalOutput!
    createRole(data: CreateRoleInput): CreateRoleOutput!
    createFeaturePermission(data: FeaturePermissionListInput):FeaturePermissionListOutput!
    createCategory(data: CategoryCreateInput): CategoryCreateOutput!
    assignPermission(data: AssignPermissionInput):AssignPermissionOutput!
}
`;


module.exports = typeDefs;
