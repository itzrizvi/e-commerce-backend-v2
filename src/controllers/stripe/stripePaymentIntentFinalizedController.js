// ALL REQUIRES
const { stripePaymentIntentFinalized } = require("../../helpers/stripe");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth, TENANTID) => {
  //  ADMIN/STAFF PASSWORD CHANGE
  const data = await stripePaymentIntentFinalized(req, db, user, isAuth, TENANTID);

  return singleResponse(data);
};
