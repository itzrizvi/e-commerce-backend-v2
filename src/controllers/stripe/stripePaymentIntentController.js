// ALL REQUIRES
const { stripePaymentIntent } = require("../../helpers/stripe");
const { singleResponse } = require("../../utils/response");

// CONTROLLER
module.exports = async (req, db, user, isAuth) => {
  //  ADMIN/STAFF PASSWORD CHANGE
  const data = await stripePaymentIntent(req, db, user, isAuth);

  return singleResponse(data);
};
