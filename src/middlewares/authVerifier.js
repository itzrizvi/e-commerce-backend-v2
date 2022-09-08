//
const jwt = require('jsonwebtoken');


const authVerify = (token) => {
    try {
        if (token) {
            return jwt.verify(token, process.env.JWT_SECRET)
        }
        return null

    } catch (error) {

        return null
    }
}



module.exports = authVerify;