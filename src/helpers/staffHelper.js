const { Op } = require("sequelize");


// STUFF HELPER
module.exports = {
    // GET ALL STAFF API
    getAllStaff: async (db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [], status: false };

        try {
            // CHECK ACCESS
            const roleNo = user.role_no;
            const checkRoleForAccess = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_no: roleNo,
                        tenant_id: TENANTID
                    }]
                }
            });

            // CHECK ACCESS
            if (checkRoleForAccess) {
                // Check If Has Alias 
                if (!db.users.hasAlias('roles')) {
                    await db.users.hasOne(db.roles, { sourceKey: 'role_no', foreignKey: 'role_no', as: 'roles' });
                }

                // GET ALL STAFF QUERY
                const getAllStaff = await db.users.findAll({
                    include: [{ model: db.roles, as: 'roles' }], where: {
                        [Op.and]: [{
                            role_no: { [Op.ne]: '0' },
                            tenant_id: TENANTID
                        }]
                    }
                });

                return {
                    data: getAllStaff,
                    isAuth: isAuth,
                    message: "All Staff GET Success!!!",
                    status: true
                }
            } else {
                return { message: "Not Authorized", isAuth: false, data: [], status: false }
            }

        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", isAuth: false, data: [], status: false }
            }
        }


    }

}