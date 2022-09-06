// ALL REQUIRES
const db = require("../Models");
const User = db.users;

// This Function is to Avoid having Two users with same email
const saveUser = async (req, res, next) => {

    // Search from DB to see if the user exist
    try {
        const email = await User.findOne({ where: { email: req.body.email } });

        // Return if user already exist
        if (email) {

            return res.status(409).send("Authentication failed");
        }

        next();

    } catch {

        console.log("Validation Error ", error);

    }

};


module.exports = saveUser

