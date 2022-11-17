// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


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
            const findPOLastEntry = await db.po_lastentry.findOne({
                where: {
                    tenant_id: TENANTID
                }
            });

            // 
            let lastEntryNumber = 0;
            if (findPOLastEntry) {
                const { last_entry } = findPOLastEntry;
                lastEntryNumber = parseInt(last_entry.split('-').slice(-1)[0]);

            }

            // GENERATE PO ID
            let po_id;
            if ((new Date().getDate() % 2) === 0) {

                if (lastEntryNumber != 0) {
                    po_id = `${po_prefix}-${lastEntryNumber + 2}`
                } else {
                    po_id = `${po_prefix}-${po_startfrom + 2}`
                }

            } else {

                if (lastEntryNumber != 0) {
                    po_id = `${po_prefix}-${lastEntryNumber + 3}`
                } else {
                    po_id = `${po_prefix}-${po_startfrom + 3}`
                }

            }

            // Calculate Grand Total Price
            const productsIds = [];
            products.forEach((product) => {
                productsIds.push(product.id);
            });

            // Find Products
            const findProducts = await db.product.findAll({
                where: {
                    [Op.and]: [{
                        id: productsIds,
                        tenant_id: TENANTID
                    }]
                }
            });

            let grandTotal_price = 0; // Grand Total Price
            // PO Product List Array
            const poProductList = [];
            findProducts.forEach(async (item) => {

                products.forEach(async (element) => {

                    if (element.id === parseInt(item.id)) { // Matching Input IDs For Quantity

                        const calculateTotal = item.prod_regular_price * element.quantity;
                        grandTotal_price += calculateTotal;

                        // PO Product List Array Formation
                        await poProductList.push({
                            product_id: element.id,
                            price: item.prod_regular_price,
                            quantity: element.quantity,
                            price: item.prod_regular_price,
                            totalPrice: calculateTotal,
                            recieved_quantity: element.recieved_quantity ? element.recieved_quantity : 0,
                            remaining_quantity: element.recieved_quantity ? element.quantity - element.recieved_quantity : element.quantity,
                            created_by: user.id,
                            tenant_id: TENANTID
                        })
                    }
                });
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
                tenant_id: TENANTID
            });
            if (!insertPO) return { message: "Purchase Order Creation Failed!!!", status: false }

            // Update Or Create Last Entry on PO Last Entry Table
            // Destroy Last Entry
            await db.po_lastentry.destroy({
                where: {
                    tenant_id: TENANTID
                }
            });
            // Add Last Entry
            const lastEntry = await db.po_lastentry.create({
                last_entry: insertPO.po_id,
                created_by: user.id,
                tenant_id: TENANTID
            });
            if (!lastEntry) return { message: "Last Entry Insert Failed", status: false }


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
}