// ADMIN HELPER REQUIRES
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { verifierEmail } = require('../utils/verifyEmailSender');


// HELPER
module.exports = {
    // Admin Sign In HELPER
    adminSignIn: async (req, db, TENANTID) => {

        try {
            const { email, password } = req;

            // Check User
            const user = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        email: email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!user) {
                return {
                    message: "USER NOT FOUND",
                    status: false,
                };
            }

            // Check Is Valid
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return {
                    message: "USER NOT FOUND",
                    status: false,
                };
            }

            // Check Roles
            const { has_role } = user;

            if (has_role === '0') return {
                message: "USER NOT FOUND",
                status: false,
            };

            // IF USER STATUS IS FALSE
            const isActive = user.user_status;
            if (!isActive) {
                return {
                    message: "STAFF IS DISABLED",
                    status: false
                }
            }

            // return jwt
            const authToken = jwt.sign(
                { uid: user.uid, email: user.email, has_role: user.has_role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                authToken,
                uid: user.uid,
                email: user.email,
                message: "Sign In succesfull",
                emailVerified: user.email_verified,
                first_name: user.first_name,
                last_name: user.last_name,
                user_status: user.user_status,
                status: true
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }


    },
    // Admin Sign Up Helper
    adminSignUp: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: req.email, status: false };
        if (user.has_role === '0') return { message: "Not Authorized", email: req.email, status: false };


        // Try Catch Block
        try {

            // Data From Request
            const first_name = req.first_name;
            const last_name = req.last_name;
            const email = req.email;
            const password = req.password;
            const has_role = 1;
            const user_status = req.userStatus;
            const roleUUID = req.roleUUID;


            // Check User Already Exist
            const checkUserExist = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Email verification Code generate
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            // Insert or Update By Condition
            if (!checkUserExist) {

                // Insert User
                const createStuff = await db.users.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: await bcrypt.hash(password, 10),
                    has_role,
                    verification_code: verificationCode,
                    user_status,
                    tenant_id: TENANTID
                });


                // If Admin Created
                if (createStuff) {

                    // Insert Role and User Data
                    // Loop For Assign Other Values to Role Data
                    roleUUID.forEach(element => {
                        element.tenant_id = createStuff.tenant_id;
                        element.admin_uuid = createStuff.uid;
                    });

                    // Admin Roles Save Bulk
                    const adminRolesDataSave = await db.admin_roles.bulkCreate(roleUUID);
                    if (!adminRolesDataSave) return { message: "Admin Role Data Save Failed", status: false }

                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: createStuff.email,
                        subject: "Admin Verification Code From Primer Server Parts",
                        message: `Your 6 Digit Verification Code is ${createStuff.verification_code}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your Password: ${password}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);

                    return {
                        message: "Successfully Registered a Staff and Saved Role Data!!",
                        tenant_id: createStuff.tenant_id,
                        status: true
                    }
                } else {
                    return { message: "Something Went Wrong!!!", email: email, status: false };
                }

            } else {

                // Email From Existing user
                const { email: userEmail } = checkUserExist;

                // Update Data for Existing User Data
                const updateDoc = {
                    first_name: first_name,
                    last_name: last_name,
                    password: await bcrypt.hash(password, 10),
                    has_role,
                    email_verified: false,
                    user_status,
                    verification_code: verificationCode
                }

                const updateUserToStuff = await db.users.update(updateDoc, {
                    where: {
                        [Op.and]: [{
                            email: userEmail,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // If updated data 
                if (updateUserToStuff) {


                    // Find Updated User
                    const updatedStuffData = await db.users.findOne({
                        where: {
                            [Op.and]: [{
                                email: userEmail,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Loop For Assign Other Values to Role Data
                    roleUUID.forEach(element => {
                        element.tenant_id = updatedStuffData.tenant_id;
                        element.admin_uuid = updatedStuffData.uid;
                    });

                    // Permissions Bulk Create
                    const adminRolesDataSave = await db.admin_roles.bulkCreate(roleUUID);
                    if (!adminRolesDataSave) return { message: "Admin Role Data Save Failed", status: false }


                    const { email: updatedStuffEmail, verification_code: updatedStuffVerficationCode } = updatedStuffData;

                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: updatedStuffEmail,
                        subject: "Admin Updated Verification Code From Primer Server Parts",
                        message: `Your 6 Digit Verification Code is ${updatedStuffVerficationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your Password: ${password}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);


                    // Return Final Data
                    return {
                        message: "Successfully Updated and Registered as a Stuff and Saved Role Data!!",
                        tenant_id: updatedStuffData.tenant_id,
                        status: true
                    }

                } else {
                    return { message: "Something Went Wrong!!!", email: email, status: false };
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}