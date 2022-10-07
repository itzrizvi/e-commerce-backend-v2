const { Op } = require("sequelize");
const { default: slugify } = require("slugify");

// Role Permission Helper
module.exports = {
    // Create Roles Permission 
    createRolesPermission: async (req, db, user, isAuth, TENANTID) => {

        // Req Data
        const permissionName = req.permissionName;
        const permissionStatus = req.permissionStatus;

        // Create Slug
        const rolesPermissionNameSlug = slugify(`${permissionName}`, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true
        });


        // Check If Already Feature is Exists In the Permission List Table
        const findPermissionExists = await db.roles_permission.findOne({
            where: {
                [Op.and]: [{
                    roles_permission_slug: rolesPermissionNameSlug,
                    tenant_id: TENANTID
                }]
            }
        });

        if (!findPermissionExists) {

            // Create Feature of Permission
            const createRolesPrmsn = await db.roles_permission.create({
                roles_permission_name: permissionName,
                roles_permission_slug: rolesPermissionNameSlug,
                roles_permission_status: permissionStatus,
                tenant_id: TENANTID
            });

            if (!createRolesPrmsn) return { message: "Something Went Wrong!!", status: false }


            return {
                rolesPermissionUUID: createRolesPrmsn.roles_permission_uuid,
                message: "Created A Role Permission Successfully!!",
                rolesPermissionName: createRolesPrmsn.roles_permission_name,
                rolesPermissionNameSlug: createRolesPrmsn.roles_permission_slug,
                rolesPermissionStatus: createRolesPrmsn.roles_permission_status,
                tenant_id: createRolesPrmsn.tenant_id
            }

        } else {
            return { message: "This Role Permission Already Exists!!!", status: false }
        }


    },
    // GET ALL Feature Permission
    getAllRolesPermission: async (db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };


        try {
            // GET ALL Feature Permissions Query
            const allRolesPermission = await db.roles_permission.findAll({ where: { tenant_id: TENANTID } });
            // Return Data
            return {
                isAuth: isAuth,
                message: "All Roles Permission GET Success!!!",
                data: allRolesPermission,
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong", status: false }
            }
        }
    }
}