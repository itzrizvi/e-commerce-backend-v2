// All Requires
const bcrypt = require('bcrypt');
const db = require('../../Models');
const jwt = require('jsonwebtoken');

// 
const User = db.users;

// 
const signUp = async (req, res) => {

    try {
        //
        const { firstName, lastName, email, password } = req.body;
        //
        const data = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: await bcrypt.hash(password, 10)
        }

        //
        const createUser = await User.create(data);

        // generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (createUser) {

            let token = jwt.sign({ id: createUser.id }, process.env.secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

            console.log("USER", JSON.stringify(createUser, null, 2));
            console.log(token);

            //
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