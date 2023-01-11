// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { multipleFileUpload } = require("../utils/fileUpload");
const config = require("config");
const { verifierEmail } = require("../utils/verifyEmailSender");
const { decrypt } = require("../utils/hashes");

// Order HELPER
module.exports = {
  // Add Order Status API
  addOrderStatus: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // DATA FROM REQUEST
      const { name, description, status } = req;

      // Order Status Slug
      const slug = slugify(`${name}`, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        trim: true,
      });

      // Check Existence
      const findOrderStatus = await db.order_status.findOne({
        where: {
          [Op.and]: [
            {
              slug,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (findOrderStatus)
        return { message: "Already Have This Order Status!!!!", status: false };

      // Add Payment Method TO DB
      const insertOrderStatus = await db.order_status.create({
        name,
        slug,
        description,
        status,
        tenant_id: TENANTID,
        created_by: user.id,
      });

      // Return Formation
      if (insertOrderStatus) {
        return {
          message: "Order Status Added Successfully!!!",
          status: true,
          tenant_id: TENANTID,
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
  // Update Order Status API
  updateOrderStatus: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // DATA FROM REQUEST
      const { id, name, description, status } = req;

      // If name also updated
      let slug;
      if (name) {
        // Order Status Slug
        slug = slugify(`${name}`, {
          replacement: "-",
          remove: /[*+~.()'"!:@]/g,
          lower: true,
          strict: true,
          trim: true,
        });

        // Check Existence
        const checkExist = await db.order_status.findOne({
          where: {
            [Op.and]: [
              {
                slug,
                tenant_id: TENANTID,
              },
            ],
            [Op.not]: [
              {
                id,
              },
            ],
          },
        });

        if (checkExist)
          return {
            message: "Already Have This Order Status!!!",
            status: false,
          };
      }

      // Update Doc
      const updateDoc = {
        name,
        slug,
        description,
        status,
        updated_by: user.id,
      };

      // Update Order Status
      const updateorderstatus = await db.order_status.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return Formation
      if (updateorderstatus) {
        return {
          message: "Order Status Updated Successfully!!!",
          status: true,
          tenant_id: TENANTID,
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
  // GET Single Order Status API
  getSingleOrderStatus: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // DATA FROM REQUEST
      const { orderstatus_id } = req;

      // Created By Associations
      db.user.belongsToMany(db.role, {
        through: db.admin_role,
        foreignKey: "admin_id",
      });
      db.role.belongsToMany(db.user, {
        through: db.admin_role,
        foreignKey: "role_id",
      });

      // Check If Has Alias with Users and Roles
      if (
        !db.order_status.hasAlias("user") &&
        !db.order_status.hasAlias("added_by")
      ) {
        await db.order_status.hasOne(db.user, {
          sourceKey: "created_by",
          foreignKey: "id",
          as: "added_by",
        });
      }

      // GET SINGLE ORDER STATUS
      const getorderstatus = await db.order_status.findOne({
        include: [
          {
            model: db.user,
            as: "added_by", // Include User who created this Order Status
            include: {
              model: db.role,
              as: "roles",
            },
          },
        ],
        where: {
          [Op.and]: [
            {
              id: orderstatus_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      return {
        message: "GET Single Order Status Success!!!",
        tenant_id: TENANTID,
        status: true,
        data: getorderstatus,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Order Status List Admin
  getOrderStatusList: async (db, TENANTID) => {
    // Try Catch Block
    try {
      // Created By Associations
      db.user.belongsToMany(db.role, {
        through: db.admin_role,
        foreignKey: "admin_id",
      });
      db.role.belongsToMany(db.user, {
        through: db.admin_role,
        foreignKey: "role_id",
      });

      // Check If Has Alias with Users and Roles
      if (
        !db.order_status.hasAlias("user") &&
        !db.order_status.hasAlias("added_by")
      ) {
        await db.order_status.hasOne(db.user, {
          sourceKey: "created_by",
          foreignKey: "id",
          as: "added_by",
        });
      }

      // GET ORDER STATUS List
      const getorderstatuslist = await db.order_status.findAll({
        include: [
          {
            model: db.user,
            as: "added_by", // Include User who created this Order Status
            include: {
              model: db.role,
              as: "roles",
            },
          },
        ],
        where: {
          tenant_id: TENANTID,
        },
      });

      return {
        message: "GET Order Status List For Admin Success!!!",
        tenant_id: TENANTID,
        status: true,
        data: getorderstatuslist,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Order Status List PUBLIC
  getPublicOrderStatusList: async (db, TENANTID) => {
    // Try Catch Block
    try {
      // GET ORDER STATUS List
      const getorderstatuslist = await db.order_status.findAll({
        where: {
          [Op.and]: [
            {
              status: true,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      return {
        message: "GET Order Status List Success!!!",
        tenant_id: TENANTID,
        status: true,
        data: getorderstatuslist,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // Add Order By Customer
  createOrderByCustomer: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const {
        cart_id,
        tax_exempt,
        person_id,
        payment_id,
        shipping_method_id,
        coupon_id,
        note,
        po_number,
        order_status_slug,
        billing_address_id,
        shipping_address_id,
        taxexempt_file,
      } = req;

      const shipping_cost = 0; // TODO ->> IT WILL CHANGE

      // GET Product Details For The Order
      if (!db.cart.hasAlias("cart_items")) {
        await db.cart.hasMany(db.cart_item, {
          foreignKey: "cart_id",
          as: "cart_items"
        });
      }

      if (!db.cart_item.hasAlias("product")) {
        await db.cart_item.hasOne(db.product, {
          sourceKey: "product_id",
          foreignKey: "id",
          as: "product"
        });
      }
      //
      const cartWithProductsAndQuantities = await db.cart.findOne({
        include: [
          {
            model: db.cart_item,
            as: "cart_items",
            include: {
              model: db.product,
              as: "product"
            },
          },
        ],
        where: {
          [Op.and]: [
            {
              id: cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      if (!cartWithProductsAndQuantities)
        return { message: "Couldn't Found The Cart Details!!!", status: false };

      //
      let cartItems = cartWithProductsAndQuantities.cart_items;
      let sub_total = 0; // sub_total
      let totalQuantity = 0;
      //
      const orderItems = [];
      cartItems.forEach(async (item) => {

        if (item.promo_type) {


          const calculateTotal = item.prod_price * item.quantity;
          sub_total += calculateTotal;
          totalQuantity += item.quantity;

          //
          await orderItems.push({
            product_id: item.product.id,
            price: item.prod_price,
            quantity: item.quantity,
            promo_type: item.promo_type,
            promo_id: await decrypt(item.promo_id).split("#")[0],
            created_by: user.id,
            tenant_id: TENANTID,
          });



        } else {
          if (item.product.prod_sale_price != 0) {
            const calculateTotal = item.product.prod_sale_price * item.quantity;
            sub_total += calculateTotal;
            totalQuantity += item.quantity;

            //
            await orderItems.push({
              product_id: item.product.id,
              price: item.product.prod_sale_price,
              quantity: item.quantity,
              created_by: user.id,
              tenant_id: TENANTID,
            });
          } else {
            const calculateTotal =
              item.product.prod_regular_price * item.quantity;
            sub_total += calculateTotal;
            totalQuantity += item.quantity;

            //
            await orderItems.push({
              product_id: item.product.id,
              price: item.product.prod_regular_price,
              quantity: item.quantity,
              created_by: user.id,
              tenant_id: TENANTID,
            });
          }
        }

      });

      //
      let discount_amount = 0; // discount amount
      if (coupon_id) {
        //
        const getCouponDetails = await db.coupon.findOne({
          where: {
            [Op.and]: [
              {
                id: coupon_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        //
        const {
          coupon_type,
          coupon_amount,
          coupon_maxamount,
          coupon_minamount,
          coupon_startdate,
          coupon_enddate,
        } = getCouponDetails;

        if (
          new Date() < new Date(coupon_enddate) &&
          new Date(coupon_startdate) < new Date()
        ) {
          if (
            coupon_maxamount >= totalQuantity &&
            coupon_minamount <= totalQuantity
          ) {
            if (coupon_type === "percentage") {
              discount_amount = (sub_total * coupon_amount) / 100;
            } else if (coupon_type === "flat") {
              discount_amount = coupon_amount;
            }
          } else {
            return {
              message: "Coupon Doesn't Meet the Order Quantity Limit!!!",
              status: false,
              tenant_id: TENANTID,
            };
          }
        } else {
          return {
            message: "Coupon Expired or In-Valid Coupon!!!",
            status: false,
            tenant_id: TENANTID,
          };
        }
      }

      //
      // Calculate Total
      let total = sub_total + shipping_cost - discount_amount;
      let tax_amount = 0;
      if (!tax_exempt) {
        const getZipCode = await db.address.findOne({
          where: {
            [Op.and]: [
              {
                id: shipping_address_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });

        if (getZipCode) {
          const { zip_code } = getZipCode;

          //
          const findTaxClass = await db.tax_class.findOne({
            where: {
              [Op.and]: [
                {
                  zip_code,
                  tenant_id: TENANTID,
                },
              ],
            },
          });

          if (findTaxClass) {
            const { tax_amount: taxamount } = findTaxClass;
            tax_amount = taxamount;
            total += tax_amount;
          }
        }
      }

      const order_status = await db.order_status.findOne({
        where: {
          [Op.and]: [
            {
              slug: order_status_slug,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Insert Order
      const insertOrder = await db.order.create({
        customer_id: user.id,
        payment_id,
        shipping_method_id,
        total,
        person_id,
        sub_total,
        shipping_cost,
        discount_amount,
        note,
        po_number,
        tax_amount,
        coupon_id,
        order_status_id: order_status?.id,
        shipping_address_id,
        tax_exempt,
        created_by: user.id,
        tenant_id: TENANTID,
      });
      if (!insertOrder)
        return { message: "Order Couldn't Placed!!!", status: false };

      await db.order_history.create({
        operation: "Order Created By User",
        order_id: insertOrder.id,
        user_id: user.id,
        created_by: user.id,
        tenant_id: TENANTID,
      });

      //
      if (tax_exempt) {
        // Upload Tax Exempt Files
        let taxExemptFiles = [];
        // Upload Tax Exempt Files to AWS S3
        const order_tax_exempt_file_src = config
          .get("AWS.ORDER_TAX_EXEMPT_FILE_SRC")
          .split("/");
        const order_tax_exempt_file_bucketName = order_tax_exempt_file_src[0];
        const order_tax_exempt_folder = order_tax_exempt_file_src
          .slice(1)
          .join("/");
        const fileUrl = await multipleFileUpload({
          file: taxexempt_file,
          idf: insertOrder.id,
          folder: order_tax_exempt_folder,
          fileName: insertOrder.id,
          bucketName: order_tax_exempt_file_bucketName,
        });
        if (!fileUrl)
          return {
            message: "Tax Exempt Certificates Couldnt Uploaded Properly!!!",
            status: false,
          };

        // Assign Values To Tax Exempt File Array For Bulk Create
        fileUrl.forEach(async (taxFile) => {
          await taxExemptFiles.push({
            file_name: taxFile.upload.Key.split("/").slice(-1)[0],
            order_id: insertOrder.id,
            tenant_id: TENANTID,
            created_by: user.id,
          });
        });

        // If Tax File Array Created Successfully then Bulk Create In Tax Exempt Table
        if (taxExemptFiles && taxExemptFiles.length > 0) {
          // Tax File Exempts Save Bulk
          const taxExemptFilesSave = await db.tax_exempt.bulkCreate(
            taxExemptFiles
          );
          if (!taxExemptFilesSave)
            return {
              message: "Tax Exempt Files Save Failed!!!",
              status: false,
            };
        }
      }

      //
      orderItems.forEach(async (item) => {
        item.order_id = insertOrder.id;
      });

      // Insert Payment
      const insertPayment = await db.payment.create({
        order_id: insertOrder.id,
        billing_address_id,
        amount: total,
        provider_id: payment_id,
        status: "Pending", // TODO HAVE TO CHANGE
        created_by: user.id,
        tenant_id: TENANTID,
      });
      if (!insertPayment)
        return { message: "Payment Details Insert Failed!!!", status: false };

      //
      if (orderItems) {
        const createOrderItem = await db.order_item.bulkCreate(orderItems);
        if (!createOrderItem)
          return { message: "Order Items Insert Failed", status: false };
      }

      // DELETE CART AND CART ITEMS
      db.cart_item.destroy({
        where: {
          [Op.and]: [
            {
              cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      // DELETE CART AND CART ITEMS
      db.cart.destroy({
        where: {
          [Op.and]: [
            {
              id: cart_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return Formation
      return {
        message: "Successfully Placed The Order!!!",
        status: true,
        tenant_id: TENANTID,
        id: insertOrder.id,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // Add Order By Admin
  createOrderByAdmin: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const {
        customer_id,
        person_id,
        tax_exempt,
        taxexempt_file,
        payment_id,
        coupon_id,
        note,
        po_number,
        shipping_account_id,
        order_status_id,
        billing_address_id,
        shipping_address_id,
        shipping_method_id,
        orderProducts
      } = req;

      // GET Product IDS
      let productIDS = [];
      orderProducts.forEach(async (element) => {
        await productIDS.push(element.product_id)
      });

      // FIND PRODUCTS
      const findProducts = await db.product.findAll({
        where: {
          [Op.and]: [{
            id: productIDS,
            tenant_id: TENANTID
          }]
        }
      });

      const shipping_cost = 0; // TODO ->> IT WILL CHANGE

      let sub_total = 0; // sub_total
      let totalQuantity = 0;
      let orderProductItems = [];
      //
      orderProducts.forEach(async (item) => {

        findProducts.forEach(async (element) => {

          if (item.product_id === parseInt(element.id)) {

            if (element.prod_sale_price != 0) {
              const calculateTotal = element.prod_sale_price * item.quantity;
              sub_total += calculateTotal;
              totalQuantity += item.quantity;

              //
              await orderProductItems.push({
                product_id: item.product_id,
                price: element.prod_sale_price,
                quantity: item.quantity,
                created_by: user.id,
                tenant_id: TENANTID,
              });
            } else {
              const calculateTotal = element.prod_regular_price * item.quantity;
              sub_total += calculateTotal;
              totalQuantity += item.quantity;

              //
              await orderProductItems.push({
                product_id: item.product_id,
                price: element.prod_regular_price,
                quantity: item.quantity,
                created_by: user.id,
                tenant_id: TENANTID,
              });
            }
          }
        });
      });

      //
      let discount_amount = 0; // discount amount
      if (coupon_id) {
        //
        const getCouponDetails = await db.coupon.findOne({
          where: {
            [Op.and]: [
              {
                id: coupon_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        //
        const {
          coupon_type,
          coupon_amount,
          coupon_maxamount,
          coupon_minamount,
          coupon_startdate,
          coupon_enddate,
        } = getCouponDetails;

        if (
          new Date() < new Date(coupon_enddate) &&
          new Date(coupon_startdate) < new Date()
        ) {
          if (
            coupon_maxamount >= totalQuantity &&
            coupon_minamount <= totalQuantity
          ) {
            if (coupon_type === "percentage") {
              discount_amount = (sub_total * coupon_amount) / 100;
            } else if (coupon_type === "flat") {
              discount_amount = coupon_amount;
            }
          } else {
            return {
              message: "Coupon Doesn't Meet the Order Quantity Limit!!!",
              status: false,
              tenant_id: TENANTID,
            };
          }
        } else {
          return {
            message: "Coupon Expired or In-Valid Coupon!!!",
            status: false,
            tenant_id: TENANTID,
          };
        }
      }

      //
      // Calculate Total
      let total = sub_total + shipping_cost - discount_amount;
      let tax_amount = 0;
      if (!tax_exempt) {
        const getZipCode = await db.address.findOne({
          where: {
            [Op.and]: [
              {
                id: shipping_address_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });

        if (getZipCode) {
          const { zip_code } = getZipCode;

          //
          const findTaxClass = await db.tax_class.findOne({
            where: {
              [Op.and]: [
                {
                  zip_code,
                  tenant_id: TENANTID,
                },
              ],
            },
          });

          if (findTaxClass) {
            const { tax_amount: taxamount } = findTaxClass;
            tax_amount = taxamount;
            total += tax_amount;
          }
        }
      }

      // Insert Order
      const insertOrder = await db.order.create({
        customer_id,
        person_id,
        payment_id,
        total,
        sub_total,
        shipping_cost,
        discount_amount,
        tax_amount,
        coupon_id,
        note,
        shipping_account_id,
        po_number,
        order_status_id,
        shipping_address_id,
        shipping_method_id,
        tax_exempt,
        created_by: user.id,
        tenant_id: TENANTID,
      });
      if (!insertOrder) return { message: "Order Coulnd't Placed!!!", status: false };

      await db.order_history.create({
        operation: "Order Created By Admin",
        order_id: insertOrder.id,
        user_id: user.id,
        created_by: user.id,
        tenant_id: TENANTID,
      });

      //
      if (tax_exempt) {
        // Upload Tax Exempt Files
        let taxExemptFiles = [];
        // Upload Tax Exempt Files to AWS S3
        const order_tax_exempt_file_src = config
          .get("AWS.ORDER_TAX_EXEMPT_FILE_SRC")
          .split("/");
        const order_tax_exempt_file_bucketName = order_tax_exempt_file_src[0];
        const order_tax_exempt_folder = order_tax_exempt_file_src
          .slice(1)
          .join("/");
        const fileUrl = await multipleFileUpload({
          file: taxexempt_file,
          idf: insertOrder.id,
          folder: order_tax_exempt_folder,
          fileName: insertOrder.id,
          bucketName: order_tax_exempt_file_bucketName,
        });
        if (!fileUrl)
          return {
            message: "Tax Exempt Certificates Couldnt Uploaded Properly!!!",
            status: false,
          };

        // Assign Values To Tax Exempt File Array For Bulk Create
        fileUrl.forEach(async (taxFile) => {
          await taxExemptFiles.push({
            file_name: taxFile.upload.Key.split("/").slice(-1)[0],
            order_id: insertOrder.id,
            tenant_id: TENANTID,
            created_by: user.id,
          });
        });

        // If Tax File Array Created Successfully then Bulk Create In Tax Exempt Table
        if (taxExemptFiles && taxExemptFiles.length > 0) {
          // Tax File Exempts Save Bulk
          const taxExemptFilesSave = await db.tax_exempt.bulkCreate(
            taxExemptFiles
          );
          if (!taxExemptFilesSave)
            return {
              message: "Tax Exempt Files Save Failed!!!",
              status: false,
            };
        }
      }

      //
      orderProductItems.forEach(async (item) => {
        item.order_id = insertOrder.id;
      });

      // Insert Payment
      const insertPayment = await db.payment.create({
        order_id: insertOrder.id,
        billing_address_id,
        amount: total,
        provider_id: payment_id,
        status: "Pending", // TODO HAVE TO CHANGE
        created_by: user.id,
        tenant_id: TENANTID,
      });
      if (!insertPayment) return { message: "Payment Details Insert Failed!!!", status: false };

      //
      if (orderProductItems && orderProductItems.length > 0) {
        const createOrderItem = await db.order_item.bulkCreate(orderProductItems);
        if (!createOrderItem) return { message: "Order Items Insert Failed", status: false };
      }

      // Return Formation
      return {
        message: "Successfully Placed The Order!!!",
        status: true,
        tenant_id: TENANTID,
        id: insertOrder.id,
      };

    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Order List Admin
  getOrderlistAdmin: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {

      const { searchQuery,
        productIds,
        paymentmethods,
        statuses,
        updatedby,
        orderEntryStartDate,
        orderEntryEndDate,
        orderUpdatedStartDate,
        orderUpdatedEndDate } = req;

      // Check If Has Alias with Users and Order
      if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
        await db.order.hasOne(db.user, {
          sourceKey: "customer_id",
          foreignKey: "id",
          as: "customer",
        });
      }

      // Check If Has Alias with Order and Payment Method
      if (
        !db.order.hasAlias("payment_method") &&
        !db.order.hasAlias("paymentmethod")
      ) {
        await db.order.hasOne(db.payment_method, {
          sourceKey: "payment_id",
          foreignKey: "id",
          as: "paymentmethod",
        });
      }

      // Check If Has Alias with Order and Order Status
      if (
        !db.order.hasAlias("order_status") &&
        !db.order.hasAlias("orderStatus")
      ) {
        await db.order.hasOne(db.order_status, {
          sourceKey: "order_status_id",
          foreignKey: "id",
          as: "orderStatus",
        });
      }

      // Order and Order Items
      if (
        !db.order.hasAlias("order_item") &&
        !db.order.hasAlias("orderitems")
      ) {
        await db.order.hasMany(db.order_item, {
          foreignKey: "order_id",
          as: "orderitems",
        });
      }
      // Order Items and Product
      if (!db.order_item.hasAlias("product")) {
        await db.order_item.hasOne(db.product, {
          sourceKey: "product_id",
          foreignKey: "id",
          as: "product"
        });
      }

      // Condtional Date Filters
      const twoDateFilterWhere = orderEntryStartDate && orderEntryEndDate ? {
        [Op.and]: [{
          [Op.gte]: new Date(orderEntryStartDate),
          [Op.lte]: new Date(orderEntryEndDate),
        }]
      } : {};

      const startDateFilterWhere = (orderEntryStartDate && !orderEntryEndDate) ? {
        [Op.gte]: new Date(orderEntryStartDate)
      } : {};

      const endDateFilterWhere = (orderEntryEndDate && !orderEntryStartDate) ? {
        [Op.lte]: new Date(orderEntryEndDate)
      } : {};

      const twoUpdatedDateFilterWhere = orderUpdatedStartDate && orderUpdatedEndDate ? {
        [Op.and]: [{
          [Op.gte]: new Date(orderUpdatedStartDate),
          [Op.lte]: new Date(orderUpdatedEndDate),
        }]
      } : {};

      const updatedStartDateFilterWhere = (orderUpdatedStartDate && !orderUpdatedEndDate) ? {
        [Op.gte]: new Date(orderUpdatedStartDate)
      } : {};

      const updatedEndDateFilterWhere = (orderUpdatedEndDate && !orderUpdatedStartDate) ? {
        [Op.lte]: new Date(orderUpdatedEndDate)
      } : {};

      const searchQueryCustomerWhere = searchQuery ? {
        [Op.or]: [
          {
            email: {
              [Op.iLike]: `%${searchQuery}%`
            }
          },
          {
            first_name: {
              [Op.iLike]: `%${searchQuery}%`
            }
          },
          {
            last_name: {
              [Op.iLike]: `%${searchQuery}%`
            }
          }
        ]
      } : {};


      // Order List For Admin
      const orderlist = await db.order.findAll({
        include: [
          {
            model: db.order_item, // Order Items and Products
            as: "orderitems",
            ...(productIds && productIds.length && {
              where: {
                product_id: {
                  [Op.in]: productIds
                }
              }
            }),
            include: [{
              model: db.product,
              as: "product"
            }]
          },
          {
            model: db.user,
            as: "customer",
            ...(searchQuery && { where: searchQueryCustomerWhere }),
          },
          {
            model: db.payment_method,
            as: "paymentmethod",
            ...(paymentmethods && paymentmethods.length && {
              where: {
                id: {
                  [Op.in]: paymentmethods
                }
              }
            })
          },
          {
            model: db.order_status,
            as: "orderStatus",
            ...(statuses && statuses.length && {
              where: {
                id: {
                  [Op.in]: statuses
                }
              }
            }),
          }
        ],
        where: {
          tenant_id: TENANTID,
          ...(updatedby && updatedby.length && {
            updated_by: {
              [Op.in]: updatedby
            }
          }),
          ...((orderEntryStartDate || orderEntryEndDate) && {
            createdAt: {
              [Op.or]: [{
                ...(twoDateFilterWhere && twoDateFilterWhere),
                ...(startDateFilterWhere && startDateFilterWhere),
                ...(endDateFilterWhere && endDateFilterWhere),
              }],
            }
          }),
          ...((orderUpdatedStartDate || orderUpdatedEndDate) && {
            updatedAt: {
              [Op.or]: [{
                ...(twoUpdatedDateFilterWhere && twoUpdatedDateFilterWhere),
                ...(updatedStartDateFilterWhere && updatedStartDateFilterWhere),
                ...(updatedEndDateFilterWhere && updatedEndDateFilterWhere),
              }],
            }
          })
        },
      });


      // Return Formation
      return {
        message: "GET Order List Success",
        status: true,
        tenant_id: TENANTID,
        data: orderlist,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Single Order Admin
  getSingleOrderAdmin: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { order_id } = req;

      // Check If Has Alias with Users and Order
      if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
        await db.order.hasOne(db.user, {
          sourceKey: "customer_id",
          foreignKey: "id",
          as: "customer",
        });
      }

      if (!db.user.hasAlias('contact_person') && !db.user.hasAlias('contactPersons')) {
        await db.user.hasMany(db.contact_person,
          {
            foreignKey: 'ref_id',
            constraints: false,
            scope: {
              ref_model: 'customer'
            },
            as: "contactPersons"
          });
      }

      // Check If Has Alias with Users and Order
      if (!db.user.hasAlias("address") && !db.user.hasAlias("addresses")) {
        await db.user.hasMany(db.address, {
          foreignKey: "ref_id",
          as: "addresses",
        });
      }

      // Check If Has Alias with Order and Payment Method
      if (
        !db.order.hasAlias("payment_method") &&
        !db.order.hasAlias("paymentmethod")
      ) {
        await db.order.hasOne(db.payment_method, {
          sourceKey: "payment_id",
          foreignKey: "id",
          as: "paymentmethod",
        });
      }

      // Check If Has Alias with Order and Order Status
      if (
        !db.order.hasAlias("order_status") &&
        !db.order.hasAlias("orderstatus")
      ) {
        await db.order.hasOne(db.order_status, {
          sourceKey: "order_status_id",
          foreignKey: "id",
          as: "orderstatus",
        });
      }

      // Order and Order Items
      if (
        !db.order.hasAlias("order_item") &&
        !db.order.hasAlias("orderitems")
      ) {
        await db.order.hasMany(db.order_item, {
          foreignKey: "order_id",
          as: "orderitems",
        });
      }
      // Order Items and Product
      if (!db.order_item.hasAlias("product")) {
        await db.order_item.hasOne(db.product, {
          sourceKey: "product_id",
          foreignKey: "id",
        });
      }

      // Order and Payment
      if (!db.order.hasAlias("payment")) {
        await db.order.hasOne(db.payment, {
          foreignKey: "order_id",
          as: "payment",
        });
      }
      //  Payment and Address For Billing Address
      if (
        !db.payment.hasAlias("address") &&
        !db.payment.hasAlias("billingAddress")
      ) {
        await db.payment.hasOne(db.address, {
          sourceKey: "billing_address_id",
          foreignKey: "id",
          as: "billingAddress",
        });
      }

      // Order and Address For Shipping Address
      if (
        !db.order.hasAlias("address") &&
        !db.order.hasAlias("shippingAddress")
      ) {
        await db.order.hasOne(db.address, {
          sourceKey: "shipping_address_id",
          foreignKey: "id",
          as: "shippingAddress",
        });
      }

      // Order and Tax Exempt For File Names
      if (
        !db.order.hasAlias("tax_exempt") &&
        !db.order.hasAlias("taxExemptFiles")
      ) {
        await db.order.hasMany(db.tax_exempt, {
          foreignKey: "order_id",
          as: "taxExemptFiles",
        });
      }

      // Order and Coupon
      if (!db.order.hasAlias("coupon")) {
        await db.order.hasOne(db.coupon, {
          sourceKey: "coupon_id",
          foreignKey: "id",
        });
      }
      // Order and Contact Person
      if (!db.order.hasAlias("contact_person") && !db.order.hasAlias("contactperson")) {
        await db.order.hasOne(db.contact_person, {
          sourceKey: "person_id",
          foreignKey: "id",
          as: "contactperson"
        });
      }

      // User and Roles Through Admin Roles Associations
      db.user.belongsToMany(db.role, {
        through: db.admin_role,
        foreignKey: "admin_id",
      });
      db.role.belongsToMany(db.user, {
        through: db.admin_role,
        foreignKey: "role_id",
      });

      // Order and User
      if (!db.order.hasAlias("user") && !db.order.hasAlias("added_by")) {
        await db.order.hasOne(db.user, {
          sourceKey: "created_by",
          foreignKey: "id",
          as: "added_by",
        });
      }


      // Order and Shipping method
      if (!db.order.hasAlias("shipping_method") && !db.order.hasAlias("shippingmethod")) {
        await db.order.hasOne(db.shipping_method, {
          sourceKey: "shipping_method_id",
          foreignKey: "id",
          as: "shippingmethod",
        });
      }

      // Order and Shipping Account
      if (!db.order.hasAlias("shipping_account") && !db.order.hasAlias("shippingAccount")) {
        await db.order.hasOne(db.shipping_account, {
          sourceKey: "shipping_account_id",
          foreignKey: "id",
          as: "shippingAccount"
        });
      }

      // Single Order For Admin
      const singleOrder = await db.order.findOne({
        include: [
          {
            model: db.user,
            as: "customer",
            include: [
              { model: db.address, as: "addresses" },
              { model: db.contact_person, as: "contactPersons" }
            ]
          }, // User as customer
          { model: db.payment_method, as: "paymentmethod" }, // Payment method
          { model: db.order_status, as: "orderstatus" }, // Order Status
          { model: db.contact_person, as: "contactperson" }, // Contact Person
          {
            model: db.order_item, // Order Items and Products
            as: "orderitems",
            include: {
              model: db.product,
              as: "product",
            },
          },
          {
            model: db.payment, // Payment and Address
            as: "payment",
            include: {
              model: db.address,
              as: "billingAddress",
            },
          },
          { model: db.address, as: "shippingAddress" }, // Address
          { model: db.shipping_method, as: "shippingmethod" }, // Shipping Method
          { model: db.shipping_account, as: "shippingAccount" }, // Shipping Account
          { model: db.tax_exempt, as: "taxExemptFiles" }, // Tax Exempt
          { model: db.coupon, as: "coupon" }, // Coupon
          {
            model: db.user,
            as: "added_by", // User and Roles
            include: {
              model: db.role,
              as: "roles",
            },
          },
        ],
        where: {
          [Op.and]: [
            {
              id: order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return Formation
      return {
        message: "GET Single Order Success",
        status: true,
        tenant_id: TENANTID,
        data: singleOrder,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // UPDATE Order By Admin
  updateOrder: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { order_id,
        shipping_address_id,
        person_id,
        billing_address_id,
        shipping_method_id,
        payment_id,
        coupon_id,
        note,
        po_number,
        order_status_id,
        shipping_account_id,
        tax_exempt,
        taxexempt_file,
        orderItems } = req;

      const shipping_cost = 0;

      // Product ID Array
      const productIds = [];
      orderItems.forEach(async (element) => {
        await productIds.push(element.product_id);
      });

      //
      const newOrderItemsArray = [];
      let sub_total = 0; // sub_total
      let totalQuantity = 0; // Total Quantity
      let discount_amount = 0; // Discount Amount
      const findProduct = await db.product.findAll({
        where: {
          [Op.and]: [
            {
              id: productIds,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Find Product and Get Details and push to array
      await orderItems.forEach(async (item) => {
        findProduct.forEach(async (element) => {
          if (item.product_id === parseInt(element.id)) {
            //
            if (element.prod_sale_price != 0) {
              const calculateTotal =
                (await element.prod_sale_price) * item.quantity;
              sub_total += calculateTotal;
              totalQuantity += item.quantity;

              //
              await newOrderItemsArray.push({
                product_id: element.id,
                price: element.prod_sale_price,
                quantity: item.quantity,
                order_id,
                updated_by: user.id,
                tenant_id: TENANTID,
              });
            } else {
              const calculateTotal =
                (await element.prod_regular_price) * item.quantity;
              sub_total += calculateTotal;
              totalQuantity += item.quantity;

              //
              await newOrderItemsArray.push({
                product_id: element.id,
                price: element.prod_regular_price,
                quantity: item.quantity,
                order_id,
                updated_by: user.id,
                tenant_id: TENANTID,
              });
            }
          }
        });
      });

      // GET PAYMENT
      const getPayment = await db.payment.findOne({
        where: {
          [Op.and]: [{
            order_id,
            tenant_id: TENANTID
          }]
        }
      });
      const { provider_id } = getPayment;


      if (coupon_id) {
        // TODO ->>>>> NEED TO IMPLEMENT A LOGIC FOR COUPON ACCEPT PARTIALLY
        //
        const getCouponDetails = await db.coupon.findOne({
          where: {
            [Op.and]: [
              {
                id: coupon_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        //
        const {
          coupon_type,
          coupon_amount,
          coupon_maxamount,
          coupon_minamount,
          coupon_startdate,
          coupon_enddate,
        } = getCouponDetails;

        if (
          new Date() < new Date(coupon_enddate) &&
          new Date(coupon_startdate) < new Date()
        ) {
          if (
            coupon_maxamount >= totalQuantity &&
            coupon_minamount <= totalQuantity
          ) {
            if (coupon_type === "percentage") {
              discount_amount = (sub_total * coupon_amount) / 100;
            } else if (coupon_type === "flat") {
              discount_amount = coupon_amount;
            }
          } else {
            return {
              message: "Coupon Doesn't Meet the Order Quantity Limit!!!",
              status: false,
              tenant_id: TENANTID,
            };
          }
        } else {
          return {
            message: "Coupon Expired or In-Valid Coupon!!!",
            status: false,
            tenant_id: TENANTID,
          };
        }
      }

      //
      const getOrder = await db.order.findOne({
        where: {
          [Op.and]: [{
            id: order_id,
            tenant_id: TENANTID
          }]
        }
      });
      const { shipping_address_id: oldShippingID, tax_amount: oldTaxAmount } = getOrder;

      // Calculate Total
      let total = sub_total + shipping_cost - discount_amount;
      // 
      const tax_amount = 0;
      if (!tax_exempt) {
        const getZipCode = await db.address.findOne({
          where: {
            [Op.and]: [
              {
                id: shipping_address_id ?? oldShippingID,
                tenant_id: TENANTID,
              },
            ],
          },
        });

        if (getZipCode) {
          const { zip_code } = getZipCode;

          //
          const findTaxClass = await db.tax_class.findOne({
            where: {
              [Op.and]: [
                {
                  zip_code,
                  tenant_id: TENANTID,
                },
              ],
            },
          });

          if (findTaxClass) {
            const { tax_amount: taxamount } = findTaxClass;
            tax_amount = taxamount;
            total += tax_amount;
          }
        }
      }

      //
      if (tax_exempt && taxexempt_file.length > 0) return { message: "Tax Exempt File Is Required!!!", status: false }
      //
      if (tax_exempt) {

        // Upload Tax Exempt Files
        let taxExemptFiles = [];
        // Upload Tax Exempt Files to AWS S3
        const order_tax_exempt_file_src = config
          .get("AWS.ORDER_TAX_EXEMPT_FILE_SRC")
          .split("/");
        const order_tax_exempt_file_bucketName = order_tax_exempt_file_src[0];
        const order_tax_exempt_folder = order_tax_exempt_file_src
          .slice(1)
          .join("/");
        const fileUrl = await multipleFileUpload({
          file: taxexempt_file,
          idf: order_id,
          folder: order_tax_exempt_folder,
          fileName: order_id,
          bucketName: order_tax_exempt_file_bucketName,
        });
        if (!fileUrl)
          return {
            message: "Tax Exempt Certificates Couldnt Uploaded Properly!!!",
            status: false,
          };

        // Assign Values To Tax Exempt File Array For Bulk Create
        fileUrl.forEach(async (taxFile) => {
          await taxExemptFiles.push({
            file_name: taxFile.upload.Key.split("/").slice(-1)[0],
            order_id: order_id,
            tenant_id: TENANTID,
            updated_by: user.id,
          });
        });

        // If Tax File Array Created Successfully then Bulk Create In Tax Exempt Table
        if (taxExemptFiles && taxExemptFiles.length > 0) {
          // Tax File Exempts Save Bulk
          const taxExemptFilesSave = await db.tax_exempt.bulkCreate(taxExemptFiles);
          if (!taxExemptFilesSave)
            return {
              message: "Tax Exempt Files Save Failed!!!",
              status: false,
            };
        }

        if (oldTaxAmount != 0) {
          tax_amount = 0;
          total -= oldTaxAmount
        }
      }


      // Update Order
      const updateDoc = {
        total,
        person_id,
        sub_total,
        tax_amount,
        shipping_address_id,
        shipping_method_id,
        payment_id,
        discount_amount,
        note,
        po_number,
        coupon_id,
        shipping_account_id,
        tax_exempt,
        order_status_id,
        updated_by: user.id,
      };
      const updateorder = await db.order.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id: order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!updateorder) return { message: "Order Couldn't Updated!!!", status: false };


      // Update Order History
      await db.order_history.create({
        operation: "Order Updated By Admin",
        order_id,
        user_id: user.id,
        updated_by: user.id,
        tenant_id: TENANTID,
      });

      // Update Order Items
      await db.order_item.destroy({
        where: {
          [Op.and]: [
            {
              order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      //
      const newOrderItems = await db.order_item.bulkCreate(newOrderItemsArray);
      if (!newOrderItems)
        return { message: "Order Items Update Failed!!!", status: false };

      //
      const updateDocPayment = {
        amount: total,
        provider_id: payment_id ?? provider_id,
        billing_address_id
      };
      const updateOrderPayment = await db.payment.update(updateDocPayment, {
        where: {
          [Op.and]: [
            {
              order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!updateOrderPayment)
        return { message: "Order Payment Update Failed!!!", status: false };

      // Return Formation
      return {
        message: "Order Updated Successfully!!!",
        tenant_id: TENANTID,
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
  // Change Order Status By Admin
  orderStatusChange: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { order_id, order_status_id } = req;

      // Update Doc
      const updateDoc = {
        order_status_id,
        updated_by: user.id,
      };

      // Update Order Status
      const updateorderstatus = await db.order.update(updateDoc, {
        where: {
          [Op.and]: [
            {
              id: order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!updateorderstatus)
        return { message: "Order Status Couldn't Changed!!!", status: false };

      // Update Order History
      await db.order_history.create({
        operation: "Order Status Changed By Admin",
        order_id,
        user_id: user.id,
        updated_by: user.id,
        tenant_id: TENANTID,
      });

      // Return Formation
      return {
        message: "Order Status Updated Successfully!!!",
        tenant_id: TENANTID,
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
  // GET Order List By Customer ID
  getOrderListByCustomerID: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { customer_id } = req;

      // Check If Has Alias with Users and Order
      if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
        await db.order.hasOne(db.user, {
          sourceKey: "customer_id",
          foreignKey: "id",
          as: "customer",
        });
      }

      // Check If Has Alias with Order and Payment Method
      if (
        !db.order.hasAlias("payment_method") &&
        !db.order.hasAlias("paymentmethod")
      ) {
        await db.order.hasOne(db.payment_method, {
          sourceKey: "payment_id",
          foreignKey: "id",
          as: "paymentmethod",
        });
      }

      // Check If Has Alias with Order and Order Status
      if (
        !db.order.hasAlias("order_status") &&
        !db.order.hasAlias("orderStatus")
      ) {
        await db.order.hasOne(db.order_status, {
          sourceKey: "order_status_id",
          foreignKey: "id",
          as: "orderStatus",
        });
      }

      // Order and Order Items
      if (
        !db.order.hasAlias("order_item") &&
        !db.order.hasAlias("orderitems")
      ) {
        await db.order.hasMany(db.order_item, {
          foreignKey: "order_id",
          as: "orderitems",
        });
      }

      // Order List For Admin
      const orderlist = await db.order.findAll({
        include: [
          { model: db.user, as: "customer" },
          { model: db.payment_method, as: "paymentmethod" },
          { model: db.order_status, as: "orderStatus" },
          { model: db.order_item, as: "orderitems" },
        ],
        where: {
          [Op.and]: [
            {
              customer_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Add Product Count Per Order
      await orderlist.forEach(async (element) => {
        if (element.orderitems && element.orderitems.length > 0) {
          element.productCount = element.orderitems.length;
        }
      });

      // Return Formation
      return {
        message: "GET Order List Success",
        status: true,
        tenant_id: TENANTID,
        data: orderlist,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Single Order For Customer
  getSingleOrderCustomer: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { order_id } = req;

      // Check If Has Alias with Users and Order
      if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
        await db.order.hasOne(db.user, {
          sourceKey: "customer_id",
          foreignKey: "id",
          as: "customer",
        });
      }

      // Check If Has Alias with Order and Payment Method
      if (
        !db.order.hasAlias("payment_method") &&
        !db.order.hasAlias("paymentmethod")
      ) {
        await db.order.hasOne(db.payment_method, {
          sourceKey: "payment_id",
          foreignKey: "id",
          as: "paymentmethod",
        });
      }

      // Check If Has Alias with Order and Order Status
      if (
        !db.order.hasAlias("order_status") &&
        !db.order.hasAlias("orderstatus")
      ) {
        await db.order.hasOne(db.order_status, {
          sourceKey: "order_status_id",
          foreignKey: "id",
          as: "orderstatus",
        });
      }

      // Order and Order Items
      if (
        !db.order.hasAlias("order_item") &&
        !db.order.hasAlias("orderitems")
      ) {
        await db.order.hasMany(db.order_item, {
          foreignKey: "order_id",
          as: "orderitems",
        });
      }
      // Order Items and Product
      if (!db.order_item.hasAlias("product")) {
        await db.order_item.hasOne(db.product, {
          sourceKey: "product_id",
          foreignKey: "id",
        });
      }

      // Order and Payment
      if (!db.order.hasAlias("payment")) {
        await db.order.hasOne(db.payment, {
          foreignKey: "order_id",
          as: "payment",
        });
      }
      //  Payment and Address For Billing Address
      if (
        !db.payment.hasAlias("address") &&
        !db.payment.hasAlias("billingAddress")
      ) {
        await db.payment.hasOne(db.address, {
          sourceKey: "billing_address_id",
          foreignKey: "id",
          as: "billingAddress",
        });
      }

      // Order and Address For Shipping Address
      if (
        !db.order.hasAlias("address") &&
        !db.order.hasAlias("shippingAddress")
      ) {
        await db.order.hasOne(db.address, {
          sourceKey: "shipping_address_id",
          foreignKey: "id",
          as: "shippingAddress",
        });
      }

      // Order and Tax Exempt For File Names
      if (
        !db.order.hasAlias("tax_exempt") &&
        !db.order.hasAlias("taxExemptFiles")
      ) {
        await db.order.hasMany(db.tax_exempt, {
          foreignKey: "order_id",
          as: "taxExemptFiles",
        });
      }

      // Order and Coupon
      if (!db.order.hasAlias("coupon")) {
        await db.order.hasOne(db.coupon, {
          sourceKey: "coupon_id",
          foreignKey: "id",
        });
      }

      // Order and Contact Person
      if (!db.order.hasAlias("contact_person") && !db.order.hasAlias("contactperson")) {
        await db.order.hasOne(db.contact_person, {
          sourceKey: "person_id",
          foreignKey: "id",
          as: "contactperson"
        });
      }

      // Single Order For Admin
      const singleOrder = await db.order.findOne({
        include: [
          { model: db.user, as: "customer" }, // User as customer
          { model: db.payment_method, as: "paymentmethod" }, // Payment method
          { model: db.order_status, as: "orderstatus" }, // Order Status
          { model: db.contact_person, as: "contactperson" }, // Contact Person
          {
            model: db.order_item, // Order Items and Products
            as: "orderitems",
            include: {
              model: db.product,
              as: "product",
            },
          },
          {
            model: db.payment,
            as: "payment", // Payment and Address
            include: {
              model: db.address,
              as: "billingAddress",
            },
          },
          { model: db.address, as: "shippingAddress" }, // Address
          { model: db.tax_exempt, as: "taxExemptFiles" }, // Tax Exempt
          { model: db.coupon, as: "coupon" }, // Coupon
        ],
        where: {
          [Op.and]: [
            {
              id: order_id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      //
      singleOrder.orderitems.forEach((elem) => {
        elem.product.prod_price = elem.price;
      });

      // Return Formation
      return {
        message: "GET Single Order Success",
        status: true,
        tenant_id: TENANTID,
        data: singleOrder,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // Cancel Order By Customer
  orderCancelByCustomer: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { order_id, order_status_id } = req;

      // Update Doc
      const updateDoc = {
        order_status_id,
        updated_by: user.id,
      };

      // Check If Has Alias with Order and Order Status
      if (
        !db.order.hasAlias("order_status") &&
        !db.order.hasAlias("orderstatus")
      ) {
        await db.order.hasOne(db.order_status, {
          sourceKey: "order_status_id",
          foreignKey: "id",
          as: "orderstatus",
        });
      }

      // Find Order
      const findOrder = await db.order.findOne({
        include: [
          { model: db.order_status, as: "orderstatus" }, // Order Status
        ],
        where: {
          [Op.and]: [
            {
              id: order_id,
              customer_id: user.id,
              tenant_id: TENANTID,
            },
          ],
        },
      });
      if (!findOrder) return { message: "Order Not Found!!!", status: false };

      if (findOrder.orderstatus.slug === "pending") {
        // Update Order Status
        const updateorderstatus = await db.order.update(updateDoc, {
          where: {
            [Op.and]: [
              {
                id: order_id,
                tenant_id: TENANTID,
              },
            ],
          },
        });
        if (!updateorderstatus)
          return { message: "Order Cancelled!!!", status: false };

        // Update Order History
        await db.order_history.create({
          operation: "Order Cancelled By User",
          order_id,
          user_id: user.id,
          updated_by: user.id,
          tenant_id: TENANTID,
        });

        // Setting Up Data for EMAIL SENDER
        let mailData = {
          email: user.email,
          subject: "About Cancel Order on Prime Server Parts",
          message: `Your Order Has Been Cancelled. If this is not you please contact to Support and login to Your account to see the details!!!`,
        };

        // SENDING EMAIL
        await verifierEmail(mailData);

        // Return Formation
        return {
          message: "Order Cancelled Successfully!!!",
          tenant_id: TENANTID,
          status: true,
        };
      } else {
        return {
          message: "You Cannot Cancel Your Order At This Point!!!",
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
  // GET Order Activity History List Admin
  getOrderActivityHistory: async (req, db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {
      // Data From Request
      const { id } = req;

      // User and Roles Through Admin Roles Associations
      db.user.belongsToMany(db.role, {
        through: db.admin_role,
        foreignKey: "admin_id",
      });
      db.role.belongsToMany(db.user, {
        through: db.admin_role,
        foreignKey: "role_id",
      });

      // Order and User
      if (
        !db.order_history.hasAlias("user") &&
        !db.order_history.hasAlias("activity_by")
      ) {
        await db.order_history.hasOne(db.user, {
          sourceKey: "user_id",
          foreignKey: "id",
          as: "activity_by",
        });
      }

      // Order Hsitory List
      const orderhistoryList = await db.order_history.findAll({
        include: [
          {
            model: db.user,
            as: "activity_by", // User and Roles
            include: {
              model: db.role,
              as: "roles",
            },
          },
        ],
        where: {
          [Op.and]: [
            {
              order_id: id,
              tenant_id: TENANTID,
            },
          ],
        },
      });

      // Return Formation
      return {
        message: "GET Order History Activity List Success!!!",
        status: true,
        tenant_id: TENANTID,
        data: orderhistoryList,
      };
    } catch (error) {
      if (error)
        return {
          message: `Something Went Wrong!!! Error: ${error}`,
          status: false,
        };
    }
  },
  // GET Order Update Admin List
  getOrderUpdateAdminList: async (db, user, isAuth, TENANTID) => {
    // Try Catch Block
    try {

      // User and Roles Through Admin Roles Associations
      db.user.belongsToMany(db.role, {
        through: db.admin_role,
        foreignKey: "admin_id",
      });
      db.role.belongsToMany(db.user, {
        through: db.admin_role,
        foreignKey: "role_id",
      });

      // Order and User
      if (
        !db.order.hasAlias("user") &&
        !db.order.hasAlias("admin")
      ) {
        await db.order.hasOne(db.user, {
          sourceKey: "updated_by",
          foreignKey: "id",
          as: "admin",
        });
      }

      // Admin List
      const orderUpdateAdminList = await db.order.findAll({
        include: [
          {
            model: db.user,
            as: "admin", // User and Roles
            include: {
              model: db.role,
              as: "roles",
            },
          },
        ],
        where: {
          tenant_id: TENANTID,
          updated_by: {
            [Op.ne]: null
          }
        },
      });

      //
      let adminArray = [];
      await orderUpdateAdminList.forEach(async (item) => {
        await adminArray.push(item.admin);
      });


      if (adminArray.length) {
        let finalArray = [...new Map(adminArray.map((admin) => [admin.id, admin])).values()];
        // Return Formation
        return {
          message: "GET Order Update Admin List Success!!!",
          status: true,
          tenant_id: TENANTID,
          data: finalArray
        };

      } else {
        return {
          message: `Something Went Wrong!!!`,
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
