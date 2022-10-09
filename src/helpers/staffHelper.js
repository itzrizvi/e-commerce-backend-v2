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
                include: db.roles
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

            // Update User Table Doc
            const updateUserDoc = {
                first_name,
                last_name,
                password: await bcrypt.hash(password, 10),
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
    }

}