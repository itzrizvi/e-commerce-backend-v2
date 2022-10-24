// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { singleFileUpload, multipleFileUpload } = require("../utils/fileUpload");
const config = require('config');


// Product Helper
module.exports = {
    // Add Product Helper
    addProduct: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const { prod_name,
                prod_long_desc,
                prod_short_desc,
                prod_meta_title,
                prod_meta_desc,
                prod_meta_keywords,
                prod_tags,
                prod_regular_price,
                prod_sale_price,
                prod_model,
                prod_sku,
                brand_uuid,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                related_product,
                prod_thumbnail,
                prod_gallery,
                dimensions,
                discount_type,
                product_attributes,
                partof_product } = req;


            // Product Slug
            const prod_slug = slugify(`${prod_name}`, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check Existence
            const checkExists = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        prod_slug,
                        tenant_id: TENANTID
                    }],
                    [Op.and]: [{
                        prod_sku,
                        tenant_id: TENANTID
                    }],

                }
            });
            if (checkExists) return { message: "Already Have This Product!!!", status: false };


            // Discount Type Insertion
            let discount_type_uuid;
            if (discount_type) {
                // Insert Data In Discount Type Table
                discount_type.tenant_id = TENANTID;
                const insertDiscountType = await db.discount_type.create(discount_type);
                if (!insertDiscountType) return { message: "Discount Table Data Insert Failed!!", status: false };

                // Discount Type UUID
                discount_type_uuid = insertDiscountType.discount_type_uuid
            }

            // Dimensions Table Data Insertion
            let dimension_uuid;
            if (dimensions) {
                // Insert Data In Dimension Table
                dimensions.tenant_id = TENANTID;
                const insertDimension = await db.product_dimension.create(dimensions);
                if (!insertDimension) return { message: "Dimension Data Insert Failed!!", status: false };

                // Discount Type UUID
                dimension_uuid = insertDimension.prod_dimension_uuid
            }

            // Create Product Without Image First
            const createProduct = await db.products.create({
                prod_name,
                prod_slug,
                prod_long_desc,
                prod_short_desc,
                prod_meta_title,
                prod_meta_desc,
                prod_meta_keywords,
                prod_tags,
                prod_regular_price,
                prod_sale_price,
                prod_model,
                prod_sku,
                brand_uuid,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                discount_type_uuid,
                dimension_uuid,
                prod_thumbnail: "demo.jpg",
                added_by: user.uid,
                tenant_id: TENANTID
            });
            if (!createProduct) return { message: "Product Create Failed!!!", status: false }



            // Upload Product Thumbnail
            let thumbName;
            // Upload Image to AWS S3
            const product_image_src = config.get("AWS.PRODUCT_IMG_THUMB_SRC").split("/")
            const product_image_bucketName = product_image_src[0];
            const product_image_folder = product_image_src.slice(1).join("/");
            const imageUrl = await singleFileUpload({ file: prod_thumbnail, idf: createProduct.prod_uuid, folder: product_image_folder, fileName: createProduct.prod_uuid, bucketName: product_image_bucketName });
            if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

            // Update Product with Thumbnail Name
            thumbName = imageUrl.Key.split('/').slice(-1)[0];
            // Find and Update Product Thumb Name By UUID
            const productThumbUpdate = {
                prod_thumbnail: thumbName
            }
            const updateProductWithThumb = await db.products.update(productThumbUpdate, {
                where: {
                    [Op.and]: [{
                        prod_uuid: createProduct.prod_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateProductWithThumb) return { message: "Product Create By Thumbnail Failed!!!", status: false }


            // If Product Gallery Images are Available
            if (prod_gallery) {
                // Upload Product Thumbnail
                let gallery = [];
                // Upload Image to AWS S3
                const product_gallery_src = config.get("AWS.PRODUCT_IMG_GALLERY_SRC").split("/")
                const product_gallery_bucketName = product_gallery_src[0];
                const product_gallery_folder = product_gallery_src.slice(1).join("/");
                const imageUrl = await multipleFileUpload({ file: prod_gallery, idf: createProduct.prod_uuid, folder: product_gallery_folder, fileName: createProduct.prod_uuid, bucketName: product_gallery_bucketName });
                if (!imageUrl) return { message: "Gallery Images Couldnt Uploaded Properly!!!", status: false };

                // Assign Values To Gallery Array For Bulk Create
                imageUrl.forEach(async (galleryImg) => {
                    await gallery.push({ prod_image: galleryImg.upload.Key.split('/').slice(-1)[0], prod_uuid: createProduct.prod_uuid, tenant_id: TENANTID });
                });

                // If Gallery Array Created Successfully then Bulk Create In Product Gallery Table
                if (gallery) {
                    // Product Gallery Save Bulk
                    const prodGalleryImgSave = await db.product_gallery.bulkCreate(gallery);
                    if (!prodGalleryImgSave) return { message: "Product Gallery Images Save Failed!!!", status: false }
                }

            }

            // Product Attribuites Table Data Insertion
            if (product_attributes) {
                // Loop For Assign Other Values to Product Attribites Data
                product_attributes.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.prod_uuid = createProduct.prod_uuid;
                });

                // Product Attributes Save Bulk
                const prodAttributesDataSave = await db.product_attributes.bulkCreate(product_attributes);
                if (!prodAttributesDataSave) return { message: "Product Attributes Data Save Failed", status: false }
            }

            // Return Formation
            return {
                message: "Product Added Successfully!!!",
                status: true,
                tenant_id: TENANTID
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

            // ### ASSOCIATION STARTS ### //
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
            // ### ASSOCIATION ENDS ### //

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

            // ### ASSOCIATION STARTS ### //
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
            // ### ASSOCIATION ENDS ### //

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