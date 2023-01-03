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
            // GET Verified Customer Count
            const verifiedCustomer = await db.user.count({
                where: {
                    [Op.and]: [{
                        has_role: 0,
                        email_verified: true,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Total Quotes
            const totalQuotes = await db.submitted_quote.count({
                where: {
                    tenant_id: TENANTID
                }
            });
            const allQuotes = await db.submitted_quote.findAll({
                where: {
                    tenant_id: TENANTID
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
            let shippingInProgress = [];
            if (orders && orders.length > 0) {
                await orders.forEach(async (item) => {

                    if (item.orderStatus?.slug === "delivered") {
                        overAllOrderDeliveredIDS.push(item.id)
                        let updatedAt = new Date(item.updatedAt).toLocaleDateString();
                        let serverTime = new Date().toLocaleDateString();
                        if (updatedAt === serverTime) {
                            await deliveredOrderIDS.push(item.id)
                        }

                    }

                    if (item.orderStatus?.slug === "pending") {
                        let updatedAt = new Date(item.updatedAt).toLocaleDateString();
                        let serverTime = new Date().toLocaleDateString();
                        if (updatedAt === serverTime) {
                            await todayPendingOrderIDS.push(item.id)
                        }
                    }

                    if (item.orderStatus?.slug === "in-progress") {
                        await shippingInProgress.push(item.id)
                    }
                });
            }

            // New Quotes
            let newQuotes = [];
            if (allQuotes && allQuotes.length > 0) {
                allQuotes.forEach(async (item) => {
                    let createdAt = new Date(item.createdAt).toLocaleDateString();
                    let serverTime = new Date().toLocaleDateString();
                    if (createdAt === serverTime) {
                        await newQuotes.push(item.id);
                    }
                });
            }


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

            // GET RECENT POs
            const purchaseOrders = await db.purchase_order.findAll({
                where: {
                    tenant_id: TENANTID
                }
            });

            // Recent Purchase Orders
            let recentPurchaseOrderIDS = [];
            if (purchaseOrders && purchaseOrders.length > 0) {
                purchaseOrders.forEach(async (item) => {
                    let createdAt = new Date(item.createdAt).toLocaleDateString();
                    let serverTime = new Date().toLocaleDateString();
                    if (createdAt === serverTime) {
                        await recentPurchaseOrderIDS.push(item.id)
                    }
                });
            }
            let recentPurchaseOrders = await db.purchase_order.findAll({
                where: {
                    [Op.and]: [{
                        id: recentPurchaseOrderIDS,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.submitted_quote.hasAlias('user') && !db.submitted_quote.hasAlias('quotedby')) {
                await db.submitted_quote.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'quotedby'
                });
            }

            // Recent Quotes
            let recentQuotes = await db.submitted_quote.findAll({
                include: [
                    {
                        model: db.user, as: 'quotedby', // Include User 
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id: newQuotes,
                        tenant_id: TENANTID
                    }]
                }
            })



            // Return Formation
            return {
                message: "Dashboard Analytics GET Success!!",
                tenant_id: TENANTID,
                status: true,
                totalCustomer: customerCount ?? 0,
                newCustomer: newCustomers.length,
                verifiedCustomer: verifiedCustomer ?? 0,
                orderCount: orderCount ?? 0,
                totalShippedOrder: overAllOrderDeliveredIDS.length,
                todayShippedOrder: deliveredOrderIDS.length,
                shippingInProgress: shippingInProgress.length,
                newOrderCount: todayPendingOrderIDS.length,
                totalQuotes: totalQuotes ?? 0,
                todayQuotes: newQuotes.length,
                recentOrders: recentOrders,
                recentPurchaseOrders: recentPurchaseOrders,
                recentQuotes: recentQuotes
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}