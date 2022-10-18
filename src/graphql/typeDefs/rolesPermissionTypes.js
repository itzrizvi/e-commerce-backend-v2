const { gql } = require("apollo-server-express");


module.exports = gql`

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


# Extended QUERIES AND MUTATIONS ######################################
#######################################################################

extend type Mutation {
    createRolesPermission(data: RolesPermissionInput):RolesPermissionOutput!
    updateRolesPermission(data: UpdateRolesPermissionInput):UpdateRolesPermissionOutput
}

extend type Query {
    getAllRolesPermission: GetAllRolesPermission!
    getSingleRolesPermission(query: GetSingleRolesPermissionInput): GetSingleRolesPermissionOutput!
}


`;