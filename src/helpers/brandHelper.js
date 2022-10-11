// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// BRAND HELPER
module.exports = {
    // Create Brand HELPER ->>>>>> TODO ADD IMAGE
    createBrand: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Req
            const { brandName, brandDescription, brandStatus, brandSortOrder, categories } = req;

            // Slugify Brand Name
            const brand_slug = slugify(`${brandName}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Brand
            const checkExistence = await db.brands.findOne({
                where: {
                    [Op.and]: [{
                        brand_slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            // If Found Brand
            if (checkExistence) return { message: "Already Have This Brand!!!", status: false };

            // Create Brand
            const createBrand = await db.brands.create({
                brand_name: brandName,
                brand_slug,
                brand_description: brandDescription,
                image_key: "100001",
                image_ext: ".png",
                image_folder: 'thumbnail',
                brand_status: brandStatus,
                brand_sort_order: brandSortOrder,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createBrand) return { message: "Couldnt Created The Brand", status: false };

            // Loop For Assign Other Values to Brand Categories
            categories.forEach(element => {
                element.tenant_id = createBrand.tenant_id;
                element.brand_uuid = createBrand.brand_uuid;
            });

            // Brand Categories Save Bulk
            const brandCategoriesDataSave = await db.brand_categories.bulkCreate(categories);
            if (!brandCategoriesDataSave) return { message: "Brand Categories Data Save Failed", status: false };


            // Return Formation
            return {
                message: "Successfully Created Brand With Categories!!",
                tenant_id: createBrand.tenant_id,
                status: true
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET ALL BRANDS
    getAllBrands: async (db, user, isAuth, TENANTID) => {
        // TRY CATCH BLOCK
        try {

            // Associations MANY TO MANY
            db.brands.belongsToMany(db.categories, { through: db.brand_categories, sourceKey: 'brand_uuid', foreignKey: 'brand_uuid' });
            db.categories.belongsToMany(db.brands, { through: db.brand_categories, sourceKey: 'cat_id', foreignKey: 'cat_id' });

            // Check If Has Alias with subcategories
            if (!db.categories.hasAlias('subcategories')) {

                await db.categories.hasMany(db.categories, {
                    targetKey: 'cat_id',
                    foreignKey: 'cat_parent_id',
                    as: 'subcategories'
                });
            }

            // Check If Has Alias with subsubcategories
            if (!db.categories.hasAlias('subsubcategories')) {
                await db.categories.hasMany(db.categories, {
                    targetKey: 'cat_id',
                    foreignKey: 'cat_parent_id',
                    as: 'subsubcategories'
                });

            }

            // GET ALL BRANDS QUERY
            const getAllBrands = await db.brands.findAll({
                where: {
                    tenant_id: TENANTID
                },
                include: [
                    {
                        model: db.categories,
                        include: {
                            model: db.categories,
                            as: 'subcategories',
                            include: {
                                model: db.categories,
                                as: 'subsubcategories'
                            }
                        }
                    }
                ],
                order: [['brand_name', 'ASC'], [db.categories, 'cat_name', 'ASC']]
            });

            // Return Formation
            return {
                data: getAllBrands,
                message: "All Brands With Categories GET Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong", status: false }
        }
    },
    // GET SINGLE BRAND
    getSingleBrand: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Brand UUID From Request
            const { brand_uuid } = req;

            // Associations MANY TO MANY
            db.brands.belongsToMany(db.categories, { through: db.brand_categories, sourceKey: 'brand_uuid', foreignKey: 'brand_uuid' });
            db.categories.belongsToMany(db.brands, { through: db.brand_categories, sourceKey: 'cat_id', foreignKey: 'cat_id' });

            // Check If Has Alias with subcategories
            if (!db.categories.hasAlias('subcategories')) {

                await db.categories.hasMany(db.categories, {
                    targetKey: 'cat_id',
                    foreignKey: 'cat_parent_id',
                    as: 'subcategories'
                });
            }

            // Check If Has Alias with subsubcategories
            if (!db.categories.hasAlias('subsubcategories')) {
                await db.categories.hasMany(db.categories, {
                    targetKey: 'cat_id',
                    foreignKey: 'cat_parent_id',
                    as: 'subsubcategories'
                });

            }

            // GET ALL BRANDS QUERY
            const getBrand = await db.brands.findOne({
                where: {
                    brand_uuid,
                    tenant_id: TENANTID
                },
                include: [
                    {
                        model: db.categories,
                        include: {
                            model: db.categories,
                            as: 'subcategories',
                            include: {
                                model: db.categories,
                                as: 'subsubcategories'
                            }
                        }
                    }
                ],
                order: [['brand_name', 'ASC'], [db.categories, 'cat_name', 'ASC']]
            });

            // Return Formation
            return {
                data: getBrand,
                message: "All Brands With Categories GET Success!!!",
                status: true,
                tenant_id: getBrand.tenant_id
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}