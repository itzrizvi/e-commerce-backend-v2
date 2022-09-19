//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');


// HELPER
module.exports = {
    // Admin Sign In HELPER
    adminSignIn: async (req, db) => {

        try {
            const { email, password } = req;

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
            if (!checkRoleExist || checkRoleExist.role_no <= 10) return {
                authToken: "NO TOKEN",
                uid: "NO UID",
                email: "NOT FOUND",
                message: "USER NOT FOUND",
                emailVerified: false
            };

            const { role_no: roleNo } = checkRoleExist;

            // return jwt
            const authToken = jwt.sign(
                { uid: user.uid, email: user.email, roleno: CryptoJS.AES.encrypt(`${roleNo}`, process.env.ROLE_SECRET).toString() },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );


            return {
                authToken,
                uid: user.uid,
                email: user.email,
                message: "Sign In succesfull",
                emailVerified: user.email_verified,
                first_name: user.first_name
            }

        } catch (error) {
            throw new Error(error.message)
        }


    }
}