const { Op } = require("sequelize");
const { userSignUp } = require("../../helpers/userHelper");
const { singleResponse } = require("../../utils/response");



// Sign Up Controller Export
module.exports = async (req, db, TENANTID) => {

    // Check Email Is Already Taken or Not
    const checkEmail = await db.user.findOne({
        where: {
            [Op.and]: [{
                email: req.email,
                tenant_id: TENANTID
            }]
        }
    });

    // If Not Exists then create User
    if (!checkEmail) {
        const data = await userSignUp(req, db, TENANTID);
        return singleResponse(data);

    } else { // Else Send Error Message
        const data = {
            message: "THIS EMAIL IS ALREADY TAKEN",
            status: false
        }

        return singleResponse(data);
    }


}