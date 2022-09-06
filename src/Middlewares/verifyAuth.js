// ALL REQUIRES
const jwt = require('jsonwebtoken');
const db = require('../Models');
const User = db.users;

// BIND MIDDLE WARE
const bindUserWithRequest = async (req, res, next) => {

    // IF NOT LOGGED IN
    if (!req.session.isLoggedIn) {
        return next();
    }

    try {
        // TAKING TOKEN FOR DECODE
        let token = req.session.jwtToken;
        const decodeToken = jwt.verify(token, process.env.SESSION_SECRET);

        // QUERY FOR USER DATA
        const user = await User.findOne({
            where: {
                email: decodeToken.email
            }
        });


        // REQ USER ADDED
        req.user = user;

        next();

    } catch (error) {
        console.log("VERIFY AUTH ERROR: ", error)
    }


}


module.exports = bindUserWithRequest