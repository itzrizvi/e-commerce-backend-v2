// All Requires
const { Op } = require("sequelize");


// PO HELPER
module.exports = {
    // PO Setting
    poSetting: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_prefix, po_startfrom } = req;

            // Check Existence
            const checkExists = await db.po_setting.findOne({
                where: {
                    [Op.and]: [{
                        po_prefix,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (checkExists) return { message: "Already Added This Prefix For Your PO!!!!", status: false }

            // Add PO SETTING DB
            const insertSetting = await db.po_setting.create({
                po_prefix,
                po_startfrom,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertSetting) {
                return {
                    message: "PO Setting Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Create PO
    createPurchaseOrder: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { vendor_id,
                vendor_billing_id,
                vendor_shipping_id,
                shipping_method_id,
                payment_method_id,
                tax_amount,
                order_placed_via,
                status,
                comment,
                order_id,
                products } = req;


            // GET Prefix and Start From Value
            const poSettings = await db.po_setting.findOne({
                where: {
                    tenant_id: TENANTID
                }
            });
            if (!poSettings) return { message: "No Settings Found!!!", status: false }
            const { po_prefix, po_startfrom } = poSettings;


            // Find Last Entry 
            const findPOEntries = await db.purchase_order.findAll({
                where: {
                    tenant_id: TENANTID
                },
                order: [
                    ["po_id", "ASC"]
                ]
            });

            // Get The Last Entry Number
            let poIDNumbers = [];
            let lastEntryNumber = 0;
            if (findPOEntries) {

                await findPOEntries.forEach(async (entry) => {
                    await poIDNumbers.push(parseInt(entry.po_id.split('-').slice(-1)[0]));
                });

                if (poIDNumbers && poIDNumbers.length > 0) {
                    lastEntryNumber = Math.max(...poIDNumbers);
                }
            }

            // GENERATE PO ID
            let po_id;
            if ((new Date().getDate() % 2) === 0) {

                if (lastEntryNumber != 0) { // Check if the last entry is available
                    po_id = `${po_prefix}-${lastEntryNumber + 2}`
                } else {
                    po_id = `${po_prefix}-${po_startfrom + 2}`
                }

            } else {

                if (lastEntryNumber != 0) { // Check if the last entry is available
                    po_id = `${po_prefix}-${lastEntryNumber + 3}`
                } else {
                    po_id = `${po_prefix}-${po_startfrom + 3}`
                }

            }


            let grandTotal_price = 0; // Grand Total Price
            // PO Product List Array
            const poProductList = [];
            products.forEach(async (element) => {

                const calculateTotal = element.price * element.quantity;
                grandTotal_price += calculateTotal;

                // PO Product List Array Formation
                await poProductList.push({
                    product_id: element.id,
                    quantity: element.quantity,
                    price: element.price,
                    totalPrice: calculateTotal,
                    recieved_quantity: element.recieved_quantity ? element.recieved_quantity : 0,
                    remaining_quantity: element.recieved_quantity ? element.quantity - element.recieved_quantity : element.quantity,
                    created_by: user.id,
                    tenant_id: TENANTID
                })

            });

            // Create Purchase Order 
            const insertPO = await db.purchase_order.create({
                po_id,
                vendor_id,
                payment_method_id,
                grandTotal_price: grandTotal_price.toFixed(2),
                tax_amount,
                vendor_billing_id,
                vendor_shipping_id,
                shipping_method_id,
                order_placed_via,
                status,
                comment,
                created_by: user.id,
                tenant_id: TENANTID,
                order_id,
                type: order_id ? "drop_shipping" : "default"
            });
            if (!insertPO) return { message: "Purchase Order Creation Failed!!!", status: false }


            // Inseting Purchase Order ID to PO Product List Array
            poProductList.forEach((item) => {
                item.purchase_order_id = insertPO.id;
            });

            // Insert Product List
            const insertProductList = await db.po_productlist.bulkCreate(poProductList);
            if (!insertProductList) return { message: "PO Product List Failed!!!", status: false }


            // Return Formation
            return {
                message: "Purchase Order Created Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET PO LIST
    getPurchaseOrderList: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // ASSOCIATION STARTS
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
            if (!db.purchase_order.hasAlias('user') && !db.purchase_order.hasAlias('POCreated_by')) {
                await db.purchase_order.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'POCreated_by'
                });
            }
            // ASSOCIATION ENDS

            // PO List
            const poList = await db.purchase_order.findAll({
                include: [
                    { model: db.vendor, as: 'vendor' },
                    { model: db.payment_method, as: 'paymentmethod' },
                    {
                        model: db.user, as: 'POCreated_by', // Include User who created the product and his roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    },
                ],
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return Formation
            return {
                message: "GET Purchase Order List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE PO 
    getSinglePurchaseOrder: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { id } = req;
            // ASSOCIATION STARTS
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
            if (!db.purchase_order.hasAlias('user') && !db.purchase_order.hasAlias('POCreated_by')) {
                await db.purchase_order.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'POCreated_by'
                });
            }


            // 
            if (!db.purchase_order.hasAlias('address') && !db.purchase_order.hasAlias('vendorBillingAddress')) {

                await db.purchase_order.hasOne(db.address, {
                    sourceKey: 'vendor_billing_id',
                    foreignKey: 'id',
                    as: 'vendorBillingAddress'
                });
            }

            // 
            if (!db.purchase_order.hasAlias('address') && !db.purchase_order.hasAlias('vendorShippingAddress')) {

                await db.purchase_order.hasOne(db.address, {
                    sourceKey: 'vendor_shipping_id',
                    foreignKey: 'id',
                    as: 'vendorShippingAddress'
                });
            }

            // 
            if (!db.purchase_order.hasAlias('po_productlist') && !db.purchase_order.hasAlias('poProductlist')) {

                await db.purchase_order.hasMany(db.po_productlist, {
                    foreignKey: 'purchase_order_id',
                    as: 'poProductlist'
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

            // Check If Has Alias with Categories
            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

            // Brand Table Association with Product
            if (!db.product.hasAlias('brand')) {

                await db.product.hasOne(db.brand, {
                    sourceKey: 'brand_id',
                    foreignKey: 'id',
                    as: 'brand'
                });
            }
            // ASSOCIATION ENDS

            // Single PO 
            const singlePO = await db.purchase_order.findOne({
                include: [
                    { model: db.vendor, as: 'vendor' },
                    { model: db.payment_method, as: 'paymentmethod' },
                    { model: db.address, as: 'vendorBillingAddress' },
                    { model: db.address, as: 'vendorShippingAddress' },
                    {
                        model: db.user, as: 'POCreated_by', // Include User who created the product and his roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    },
                    {
                        model: db.po_productlist, as: 'poProductlist', // 
                        include: {
                            model: db.product,
                            as: 'product',
                            include: [
                                { model: db.category, as: 'category' },
                                { model: db.brand, as: 'brand' }
                            ]
                        }
                    },
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
                message: "GET Single Purchase Order Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singlePO
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update PO
    updatePurchaseOrder: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id,
                po_id,
                vendor_id,
                shipping_method_id,
                payment_method_id,
                order_placed_via,
                status,
                vendor_billing_id,
                vendor_shipping_id,
                tax_amount,
                comment,
                products } = req;


            // Find PO
            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { grandTotal_price: previousGrandTotal } = findPO;

            let grandTotal_price = 0; // Grand Total Price
            // PO Product List Array
            const poProductList = [];
            const newPoProductList = [];
            if (products) {

                // In Case of Existing Products Update
                products.forEach(async (element) => {
                    const calculateTotal = element.price * element.quantity;
                    grandTotal_price += calculateTotal;

                    if (!element.isNew) {
                        // PO Product List Array Formation
                        await poProductList.push({
                            product_id: element.id,
                            quantity: element.quantity,
                            price: element.price,
                            totalPrice: calculateTotal,
                            recieved_quantity: element.recieved_quantity ? element.recieved_quantity : 0,
                            remaining_quantity: element.recieved_quantity ? element.quantity - element.recieved_quantity : element.quantity,
                            updated_by: user.id,
                            tenant_id: TENANTID
                        })
                    }
                });

                // In Case New Product Insert in PO
                products.forEach(async (newElement) => {
                    if (newElement.isNew) {
                        const calculateTotal = newElement.price * newElement.quantity;
                        // New PO Product List Array Formation
                        await newPoProductList.push({
                            purchase_order_id: id,
                            product_id: newElement.id,
                            quantity: newElement.quantity,
                            price: newElement.price,
                            totalPrice: calculateTotal,
                            recieved_quantity: newElement.recieved_quantity ? newElement.recieved_quantity : 0,
                            remaining_quantity: newElement.recieved_quantity ? newElement.quantity - newElement.recieved_quantity : newElement.quantity,
                            created_by: user.id,
                            tenant_id: TENANTID
                        })
                    }
                });
            }


            // Update Doc For Purchase Order
            const poUpdateDoc = {
                shipping_method_id,
                payment_method_id,
                order_placed_via,
                status,
                vendor_billing_id,
                vendor_shipping_id,
                tax_amount,
                comment,
                vendor_id,
                grandTotal_price: grandTotal_price === 0 ? previousGrandTotal : grandTotal_price.toFixed(2),
                updated_by: user.id
            }

            // Update Purchase Order
            const updatePurchaseOrder = await db.purchase_order.update(poUpdateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updatePurchaseOrder) return { message: "PO Update Failed!!!", status: false }

            // If Products is Available For Update
            if (poProductList && poProductList.length > 0) {
                // Update Product List With Loop
                await poProductList.forEach(async (product) => {

                    await db.po_productlist.update(product, {
                        where: {
                            [Op.and]: [{
                                purchase_order_id: id,
                                product_id: product.product_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                });
            }

            // If NEW Products is Available For Update
            if (newPoProductList && newPoProductList.length > 0) {
                // Insert NEW Product List
                const insertNewProductList = await db.po_productlist.bulkCreate(newPoProductList);
                if (!insertNewProductList) return { message: "New Product List Insert Failed!!!", status: false }
            }


            // Return Formation
            return {
                message: "Purchase Order Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update PO STATUS
    updatePOStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, status } = req;

            // Update Purchase Order Status
            const updatePOStatus = await db.purchase_order.update({
                status
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updatePOStatus) return { message: "PO Satus Change Failed!!!", status: false }


            // Return Formation
            return {
                message: "Purchase Order Status Changed Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}