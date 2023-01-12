// All Requires
const { Op } = require("sequelize");
const { crypt, decrypt } = require("../utils/hashes");
const config = require('config');
const { Mail } = require("../utils/email");

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
            const { contact_person_id,
                vendor_id,
                vendor_billing_id,
                vendor_shipping_id,
                shipping_method_id,
                shipping_account_id,
                payment_method_id,
                tax_amount,
                comment,
                order_id,
                type,
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
                    ["po_number", "ASC"]
                ]
            });

            // Get The Last Entry Number
            let poIDNumbers = [];
            let lastEntryNumber = 0;
            if (findPOEntries) {

                await findPOEntries.forEach(async (entry) => {
                    await poIDNumbers.push(parseInt(entry.po_number.split('-').slice(-1)[0]));
                });

                if (poIDNumbers && poIDNumbers.length > 0) {
                    lastEntryNumber = Math.max(...poIDNumbers);
                }
            }

            // GENERATE PO ID
            let po_number;
            if ((new Date().getDate() % 2) === 0) {

                if (lastEntryNumber != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${lastEntryNumber + 2}`
                } else {
                    po_number = `${po_prefix}-${po_startfrom + 2}`
                }

            } else {

                if (lastEntryNumber != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${lastEntryNumber + 3}`
                } else {
                    po_number = `${po_prefix}-${po_startfrom + 3}`
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
                    created_by: user.id,
                    tenant_id: TENANTID
                });

            });
            // Create Purchase Order 
            const insertPO = await db.purchase_order.create({
                po_number,
                vendor_id,
                payment_method_id,
                grandTotal_price: grandTotal_price.toFixed(2),
                tax_amount,
                contact_person_id,
                vendor_billing_id,
                vendor_shipping_id,
                shipping_method_id,
                shipping_account_id,
                comment,
                created_by: user.id,
                tenant_id: TENANTID,
                order_id,
                type: type
            });
            if (!insertPO) return { message: "Purchase Order Creation Failed!!!", status: false }

            // Inseting Purchase Order ID to PO Product List Array
            poProductList.forEach((item) => {
                item.purchase_order_id = insertPO.id;
            });

            // Insert Product List
            const insertProductList = await db.po_productlist.bulkCreate(poProductList);
            if (!insertProductList) return { message: "PO Product List Failed!!!", status: false }

            //
            let email;
            if (contact_person_id) {
                const findContactPerson = await db.contact_person.findOne({
                    where: {
                        [Op.and]: [{
                            id: contact_person_id, /////
                            tenant_id: TENANTID
                        }]
                    }
                });
                email = findContactPerson.email;
            } else {
                const findVendor = await db.vendor.findOne({
                    where: {
                        [Op.and]: [{
                            id: vendor_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                email = findVendor.email;
            }

            let purchaseOrderIDhashed = crypt(`${insertPO.id}`);
            let ponumberhashed = crypt(`${po_number}`);
            // SET PASSWORD URL
            const viewpoURL = config.get("ECOM_URL").concat(config.get("PO_VIEW"));
            // Setting Up Data for EMAIL SENDER
            const mailSubject = "Purchase Order From Prime Server Parts"
            const mailData = {
                companyInfo: {
                    logo: config.get("SERVER_URL").concat("media/email-assets/logo.jpg"),
                    banner: config.get("SERVER_URL").concat("media/email-assets/banner.jpeg"),
                    companyName: config.get("COMPANY_NAME"),
                    companyUrl: config.get("ECOM_URL"),
                    shopUrl: config.get("ECOM_URL"),
                    fb: config.get("SERVER_URL").concat("media/email-assets/fb.png"),
                    tw: config.get("SERVER_URL").concat("media/email-assets/tw.png"),
                    li: config.get("SERVER_URL").concat("media/email-assets/in.png"),
                    insta: config.get("SERVER_URL").concat("media/email-assets/inst.png")
                },
                about: 'A Purchase Order Has Been Created On Primer Server Parts',
                email: email,
                viewpolink: `${viewpoURL}${purchaseOrderIDhashed}/${ponumberhashed}`
            }

            // SENDING EMAIL
            await Mail(email, mailSubject, mailData, 'create-purchase-order', TENANTID);

            // Record Create
            await db.poview_record.create({
                po_id: insertPO.id,
                po_number,
                created_by: user.id,
                tenant_id: TENANTID
            });


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
                po_number,
                contact_person_id,
                reason,
                vendor_id,
                shipping_method_id,
                shipping_account_id,
                payment_method_id,
                order_placed_via,
                status,
                vendor_billing_id,
                vendor_shipping_id,
                tax_amount,
                order_id,
                type,
                comment,
                products } = req;


            // Find PO
            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        po_number,
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
                contact_person_id,
                reason,
                shipping_account_id,
                payment_method_id,
                order_placed_via,
                status,
                vendor_billing_id,
                vendor_shipping_id,
                tax_amount,
                comment,
                order_id,
                type,
                vendor_id,
                grandTotal_price: grandTotal_price === 0 ? previousGrandTotal : grandTotal_price.toFixed(2),
                updated_by: user.id
            }

            // Update Purchase Order
            const updatePurchaseOrder = await db.purchase_order.update(poUpdateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        po_number,
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
    // Create Receiving
    createReceiving: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { purchaseOrder_id, status } = req;

            // Check Exist 
            const checkExist = await db.receiving_product.findOne({
                where: {
                    [Op.and]: [{
                        po_id: purchaseOrder_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!checkExist || checkExist.status === "canceled") {
                // Insert to Receiving Product
                const insertReceiving = await db.receiving_product.create({
                    po_id: purchaseOrder_id,
                    status,
                    created_by: user.id,
                    tenant_id: TENANTID
                });
                if (!insertReceiving) return { message: "Receiving Data Insert Failed!!!", status: false }


                // 
                if (!db.purchase_order.hasAlias('po_productlist') && !db.purchase_order.hasAlias('poproducts')) {
                    await db.purchase_order.hasMany(db.po_productlist, {
                        foreignKey: 'purchase_order_id',
                        as: 'poproducts'
                    });
                }
                // GET PO
                const getPO = await db.purchase_order.findOne({
                    include: [{ model: db.po_productlist, as: "poproducts" }],
                    where: {
                        [Op.and]: [{
                            id: purchaseOrder_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // RECEIVING ITEMS
                let receivingItems = [];
                await getPO.poproducts.forEach(async (item) => {
                    await receivingItems.push({
                        receiving_id: insertReceiving.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        received_quantity: 0,
                        remaining_quantity: item.quantity,
                        created_by: user.id,
                        tenant_id: TENANTID
                    });
                });

                // RECEIVING ITEM BULK CREATE
                const createreceivingitems = await db.receiving_item.bulkCreate(receivingItems);
                if (!createreceivingitems) return { message: "Receiving Items Insert Failed!!!", status: false }

                // Update Purchase Order
                await db.purchase_order.update({
                    rec_id: insertReceiving.id
                }, {
                    where: {
                        [Op.and]: [{
                            id: purchaseOrder_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Return Formation
                return {
                    message: "Receiving Inserted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID,
                    id: insertReceiving.id
                }

            } else {
                // Return Formation
                return {
                    message: "Already Have This Receiving Record!!!",
                    status: false,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // VIEW PUBLIC PO 
    viewPurchaseOrderPublic: async (req, db, TENANTID, ip, headers) => {
        // Try Catch Block
        try {

            // Data From Request
            const { param1, param2 } = req;
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
            if (!db.purchase_order.hasAlias('shipping_method') && !db.purchase_order.hasAlias('shippingMethod')) {

                await db.purchase_order.hasOne(db.shipping_method, {
                    sourceKey: 'shipping_method_id',
                    foreignKey: 'id',
                    as: 'shippingMethod'
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

            // DECODE
            const id = decrypt(param1);
            const po_number = decrypt(param2)

            // Single PO 
            const singlePO = await db.purchase_order.findOne({
                include: [
                    { model: db.vendor, as: 'vendor' },
                    { model: db.payment_method, as: 'paymentmethod' },
                    { model: db.shipping_method, as: 'shippingMethod' },
                    { model: db.address, as: 'vendorBillingAddress' },
                    { model: db.address, as: 'vendorShippingAddress' },
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
                        po_number,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (singlePO) {
                await db.poview_record.update({
                    status: 'viewed',
                    client_info: JSON.stringify(headers),
                    last_viewed_at: Date.now(),
                    client_ip: ip
                }, {
                    where: {
                        [Op.and]: [{
                            po_id: id,
                            po_number,
                            tenant_id: TENANTID
                        }]
                    }
                })
            }

            // Return Formation
            return {
                message: "GET Purchase Order Public View Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singlePO
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}