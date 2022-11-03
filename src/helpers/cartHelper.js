const { Op } = require("sequelize");

module.exports = {
  createCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      const { customer_id, cart_item } = req;
      var cart_id;
      const checkCart = await db.cart.findOne({
        where: {
          [Op.and]: [
            {
              customer_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (!checkCart) {
        const cartInsert = await db.cart.create({
          customer_id,
          tenant_id: TENANTID,
        });
        cart_id = cartInsert.id;
      } else cart_id = checkCart.id;

      cart_item.forEach(async (item) => {
        const { product_id, quantity } = item;
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

        if (checkCartItem) {
          await db.cart_item.update(
            {
              quantity,
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
          await db.cart_item.create({
            quantity,
            cart_id,
            product_id,
            tenant_id: TENANTID,
          });
        }
      });

      // Return Formation
      return {
        message: "Cart Added Success!!!",
        status: true,
        id: cart_id,
      };
    } catch (error) {
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
  removeCartItem: async (req, db, user, isAuth, TENANTID) => {
    try {
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
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
  addSingleCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      const { cart_id, product_id, quantity } = req;

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

      if (checkCartItem) {
        await db.cart_item.update(
          {
            quantity,
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
        await db.cart_item.create({
          quantity,
          cart_id,
          product_id,
          tenant_id: TENANTID,
        });
      }

      // Return Formation
      return {
        message: "Single Cart Item Added Success!!!",
        status: true,
      };
    } catch (error) {
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
  removeCart: async (req, db, user, isAuth, TENANTID) => {
    try {
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
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
  getCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      const { customer_id } = req;
      if (!db.cart.hasAlias("cart_items")) {
        await db.cart.hasMany(db.cart_item, {
          foreignKey: "cart_id",
        });
      }
      const carts = await db.cart.findAll({
        include: [{ model: db.cart_item }],
        order: [["createdAt", "ASC"]],
        where: {
          [Op.and]: [
            {
              customer_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (carts.length > 0) {
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
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
  getSingleCart: async (req, db, user, isAuth, TENANTID) => {
    try {
      const { cart_item_id } = req;

      const cart_item = await db.cart_item.findOne({
        where: {
          [Op.and]: [
            {
              id: cart_item_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (cart_item) {
        // Return Data
        return {
          message: "Get Cart Item Success!!!",
          status: true,
          data: cart_item,
        };
      } else {
        // Return Data
        return {
          message: "Cart Item is Empty!!!",
          status: false,
        };
      }
    } catch (error) {
      if (error) return { message: "Something Went Wrong!!!", status: false };
    }
  },
};
