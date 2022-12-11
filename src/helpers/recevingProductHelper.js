// All Requires
const { Op } = require("sequelize");



// PO HELPER
module.exports = {
    // GET SINGLE RECEVING PRODUCT
    getSingleReceivingProduct: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;
            // ASSOCIATION STARTS

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.receiving_product.hasAlias('user') && !db.receiving_product.hasAlias('added_by')) {
                await db.receiving_product.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // 
            if (!db.receiving_product.hasAlias('receiving_item') && !db.receiving_product.hasAlias('receivingitems')) {
                await db.receiving_product.hasMany(db.receiving_item, {
                    foreignKey: 'receiving_id',
                    as: 'receivingitems'
                });
            }

            // 
            if (!db.receiving_item.hasAlias('product')) {

                await db.receiving_item.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // 
            if (!db.receiving_item.hasAlias('received_product') && !db.receiving_item.hasAlias('receivinghistory')) {

                await db.receiving_item.hasMany(db.received_product, {
                    foreignKey: 'receiving_item_id',
                    as: 'receivinghistory'
                });
            }

            // 
            if (!db.received_product.hasAlias('user') && !db.received_product.hasAlias('received_by')) {

                await db.received_product.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'received_by'
                });
            }

            // 
            if (!db.receiving_item.hasAlias('product_serial') && !db.receiving_item.hasAlias('serials')) {

                await db.receiving_item.hasMany(db.product_serial, {
                    sourceKey: 'product_id',
                    foreignKey: 'prod_id',
                    as: 'serials'
                });
            }

            //
            if (!db.receiving_product.hasAlias('purchase_order') && !db.receiving_product.hasAlias('purchaseOrder')) {

                await db.receiving_product.hasOne(db.purchase_order, {
                    sourceKey: 'po_id',
                    foreignKey: 'id',
                    as: 'purchaseOrder'
                });
            }

            // ASSOCIATION ENDS

            // Single RP
            const singleRP = await db.receiving_product.findOne({
                include: [
                    {
                        model: db.receiving_item, as: 'receivingitems', // 
                        include: [
                            { model: db.product, as: 'product' },
                            {
                                model: db.received_product, as: 'receivinghistory',
                                include: {
                                    model: db.user, as: "received_by",
                                    include: {
                                        model: db.role,
                                        as: 'roles'
                                    }
                                }
                            },
                            {
                                model: db.product_serial, as: 'serials',
                                required: false,
                                where: {
                                    rec_prod_id: id,
                                }
                            },
                        ]
                    },
                    { model: db.purchase_order, as: "purchaseOrder" },
                    {
                        model: db.user, as: "added_by",
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET Single Receving Product Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singleRP
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET RECEVING PRODUCT LIST
    getReceivingProductList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // ASSOCIATION STARTS
            // RP TO PO
            if (!db.receiving_product.hasAlias('purchase_order') && !db.receiving_product.hasAlias('purchaseOrder')) {

                await db.receiving_product.hasOne(db.purchase_order, {
                    sourceKey: 'po_id',
                    foreignKey: 'id',
                    as: 'purchaseOrder'
                });
            }

            // PO TO vendor
            if (!db.purchase_order.hasAlias('vendor')) {

                await db.purchase_order.hasOne(db.vendor, {
                    sourceKey: 'vendor_id',
                    foreignKey: 'id',
                    as: 'vendor'
                });
            }

            // PO TO payment_method
            if (!db.purchase_order.hasAlias('payment_method') && !db.purchase_order.hasAlias('paymentmethod')) {

                await db.purchase_order.hasOne(db.payment_method, {
                    sourceKey: 'payment_method_id',
                    foreignKey: 'id',
                    as: 'paymentmethod'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.receiving_product.hasAlias('user') && !db.receiving_product.hasAlias('added_by')) {
                await db.receiving_product.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // ASSOCIATION ENDS

            // Receving Product List
            const recevingProductList = await db.receiving_product.findAll({
                include: [
                    {
                        model: db.purchase_order, as: "purchaseOrder",
                        include: [
                            { model: db.vendor, as: 'vendor' },
                            { model: db.payment_method, as: 'paymentmethod' }
                        ]
                    },
                    {
                        model: db.user, as: "added_by",
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return Formation
            return {
                message: "GET Receving Product List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: recevingProductList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Receiving Product List
    updateReceiving: async (req, db, user, isAuth, TENANTID) => {
        const updateReceivingTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {

            // Data From Request
            const { id, status, receivedProducts } = req;

            // Check
            if (receivedProducts && receivedProducts.length > 0) {


                // For Remaining Check
                for (const productData of receivedProducts) {
                    // Check Remaining
                    const totalReceived = await db.received_product.sum('received_quantity', {
                        where: {
                            [Op.and]: [{
                                receiving_id: id,
                                receiving_item_id: productData.receiving_item_id,
                                product_id: productData.prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Find Receiving
                    const findreceiving = await db.receiving_item.findOne({
                        where: {
                            [Op.and]: [{
                                receiving_id: id,
                                product_id: productData.prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    const remaining = parseInt(findreceiving.quantity) - parseInt(totalReceived);

                    if (remaining < productData.receiving_quantity) {
                        return {
                            message: `${productData.prod_id} This Product Have Only Remaining ${remaining}!!!`,
                            status: false
                        }
                    }
                }

                // For Serial Insert and Calculation
                for (const productData of receivedProducts) {
                    if (productData.quantity >= productData.receiving_quantity) {

                        if (productData.serials) {
                            if (productData.receiving_quantity === productData.serials.length) {

                                let serials = productData.serials;

                                for (const serial of serials) {

                                    //
                                    const checkExists = await db.product_serial.findOne({
                                        where: {
                                            [Op.and]: [{
                                                rec_prod_id: id,
                                                serial: serial,
                                                prod_id: productData.prod_id,
                                                tenant_id: TENANTID
                                            }]
                                        }
                                    });
                                    if (checkExists) return { message: `${productData.prod_id} Product ${serial} Serial Already Exist!!!`, status: false }

                                    //
                                    const insertSerial = await db.product_serial.create({
                                        prod_id: productData.prod_id,
                                        serial: serial,
                                        rec_prod_id: id,
                                        created_by: user.id,
                                        tenant_id: TENANTID
                                    }, { transaction: updateReceivingTransaction });
                                    if (!insertSerial) return { message: `Serial Insert Failed!!!`, status: false }

                                }

                            } else {
                                return {
                                    message: "Invalid Input!!!",
                                    status: false,
                                    tenant_id: TENANTID
                                }
                            }

                        }


                    } else {
                        return {
                            message: "Given Quantity is Bigger Than Main Quantity!!!",
                            status: false,
                            tenant_id: TENANTID
                        }
                    }

                }

                // For Receiving Insert and Update 
                for (const productData of receivedProducts) {

                    // Insert Receiving
                    const receiving = {
                        receiving_id: id,
                        receiving_item_id: productData.receiving_item_id,
                        product_id: productData.prod_id,
                        received_quantity: productData.receiving_quantity,
                        created_by: user.id,
                        tenant_id: TENANTID
                    }
                    const insertreceiving = await db.received_product.create(receiving);
                    if (!insertreceiving) return { message: `${productData.prod_id} This Product Receiving Insert Failed!!!`, status: false }

                    // Check Remaining
                    const totalReceived = await db.received_product.sum('received_quantity', {
                        where: {
                            [Op.and]: [{
                                receiving_id: id,
                                receiving_item_id: productData.receiving_item_id,
                                product_id: productData.prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    // Find Receiving
                    const findreceiving = await db.receiving_item.findOne({
                        where: {
                            [Op.and]: [{
                                receiving_id: id,
                                product_id: productData.prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    //
                    await db.receiving_item.update({
                        received_quantity: parseInt(totalReceived),
                        remaining_quantity: parseInt(findreceiving.quantity) - parseInt(totalReceived),
                        updated_by: user.id
                    }, {
                        where: {
                            [Op.and]: [{
                                receiving_id: id,
                                product_id: productData.prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    })

                }

            }

            //
            const updateStatus = await db.receiving_product.update({
                status: status
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                },
                transaction: updateReceivingTransaction
            });
            if (!updateStatus) return { message: "Status Couldn't Updated!!!", status: false, tenant_id: TENANTID }


            await updateReceivingTransaction.commit();

            // Return Formation
            return {
                message: "Receiving Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            await updateReceivingTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Receiving Activity History List Admin
    getReceivingHistory: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { receiving_id } = req;

            // User and Roles Through Admin Roles Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Receiving and User
            if (!db.receiving_history.hasAlias('user') && !db.receiving_history.hasAlias('activity_by')) {

                await db.receiving_history.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'activity_by'
                });
            }

            // 
            const receivinghistoryList = await db.receiving_history.findAll({
                include: [
                    {
                        model: db.user, as: 'activity_by', // User and Roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        receiving_id,
                        tenant_id: TENANTID
                    }]
                },
                order: [
                    ["createdAt", "DESC"]
                ]
            });

            //
            const modReceivinghistoryList = receivinghistoryList.map(item => {
                var { data } = item;
                item.data = JSON.parse(data)

                item.data.products = item.data.products.map(async (element) => {

                    const product = await db.product.findOne({
                        where: {
                            [Op.and]: [{
                                id: element.product_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    return {
                        product_id: element.product_id,
                        quantity: element.quantity,
                        recieved_quantity: element.recieved_quantity,
                        serials: element.serials,
                        product,
                    }
                });
                return item
            });

            // Return Formation
            return {
                message: "GET Receiving History List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: modReceivinghistoryList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}