// All Requires
const { Op } = require("sequelize");
const { crypt, decrypt } = require("../utils/hashes");
const config = require('config');
const { Mail } = require("../utils/email");
const logger = require("../../logger");
const { default: slugify } = require("slugify");
const { singleFileUpload, deleteFile, getFileName, singleFileUploadFromPath } = require("../utils/fileUpload");
const { po_activity_type } = require("../../enums/po_enum");
const { checkPermission } = require("../utils/permissionChecker");
const { generatePDF } = require("../utils/pdfgeneration");
const { join } = require("path");
const db = require("../db");
const { sequelize } = require("../db");


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
                products
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

                if (findMaxPONumber && findMaxPONumber.split('-').slice(-1)[0] != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${parseInt(findMaxPONumber.split('-').slice(-1)[0]) + 2}`
                } else {
                    po_number = `${po_prefix}-${po_startfrom + 2}`
                }

            } else {

                if (findMaxPONumber && findMaxPONumber.split('-').slice(-1)[0] != 0) { // Check if the last entry is available
                    po_number = `${po_prefix}-${parseInt(findMaxPONumber.split('-').slice(-1)[0]) + 3}`
                } else {
                    po_number = `${po_prefix}-${po_startfrom + 3}`
                }

            }

            // PO Product List Array
            const poProductList = [];

            products.forEach(async (element) => {
                const calculateTotal = element.price * element.quantity;

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
                expire_date: poViewExpireDate.setDate(poViewExpireDate.getDate() + parseInt(vendorPOViewExpire)),
                tenant_id: TENANTID
            });

            // Activity
            this.insertPOActivity(po_activity_type.CREATE_PO, `PO Created By ${user.first_name}`, insertPO.id, user.id, user.id, TENANTID);

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

            // Assign Grand Total Price 
            await poList.forEach(async (item) => {
                item.grandTotal_price = this.poGrandTotal(item.id, TENANTID)
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

            if (!db.vendor.hasAlias('addresses')) {
                await db.vendor.hasMany(db.address,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        as: "addresses",
                        scope: {
                            ref_model: 'vendor'
                        }
                    });
            }
            if (!db.vendor.hasAlias('contact_person') && !db.vendor.hasAlias('contactPersons')) {
                await db.vendor.hasMany(db.contact_person,
                    {
                        foreignKey: 'ref_id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        },
                        as: "contactPersons"
                    });
            }
            // 
            if (!db.address.hasAlias('country') && !db.address.hasAlias('countryCode')) {
                await db.address.hasOne(db.country, {
                    sourceKey: 'country',
                    foreignKey: 'code',
                    as: 'countryCode'
                });
            }
            // ASSOCIATION ENDS

            // Single PO 
            const singlePO = await db.purchase_order.findOne({
                include: [
                    {
                        model: db.vendor, as: 'vendor',
                        include: [
                            {
                                model: db.address,
                                as: "addresses",
                                where: {
                                    status: true
                                },
                                separate: true,
                                include: { model: db.country, as: "countryCode" }
                            },
                            { model: db.contact_person, as: "contactPersons" }
                        ]
                    },
                    { model: db.payment_method, as: 'paymentmethod' },
                    { model: db.shipping_account, as: 'shippingAccount' },
                    { model: db.contact_person, as: 'contactPerson' },
                    { model: db.shipping_method, as: 'shippingMethod' },
                    {
                        model: db.address,
                        as: 'vendorBillingAddress',
                        include: { model: db.country, as: "countryCode" }
                    },
                    {
                        model: db.address,
                        as: 'vendorShippingAddress',
                        include: { model: db.country, as: "countryCode" }
                    },
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

            };

            singlePO.grandTotal_price = this.poGrandTotal(id, TENANTID);

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
        const poUpdateTransaction = await db.sequelize.transaction();
        try {

            // DATA FROM REQUEST
            const { 
                id,
                po_number,
                contact_person_id,
                vendor_id,
                shipping_method_id,
                shipping_account_id,
                payment_method_id,
                vendor_billing_id,
                shipping_cost,
                is_insurance,
                receiving_instruction,
                tax_amount,
                order_id,
                type,
                comment,
                products,
            } = req;

            // PO Product List Array
            const poProductList = [];
            const newPoProductList = [];
            if (products) {
                // In Case of Existing Products Update
                products.forEach(async (element) => {
                    const calculateTotal = element.price * element.quantity;
                    if (!element.isNew) {
                        // PO Product List Array Formation
                        poProductList.push({
                            product_id: element.id,
                            quantity: element.quantity,
                            price: element.price,
                            totalPrice: calculateTotal,
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
                        newPoProductList.push({
                            purchase_order_id: id,
                            product_id: newElement.id,
                            quantity: newElement.quantity,
                            price: newElement.price,
                            totalPrice: calculateTotal,
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
                shipping_account_id,
                payment_method_id,
                vendor_billing_id,
                tax_amount,
                comment,
                shipping_cost,
                is_insurance,
                receiving_instruction,
                order_id,
                type,
                vendor_id,
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
            if (!updatePurchaseOrder) {
                await poUpdateTransaction.rollback();
                return { message: "PO Update Failed!!!", status: false }
            }

            // If Products is Available For Update
            if (poProductList && poProductList.length > 0) {
                // Update Product List With Loop
                poProductList.forEach(async (product) => {
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
                if (!insertNewProductList) {
                    await poUpdateTransaction.rollback();
                    return { message: "New Product List Insert Failed!!!", status: false }
                }
            }

            
            if (!db.purchase_order.hasAlias('po_productlist') && !db.purchase_order.hasAlias('poproducts')) {
                await db.purchase_order.hasMany(db.po_productlist, {
                    foreignKey: 'purchase_order_id',
                    as: 'poproducts'
                });
            }

            // Find PO
            const findPO = await db.purchase_order.findOne({
                include: [{ model: db.po_productlist, as: "poproducts" }],
                where: {
                    [Op.and]: [{
                        id,
                        po_number,
                        tenant_id: TENANTID
                    }]
                }
            });


            /* ----------------------------- Activity Added Start ----------------------------- */
            if(findPO){
                if(findPO.shipping_method_id !== shipping_method_id) 
                    await this.insertPOActivity(po_activity_type.SHIPPING_METHOD_UPDATE, `From: ${findPO.shipping_method_id} & To: ${shipping_method_id}`, findPO.id, user.id, user.id, TENANTID);
                if(contact_person_id && findPO.contact_person_id !== contact_person_id) 
                    await this.insertPOActivity(po_activity_type.CONTACT_PERSON_UPDATE, `From: ${findPO.contact_person_id} & To: ${contact_person_id}`, findPO.id, user.id, user.id, TENANTID);
                if(findPO.vendor_id !== vendor_id) 
                    await this.insertPOActivity(po_activity_type.VENDOR_UPDATE, `From: ${findPO.vendor_id} & To: ${vendor_id}`, findPO.id, user.id, user.id, TENANTID);
                if(findPO.type !== type) 
                    await this.insertPOActivity(po_activity_type.PO_TYPE_UPDATE, `From: ${findPO.type} & To: ${type}`, findPO.id, user.id, user.id, TENANTID);
                if(findPO.payment_method_id !== payment_method_id) 
                    await this.insertPOActivity(po_activity_type.PAYMENT_METHOD_UPDATE, `From: ${findPO.payment_method_id} & To: ${payment_method_id}`, findPO.id, user.id, user.id, TENANTID);
                if(shipping_account_id && findPO.shipping_account_id !== shipping_account_id) 
                    await this.insertPOActivity(po_activity_type.SHIPPING_ACCOUNT_UPDATE, `From: ${findPO.shipping_account_id} & To: ${shipping_account_id}`, findPO.id, user.id, user.id, TENANTID);
                if(findPO.vendor_billing_id !== vendor_billing_id) 
                    await this.insertPOActivity(po_activity_type.VENDOR_BILLING_ADDRESS_UPDATE, `From: ${findPO.vendor_billing_id} & To: ${vendor_billing_id}`, findPO.id, user.id, user.id, TENANTID);
                if( tax_amount && findPO.tax_amount !== tax_amount) 
                    await this.insertPOActivity(po_activity_type.TAX_AMOUNT_UPDATE, `From: ${findPO.tax_amount} & To: ${tax_amount}`, findPO.id, user.id, user.id, TENANTID);
                if(comment && findPO.comment !== comment) 
                    await this.insertPOActivity(po_activity_type.COMMENT_UPDATE, `From: ${findPO.comment} & To: ${comment}`, findPO.id, user.id, user.id, TENANTID);
                if( shipping_cost && findPO.shipping_cost !== shipping_cost) 
                    await this.insertPOActivity(po_activity_type.SHIPPING_COST_UPDATE, `From: ${findPO.shipping_cost} & To: ${shipping_cost}`, findPO.id, user.id, user.id, TENANTID);
                if(is_insurance && findPO.is_insurance !== is_insurance) 
                    await this.insertPOActivity(po_activity_type.INSURANCE_UPDATE, `From: ${findPO.is_insurance} & To: ${is_insurance}`, findPO.id, user.id, user.id, TENANTID);
                if(receiving_instruction && findPO.receiving_instruction !== receiving_instruction) 
                    await this.insertPOActivity(po_activity_type.RECEIVING_INSTRUCTION_UPDATE, `From: ${findPO.receiving_instruction} & To: ${receiving_instruction}`, findPO.id, user.id, user.id, TENANTID);
                if(order_id && findPO.order_id !== order_id) 
                    await this.insertPOActivity(po_activity_type.ORDER_UPDATE, `From: ${findPO.order_id} & To: ${order_id}`, findPO.id, user.id, user.id, TENANTID);
                if(findPO.updated_by !== user.id) 
                    await this.insertPOActivity(po_activity_type.UPDATED_BY_UPDATE, `From: ${findPO.updated_by} & To: ${user.id}`, findPO.id, user.id, user.id, TENANTID);
                if (poProductList && poProductList.length > 0) {
                    poProductList.forEach(async element => {
                        findPO.poproducts.forEach(async item => {
                            if(item.product_id === element.product_id){
                                if(item.quantity !== element.quantity)
                                    await this.insertPOActivity(po_activity_type.PRODUCT_QUANTITY_UPDATE, `From: ${item.quantity} & To: ${element.quantity}`, findPO.id, user.id, user.id, TENANTID);
                                if(item.price !== element.price)
                                    await this.insertPOActivity(po_activity_type.PRODUCT_PRICE_UPDATE, `From: ${item.price} & To: ${element.price}`, findPO.id, user.id, user.id, TENANTID);
                                if(item.updated_by !== element.updated_by)
                                    await this.insertPOActivity(po_activity_type.PRODUCT_UPDATED_BY_UPDATE, `From: ${item.updated_by} & To: ${element.updated_by}`, findPO.id, user.id, user.id, TENANTID);
                            }
                        })
                    });
                    // Delete If Not Exit
                    findPO.poproducts.forEach(async (item) => {
                        const exists = poProductList.every(item2 => item2.product_id === item.product_id)
                        if(!exists) {
                            await db.po_productlist.destroy({
                                where: {
                                    [Op.and]: [{
                                        id: item.id,
                                        tenant_id: TENANTID
                                    }]
                                }
                            })
                            await this.insertPOActivity(po_activity_type.PRODUCT_DELETE, `Product ID: ${item.id}`, findPO.id, user.id, user.id, TENANTID);
                        }
                    });
                }
                
            }


            /* --------------------------- Activity Added End --------------------------- */

            await poUpdateTransaction.commit();

            // Return Formation
            return {
                message: "Purchase Order Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID,
                po_number
            }


        } catch (error) {
            await poUpdateTransaction.rollback();
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

            const getPOStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        id: status,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { name, slug } = getPOStatus;

            if (slug === "submitted") { // Check Permission For Submit PO

                // Permission Name of this API
                const permissionName = "submit-po";
                // Check Permission
                const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
                if (!checkPermissions.success) {
                    return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
                }

                // Activity
                this.insertPOActivity(po_activity_type.SUBMIT_PO, `PO Status Updated To Submitted`, id, user.id, user.id, TENANTID);

            } else if (slug === "canceled") { // Check Permission For Cancel PO

                // Permission Name of this API
                const permissionName = "cancel-po";
                // Check Permission
                const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
                if (!checkPermissions.success) {
                    return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
                }

                // Activity
                this.insertPOActivity(po_activity_type.CANCEL_PO, `PO Status Updated To Canceled`, id, user.id, user.id, TENANTID);

            } else if (slug === "hold") { // Check Permission For Hold PO

                // Permission Name of this API
                const permissionName = "hold-po";
                // Check Permission
                const checkPermissions = await checkPermission(db, user, TENANTID, permissionName);
                if (!checkPermissions.success) {
                    return { message: "You dont have access to this route, please contact support to have you give this route permission!!!", status: false };
                }

                // Activity
                this.insertPOActivity(po_activity_type.HOLD_PO, `PO Status Updated To Hold`, id, user.id, user.id, TENANTID);

            }

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

            if (!updatePOStatus) {
                // Activity
                this.insertPOActivity(po_activity_type.FAILURE_PO, `PO Status Update Failed`, id, user.id, user.id, TENANTID);

                return { message: "PO Satus Change Failed!!!", status: false }
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
    // Po Send to Vendor Helper ->> SUBMIT PO
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
            const poStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        id: status,
                        tenant_id: TENANTID
                    }]
                }
            })

            // Activity type -> Update Po, Comment -> PO Status Updated To {Status}
            // For Failure Also Activity Update
            this.insertPOActivity(po_activity_type.UPDATE_PO_STATUS, `PO Status Updated To ${poStatus.name}`, id, user.id, user.id, TENANTID);

            if (!updatePOStatus) {
                this.insertPOActivity(po_activity_type.FAILURE_PO, `PO Status Update Failed`, id, user.id, user.id, TENANTID);
                return { message: "PO Status Change Failed!!!", status: false }
            }

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

            const { email } = findVendorEmail;

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
            await Mail(email, mailSubject, mailData, 'create-purchase-order', TENANTID, []);

            this.insertPOActivity(po_activity_type.PO_SEND_TO_VENDOR, `PO Email With Link Sent to Vendor`, id, user.id, user.id, TENANTID);

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
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "poSendToVendor" });
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
                        id: id,
                        po_number,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!updatePOStatus) {
                // Activity
                this.insertPOActivity(po_activity_type.FAILURE_PO, `PO Status Update Failed From Vendor`, id, 10001, 10001, TENANTID);
                return { message: "PO Status Change Failed!!!", status: false }
            }
            const getPOStatus = await db.po_status.findOne({
                where: {
                    [Op.and]: [{
                        id: status,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { name, slug } = getPOStatus;

            this.insertPOActivity(po_activity_type.UPDATE_PO_STATUS_VENDOR, `PO Status Updated To ${name}`, id, 10001, 10001, TENANTID);

            if (slug === "vendor_accepted" || slug === "vendor_rejected") {
                await db.po_vendor_view_links.update({
                    status: false,
                    viewer_info: `ip: ${ip},  viewer_info: ${JSON.stringify(headers)} `
                }, {
                    where: {
                        [Op.and]: [{
                            po_id: id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                this.insertPOActivity(po_activity_type.PO_LINK_CLOSED, `PO Public View Link Closed By Server`, id, 10001, 10001, TENANTID);

                if (slug === "vendor_accepted") {
                    this.insertPOActivity(po_activity_type.PO_ACCEPTED, `PO Accepted By Vendor`, id, 10001, 10001, TENANTID);

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

                    const { email } = findVendorEmail;


                    // ASSOCIATION STARTS
                    // PO TO vendor
                    if (!db.purchase_order.hasAlias('vendor')) {

                        await db.purchase_order.hasOne(db.vendor, {
                            sourceKey: 'vendor_id',
                            foreignKey: 'id',
                            as: 'vendor'
                        });
                    }

                    if (!db.purchase_order.hasAlias('contact_person') && !db.purchase_order.hasAlias('contactPersons')) {
                        await db.purchase_order.hasOne(db.contact_person,
                            {
                                sourceKey: 'contact_person_id',
                                foreignKey: 'id',
                                constraints: false,
                                scope: {
                                    ref_model: 'vendor'
                                },
                                as: "contactPersons"
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

                    // PO TO ORDER
                    if (!db.purchase_order.hasAlias('order')) {

                        await db.purchase_order.hasOne(db.order, {
                            sourceKey: 'order_id',
                            foreignKey: 'id',
                            as: 'order'
                        });
                    }

                    // PO TO ORDER
                    if (!db.order.hasAlias('address') && !db.order.hasAlias('shippingAddress')) {

                        await db.order.hasOne(db.address, {
                            sourceKey: 'shipping_address_id',
                            foreignKey: 'id',
                            as: 'shippingAddress'
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

                    // Single PO 
                    const singlePO = await db.purchase_order.findOne({
                        include: [
                            {
                                model: db.vendor,
                                as: 'vendor'
                            },
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
                            {
                                model: db.order,
                                as: 'order',
                                include: {
                                    model: db.address,
                                    as: 'shippingAddress',
                                    include: { model: db.country, as: "countryCode" }
                                }
                            },
                            {
                                model: db.contact_person,
                                as: "contactPersons"
                            }
                        ],
                        where: {
                            [Op.and]: [{
                                id,
                                po_number,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    if (singlePO.type === "drop_shipping") {
                        singlePO.shipTo = singlePO.order.shippingAddress;
                    } else if (singlePO.type === "default") {
                        const companyShippingAddress = await db.address.findOne({
                            include: [
                                { model: db.country, as: "countryCode" }
                            ],
                            where: {
                                [Op.and]: [{
                                    ref_model: "company_info",
                                    tenant_id: TENANTID,
                                    type: "shipping",
                                    status: true,
                                    isDefault: true
                                }]
                            }
                        });

                        singlePO.shipTo = companyShippingAddress;
                    }
                    // GET COMPANY BILLING ADDRESS
                    const companyBilling = await db.address.findOne({
                        include: [
                            { model: db.country, as: "countryCode" }
                        ],
                        where: {
                            [Op.and]: [{
                                ref_model: "company_info",
                                tenant_id: TENANTID,
                                type: "billing",
                                status: true,
                                isDefault: true
                            }]
                        }
                    });
                    singlePO.companyBilling = companyBilling;

                    // GET COMPANY INFO
                    const companyInfo = await db.company_info.findOne({
                        where: {
                            tenant_id: TENANTID
                        }
                    });
                    singlePO.companyInfo = companyInfo;

                    // Calculate Sub Total
                    let subTotal = await db.po_productlist.sum('totalPrice', {
                        where: {
                            [Op.and]: [{
                                purchase_order_id: id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    singlePO.subTotal = subTotal;
                    singlePO.grandTotal = this.poGrandTotal(id, TENANTID);

                    // TEMPLATE FOR NOW
                    const temaplate = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="utf-8">
                        <title>PO Invoice - Prime Server Parts</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
                        <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
                        <script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                    </head>
                    
                    <body>
                        <div class="col-md-12">
                            <div class="row">
                                <div class="receipt-main col-xs-12 col-sm-12 col-md-12">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="receipt-header"
                                                style="border: 1px solid #1677ff;padding: 10px;height: auto;border-radius: 8px; margin-bottom: 10px;">
                                                <div class="col-xs-6 col-sm-6 col-md-6">
                                                    <div class="receipt-left">
                                                        <img class="img-responsive" alt="iamgurdeeposahan" src=<%=company_logo %>
                                                        style="width: 150px; margin-top: 15px;">
                    
                                                        <h5 style="margin-top: 25px; font-weight: 600; font-size: 16px;">
                                                            <%= companyInfo.name %>
                                                        </h5>
                                                        <p>
                                                            <%= companyBilling.address1 %>
                                                        </p>
                                                        <% if (companyBilling.address2) { %>
                                                            <p>
                                                                <%= companyBilling.address2 %>
                                                            </p>
                                                            <% } %>
                                                                <p>
                                                                    <%= companyBilling.city + ', ' + companyBilling.state +' - '+ companyBilling.zip_code %>
                                                                </p>
                                                        <% if (companyBilling.phone) { %>
                                                            <p><%= companyBilling.phone %></p>
                                                            <% } %>
                                                        <p><%= companyBilling.country %></p>
                    
                                                    </div>
                                                </div>
                                                <div class="col-xs-6 col-sm-6 col-md-6 text-right">
                                                    <div class="receipt-right">
                                                        <p style="margin-top: 10px;"><span>Purchase Order:</span>
                                                            <%= po_number %>
                                                        </p>
                                                        <p><span>Date:</span>
                                                            <%= new Date(updatedAt).toDateString()%>
                                                        </p>
                    
                                                    </div>
                                                </div>
                    
                                                <div class="row">
                                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                                        <div class="receipt-header receipt-header-mid">
                                                            <div class="col-xs-8 col-sm-8 col-md-8 text-left">
                                                                <div class="receipt-left2">
                                                                    <h5>Issued To</h5>
                                                                    <p>
                                                                        <%= vendor.company_name %>
                                                                    </p>
                                                                    <p>
                                                                        <%= vendor.contact_person %>
                                                                    </p>
                                                                    <p>
                                                                        <%= vendorBillingAddress.address1 %>
                                                                    </p>
                                                                    <% if (vendorBillingAddress.address2) { %>
                                                                        <p><%= vendorBillingAddress.address2 %></p>
                                                                        <% } %>
                                                                    <p>
                                                                        <%= vendorBillingAddress.city + ' , ' + vendorBillingAddress.state +' - '+ vendorBillingAddress.zip_code %>
                                                                    </p>
                                                                    <% if (contactPersons) { %>
                                                                        <p><%= contactPersons.email %></p>
                                                                        <p><%= contactPersons.phone %></p>
                    
                                                                        <% } else { %>
                    
                                                                            <p><%= vendor.email %></p>
                                                                            <p><%= vemdor.phone_number %></p>
                    
                                                                            <% } %>
                                                                    <p><%= companyBilling.country %></p>
                                                                </div>
                                                            </div>
                                                            <div class="col-xs-4 col-sm-4 col-md-4 text-left">
                                                                <div class="receipt-right2">
                                                                    <h5>Ship To</h5>
                                                                    <p>
                                                                        <%= shipTo.address1 %>
                                                                    </p>
                                                                    <% if (shipTo.address2) { %>
                                                                        <p><%= shipTo.address2 %></p>
                                                                        <% } %>
                                                                    <p>
                                                                        <%= shipTo.city + ' , ' + shipTo.state +' - '+ shipTo.zip_code %>
                                                                    </p>
                                                                    <p><%= shipTo.country %></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                    
                                                <div class="row">
                                                    <div class="col-xs-12 col-sm-12 col-md-12" style="margin-top: 30px;">
                                                        <div class="col-xs-3 col-sm-3 col-md-3">
                                                            <div class="receipt-right text-center">
                                                                <h5 style="font-weight: 600; font-size: 16px;">Rep</h5>
                                                                <p><%= POCreated_by.first_name + ' , '+ POCreated_by.last_name %></p>
                    
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-3 col-sm-3 col-md-3">
                                                            <div class="receipt-right text-center">
                                                                <h5 style="font-weight: 600; font-size: 16px;">Payment Terms</h5>
                                                                <p><%= paymentmethod.name %></p>
                    
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-3 col-sm-3 col-md-3">
                                                            <div class="receipt-right text-center">
                                                                <h5 style="font-weight: 600; font-size: 16px;">Delivery</h5>
                                                                <p><%= shippingMethod.name %></p>
                    
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-3 col-sm-3 col-md-3">
                                                            <div class="receipt-right text-center">
                                                                <h5 style="font-weight: 600; font-size: 16px;">Tax Rate</h5>
                                                                <p>$<%= tax_amount %></p>
                    
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                    
                                    </div>
                    
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-12 col-md-12">
                                            <table class="table custom-data-table">
                                                <thead style="background-color: #1677ff !important">
                                                    <tr>
                                                        <th>Part Number</th>
                                                        <th>Description</th>
                                                        <th>Unite Price</th>
                                                        <th>Quantity</th>
                                                        <th style="text-align: right;">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <% poProductlist.forEach(function(item){ %>
                                                            <td class="col-xs-2 col-sm-2 col-md-2"><%= item.product.prod_partnum %></td>
                                                            <td class="col-xs-5 col-sm-5 col-md-5"><%= item.product.prod_name %></td>
                                                            <td class="col-xs-2 col-sm-2 col-md-2"><%= item.price %></td>
                                                            <td class="col-xs-1 col-sm-1 col-md-1"><%= item.quantity %></td>
                                                            <td class="col-xs-2 col-sm-2 col-md-2" style="text-align: right;">$<%= item.totalPrice %></td>
                                                          <% }); %>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-4 col-sm-4 col-md-4 col-md-offset-8 col-sm-offset-8 col-xs-offset-8">
                                            <table class="table custom-data-table-two">
                                                <thead>
                                                    <tr>
                                                        <th style="color: #000000; text-align: left;">Sub Total</th>
                                                        <th style="color: #000000; text-align: right;">$<%= subTotal %></th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-8 col-sm-8 col-md-8">
                                            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">Comment: <br>
                                                <%= comment %>
                                            </h4>
                                            <h4 style="font-size: 16px; font-weight: 600;">Receiving Instruction: <br>
                                                <%= receiving_instruction %>
                                            </h4>
                                        </div>
                                        <div class="col-xs-4 col-sm-4 col-md-4">
                                            <table class="table table-striped" cellspacing="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="font-size: 13px; color: #000000;"><b>Tax: </b></td>
                                                        <td style="text-align: right; padding-right: 20px;color: #000000; font-size: 13px;">
                                                            $<%= tax_amount %></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 13px; color: #000000;"><b>Shipping Cost: </b></td>
                                                        <td style="text-align: right; padding-right: 20px; font-size: 13px;color: #000000;">
                                                            $<%= shipping_cost %></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-size: 13px; color: #000000;"><b>Total: </b></td>
                                                        <td style="text-align: right; padding-right: 20px; font-size: 13px;color: #000000;">
                                                            $<%= grandTotal %></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                    
                                </div>
                            </div>
                        </div>
                        <style type="text/css">
                            body {
                                background: #eee;
                            }
                    
                            .text-danger strong {
                                color: #9f181c;
                            }
                    
                            .receipt-main {
                                background: #ffffff none repeat scroll 0 0;
                                border-top: 12px solid #1677ff;
                                padding: 40px 30px !important;
                                position: relative;
                                box-shadow: 0 1px 21px #acacac;
                                color: #333333;
                                font-family: open sans;
                            }
                    
                            .receipt-main p {
                                color: #333333;
                                font-family: open sans;
                                line-height: 1.42857;
                            }
                    
                            .receipt-left p {
                                color: #333333;
                                font-family: open sans;
                                line-height: 1.42857;
                                padding: 0;
                                margin: 0;
                                font-size: 16px;
                            }
                    
                            .receipt-right p span {
                                font-weight: 600;
                            }
                    
                            .receipt-footer h1 {
                                font-size: 15px;
                                font-weight: 400 !important;
                                margin: 0 !important;
                            }
                    
                            .receipt-main::after {
                                background: #414143 none repeat scroll 0 0;
                                content: "";
                                height: 5px;
                                left: 0;
                                position: absolute;
                                right: 0;
                                top: -13px;
                            }
                    
                            .receipt-main thead {
                                background: #414143 none repeat scroll 0 0;
                            }
                    
                            .receipt-main thead th {
                                color: #fff;
                            }
                    
                            .receipt-right h5 {
                                font-size: 16px;
                                font-weight: bold;
                                margin: 0 0 7px 0;
                            }
                    
                            .receipt-right p {
                                font-size: 16px;
                                margin: 0px;
                            }
                    
                            .receipt-right p i {
                                text-align: center;
                                width: 18px;
                            }
                    
                    
                            .receipt-left2 p {
                                color: #333333;
                                font-family: open sans;
                                line-height: 1.42857;
                                padding: 0;
                                margin: 0;
                                font-size: 16px;
                            }
                    
                            .receipt-left2 p span {
                                font-weight: 600;
                            }
                    
                            .receipt-left2 h5 {
                                font-size: 16px;
                                font-weight: bold;
                                margin: 0 0 7px 0;
                            }
                    
                            .receipt-right2 h5 {
                                font-size: 16px;
                                font-weight: bold;
                                margin: 0 0 7px 0;
                            }
                    
                            .receipt-right2 p {
                                font-size: 16px;
                                margin: 0px;
                            }
                    
                            .receipt-right2 p i {
                                text-align: center;
                                width: 18px;
                            }
                    
                            .custom-data-table>thead {
                                background-color: #1677ff !important;
                                color: #000000 !important;
                                font-size: 12px;
                            }
                    
                            .custom-data-table-two thead {
                                background-color: transparent;
                                color: #000000 !important;
                            }
                    
                            .custom-data-table thead tr th,
                            .custom-data-table-two thead tr th {
                                color: #000000;
                                font-size: 13px;
                            }
                    
                            table.table.custom-data-table tbody tr {
                                border: none !important;
                            }
                    
                            table.table.custom-data-table tbody tr td {
                                border: none;
                                font-size: 13px;
                                color: #000000;
                            }
                    
                            table.table.custom-data-table tbody tr {
                                border-bottom: 1px solid #4c4d4e33 !important;
                                margin-bottom: 5px !important;
                                font-size: 16px !important;
                            }
                    
                    
                    
                    
                            .receipt-main td {
                                padding: 9px 20px !important;
                            }
                    
                            .receipt-main th {
                                padding: 13px 20px !important;
                            }
                    
                            .receipt-main td {
                                font-size: 13px;
                                font-weight: initial !important;
                            }
                    
                            .receipt-main td p:last-child {
                                margin: 0;
                                padding: 0;
                            }
                    
                            .receipt-main td h2 {
                                font-size: 20px;
                                font-weight: 900;
                                margin: 0;
                                text-transform: uppercase;
                            }
                    
                            .receipt-header-mid .receipt-left h1 {
                                font-weight: 100;
                                margin: 34px 0 0;
                                text-align: right;
                                text-transform: uppercase;
                            }
                    
                            .receipt-header-mid {
                                margin: 24px 0;
                                overflow: hidden;
                            }
                    
                            #container {
                                background-color: #dcdcdc;
                            }
                        </style>
                        <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
                        <script type="text/javascript">
                    
                        </script>
                    </body>
                    
                    </html>`

                    singlePO.company_logo = config.get("SERVER_URL").concat("media/email-assets/logo.jpg");
                    const invoice = await generatePDF(id, singlePO, temaplate);

                    // Upload Image to AWS S3
                    const psp_admin_doc_src = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
                    const psp_admin_doc_src_bucketName = psp_admin_doc_src[0]
                    const psp_admin_doc_folder = psp_admin_doc_src.slice(1)
                    const fileUploadS3 = singleFileUploadFromPath({
                        file: join(__dirname, `../../tmp/${invoice}.pdf`),
                        folder: psp_admin_doc_folder,
                        idf: `${po_number}`,
                        fileName: invoice,
                        bucketName: psp_admin_doc_src_bucketName,
                        // delete_file: false
                    });

                    if (invoice && fileUploadS3) {
                        this.insertPOActivity(po_activity_type.INVOICE_UPLOAD, `File Name: ${invoice}.pdf`, id, 10001, 10001, TENANTID);
                        // Setting Up Data for EMAIL SENDER
                        const mailSubject = "Purchase Order Confirmation From Prime Server Parts"
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
                            about: 'A Purchase Order Has Been Confirmed On Primer Server Parts',
                            message: "Thank You For Accepting The Purchase Order, Your Invoice Has Been Attached"
                        }

                        // SENDING EMAIL
                        await Mail(email, mailSubject, mailData, 'purchase-order-confirmation', TENANTID, [{
                            filename: `${invoice}.pdf`,
                            path: join(__dirname, `../../tmp/${invoice}.pdf`)
                        }]);

                        this.insertPOActivity(po_activity_type.PO_ATTACHMENT_SENT, `File Name: ${invoice}.pdf`, id, 10001, 10001, TENANTID);
                    }


                } else if (slug === "vendor_rejected") {
                    this.insertPOActivity(po_activity_type.PO_REJECTED, reason, id, 10001, 10001, TENANTID);
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

            if (!db.purchase_order.hasAlias('contact_person') && !db.purchase_order.hasAlias('contactPersons')) {
                await db.purchase_order.hasOne(db.contact_person,
                    {
                        sourceKey: 'contact_person_id',
                        foreignKey: 'id',
                        constraints: false,
                        scope: {
                            ref_model: 'vendor'
                        },
                        as: "contactPersons"
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

            // PO TO ORDER
            if (!db.purchase_order.hasAlias('order')) {

                await db.purchase_order.hasOne(db.order, {
                    sourceKey: 'order_id',
                    foreignKey: 'id',
                    as: 'order'
                });
            }

            // PO TO ORDER
            if (!db.order.hasAlias('address') && !db.order.hasAlias('shippingAddress')) {

                await db.order.hasOne(db.address, {
                    sourceKey: 'shipping_address_id',
                    foreignKey: 'id',
                    as: 'shippingAddress'
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

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id,
                        po_number,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { vendor_id } = findPO;

            const findPOVendorViewRecord = await db.po_vendor_view_links.findOne({
                where: {
                    [Op.and]: [{
                        po_id: id,
                        vendor_id,
                        status: true,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!findPOVendorViewRecord) return { message: "This PO has been expired!!!", status: false };

            const { expire_date, status } = findPOVendorViewRecord;
            if (!expire_date) return { message: "This PO has been expired!!!", status: false }

            // Time Calculating
            const reqTime = new Date();
            const recordTime = new Date(expire_date);
            // Calculating Minutes
            let minutes = ((recordTime.getTime() - reqTime.getTime()) / 1000) / 60;
            // Difference
            const diffs = Math.round(minutes);
            console.log(diffs)
            // IF Difference Less than or Equal to CONFIG minutes
            if (diffs < 0 || !status) {

                return { message: "This PO has been expired!!!", status: false }

            } else {
                // Single PO 
                const singlePO = await db.purchase_order.findOne({
                    include: [
                        {
                            model: db.vendor,
                            as: 'vendor'
                        },
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
                        {
                            model: db.order,
                            as: 'order',
                            include: {
                                model: db.address,
                                as: 'shippingAddress',
                                include: { model: db.country, as: "countryCode" }
                            }
                        },
                        {
                            model: db.contact_person,
                            as: "contactPersons"
                        }
                    ],
                    where: {
                        [Op.and]: [{
                            id,
                            po_number,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (singlePO.type === "drop_shipping") {
                    singlePO.shipTo = singlePO.order.shippingAddress;
                } else if (singlePO.type === "default") {
                    const companyShippingAddress = await db.address.findOne({
                        include: [
                            { model: db.country, as: "countryCode" }
                        ],
                        where: {
                            [Op.and]: [{
                                ref_model: "company_info",
                                tenant_id: TENANTID,
                                type: "shipping",
                                status: true,
                                isDefault: true
                            }]
                        }
                    });

                    singlePO.shipTo = companyShippingAddress;
                }
                // GET COMPANY BILLING ADDRESS
                const companyBilling = await db.address.findOne({
                    include: [
                        { model: db.country, as: "countryCode" }
                    ],
                    where: {
                        [Op.and]: [{
                            ref_model: "company_info",
                            tenant_id: TENANTID,
                            type: "billing",
                            status: true,
                            isDefault: true
                        }]
                    }
                });
                singlePO.companyBilling = companyBilling;
                singlePO.grandTotal_price = this.poGrandTotal(id, TENANTID);

                // Activity
                this.insertPOActivity(po_activity_type.PO_VIEWED_BY_VENDOR, `PO Viewed`, id, 10001, 10001, TENANTID);

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


            // PO TO STAFF
            if (!db.po_activities.hasAlias('user') && !db.po_activities.hasAlias('activity_by')) {

                await db.po_activities.hasOne(db.user, {
                    sourceKey: 'updated_by',
                    foreignKey: 'id',
                    as: 'activity_by'
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
                    },
                    { model: db.user, as: "activity_by" }
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
                created_by: user.id,
                updated_by: user.id
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

            this.insertPOActivity(po_activity_type.PO_INVOICE_CREATION, `Invoice No: ${invoice_no}, File NameL ${invoiceFileName}`, po_id, user.id, user.id, TENANTID);


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
            this.insertPOActivity(po_activity_type.PO_INVOICE_UPDATE, `Invoice No: ${invoice_no}, File Name: ${invoiceFileName}`, po_id, user.id, user.id, TENANTID);


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
                this.insertPOActivity(po_activity_type.PO_MFG_CREATION, `File Name: ${mfgFileName}`, po_id, user.id, user.id, TENANTID);

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
            const { po_id, invoice_no } = findPOInvoice;

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
            this.insertPOActivity(po_activity_type.PO_INVOICE_DELETE, `Invoice No: ${invoice_no}, File Name: ${findPOInvoice.invoice_file}`, po_id, user.id, user.id, TENANTID);


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

            this.insertPOActivity(po_activity_type.PO_MFG_UPDATE, `File Name: ${mfgDocFileName}`, po_id, user.id, user.id, TENANTID);

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

            this.insertPOActivity(po_activity_type.PO_MFG_DELETED, `File Name: ${findPOMFGDOC.pomfg_file}`, po_id, user.id, user.id, TENANTID);



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
    // Resend PO Link
    resendPOLink: async (req, db, user, isAuth, TENANTID) => {
        const poSendTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { po_id, emails } = req;

            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
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

            const { email } = findVendorEmail;

            await db.po_vendor_view_links.update({
                status: false
            }, {
                where: {
                    [Op.and]: [{
                        po_id,
                        vendor_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            let purchaseOrderIDhashed = crypt(`${po_id}`);
            let ponumberhashed = crypt(`${po_number}`);
            // SET PASSWORD URL
            const viewpoURL = config.get("ECOM_URL").concat(config.get("PO_VIEW"));
            // Setting Up Data for EMAIL SENDER
            const mailSubject = "Resent Purchase Order From Prime Server Parts"
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
                about: 'Your Purchase Order Link Has Been Resent From Primer Server Parts',
                viewpolink: `${viewpoURL}${purchaseOrderIDhashed}/${ponumberhashed}`
            }

            if (emails && emails.length) {
                emails.forEach(async (item) => {
                    // SENDING EMAIL
                    await Mail(item, mailSubject, mailData, 'create-purchase-order', TENANTID);
                    this.insertPOActivity(po_activity_type.PO_ATTACHMENT_SENT, `Email: ${item}`, po_id, user.id, user.id, TENANTID);
                });

            } else {
                // SENDING EMAIL
                await Mail(email, mailSubject, mailData, 'create-purchase-order', TENANTID);
            }

            const vendorPOViewExpire = config.get("VENDOR_PO_VIEW_DAY_EXPIRE");
            let poViewExpireDate = new Date();
            // Record Create
            await db.po_vendor_view_links.create({
                po_id,
                vendor_id,
                status: true,
                expire_date: poViewExpireDate.setDate(poViewExpireDate.getDate() + parseInt(vendorPOViewExpire)),
                tenant_id: TENANTID
            });
            this.insertPOActivity(po_activity_type.PO_RESEND_TO_VENDOR, `Po Link Resent To Vendor`, po_id, user.id, user.id, TENANTID);


            // Commit The query
            await poSendTransaction.commit();
            // Return Formation
            return {
                message: "Purchase Order Link Resent Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            await poSendTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "resendPOLink" });
        }
    },
    // Resend PO Attachment
    resendPOAttachment: async (req, db, user, isAuth, TENANTID) => {
        const poSendTransaction = await db.sequelize.transaction();
        // Try Catch Block
        try {
            // DATA FROM REQUEST
            const { po_id, emails } = req;

            // Single PO 
            const singlePO = await db.purchase_order.findOne({
                // include: [
                //     { model: db.vendor, as: 'vendor' },
                //     { model: db.payment_method, as: 'paymentmethod' },
                //     { model: db.shipping_method, as: 'shippingMethod' },
                //     { model: db.address, as: 'vendorBillingAddress', include: { model: db.country, as: "countryCode" } },
                //     { model: db.address, as: 'vendorShippingAddress', include: { model: db.country, as: "countryCode" } },
                //     { model: db.po_trk_details, as: 'potrkdetails' },
                //     { model: db.po_activities, as: 'poactivitites' },
                //     { model: db.po_invoices, as: 'poinvoices' },
                //     { model: db.po_mfg_doc, as: 'pomfgdoc' },
                //     {
                //         model: db.po_productlist, as: 'poProductlist', // 
                //         include: {
                //             model: db.product,
                //             as: 'product',
                //             include: [
                //                 { model: db.category, as: 'category' },
                //                 { model: db.brand, as: 'brand' }
                //             ]
                //         }
                //     },
                //     {
                //         model: db.user, as: 'POCreated_by',
                //         include: {
                //             model: db.role,
                //             as: 'roles'
                //         }
                //     },
                // ],
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { vendor_id, po_number } = singlePO;
            const findVendorEmail = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        id: vendor_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { email } = findVendorEmail;

            // TEMPLATE FOR NOW
            const temaplate = `<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="utf-8">
                <title>PO Invoice - Prime Server Parts</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
                <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
            </head>

            <body>
                <div class="col-md-12">
                    <div class="row">
                        <div class="receipt-main col-xs-12 col-sm-12 col-md-12">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="receipt-header"
                                        style="border: 1px solid #1677ff;padding: 10px;height: 500px;border-radius: 8px; margin-bottom: 10px;">
                                        <div class="col-xs-6 col-sm-6 col-md-6">
                                            <div class="receipt-left">
                                                <img class="img-responsive" alt="iamgurdeeposahan"
                                                    src=<%= company_logo %>
                                                    style="width: 150px; margin-top: 15px;">

                                                <h5 style="margin-top: 25px; font-weight: 600; font-size: 16px;">Prime Server Parts
                                                </h5>
                                                <p>Nova Street</p>
                                                <p>Nova Street</p>
                                                <p>Colorado, CO - 12356</p>
                                                <p>USA <i class="fa fa-location-arrow"></i></p>

                                            </div>
                                        </div>
                                        <div class="col-xs-6 col-sm-6 col-md-6 text-right">
                                            <div class="receipt-right">
                                                <p style="margin-top: 10px;"><span>Purchase Order:</span> <%= po_number %></p>
                                                <p><span>Date:</span> <%= new Date(updatedAt).toDateString()%></p>

                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                <div class="receipt-header receipt-header-mid">
                                                    <div class="col-xs-8 col-sm-8 col-md-8 text-left">
                                                        <div class="receipt-left2">
                                                            <h5>Issued To</h5>
                                                            <p>Company Name</p>
                                                            <p>Company Contact Person</p>
                                                            <p>Company Email</p>
                                                            <p>0170000000</p>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-4 col-sm-4 col-md-4 text-left">
                                                        <div class="receipt-right2">
                                                            <h5>Ship To</h5>
                                                            <p>Company Address 1</p>
                                                            <p>Company Address 2</p>
                                                            <p>Company State</p>
                                                            <p>Company Country</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-xs-12 col-sm-12 col-md-12" style="margin-top: 30px;">
                                                <div class="col-xs-3 col-sm-3 col-md-3">
                                                    <div class="receipt-right text-center">
                                                        <h5 style="font-weight: 600; font-size: 16px;">Rep</h5>
                                                        <p>Nova Street</p>

                                                    </div>
                                                </div>
                                                <div class="col-xs-3 col-sm-3 col-md-3">
                                                    <div class="receipt-right text-center">
                                                        <h5 style="font-weight: 600; font-size: 16px;">Payment Terms</h5>
                                                        <p>Company Name</p>

                                                    </div>
                                                </div>
                                                <div class="col-xs-3 col-sm-3 col-md-3">
                                                    <div class="receipt-right text-center">
                                                        <h5 style="font-weight: 600; font-size: 16px;">Delivery</h5>
                                                        <p>Company Name</p>

                                                    </div>
                                                </div>
                                                <div class="col-xs-3 col-sm-3 col-md-3">
                                                    <div class="receipt-right text-center">
                                                        <h5 style="font-weight: 600; font-size: 16px;">Tax Rate</h5>
                                                        <p>Company Name</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="row">
                                <div class="col-xs-12 col-sm-12 col-md-12">
                                    <table class="table custom-data-table">
                                        <thead style="background-color: #1677ff !important">
                                            <tr>
                                                <th>Part Number</th>
                                                <th>Description</th>
                                                <th>Unite Price</th>
                                                <th>Quantity</th>
                                                <th style="text-align: right;">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-xs-2 col-sm-2 col-md-2">ASR-123455</td>
                                                <td class="col-xs-5 col-sm-5 col-md-5">Adaptec ASR-78165 PMC SAS/SATA 6Gb/s PCIe x8
                                                    Controller Gen3
                                                </td>
                                                <td class="col-xs-2 col-sm-2 col-md-2">$190.00</td>
                                                <td class="col-xs-1 col-sm-1 col-md-1">1</td>
                                                <td class="col-xs-2 col-sm-2 col-md-2" style="text-align: right;">$380.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-4 col-sm-4 col-md-4 col-md-offset-8 col-sm-offset-8 col-xs-offset-8">
                                    <table class="table custom-data-table-two">
                                        <thead>
                                            <tr>
                                                <th style="color: #000000; text-align: left;">Sub Total</th>
                                                <th style="color: #000000; text-align: right;">$400</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-8 col-sm-8 col-md-8">
                                    <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 20px;">Comment: </h4>
                                    <h4 style="font-size: 16px; font-weight: 600;">Receiving Instruction: </h4>
                                </div>
                                <div class="col-xs-4 col-sm-4 col-md-4">
                                    <table class="table table-striped" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 13px; color: #000000;"><b>Tax: </b></td>
                                                <td style="text-align: right; padding-right: 20px;color: #000000; font-size: 13px;">
                                                    $50.00</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 13px; color: #000000;"><b>Shipping Cost: </b></td>
                                                <td style="text-align: right; padding-right: 20px; font-size: 13px;color: #000000;">
                                                    $50.00</td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 13px; color: #000000;"><b>Total: </b></td>
                                                <td style="text-align: right; padding-right: 20px; font-size: 13px;color: #000000;">
                                                    $680.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <style type="text/css">
                    body {
                        background: #eee;
                    }

                    .text-danger strong {
                        color: #9f181c;
                    }

                    .receipt-main {
                        background: #ffffff none repeat scroll 0 0;
                        border-top: 12px solid #1677ff;
                        padding: 40px 30px !important;
                        position: relative;
                        box-shadow: 0 1px 21px #acacac;
                        color: #333333;
                        font-family: open sans;
                    }

                    .receipt-main p {
                        color: #333333;
                        font-family: open sans;
                        line-height: 1.42857;
                    }

                    .receipt-left p {
                        color: #333333;
                        font-family: open sans;
                        line-height: 1.42857;
                        padding: 0;
                        margin: 0;
                        font-size: 16px;
                    }

                    .receipt-right p span {
                        font-weight: 600;
                    }

                    .receipt-footer h1 {
                        font-size: 15px;
                        font-weight: 400 !important;
                        margin: 0 !important;
                    }

                    .receipt-main::after {
                        background: #414143 none repeat scroll 0 0;
                        content: "";
                        height: 5px;
                        left: 0;
                        position: absolute;
                        right: 0;
                        top: -13px;
                    }

                    .receipt-main thead {
                        background: #414143 none repeat scroll 0 0;
                    }

                    .receipt-main thead th {
                        color: #fff;
                    }

                    .receipt-right h5 {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 0 0 7px 0;
                    }

                    .receipt-right p {
                        font-size: 16px;
                        margin: 0px;
                    }

                    .receipt-right p i {
                        text-align: center;
                        width: 18px;
                    }


                    .receipt-left2 p {
                        color: #333333;
                        font-family: open sans;
                        line-height: 1.42857;
                        padding: 0;
                        margin: 0;
                        font-size: 16px;
                    }

                    .receipt-left2 p span {
                        font-weight: 600;
                    }

                    .receipt-left2 h5 {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 0 0 7px 0;
                    }

                    .receipt-right2 h5 {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 0 0 7px 0;
                    }

                    .receipt-right2 p {
                        font-size: 16px;
                        margin: 0px;
                    }

                    .receipt-right2 p i {
                        text-align: center;
                        width: 18px;
                    }

                    .custom-data-table>thead {
                        background-color: #1677ff !important;
                        color: #000000 !important;
                        font-size: 12px;
                    }

                    .custom-data-table-two thead {
                        background-color: transparent;
                        color: #000000 !important;
                    }

                    .custom-data-table thead tr th,
                    .custom-data-table-two thead tr th {
                        color: #000000;
                        font-size: 13px;
                    }

                    table.table.custom-data-table tbody tr {
                        border: none !important;
                    }

                    table.table.custom-data-table tbody tr td {
                        border: none;
                        font-size: 13px;
                        color: #000000;
                    }

                    table.table.custom-data-table tbody tr {
                        border-bottom: 1px solid #4c4d4e33 !important;
                        margin-bottom: 5px !important;
                        font-size: 16px !important;
                    }




                    .receipt-main td {
                        padding: 9px 20px !important;
                    }

                    .receipt-main th {
                        padding: 13px 20px !important;
                    }

                    .receipt-main td {
                        font-size: 13px;
                        font-weight: initial !important;
                    }

                    .receipt-main td p:last-child {
                        margin: 0;
                        padding: 0;
                    }

                    .receipt-main td h2 {
                        font-size: 20px;
                        font-weight: 900;
                        margin: 0;
                        text-transform: uppercase;
                    }

                    .receipt-header-mid .receipt-left h1 {
                        font-weight: 100;
                        margin: 34px 0 0;
                        text-align: right;
                        text-transform: uppercase;
                    }

                    .receipt-header-mid {
                        margin: 24px 0;
                        overflow: hidden;
                    }

                    #container {
                        background-color: #dcdcdc;
                    }
                </style>
                <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
                <script type="text/javascript">

                </script>
            </body>

            </html>`

            singlePO.company_logo = config.get("SERVER_URL").concat("media/email-assets/logo.jpg");
            const invoice = await generatePDF(po_id, singlePO, temaplate);

            // Upload Image to AWS S3
            const psp_admin_doc_src = config.get("AWS.PSP_ADMIN_DOC_PO_SRC").split("/")
            const psp_admin_doc_src_bucketName = psp_admin_doc_src[0]
            const psp_admin_doc_folder = psp_admin_doc_src.slice(1)
            const fileUploadS3 = singleFileUploadFromPath({
                file: join(__dirname, `../../tmp/${invoice}.pdf`),
                folder: psp_admin_doc_folder,
                idf: `${po_number}`,
                fileName: invoice,
                bucketName: psp_admin_doc_src_bucketName,
                // delete_file: false
            });



            if (invoice && fileUploadS3) {
                this.insertPOActivity(po_activity_type.INVOICE_UPLOAD, `File Name: ${invoice}.pdf`, po_id, user.id, user.id, TENANTID);
                // Setting Up Data for EMAIL SENDER
                const mailSubject = "Purchase Order Invoice From Prime Server Parts"
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
                    about: 'Your Purchase Order Invoice From Primer Server Parts',
                    message: "Your PO Invoice Has Been Attached Please Check and If You Have Any Queries Please Let Us Know."
                }

                if (emails && emails.length) {
                    emails.forEach(async (item) => {
                        // SENDING EMAIL
                        await Mail(item, mailSubject, mailData, 'purchase-order-confirmation', TENANTID, [{
                            filename: `${invoice}.pdf`,
                            path: join(__dirname, `../../tmp/${invoice}.pdf`)
                        }]);

                        this.insertPOActivity(po_activity_type.PO_ATTACHMENT_SENT, `Email: ${item}`, po_id, user.id, user.id, TENANTID);
                    });

                } else {
                    // SENDING EMAIL
                    await Mail(email, mailSubject, mailData, 'purchase-order-confirmation', TENANTID, [{
                        filename: `${invoice}.pdf`,
                        path: join(__dirname, `../../tmp/${invoice}.pdf`)
                    }]);
                }

                this.insertPOActivity(po_activity_type.PO_ATTACHMENT_SENT, `File Name: ${invoice}.pdf`, po_id, user.id, user.id, TENANTID);
            }


            // Return Formation
            return {
                message: "Purchase Order Attachment Resent Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            await poSendTransaction.rollback();
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', muation: "resendPOAttachment" });
        }
    },
    // Create PO Comment
    createPOComment: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id, comment } = req;
            // 
            const addPOComment = await db.purchase_order.update({
                comment,
                updated_by: user.id
            }, {
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (addPOComment) {
                // Activity
                this.insertPOActivity(po_activity_type.ADD_COMMENT, `PO Updated By A Comment`, po_id, user.id, user.id, TENANTID);

            } else {
                // Activity
                this.insertPOActivity(po_activity_type.FAILURE_PO, `PO Comment Update Failed`, po_id, user.id, user.id, TENANTID);
                return { message: "Comment Update Failed!!!", status: false }
            }

            // Return Formation
            return {
                message: "PO Comment Inserted Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPOActivity" });
        }
    },
    // Request Tracking
    requestTracking: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { po_id } = req;
            // 
            const findPO = await db.purchase_order.findOne({
                where: {
                    [Op.and]: [{
                        id: po_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            const { po_number, vendor_id } = findPO;

            const findVendorEmail = await db.vendor.findOne({
                where: {
                    [Op.and]: [{
                        id: vendor_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            const { email } = findVendorEmail;


            if (findPO && findVendorEmail) {

                // Setting Up Data for EMAIL SENDER
                const mailSubject = "Tracking Number Request From Prime Server Parts"
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
                    about: 'Request Tracking From Primer Server Parts',
                    message: `Please send the shipping tracking number(s) for this ${po_number}`
                }

                // SENDING EMAIL
                await Mail(email, mailSubject, mailData, 'purchase-order-request-tracking', TENANTID, []);

                this.insertPOActivity(po_activity_type.TRACKING_REQUEST, `PO Tracking Requested`, po_id, user.id, user.id, TENANTID);

            } else {
                this.insertPOActivity(po_activity_type.FAILED_REQUEST, `PO Tracking Request Failed`, po_id, user.id, user.id, TENANTID);
                return { message: "Tracking Request Failed!!!", status: false }
            }


            // Return Formation
            return {
                message: "Tracking Request Sent Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
            logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "createPOActivity" });
        }
    },
}

// PO ACTIVITY MODULE
exports.insertPOActivity = async (actionType, comment, po_id, created_by, updated_by, tenant_id) => {
    // Create PO TRK Details
    try {
        await db.po_activities.create({
            po_id,
            comment: comment,
            action_type: actionType,
            tenant_id,
            created_by,
            updated_by
        });

    } catch (error) {
        console.error(error);
        logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "insertPOActivity" });
    }
}

// PO Grand Total Calculation
exports.poGrandTotal = async (po_id, tenant_id) => {
    // 
    try {
        const totalProductPrice = await db.po_productlist.sum('totalPrice', {
            where: {
                [Op.and]: [{
                    purchase_order_id: po_id,
                    tenant_id
                }]
            }
        });
        const sum = sequelize.literal(`"tax_amount" + "shipping_cost"`);
        const costResult = await db.purchase_order.findOne({
            attributes: [
                [sum, 'sum'],
            ],
            where: {
                [Op.and]: [{
                    id: po_id,
                    tenant_id
                }]
            }
        });
        const cost = costResult.get('sum');
        let grandTotal_price = parseInt(cost) + totalProductPrice;
        return grandTotal_price;

    } catch (error) {
        console.error(error);
        logger.crit("crit", error, { service: 'purchaseOrderHelper.js', mutation: "poGrandTotal" });
    }
}
