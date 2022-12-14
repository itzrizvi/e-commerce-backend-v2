const { Op } = require("sequelize");
const logger = require("../../logger");

// Rating HELPER
module.exports = {
    // CREATE Rating API
    createRating: async (req, db, user, isAuth, TENANTID) => {

        // Auth Check
        if (!isAuth) return { message: "Not Authorized", status: false };

        try {
            // GET DATA
            const { product_id, rating, description } = req;

            // Order and Order Items
            if (!db.order.hasAlias("order_item") && !db.order.hasAlias("orderitems")) {
                await db.order.hasMany(db.order_item, {
                    foreignKey: "order_id",
                    as: 'orderitems'
                });
            }
            // Check Order Item To See this User 
            const checkOrders = await db.order.findAll({
                include: {
                    model: db.order_item, // Order Items and Products
                    as: 'orderitems',
                },
                where: {
                    [Op.and]: [{
                        customer_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // User Order Items
            const orderItems = [];

            // 
            await checkOrders.forEach(async (order) => {
                order.orderitems.forEach(async (item) => {
                    await orderItems.push(item);
                });
            });

            //
            const checkOrderItems = await orderItems.find((item) => parseInt(item.product_id) === product_id);

            if (checkOrderItems) {

                const orderID = checkOrderItems.order_id;
                // Order and Order Status
                if (!db.order.hasAlias("order_status") && !db.order.hasAlias("orderstatus")) {
                    await db.order.hasOne(db.order_status, {
                        sourceKey: "order_status_id",
                        foreignKey: "id",
                        as: 'orderstatus'
                    });
                }

                // Check order Status
                const checkOrderStatus = await db.order.findOne({
                    include: [
                        { model: db.order_status, as: "orderstatus" }
                    ],
                    where: {
                        [Op.and]: [{
                            id: orderID,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // If Product Is Delivered Then User Can Rate
                if (checkOrderStatus.orderstatus.slug === "delivered") {

                    // Check The Rating Is Already given or Not
                    const checkRatingExist = await db.rating.findOne({
                        where: {
                            [Op.and]: [{
                                product_id: product_id,
                                user_id: user.id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    if (checkRatingExist) return { message: "Rating already given!", status: false }


                    // Check The Product Exist or Not
                    const checkProductExist = await db.product.findOne({
                        where: {
                            [Op.and]: [{
                                id: product_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });

                    if (!checkProductExist) return { message: "Product not exist!", status: false }

                    const createRating = await db.rating.create({
                        user_id: user.id,
                        product_id,
                        rating_description: description,
                        rating,
                        tenant_id: TENANTID
                    });

                    if (createRating) {
                        return {
                            tenant_id: createRating.tenant_id,
                            message: "Successfully Rated The Product!!!",
                            status: true
                        }
                    }

                } else {
                    return {
                        message: "You Cannot Rate The Product Before You Consume It!!!",
                        tenant_id: TENANTID,
                        status: false
                    }
                }


            } else {
                return {
                    message: "You Cannot Rate This Product!!!",
                    tenant_id: TENANTID,
                    status: false
                }
            }



        } catch (error) {
            logger.crit("crit", error, { service: 'ratingHelper.js', operation: "createRating - mutation" });
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }

    },
    getAllRatingByUser: async (db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET ALL Rating

            // Find All Roles With permissions
            const findAllRating = await db.rating.findAll({
                where: {
                    tenant_id: TENANTID,
                    user_id: user.id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findAllRating,
                message: "All Rating Get Successfully by User ID!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    getAllRatingByProduct: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET ALL Rating
            // GET DATA
            const { product_id } = req;

            // Check If Has Alias with Users and Order
            if (!db.rating.hasAlias('user') && !db.rating.hasAlias('ratedBy')) {

                await db.rating.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'ratedBy'
                });
            }

            // Find All Roles With permissions
            const findAllRating = await db.rating.findAll({
                include: [
                    { model: db.user, as: 'ratedBy' }, // User as customer
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        product_id: product_id
                    }]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            // Return Formation
            return {
                data: findAllRating,
                message: "All Rating Get Successfully by Product ID!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    getSingleRating: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // GET Rating
            // GET DATA
            const { rating_id } = req;

            // Find All Roles With permissions
            const findRating = await db.rating.findOne({
                where: {
                    tenant_id: TENANTID,
                    id: rating_id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: findRating,
                message: "Single Rating Get Successfully!!!",
                status: true
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    getTopRatedProducts: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // Check If Has Alias with Users and Order
            if (!db.rating.hasAlias('product') && !db.rating.hasAlias('ratedProducts')) {

                await db.rating.hasMany(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'ratedProducts'
                });
            }

            // Product Attributes Table Association with Product
            if (!db.product.hasAlias('product_attributes') && !db.product.hasAlias('prod_attributes')) {

                await db.product.hasMany(db.product_attribute, {
                    foreignKey: 'prod_id',
                    as: 'prod_attributes'
                });
            }
            if (!db.product_attribute.hasAlias('attributes') && !db.product_attribute.hasAlias('attribute_data')) {

                await db.product_attribute.hasOne(db.attribute, {
                    sourceKey: 'attribute_id',
                    foreignKey: 'id',
                    as: 'attribute_data'
                });
            }

            // Association with Attribute Group and Attributes
            if (!db.attribute.hasAlias('attr_groups') && !db.attribute.hasAlias('attribute_group')) {
                await db.attribute.hasOne(db.attr_group, {
                    sourceKey: 'attr_group_id',
                    foreignKey: 'id',
                    as: 'attribute_group'
                });
            }

            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

            // Find All Roles With permissions
            const findAllTopRatings = await db.rating.findAll({
                include: [
                    {
                        model: db.product, as: 'ratedProducts',
                        limit: 20,
                        include: {
                            model: db.product_attribute, as: 'prod_attributes', // Include Product Attributes along with Attributes and Attributes Group
                            include: {
                                model: db.attribute,
                                as: 'attribute_data',
                                include: {
                                    model: db.attr_group,
                                    as: 'attribute_group'
                                }
                            }
                        },
                        include: { model: db.category, as: 'category' }
                    },
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        rating: {
                            [Op.gt]: 3
                        }
                    }]
                },
                order: [
                    ['rating', 'DESC']
                ],
            });


            // Top Rated Products Array
            let topRatedProducts = [];
            findAllTopRatings.forEach(async (element) => {
                await element.ratedProducts.forEach(async (product) => {
                    await topRatedProducts.push(product)
                });
            });


            // Return Formation
            return {
                data: topRatedProducts,
                message: "GET All Top Rated Products!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET RATING BY CUSTOMER ID
    getRatingsByUserID: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request
            const { user_id } = req;

            // Check If Has Alias with Users and Order
            if (!db.rating.hasAlias('user') && !db.rating.hasAlias('ratedBy')) {

                await db.rating.hasOne(db.user, {
                    sourceKey: 'user_id',
                    foreignKey: 'id',
                    as: 'ratedBy'
                });
            }

            // Check If Has Alias with Users and Order
            if (!db.rating.hasAlias('product')) {

                await db.rating.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            // Find All Roles With permissions
            const ratingByUserID = await db.rating.findAll({
                include: [
                    { model: db.user, as: "ratedBy" },
                    { model: db.product, as: "product" },
                ],
                where: {
                    user_id,
                    tenant_id: TENANTID,
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            // Return Formation
            return {
                data: ratingByUserID,
                message: "Ratings By User ID Get Success!!!",
                status: true
            }

        } catch (error) {
            logger.crit("crit", error, { service: 'ratingHelper.js', operation: "getRatingsByUserID - query" });
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}