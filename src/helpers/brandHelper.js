// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');
const config = require('config');
const { singleFileUpload, deleteFile } = require("../utils/fileUpload");

// BRAND HELPER
module.exports = {
    // Create Brand HELPER
    createBrand: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Req
            const { brandName, brandDescription, brandStatus, brandSortOrder, categories, image } = req;

            // Slugify Brand Name
            const brand_slug = slugify(`${brandName}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Brand
            const checkExistence = await db.brand.findOne({
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
            const createBrand = await db.brand.create({
                brand_name: brandName,
                brand_slug,
                brand_description: brandDescription,
                image: null,
                brand_status: brandStatus,
                brand_sort_order: brandSortOrder,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createBrand) return { message: "Couldnt Created The Brand", status: false };

            // If Image is Available
            let imageName;
            if (image) {
                // Upload Image to AWS S3
                const brand_image_src = config.get("AWS.BRAND_IMG_SRC").split("/")
                const brand_image_bucketName = brand_image_src[0]
                const brand_image_folder = brand_image_src.slice(1)
                const imageUrl = await singleFileUpload({ file: image, idf: createBrand.id, folder: brand_image_folder, fileName: createBrand.id, bucketName: brand_image_bucketName });
                if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

                // Update Brand with Image Name
                imageName = imageUrl.Key.split('/').slice(-1)[0];
            }


            // Find and Update Brand Image Name By UUID
            const brandImageUpdate = {
                image: imageName
            }
            const updateBrand = await db.brand.update(brandImageUpdate, {
                where: {
                    [Op.and]: [{
                        id: createBrand.id,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Loop For Assign Other Values to Brand Categories
            categories.forEach(element => {
                element.tenant_id = createBrand.tenant_id;
                element.brand_id = createBrand.id;
            });

            // Brand Categories Save Bulk
            const brandCategoriesDataSave = await db.brand_category.bulkCreate(categories);
            if (!brandCategoriesDataSave) return { message: "Brand Categories Data Save Failed", status: false };

            if (updateBrand) {
                // Return Formation
                return {
                    message: "Successfully Created Brand With Categories!!",
                    tenant_id: createBrand.tenant_id,
                    status: true
                }

            } else {
                // Return Formation
                return {
                    message: "Brand Image Upload or Update Failed!!",
                    tenant_id: createBrand.tenant_id,
                    status: false
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET ALL BRANDS
    getAllBrands: async (db, user, isAuth, TENANTID) => {
        // TRY CATCH BLOCK
        try {

            // Associations MANY TO MANY
            db.brand.belongsToMany(db.category, { through: db.brand_category, sourceKey: 'id', foreignKey: 'brand_id' });
            db.category.belongsToMany(db.brand, { through: db.brand_category, sourceKey: 'id', foreignKey: 'cat_id' });

            // Check If Has Alias with subcategories
            if (!db.category.hasAlias('subcategories')) {

                await db.category.hasMany(db.category, {
                    targetKey: 'id',
                    foreignKey: 'cat_parent_id',
                    as: 'subcategories'
                });
            }

            // Check If Has Alias with subsubcategories
            if (!db.category.hasAlias('subsubcategories')) {
                await db.category.hasMany(db.category, {
                    targetKey: 'id',
                    foreignKey: 'cat_parent_id',
                    as: 'subsubcategories'
                });

            }

            // GET ALL BRANDS QUERY
            const getAllBrands = await db.brand.findAll({
                where: {
                    tenant_id: TENANTID
                },
                include: [
                    {
                        model: db.category,
                        include: {
                            model: db.category,
                            as: 'subcategories',
                            include: {
                                model: db.category,
                                as: 'subsubcategories'
                            }
                        }
                    }
                ],
                order: [['brand_name', 'ASC']]
            });

            // Return Formation
            return {
                data: getAllBrands,
                message: "All Brands With Categories GET Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE BRAND
    getSingleBrand: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Brand UUID From Request
            const { brand_id } = req;

            // Associations MANY TO MANY
            db.brand.belongsToMany(db.category, { through: db.brand_category, sourceKey: 'id', foreignKey: 'brand_id' });
            db.category.belongsToMany(db.brand, { through: db.brand_category, sourceKey: 'id', foreignKey: 'cat_id' });

            // Check If Has Alias with subcategories
            if (!db.category.hasAlias('subcategories')) {

                await db.category.hasMany(db.category, {
                    targetKey: 'id',
                    foreignKey: 'cat_parent_id',
                    as: 'subcategories'
                });
            }

            // Check If Has Alias with subsubcategories
            if (!db.category.hasAlias('subsubcategories')) {
                await db.category.hasMany(db.category, {
                    targetKey: 'id',
                    foreignKey: 'cat_parent_id',
                    as: 'subsubcategories'
                });

            }

            // GET ALL BRANDS QUERY
            const getBrand = await db.brand.findOne({
                where: {
                    id: brand_id,
                    tenant_id: TENANTID
                },
                include: [
                    {
                        model: db.category,
                        include: {
                            model: db.category,
                            as: 'subcategories',
                            include: {
                                model: db.category,
                                as: 'subsubcategories'
                            }
                        }
                    }
                ]
            });

            // Return Formation
            return {
                data: getBrand,
                message: "All Brands With Categories GET Success!!!",
                status: true,
                tenant_id: getBrand.tenant_id
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET PRODUCTS BY BRAND
    getProductsByBrand: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // CATEGORY ID
            const { brand_id } = req;
            // TENANT ID
            const tenant_id = TENANTID;

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

            // Find ALL Products By Brand
            const getProductsByBrand = await db.product.findAll({
                include: { model: db.product_condition, as: 'condition' }, // Include Product Condition,
                where: {
                    [Op.and]: [{
                        brand_id,
                        tenant_id
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Condition Assign
            await getProductsByBrand.forEach(async (item) => {
                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }
            });

            // Return If Success
            if (getProductsByBrand) {
                return {
                    message: "Get Products By Brand Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: getProductsByBrand
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // UPDATE BRAND 
    updateBrand: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request
            const { brand_id,
                brand_name,
                brand_status,
                brand_sort_order,
                brand_description,
                categories,
                image } = req;

            // IF Brand Name ALSO UPDATED THEN SLUG ALSO WILL BE UPDATED
            let brand_slug;
            if (brand_name) {
                // Create Slug
                brand_slug = slugify(`${brand_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });


                // Check If Already Exist the Brand
                const checkExistence = await db.brand.findOne({
                    where: {
                        [Op.and]: [{
                            brand_slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: brand_id
                        }]
                    }
                });

                // If Found Brand
                if (checkExistence) return { message: "Already Have This Brand!!!", status: false };
            };

            // Update Doc
            const updateDoc = {
                brand_name,
                brand_slug,
                brand_status,
                brand_description,
                brand_sort_order
            }

            // Update Brand Details
            const updateBrand = await db.brand.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id: brand_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateBrand) return { message: "Update Gone Wrong!!!", status: false };

            // Find Brand to Get Image Name
            const findBrand = await db.brand.findOne({
                where: {
                    [Op.and]: [{
                        id: brand_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF Image Also Updated
            if (image && findBrand.image) {
                // Delete Previous S3 Image For this Brand
                const brand_image_src = config.get("AWS.BRAND_IMG_DEST").split("/");
                const brand_image_bucketName = brand_image_src[0];
                const brand_image_folder = brand_image_src.slice(1);
                await deleteFile({ idf: findBrand.id, folder: brand_image_folder, fileName: findBrand.image, bucketName: brand_image_bucketName });
            }

            // Upload New Image to S3
            if (image) {
                // Upload Image to AWS S3
                const brand_image_src = config.get("AWS.BRAND_IMG_SRC").split("/")
                const brand_image_bucketName = brand_image_src[0];
                const brand_image_folder = brand_image_src.slice(1);
                const imageUrl = await singleFileUpload({ file: image, idf: findBrand.id, folder: brand_image_folder, fileName: findBrand.id, bucketName: brand_image_bucketName });
                if (!imageUrl) return { message: "New Image Couldnt Uploaded Properly!!!", status: false };

                // Update Brand with New Image Name
                const imageName = imageUrl.Key.split('/').slice(-1)[0];

                // Find and Update Brand Image Name By UUID
                const brandImageUpdate = {
                    image: imageName
                }
                // Update Brand Image
                const updateBrand = await db.brand.update(brandImageUpdate, {
                    where: {
                        [Op.and]: [{
                            id: brand_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If not updated
                if (!updateBrand) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
            }

            // IF Brand Category Exist for Update
            if (categories && categories.length > 0) {
                // Loop For Assign Other Values to Role Data
                categories.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.brand_id = findBrand.id;
                });

                // Delete Previous Entry
                await db.brand_category.destroy({
                    where: {
                        [Op.and]: [{
                            brand_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Update Brand Categories Bulk
                const brandCategoriesDataUpdate = await db.brand_category.bulkCreate(categories);
                if (!brandCategoriesDataUpdate) return { message: "Brand Categories Update Failed", status: false }

                // Return
                return {
                    message: "Brand and Brand Categories Update Success!!!",
                    status: true,
                    tenant_id: TENANTID
                }


            } else {
                // Return 
                return {
                    message: "Brand Update Success!!!",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    //  ALL PUBLIC BRANDS
    allPublicBrands: async (db, TENANTID) => {
        // TRY CATCH BLOCK
        try {

            // GET ALL PUBLIC BRANDS QUERY
            const getAllPublicBrands = await db.brand.findAll({
                where: {
                    brand_status: true,
                    tenant_id: TENANTID
                },
                order: [['brand_name', 'ASC']]
            });

            // Return Formation
            return {
                data: getAllPublicBrands,
                message: "All Public Brands GET Success!!!",
                status: true,
                tenant_id: TENANTID
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }
}