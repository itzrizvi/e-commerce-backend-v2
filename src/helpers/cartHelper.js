const { Op } = require("sequelize");
const { decrypt } = require("../utils/hashes");

module.exports = {
  createCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      if (!isAuth) return { message: "Not Authorized", status: false };
      const { cart_item, promo_id, promo_type } = req;
      var cart_id;
      const checkCart = await db.cart.findOne({
        where: {
          [Op.and]: [
            {
              customer_id: user.id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (!checkCart) {
        const cartInsert = await db.cart.create({
          customer_id: user.id,
          tenant_id: TENANTID,
          createdBy: user.id,
        });
        cart_id = cartInsert.id;
      } else cart_id = checkCart.id;


      const { product_id, quantity } = cart_item;
      const product = await db.product.findOne({
        where: {
          [Op.and]: [
            {
              id: product_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      let prod_price =
        product.prod_sale_price === 0
          ? product.prod_regular_price
          : product.prod_sale_price;

      if (promo_type === "quote") {
        const promo_data = decrypt(promo_id);
        const quote_id = promo_data.split("#")[0];
        const quote_data = await db.submittedquote_item.findOne({
          where: {
            [Op.and]: [
              {
                product_id,
                submittedquote_id: quote_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        prod_price = quote_data.price;
      }

      const checkCartItem = await db.cart_item.findOne({
        where: {
          [Op.and]: [
            {
              product_id,
              cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      let checkCartItemUpdate;

      if (checkCartItem) {
        await db.cart_item.update(
          {
            quantity,
            prod_price,
            promo_type,
            promo_id,
            updatedBy: user.id,
          },
          {
            where: {
              [Op.and]: [
                {
                  product_id,
                  cart_id,
                  tenant_id: TENANTID,
                },
              ],
            },
          }
        );
      } else {
        checkCartItemUpdate = await db.cart_item.create({
          quantity,
          cart_id,
          product_id,
          prod_price,
          promo_type,
          promo_id,
          createdBy: user.id,
          tenant_id: TENANTID,
        });
      }


      // Return Formation
      return {
        message: "Cart Added Success!!!",
        status: true,
        id: cart_id,
        cart_item_id: checkCartItem ? checkCartItem.id : checkCartItemUpdate?.id
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  removeCartItem: async (req, db, user, isAuth, TENANTID) => {
    try {
      if (!isAuth) return { message: "Not Authorized", status: false };
      const { cart_item_id } = req;

      const cart_remove = await db.cart_item.destroy({
        where: {
          [Op.and]: [
            {
              id: cart_item_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (cart_remove) {
        // Return Formation
        return {
          message: "Cart Item Remove Success!!!",
          status: true,
        };
      } else {
        // Return Formation
        return {
          message: "Something Went Wrong!!!",
          status: false,
        };
      }
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  removeCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      if (!isAuth) return { message: "Not Authorized", status: false };
      const { cart_id } = req;

      const cart_remove = await db.cart.destroy({
        where: {
          [Op.and]: [
            {
              id: cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      const cart_item_remove = await db.cart_item.destroy({
        where: {
          [Op.and]: [
            {
              cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return Formation
      return {
        message: "Cart Remove Success!!!",
        status: true,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  getCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      if (!isAuth) return { message: "Not Authorized", status: false };
      if (!db.cart.hasAlias("cart_items") && !db.cart.hasAlias("cart_item")) {
        await db.cart.hasMany(db.cart_item, {
          as: "cart_items",
          foreignKey: "cart_id",
        });
      }

      if (!db.cart_item.hasAlias("product")) {
        await db.cart_item.hasOne(db.product, {
          sourceKey: "product_id",
          foreignKey: "id",
          as: "product"
        });
      }

      // Condition Table Association with Product
      if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

        await db.product.hasOne(db.product_condition, {
          sourceKey: 'prod_condition',
          foreignKey: 'id',
          as: 'condition'
        });
      }

      const carts = await db.cart.findOne({
        include: [
          {
            model: db.cart_item,
            as: "cart_items",
            include: {
              model: db.product,
              as: "product",
              include: { model: db.product_condition, as: 'condition' }
            },
          },
        ],
        order: [["createdAt", "ASC"]],
        where: {
          [Op.and]: [
            {
              customer_id: user.id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (carts) {
        carts.cart_items.forEach((elem) => {

          if (!elem.product) {

            db.cart_item.destroy({
              where: {
                [Op.and]: [{
                  id: elem.id,
                  cart_id: elem.cart_id,
                  tenant_id: TENANTID
                }]
              }
            });

          } else {
            elem.product.prod_price = elem.prod_price;
            if (elem.product.condition) {
              elem.product.prod_condition = elem.product.condition.name
            } else {
              elem.product.prod_condition = 'N/A'
            }
          }
        });




        // Return Data
        return {
          message: "Get Cart Success!!!",
          status: true,
          data: carts,
        };
      } else {
        // Return Data
        return {
          message: "Cart is Empty!!!",
          status: false,
        };
      }

    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
};
