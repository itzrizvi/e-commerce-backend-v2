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
            const { role_no } = user;
            const checkRoleExist = await db.roles.findOne({
                where: {
                    [Op.and]: [{
                        role_no,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!checkRoleExist || checkRoleExist.role_no === '0') return {
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
                { uid: user.uid, email: user.email, role_no: user.role_no },
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
                roleNo: checkRoleExist.role_no,
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
        if (user.role_no === '0') return { message: "Not Authorized", email: req.email, status: false };

        // Data From Request
        const first_name = req.first_name;
        const last_name = req.last_name;
        const email = req.email;
        const password = req.password;
        const role_no = req.roleNo;
        const user_status = req.userStatus;

        // Find Role according to role_no
        const findRoleDetails = await db.roles.findOne({
            where: {
                [Op.and]: [{
                    role_no,
                    tenant_id: TENANTID
                }]
            }
        });
        if (!findRoleDetails) return { message: "The Assigned Role Must be Created First!!", email: email, status: false }

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
                role_no: role_no,
                verification_code: verificationCode,
                user_status,
                tenant_id: TENANTID
            });


            // If Admin Created
            if (createStuff) {

                // Token generate
                const authToken = jwt.sign(
                    { uid: createStuff.uid, email: createStuff.email, role_no: createStuff.role_no },
                    process.env.JWT_SECRET,
                    { expiresIn: '1y' }
                );

                // Setting Up Data for EMAIL SENDER
                const mailData = {
                    email: createStuff.email,
                    subject: "Admin Verification Code From Primer Server Parts",
                    message: `Your 6 Digit Verification Code is ${createStuff.verification_code}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your Password: ${password}`
                }

                // SENDING EMAIL
                await verifierEmail(mailData);

                return {
                    authToken: authToken,
                    uid: createStuff.uid,
                    first_name: createStuff.first_name,
                    last_name: createStuff.last_name,
                    email: createStuff.email,
                    message: "Successfully Registered a Staff!!",
                    emailVerified: createStuff.email_verified,
                    user_status: createStuff.user_status,
                    updatedAt: createStuff.updatedAt,
                    createdAt: createStuff.createdAt,
                    roleNo: createStuff.role_no,
                    role: findRoleDetails.role,
                    roleSlug: findRoleDetails.role_slug,
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
                role_no: role_no,
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

                const { email: updatedStuffEmail, verification_code: updatedStuffVerficationCode } = updatedStuffData;

                // Setting Up Data for EMAIL SENDER
                const mailData = {
                    email: updatedStuffEmail,
                    subject: "Admin Updated Verification Code From Primer Server Parts",
                    message: `Your 6 Digit Verification Code is ${updatedStuffVerficationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email. Your email : ${email} and Your Password: ${password}`
                }

                // SENDING EMAIL
                await verifierEmail(mailData);

                // Generate Auth Token
                const authToken = jwt.sign(
                    { uid: updatedStuffData.uid, email: updatedStuffData.email, role_no: updatedStuffData.role_no },
                    process.env.JWT_SECRET,
                    { expiresIn: '1y' }
                );


                // Return Final Data
                return {
                    authToken: authToken,
                    uid: updatedStuffData.uid,
                    first_name: updatedStuffData.first_name,
                    last_name: updatedStuffData.last_name,
                    email: updatedStuffData.email,
                    message: "Successfully Updated and Registered as a Stuff!!",
                    emailVerified: updatedStuffData.email_verified,
                    user_status: updatedStuffData.user_status,
                    updatedAt: updatedStuffData.updatedAt,
                    createdAt: updatedStuffData.createdAt,
                    roleNo: updatedStuffData.role_no,
                    role: findRoleDetails.role,
                    roleSlug: findRoleDetails.role_slug,
                    tenant_id: updatedStuffData.tenant_id,
                    status: true
                }

            } else {
                return { message: "Something Went Wrong!!!", email: email, status: false };
            }
        }
    }
}