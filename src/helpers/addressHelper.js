// ADDRESS HELPER REQUIRES
const { Op } = require("sequelize");

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

      // 
      if (!db.address.hasAlias('country') && !db.address.hasAlias('countryCode')) {
        await db.address.hasOne(db.country, {
          sourceKey: 'country',
          foreignKey: 'code',
          as: 'countryCode'
        });
      }

      // GET ADDRESS
      const allAddressById = await db.address.findAll({
        include: [
          { model: db.country, as: "countryCode" }
        ],
        where: {
          [Op.and]: [
            {
              ref_id: customer_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      //
      allAddressById.forEach(async (address) => {
        if (address.isDefault && address.type === "shipping") {
          shippingDefaultID = address.id;
        } else if (address.isDefault && address.type === "billing") {
          billingDefaultID = address.id;
        }
      });

      // Return
      return {
        message: "GET All Address By Customer ID Success!!!",
        status: true,
        tenant_id: TENANTID,
        shippingDefaultID,
        billingDefaultID,
        data: allAddressById,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  getStateList: async (db, args, TENANTID) => {

    const { code } = args.query
    // Try Catch Block
    try {
      // GET All State
      const allState = await db.state.findAll({
        where: {
          [Op.and]: [{
            tenant_id: TENANTID,
            status: true,
            country_code: code
          }]
        },
      });

      // Return
      return {
        message: "GET All State Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: allState,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  getCountryList: async (db, TENANTID) => {
    // Try Catch Block
    try {
      // GET All Country
      const allCountry = await db.country.findAll({
        where: {
          tenant_id: TENANTID,
          status: true,
        },
      });

      // Return
      return {
        message: "GET All Country Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: allCountry,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
};
