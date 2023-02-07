//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifierEmail } = require('../utils/verifyEmailSender');
const { Op } = require('sequelize');
const { deleteFile, singleFileUpload } = require("../utils/fileUpload");
const config = require('config');
const { Mail } = require('../utils/email');
const { crypt, decrypt } = require('../utils/hashes');


module.exports = {
    // SIGN UP
    userSignUp: async (req, db, TENANTID) => {

        try {

            const { first_name, last_name, email, password, phone, fax } = req;
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            if (!email || !first_name || !password) return { message: "Account Valid Credentials Is Missing!!!", status: false }

            const user = await db.user.create({
                first_name,
                last_name,
                email,
                phone,
                fax,
                password: await bcrypt.hash(password, 10),
                verification_code: verificationCode,
                user_status: true,
                tenant_id: TENANTID
            });

            const authToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            );

            // Setting Up Data for EMAIL SENDER
            const mailSubject = "Profile Verification Code From Prime Server Parts"
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
                about: 'Account Verification From Prime Server Parts',
                email: user.email,
                verificationCode: user.verification_code,
                message: `This Code Will Be Valid Till 20 Minutes From You Got The Email.`
            }

            // SENDING EMAIL
            await Mail(user.email, mailSubject, mailData, 'user-sign-up-verification', TENANTID);

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
                message: "Sign Up succesfull",
                status: true,
                tenant_id: TENANTID,
                data: {
                    authToken,
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    fax: user.fax,
                    email: user.email,
                    emailVerified: user.email_verified,
                    verificationCode: user.verification_code,
                    user_status: user.user_status,
                    updatedAt: user.createdAt,
                    createdAt: user.updatedAt
                }
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // SIGN IN
    userSignIn: async (req, db, TENANTID) => {

        try {
            // DATA FROM REQUEST
            const { email, password } = req;

            // CHECK USER
            const user = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!user) {
                return {
                    message: "Invalid Email or Password!!!",
                    status: false
                };
            }

            // CHECK IS VALID
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return {
                    message: "Invalid Email or Password!!!",
                    status: false
                };
            }

            // IF USER EMAIL VERIFIED OR NOT
            const isVarified = user.email_verified;
            if (!isVarified) {
                return {
                    message: "Email Is Not Verified!!!",
                    status: false,
                    emailVerified: user.email_verified
                }
            }

            // IF USER STATUS IS FALSE
            const isActive = user.user_status;
            if (!isActive) {
                return {
                    message: "User Has Been Deactivated, Please Contact To Support",
                    status: false
                }
            }

            // return jwt
            const authToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '4h' }
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
                message: "Sign In succesfull",
                status: true,
                tenant_id: TENANTID,
                data: {
                    authToken,
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    fax: user.fax,
                    email: user.email,
                    emailVerified: user.email_verified,
                    verificationCode: user.verification_code,
                    user_status: user.user_status,
                    updatedAt: user.createdAt,
                    image: user.image,
                    createdAt: user.updatedAt
                }
            }

        } catch (error) {
            if (error) return { message: "USER NOT FOUND", status: false };
        }
    },
    // Email Verify
    verifyEmail: async (req, db, TENANTID) => {

        const email = req.email; // Email From Request

        // User Find For Matching Code
        const findUser = await db.user.findOne({
            where: {
                [Op.and]: [{
                    email,
                    tenant_id: TENANTID
                }]
            }
        });

        // IF Not User
        if (!findUser) {
            return { emailVerified: false, message: "User Not Found!!!", email: email, status: false };
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

                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "Email Verification Success From Prime Server Parts"
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
                        about: 'Email Verification on Prime Server Parts',
                        email: email,
                        message: `Your Email Has Been Verified Successfully on Prime Server Parts.`
                    }

                    // SENDING EMAIL
                    await Mail(email, mailSubject, mailData, 'email-verification-confirmation', TENANTID);




                    return {
                        email: email,
                        emailVerified: true,
                        message: "Email Verified Successfully!!",
                        status: false
                    }
                } else {
                    return { // If Not updated
                        email: email,
                        emailVerified: false,
                        message: "ERROR WHEN MATCHING",
                        status: false
                    }
                }


            } else {
                return { // If nOt Matched
                    email: email,
                    emailVerified: false,
                    message: "CODE DIDN'T MATCHED",
                    status: false
                }
            }


        } else { // If Time Expired

            return {
                email: email,
                emailVerified: false,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Try Again!!!",
                status: false
            }
        }



    },
    // Resend Email For Verification
    resendVerificationEmail: async (req, db, TENANTID) => {

        // EMAIL FROM REQUEST
        const email = req.email;
        // NEW VERIFICATION CODE GENERATE
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

        // Check Email Has User
        const findUser = await db.user.findOne({
            where: {
                [Op.and]: [{
                    tenant_id: TENANTID,
                    email
                }]
            }
        });
        if (!findUser) return { message: "User Not Found!!!", status: false, email: email }

        // Updating Doc
        const updateDoc = {
            verification_code: newVerificationCode,
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

            // Setting Up Data for EMAIL SENDER
            const mailSubject = "Email Verification Code From Primer Server Parts"
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
                about: 'Verify Your Email on Prime Server Parts',
                email: email,
                verificationCode: newVerificationCode,
                message: `This Code Will Be Valid Till 20 Minutes From You Got The Email.`
            }

            // SENDING EMAIL
            await Mail(user.email, mailSubject, mailData, 'user-email-verification', TENANTID);




            // Return The Response
            return {
                email: email,
                message: "A New 6 Digit Verification Code Has Been Sent to Your Email!!",
                status: true
            }
        } else {
            return { // If Not updated
                email: email,
                message: "Failed To Send New Code",
                status: false
            }
        }

    },
    // Forgot Password Initiation Helper (STEP 1)
    forgotPassInit: async (req, db, TENANTID) => {

        // GET EMAIL FROM REQUEST
        const email = req.email;

        // Check User is Exists
        const checkUser = await db.user.findOne({
            where: {
                [Op.and]: [{
                    email,
                    tenant_id: TENANTID
                }]
            }
        });

        // IF USer Exists
        if (checkUser) {
            // GENERATE FORGOT PASS VERIFY CODE
            const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            // Updating Doc
            const updateDoc = {
                verification_code: forgotPasswordCode,
                forgot_password_code: forgotPasswordCode,
                password: await bcrypt.hash(process.env.secretKey, 10)
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

            // IF USER UPDATED
            if (updateUser) {

                // IF SEND EMAIL IS TRUE
                let codeHashed = crypt(email); // TODO ->> SEND THIS ON SET PASSWORD PARAMS
                // SET PASSWORD URL
                const setPasswordURL = config.get("ECOM_URL").concat(config.get("RESET_PASSWORD"));

                // Setting Up Data for EMAIL SENDER
                const mailSubject = "Reset Password Verification Code From Primer Server Parts"
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
                    about: 'Reset Password From Prime Server Parts',
                    email: email,
                    forgotPasswordCode: forgotPasswordCode,
                    resetPasswordLink: setPasswordURL.concat(codeHashed),
                    message: `This Code Will Be Valid Till 20 Minutes From You Got The Email. If you do not recognize this action please contact our support team.`
                }

                // SENDING EMAIL
                await Mail(email, mailSubject, mailData, 'password-reset-initiation', TENANTID);


                // Return The Response
                return {
                    message: "A Reset Password Verification Code is Sent to Your Email!!!",
                    email: email,
                    status: true
                }

            } else { // ELSE USER COULDN"T UPDATE
                return {
                    message: "Something Went Wrong Try Again!!!",
                    email: email,
                    status: false
                }
            }

        } else { // IF USER NOT FOUND
            return {
                message: "User Not Found, Please Enter Your Account Email!!!",
                email: email,
                status: false
            }
        }

    },
    // Forgot Password Code Match Helper (STEP 2)
    forgotPassCodeMatch: async (req, db, TENANTID) => {

        // FORGOT PASS CODE AND EMAIL FROM REQ
        const email = req.email;
        const forgotPassVerifyCode = req.forgotPassVerifyCode;

        // CHECK USER 
        const checkUser = await db.user.findOne({
            where: {
                [Op.and]: [{
                    email,
                    tenant_id: TENANTID
                }]
            }
        });

        if (!checkUser) return { email: email, message: "Please Enter Valid Details!!!", status: false };

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
                    message: "Please Enter Valid Details!!!",
                    status: false
                }
            }


        } else { // If Time Expired

            return {
                email: email,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Start Again From The Beginning!!!",
                status: false
            }
        }


    },
    // Forgot Password Final (STEP 3)
    forgotPassFinal: async (req, db, TENANTID) => {

        // Details From Request 
        const codeHashed = req.codeHashed;
        const forgotPassVerifyCode = req.forgotPassVerifyCode;
        const newPassword = req.newPassword;
        const confirmPassword = req.confirmPassword;
        // decrypting Code for email
        const email = decrypt(codeHashed);
        // CHECK USER 
        const checkUser = await db.user.findOne({
            where: {
                [Op.and]: [{
                    email,
                    tenant_id: TENANTID
                }]
            }
        });

        if (!checkUser) return { email: email, message: "Please Enter Valid Details!!!", status: false }; // If user not found by Email

        // Check Password Match
        const passwordMatch = newPassword === confirmPassword;
        if (!passwordMatch) return { email: email, message: "Two Password Didn't Matched!!!", status: false }; // If two password didn't matched

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
            if (!codeMatched) return { email: email, message: "Invalid Password Verification Code!!!", status: false };


            // Updating Doc
            const updateDoc = {
                password: await bcrypt.hash(confirmPassword, 10),
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

            if (!updateUser) return { email: email, message: "Something Went Wrong Please Start Again After A Moment!!!", status: false };


            // Setting Up Data for EMAIL SENDER
            const mailSubject = "Password Reset of Primer Server Parts Account"
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
                about: 'Reset Password Success From Prime Server Parts',
                email: email,
                message: `Your Prime Server Parts Account Password Updated Successfully, If You didn't reset your password please contact to Support Team.`
            }

            // SENDING EMAIL
            await Mail(email, mailSubject, mailData, 'password-reset-confirmation', TENANTID);


            return {
                email: email,
                message: "Your Password is Updated, Please Sign In With New Password!!!",
                status: true
            }


        } else { // If Time Expired

            return {
                email: email,
                message: "YOUR 6 DIGIT CODE IS EXPIRED, Please Start Again From The Beginning!!!",
                status: false
            }
        }


    },
    // User Profile Update
    userProfileUpdate: async (req, db, user, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request 
            const { first_name, last_name, oldPassword, newPassword, image, phone, fax } = req;

            // FIND User FIRST
            const findUser = await db.user.findOne({
                where: {
                    [Op.and]: [{
                        id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findUser) return { message: "User Not Found!!!", status: false }



            // IF Image Also Updated
            if (image && findUser.image) {
                // Delete Previous S3 Image For this User
                const user_image_src = config.get("AWS.USER_IMG_DEST").split("/");
                const user_image_bucketName = user_image_src[0];
                const user_image_folder = user_image_src.slice(1);
                await deleteFile({ idf: findUser.id, folder: user_image_folder, fileName: findUser.image, bucketName: user_image_bucketName });
            }

            // Upload New Image to S3
            if (image) {
                // Upload Image to AWS S3
                const user_image_src = config.get("AWS.USER_IMG_SRC").split("/");
                const user_image_bucketName = user_image_src[0];
                const user_image_folder = user_image_src.slice(1);
                const imageUrl = await singleFileUpload({ file: image, idf: findUser.id, folder: user_image_folder, fileName: findUser.id, bucketName: user_image_bucketName });
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
                            id: findUser.id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If not updated
                if (!updateUser) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
            }

            if (oldPassword && newPassword) {

                // GET OLD PASSWORD FROM DB
                const { password } = findUser;

                // Check Old Password Is Matching or Not
                const isMatched = await bcrypt.compare(oldPassword, password);
                // IF NOT MATCHED
                if (!isMatched) return { message: "Incorrect Old Password!!!", status: false };

                // Update Password Doc
                const updateDoc = {
                    first_name,
                    last_name,
                    phone,
                    fax,
                    updated_by: user.id,
                    password: await bcrypt.hash(newPassword, 10)
                }

                // Update With New Password
                const updateUser = await db.user.update(updateDoc, {
                    where: {
                        [Op.and]: [{
                            id: findUser.id,
                            tenant_id: TENANTID
                        }]
                    }
                });


                if (updateUser) {

                    // Find User to Get Image Name
                    const findUpdatedUser = await db.user.findOne({
                        where: {
                            [Op.and]: [{
                                id: user.id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "User Password Changed on Prime Server Parts"
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
                        about: 'Password Changed on Prime Server Parts',
                        message: `Your Prime Server Parts Account Password is Changed. If this is not you please contact to Support!!!`
                    }

                    // SENDING EMAIL
                    await Mail(findUpdatedUser.email, mailSubject, mailData, 'profile-update-confirmation', TENANTID);



                    // Return Formation
                    return {
                        message: "User Profile Updated Successfully!!!",
                        status: true,
                        tenant_id: TENANTID

                    }
                }
            } else {

                // Update User Table Doc
                const updateUserDoc = {
                    first_name,
                    last_name,
                    phone,
                    fax,
                    updated_by: user.id
                }

                // Update User Table 
                const updateUser = await db.user.update(updateUserDoc, {
                    where: {
                        [Op.and]: [{
                            id: user.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (updateUser) { // IF USER UPDATED

                    // Find User to Get Image Name
                    const findUpdatedUser = await db.user.findOne({
                        where: {
                            [Op.and]: [{
                                id: user.id,
                                tenant_id: TENANTID
                            }]
                        }
                    });


                    // Setting Up Data for EMAIL SENDER
                    const mailSubject = "Account Update on Prime Server Parts"
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
                        about: 'Your Account Updated on Prime Server Parts',
                        message: `Your Prime Server Parts Account details has been updated. If this is not you please contact to Support!!!`
                    }

                    // SENDING EMAIL
                    await Mail(findUpdatedUser.email, mailSubject, mailData, 'profile-update-confirmation', TENANTID);

                    // Return Formation
                    return {
                        message: "User Profile Updated Successfully!!!",
                        status: true,
                        tenant_id: TENANTID

                    }


                }

            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }
}