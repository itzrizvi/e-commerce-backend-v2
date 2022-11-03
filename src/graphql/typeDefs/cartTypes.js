const { gql } = require("apollo-server-express");
module.exports = gql`
  input AddCartInput {
    customer_id: Int!
    cart_item: [CartItemInput]
  }

  input CartItemInput {
    product_id: Int!
    quantity: Int!
  }

  type AddCartOutput {
    status: Boolean!
    message: String!
    id: Int!
  }

  input RemoveCartItemInput {
    cart_item_id: Int!
  }

  input AddSingleCartItemInput {
    cart_id: Int!
    product_id: Int!
    quantity: Int!
  }

  input RemoveCartInput {
    cart_id: Int!
  }

  input GetCartInput {
    customer_id: Int!
  }

  input GetSingleCartItemInput {
    cart_item_id: Int!
  }

  type GetCartOutput {
    status: Boolean
    message: String
    data: [Cart]
  }

  type Cart {
    id: Int
    customer_id: Int
    createdAt: String
    updatedAt: String
    cart_items: [CartItem]
  }

  type CartItem {
    id: Int!
    product_id: Int!
    cart_id: Int!
    quantity: Int!
    createdAt: String
    updatedAt: String
  }

  type GetSingleCartItemOutput {
    status: Boolean
    message: String
    data: CartItem
  }

  extend type Mutation {
    addCart(data: AddCartInput): AddCartOutput!
    addSingleCartItem(data: AddSingleCartItemInput): CommonOutput!
    removeCartItem(data: RemoveCartItemInput): CommonOutput!
    removeCart(data: RemoveCartInput): CommonOutput!
  }

  extend type Query {
    getCart(query: GetCartInput): GetCartOutput!
    getSingleCartItem(query: GetSingleCartItemInput): GetSingleCartItemOutput!
  }
`;
