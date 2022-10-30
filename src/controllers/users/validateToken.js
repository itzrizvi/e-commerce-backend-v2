const { verify } = require("jsonwebtoken");

// Exports
module.exports = async (token, db) => {
    if (!token) {
        return { status: false };
    }
    try {
        decodeToken = verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return { status: false };
    }
    let authUser = await db.user.findOne({
        where: { uid: decodeToken.uid }
    });

    if (!authUser) {
        return { status: false };
    }
    // Final Response
    return { status: true };
}