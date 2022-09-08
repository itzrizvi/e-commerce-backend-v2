const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        user: (parent, args, { db }, info) => db.getUser(args, info),
        role: async (parent, args, { db, user, isAuth }, info) => {
            if (!user && !isAuth) return { data: [], isAuth: false, Message: "Not Authenticated", FtechedBy: "" };
            let q = {
                where: args.query
            };
            const getAllRoles = await db.user_roles.findAll(q);

            return {
                data: getAllRoles,
                isAuth: isAuth,
                Message: "Authenticated User",
                FtechedBy: user.email
            }

        }
    },
    Mutation: {

        // SIGN UP 
        userSignUp: async (root, args, { db }, info) => {
            try {
                const { first_name, last_name, email, password } = args.data;
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
        userSignIn: async (root, { email, password }, { db }, info) => {
            try {

                const user = await db.users.findOne({ where: { email } })
                if (!user) {
                    throw new Error('NOT ALLOWED!!')
                }
                const isValid = await bcrypt.compare(password, user.password)
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

        createRole: async (parent, args, { db }, info) => {
            const newRole = await db.user_roles.create(args.data);
            console.log(newRole.role)
            return {
                uid: newRole.uid,
                role: newRole.role
            }
        }
    }
}

module.exports = resolvers;