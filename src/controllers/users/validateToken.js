const { verify } = require("jsonwebtoken");

// Exports
module.exports = async (token, db) => {
    if (!token) {
        return { status: false };
    }
    try {
        decodeToken = verify(token, process.env.JWT_SECRET);
        console.log(decodeToken)
    } catch (error) {
        console.log(error)
        return { status: false };
    }
    let authUser = await db.users.findOne({
        where: { uid: decodeToken.uid }
    });
    console.log(authUser)

    if (!authUser) {
        return { status: false };
    }
    // Final Response
    return { status: true };
}