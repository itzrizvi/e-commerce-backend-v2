// All Requires
const { Op } = require("sequelize");


// Filter Pagination HELPER
module.exports = {
    // GET Product By Filter Pagination Helper
    getFilterPaginatedProducts: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { sortingType,
                perPage,
                pageNumber,
                minPrice,
                conditions,
                maxPrice,
                minRating,
                maxRating,
                brand_slug,
                brandIds,
                category_slug,
                searchQuery } = req;

            // Sorting Order Variable SET
            let sortingOrder;
            let orderType;
            switch (sortingType) {
                case "LowToHigh":
                    sortingOrder = "prod_regular_price";
                    orderType = "ASC";
                    break;
                case 'HighToLow':
                    sortingOrder = "prod_regular_price";
                    orderType = "DESC";
                    break;
                case 'latest':
                    sortingOrder = "createdAt";
                    orderType = "DESC";
                    break;
                default:
                    sortingOrder = "prod_slug";
                    orderType = "ASC";
            }


            // If Brand Slug Available
            // Check If Has Alias
            if (!db.product.hasAlias('brand')) {
                await db.product.hasOne(db.brand, {
                    sourceKey: 'brand_id',
                    foreignKey: 'id',
                    as: 'brand'
                });
            }

            // Check If Has Alias
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {
                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

            // If Category Slug Available
            // Check If Has Alias
            if (!db.product.hasAlias('category')) {
                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
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

            // Check If Has Alias
            if (!db.product.hasAlias('rating') && !db.product.hasAlias('ratings')) {
                await db.product.hasMany(db.rating, {
                    sourceKey: 'id',
                    foreignKey: 'product_id',
                    as: 'ratings'
                });
            }
            // Condtionally Accociates
            const conditionWhere = conditions && conditions.length ? { id: conditions } : {};
            // Filter and Paginate Products
            const filteredPaginatedProducts = await db.product.findAll({
                include: [
                    {
                        model: db.brand, 
                        as: 'brand',
                        ...(brandIds && brandIds.length && {
                            where: {
                              id: {
                                [Op.in]: brandIds
                              }
                            }
                          })
                    },
                    {
                        model: db.category, as: 'category'
                    },
                    {
                        model: db.rating, as: 'ratings'
                    },
                    {
                        model: db.product_condition,
                        as: 'condition',
                        where: conditionWhere
                    }, // Include Product Condition
                    {
                        model: db.product_attribute, as: 'prod_attributes', // Include Product Attributes along with Attributes and Attributes Group
                        include: {
                            model: db.attribute,
                            as: 'attribute_data',
                            include: {
                                model: db.attr_group,
                                as: 'attribute_group'
                            }
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        prod_status: true,
                        prod_regular_price: {
                            [Op.and]: [{
                                [Op.gte]: minPrice ?? 0,
                                [Op.lte]: maxPrice
                            }]
                        }
                    }],
                    ...(searchQuery && { // TODO -> NEED CONFIRMATION
                        prod_slug: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    }),
                },
                order: [
                    [sortingOrder, orderType]
                ]
            });

            if (conditions) {
                // Condition Assign
                await filteredPaginatedProducts.forEach(async (item) => {
                    if (item.condition) {
                        item.prod_condition = item.condition.name
                    } else {
                        item.prod_condition = 'N/A'
                    }
                });
            }

            // Extract Filtered Products
            let data = [];
            await filteredPaginatedProducts.forEach(async (product) => {
                if (brand_slug && category_slug) {
                    if (product.brand && product.category) {
                        if (product.brand.brand_slug === brand_slug && product.category.cat_slug === category_slug) {
                            if (!data.includes(product)) {
                                await data.push(product);
                            }
                        }
                    }


                } else if (brand_slug && !category_slug) {

                    if (product.brand) {
                        if (product.brand.brand_slug === brand_slug) {
                            if (!data.includes(product)) {
                                await data.push(product);
                            }
                        }
                    }

                } else if (category_slug && !brand_slug) {

                    if (product.category && product.category.cat_slug === category_slug) {

                        if (!data.includes(product)) {
                            await data.push(product);
                        }
                    }

                } else {
                    data.push(product)
                }

            });

            // Count Average Rating and Rating Count
            await data.forEach(async (item) => {

                if (item.ratings && item.ratings.length > 0) {
                    const totalRating = item.ratings.length;
                    let allRatings = 0;

                    await item.ratings.forEach(async (rate) => {
                        allRatings += rate.rating;
                    });

                    const overallRating = allRatings / totalRating;

                    item.overallRating = overallRating;
                    item.totalRating = totalRating;
                } else {
                    item.overallRating = 0;
                    item.totalRating = 0;
                }
            });


            //  Filter For Rating
            let filteredData = [];
            await data.forEach(async (item) => {
                if (minRating >= 0 && maxRating <= 5) {
                    if (item.overallRating >= minRating && item.overallRating <= maxRating) {
                        await filteredData.push(item)
                    }
                }
            });

            // Category Parents
            let getCategories = null;
            if (category_slug) {

                // Check If Has Alias with Parent
                if (!db.category.hasAlias('category') && !db.category.hasAlias('parentCategory')) {
                    await db.category.hasOne(db.category, {
                        sourceKey: 'cat_parent_id',
                        foreignKey: 'id',
                        as: 'parentCategory'
                    });
                }

                getCategories = await db.category.findOne({
                    include: [
                        {
                            model: db.category, as: "parentCategory",
                            include: { model: db.category, as: "parentCategory" }
                        }
                    ],
                    where: {
                        [Op.and]: [{
                            cat_slug: category_slug,
                            tenant_id: TENANTID
                        }]
                    },
                });

            }


            // Pagination Related Calculation
            const pageQuery = parseInt(pageNumber); // starts from 0
            const sizeQuery = parseInt(perPage) || 40;
            const count = filteredData.length;
            const startIndex = (pageQuery - 1) * sizeQuery;
            const endIndex = pageQuery * sizeQuery;
            const mainData = await filteredData.slice(startIndex, endIndex);
            const totalPage = Math.ceil(count / perPage)

            // Return Formation
            return {
                status: true,
                totalCount: count,
                pageNumber: pageQuery,
                totalPage,
                hasNextPage: totalPage > pageQuery ? true : false,
                hasPreviousPage: (pageQuery <= totalPage) && pageQuery > 1 ? true : false,
                perPage,
                breadCrumbs: getCategories,
                data: mainData
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}