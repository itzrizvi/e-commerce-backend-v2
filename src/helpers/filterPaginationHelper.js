// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


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
                maxPrice,
                brand_slug,
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


            // Filter and Paginate Products
            const filteredPaginatedProducts = await db.product.findAll({
                include: [{
                    ...(brand_slug && {
                        model: db.brand, as: 'brand'
                    }),
                    ...(category_slug && {
                        model: db.category, as: 'category'
                    })
                },
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
                }],
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



            // Extract Filtered Products
            let data = [];
            await filteredPaginatedProducts.forEach(async (product) => {
                if (brand_slug || category_slug) {
                    if (product.brand && product.brand.brand_slug === brand_slug) {

                        if (!data.includes(product)) {
                            await data.push(product);
                        }
                    }
                    if (product.category && product.category.cat_slug === category_slug) {

                        if (!data.includes(product)) {
                            await data.push(product);
                        }
                    }
                }

            });


            // Pagination Related Calculation
            const pageQuery = parseInt(pageNumber); // starts from 0
            const sizeQuery = parseInt(perPage) || 40;
            const count = data.length;
            const startIndex = (pageQuery - 1) * sizeQuery;
            const endIndex = pageQuery * sizeQuery;
            const mainData = await data.slice(startIndex, endIndex);
            const totalPage = Math.ceil(count / perPage)

            // Return Formation
            return {
                totalCount: count,
                pageNumber: pageQuery,
                totalPage,
                hasNextPage: totalPage > pageQuery ? true : false,
                hasPreviousPage: (pageQuery <= totalPage) && pageQuery > 1 ? true : false,
                perPage,
                data: mainData
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },

}