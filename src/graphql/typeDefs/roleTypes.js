const { gql } = require("apollo-server-express");


module.exports = gql`

# Role Based Input and Queries ###############################################
##############################################################################

type Role {
    role_id: Int
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
    role_id:Int
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
    role_id:Int
}

type DeleteRoleOutput {
    message:String
    status:Boolean
}

type SingleRole {
    role_id: Int
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
    role_id:Int
}

type GetSingleRoleOutput {
    message:String
    status:Boolean
    data:SingleRole
}


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createRoleWithPermission(data: CreateRoleWithPermissionInput): CreateRoleWithPermissionOutput!
    updateRole(data: UpdateRoleInput): UpdateRoleOutput!
    updateRolePermissions(data: UpdateRolePermissionsInput):UpdateRolePermissionsOutput!
    deleteRole(data: DeleteRoleInput): DeleteRoleOutput!
}

extend type Query {
    getAllRoles: RoleOutput!
    getSingleRole(query: GetSingleRoleInput): GetSingleRoleOutput!
}


`;