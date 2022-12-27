const { gql } = require("apollo-server-express");
module.exports = gql`
  input AddCartInput {
    promo_id: String
    promo_type: String
    cart_item: CartItemInput
  }

  input CartItemInput {
    product_id: Int!
    quantity: Int!
  }

  type AddCartOutput {
    status: Boolean!
    message: String!
    id: Int!
    cart_item_id: Int!
  }

  input RemoveCartItemInput {
    cart_item_id: Int!
  }

  input RemoveCartInput {
    cart_id: Int!
  }

  type GetCartOutput {
    status: Boolean
    message: String
    data: Cart
  }

  type Cart {
    id: Int
    customer_id: Int
    createdAt: String
    updatedAt: String
    createdBy: String
    updatedBy: String
    cart_items: [CartItem]
  }

  type CartItem {
    id: String
    product_id: String
    cart_id: String
    prod_price: Float
    promo_type: String
    promo_id: String
    quantity: Int
    createdAt: String
    updatedAt: String
    updatedBy: String
    createdBy: String
    product: CartProduct
  }

  type CartProduct {
    id: String
    prod_name: String
    prod_slug: String
    prod_short_desc: String
    prod_price: Float
    prod_partnum: String
    prod_sku: String
    prod_thumbnail: String
    prod_condition:String
  }

  extend type Mutation {
    addCart(data: AddCartInput): AddCartOutput!
    removeCartItem(data: RemoveCartItemInput): CommonOutput!
    removeCart(data: RemoveCartInput): CommonOutput!
  }

  extend type Query {
    getCart: GetCartOutput!
  }
`;
