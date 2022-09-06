// All Requires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../Database/db');


// SIGN UP CONTROLLER FUNCTION
const signUp = async (req, res) => {

    try {
        // Destructure from req body
        const { firstName, lastName, email, password } = req.body;

        // Main User Data Object 
        const data = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: await bcrypt.hash(password, 10)
        }

        // INSERT DATA TO DATA TABLE
        const createUser = await pool.pool.query(
            'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [data.first_name, data.last_name, data.email, data.password]);

        // generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (createUser.rows.length) {

            // TOKEN GENERATION
            let token = jwt.sign({ id: createUser.rows[0].id, email: createUser.rows[0].email }, process.env.secretKey, {
                expiresIn: 7 * 24 * 60 * 60 * 1000
            });

            // SEND RES COOKIE WITH EXPIRATION TIME
            req.session.isLoggedIn = true;
            req.session.jwtToken = token;



            return res.status(201).send(createUser.rows[0]);

        } else {
            return res.status(409).send("Unauthenticated")

        }

    } catch (error) {
        console.log(error)
    }
}


//
module.exports = signUp;