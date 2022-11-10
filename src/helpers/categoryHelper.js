// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { singleFileUpload, deleteFile } = require("../utils/fileUpload");
const config = require('config');




// Category Helper
module.exports = {
    // Create Category Helper
    createCategory: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Category Data From Request
            const cat_name = req.categoryName;
            const cat_description = req.categoryDescription ? req.categoryDescription : null;
            const cat_parent_id = req.categoryParentId ? req.categoryParentId : null;
            const cat_meta_tag_title = req.categoryMetaTagTitle ? req.categoryMetaTagTitle : null;
            const cat_meta_tag_description = req.categoryMetaTagDescription ? req.categoryMetaTagDescription : null;
            const cat_meta_tag_keywords = req.categoryMetaTagKeywords ? req.categoryMetaTagKeywords : null;
            const cat_sort_order = req.categorySortOrder ? req.categorySortOrder : 0;
            const cat_status = req.categoryStatus ? req.categoryStatus : false;
            const is_featured = req.isFeatured ? req.isFeatured : false;
            const { image } = req;

            // Category Slug
            const cat_slug = slugify(`${cat_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Created By
            const created_by = user.id;

            // If Exist Category
            const findExistCategory = await db.category.findOne({
                where: {
                    [Op.and]: [{
                        cat_slug,
                        cat_parent_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Not Exist The Ctageory will be created
            if (!findExistCategory) {

                // // IF IS FEATURED TRUE
                // if (is_featured && cat_parent_id) return { message: "You cannot add a Child Category as Featured Category!!!", status: false };

                const insertCategory = await db.category.create({
                    cat_name,
                    cat_slug,
                    cat_description,
                    cat_parent_id,
                    cat_meta_tag_title,
                    cat_meta_tag_description,
                    cat_meta_tag_keywords,
                    image: null,
                    cat_sort_order,
                    cat_status,
                    created_by,
                    tenant_id: TENANTID,
                    is_featured
                });

                if (!insertCategory) return { message: "Theres an Error When Creating the Category!!!", status: false }; // If Not Inserted

                // If Image is Available
                let imageName;
                if (image) {

                    // Upload Image to AWS S3
                    const category_image_src = config.get("AWS.CATEGORY_IMG_SRC").split("/")
                    const category_image_bucketName = category_image_src[0];
                    const category_image_folder = category_image_src.slice(1);
                    const imageUrl = await singleFileUpload({ file: image, idf: insertCategory.id, folder: category_image_folder, fileName: insertCategory.id, bucketName: category_image_bucketName });
                    if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };


                    // Update Category with Image Name
                    imageName = imageUrl.Key.split('/').slice(-1)[0];
                }
                // Find and Update Category Image Name By UUID
                const categoryImageUpdate = {
                    image: imageName
                }
                const updateCategory = await db.category.update(categoryImageUpdate, {
                    where: {
                        [Op.and]: [{
                            id: insertCategory.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // If Inserted Data
                if (updateCategory) {
                    return {
                        message: "Successfully Created A Category!!!",
                        status: true,
                        tenant_id: insertCategory.tenant_id
                    }
                } else {
                    return {
                        message: "Category Create Failed!!!",
                        status: false,
                        tenant_id: TENANTID
                    }
                }

            } else {
                return { message: "This Category Already Exists!!!", status: false }
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong", status: false };
            }
        }

    },
    // GET ALL Categories Helper
    getAllCategories: async (db, TENANTID) => {

        try {
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

            // All Categories with Sub and Sub Sub Categories Query
            const allCategories = await db.category.findAll({
                include: [
                    { model: db.category, as: 'subcategories' },
                    {
                        model: db.category,
                        as: 'subcategories',
                        include: {
                            model: db.category,
                            as: 'subsubcategories'
                        },
                        separate: true,
                        order: [[{ model: db.category, as: 'subsubcategories' }, 'cat_name', 'ASC']]
                    }
                ],
                order: [['cat_name', 'ASC']],
                where: {
                    [Op.and]: [{
                        cat_parent_id: null,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Data
            return {
                message: "Success",
                tenant_id: TENANTID,
                status: true,
                categories: allCategories
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }

    },
    // GET Featured Categories Helper
    getFeaturedCategories: async (db, TENANTID) => {

        try {
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

            // All Featured Categories with Sub and Sub Sub Categories Query
            const featuredCategories = await db.category.findAll({
                include: [ // IF WE DONT NEED SUB CATEGORIES ON FEATURED THEN WE SHOULD REMOVE INCLUDES ARGS FROM HERE
                    { model: db.category, as: 'subcategories' },
                    {
                        model: db.category,
                        as: 'subcategories',
                        include: {
                            model: db.category,
                            as: 'subsubcategories'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        is_featured: true,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Data
            return {
                message: "Success",
                tenant_id: TENANTID,
                status: true,
                data: featuredCategories
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }

    },
    // GET Product By Category Helper
    getProductsByCategory: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // CATEGORY ID
            const { cat_id } = req;
            // TENANT ID
            const tenant_id = TENANTID;

            // Find ALL Products By Category
            const getProductsByCategory = await db.product.findAll({
                where: {
                    [Op.and]: [{
                        prod_category: cat_id,
                        tenant_id
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Return If Success
            if (getProductsByCategory) {
                return {
                    message: "Get Products By Category Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: getProductsByCategory
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET SINGLE Category
    getSingleCategory: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Cat UUID From Request
            const { cat_id } = req;

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

            // All Categories with Sub and Sub Sub Categories Query
            const findSingleCategory = await db.category.findOne({
                include: [
                    { model: db.category, as: 'subcategories' },
                    {
                        model: db.category,
                        as: 'subcategories',
                        include: {
                            model: db.category,
                            as: 'subsubcategories'
                        },
                        separate: true,
                        order: [[{ model: db.category, as: 'subsubcategories' }, 'cat_name', 'ASC']]
                    }
                ],
                order: [['cat_name', 'ASC']],
                where: {
                    [Op.and]: [{
                        id: cat_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Data
            return {
                message: "GET Single Category Success!!!",
                tenant_id: TENANTID,
                status: true,
                category: findSingleCategory
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update Category Helper
    updateCategory: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const { cat_id,
                cat_name,
                cat_description,
                cat_meta_tag_title,
                cat_meta_tag_description,
                cat_meta_tag_keywords,
                cat_status,
                cat_parent_id,
                is_featured,
                cat_sort_order,
                mark_as_main_category,
                image } = req;

            // IF CATEGORY NAME ALSO UPDATED THEN SLUG ALSO WILL BE UPDATED
            let cat_slug;
            if (cat_name) {
                // Create Slug
                cat_slug = slugify(`${cat_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // If Exist Category
                const findExistCategory = await db.category.findOne({
                    where: {
                        [Op.and]: [{
                            cat_slug,
                            cat_parent_id,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: cat_id
                        }]
                    }
                });

                if (findExistCategory) return { message: "This Category Already Exists!!!", status: false }
            }

            // // Find To See If The Category Has any parent before
            // const checkHasParent = await db.categories.findOne({
            //     where: {
            //         [Op.and]: [{
            //             cat_id,
            //             tenant_id: TENANTID
            //         }]
            //     }
            // });

            // // IF IS FEATURED TRUE
            // if (!mark_as_main_category) {
            //     if (is_featured && (checkHasParent.cat_parent_id || cat_parent_id)) return { message: "You cannot add a Child Category as Featured Category!!!", status: false };
            // }


            // Update Doc For Category Update
            const updateDoc = {
                cat_name,
                cat_slug,
                cat_description,
                cat_parent_id: mark_as_main_category ? null : cat_parent_id,  // If Need to Make Child To Main Category
                cat_meta_tag_title,
                cat_meta_tag_description,
                cat_meta_tag_keywords,
                cat_sort_order,
                cat_status,
                is_featured
            }

            // Update Category
            const updateCategory = await db.category.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        id: cat_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateCategory) return { message: "Update Gone Wrong!!!", status: false };

            // Find Category to Get Image Name
            const findCategory = await db.category.findOne({
                where: {
                    [Op.and]: [{
                        id: cat_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF Image Also Updated
            if (image && findCategory.image) {

                // Delete Previous S3 Image For this Category
                const category_image_src = config.get("AWS.CATEGORY_IMG_DEST").split("/")
                const category_image_bucketName = category_image_src[0];
                const category_image_folder = category_image_src.slice(1);
                await deleteFile({ idf: findCategory.id, folder: category_image_folder, fileName: findCategory.image, bucketName: category_image_bucketName });

            }

            // Upload New Image to S3
            if (image) {

                // Upload Image to AWS S3
                const category_image_src = config.get("AWS.CATEGORY_IMG_SRC").split("/")
                const category_image_bucketName = category_image_src[0];
                const category_image_folder = category_image_src.slice(1);
                const imageUrl = await singleFileUpload({ file: image, idf: findCategory.id, folder: category_image_folder, fileName: findCategory.id, bucketName: category_image_bucketName });
                if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

                // Update Category with New Image Name
                const imageName = imageUrl.Key.split('/').slice(-1)[0];

                // Find and Update Category Image Name By UUID
                const categoryImageUpdate = {
                    image: imageName
                }
                // Update Brand Image
                const updateCategory = await db.category.update(categoryImageUpdate, {
                    where: {
                        [Op.and]: [{
                            id: cat_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If not updated
                if (!updateCategory) return { message: "New Image Name Couldnt Be Updated Properly!!!", status: false }
            }

            // Return Data
            return {
                message: "Category Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Get Parent Categories Helper
    getParentCategories: async (db, user, isAuth, TENANTID) => {

        // Try Catch
        try {

            // All Parent Categories Query
            const getParentCategories = await db.category.findAll({
                order: [['cat_name', 'ASC']],
                where: {
                    [Op.and]: [{
                        cat_parent_id: null,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Return Data
            return {
                message: "All Parent Categories GET Success!!!",
                tenant_id: TENANTID,
                status: true,
                categories: getParentCategories
            }


        } catch (error) {
            if (error) return { message: "Something Went Wromg!!!", status: false }
        }
    },
    // Get Parent Child Categories
    getParentChildCategories: async (db, user, isAuth, TENANTID) => {
        // Tr Catch 
        try {
            // Check If Has Alias with subcategories
            if (!db.category.hasAlias('subcategories')) {

                await db.category.hasMany(db.category, {
                    targetKey: 'id',
                    foreignKey: 'cat_parent_id',
                    as: 'subcategories'
                });
            }

            // All Categories with Sub and Sub Sub Categories Query
            const findAllCategories = await db.category.findAll({
                include: [
                    { model: db.category, as: 'subcategories' }
                ],
                order: [['cat_name', 'ASC']],
                where: {
                    [Op.and]: [{
                        cat_parent_id: null,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Get First Two Steps of Categories
            const allParentChildCategories = findAllCategories;
            findAllCategories.forEach(async (elementOne) => {
                await elementOne.subcategories.forEach(async (elementTwo) => {
                    await allParentChildCategories.push(elementTwo);
                });
            });

            // Return Data
            return {
                message: "Success",
                tenant_id: TENANTID,
                status: true,
                categories: allParentChildCategories
            }



        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }
    },
    // GET Product By Category Slug Helper
    getProductsByCategorySlug: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // CATEGORY ID
            const { category_slug } = req;
            // TENANT ID
            const tenant_id = TENANTID;


            // Order Items and Product
            if (!db.category.hasAlias("product") && !db.category.hasAlias("products")) {
                await db.category.hasMany(db.product, {
                    sourceKey: "id",
                    foreignKey: "prod_category",
                    as: 'products'
                });

            }

            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }


            // Find ALL Products By Category
            const getCategoryWithProducts = await db.category.findOne({
                include: [{
                    model: db.product,
                    as: 'products',
                    separate: true,
                    order: [
                        ['prod_slug', 'ASC']
                    ],
                    include: { model: db.category, as: 'category' }
                }],
                where: {
                    [Op.and]: [{
                        cat_slug: category_slug,
                        tenant_id
                    }]
                },
            });

            // GET Product Array
            let getProductByCatSlug = [];
            getCategoryWithProducts.products.forEach(async (element) => {
                await getProductByCatSlug.push(element);
            });

            // Return If Success
            if (getProductByCatSlug) {
                return {
                    message: "Get Products By Category Slug Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: getProductByCatSlug
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}