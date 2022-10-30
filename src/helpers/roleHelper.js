const { Op } = require("sequelize");
const { default: slugify } = require("slugify");



// ROLE HELPER
module.exports = {
    // CREATE ROLES API
    createRoleWithPermission: async (req, db, user, isAuth, TENANTID) => {

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
            const checkRoleExist = await db.role.findOne({
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
                const createrole = await db.role.create({
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
                        element.role_id = createrole.id;
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

        // Try Catch Block
        try {
            // GET ALL ROLES
            // Check If User Has Alias or Not 
            if (!db.role.hasAlias('permissions_data') && !db.role.hasAlias('permissions')) {
                await db.role.hasMany(db.permissions_data, { sourceKey: 'id', foreignKey: 'role_id', as: 'permissions' });
            }

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
                await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_id', foreignKey: 'id', as: 'rolesPermission' });
            }

            // Find All Roles With permissions
            const findAllRoleandPermissions = await db.role.findAll({
                include: [{
                    model: db.permissions_data, as: 'permissions',
                    include: [{ model: db.roles_permission, as: 'rolesPermission' }],
                    separate: true,
                    order: [[{ model: db.roles_permission, as: 'rolesPermission' }, 'roles_permission_name', 'ASC']]
                }],
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ['role', 'ASC']
                ],
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
            const { id } = req;

            // TENANT ID
            const tenant_id = TENANTID;


            // Check If User Has Alias or Not 
            if (!db.role.hasAlias('permissions_data') && !db.role.hasAlias('permissions')) {
                await db.role.hasMany(db.permissions_data, { sourceKey: 'id', foreignKey: 'role_id', as: 'permissions' });
            }

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
                await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_id', foreignKey: 'id', as: 'rolesPermission' });
            }

            // Find Single Role With Permission
            const findRoleandPermission = await db.role.findOne({
                include: {
                    model: db.permissions_data, as: 'permissions',
                    include: { model: db.roles_permission, as: 'rolesPermission' },
                    separate: true,
                    order: [[{ model: db.roles_permission, as: 'rolesPermission' }, 'roles_permission_name', 'ASC']]
                },
                where: {
                    [Op.and]: [{
                        id,
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

        // Try Catch Block
        try {

            // Data From Request
            const role_id = req.id;
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


                // Check The Role Is Already Taken or Not
                const checkRoleExist = await db.role.findOne({
                    where: {
                        [Op.and]: [{
                            role_slug: role_slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: role_id
                        }]
                    }
                });

                if (checkRoleExist) return { message: "Already Have This Role", status: false }
            }

            // Update Doc
            const updateDoc = {
                role,
                role_slug,
                role_status,
                role_description: roleDescription
            }

            // Update Role 
            const updateRole = await db.role.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id: role_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateRole) return { message: "Update Gone Wrong!!!", status: false }

            // Find Targeted Role
            const findTargetedRole = await db.role.findOne({
                where: {
                    [Op.and]: [{
                        id: role_id,
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

        // Try Catch Block
        try {

            // Data From Request
            const permissionsData = req.permissionsData;
            const { role_id, permission_id, read_access, edit_access } = permissionsData;

            // Update Doc
            const permissionsUpdateDoc = {
                read_access,
                edit_access
            }

            // Check The Permission is New or not
            const checkIsNewPermission = await db.permissions_data.findOne({
                where: {
                    [Op.and]: [{
                        role_id,
                        permission_id,
                        tenant_id: TENANTID
                    }]
                }
            })

            // If The Permission is New
            if (!checkIsNewPermission) {

                // GET ROLE NO
                const findRoleNo = await db.role.findOne({
                    where: {
                        [Op.and]: [{
                            id: role_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Role No
                const { role_no } = findRoleNo;

                // Create Permission Data 
                const creareRolePermissionsData = {
                    role_no,
                    role_id,
                    permission_id,
                    edit_access,
                    read_access,
                    tenant_id: TENANTID
                }

                // Save Role Permission
                const saveRolePermission = await db.permissions_data.create(creareRolePermissionsData);
                if (!saveRolePermission) return { message: "Failed to Add New Permission to this Role", status: false }

                // Return Data
                return {
                    message: "New Permission Added Successfully For this Role!!!",
                    status: true,
                    tenant_id: TENANTID
                }

            } else {
                // Find and Update 
                const permissionDataUpdate = await db.permissions_data.update(permissionsUpdateDoc, {
                    where: {
                        [Op.and]: [{
                            role_id,
                            permission_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // If not updated
                if (!permissionDataUpdate) return { message: "Update Went Wrong!!!", status: false }


                // Find Updated Permission
                const updatedPermissionCheck = await db.permissions_data.findOne({
                    where: {
                        [Op.and]: [{
                            role_id,
                            permission_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Delete If Everything is False
                if (updatedPermissionCheck && !updatedPermissionCheck.edit_access && !updatedPermissionCheck.read_access) {
                    // DELETE Permission
                    db.permissions_data.destroy({
                        where: {
                            [Op.and]: [{
                                role_id,
                                permission_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                }

                // Return Data
                return {
                    message: "Permission Updated Successfully For this Role!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }





        } catch (error) {
            if (error) return { message: "Something Went Wrong!!", status: false }
        }

    },
    // DELETE ROLE HELPER
    deleteRole: async (req, db, user, isAuth, TENANTID) => {

        // TRY CATCH BLOCK
        try {
            // Data From Request
            const { id } = req;

            // DELETE ROLE
            const deleteRole = await db.role.destroy({
                where: {
                    [Op.and]: [{
                        id,
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