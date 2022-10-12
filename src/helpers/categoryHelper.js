// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { singleFileUpload } = require("../utils/fileUpload");
const config = require('config');




// Category Helper
module.exports = {
    // Create Category Helper
    createCategory: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.has_role === '0') return { message: "Not Authorized", status: false };

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
            const created_by = user.uid;

            // If Exist Category
            const findExistCategory = await db.categories.findOne({
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

                // IF IS FEATURED TRUE
                if (is_featured && cat_parent_id) return { message: "You cannot add a Child Category as Featured Category!!!", status: false };

                const insertCategory = await db.categories.create({
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
                    const imageUrl = await singleFileUpload({ file: image, idf: insertCategory.cat_id, folder: category_image_folder, fileName: insertCategory.cat_id, bucketName: category_image_bucketName });
                    if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };


                    // Update Category with Image Name
                    imageName = imageUrl.Key.split('/').slice(-1)[0];
                }
                // Find and Update Category Image Name By UUID
                const categoryImageUpdate = {
                    image: imageName
                }
                const updateCategory = await db.categories.update(categoryImageUpdate, {
                    where: {
                        [Op.and]: [{
                            cat_id: insertCategory.cat_id,
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

            // All Categories with Sub and Sub Sub Categories Query
            const allCategories = await db.categories.findAll({
                include: [
                    { model: db.categories, as: 'subcategories' },
                    {
                        model: db.categories,
                        as: 'subcategories',
                        include: {
                            model: db.categories,
                            as: 'subsubcategories'
                        },
                        separate: true,
                        order: [[{ model: db.categories, as: 'subsubcategories' }, 'cat_name', 'ASC']]
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

            // All Featured Categories with Sub and Sub Sub Categories Query
            const featuredCategories = await db.categories.findAll({
                include: [ // IF WE DONT NEED SUB CATEGORIES ON FEATURED THEN WE SHOULD REMOVE INCLUDES ARGS FROM HERE
                    { model: db.categories, as: 'subcategories' },
                    {
                        model: db.categories,
                        as: 'subcategories',
                        include: {
                            model: db.categories,
                            as: 'subsubcategories'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        cat_parent_id: null,
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
                categories: featuredCategories
            }


        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }

    },
    // GET SINGLE Category
    getSingleCategory: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Cat UUID From Request
            const { cat_id } = req;

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

            // All Categories with Sub and Sub Sub Categories Query
            const findSingleCategory = await db.categories.findOne({
                include: [
                    { model: db.categories, as: 'subcategories' },
                    {
                        model: db.categories,
                        as: 'subcategories',
                        include: {
                            model: db.categories,
                            as: 'subsubcategories'
                        },
                        separate: true,
                        order: [[{ model: db.categories, as: 'subsubcategories' }, 'cat_name', 'ASC']]
                    }
                ],
                order: [['cat_name', 'ASC']],
                where: {
                    [Op.and]: [{
                        cat_id,
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
    // Update Category Helper ->>>>>>>> TODO IMAGE
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
            }

            // Find To See If The Category Has any parent before
            const checkHasParent = await db.categories.findOne({
                where: {
                    [Op.and]: [{
                        cat_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF IS FEATURED TRUE
            if (!mark_as_main_category) {
                if (is_featured && (checkHasParent.cat_parent_id || cat_parent_id)) return { message: "You cannot add a Child Category as Featured Category!!!", status: false };
            }


            // Update Doc For Category Update
            const updateDoc = {
                cat_name,
                cat_slug,
                cat_description,
                cat_parent_id: mark_as_main_category ? null : cat_parent_id,  // If Need to Make Child To Main Category
                cat_meta_tag_title,
                cat_meta_tag_description,
                cat_meta_tag_keywords,
                image: "1000000.jpg",
                cat_sort_order,
                cat_status,
                is_featured
            }

            // Update Category
            const updateCategory = await db.categories.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        cat_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF NOT UPDATED THEN RETURN
            if (!updateCategory) return { message: "Update Gone Wrong!!!", status: false };

            // Return Data
            return {
                message: "Category Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}