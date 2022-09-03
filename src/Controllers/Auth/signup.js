// All Requires
const bcrypt = require('bcrypt');
const db = require('../../Models');
const jwt = require('jsonwebtoken');

// User Model/TABLE
const User = db.users;

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
        const createUser = await User.create(data);

        // generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (createUser) {

            // TOKEN GENERATION
            let token = jwt.sign({ id: createUser.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000
            });

            // SEND RES COOKIE WITH EXPIRATION TIME
            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

            console.log("USER", JSON.stringify(createUser, null, 2)); // TODO: REMOVE
            console.log(token); // TODO: REMOVE

            return res.status(201).send(createUser);

        } else {
            return res.status(409).send("Unauthenticated")

        }

    } catch (error) {
        console.log(error)
    }
}


//
module.exports = signUp;