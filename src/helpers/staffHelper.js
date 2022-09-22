const { Op, DataTypes } = require("sequelize");
const { default: slugify } = require("slugify");



// STUFF HELPER
module.exports = {
    // GET ALL STAFF API
    getAllStaff: async (db, user, isAuth) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated" };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [] };

        // CHECK ACCESS
        const roleNo = user.role_no;
        const checkRoleForAccess = await db.roles.findOne({ where: { role_no: roleNo } });

        // CHECK ACCESS
        if (checkRoleForAccess) {
            // GET ALL STAFFS

            // db.users.hasOne(db.roles, { foreignKey: { type: DataTypes.BIGINT, name: 'role_no' }, as: 'roles' });
            // db.roles.hasMany(db.users, { foreignKey: { type: DataTypes.BIGINT, name: 'role_no' }, as: 'users' });
            // db.roles.belongsTo(db.users, { foreignKey: { type: DataTypes.BIGINT, name: 'role_no' } });

            // const getAllStaff = await db.users.findAll({ where: { role_no: { [Op.ne]: '0' } }, include: [{ model: db.roles, as: 'roles' }] });
            const getAllStaff = await db.users.findAll({ where: { role_no: { [Op.ne]: '0' } } });

            console.log(getAllStaff)
            // return {
            //     data: getAllStaff,
            //     isAuth: isAuth,
            //     message: "All Staff GET Success!!!",
            // }
        } else {
            return { message: "Not Authorized", isAuth: false, data: [] }
        }




    }

}