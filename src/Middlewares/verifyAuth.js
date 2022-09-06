// ALL REQUIRES
const jwt = require('jsonwebtoken');
const { pool } = require('../Database/db');

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
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [decodeToken.email]);

        // REQ USER ADDED
        req.user = user.rows[0];

        next();

    } catch (error) {
        console.log("VERIFY AUTH ERROR: ", error)
    }


}


module.exports = bindUserWithRequest