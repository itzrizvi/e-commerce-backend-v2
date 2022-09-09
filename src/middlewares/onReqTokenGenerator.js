const { verify } = require("jsonwebtoken");
const db = require("../db");


const onReqTokenGenerate = async (req, res, next) => {
    console.log("AUTH CHECKED")
    const authToken = req.get('Authorization') || '';

    if (!authToken) {
        req.isAuth = false;
        return next();
    }
    //
    let decodeToken;
    try {
        decodeToken = verify(authToken, process.env.JWT_SECRET)
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodeToken) {
        req.isAuth = false;
        return next();
    }
    //
    let authUser = await db.users.findOne({
        where: { uid: decodeToken.uid }
    });


    if (!authUser) {
        req.isAuth = false;
        return next();
    }

    req.user = authUser;
    req.isAuth = true

    return next();
}



module.exports = onReqTokenGenerate;