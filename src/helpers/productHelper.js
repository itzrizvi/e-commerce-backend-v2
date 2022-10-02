// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");


// Product Helper
module.exports = {
    // Add Product Helper
    addProduct: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const product_name = req.product_name;
            const product_description = req.product_description;
            const product_meta_tag_title = req.product_meta_tag_title ? req.product_meta_tag_title : null;
            const product_meta_tag_description = req.product_meta_tag_description ? req.product_meta_tag_description : null;
            const product_meta_tag_keywords = req.product_meta_tag_keywords ? req.product_meta_tag_keywords : null;
            const product_tags = req.product_tags ? req.product_tags : null;
            const product_image = req.product_image;
            const product_image_gallery = req.product_image_gallery ? req.product_image_gallery : null;
            const product_sku = req.product_sku;
            const product_regular_price = req.product_regular_price;
            const product_sale_price = req.product_sale_price ? req.product_sale_price : null;
            const product_tax_included = req.product_tax_included ? req.product_tax_included : null;
            const product_stock_quantity = req.product_stock_quantity;
            const product_minimum_stock_quantity = req.product_minimum_stock_quantity ? req.product_minimum_stock_quantity : null;
            const product_maximum_orders = req.product_maximum_orders ? req.product_maximum_orders : null;
            const product_stock_status = req.product_stock_status;
            const product_available_from = req.product_available_from ? req.product_available_from : null;
            const product_status = req.product_status;
            const product_category = req.product_category;
            const product_barcode = req.product_barcode ? req.product_barcode : null;
            const tenant_id = TENANTID;

            // Product Slug
            const product_slug = slugify(`${product_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Added By
            const added_by = user.uid;

            // Check the Product is Already There
            const findProductExist = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        product_slug,
                        product_sku,
                        tenant_id,
                        product_category
                    }]
                }
            });

            // If Found Then Return
            if (findProductExist) return { message: "This Product Already Added!!!", status: false };

            // Add Product
            const productAdd = await db.products.create({
                product_name,
                product_slug,
                product_description,
                product_meta_tag_title,
                product_meta_tag_description,
                product_meta_tag_keywords,
                product_tags,
                product_image,
                product_image_gallery,
                product_sku,
                product_regular_price,
                product_sale_price,
                product_tax_included,
                product_stock_quantity,
                product_minimum_stock_quantity,
                product_maximum_orders,
                product_stock_status,
                product_available_from,
                product_status,
                product_category,
                product_barcode,
                tenant_id,
                added_by
            });

            // Add Product Data Return
            if (productAdd) {
                return {
                    message: "Product Added Successfully!!!",
                    status: true,
                    data: productAdd
                }
            }



        } catch (error) {
            if (error) {
                return { message: "Something Went Wrong!!!", status: false }
            }
        }
    },
    // GET Single Product Helper
    getSingleProduct: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // Product ID From Request
            const product_id = req.product_id;

            // Check If Has Alias with Categories
            if (!db.products.hasAlias('category')) {

                await db.products.hasOne(db.categories, {
                    sourceKey: 'product_category',
                    foreignKey: 'cat_id',
                    as: 'category'
                });
            }
            // Check If Has Alias with Users and Roles
            if (!db.products.hasAlias('users') && !db.users.hasAlias('roles')) {

                await db.products.hasOne(db.users, {
                    sourceKey: 'added_by',
                    foreignKey: 'uid',
                    as: 'createdBy'
                });
            }

            // Check If Has Alias With Roles
            if (!db.users.hasAlias('roles')) {
                await db.users.hasOne(db.roles, {
                    sourceKey: 'role_no',
                    foreignKey: 'role_no',
                    as: 'roles'
                });
            }

            // Find Triggered Product
            const findProduct = await db.products.findOne({
                include: [
                    { model: db.categories, as: 'category' },
                    {
                        model: db.users, as: 'createdBy',
                        include: {
                            model: db.roles,
                            as: 'roles'
                        }
                    }
                ],
                where: {
                    [Op.and]: [{
                        product_id,
                        tenant_id: TENANTID
                    }]
                },
            });

            // Return Final Data
            return {
                message: "Get Product Details Success!!!",
                status: true,
                data: findProduct
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Update Product Helper
    updateProduct: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {


            // Product ID From Request
            const { product_id: productID } = req;
            // Added By
            const added_by = user.uid;
            // TENANT ID
            const tenant_id = TENANTID;

            // Find Product
            const findProduct = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        product_id: productID,
                        tenant_id: TENANTID
                    }]
                }
            });

            // IF FOUND PRODUCT
            if (!findProduct) return { message: "Product Not Found!!!", status: false };

            // Update Doc 
            const { product_id, ...updateDoc } = req;
            updateDoc["added_by"] = added_by;
            updateDoc["tenant_id"] = tenant_id;

            // Update Product
            const updateProduct = await db.products.update(updateDoc, {
                where: {
                    [Op.and]: [{
                        product_id: productID,
                        tenant_id: TENANTID
                    }]
                },
            });

            // IF NOT Updated
            if (!updateProduct) return { message: "Update Gone Wrong!!!", status: false };

            // If Product Updated
            const updatedProductFind = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        product_id: productID,
                        tenant_id: TENANTID
                    }]
                }
            });

            return {
                message: "Product Update Success!!!",
                status: true,
                data: updatedProductFind
            }




        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Product List Helper
    getProductList: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // Check If Has Alias with Categories
            if (!db.products.hasAlias('category')) {

                await db.products.hasOne(db.categories, {
                    sourceKey: 'product_category',
                    foreignKey: 'cat_id',
                    as: 'category'
                });
            }
            // Check If Has Alias with Users and Roles
            if (!db.products.hasAlias('users') && !db.users.hasAlias('roles')) {

                await db.products.hasOne(db.users, {
                    sourceKey: 'added_by',
                    foreignKey: 'uid',
                    as: 'createdBy'
                });
            }

            // Check If Has Alias With Roles
            if (!db.users.hasAlias('roles')) {
                await db.users.hasOne(db.roles, {
                    sourceKey: 'role_no',
                    foreignKey: 'role_no',
                    as: 'roles'
                });
            }

            // Find ALL Product
            const allProducts = await db.products.findAll({
                include: [
                    { model: db.categories, as: 'category' },
                    {
                        model: db.users, as: 'createdBy',
                        include: {
                            model: db.roles,
                            as: 'roles'
                        }
                    }
                ],
                where: { tenant_id }
            });

            // Return If Success
            if (allProducts) {
                return {
                    message: "Product List Success!!!",
                    status: true,
                    data: allProducts
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}