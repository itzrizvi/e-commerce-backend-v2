// All requires
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const { deleteFile, singleFileUpload } = require("../utils/fileUpload");
const config = require('config');
const { verifierEmail } = require("../utils/verifyEmailSender");

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
            const { uid, first_name, last_name, password, roleUUID, user_status, image, sendEmail } = req;

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
                user_status,
                image: null
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

                // Find User to Get Image Name
                const findUser = await db.users.findOne({
                    where: {
                        [Op.and]: [{
                            uid,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // IF SEND EMAIL IS TRUE
                if (sendEmail) {
                    // If Password is Also Changed Changed
                    let mailData
                    if (password) {
                        // Setting Up Data for EMAIL SENDER
                        mailData = {
                            email: findUser.email,
                            subject: "Password Changed on Prime Server Parts",
                            message: `Your Prime Server Parts Account Password is Changed. If this is not you please contact to Support!!!`
                        }
                    } else {
                        // Setting Up Data for EMAIL SENDER
                        mailData = {
                            email: findUser.email,
                            subject: "Account Update on Prime Server Parts",
                            message: `Your Prime Server Parts Account details has been updated. If this is not you please contact to Support!!!`
                        }
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);
                }



                // IF Image Also Updated
                if (image && findUser.image) {
                    // Delete Previous S3 Image For this User
                    const user_image_src = config.get("AWS.USER_IMG_DEST").split("/");
                    const user_image_bucketName = user_image_src[0];
                    const user_image_folder = user_image_src.slice(1);
                    await deleteFile({ idf: uid, folder: user_image_folder, fileName: findUser.image, bucketName: user_image_bucketName });
                }

                // Upload New Image to S3
                if (image) {
                    // Upload Image to AWS S3
                    const user_image_src = config.get("AWS.USER_IMG_SRC").split("/");
                    const user_image_bucketName = user_image_src[0];
                    const user_image_folder = user_image_src.slice(1);
                    const imageUrl = await singleFileUpload({ file: image, idf: uid, folder: user_image_folder, fileName: uid, bucketName: user_image_bucketName });
                    if (!imageUrl) return { message: "New Image Couldnt Uploaded Properly!!!", status: false };

                    // Update Brand with New Image Name
                    const imageName = imageUrl.Key.split('/').slice(-1)[0];

                    // Find and Update Brand Image Name By UUID
                    const userImageUpdate = {
                        image: imageName
                    }
                    // Update Brand Image
                    const updateUser = await db.users.update(userImageUpdate, {
                        where: {
                            [Op.and]: [{
                                uid,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    // If not updated
                    if (!updateUser) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
                }


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
        // try {

        // UID from Request
        const { uid } = req;

        // Accociation with 3 tables
        db.users.belongsToMany(db.roles, { through: db.admin_roles, sourceKey: 'uid', foreignKey: 'admin_uuid' });
        db.roles.belongsToMany(db.users, { through: db.admin_roles, sourceKey: 'role_uuid', foreignKey: 'role_uuid' });

        // Check If User Has Alias or Not 
        if (!db.roles.hasAlias('permissions_data') && !db.roles.hasAlias('permissions')) {
            await db.roles.hasMany(db.permissions_data, { sourceKey: 'role_uuid', foreignKey: 'role_uuid', as: 'permissions' });
        }

        // Check If User Has Alias or Not 
        if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
            await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_uuid', foreignKey: 'roles_permission_uuid', as: 'rolesPermission' });
        }

        // GET ALL STAFF QUERY
        const getAdmin = await db.users.findOne({
            where: {
                [Op.and]: [{
                    uid,
                    tenant_id: TENANTID
                }]

            },
            include: {
                model: db.roles, as: 'roles',
                include: {
                    model: db.permissions_data, as: 'permissions',
                    include: { model: db.roles_permission, as: 'rolesPermission' },
                    separate: true,
                    order: [[{ model: db.roles_permission, as: 'rolesPermission' }, 'roles_permission_name', 'ASC']]
                },
            },

            order: [[db.roles, 'role', 'ASC']]
        });

        // Return Formation
        return {
            data: getAdmin,
            message: "Single Staff/Admin GET Success!!!",
            status: true,
            tenant_id: TENANTID
        }



        // } catch (error) {
        //     if (error) return { message: "Something Went Wrong!!!", status: false }
        // }
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

                // Find User to Get Image Name
                const findUser = await db.users.findOne({
                    where: {
                        [Op.and]: [{
                            uid,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If Update Success
                // Setting Up Data for EMAIL SENDER
                const mailData = {
                    email: findUser.email,
                    subject: "Password Changed on Prime Server Parts",
                    message: `Your Prime Server Parts Account Password is Changed. If this is not you please contact to Support!!!`
                }
                // SENDING EMAIL
                await verifierEmail(mailData);

                // Return Formation
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