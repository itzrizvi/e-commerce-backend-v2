const { Op } = require("sequelize");
const { verifierEmail } = require("../utils/verifyEmailSender");
const bcrypt = require('bcrypt');

// Customer HELPER
module.exports = {
    // CREATE Customer API
    createCustomer: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        // try {
            // GET DATA
            const {
                first_name,
                last_name,
                email,
                password,
                status,
                send_mail
             } = req;

            // Check The User Is Already given or Not
            const checkUserExist = await db.users.findOne({
                where: {
                    [Op.and]: [{
                        email,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkUserExist) return { message: "User already exists!", status: false }

            const createUser = await db.users.create({
                first_name,
                last_name,
                email,
                password : await bcrypt.hash(password, 10),
                user_status: status,
                tenant_id: TENANTID
            });

            if (createUser) {
                // IF SEND EMAIL IS TRUE
                if (send_mail) {
                    // Setting Up Data for EMAIL SENDER
                    const mailData = {
                        email: email,
                        subject: "Registration Successfully From Primer Server Parts",
                        message: `Your email : ${email} and Your Password: ${password}`
                    }

                    // SENDING EMAIL
                    await verifierEmail(mailData);
                }
                return {
                    tenant_id: createUser.tenant_id,
                    message: "Successfully Created User.",
                    status: true,
                }
            }

        // } catch (error) {
        //     if (error) return { message: "Something Went Wrong!!!", status: false }
        // }

    },
}