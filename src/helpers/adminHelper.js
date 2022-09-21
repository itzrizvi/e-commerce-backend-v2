// ADMIN HELPER REQUIRES
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifierEmail } = require('../utils/verifyEmailSender');


// HELPER
module.exports = {
    // Admin Sign In HELPER
    adminSignIn: async (req, db) => {

        try {
            const { email, password } = req;

            // Check User
            const user = await db.users.findOne({ where: { email } });
            if (!user) {
                return {
                    authToken: "NO TOKEN",
                    uid: "NO UID",
                    email: "NOT FOUND",
                    message: "USER NOT FOUND",
                    emailVerified: false,
                };
            }

            // Check Is Valid
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return {
                    authToken: "NO TOKEN",
                    uid: "NO UID",
                    email: "NOT FOUND",
                    message: "USER NOT FOUND",
                    emailVerified: false
                };
            }

            // Check Roles
            const { role_no } = user;
            const checkRoleExist = await db.roles.findOne({ where: { role_no } });
            if (!checkRoleExist || checkRoleExist.role_no === '0') return {
                authToken: "NO TOKEN",
                uid: "NO UID",
                email: "NOT FOUND",
                message: "USER NOT FOUND",
                emailVerified: false
            };

            // return jwt
            const authToken = jwt.sign(
                { uid: user.uid, email: user.email },
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
                roleNo: checkRoleExist.role_no
            }

        } catch (error) {
            throw new Error(error.message)
        }


    },
    // Admin Sign Up Helper
    adminSignUp: async (req, db, user, isAuth) => {
        // Return If No Auth and No Role
        if (!user || !isAuth) return { message: "Not Authorized", email: req.email };
        if (user.role_no === '0') return { message: "Not Authorized", email: req.email };

        // Data From Request
        const first_name = req.first_name;
        const last_name = req.last_name;
        const email = req.email;
        const password = req.password;
        const role_no = req.roleNo;

        // Find Role according to role_no
        const findRoleDetails = await db.roles.findOne({ where: { role_no } });
        if (!findRoleDetails) return { message: "The Assigned Role Must be Created First!!", email: email }

        // Check User Already Exist
        const checkUserExist = await db.users.findOne({ where: { email } });

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
                verification_code: verificationCode
            });


            // If Admin Created
            if (createStuff) {

                // Token generate
                const authToken = jwt.sign(
                    { uid: createStuff.uid, email: createStuff.email },
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
                    message: "Successfully Registered a Stuff!!",
                    emailVerified: createStuff.email_verified,
                    updatedAt: createStuff.updatedAt,
                    createdAt: createStuff.createdAt,
                    roleNo: createStuff.role_no,
                    role: findRoleDetails.role,
                    roleSlug: findRoleDetails.role_slug,
                }
            } else {
                return { message: "Something Went Wrong!!!", email: email };
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
                verification_code: verificationCode
            }
            const updateUserToStuff = await db.users.update(updateDoc, { where: { email: userEmail } });

            // If updated data 
            if (updateUserToStuff) {

                // Find Updated User
                const updatedStuffData = await db.users.findOne({ where: { email: userEmail } });
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
                    { uid: updatedStuffData.uid, email: updatedStuffData.email },
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
                    updatedAt: updatedStuffData.updatedAt,
                    createdAt: updatedStuffData.createdAt,
                    roleNo: updatedStuffData.role_no,
                    role: findRoleDetails.role,
                    roleSlug: findRoleDetails.role_slug,
                }

            } else {
                return { message: "Something Went Wrong!!!", email: email };
            }
        }
    }
}