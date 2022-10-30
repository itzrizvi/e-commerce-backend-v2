// All Requires
const { Op } = require("sequelize");

// Check Permission
const checkPermission = async (db, user, TENANTID, permissionName) => {

    // Extract User
    const id = user.id;

    // GET The Roles Permission Data
    const getRolesPermissionData = await db.roles_permission.findOne({
        where: {
            roles_permission_slug: permissionName
        }
    });
    const rolePermissionID = getRolesPermissionData.roles_permission_id; // Extract UUID

    // Find Roles of This User 
    const findRoles = await db.admin_role.findAll({
        where: {
            [Op.and]: [{
                admin_id: id,
                tenant_id: TENANTID
            }]
        }
    });

    // GET ROLE UUIDS
    let roleUUIDs = [];
    findRoles.forEach(async (role) => {
        await roleUUIDs.push(role.role_id);
    });

    // GET Permission Data
    const getPermissionData = await db.permissions_data.findAll({
        where: {
            [Op.and]: [{
                role_id: roleUUIDs,
                permission_id: rolePermissionID,
                edit_access: true,
                tenant_id: TENANTID
            }]
        }
    });

    // Finally return the status
    if (!getPermissionData || getPermissionData.length <= 0) response = { success: false }
    else response = { success: true }

    return response;
}




// Module Export
module.exports = {
    checkPermission
}