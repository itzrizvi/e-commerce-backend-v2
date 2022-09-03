// All Requires
const bcrypt = require('bcrypt');
const db = require('../../Models');
const jwt = require('jsonwebtoken');
const User = db.users;

// SIGN IN CONTROLLER FUNCTION
const signIn = async (req, res) => {

    try {
        // DESTRUCTURE FROM REQ BODY
        const { email, password } = req.body;

        // FILTER CHECK THE USER FOR SIGN IN
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        // FOUND USER LOGIC
        if (user) {

            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file
            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.secretKey, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

                console.log("user", JSON.stringify(user, null, 2)); // TODO : REMOVE
                console.log(token); // TODO : REMOVE

                return res.status(201).send(user);

            } else {
                return res.status(401).send("Authentication Failed")
            }

        } else {
            return res.status(401).send("Authentication Failed");
        }


    } catch (error) {
        console.log(error)
    }

}


module.exports = signIn;