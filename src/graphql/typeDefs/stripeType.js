const { gql } = require("apollo-server-express");

module.exports = gql`

type PaymentIntent{
    clientSecret: String!
    status:String!
}

type stripePaymentIntentOutput {
    status: String!
    message: String!
    data: PaymentIntent
}

input stripePaymentIntentInput {
    amount: Float!
}

input stripePaymentIntentFinalizedInput{
    user_id: Int!
    order_id: Int!
    provider_id: Int!
    data: JSONObject
}

extend type Mutation {
    stripePaymentIntentFinalized(data:stripePaymentIntentFinalizedInput):CommonOutput!
}

extend type Query {
    stripePaymentIntent(query:stripePaymentIntentInput):stripePaymentIntentOutput!
}
`;
