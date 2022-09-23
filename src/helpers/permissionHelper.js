// All Requires


// Permission Helper
module.exports = {
    // Assign Permission
    assignPermission: async (req, db, user, isAuth) => {
        if (!user || !isAuth) return { message: "Not Authorized" } // If Not Auth or User
        if (user.role_no === '0') return { message: "Not Authorized" } // If Not Auth or Admin

        try {

            // Data From Request
            const permission_list_uuid = req.permissionUUIDList;
            const staff_uuid = req.staffUUID;
            const role_no = req.roleNo;

            // check if user exist in Permission Data Table
            const checkUserOnPermission = await db.permissions_data.findOne({ where: { staff_uuid } });

            // If Not Exists
            if (!checkUserOnPermission) {

                // Check Role By Role No
                const roleQuery = await db.roles.findOne({ where: { role_no } });
                const role_slug = roleQuery.role_slug;
                const role = roleQuery.role;

                // Insert Permission
                const assignPermission = await db.permissions_data.create({
                    permission_list_uuid: permission_list_uuid,
                    role_no: role_no,
                    role_slug: role_slug,
                    staff_uuid: staff_uuid
                });

                if (assignPermission) {
                    // Staff First Name
                    const staffQuery = await db.users.findOne({ where: { uid: staff_uuid } });
                    const first_name = staffQuery.first_name;

                    return {
                        permission_uuid: assignPermission.permission_uuid,
                        permission_list_uuid: assignPermission.permission_list_uuid,
                        staff_uuid: staff_uuid,
                        first_name: first_name,
                        role: role,
                        role_no: role_no,
                        message: "Successfully Assigned Permission To The Staff!!"
                    }
                }


            } else { // If User Has Some Permission Already Then Update

                // Get the Permission UUID LIST  and Split by @ For Arrays
                const existingPermissionListUUID = checkUserOnPermission.permission_list_uuid.split("@");
                const newReqPermissionListUUID = permission_list_uuid.split("@");
                // Concate Array to Filter Duplicates
                const allPermissionListUUIDArray = existingPermissionListUUID.concat(newReqPermissionListUUID);
                // Filter Duplicates
                const filterDuplicatePermissionUUID = [...new Set(allPermissionListUUIDArray)];
                // Join by @ For Insert as JSON String
                const newPermissionListUUID = filterDuplicatePermissionUUID.join("@");

                // Updating Doc
                const updateDoc = {
                    permission_list_uuid: newPermissionListUUID
                }
                // Update User
                const updateUser = await db.permissions_data.update(updateDoc, { where: { staff_uuid } });

                if (updateUser) {

                    // Query For Updated Permission Data
                    const updatedStaffPermissionData = await db.permissions_data.findOne({ where: { staff_uuid } });
                    // Staff First Name
                    const staffQuery = await db.users.findOne({ where: { uid: staff_uuid } });
                    const first_name = staffQuery.first_name;

                    // Check Role By Role No
                    const roleQuery = await db.roles.findOne({ where: { role_no } });
                    const role = roleQuery.role;

                    // Return Updated Data
                    return {
                        permission_uuid: updatedStaffPermissionData.permission_uuid,
                        permission_list_uuid: updatedStaffPermissionData.permission_list_uuid,
                        staff_uuid: updatedStaffPermissionData.staff_uuid,
                        first_name: first_name,
                        role: role,
                        role_no: role_no,
                        message: "Successfully Updated Permission To The Staff!!"
                    }
                }



            }

        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!" }
            }
        }
    },
    // GET ALL Permission By Staff
    getAllPermissionByStaff: async (req, db, user, isAuth) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", isAuth: false };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false };


        try {

            // Staff UUID
            const staffUUID = req.staffUUID;

            // Check If User Has Alias or Not 
            if (!db.users.hasAlias('roles')) {
                await db.users.hasOne(db.roles, { sourceKey: 'role_no', foreignKey: 'role_no', as: 'roles' });
            }

            // GET Staff Data
            const getStaffDetailWithRole = await db.users.findOne({ include: [{ model: db.roles, as: 'roles' }], where: { uid: staffUUID } });
            // GET Permission Data 
            const getPermissionData = await db.permissions_data.findOne({ where: { staff_uuid: staffUUID } });
            const { permission_list_uuid } = getPermissionData;
            const permissionIDArray = permission_list_uuid.split("@");
            // GET Feature Permission Data 
            const getFeaturePermission = await db.feature_permission_list.findAll({ where: { feature_permission_uuid: permissionIDArray } });

            // Return Final Data
            return {
                isAuth: isAuth,
                message: "Successfully GET ALL Permissions By Staff!!!",
                staffData: getStaffDetailWithRole,
                permissions_data: {
                    permission_uuid: getPermissionData.permission_uuid,
                    feature_permission_list: getFeaturePermission
                }
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", isAuth: false }
            }
        }
    }
}