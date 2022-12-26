// All Requires
const { Op } = require("sequelize");
const config = require("config");

// Report HELPER
module.exports = {
    // GET Order List REPORT 
    getOrderListReport: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
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

            // // Order and Payment
            // if (!db.order.hasAlias("payment")) {
            //     await db.order.hasOne(db.payment, {
            //         foreignKey: "order_id",
            //         as: "payment",
            //     });
            // }
            // //  Payment and Address For Billing Address
            // if (
            //     !db.payment.hasAlias("address") &&
            //     !db.payment.hasAlias("billingAddress")
            // ) {
            //     await db.payment.hasOne(db.address, {
            //         sourceKey: "billing_address_id",
            //         foreignKey: "id",
            //         as: "billingAddress",
            //     });
            // }

            // // Order and Address For Shipping Address
            // if (
            //     !db.order.hasAlias("address") &&
            //     !db.order.hasAlias("shippingAddress")
            // ) {
            //     await db.order.hasOne(db.address, {
            //         sourceKey: "shipping_address_id",
            //         foreignKey: "id",
            //         as: "shippingAddress",
            //     });
            // }

            // // Order and Tax Exempt For File Names
            // if (
            //     !db.order.hasAlias("tax_exempt") &&
            //     !db.order.hasAlias("taxExemptFiles")
            // ) {
            //     await db.order.hasMany(db.tax_exempt, {
            //         foreignKey: "order_id",
            //         as: "taxExemptFiles",
            //     });
            // }

            // Order and Coupon
            if (!db.order.hasAlias("coupon")) {
                await db.order.hasOne(db.coupon, {
                    sourceKey: "coupon_id",
                    foreignKey: "id",
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

            // Order Report List For Admin
            const orderReportlist = await db.order.findAll({
                include: [
                    { model: db.user, as: "customer" },
                    { model: db.payment_method, as: "paymentmethod" },
                    { model: db.order_status, as: "orderstatus" },
                    {
                        model: db.order_item, // Order Items and Products
                        as: "orderitems",
                        include: {
                            model: db.product,
                            as: "product",
                        },
                    },
                    // {
                    //     model: db.payment, // Payment and Address
                    //     as: "payment",
                    //     include: {
                    //         model: db.address,
                    //         as: "billingAddress",
                    //     },
                    // },
                    // { model: db.address, as: "shippingAddress" }, // Address
                    // { model: db.tax_exempt, as: "taxExemptFiles" }, // Tax Exempt
                    { model: db.coupon, as: "coupon" }, // Coupon
                    { model: db.shipping_method, as: "shippingmethod" }, // Shipping Method

                ],
                where: {
                    tenant_id: TENANTID,
                },
            });


            if (orderReportlist && orderReportlist.length > 0) {
                //
                let orderListReportData = [];
                await orderReportlist.forEach(async (order) => {
                    let totalquantity = 0;
                    order.orderitems.forEach((orderitem) => {
                        totalquantity += orderitem.quantity;
                    });
                    await orderListReportData.push({
                        order_id: order.id,
                        customer_name: order.customer.first_name + ' ' + order.customer.last_name,
                        customer_email: order.customer.email,
                        total_amount: order.total,
                        sub_total: order.sub_total,
                        shipping_cost: order.shipping_cost,
                        discount_amount: order.discount_amount,
                        tax_amount: order.tax_amount,
                        tax_exempt: order.tax_exempt,
                        createdAt: new Date(order.createdAt).toGMTString(),
                        updatedAt: order.updatedAt,
                        paymentmethod: order.paymentmethod.name,
                        orderstatus: order.orderstatus.name,
                        shippingmethod: order.shippingmethod.name,
                        coupon_name: order?.coupon?.coupon_name ?? null,
                        coupon_code: order?.coupon?.coupon_code ?? null,
                        coupon_type: order?.coupon?.coupon_type ?? null,
                        coupon_amount: order?.coupon?.coupon_amount ?? null,
                        totalproducts: order.orderitems.length,
                        totalquantity: totalquantity
                    });
                });

                // Return Formation
                return {
                    message: "GET Order List Report Success",
                    status: true,
                    tenant_id: TENANTID,
                    data: orderListReportData,
                };

            } else {
                // Return Formation
                return {
                    message: "Something Went Wrong!!!",
                    status: false
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
    // GET Single Order Report
    getSingleOrderReport: async (req, db, user, isAuth, TENANTID) => {
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

            // Single Order For Admin
            const singleOrder = await db.order.findOne({
                include: [
                    {
                        model: db.user,
                        as: "customer",
                        include: { model: db.address, as: "addresses" }
                    }, // User as customer
                    { model: db.payment_method, as: "paymentmethod" }, // Payment method
                    { model: db.order_status, as: "orderstatus" }, // Order Status
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
                message: "GET Single Order Report Success",
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
};
