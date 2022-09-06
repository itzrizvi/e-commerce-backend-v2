// ALL REQUIRES
const pool = require('../Database/db');

// This Function is to Avoid having Two users with same email
const saveUser = async (req, res, next) => {

    // Search from DB to see if the user exist
    try {
        const email = await pool.pool.query('SELECT * FROM users WHERE email = $1', [req.body.email])

        // Return if user already exist
        if (email.rows.length) {

            return res.status(409).send("Authentication failed");
        }

        next();

    } catch {

        console.log("Validation Error ", error);

    }

};


module.exports = saveUser

