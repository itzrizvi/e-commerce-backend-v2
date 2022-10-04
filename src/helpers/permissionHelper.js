// All Requires
const { Op } = require("sequelize");


// Permission Helper
module.exports = {
    // Assign Permission
    assignPermission: async (req, db, user, isAuth, TENANTID) => {
        if (!user || !isAuth) return { message: "Not Authorized" } // If Not Auth or User
        if (user.role_no === '0') return { message: "Not Authorized" } // If Not Auth or Admin

        try {

            // Data From Request
            const permission_list_uuid = req.permissionUUIDList;
            const role_uuid = req.roleUUID;
            const role_no = req.roleNo;

            // check if user exist in Permission Data Table
            const checkUserOnPermission = await db.permissions_data.findOne({
                where: {
                    [Op.and]: [{
                        role_uuid,
                        role_no,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Not Exists
            if (!checkUserOnPermission) {

                // Check Role By Role No
                const roleQuery = await db.roles.findOne({
                    where: {
                        [Op.and]: [{
                            role_no,
                            role_uuid,
                            tenant_id: TENANTID
                        }]
                    }
                });
                const role_slug = roleQuery.role_slug;
                const role = roleQuery.role;

                // Insert Permission
                const assignPermission = await db.permissions_data.create({
                    permission_list_uuid: permission_list_uuid,
                    role_no: role_no,
                    role_slug: role_slug,
                    role_uuid: role_uuid,
                    role: role,
                    tenant_id: TENANTID
                });

                if (assignPermission) {

                    return {
                        permission_uuid: assignPermission.permission_uuid,
                        permission_list_uuid: assignPermission.permission_list_uuid,
                        role_uuid: assignPermission.role_uuid,
                        role: assignPermission.role,
                        role_no: assignPermission.role_no,
                        message: "Successfully Assigned Permission To The Role!!",
                        tenant_id: assignPermission.tenant_id,
                        status: true
                    }
                }


            } else { // If Role Has Some Permission Already Then Update

                // // Get the Permission UUID LIST  and Split by @ For Arrays
                // const existingPermissionListUUID = checkUserOnPermission.permission_list_uuid.split("@");
                // const newReqPermissionListUUID = permission_list_uuid.split("@");
                // // Concate Array to Filter Duplicates
                // const allPermissionListUUIDArray = existingPermissionListUUID.concat(newReqPermissionListUUID);
                // // Filter Duplicates
                // const filterDuplicatePermissionUUID = [...new Set(allPermissionListUUIDArray)];
                // // Join by @ For Insert as JSON String
                // const newPermissionListUUID = filterDuplicatePermissionUUID.join("@");

                // Updating Doc
                const updateDoc = {
                    permission_list_uuid: permission_list_uuid
                }

                // Update User
                const updateRolePermission = await db.permissions_data.update(updateDoc, {
                    where: {
                        [Op.and]: [{
                            role_uuid,
                            role_no,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (updateRolePermission) {

                    // Query For Updated Permission Data
                    const updatedRolePermissionData = await db.permissions_data.findOne({
                        where: {
                            [Op.and]: [{
                                role_uuid,
                                role_no,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Return Updated Data
                    return {
                        permission_uuid: updatedRolePermissionData.permission_uuid,
                        permission_list_uuid: updatedRolePermissionData.permission_list_uuid,
                        role_uuid: updatedRolePermissionData.role_uuid,
                        role: updatedRolePermissionData.role,
                        role_no: updatedRolePermissionData.role_no,
                        message: "Successfully Updated Permission To The Staff!!",
                        tenant_id: updatedRolePermissionData.tenant_id,
                        status: true
                    }
                }



            }

        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }
    },
    // GET ALL Permission By Staff
    getAllPermissionByRole: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false, status: false };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, status: false };


        try {

            // Staff UUID
            const role_uuid = req.roleUUID;

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles')) {
                await db.permissions_data.hasOne(db.roles, { sourceKey: 'role_no', foreignKey: 'role_no', as: 'roles' });
            }

            // GET Permission Data and Role
            const getPermissionData = await db.permissions_data.findOne({
                include: [{ model: db.roles, as: 'roles' }],
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Check Have Permission
            if (!getPermissionData) return { message: "No Permission Found For This Role", status: false }

            // Feature Permission UUID from Permission Data
            const { permission_list_uuid, roles } = getPermissionData;
            const permissionIDArray = permission_list_uuid.split("@");
            // GET Feature Permission Data  
            const getFeaturePermission = await db.feature_permission_list.findAll({
                where: {
                    [Op.and]: [{
                        feature_permission_uuid: permissionIDArray,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Final Data
            return {
                isAuth: isAuth,
                message: "Successfully GET ALL Permissions By Role!!!",
                status: true,
                tenant_id: TENANTID,
                roles,
                permissions_data: {
                    permission_uuid: getPermissionData.permission_uuid,
                    feature_permission_list: getFeaturePermission
                }
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }
    }
}