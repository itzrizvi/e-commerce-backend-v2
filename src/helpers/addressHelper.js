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
            // Check If Has Alias with subcategories
            if (!db.default_address.hasAlias('address') && !db.default_address.hasAlias('defaultAddress')) {

                await db.default_address.hasOne(db.address, {
                    targetKey: 'address_id',
                    foreignKey: 'id',
                    as: 'defaultAddress'
                });

                await db.address.hasOne(db.default_address, {
                    targetKey: 'id',
                    foreignKey: 'address_id',
                    as: 'defaultAddress'
                });
            }


            // GET ADDRESS
            const allAddressById = await db.address.findAll({
                where: {
                    [Op.and]: [{
                        ref_id: customer_id,
                        tenant_id: TENANTID

                    }]
                },
                include: [{
                    model: db.default_address, as: "defaultAddress"
                }]
            });

            //
            allAddressById.forEach(async (address) => {
                if (address.defaultAddress != null && address.type === "shipping") {
                    shippingDefaultID = address.id;

                } else if (address.defaultAddress != null && address.type === "billing") {
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
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }

    },

}