// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { multipleFileUpload } = require("../utils/fileUpload");
const config = require('config');


// Order HELPER
module.exports = {
    // Add Order Status API
    addOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, description, status } = req;

            // Order Status Slug
            const slug = slugify(`${name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const findOrderStatus = await db.order_status.findOne({
                where: {
                    [Op.and]: [{
                        slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (findOrderStatus) return { message: "Already Have This Order Status!!!!", status: false }

            // Add Payment Method TO DB
            const insertOrderStatus = await db.order_status.create({
                name,
                slug,
                description,
                status,
                tenant_id: TENANTID,
                created_by: user.id
            });

            // Return Formation
            if (insertOrderStatus) {
                return {
                    message: "Order Status Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update Order Status API
    updateOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id, name, description, status } = req;

            // If name also updated
            let slug
            if (name) {
                // Order Status Slug
                slug = slugify(`${name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check Existence
                const checkExist = await db.order_status.findOne({
                    where: {
                        [Op.and]: [{
                            slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id
                        }]
                    }
                });

                if (checkExist) return { message: "Already Have This Order Status!!!", status: false };
            }


            // Update Doc 
            const updateDoc = {
                name,
                slug,
                description,
                status,
                updated_by: user.id
            }

            // Update Order Status
            const updateorderstatus = await db.order_status.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Return Formation
            if (updateorderstatus) {
                return {
                    message: "Order Status Updated Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Single Order Status API
    getSingleOrderStatus: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { orderstatus_id } = req;

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.order_status.hasAlias('user') && !db.order_status.hasAlias('added_by')) {

                await db.order_status.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET SINGLE ORDER STATUS
            const getorderstatus = await db.order_status.findOne({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Order Status
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        id: orderstatus_id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Order Status Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatus
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Order Status List Admin
    getOrderStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.order_status.hasAlias('user') && !db.order_status.hasAlias('added_by')) {

                await db.order_status.hasOne(db.user, {
                    sourceKey: 'created_by',
                    foreignKey: 'id',
                    as: 'added_by'
                });
            }

            // GET ORDER STATUS List
            const getorderstatuslist = await db.order_status.findAll({
                include: [
                    {
                        model: db.user, as: 'added_by', // Include User who created this Order Status
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


            return {
                message: "GET Order Status List For Admin Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatuslist
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Order Status List PUBLIC
    getPublicOrderStatusList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // GET ORDER STATUS List
            const getorderstatuslist = await db.order_status.findAll({
                where: {
                    [Op.and]: [{
                        status: true,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Order Status List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getorderstatuslist
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Add Order Status API
    createOrderByCustomer: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { cart_id,
                tax_exempt,
                payment_id,//
                coupon_id,//
                order_status_id,//
                billing_address_id,//
                shipping_address_id,//
                taxexempt_file } = req;

            const shipping_cost = 50; // TODO ->> IT WILL CHANGE 

            // GET Product Details For The Order
            if (!db.cart.hasAlias("cart_items")) {
                await db.cart.hasMany(db.cart_item, {
                    foreignKey: "cart_id",
                });
            }

            if (!db.cart_item.hasAlias("product")) {
                await db.cart_item.hasOne(db.product, {
                    sourceKey: "product_id",
                    foreignKey: "id",
                });
            }
            //
            const cartWithProductsAndQuantities = await db.cart.findOne({
                include: [{
                    model: db.cart_item,
                    include: {
                        model: db.product
                    }
                }],
                where: {
                    [Op.and]: [{
                        id: cart_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            if (!cartWithProductsAndQuantities) return { message: "Couldn't Found The Cart Details!!!", status: false }

            //
            let cartItems = cartWithProductsAndQuantities.cart_items;
            let sub_total = 0; // sub_total
            let totalQuantity = 0;
            //
            const orderItems = [];
            cartItems.forEach(async (item) => {

                if (item.product.prod_sale_price != 0) {
                    const calculateTotal = item.product.prod_sale_price * item.quantity;
                    sub_total += calculateTotal;
                    totalQuantity += item.quantity;

                    //
                    await orderItems.push({ product_id: item.product.id, price: item.product.prod_sale_price, quantity: item.quantity, created_by: user.id, tenant_id: TENANTID })
                } else {
                    const calculateTotal = item.product.prod_regular_price * item.quantity;
                    sub_total += calculateTotal;
                    totalQuantity += item.quantity;

                    //
                    await orderItems.push({ product_id: item.product.id, price: item.product.prod_regular_price, quantity: item.quantity, created_by: user.id, tenant_id: TENANTID })
                }
            });

            //
            let discount_amount; // discount amount
            if (coupon_id) {
                //
                const getCouponDetails = await db.coupon.findOne({
                    where: {
                        [Op.and]: [{
                            id: coupon_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                //
                const { coupon_type,
                    coupon_amount,
                    coupon_maxamount,
                    coupon_minamount,
                    coupon_startdate,
                    coupon_enddate } = getCouponDetails;

                if (new Date() < new Date(coupon_enddate) && new Date(coupon_startdate) < new Date()) {

                    if (coupon_maxamount >= totalQuantity && coupon_minamount <= totalQuantity) {

                        if (coupon_type === 'percentage') {

                            discount_amount = (sub_total * coupon_amount) / 100;

                        } else if (coupon_type === 'flat') {
                            discount_amount = coupon_amount;
                        }

                    } else {
                        return {
                            message: "Coupon Doesn't Meet the Order Quantity Limit!!!",
                            status: false,
                            tenant_id: TENANTID
                        }
                    }

                } else {
                    return {
                        message: "Coupon Expired or In-Valid Coupon!!!",
                        status: false,
                        tenant_id: TENANTID
                    }
                }
            }

            // 
            // Calculate Total
            let total = (sub_total + shipping_cost) - discount_amount;
            let tax_amount;
            if (!tax_exempt) {

                const getZipCode = await db.address.findOne({
                    where: {
                        [Op.and]: [{
                            id: shipping_address_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!getZipCode) return { message: "Address Not Found!!!", status: false }
                const { zip_code } = getZipCode;

                //
                const findTaxClass = await db.tax_class.findOne({
                    where: {
                        [Op.and]: [{
                            zip_code,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (!findTaxClass) return { message: "Zip Code Not Found!!!", status: false }

                const { tax_amount: taxamount } = findTaxClass;

                tax_amount = taxamount;
                total += tax_amount;
            } else if (tax_exempt && !taxexempt_file) {
                return { message: "Tax Exempt Certificates Required!!!", status: false }
            }


            // Insert Order
            const insertOrder = await db.order.create({
                customer_id: user.id,
                payment_id,
                total,
                sub_total,
                shipping_cost,
                discount_amount,
                tax_amount,
                coupon_id,
                order_status_id,
                shipping_address_id,
                tax_exempt,
                created_by: user.id,
                tenant_id: TENANTID
            });
            if (!insertOrder) return { message: "Order Coulnd't Placed!!!", status: false }

            //
            if (tax_exempt) {
                // Upload Tax Exempt Files
                let taxExemptFiles = [];
                // Upload Tax Exempt Files to AWS S3
                const order_tax_exempt_file_src = config.get("AWS.ORDER_TAX_EXEMPT_FILE_SRC").split("/")
                const order_tax_exempt_file_bucketName = order_tax_exempt_file_src[0];
                const order_tax_exempt_folder = order_tax_exempt_file_src.slice(1).join("/");
                const fileUrl = await multipleFileUpload({ file: taxexempt_file, idf: insertOrder.id, folder: order_tax_exempt_folder, fileName: insertOrder.id, bucketName: order_tax_exempt_file_bucketName });
                if (!fileUrl) return { message: "Tax Exempt Certificates Couldnt Uploaded Properly!!!", status: false };

                // Assign Values To Tax Exempt File Array For Bulk Create
                fileUrl.forEach(async (taxFile) => {
                    await taxExemptFiles.push({ file_name: taxFile.upload.Key.split('/').slice(-1)[0], order_id: insertOrder.id, tenant_id: TENANTID, created_by: user.id });
                });

                // If Tax File Array Created Successfully then Bulk Create In Tax Exempt Table
                if (taxExemptFiles && taxExemptFiles.length > 0) {
                    // Tax File Exempts Save Bulk
                    const taxExemptFilesSave = await db.tax_exempt.bulkCreate(taxExemptFiles);
                    if (!taxExemptFilesSave) return { message: "Tax Exempt Files Save Failed!!!", status: false }
                }

            }

            //
            orderItems.forEach(async (item) => {
                item.order_id = insertOrder.id
            });


            // Insert Payment 
            const insertPayment = await db.payment.create({
                order_id: insertOrder.id,
                billing_address_id,
                amount: total,
                provider_id: payment_id,
                status: "Pending", // TODO HAVE TO CHANGE
                created_by: user.id,
                tenant_id: TENANTID
            });
            if (!insertPayment) return { message: "Payment Details Insert Failed!!!", status: false }

            //
            if (orderItems) {
                const createOrderItem = await db.order_item.bulkCreate(orderItems);
                if (!createOrderItem) return { message: "Order Items Insert Failed", status: false };
            }

            // DELETE CART AND CART ITEMS
            db.cart_item.destroy({
                where: {
                    [Op.and]: [{
                        cart_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            // DELETE CART AND CART ITEMS
            db.cart.destroy({
                where: {
                    [Op.and]: [{
                        id: cart_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Formation
            return {
                message: "Successfully Placed The Order!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}