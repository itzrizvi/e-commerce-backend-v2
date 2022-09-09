


//
module.exports = {
    getAllRoles: async (req, db, user, isAuth) => {

        if (!user && !isAuth) return { data: [], isAuth: false, Message: "Not Authenticated", FetchedBy: "User Not Found!" };
        let q = {
            where: req
        };
        const getAllRoles = await db.user_roles.findAll(q);

        return {
            data: getAllRoles,
            isAuth: isAuth,
            Message: "Authenticated User",
            FetchedBy: user.email
        }

    }
}