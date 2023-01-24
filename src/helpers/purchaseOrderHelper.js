// All Requires
const { Op } = require("sequelize");
const { crypt, decrypt } = require("../utils/hashes");
const config = require('config');
const { Mail } = require("../utils/email");
const logger = require("../../logger");
const { default: slugify } = require("slugify");
const { singleFileUpload, deleteFile, getFileName } = require("../utils/fileUpload");
const { po_activity_type } = require("../../enums/po_enum");

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
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "poSetting" });
        }
    },
    // PO Status Create
    createPOStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { name, status } = req;

            // Order Status Slug
            const slug = slugify(`${name}`, {
                replacement: "-",
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true,
            });

            // Check Existence
            const findStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID,
                    }],
                },
            });
            if (findStatus) return { message: "Already Have This PO Status!!!!", status: false };

            // Insert Status
            const insertPOStatus = await db.po_status.create({
                name,
                slug,
                status,
                tenant_id: TENANTID,
                created_by: user.id,
            });

            // Return Formation
            if (insertPOStatus) {
                return {
                    message: "PO Status Added Successfully!!!",
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
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "createPOStatus" });
        }
    },
    // Create PO
    createPurchaseOrder: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        const poTransaction = await db.sequelize.transaction();
        try {
            // DATA FROM REQUEST
            const { contact_person_id,
                vendor_id,
                vendor_billing_address_id,
                shipping_method_id,
                shipping_account_id,
                payment_method_id,
                tax_amount,
                shipping_cost,
                is_insurance,
                receiving_instruction,
                comment,
                order_id,
                type,
                products,
                // poTRKdetails,
                // poInvoice,
                // poMFGDoc 
            } = req;

            // GET Prefix and Start From Value
            const poSettings = await db.po_setting.findOne({
                where: {
                    tenant_id: TENANTID
                }
            });
            if (!poSettings) return { message: "No Settings Found!!!", status: false }
            const { po_prefix, po_startfrom } = poSettings;

            const findMaxPONumber = await db.purchase_order.max('po_number'); // Find Max Po Number

            // GENERATE PO ID
            let po_number;
            if ((new Date().getDate() % 2) === 0) {

                if (findMaxPONumber.split('-').slice(-1)[0] != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${parseInt(findMaxPONumber.split('-').slice(-1)[0]) + 2}`
                } else {
                    po_number = `${po_prefix}-${po_startfrom + 2}`
                }

            } else {

                if (findMaxPONumber.split('-').slice(-1)[0] != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${parseInt(findMaxPONumber.split('-').slice(-1)[0]) + 3}`
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

            let vendor_shipping_id;
            if (type === 'drop_shipping') {
                const customerShippingAddress = await db.order.findOne({
                    where: {
                        [Op.and]: [{
                            id: order_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                vendor_shipping_id = customerShippingAddress.shipping_address_id;

            } else {
                const getCompanyShippingAddress = await db.address.findOne({
                    where: {
                        [Op.and]: [{
                            isDefault: true,
                            type: "shipping",
                            ref_model: "company_info",
                            tenant_id: TENANTID
                        }]
                    }
                });

                vendor_shipping_id = getCompanyShippingAddress.id;
            }

            const findNewStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        slug: "new",
                        name: "New",
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!findNewStatus) return { message: "PO Status Not Found!!!", status: false }

            let status = findNewStatus.id;

            // Create Purchase Order 
            const insertPO = await db.purchase_order.create({
                po_number,
                vendor_id,
                payment_method_id,
                grandTotal_price: grandTotal_price.toFixed(2),
                tax_amount,
                contact_person_id,
                vendor_billing_id: vendor_billing_address_id,
                vendor_shipping_id,
                shipping_method_id,
                shipping_account_id,
                comment,
                status,
                shipping_cost,
                is_insurance,
                receiving_instruction,
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

            const vendorPOViewExpire = config.get("VENDOR_PO_VIEW_DAY_EXPIRE");
            let poViewExpireDate = new Date();
            // Record Create
            await db.po_vendor_view_links.create({
                po_id: insertPO.id,
                vendor_id,
                status: true,
                expire_date: poViewExpireDate.setDate(poViewExpireDate.getDate() + vendorPOViewExpire),
                tenant_id: TENANTID
            });

            // Create PO TRK Details
            await db.po_activities.create({
                po_id: insertPO.id,
                comment: `PO Created By ${user.first_name}`,
                action_type: po_activity_type.CREATE_PO,
                tenant_id: TENANTID,
                created_by: user.id
            })

            await poTransaction.commit();
            // Return Formation
            return {
                message: "Purchase Order Created Successfully!!!",
                status: true,
                tenant_id: TENANTID,
                po_number: insertPO.po_number
            }


        } catch (error) {
            await poTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "createPurchaseOrder" });
        }
    },
    // GET PO LIST
    getPurchaseOrderList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { searchQuery,
                ponumbers,
                productIDS,
                has_order,
                types,
                statuses,
                poEntryStartDate,
                poEntryEndDate,
                poUpdatedStartDate,
                poUpdatedEndDate } = req;

            // ASSOCIATION STARTS
            // PO TO vendor
            if (!db.purchase_order.hasAlias('vendor')) {

                await db.purchase_order.hasOne(db.vendor, {
                    sourceKey: 'vendor_id',
                    foreignKey: 'id',
                    as: 'vendor'
                });
            }
            // PO TO PO Status
            if (!db.purchase_order.hasAlias('po_status') && !db.purchase_order.hasAlias('postatus')) {

                await db.purchase_order.hasOne(db.po_status, {
                    sourceKey: 'status',
                    foreignKey: 'id',
                    as: 'postatus'
                });
            }
            // PO TO PO TRK DETAILS
            if (!db.purchase_order.hasAlias('po_trk_details') && !db.purchase_order.hasAlias('potrkdetails')) {

                await db.purchase_order.hasMany(db.po_trk_details, {
                    foreignKey: 'po_id',
                    as: 'potrkdetails'
                });
            }

            // PO TO PO Activities
            if (!db.purchase_order.hasAlias('po_activities') && !db.purchase_order.hasAlias('poactivitites')) {

                await db.purchase_order.hasMany(db.po_activities, {
                    foreignKey: 'po_id',
                    as: 'poactivitites'
                });
            }

            // PO TO PO Invoices
            if (!db.purchase_order.hasAlias('po_invoices') && !db.purchase_order.hasAlias('poinvoices')) {

                await db.purchase_order.hasMany(db.po_invoices, {
                    foreignKey: 'po_id',
                    as: 'poinvoices'
                });
            }

            // PO TO PO MFG DOC
            if (!db.purchase_order.hasAlias('po_mfg_doc') && !db.purchase_order.hasAlias('pomfgdoc')) {

                await db.purchase_order.hasMany(db.po_mfg_doc, {
                    foreignKey: 'po_id',
                    as: 'pomfgdoc'
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
            if (!db.purchase_order.hasAlias('po_productlist') && !db.purchase_order.hasAlias('poProductlist')) {

                await db.purchase_order.hasMany(db.po_productlist, {
                    foreignKey: 'purchase_order_id',
                    as: 'poProductlist'
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

            // Custom Search Query
            const searchQueryVendorWhere = searchQuery ? {
                [Op.or]: [
                    {
                        email: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    },
                    {
                        company_name: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    }
                ]
            } : {};

            // Condtional Date Filters
            const twoDateFilterWhere = poEntryStartDate && poEntryEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(poEntryStartDate),
                    [Op.lte]: new Date(poEntryEndDate),
                }]
            } : {};

            const startDateFilterWhere = (poEntryStartDate && !poEntryEndDate) ? {
                [Op.gte]: new Date(poEntryStartDate)
            } : {};

            const endDateFilterWhere = (poEntryEndDate && !poEntryStartDate) ? {
                [Op.lte]: new Date(poEntryEndDate)
            } : {};


            const twoUpdatedDateFilterWhere = poUpdatedStartDate && poUpdatedEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(poUpdatedStartDate),
                    [Op.lte]: new Date(poUpdatedEndDate),
                }]
            } : {};

            const updatedStartDateFilterWhere = (poUpdatedStartDate && !poUpdatedEndDate) ? {
                [Op.gte]: new Date(poUpdatedStartDate)
            } : {};

            const updatedEndDateFilterWhere = (poUpdatedEndDate && !poUpdatedStartDate) ? {
                [Op.lte]: new Date(poUpdatedEndDate)
            } : {};

            // PO List
            const poList = await db.purchase_order.findAll({
                include: [
                    {
                        model: db.vendor,
                        as: 'vendor',
                        ...(searchQuery && { where: searchQueryVendorWhere }),
                    },
                    { model: db.po_trk_details, as: 'potrkdetails' },
                    { model: db.po_activities, as: 'poactivitites' },
                    { model: db.po_invoices, as: 'poinvoices' },
                    { model: db.po_mfg_doc, as: 'pomfgdoc' },
                    { model: db.payment_method, as: 'paymentmethod' },
                    { model: db.po_status, as: 'postatus' },
                    {
                        model: db.user, as: 'POCreated_by', // Include User who created the product and his roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    },
                    {
                        model: db.po_productlist,
                        as: 'poProductlist', //
                        ...(productIDS && productIDS.length && {
                            where: {
                                product_id: {
                                    [Op.in]: productIDS
                                }
                            }
                        }),
                    },
                ],
                where: {
                    tenant_id: TENANTID,
                    ...(ponumbers && {
                        po_number: {
                            [Op.in]: ponumbers
                        }
                    }),
                    ...(has_order && has_order === true && {
                        order_id: {
                            [Op.ne]: null
                        }
                    }),
                    // ...(has_order === false && {
                    //     order_id: {
                    //         [Op.eq]: null
                    //     }
                    // }),
                    ...(types && types.length && {
                        type: {
                            [Op.in]: types
                        }
                    }),
                    ...(statuses && statuses.length && {
                        status: {
                            [Op.in]: statuses
                        }
                    }),
                    ...((poEntryStartDate || poEntryEndDate) && {
                        createdAt: {
                            [Op.or]: [{
                                ...(twoDateFilterWhere && twoDateFilterWhere),
                                ...(startDateFilterWhere && startDateFilterWhere),
                                ...(endDateFilterWhere && endDateFilterWhere),
                            }],
                        }
                    }),
                    ...((poUpdatedStartDate || poUpdatedEndDate) && {
                        updatedAt: {
                            [Op.or]: [{
                                ...(twoUpdatedDateFilterWhere && twoUpdatedDateFilterWhere),
                                ...(updatedStartDateFilterWhere && updatedStartDateFilterWhere),
                                ...(updatedEndDateFilterWhere && updatedEndDateFilterWhere),
                            }]
                        }
                    })
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
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
            if (!db.purchase_order.hasAlias('shipping_account') && !db.purchase_order.hasAlias('shippingAccount')) {

                await db.purchase_order.hasOne(db.shipping_account, {
                    sourceKey: 'shipping_account_id',
                    foreignKey: 'id',
                    as: 'shippingAccount'
                });
            }

            // 
            if (!db.purchase_order.hasAlias('contact_person') && !db.purchase_order.hasAlias('contactPerson')) {

                await db.purchase_order.hasOne(db.contact_person, {
                    sourceKey: 'contact_person_id',
                    foreignKey: 'id',
                    as: 'contactPerson'
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

            // PO TO PO TRK DETAILS
            if (!db.purchase_order.hasAlias('po_trk_details') && !db.purchase_order.hasAlias('potrkdetails')) {

                await db.purchase_order.hasMany(db.po_trk_details, {
                    foreignKey: 'po_id',
                    as: 'potrkdetails'
                });
            }

            // PO TO PO Activities
            if (!db.purchase_order.hasAlias('po_activities') && !db.purchase_order.hasAlias('poactivitites')) {

                await db.purchase_order.hasMany(db.po_activities, {
                    foreignKey: 'po_id',
                    as: 'poactivitites'
                });
            }

            // PO TO PO Invoices
            if (!db.purchase_order.hasAlias('po_invoices') && !db.purchase_order.hasAlias('poinvoices')) {

                await db.purchase_order.hasMany(db.po_invoices, {
                    foreignKey: 'po_id',
                    as: 'poinvoices'
                });
            }

            // PO TO PO MFG DOC
            if (!db.purchase_order.hasAlias('po_mfg_doc') && !db.purchase_order.hasAlias('pomfgdoc')) {

                await db.purchase_order.hasMany(db.po_mfg_doc, {
                    foreignKey: 'po_id',
                    as: 'pomfgdoc'
                });
            }

            // PO TO PO STATUS
            if (!db.purchase_order.hasAlias('po_status') && !db.purchase_order.hasAlias('postatus')) {

                await db.purchase_order.hasOne(db.po_status, {
                    sourceKey: 'status',
                    foreignKey: 'id',
                    as: 'postatus'
                });
            }
            // ASSOCIATION ENDS

            // Single PO 
            const singlePO = await db.purchase_order.findOne({
                include: [
                    { model: db.vendor, as: 'vendor' },
                    { model: db.payment_method, as: 'paymentmethod' },
                    { model: db.shipping_account, as: 'shippingAccount' },
                    { model: db.contact_person, as: 'contactPerson' },
                    { model: db.shipping_method, as: 'shippingMethod' },
                    { model: db.address, as: 'vendorBillingAddress' },
                    { model: db.address, as: 'vendorShippingAddress' },
                    { model: db.po_trk_details, as: 'potrkdetails' },
                    { model: db.po_activities, as: 'poactivitites' },
                    { model: db.po_invoices, as: 'poinvoices' },
                    { model: db.po_status, as: 'postatus' },
                    { model: db.po_mfg_doc, as: 'pomfgdoc' },
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

            const { type, order_id } = singlePO;

            if (type === "drop_shipping") {

                // Check If Has Alias with Users and Order
                if (!db.order.hasAlias("user") && !db.order.hasAlias("customer")) {
                    await db.order.hasOne(db.user, {
                        sourceKey: "customer_id",
                        foreignKey: "id",
                        as: "customer",
                    });
                }
                // Single Order For Admin
                const singleOrder = await db.order.findOne({
                    include: [
                        {
                            model: db.user,
                            as: "customer"
                        }, // User as customer
                    ],
                    where: {
                        [Op.and]: [{
                            id: order_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                singlePO.customer = singleOrder.customer;

            }

            // Return Formation
            return {
                message: "GET Single Purchase Order Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: singlePO
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getSinglePurchaseOrder" });

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
                shipping_cost,
                is_insurance,
                receiving_instruction,
                tax_amount,
                order_id,
                type,
                comment,
                products,
                poTRKdetails,
                poInvoice,
                poMFGDoc } = req;


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
                shipping_cost,
                is_insurance,
                receiving_instruction,
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

            if (poTRKdetails) {
                poTRKdetails.updated_by = user.id;
                const potrkUpdate = await db.po_trk_details.update(poTRKdetails, {
                    where: {
                        [Op.and]: [{
                            po_id: id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!potrkUpdate) return { message: "PO TRK Detail Unable To Update!!!" }
            }

            if (poInvoice) {
                poInvoice.updated_by = user.id;
                const poInvoiceUpdate = await db.po_invoices.update(poInvoice, {
                    where: {
                        [Op.and]: [{
                            po_id: id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!poInvoiceUpdate) return { message: "PO Invoice Unable To Update!!!" }
            }

            if (poMFGDoc) {
                poMFGDoc.updated_by = user.id;
                const poMFGDOCUpdate = await db.po_mfg_doc.update(poMFGDoc, {
                    where: {
                        [Op.and]: [{
                            po_id: id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!poInvoiceUpdate) return { message: "PO Invoice Unable To Update!!!" }
            }


            // Return Formation
            return {
                message: "Purchase Order Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "updatePurchaseOrder" });
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
                status,
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updatePOStatus) return { message: "PO Satus Change Failed!!!", status: false }

            const getPOStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        id: status,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { name } = getPOStatus;

            // Create PO TRK Details
            await db.po_activities.create({
                po_id: id,
                action_type: po_activity_type.UPDATE_PO_STATUS,
                comment: `PO ${name} By ${user.first_name}`,
                tenant_id: TENANTID,
                created_by: user?.id
            });


            // Return Formation
            return {
                message: "Purchase Order Status Changed Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "updatePOStatus" });
        }
    },
    // Po Send to Vendor Helper
    poSendToVendor: async (req, db, user, isAuth, TENANTID) => {
        const poSendTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { id, status } = req;

            // Update Purchase Order Status
            const updatePOStatus = await db.purchase_order.update({
                status,
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updatePOStatus) return { message: "PO Status Change Failed!!!", status: false }

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            })

            const { po_number, vendor_id } = findPO;

            const findVendorEmail = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        id: vendor_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { email } = findVendorEmail

            let purchaseOrderIDhashed = crypt(`${id}`);
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


            // Create PO TRK Details
            await db.po_activities.create({
                po_id: id,
                comment: `PO Send To Vendor By ${user.first_name}`,
                action_type: po_activity_type.PO_SEND_TO_VENDOR,
                tenant_id: TENANTID,
                created_by: 10001
            });

            // Commit The query
            await poSendTransaction.commit();
            // Return Formation
            return {
                message: "Purchase Order Send Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            await poSendTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "updatePOStatus" });
        }
    },
    // Update PO STATUS Public
    updatePOStatusPublic: async (req, db, TENANTID, ip, headers) => {
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { param1, param2, status, reason } = req;

            const id = decrypt(param1);
            const po_number = decrypt(param2)

            // Update Purchase Order Status
            const updatePOStatus = await db.purchase_order.update({
                status,
                updated_by: 10001
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        po_number,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updatePOStatus) return { message: "PO Status Change Failed!!!", status: false }

            const getPOStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        id: status,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { name, slug } = getPOStatus;

            // Create PO TRK Details
            await db.po_activities.create({
                po_id: id,
                comment: reason,
                action_type: po_activity_type.UPDATE_PO_STATUS_VENDOR,
                tenant_id: TENANTID,
                created_by: 10001
            });

            if (slug === "vendor_accepted" || slug === "vendor_rejected") {
                await db.po_vendor_view_links.update({
                    viewer_info: `${{ ip: ip, viewer_info: headers }}`
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (slug === "vendor_accepted") {
                    // Create PO TRK Details
                    await db.po_activities.create({
                        po_id: id,
                        comment: reason,
                        action_type: po_activity_type.PO_ACCEPTED,
                        tenant_id: TENANTID,
                        created_by: 10001
                    });

                } else if (slug === "vendor_rejected") {
                    // Create PO TRK Details
                    await db.po_activities.create({
                        po_id: id,
                        comment: reason,
                        action_type: po_activity_type.PO_REJECTED,
                        tenant_id: TENANTID,
                        created_by: 10001
                    });
                }
            }

            // Return Formation
            return {
                message: "Purchase Order Status Changed Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "updatePOStatus" });
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
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "createReceiving" });
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

            if (!db.address.hasAlias('country') && !db.address.hasAlias('countryCode')) {
                await db.address.hasOne(db.country, {
                    sourceKey: 'country',
                    foreignKey: 'code',
                    as: 'countryCode'
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

            // PO TO PO TRK DETAILS
            if (!db.purchase_order.hasAlias('po_trk_details') && !db.purchase_order.hasAlias('potrkdetails')) {

                await db.purchase_order.hasMany(db.po_trk_details, {
                    foreignKey: 'po_id',
                    as: 'potrkdetails'
                });
            }

            // PO TO PO Activities
            if (!db.purchase_order.hasAlias('po_activities') && !db.purchase_order.hasAlias('poactivitites')) {

                await db.purchase_order.hasMany(db.po_activities, {
                    foreignKey: 'po_id',
                    as: 'poactivitites'
                });
            }

            // PO TO PO Invoices
            if (!db.purchase_order.hasAlias('po_invoices') && !db.purchase_order.hasAlias('poinvoices')) {

                await db.purchase_order.hasMany(db.po_invoices, {
                    foreignKey: 'po_id',
                    as: 'poinvoices'
                });
            }

            // PO TO PO MFG DOC
            if (!db.purchase_order.hasAlias('po_mfg_doc') && !db.purchase_order.hasAlias('pomfgdoc')) {

                await db.purchase_order.hasMany(db.po_mfg_doc, {
                    foreignKey: 'po_id',
                    as: 'pomfgdoc'
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

            // DECODE
            const id = decrypt(param1);
            const po_number = decrypt(param2);

            const findPOVendorViewRecord = await db.po_vendor_view_links.findOne({
                where: {
                    [Op.and]: [{
                        po_id: id,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { expire_date, status } = findPOVendorViewRecord;

            // Time Calculating
            const reqTime = new Date();
            const recordTime = new Date(expire_date);
            // Calculating Minutes
            let minutes = ((recordTime.getTime() - reqTime.getTime()) / 1000) / 60;
            // Difference
            const diffs = Math.abs(Math.round(minutes));

            // IF Difference Less than or Equal to CONFIG minutes
            if (diffs < 0 || !status) {

                return { message: "This PO has been expired!!!", status: false }

            } else {
                // Single PO 
                const singlePO = await db.purchase_order.findOne({
                    include: [
                        { model: db.vendor, as: 'vendor' },
                        { model: db.payment_method, as: 'paymentmethod' },
                        { model: db.shipping_method, as: 'shippingMethod' },
                        { model: db.address, as: 'vendorBillingAddress', include: { model: db.country, as: "countryCode" } },
                        { model: db.address, as: 'vendorShippingAddress', include: { model: db.country, as: "countryCode" } },
                        { model: db.po_trk_details, as: 'potrkdetails' },
                        { model: db.po_activities, as: 'poactivitites' },
                        { model: db.po_invoices, as: 'poinvoices' },
                        { model: db.po_mfg_doc, as: 'pomfgdoc' },
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
                        {
                            model: db.user, as: 'POCreated_by',
                            include: {
                                model: db.role,
                                as: 'roles'
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

                // Create PO TRK Details
                await db.po_activities.create({
                    po_id: id,
                    action_type: po_activity_type.PO_VIEWED_BY_VENDOR,
                    comment: `PO Viewed By : ${{ viewer_info: headers, ip: ip }}`,
                    tenant_id: TENANTID
                })

                // Return Formation
                return {
                    message: "GET Purchase Order Public View Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: singlePO
                }

            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "viewPurchaseOrderPublic" });
        }
    },
    // Create PO TRK
    createPOTRKDetails: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id, tracking_no } = req;

            // Create PO TRK Details
            const createPOTRKDetails = await db.po_trk_details.create({
                po_id,
                tracking_no,
                tenant_id: TENANTID,
                created_by: user.id
            })

            if (createPOTRKDetails) {
                // Return Formation
                return {
                    message: "PO Tracking Inserted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPOTRKDetails" });
        }
    },
    // GET PO LIST
    getPOTRKList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            const { po_id } = req;
            // ASSOCIATION STARTS


            // PO TRK TO PO
            if (!db.po_trk_details.hasAlias('purchase_order') && !db.po_trk_details.hasAlias('purchaseOrder')) {

                await db.po_trk_details.hasOne(db.purchase_order, {
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
            // ASSOCIATION ENDS

            // PO TRK List
            const poTRKList = await db.po_trk_details.findAll({
                include: [
                    {
                        model: db.purchase_order,
                        as: "purchaseOrder",
                        include: [
                            { model: db.vendor, as: 'vendor' },
                            { model: db.payment_method, as: 'paymentmethod' }
                        ]
                    }

                ],
                where: {
                    [Op.and]: [{
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET PO TRK List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poTRKList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPOTRKList" });
        }
    },
    // Create PO Activity
    createPOActivity: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id, comment, action_type } = req;

            // Create PO TRK Details
            const createPOTRKDetails = await db.po_activities.create({
                po_id,
                comment,
                action_type,
                tenant_id: TENANTID,
                created_by: user.id
            })

            if (createPOTRKDetails) {
                // Return Formation
                return {
                    message: "PO Activity Inserted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPOActivity" });
        }
    },
    // GET PO ACTIVITY LIST
    getPOActivityList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            const { po_id } = req;
            // ASSOCIATION STARTS


            // PO TRK TO PO
            if (!db.po_activities.hasAlias('purchase_order') && !db.po_activities.hasAlias('purchaseOrder')) {

                await db.po_activities.hasOne(db.purchase_order, {
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
            // ASSOCIATION ENDS

            // PO Activity List
            const poActivityList = await db.po_activities.findAll({
                include: [
                    {
                        model: db.purchase_order,
                        as: "purchaseOrder",
                        include: [
                            { model: db.vendor, as: 'vendor' },
                            { model: db.payment_method, as: 'paymentmethod' }
                        ]
                    }

                ],
                where: {
                    [Op.and]: [{
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET PO Activity List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poActivityList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPOActivityList" });
        }
    },
    // Create PO Invoice
    createPOInvoice: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id, invoice_no, invoicefile } = req;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            // ->>> Invoice No Unique Check
            // Create PO Invoice
            const createPOInvoice = await db.po_invoices.create({
                po_id,
                invoice_no,
                invoice_date: Date.now(),
                invoice_file: null,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // If Image is Available
            // let invoice_file = `${po_number}_${new Date().getTime()}`;
            let invoiceFileName;
            if (invoicefile) {
                const rawFileName = await getFileName(invoicefile, false)
                // Upload Image to AWS S3
                const psp_admin_doc_src = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
                const psp_admin_doc_src_bucketName = psp_admin_doc_src[0]
                const psp_admin_doc_folder = psp_admin_doc_src.slice(1)
                const fileUrl = await singleFileUpload({ file: invoicefile, idf: `${po_number}/invoice/${createPOInvoice.id}`, folder: psp_admin_doc_folder, fileName: rawFileName, bucketName: psp_admin_doc_src_bucketName });
                if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };
                // Update
                invoiceFileName = fileUrl.Key.split('/').slice(-1)[0];
            }

            if (invoiceFileName) {

                // Update PO Invoice
                await db.po_invoices.update({
                    invoice_file: invoiceFileName
                }, {
                    where: {
                        [Op.and]: [{
                            id: createPOInvoice.id,
                            po_id,
                            tenant_id: TENANTID,
                        }]
                    }
                })
            }

            // Create PO TRK Details
            await db.po_activities.create({
                po_id,
                comment: `PO Created By ${user.first_name}`,
                action_type: po_activity_type.PO_INVOICE_CREATION,
                tenant_id: TENANTID,
                created_by: user.id
            })



            // Return Formation
            return {
                message: "PO Invoice Inserted Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPOInvoice" });
        }
    },
    // Update PO Invoice
    updatePOInvoice: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, po_id, invoice_no, invoicefile } = req;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            const findPOInvoice = await db.po_invoices.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Update PO Invoice
            await db.po_invoices.update({
                po_id,
                invoice_no,
                invoice_date: Date.now(),
                tenant_id: TENANTID,
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Image is Available
            // let invoice_file = `${po_number}_${new Date().getTime()}`;
            let invoiceFileName;
            if (invoicefile) {

                // IF Image Also Updated
                if (findPOInvoice.invoice_file) {
                    // Delete Previous S3 File 
                    const PSP_ADMIN_DOC_PO_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_DEST").split("/");
                    const PSP_ADMIN_DOC_PO_SRC_bucketName = PSP_ADMIN_DOC_PO_SRC[0];
                    const psp_admin_doc_folder = PSP_ADMIN_DOC_PO_SRC.slice(1);
                    await deleteFile({ idf: `${po_number}/invoice/${id}`, folder: psp_admin_doc_folder, fileName: findPOInvoice.invoice_file, bucketName: PSP_ADMIN_DOC_PO_SRC_bucketName });
                }

                // Upload New File to AWS S3
                const rawFileName = await getFileName(invoicefile, false)
                const PSP_ADMIN_DOC_PO_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
                const PSP_ADMIN_DOC_PO_SRC_bucketName = PSP_ADMIN_DOC_PO_SRC[0]
                const psp_admin_doc_folder = PSP_ADMIN_DOC_PO_SRC.slice(1)
                const fileUrl = await singleFileUpload({ file: invoicefile, idf: `${po_number}/invoice/${id}`, folder: psp_admin_doc_folder, fileName: rawFileName, bucketName: PSP_ADMIN_DOC_PO_SRC_bucketName });
                if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };

                // Update
                invoiceFileName = fileUrl.Key.split('/').slice(-1)[0];
            }

            if (invoiceFileName) {

                // Update PO Invoice
                await db.po_invoices.update({
                    invoice_file: invoiceFileName
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID,
                        }]
                    }
                });
            }

            // Create PO TRK Details
            await db.po_activities.create({
                po_id,
                comment: `PO Invoice Updated By ${user.first_name}`,
                action_type: po_activity_type.PO_INVOICE_UPDATE,
                tenant_id: TENANTID,
                created_by: user.id
            })

            // Return Formation
            return {
                message: "PO Invoice Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "updatePOInvoice" });
        }
    },
    // GET PO Invoice LIST
    getPOInvoiceList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            const { po_id } = req;
            // ASSOCIATION STARTS

            // PO TRK TO PO
            if (!db.po_invoices.hasAlias('purchase_order') && !db.po_invoices.hasAlias('purchaseOrder')) {

                await db.po_invoices.hasOne(db.purchase_order, {
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
            // ASSOCIATION ENDS

            // PO Invoice List
            const poInvoiceList = await db.po_invoices.findAll({
                include: [
                    {
                        model: db.purchase_order,
                        as: "purchaseOrder",
                        include: [
                            { model: db.vendor, as: 'vendor' },
                            { model: db.payment_method, as: 'paymentmethod' }
                        ]
                    }

                ],
                where: {
                    [Op.and]: [{
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET PO Invoice List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poInvoiceList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPOInvoiceList" });
        }
    },
    // Create MFG DOC
    createMFGDOC: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id, pomfgfile } = req;

            // Create PO MFG DOC
            const createPOMFGDOC = await db.po_mfg_doc.create({
                po_id,
                pomfg_file: "Not Uploaded Yet",
                tenant_id: TENANTID,
                created_by: user.id
            });

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            let mfgFileName;
            if (pomfgfile) {
                // Upload File to AWS S3
                const rawFileName = await getFileName(pomfgfile, false)
                const PSP_ADMIN_DOC_MFG_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
                const PSP_ADMIN_DOC_MFG_SRC_bucketName = PSP_ADMIN_DOC_MFG_SRC[0]
                const psp_admin_doc_folder = PSP_ADMIN_DOC_MFG_SRC.slice(1)
                const fileUrl = await singleFileUpload({ file: pomfgfile, idf: `${po_number}/mfg/${createPOMFGDOC.id}`, folder: psp_admin_doc_folder, fileName: rawFileName, bucketName: PSP_ADMIN_DOC_MFG_SRC_bucketName });
                if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };

                // Update
                mfgFileName = fileUrl.Key.split('/').slice(-1)[0];
            }

            if (mfgFileName) {

                // Update PO Invoice
                const updatePOMFG = await db.po_mfg_doc.update({
                    pomfg_file: mfgFileName
                }, {
                    where: {
                        [Op.and]: [{
                            id: createPOMFGDOC.id,
                            po_id,
                            tenant_id: TENANTID,
                        }]
                    }
                });

                // Create PO TRK Details
                await db.po_activities.create({
                    po_id,
                    comment: `PO MFG DOC Created By ${user.first_name}`,
                    action_type: po_activity_type.PO_MFG_CREATION,
                    tenant_id: TENANTID,
                    created_by: user.id
                })

                if (updatePOMFG) {
                    // Return Formation
                    return {
                        message: "PO MFG DOC Inserted Successfully!!!",
                        status: true,
                        tenant_id: TENANTID
                    }
                }

            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createMFGDOC" });
        }
    },
    // GET PO MFG DOC LIST
    getPOMFGDOCList: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            const { po_id } = req;
            // ASSOCIATION STARTS

            // PO TRK TO PO
            if (!db.po_mfg_doc.hasAlias('purchase_order') && !db.po_mfg_doc.hasAlias('purchaseOrder')) {

                await db.po_mfg_doc.hasOne(db.purchase_order, {
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
            // ASSOCIATION ENDS

            // PO MFG DOC List
            const poMFGDOCList = await db.po_mfg_doc.findAll({
                include: [
                    {
                        model: db.purchase_order,
                        as: "purchaseOrder",
                        include: [
                            { model: db.vendor, as: 'vendor' },
                            { model: db.payment_method, as: 'paymentmethod' }
                        ]
                    }
                ],
                where: {
                    [Op.and]: [{
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET PO MFG DOC List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poMFGDOCList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPOMFGDOCList" });
        }
    },
    // GET PO STATUS LIST
    getPOStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {


            // PO Status List
            const poStatusList = await db.po_status.findAll({
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return Formation
            return {
                message: "GET PO Status List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poStatusList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPOStatusList" });
        }
    },
    // GET PO NUMBER LIST
    getPONumbers: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {


            // PO Number List
            const poNumberList = await db.purchase_order.findAll({
                attributes: ["po_number"],
                where: {
                    tenant_id: TENANTID
                }
            });

            // Return Formation
            return {
                message: "GET PO Status List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poNumberList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPONumbers" });
        }
    },
    // Create PO REJECT REASONS
    createPORejectReason: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { reason, status } = req;

            const checkExist = await db.po_reject_reasons.findOne({
                where: {
                    [Op.and]: [{
                        reason,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (checkExist) return { message: "This Reason Is Already Exists!!!", status: false }

            // Insert
            const createPORejectReasons = await db.po_reject_reasons.create({
                reason,
                status,
                tenant_id: TENANTID,
                created_by: user.id
            });

            if (createPORejectReasons) {
                // Return Formation
                return {
                    message: "PO Reject Reason Inserted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPORejectReason" });
        }
    },
    // GET PO STATUS LIST
    getPORejectReasonList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // List
            const poRejectReasonList = await db.po_reject_reasons.findAll({
                where: {
                    [Op.and]: [{
                        status: true,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "GET PO Reject Reason List Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: poRejectReasonList
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', query: "getPORejectReasonList" });
        }
    },
    // DELETE PO Invoice
    deletePOInvoice: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id } = req;

            const findPOInvoice = await db.po_invoices.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_id } = findPOInvoice;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            // IF Image Also Updated

            // Delete Previous S3 File 
            const PSP_ADMIN_DOC_PO_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_DEST").split("/");
            const PSP_ADMIN_DOC_PO_SRC_bucketName = PSP_ADMIN_DOC_PO_SRC[0];
            const psp_admin_doc_folder = PSP_ADMIN_DOC_PO_SRC.slice(1);
            await deleteFile({ idf: `${po_number}/invoice/${id}`, folder: psp_admin_doc_folder, fileName: findPOInvoice.invoice_file, bucketName: PSP_ADMIN_DOC_PO_SRC_bucketName });


            // Delete
            const deletePOInvoice = await db.po_invoices.destroy({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Create PO TRK Details
            await db.po_activities.create({
                po_id,
                comment: `PO Invoice Deleted By ${user.first_name}`,
                action_type: po_activity_type.PO_INVOICE_DELETE,
                tenant_id: TENANTID,
                created_by: user.id
            })



            if (deletePOInvoice) {
                // Return Formation
                return {
                    message: "PO Invoice Has Been Deleted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "deletePOInvoice" });
        }
    },
    // Update PO MFG DOC
    updatePOMFGDOC: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id,
                po_id,
                pomfgfile } = req;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            const findMFGDOC = await db.po_mfg_doc.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Update PO Invoice
            await db.po_mfg_doc.update({
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If FILE is Available
            let mfgDocFileName;
            if (pomfgfile) {

                // IF Image Also Updated
                if (findMFGDOC.pomfg_file) {
                    // Delete Previous S3 File 
                    const PSP_ADMIN_DOC_MFG_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_DEST").split("/");
                    const PSP_ADMIN_DOC_MFG_SRC_bucketName = PSP_ADMIN_DOC_MFG_SRC[0];
                    const psp_admin_doc_folder = PSP_ADMIN_DOC_MFG_SRC.slice(1);
                    await deleteFile({ idf: `${po_number}/mfg/${id}`, folder: psp_admin_doc_folder, fileName: findMFGDOC.pomfg_file, bucketName: PSP_ADMIN_DOC_MFG_SRC_bucketName });
                }

                // Upload New File to AWS S3
                const rawFileName = await getFileName(pomfgfile, false)
                const PSP_ADMIN_DOC_MFG_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
                const PSP_ADMIN_DOC_MFG_SRC_bucketName = PSP_ADMIN_DOC_MFG_SRC[0]
                const psp_admin_doc_folder = PSP_ADMIN_DOC_MFG_SRC.slice(1)
                const fileUrl = await singleFileUpload({ file: pomfgfile, idf: `${po_number}/mfg/${id}`, folder: psp_admin_doc_folder, fileName: rawFileName, bucketName: PSP_ADMIN_DOC_MFG_SRC_bucketName });
                if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };

                // Update
                mfgDocFileName = fileUrl.Key.split('/').slice(-1)[0];
            }

            if (mfgDocFileName) {

                // Update PO Invoice
                await db.po_mfg_doc.update({
                    pomfg_file: mfgDocFileName
                }, {
                    where: {
                        [Op.and]: [{
                            id,
                            tenant_id: TENANTID,
                        }]
                    }
                });
            }

            // Create PO TRK Details
            await db.po_activities.create({
                po_id,
                comment: `PO MFG DOC Updated By ${user.first_name}`,
                action_type: po_activity_type.PO_MFG_UPDATE,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            return {
                message: "PO MFG DOC Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "updatePOMFGDOC" });
        }
    },
    // DELETE PO Invoice
    deletePOMFGDOC: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id } = req;

            const findPOMFGDOC = await db.po_mfg_doc.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_id } = findPOMFGDOC;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number } = findPO;

            // IF Image Also Updated

            // Delete Previous S3 File 
            const PSP_ADMIN_DOC_PO_SRC = config.get("AWS.PSP_ADMIN_DOC_PO_DEST").split("/");
            const PSP_ADMIN_DOC_PO_SRC_bucketName = PSP_ADMIN_DOC_PO_SRC[0];
            const psp_admin_doc_folder = PSP_ADMIN_DOC_PO_SRC.slice(1);
            await deleteFile({ idf: `${po_number}/mfg/${id}`, folder: psp_admin_doc_folder, fileName: findPOMFGDOC.pomfg_file, bucketName: PSP_ADMIN_DOC_PO_SRC_bucketName });


            // Delete
            const deletePOMFGDOC = await db.po_mfg_doc.destroy({
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Create PO TRK Details
            await db.po_activities.create({
                po_id,
                comment: `PO MFG DOC Deleted By ${user.first_name}`,
                action_type: po_activity_type.PO_MFG_DELETED,
                tenant_id: TENANTID,
                created_by: user.id
            })



            if (deletePOMFGDOC) {
                // Return Formation
                return {
                    message: "PO MFG DOC Has Been Deleted Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "deletePOMFGDOC" });
        }
    },
}









// CHEAT SHEET

            // if (poTRKdetails) {
            //     const { tracking_no } = poTRKdetails;
            //     // Create PO TRK Details
            //     const createPOTRKDetails = await db.po_trk_details.create({
            //         po_id: insertPO.id,
            //         tracking_no,
            //         tenant_id: TENANTID,
            //         created_by: user.id
            //     });

            //     if (!createPOTRKDetails) return { message: "PO TRK Details are Unable To Insert!!!", status: false }
            // }

            // if (poInvoice) {
            //     const { invoice_no, invoice_date, invoice_path } = poInvoice;
            //     // Create PO Invoice
            //     const createPOInvoice = await db.po_invoices.create({
            //         po_id: insertPO.id,
            //         invoice_no,
            //         invoice_date,
            //         invoice_path,
            //         tenant_id: TENANTID,
            //         created_by: user.id
            //     });

            //     if (!createPOInvoice) return { message: "PO Invoice are Unable To Insert!!!", status: false }
            // }

            // if (poMFGDoc) {
            //     const { pomfg_file } = poMFGDoc;

            //     // Create PO MFG DOC
            //     const createPOMFGDOC = await db.po_mfg_doc.create({
            //         po_id: insertPO.id,
            //         pomfg_file,
            //         tenant_id: TENANTID,
            //         created_by: user.id
            //     });
            //     if (!createPOMFGDOC) return { message: "PO MFG DOC are Unable To Insert!!!", status: false }
            // }

