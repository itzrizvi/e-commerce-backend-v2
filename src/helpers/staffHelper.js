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

        // Try Catch Block
        try {

            // Associations MANY TO MANY
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // GET ALL STAFF QUERY
            const getAllStaff = await db.user.findAll({
                where: {
                    [Op.and]: [{
                        has_role: { [Op.ne]: '0' },
                        tenant_id: TENANTID
                    }]

                },
                include: db.role,
                order: [['first_name', 'ASC'], [db.role, 'role', 'ASC']]
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
            const { id, first_name, last_name, role_ids, user_status, image, sendEmail } = req;

            // Update User Table Doc
            const updateUserDoc = {
                first_name,
                last_name,
                user_status,
                image: null,
                updated_by: user.id
            }

            // Update User Table 
            const updateAdminUser = await db.user.update(updateUserDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateAdminUser) { // IF USER UPDATED

                // Find User to Get Image Name
                const findUser = await db.user.findOne({
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // IF SEND EMAIL IS TRUE
                if (sendEmail) {

                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "Admin Profile Updated From Primer Server Parts"
                    const mailData = {
                        companyInfo: {
                            logo: config.get("SERVER_URL").concat("media/email-assets/logo.jpg"),
                            banner: config.get("SERVER_URL").concat("media/email-assets/banner.jpeg"),
                            companyName: config.get("COMPANY_NAME"),
                            companyUrl: config.get("ECOM_URL"),
                            shopUrl: config.get("ECOM_URL"),
                            fb: config.get("SERVER_URL").concat("media/email-assets/fb.png"),
                            tw: config.get("SERVER_URL").concat("media/email-assets/tw.png"),
                            li: config.get("SERVER_URL").concat("media/email-assets/in.png"),
                            insta: config.get("SERVER_URL").concat("media/email-assets/inst.png")
                        },
                        about: 'Your Profile Has Been Updated on Prime Server Parts',
                        message: `Your Profile Has Been Updated From Prime Server Parts System. If Your Did not recognze it please contact with support team!!!`
                    }

                    // SENDING EMAIL
                    Mail(findUser.email, mailSubject, mailData, 'profile-update-confirmation', TENANTID);
                }



                // IF Image Also Updated
                if (image && findUser.image) {
                    // Delete Previous S3 Image For this User
                    const user_image_src = config.get("AWS.USER_IMG_DEST").split("/");
                    const user_image_bucketName = user_image_src[0];
                    const user_image_folder = user_image_src.slice(1);
                    await deleteFile({ idf: id, folder: user_image_folder, fileName: findUser.image, bucketName: user_image_bucketName });
                }

                // Upload New Image to S3
                if (image) {
                    // Upload Image to AWS S3
                    const user_image_src = config.get("AWS.USER_IMG_SRC").split("/");
                    const user_image_bucketName = user_image_src[0];
                    const user_image_folder = user_image_src.slice(1);
                    const imageUrl = await singleFileUpload({ file: image, idf: id, folder: user_image_folder, fileName: id, bucketName: user_image_bucketName });
                    if (!imageUrl) return { message: "New Image Couldnt Uploaded Properly!!!", status: false };

                    // Update Brand with New Image Name
                    const imageName = imageUrl.Key.split('/').slice(-1)[0];

                    // Find and Update Brand Image Name By UUID
                    const userImageUpdate = {
                        image: imageName
                    }
                    // Update Brand Image
                    const updateUser = await db.user.update(userImageUpdate, {
                        where: {
                            [Op.and]: [{
                                id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    // If not updated
                    if (!updateUser) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
                }


                // ROLE ALSO UPDATED
                if (role_ids) {
                    // Loop For Assign Other Values to Role Data
                    role_ids.forEach(element => {
                        element.tenant_id = TENANTID;
                        element.admin_id = id;
                        element.updated_by = user.id;
                        element.created_by = user.id;
                    });

                    // Delete Previous Entry
                    const deletePreviousEntry = await db.admin_role.destroy({
                        where: {
                            [Op.and]: [{
                                admin_id: id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    // If Not Deleted
                    if (!deletePreviousEntry) return { message: "Previous Admin Role Delete Failed!!!!", status: false }

                    // Update Admin Roles Bulk
                    const adminRolesDataUpdate = await db.admin_role.bulkCreate(role_ids);
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE Admin/Staff
    getSingleAdmin: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // UID from Request
            const { id } = req;

            // Accociation with 3 tables
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If User Has Alias or Not 
            if (!db.role.hasAlias('permissions_data') && !db.role.hasAlias('permissions')) {
                await db.role.hasMany(db.permissions_data, { foreignKey: 'role_id', as: 'permissions' });
            }

            // Check If User Has Alias or Not 
            if (!db.permissions_data.hasAlias('roles_permission') && !db.permissions_data.hasAlias('rolesPermission')) {
                await db.permissions_data.hasOne(db.roles_permission, { sourceKey: 'permission_id', foreignKey: 'id', as: 'rolesPermission' });
            }

            // GET ALL STAFF QUERY
            const getAdmin = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]

                },
                include: {
                    model: db.role, as: 'roles',
                    include: {
                        model: db.permissions_data, as: 'permissions',
                        include: { model: db.roles_permission, as: 'rolesPermission' },
                        separate: true,
                        order: [[{ model: db.roles_permission, as: 'rolesPermission' }, 'roles_permission_name', 'ASC']]
                    },
                },

                order: [[db.role, 'role', 'ASC']]
            });

            // Return Formation
            return {
                data: getAdmin,
                message: "Single Staff/Admin GET Success!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Admin/Staff Password Change
    adminPasswordChange: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Request 
            const { id, oldPassword, newPassword } = req;

            // FIND ADMIN FIRST
            const findAdmin = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        id,
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
            const updateAdmin = await db.user.update(updatePassDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateAdmin) {

                // Find User to Get Image Name
                const findUser = await db.user.findOne({
                    where: {
                        [Op.and]: [{
                            id,
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }

}