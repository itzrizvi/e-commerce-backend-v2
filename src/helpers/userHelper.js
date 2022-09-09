//
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // SIGN UP
    userSignUp: async (req, db) => {
        try {

            const { first_name, last_name, email, password } = req;
            const user = await db.users.create({
                first_name,
                last_name,
                email,
                password: await bcrypt.hash(password, 10)
            });

            const authToken = jwt.sign(
                { uid: user.uid, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1y' }
            )

            return {
                authToken, uid: user.uid, first_name: user.first_name, last_name: user.last_name, email: user.email, message: "Sign Up succesfull"
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
                authToken, uid: user.uid, first_name: user.first_name, last_name: user.last_name, email: user.email, message: "Sign In succesfull"
            }

        } catch (error) {
            throw new Error(error.message)
        }
    },
}