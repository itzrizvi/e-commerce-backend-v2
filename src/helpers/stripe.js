const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);
module.exports = {
  stripePaymentIntent: async (req, db, user, isAuth) => {
    const { amount } = req;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat(amount) * 100,
        currency: "usd",
        payment_method_types: ["card"],
        capture_method: "manual",
      });
      return {
        message: "Payment Intent Created Successfully!!!",
        status: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          status: paymentIntent.status,
        },
      };
    } catch (err) {
      console.log(err);
    }
  },
  stripePaymentIntentFinalized: async (req, db, user, isAuth, TENANTID) => {
    const { user_id, order_id, provider_id, data } = req;
    try {
      // Add Transaction Method TO DB
      const transaction = await db.transaction.create({
        order_id,
        gateway: "stripe",
        method: data.payment_method_types[0],
        currency: data.currency,
        authorization_id: data.id,
        metadata: JSON.stringify(data),
        amount: data.amount / 100,
        provider_id,
        status: data.status,
        tenant_id: TENANTID,
        created_by: user_id,
      });

      // Return Formation
      if (transaction) {
        return {
          message: "Transaction Added Successfully!!!",
          status: true,
        };
      }
    } catch (err) {
      if (err)
        return {
          message: `Something Went Wrong!!! Error: ${err}`,
          status: false,
        };
    }
  },
};
