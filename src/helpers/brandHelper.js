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
                const imageUrl = await singleFileUpload({ file: image, idf: createBrand.brand_uuid, folder: brand_image_folder, fileName: createBrand.brand_uuid, bucketName: brand_image_bucketName });
                if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

                // Update Brand with Image Name
                imageName = imageUrl.Key.split('/').slice(-1)[0];
            }


            // Find and Update Brand Image Name By UUID
            const brandImageUpdate = {
                image: imageName
            }
            const updateBrand = await db.brands.update(brandImageUpdate, {
                where: {
                    [Op.and]: [{
                        brand_uuid: createBrand.brand_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });


            // Loop For Assign Other Values to Brand Categories
            categories.forEach(element => {
                element.tenant_id = createBrand.tenant_id;
                element.brand_uuid = createBrand.brand_uuid;
            });

            // Brand Categories Save Bulk
            const brandCategoriesDataSave = await db.brand_categories.bulkCreate(categories);
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
    },
    // UPDATE BRAND ->>>>>>> TODO ADD IMAGE
    updateBrand: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Request
            const { brand_uuid,
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
            const updateBrand = await db.brands.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        brand_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateBrand) return { message: "Update Gone Wrong!!!", status: false };

            // Find Brand to Get Image Name
            const findBrand = await db.brands.findOne({
                where: {
                    [Op.and]: [{
                        brand_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF Image Also Updated
            if (image) {
                // Delete Previous S3 Image For this Brand
                const brand_image_src = config.get("AWS.BRAND_IMG_DEST").split("/");
                const brand_image_bucketName = brand_image_src[0];
                const brand_image_folder = brand_image_src.slice(1);
                await deleteFile({ idf: brand_uuid, folder: brand_image_folder, fileName: findBrand.image, bucketName: brand_image_bucketName });
            }

            // Upload New Image to S3
            if (image) {
                // Upload Image to AWS S3
                const brand_image_src = config.get("AWS.BRAND_IMG_SRC").split("/")
                const brand_image_bucketName = brand_image_src[0];
                const brand_image_folder = brand_image_src.slice(1);
                const imageUrl = await singleFileUpload({ file: image, idf: brand_uuid, folder: brand_image_folder, fileName: brand_uuid, bucketName: brand_image_bucketName });
                if (!imageUrl) return { message: "New Image Couldnt Uploaded Properly!!!", status: false };

                // Update Brand with New Image Name
                const imageName = imageUrl.Key.split('/').slice(-1)[0];

                // Find and Update Brand Image Name By UUID
                const brandImageUpdate = {
                    image: imageName
                }
                // Update Brand Image
                const updateBrand = await db.brands.update(brandImageUpdate, {
                    where: {
                        [Op.and]: [{
                            brand_uuid,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If not updated
                if (!updateBrand) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
            }

            // IF Brand Category Exist for Update
            if (categories) {
                // Loop For Assign Other Values to Role Data
                categories.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.brand_uuid = brand_uuid;
                });

                // Delete Previous Entry
                const deletePreviousEntry = await db.brand_categories.destroy({
                    where: {
                        [Op.and]: [{
                            brand_uuid,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If Not Deleted
                if (!deletePreviousEntry) return { message: "Previous Brand Categories Delete Failed!!!!", status: false }

                // Update Brand Categories Bulk
                const brandCategoriesDataUpdate = await db.brand_categories.bulkCreate(categories);
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
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}