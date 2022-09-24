const { userSignUp } = require("../../helpers/userHelper");
const { userSignUpRequest } = require("../../requests/userRequests");
const { singleResponse } = require("../../utils/response");



// Sign Up Controller Export
module.exports = async (req, db) => {
    // Validate Sign UP
    const validate = await userSignUpRequest(req);
    if (!validate.success) {
        return singleResponse(validate.data);
    }
    // Check Email Is Already Taken or Not
    const checkEmail = await db.users.findOne({ where: { email: req.email } });

    // If Not Exists then create User
    // if (!checkEmail) {
    const data = await userSignUp(req, db);
    return singleResponse(data);

    // } else { // Else Send Error Message
    //     const data = {
    //         authToken: "NO DATA",
    //         uid: "NO DATA",
    //         first_name: "NO DATA",
    //         last_name: "NO DATA",
    //         email: req.email,
    //         message: "THIS EMAIL IS ALREADY TAKEN",
    //         emailVerified: false,
    //         verificationCode: 0,
    //         updatedAt: "NO DATA",
    //         createdAt: "NO DATA"
    //     }

    // return singleResponse(data);
    // }


}