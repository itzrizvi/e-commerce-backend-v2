const { default: slugify } = require("slugify");



// ROLE HELPER
module.exports = {
    // GET ALL ROLES API
    getAllRoles: async (db, user, isAuth) => {
        // Return if No Auth
        if (!user || !isAuth) return { data: [], isAuth: false, message: "Not Authenticated" };
        if (user.role_no === '0') return { message: "Not Authorized", isAuth: false, data: [] };

        // CHECK ACCESS
        const roleNo = user.role_no;
        const checkRoleForAccess = await db.roles.findOne({ where: { role_no: roleNo } });

        // CHECK ACCESS
        if (checkRoleForAccess) {
            // GET ALL ROLES
            const getAllRoles = await db.roles.findAll();

            return {
                data: getAllRoles,
                isAuth: isAuth,
                message: "All Roles GET Success!!!",
            }
        } else {
            return { message: "Not Authorized", isAuth: false, data: [] }
        }




    },
    // CREATE ROLES API
    createRole: async (req, db, user, isAuth) => {
        // ROLE CHECK
        const { role_no } = user;
        const checkRole = await db.roles.findOne({ where: { role_no } });
        if (!checkRole || checkRole.role_no === '0') return { message: "Not Authorized", roleNo: 00, role: "No Role", roleUUID: "No UUID", roleSlug: "No Slug" };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", roleNo: 00, role: "No Role", roleUUID: "No UUID", roleSlug: "No Slug" };


        // GET DATA
        const { role } = req;
        // Create Slug
        const role_slug = slugify(`${role}`, {
            replacement: '-',
            remove: /[*+~.()'"!:@]/g,
            lower: true,
            strict: true,
            trim: true
        });

        // Check The Role Is Already Taken or Not
        const checkRoleExist = await db.roles.findOne({ where: { role_slug: role_slug } });

        // Create Random String for Role No
        const roleNo = Math.ceil(Date.now() + Math.random());


        // If Not Exists then create
        if (!checkRoleExist) {
            const createrole = await db.roles.create({
                role_no: roleNo,
                role: role,
                role_slug: role_slug
            });

            return {
                roleNo: createrole.role_no,
                role: createrole.role,
                roleUUID: createrole.role_uuid,
                roleSlug: createrole.role_slug,
                message: "Successfully Created A Role!!!"
            }

        } else {
            return { message: "Already Have This Role", roleNo: 00, role: "No Role", roleUUID: "No UUID", roleSlug: "No Slug" }
        }


    }
}