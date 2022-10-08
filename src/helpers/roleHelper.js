const { Op } = require("sequelize");
const { default: slugify } = require("slugify");



// ROLE HELPER
module.exports = {
    // CREATE ROLES API
    createRoleWithPermission: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {
            // GET DATA
            const { role, role_status, permissionsData, roleDescription } = req;

            // Create Slug
            const role_slug = slugify(`${role}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check The Role Is Already Taken or Not
            const checkRoleExist = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_slug: role_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Create Random String for Role No
            const roleNo = Math.ceil(Date.now() + Math.random());


            // If Not Exists then create
            if (!checkRoleExist) {
                const createrole = await db.roles.create({
                    role_no: roleNo,
                    role: role,
                    role_status: role_status,
                    role_slug: role_slug,
                    role_description: roleDescription,
                    tenant_id: TENANTID
                });

                // If Created Role
                if (createrole) {
                    // Loop For Assign Other Values to Permissions
                    permissionsData.forEach(element => {
                        element.role_uuid = createrole.role_uuid;
                        element.role_no = createrole.role_no;
                        element.tenant_id = createrole.tenant_id;

                    });

                    // Permissions Bulk Create
                    const permissionCreate = await db.permissions_data.bulkCreate(permissionsData);
                    if (!permissionCreate) return { message: "Permission Creation Failed", status: false }


                    return {
                        tenant_id: createrole.tenant_id,
                        message: "Successfully Created A Role With Permission!!!",
                        status: true
                    }


                } else {
                    return { message: "Role Creation Failed", status: false }
                }


            } else {
                return { message: "Already Have This Role", status: false }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },
    // GET ALL ROLES API
    getAllRoles: async (db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { message: "Not Authenticated", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };


        // Try Catch Block
        try {
            // GET ALL ROLES
            // Check If User Has Alias or Not 
            if (!db.roles.hasAlias('permissions_data') && !db.roles.hasAlias('permissions')) {
                await db.roles.hasMany(db.permissions_data, { sourceKey: 'role_uuid', foreignKey: 'role_uuid', as: 'permissions' });
            }

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
                await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_uuid', foreignKey: 'roles_permission_uuid', as: 'rolesPermission' });
            }

            // Find All Roles With permissions
            const findAllRoleandPermissions = await db.roles.findAll({
                include: [{
                    model: db.permissions_data, as: 'permissions',
                    include: [{ model: db.roles_permission, as: 'rolesPermission' }]
                }],
                where: {
                    tenant_id: TENANTID
                }
            })

            // Return Formation
            return {
                data: findAllRoleandPermissions,
                message: "All Roles And Permissions GET Success!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }



    },
    // GET SINGLE ROLE HELPER
    getSingleRole: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const { role_uuid } = req;

            // TENANT ID
            const tenant_id = TENANTID;


            // Check If User Has Alias or Not 
            if (!db.roles.hasAlias('permissions_data') && !db.roles.hasAlias('permissions')) {
                await db.roles.hasMany(db.permissions_data, { sourceKey: 'role_uuid', foreignKey: 'role_uuid', as: 'permissions' });
            }

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
                await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_uuid', foreignKey: 'roles_permission_uuid', as: 'rolesPermission' });
            }

            // Find Single Role With Permission
            const findRoleandPermission = await db.roles.findOne({
                include: [{
                    model: db.permissions_data, as: 'permissions',
                    include: [{ model: db.roles_permission, as: 'rolesPermission' }]
                }],
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id
                    }]
                }
            })

            // Return Formation
            return {
                message: "Role With Permissions GET Success!!!",
                status: true,
                data: findRoleandPermission
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // UPDATE ROLE HELPER
    updateRole: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const role_uuid = req.role_uuid;
            const role = req.role;
            const role_status = req.role_status;
            const roleDescription = req.roleDescription;

            // IF ROLE ALSO UPDATED THEN SLUG ALSO WILL BE UPDATED
            let role_slug;
            if (role) {
                // Create Slug
                role_slug = slugify(`${role}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });
            }

            // Update Doc
            const updateDoc = {
                role,
                role_slug,
                role_status,
                role_description: roleDescription
            }

            // Update Role 
            const updateRole = await db.roles.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateRole) return { message: "Update Gone Wrong!!!", status: false }

            // Find Targeted Role
            const findTargetedRole = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Data
            return {
                message: "Role and Permission Updated Successfully!!!",
                status: true,
                tenant_id: findTargetedRole.tenant_id
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!", status: false }
        }

    },
    // UPDATE ROLE PERMISSIONS HELPER
    updateRolePermissions: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const permissionsData = req.permissionsData;
            const { role_uuid, permission_uuid, read_access, edit_access } = permissionsData;

            // Update Doc
            const permissionsUpdateDoc = {
                read_access,
                edit_access
            }

            // Find and Update 
            const permissionDataUpdate = await db.permissions_data.update(permissionsUpdateDoc, {
                where: {
                    [Op.and]: [{
                        role_uuid,
                        permission_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If not updated
            if (!permissionDataUpdate) return { message: "Update Went Wrong!!!", status: false }

            // Return Data
            return {
                message: "Permission Updated Successfully For this Role!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!", status: false }
        }

    },
    // DELETE ROLE HELPER
    deleteRole: async (req, db, user, isAuth, TENANTID) => {
        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // TRY CATCH BLOCK
        try {
            // Data From Request
            const { role_uuid } = req;

            // DELETE ROLE
            const deleteRole = await db.roles.destroy({
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT DELETED
            if (!deleteRole) return { message: "Delete Gone Wrong!!!", status: false }

            // Return
            return {
                message: "Role Deleted Successfully!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    }

}