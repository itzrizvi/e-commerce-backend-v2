const { Op } = require("sequelize");


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


    }

}