const { Op } = require("sequelize");
const { default: slugify } = require("slugify");



// ROLE HELPER
module.exports = {
    // CREATE ROLES API
    createRole: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // GET DATA
            const { role, role_status } = req;
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
                    role_status: role_status,
                    role_slug: role_slug,
                    tenant_id: TENANTID
                });

                return {
                    roleNo: createrole.role_no,
                    role: createrole.role,
                    roleUUID: createrole.role_uuid,
                    roleSlug: createrole.role_slug,
                    role_status: createrole.role_status,
                    tenant_id: createrole.tenant_id,
                    message: "Successfully Created A Role!!!",
                    status: true
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
    // UPDATE ROLE HELPER
    updateRole: async (req, db, user, isAuth, TENANTID) => {

        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {

            // Data From Request
            const role_uuid = req.role_uuid;
            const role = req.role;
            const role_status = req.role_status;

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
            }

            // Update Doc
            const updateDoc = {
                role,
                role_slug,
                role_status
            }

            // Update Role 
            const updateRole = await db.roles.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateRole) return { message: "Update Gone Wrong!!!", status: false }

            // Find Updated Role
            const updatedRole = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Data
            return {
                message: "Role Updated Successfully!!!",
                status: true,
                data: updatedRole
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!", status: false }
        }

    },
    // DELETE ROLE HELPER
    deleteRole: async (req, db, user, isAuth, TENANTID) => {
        if (!user.role_no || user.role_no === '0') return { message: "Not Authorized", status: false };
        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // TRY CATCH BLOCK
        try {
            // Data From Request
            const { role_uuid } = req;

            // DELETE ROLE
            const deleteRole = await db.roles.destroy({
                where: {
                    [Op.and]: [{
                        role_uuid,
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

    },
    // GET SINGLE ROLE HELPER
    getSingleRole: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const { role_uuid } = req;

            // TENANT ID
            const tenant_id = TENANTID;

            // Find Role 
            const findRole = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_uuid,
                        tenant_id
                    }]
                }
            });

            // If Not Found
            if (!findRole) return { message: "Couldn't GET The Role", status: false }

            // Return 
            return {
                message: "Role GET Success!!!",
                status: true,
                data: findRole
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}