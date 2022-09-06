// All Requires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../Database/db');


// SIGN IN CONTROLLER FUNCTION
const signIn = async (req, res) => {

    try {
        // DESTRUCTURE FROM REQ BODY
        const { email, password } = req.body;


        // FILTER CHECK THE USER FOR SIGN IN
        const user = await pool.pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // FOUND USER LOGIC
        if (user.rows.length) {

            const isSame = await bcrypt.compare(password, user.rows[0].password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file
            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.SESSION_SECRET, {
                    expiresIn: 7 * 24 * 60 * 60 * 1000
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                req.session.isLoggedIn = true;
                req.session.jwtToken = token;



                return res.status(201).send("Success!!");

            } else {
                return res.status(401).send("Authentication Failed")
            }

        } else {
            return res.status(401).send("Authentication Failed");
        }


    } catch (error) {
        console.log('SIGN IN ERROR :', error)
    }

}


module.exports = signIn;