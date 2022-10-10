// All requires
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

// STUFF HELPER
module.exports = {
    // GET ALL STAFF API
    getAllStaff: async (db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };

        // Try Catch Block
        try {

            // Associations MANY TO MANY
            db.users.belongsToMany(db.roles, { through: db.admin_roles, sourceKey: 'uid', foreignKey: 'admin_uuid' });
            db.roles.belongsToMany(db.users, { through: db.admin_roles, sourceKey: 'role_uuid', foreignKey: 'role_uuid' });

            // GET ALL STAFF QUERY
            const getAllStaff = await db.users.findAll({
                where: {
                    [Op.and]: [{
                        has_role: { [Op.ne]: '0' },
                        tenant_id: TENANTID
                    }]

                },
                include: db.roles,
                order: [['first_name', 'ASC'], [db.roles, 'role', 'ASC']]
            });

            // Return Formation
            return {
                data: getAllStaff,
                isAuth: isAuth,
                message: "All Staff GET Success!!!",
                status: true
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", isAuth: false, data: [], status: false }
            }
        }


    },
    // Admin/ Staff Update 
    adminUpdate: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request
            const { uid, first_name, last_name, password, roleUUID, user_status } = req;

            // if Password available
            let encryptPassword;
            if (password) {
                encryptPassword = await bcrypt.hash(password, 10);
            }

            // Update User Table Doc
            const updateUserDoc = {
                first_name,
                last_name,
                password: encryptPassword,
                user_status
            }

            // Update User Table 
            const updateAdminUser = await db.users.update(updateUserDoc, {
                where: {
                    [Op.and]: [{
                        uid,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateAdminUser) { // IF USER UPDATED

                // ROLE ALSO UPDATED
                if (roleUUID) {
                    // Loop For Assign Other Values to Role Data
                    roleUUID.forEach(element => {
                        element.tenant_id = TENANTID;
                        element.admin_uuid = uid;
                    });

                    // Delete Previous Entry
                    const deletePreviousEntry = await db.admin_roles.destroy({
                        where: {
                            [Op.and]: [{
                                admin_uuid: uid,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    // If Not Deleted
                    if (!deletePreviousEntry) return { message: "Previous Admin Role Delete Failed!!!!", status: false }

                    // Update Admin Roles Bulk
                    const adminRolesDataUpdate = await db.admin_roles.bulkCreate(roleUUID);
                    if (!adminRolesDataUpdate) return { message: "Admin Role Data Udpate Failed", status: false }

                    // Return
                    return {
                        message: "Role and Admin Update Success!!!",
                        status: true,
                        tenant_id: TENANTID
                    }


                } else {
                    // Return 
                    return {
                        message: "Admin Update Success!!!",
                        status: true,
                        tenant_id: TENANTID
                    }
                }

            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET SINGLE Admin/Staff
    getSingleAdmin: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // UID from Request
            const { uid } = req;

            // Accociation with 3 tables
            db.users.belongsToMany(db.roles, { through: db.admin_roles, sourceKey: 'uid', foreignKey: 'admin_uuid' });
            db.roles.belongsToMany(db.users, { through: db.admin_roles, sourceKey: 'role_uuid', foreignKey: 'role_uuid' });

            // GET ALL STAFF QUERY
            const getAdmin = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        uid,
                        tenant_id: TENANTID
                    }]

                },
                include: db.roles,
                order: [[db.roles, 'role', 'ASC']]
            });

            // Return Formation
            return {
                data: getAdmin,
                message: "All Staff GET Success!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Admin/Staff Password Change
    adminPasswordChange: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request 
            const { uid, oldPassword, newPassword } = req;

            // FIND ADMIN FIRST
            const findAdmin = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        uid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // GET OLD PASSWORD FROM DB
            const { password } = findAdmin;

            // Check Old Password Is Matching or Not
            const isMatched = await bcrypt.compare(oldPassword, password);
            // IF NOT MATCHED
            if (!isMatched) return { message: "Unauthorized Request!!!", status: false };

            // Update Password Doc
            const updatePassDoc = {
                password: await bcrypt.hash(newPassword, 10)
            }

            // Update With New Password
            const updateAdmin = await db.users.update(updatePassDoc, {
                where: {
                    [Op.and]: [{
                        uid,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateAdmin) {
                return {
                    message: "Password Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID

                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }

}