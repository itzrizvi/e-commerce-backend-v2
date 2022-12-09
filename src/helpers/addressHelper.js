// ADDRESS HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// ADDRESS HELPER
module.exports = {
    // GET ALL ADDRESS BY CUSTOMER HELPER
    getAddressListByCustomerID: async (req, db, user, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { customer_id } = req;


            let shippingDefaultID;
            let billingDefaultID;

            // GET ADDRESS
            const allAddressById = await db.address.findAll({
                where: {
                    [Op.and]: [{
                        ref_id: customer_id,
                        tenant_id: TENANTID

                    }]
                }
            });

            //
            allAddressById.forEach(async (address) => {
                if (address.isDefault && address.type === "shipping") {
                    shippingDefaultID = address.id;

                } else if (address.isDefault && address.type === "billing") {
                    billingDefaultID = address.id
                }
            });


            // Return 
            return {
                message: "GET All Address By Customer ID Success!!!",
                status: true,
                tenant_id: TENANTID,
                shippingDefaultID,
                billingDefaultID,
                data: allAddressById
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },

}