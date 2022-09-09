module.exports = {
    userSignUp: async (req, db) => {
        try {
            return await db.users.create(req);

        } catch (error) {
            return error
        }
    }
}