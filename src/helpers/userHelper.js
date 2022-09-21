//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifierEmail } = require('../utils/verifyEmailSender');
const CryptoJS = require('crypto-js');

module.exports = {
    // SIGN UP
    userSignUp: async (req, db) => {
        try {

            const { first_name, last_name, email, password } = req;
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            const user = await db.users.create({
                first_name,
                last_name,
                email,
                password: await bcrypt.hash(password, 10),
                verification_code: verificationCode
            });

            const authToken = jwt.sign(
                { uid: user.uid, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            );

            // Setting Up Data for EMAIL SENDER
            const mailData = {
                email: user.email,
                subject: "Verification Code From Primer Server Parts",
                message: `Your 6 Digit Verification Code is ${user.verification_code}. This Code Will Be Valid Till 20 Minutes From You Got The Email!!!`
            }

            // SENDING EMAIL
            await verifierEmail(mailData);

            return {
                authToken,
                uid: user.uid,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                emailVerified: user.email_verified,
                message: "Sign Up succesfull",
                verificationCode: user.verification_code,
                updatedAt: user.createdAt,
                createdAt: user.updatedAt
            }

        } catch (error) {
            throw new Error(error.message)
        }
    },
    // SIGN IN
    userSignIn: async (req, db) => {

        try {
            // DATA FROM REQUEST
            const { email, password } = req;

            // CHECK USER
            const user = await db.users.findOne({ where: { email } });
            if (!user) {
                return {
                    authToken: "NO TOKEN",
                    uid: "NO UID",
                    first_name: "NOT FOUND",
                    last_name: "NOT FOUND",
                    email: "NOT FOUND",
                    message: "USER NOT FOUND",
                    emailVerified: false,
                    verificationCode: 0,
                    updatedAt: "NO DATE",
                    createdAt: "NO DATE"
                };
            }

            // CHECK IS VALID
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return {
                    authToken: "NO TOKEN",
                    uid: "NO UID",
                    first_name: "NOT FOUND",
                    last_name: "NOT FOUND",
                    email: "NOT FOUND",
                    message: "USER NOT FOUND",
                    emailVerified: false,
                    verificationCode: 0,
                    updatedAt: "NO DATE",
                    createdAt: "NO DATE"
                };
            }

            // const { role_no: roleNo } = checkRoleExist;
            // roleNO: CryptoJS.AES.encrypt(roleNo, process.env.ROLE_SECRET).toString() ##### TESTING PURPOSE

            // return jwt
            const authToken = jwt.sign(
                { uid: user.uid, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '4h' }
            );

            return {
                authToken,
                uid: user.uid,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                message: "Sign In succesfull",
                emailVerified: user.email_verified,
                verificationCode: user.verification_code,
                updatedAt: user.createdAt,
                createdAt: user.updatedAt
            }

        } catch (error) {
            throw new Error(error.message)
        }
    },
    // Email Verify
    verifyEmail: async (req, db, user, isAuth) => {
        if (!user || !isAuth) return { emailVerified: false, isAuth: false, message: "Not Authenticated", email: "Not Found!" }; // RReturn if not auth

        const email = user.email; // Email From Request

        // User Find For Matching Code
        const findUser = await db.users.findOne({ where: { email } });

        // IF Not User
        if (!findUser) {
            return { emailVerified: false, isAuth: true, message: "Something Went Wrong", email: email };
        };

        // Destructure Values
        const { updatedAt, verification_code } = findUser;

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
            if (verification_code === req.verificationCode) {
                // Updating Doc
                const updateDoc = {
                    email_verified: true
                }
                // Update User
                const updateUser = await db.users.update(updateDoc, { where: { email } });

                // If Updated then return values
                if (updateUser) {
                    return {
                        email: email,
                        emailVerified: true,
                        message: "Email Verified Successfully!!",
                        isAuth: isAuth
                    }
                } else {
                    return { // If Not updated
                        email: email,
                        emailVerified: false,
                        message: "ERROR WHEN MATCHING",
                        isAuth: isAuth
                    }
                }


            } else {
                return { // If nOt Matched
                    email: email,
                    emailVerified: false,
                    message: "CODE DIDN'T MATCHED",
                    isAuth: isAuth
                }
            }


        } else { // If Time Expired

            return {
                email: email,
                emailVerified: false,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Resend Code From Profile!!!",
                isAuth: isAuth
            }
        }



    },
    // Resend Email For Verification
    resendVerificationEmail: async (req, db, user, isAuth) => {
        if (!user || !isAuth) return { message: "Not Authenticated", email: "Not Found!" }; // RReturn if not auth

        const confirmEmail = req.email === user.email; // Confirm that requested email and Auth Email is same


        if (confirmEmail) { // Condirm Condition

            // EMAIL FROM REQUEST
            const email = req.email;
            // NEW VERIFICATION CODE GENERATE
            const newVerificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            // Updating Doc
            const updateDoc = {
                verification_code: newVerificationCode
            }
            // Update User
            const updateUser = await db.users.update(updateDoc, { where: { email } });



            // If Updated then return values
            if (updateUser) {

                // Setting Up Data for EMAIL SENDER
                const mailData = {
                    email: email,
                    subject: "Verification Code From Primer Server Parts",
                    message: `Your NEW 6 Digit Verification Code is ${newVerificationCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email!!!`
                }

                // SENDING EMAIL
                await verifierEmail(mailData);
                // Return The Response
                return {
                    email: email,
                    message: "A New 6 Digit Verification Code Has Been Sent to Your Email!!"
                }
            } else {
                return { // If Not updated
                    email: email,
                    message: "Failed To Send New Code"
                }
            }

        } else {

            return { message: "Not Authenticated", email: "Not Found!" }

        }
    },
    // Forgot Password Initiation Helper (STEP 1)
    forgotPassInit: async (req, db) => {

        // GET EMAIL FROM REQUEST
        const email = req.email;

        // Check User is Exists
        const checkUser = await db.users.findOne({ where: { email } });

        // IF USer Exists
        if (checkUser) {
            // GENERATE FORGOT PASS VERIFY CODE
            const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            // Updating Doc
            const updateDoc = {
                forgot_password_code: forgotPasswordCode
            }
            // Update User
            const updateUser = await db.users.update(updateDoc, { where: { email } });

            // IF USER UPDATED
            if (updateUser) {

                // Setting Up Data for EMAIL SENDER
                const mailData = {
                    email: email,
                    subject: "Reset Password Verification Code From Primer Server Parts",
                    message: `Your Reset Password Verification 6 Digit Code is ${forgotPasswordCode}. This Code Will Be Valid Till 20 Minutes From You Got The Email!!!`
                }

                // SENDING EMAIL FOR RESET PASSWORD
                await verifierEmail(mailData);

                // Return The Response
                return {
                    message: "A Reset Password Verification Code is Sent to Your Email!!!",
                    email: email
                }

            } else { // ELSE USER COULDN"T UPDATE
                return {
                    message: "Something Went Wrong Try Again!!!",
                    email: email
                }
            }

        } else { // IF USER NOT FOUND
            return {
                message: "User Not Found, Please Enter Your Account Email!!!",
                email: email
            }
        }

    },
    // Forgot Password Code Match Helper (STEP 2)
    forgotPassCodeMatch: async (req, db) => {

        // FORGOT PASS CODE AND EMAIL FROM REQ
        const email = req.email;
        const forgotPassVerifyCode = req.forgotPassVerifyCode;

        // CHECK USER 
        const checkUser = await db.users.findOne({ where: { email } });

        if (!checkUser) return { email: email, message: "Please Enter Valid Details!!!" };

        // Destructure From User
        const { forgot_password_code, updatedAt } = checkUser;

        // Time Calculating
        const reqTime = new Date();
        const recordTime = new Date(updatedAt);
        // Calculating Minutes
        let minutes = ((recordTime.getTime() - reqTime.getTime()) / 1000) / 60;
        // Difference
        const diffs = Math.abs(Math.round(minutes));

        // IF Difference Less than or Equal to 20 minutes
        if (diffs <= 20) {

            // Check the code is matched or not
            const matchedOrNot = forgotPassVerifyCode === forgot_password_code;

            // Code match condition
            if (matchedOrNot) {
                return {
                    email: email,
                    message: "Code Matched, Proceeding To Next Step!!!"
                }
            } else { // If not matched
                return {
                    email: email,
                    message: "Please Enter Valid Details!!!"
                }
            }


        } else { // If Time Expired

            return {
                email: email,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Start Again From The Beginning!!!"
            }
        }


    },
    // Forgot Password Final (STEP 3)
    forgotPassFinal: async (req, db) => {

        // Details From Request 
        const email = req.email;
        const forgotPassVerifyCode = req.forgotPassVerifyCode;
        const newPassword = req.newPassword;
        const confirmPassword = req.confirmPassword;

        // CHECK USER 
        const checkUser = await db.users.findOne({ where: { email } });

        if (!checkUser) return { email: email, message: "Please Enter Valid Details!!!" }; // If user not found by Email

        // Check Password Match
        const passwordMatch = newPassword === confirmPassword;
        if (!passwordMatch) return { email: email, message: "Two Password Didn't Matched!!!" }; // If two password didn't matched

        // Destructure From User
        const { forgot_password_code, updatedAt } = checkUser;

        // Time Calculating
        const reqTime = new Date();
        const recordTime = new Date(updatedAt);
        // Calculating Minutes
        let minutes = ((recordTime.getTime() - reqTime.getTime()) / 1000) / 60;
        // Difference
        const diffs = Math.abs(Math.round(minutes));

        // IF Difference Less than or Equal to 20 minutes
        if (diffs <= 20) {

            // Check the code is matched or not
            const codeMatched = forgotPassVerifyCode === forgot_password_code;

            // Code match condition
            if (!codeMatched) return { email: email, message: "Invalid Password Verification Code!!!" };


            // Updating Doc
            const updateDoc = {
                password: await bcrypt.hash(confirmPassword, 10),
            }
            // Update User
            const updateUser = await db.users.update(updateDoc, { where: { email } });
            if (!updateUser) return { email: email, message: "Something Went Wrong Please Start Again After A Moment!!!" };

            // Setting Up Data for EMAIL SENDER
            const mailData = {
                email: email,
                subject: "Password Reset of Primer Server Parts Account",
                message: `Your Prime Server Parts Account Password Updated Successfully, Your Email is: ${email}, Your Updated Password is: ${confirmPassword}`
            }

            // SENDING EMAIL FOR RESET PASSWORD
            await verifierEmail(mailData);


            return {
                email: email,
                message: "Your Password is Updated, Please Sign In With New Password!!!"
            }


        } else { // If Time Expired

            return {
                email: email,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Start Again From The Beginning!!!"
            }
        }


    }
}