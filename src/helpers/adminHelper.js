// ADMIN HELPER REQUIRES
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { crypt, decrypt } = require('../utils/hashes');
const { verifierEmail } = require('../utils/verifyEmailSender');
const config = require('config');


// HELPER
module.exports = {
    // Admin Sign In HELPER
    adminSignIn: async (req, db, TENANTID) => {

        try {
            const { email, password } = req;

            // Check User
            const user = await db.user.findOne({
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
                { id: user.id, email: user.email, has_role: user.has_role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Update Last Login
            const updateLastLogin = {
                last_login: Date.now()
            }
            db.user.update(updateLastLogin, {
                where: {
                    [Op.and]: [{
                        id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });

            return {
                authToken,
                id: user.id,
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

        // Try Catch Block
        try {

            // Data From Request
            const first_name = req.first_name;
            const last_name = req.last_name;
            const email = req.email;
            const has_role = 1;
            const user_status = req.userStatus;
            const role_ids = req.role_ids;
            // SEND EMAIL REQUEST
            const { sendEmail } = req;


            // Check User Already Exist
            const checkUserExist = await db.user.findOne({
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
                const createStuff = await db.user.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    has_role,
                    verification_code: verificationCode,
                    user_status,
                    tenant_id: TENANTID,
                    created_by: user.id
                });


                // If Admin Created
                if (createStuff) {

                    // Insert Role and User Data
                    // Loop For Assign Other Values to Role Data
                    role_ids.forEach(element => {
                        element.tenant_id = createStuff.tenant_id;
                        element.admin_id = createStuff.id;
                    });

                    // Admin Roles Save Bulk
                    const adminRolesDataSave = await db.admin_role.bulkCreate(role_ids);
                    if (!adminRolesDataSave) return { message: "Admin Role Data Save Failed", status: false }

                    // IF SEND EMAIL IS TRUE
                    if (sendEmail) {
                        let codeHashed = crypt(createStuff.email); // TODO ->> SEND THIS ON SET PASSWORD PARAMS
                        // SET PASSWORD URL
                        const setPasswordURL = config.get("ADMIN_URL").concat(config.get("SET_PASSWORD"));

                        // Setting Up Data for EMAIL SENDER
                        const mailData = {
                            email: createStuff.email,
                            subject: "Admin Created Successfully for Primer Server Parts",
                            message: `Your 6 Digit Verification Code is ${createStuff.verification_code}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your SET NEW PASSWORD Link is: ${setPasswordURL.concat(codeHashed)}`
                        }

                        // SENDING EMAIL
                        await verifierEmail(mailData);
                    }


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
                    has_role,
                    email_verified: false,
                    user_status,
                    verification_code: verificationCode,
                    updated_by: user.id
                }

                const updateUserToStuff = await db.user.update(updateDoc, {
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
                    const updatedStuffData = await db.user.findOne({
                        where: {
                            [Op.and]: [{
                                email: userEmail,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Loop For Assign Other Values to Role Data
                    role_ids.forEach(element => {
                        element.tenant_id = updatedStuffData.tenant_id;
                        element.admin_id = updatedStuffData.id;
                    });

                    // Permissions Bulk Create
                    const adminRolesDataSave = await db.admin_role.bulkCreate(role_ids);
                    if (!adminRolesDataSave) return { message: "Admin Role Data Save Failed", status: false }


                    const { email: updatedStuffEmail, verification_code: updatedStuffVerficationCode } = updatedStuffData;

                    // IF SEND EMAIL IS TRUE
                    if (sendEmail) {
                        let codeHashed = crypt(createStuff.email); // TODO ->> SEND THIS ON SET PASSWORD PARAMS
                        // SET PASSWORD URL
                        const setPasswordURL = config.get("ADMIN_URL").concat(config.get("SET_PASSWORD"));
                        // Setting Up Data for EMAIL SENDER
                        const mailData = {
                            email: updatedStuffEmail,
                            subject: "Admin Updated Verification Code From Primer Server Parts",
                            message: `Your 6 Digit Verification Code is ${updatedStuffVerficationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your SET NEW PASSWORD Link is: ${setPasswordURL.concat(codeHashed)}`
                        }

                        // SENDING EMAIL
                        await verifierEmail(mailData);
                    }

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
    },
    // SET PASSWORD HELPER
    setPassword: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { verificationCode, codeHashed, newPassword, confirmPassword } = req;
            // decrypting Code for email
            const email = decrypt(codeHashed);

            // Check The Passwords are Equal
            if (newPassword != confirmPassword) return { message: "Password Didn't Matched!!!", status: false }

            // Find User 
            const findUser = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findUser) return { message: "User Not Found!!!", status: false };

            // Check Verification Code is Valid or Not
            const { verification_code, updatedAt } = findUser;
            // Time Calculating
            const reqTime = new Date();
            const recordTime = new Date(updatedAt);

            // Calculating Minutes
            let minutes = ((recordTime.getTime() - reqTime.getTime()) / 1000) / 60;
            // Difference
            const diffs = Math.abs(Math.round(minutes));

            // IF Difference Less than or Equal to 20 minutes
            if (diffs <= 20) {
                // Matching Codes
                if (verification_code === verificationCode) {
                    // Updating Doc
                    const updateDoc = {
                        password: await bcrypt.hash(confirmPassword, 10),
                        email_verified: true
                    }
                    // Update User
                    const updateUser = await db.user.update(updateDoc, {
                        where: {
                            [Op.and]: [{
                                email,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // If Updated then return values
                    if (updateUser) {
                        return {
                            message: "Your Password Was Set Successfully!!",
                            status: true,
                            tenant_id: TENANTID
                        }
                    } else {
                        return { // If Not updated
                            message: "Failed!!",
                            status: false
                        }
                    }


                } else {
                    return { // If nOt Matched
                        message: "Invalid Code!!!",
                        status: false
                    }
                }


            } else { // If Time Expired

                return {
                    message: "YOUR 6 DIGIT CODE IS EXPIRED!!!",
                    status: false
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    },
    // RESET PASSWORD HELPER
    resetPassword: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { email, permissionName } = req;

            // FIND USER
            const findUser = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findUser) return { message: "USER NOT FOUND!!!", status: false }

            // Email verification Code generate
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            // Update Doc
            const updateDoc = {
                verification_code: verificationCode,
                password: null,
                updated_by: user.id
            }
            // Insert User
            const updateForResetPassword = await db.user.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (updateForResetPassword) {

                let resetPasswordURL;
                let codeHashed = crypt(email);

                if (permissionName === 'user') {
                    // RESET PASSWORD URL
                    resetPasswordURL = config.get("ADMIN_URL").concat(config.get("RESET_PASSWORD"));

                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: email,
                        subject: "Admin Reset Password for Primer Server Parts",
                        message: `Your 6 Digit Verification Code is ${verificationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your RESET PASSWORD Link is: ${resetPasswordURL.concat(codeHashed)}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);

                    // Return Formation
                    return {
                        message: "Successfully Sent Reset Password Link For Reset Password!!!",
                        status: true,
                        tenant_id: TENANTID
                    }

                } else if (permissionName === 'customer') {
                    // RESET PASSWORD URL
                    resetPasswordURL = config.get("ECOM_URL").concat(config.get("RESET_PASSWORD"));

                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: email,
                        subject: "Reset Password for Primer Server Parts",
                        message: `Your 6 Digit Verification Code is ${verificationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your RESET PASSWORD Link is: ${resetPasswordURL.concat(codeHashed)}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);

                    // Return Formation
                    return {
                        message: "Successfully Sent Reset Password Link For Reset Password!!!",
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