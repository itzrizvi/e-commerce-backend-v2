// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");




// Category Helper
module.exports = {
    // Create Category Helper
    createCategory: async (req, db, user, isAuth, TENANTID) => {
        // Return If No Auth
        if (!user || !isAuth) return { message: "Not Authorized", status: false };
        if (user.role_no === '0') return { message: "Not Authorized", status: false };

        // Try Catch Block
        try {
            // Category Data From Request
            const cat_name = req.categoryName;
            const cat_description = req.categoryDescription ? req.categoryDescription : null;
            const cat_parent_id = req.categoryParentId ? req.categoryParentId : null;
            const cat_meta_tag_title = req.categoryMetaTagTitle ? req.categoryMetaTagTitle : null;
            const cat_meta_tag_description = req.categoryMetaTagDescription ? req.categoryMetaTagDescription : null;
            const cat_meta_tag_keywords = req.categoryMetaTagKeywords ? req.categoryMetaTagKeywords : null;
            const cat_image = req.categoryImage ? req.categoryImage : null;
            const cat_sort_order = req.categorySortOrder ? req.categorySortOrder : 0;
            const cat_status = req.categoryStatus ? req.categoryStatus : false;

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

                const insertCategory = await db.categories.create({
                    cat_name,
                    cat_slug,
                    cat_description,
                    cat_parent_id,
                    cat_meta_tag_title,
                    cat_meta_tag_description,
                    cat_meta_tag_keywords,
                    cat_image,
                    cat_sort_order,
                    cat_status,
                    created_by,
                    tenant_id: TENANTID
                });

                // If Inserted Data
                if (insertCategory) {
                    return {
                        message: "Successfully Created A Category!!!",
                        status: true,
                        tenant_id: insertCategory.tenant_id,
                        creategoryName: insertCategory.cat_name,
                        createdBy: user.email
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
                        }
                    }
                ],
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

    }
}