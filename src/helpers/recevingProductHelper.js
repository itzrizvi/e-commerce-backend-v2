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
            if (!db.receiving_product.hasAlias('po_productlist') && !db.purchase_order.hasAlias('poProducts')) {

                await db.receiving_product.hasMany(db.po_productlist, {
                    foreignKey: 'rec_prod_id',
                    as: 'poProducts'
                });
            }

            // 
            if (!db.po_productlist.hasAlias('product')) {

                await db.po_productlist.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // ASSOCIATION ENDS

            // Single RP
            const singleRP = await db.receiving_product.findOne({
                include: [
                    {
                        model: db.po_productlist, as: 'poProducts', // 
                        include: {
                            model: db.product,
                            as: 'product'
                        }
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

                for (const productData of receivedProducts) {

                    if (productData.quantity > productData.received_quantity) {

                        if (productData.is_serial) {

                            if (productData.received_quantity === productData.serials.length) {

                                let serials = productData.serials;

                                // Delete Others
                                await db.product_serial.destroy({
                                    where: {
                                        [Op.and]: [{
                                            serial: {
                                                [Op.notIn]: productData.serials
                                            },
                                            rec_prod_id: id,
                                            prod_id: productData.prod_id
                                        }]
                                    },
                                    transaction: updateReceivingTransaction
                                });

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
                                    if (!checkExists) {
                                        //
                                        const insertSerial = await db.product_serial.create({
                                            prod_id: productData.prod_id,
                                            serial: serial,
                                            rec_prod_id: id,
                                            created_by: user.id,
                                            tenant_id: TENANTID
                                        }, { transaction: updateReceivingTransaction });

                                        if (!insertSerial) return { message: "Product Serial Insert Failed!!!", status: false, tenant_id: TENANTID }

                                    }
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


                for (const productData of receivedProducts) {
                    // Update Received and Remaining
                    const updateDoc = {
                        recieved_quantity: productData.received_quantity,
                        remaining_quantity: productData.quantity - productData.received_quantity,
                        updated_by: user.id
                    }
                    //
                    const updateReceivingCounting = await db.po_productlist.update(updateDoc, {
                        where: {
                            [Op.and]: [{
                                product_id: productData.prod_id,
                                rec_prod_id: id,
                                tenant_id: TENANTID
                            }]
                        },
                        transaction: updateReceivingTransaction
                    });
                    if (!updateReceivingCounting) return { message: `${productData.prod_id} This Product Receiving Couldn't Updated!!!`, status: false, tenant_id: TENANTID }

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
    }
}