// All Requires
const { Op } = require("sequelize");


// Dashboard HELPER
module.exports = {
    // GET DASHBOARD ANALYTICS
    getDashboardAnalytics: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // GET Order Count
            const orderCount = await db.order.count({
                where: {
                    tenant_id: TENANTID
                }
            });

            // GET Customer Count
            const customerCount = await db.user.count({
                where: {
                    [Op.and]: [{
                        has_role: 0,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Check If Has Alias with Order and Order Status
            if (!db.order.hasAlias("order_status") && !db.order.hasAlias("orderStatus")) {
                await db.order.hasOne(db.order_status, {
                    sourceKey: "order_status_id",
                    foreignKey: "id",
                    as: "orderStatus",
                });
            }

            // Order and Order Items
            if (!db.order.hasAlias("order_item") && !db.order.hasAlias("orderitems")) {
                await db.order.hasMany(db.order_item, {
                    foreignKey: "order_id",
                    as: "orderitems",
                });
            }
            // Check If Has Alias with Users and Order
            if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
                await db.order.hasOne(db.user, {
                    sourceKey: "customer_id",
                    foreignKey: "id",
                    as: "customer",
                });
            }

            // Check If Has Alias with Order and Payment Method
            if (!db.order.hasAlias("payment_method") && !db.order.hasAlias("paymentmethod")) {
                await db.order.hasOne(db.payment_method, {
                    sourceKey: "payment_id",
                    foreignKey: "id",
                    as: "paymentmethod",
                });
            }

            // GET Today Product Sold and Pending
            const orders = await db.order.findAll({
                include: [
                    { model: db.order_status, as: "orderStatus" },
                    { model: db.order_item, as: "orderitems" },
                ],
                where: {
                    tenant_id: TENANTID
                }
            });

            // Today Delivered Order and Products Count
            let deliveredOrderIDS = [];
            let overAllOrderDeliveredIDS = [];
            let todayPendingOrderIDS = [];
            await orders.forEach(async (item) => {

                if (item.orderStatus.slug === "delivered") {
                    overAllOrderDeliveredIDS.push(item.id)
                    let updatedAt = new Date(item.updatedAt).toLocaleDateString();
                    let serverTime = new Date().toLocaleDateString();
                    if (updatedAt === serverTime) {
                        await deliveredOrderIDS.push(item.id)
                    }

                }

                if (item.orderStatus.slug === "pending") {
                    let updatedAt = new Date(item.updatedAt).toLocaleDateString();
                    let serverTime = new Date().toLocaleDateString();
                    if (updatedAt === serverTime) {
                        await todayPendingOrderIDS.push(item.id)
                    }
                }
            });

            // Today Product SOld Count
            const productSoldToday = await db.order_item.sum("quantity", {
                where: {
                    [Op.and]: [{
                        order_id: deliveredOrderIDS,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Today Revenue
            const todayRevenue = await db.order.sum("total", {
                where: {
                    [Op.and]: [{
                        id: deliveredOrderIDS,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Today Pending Product Count
            const pendingProductCountToday = await db.order_item.sum("quantity", {
                where: {
                    [Op.and]: [{
                        order_id: todayPendingOrderIDS,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Total Revenue Count
            const totalRevenueCount = await db.order.sum("total", {
                where: {
                    [Op.and]: [{
                        id: overAllOrderDeliveredIDS,
                        tenant_id: TENANTID
                    }]
                }
            });

            // New Customers
            const allCustomers = await db.user.findAll({
                where: {
                    [Op.and]: [{
                        has_role: 0,
                        tenant_id: TENANTID
                    }]
                }
            });
            let newCustomers = [];
            await allCustomers.forEach(async (item) => {
                let updatedAt = new Date(item.createdAt).toLocaleDateString();
                let serverTime = new Date().toLocaleDateString();
                if (updatedAt === serverTime) {
                    await newCustomers.push(item.id)
                }
            });

            // Recent Orders 
            const recentOrders = await db.order.findAll({
                include: [
                    { model: db.user, as: "customer" },
                    { model: db.payment_method, as: "paymentmethod" },
                    { model: db.order_status, as: "orderStatus" }
                ],
                where: {
                    [Op.and]: [{
                        id: todayPendingOrderIDS,
                        tenant_id: TENANTID
                    }]
                }
            });



            // Return Formation
            return {
                message: "Dashboard Analytics GET Success!!",
                tenant_id: TENANTID,
                status: true,
                orderCount: orderCount ?? 0,
                todayProductSoldCount: productSoldToday ?? 0,
                todayProductPendingCount: pendingProductCountToday ?? 0,
                todayOrderPendingCount: todayPendingOrderIDS.length,
                todayDeliveredOrderCount: deliveredOrderIDS.length,
                customerCount: customerCount ?? 0,
                revenueCount: totalRevenueCount ?? 0,
                todayRevenue: todayRevenue ?? 0,
                newCustomer: newCustomers.length,
                recentOrders: recentOrders,
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}