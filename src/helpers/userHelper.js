//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifierEmail } = require('../utils/verifyEmailSender');

module.exports = {
    // SIGN UP
    userSignUp: async (req, db) => {
        try {

            const { first_name, last_name, email, password, email_verified } = req;
            const verificationCode = Math.floor(100000 + Math.random() * 900000); // CODE GENERATOR

            const user = await db.users.create({
                first_name,
                last_name,
                email,
                password: await bcrypt.hash(password, 10),
                email_verified: false,
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
                message: `Your 6 Digit Verification Code is ${user.verification_code}`
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
            const { email, password } = req;

            const user = await db.users.findOne({ where: { email } });

            if (!user) {
                throw new Error('NOT ALLOWED!!')
            }

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                throw new Error('NOT ALLOWED TWO')
            }

            // return jwt
            const authToken = jwt.sign(
                { uid: user.uid, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '4h' }
            )

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
        if (!user && !isAuth) return { emailVerified: false, isAuth: false, message: "Not Authenticated", email: "Not Found!" }; // RReturn if not auth

        const email = req.email; // Email From Request

        // User Find For Matching Code
        const findUser = await db.users.findOne({ where: { email } });

        // IF Not User
        if (!findUser) {
            return { emailVerified: false, isAuth: true, message: "Something Went Wrong", email: email };
        };

        // Destructure Values
        const { updatedAt, verification_code, email_verified } = findUser;

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



    }
}