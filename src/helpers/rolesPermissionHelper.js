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

            if (!createRolesPrmsn) return { message: "Roles Permission Creation Failed!!", status: false }


            return {
                message: "Created A Role Permission Successfully!!",
                tenant_id: createRolesPrmsn.tenant_id,
                status: true
            }

        } else {
            return { message: "This Role Permission Already Exists!!!", status: false }
        }


    },
    // GET ALL Roles Permission
    getAllRolesPermission: async (db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };


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
    },
    // GET SINGLE ROLES PERMISSION
    getSingleRolesPermission: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const roles_permission_uuid = req.roles_permission_uuid;

            // Find Roles Permission
            const findRolesPermission = await db.roles_permission.findOne({
                where: {
                    [Op.and]: [{
                        roles_permission_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If not Found
            if (!findRolesPermission) return { message: "Couldnt Found Roles Permission", status: false };

            // Return Formation
            return {
                message: "Single Roles Permission GET Success!!!",
                tenant_id: findRolesPermission.tenant_id,
                status: true,
                data: findRolesPermission
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // UPDATE ROLES PERMISSION
    updateRolesPermission: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const roles_permission_uuid = req.roles_permission_uuid;
            const roles_permission_name = req.roles_permission_name;
            const roles_permission_status = req.roles_permission_status;


            // IF ROLES PERMISSION NAME ALSO UPDATED THEN SLUG ALSO WILL BE UPDATED
            let roles_permission_slug;
            if (roles_permission_name) {
                // Create Slug
                roles_permission_slug = slugify(`${roles_permission_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });
            }

            // Update Doc
            const updateDoc = {
                roles_permission_name,
                roles_permission_slug,
                roles_permission_status
            }

            // Update Role 
            const updateRolesPermission = await db.roles_permission.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        roles_permission_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateRolesPermission) return { message: "Update Gone Wrong!!!", status: false };


            // Return 
            return {
                message: "Roles Permission Update Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    }
}