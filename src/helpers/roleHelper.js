const { Op } = require("sequelize");
const { default: slugify } = require("slugify");



// ROLE HELPER
module.exports = {
    // GET ALL ROLES API
    getAllRoles: async (db, user, isAuth, TENANTID) => {
        // Return if No Auth
        if (!user || !isAuth) return { message: "Not Authenticated", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        try {
            // GET ALL ROLES
            const getAllRoles = await db.roles.findAll({ where: { tenant_id: TENANTID } });

            return {
                data: getAllRoles,
                isAuth: isAuth,
                message: "All Roles GET Success!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }



    },
    // CREATE ROLES API
    createRole: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };


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
                role_slug: role_slug,
                tenant_id: TENANTID
            });

            return {
                roleNo: createrole.role_no,
                role: createrole.role,
                roleUUID: createrole.role_uuid,
                roleSlug: createrole.role_slug,
                message: "Successfully Created A Role!!!",
                status: true
            }

        } else {
            return { message: "Already Have This Role", status: false }
        }


    }
}