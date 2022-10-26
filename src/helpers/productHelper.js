// All Requires
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { singleFileUpload, multipleFileUpload, deleteFile } = require("../utils/fileUpload");
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
                prod_partnum,
                prod_sku,
                brand_uuid,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                taxable,
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
                    [Op.and]: [{
                        prod_partnum,
                        tenant_id: TENANTID
                    }],

                }
            });
            if (checkExists) return { message: "Already Have This Product!!!", status: false };


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
                prod_partnum,
                prod_sku,
                brand_uuid,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                taxable,
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
                // Upload Product Gallery
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
            if (product_attributes && product_attributes.length > 0) {
                // Loop For Assign Other Values to Product Attribites Data
                product_attributes.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.prod_uuid = createProduct.prod_uuid;
                });

                // Product Attributes Save Bulk
                const prodAttributesDataSave = await db.product_attributes.bulkCreate(product_attributes);
                if (!prodAttributesDataSave) return { message: "Product Attributes Data Save Failed!!!", status: false }
            }


            // If Related Products Are Available For Add
            if (related_product && related_product.length > 0) {
                let relatedProducts = [];
                related_product.forEach(async (productUUID) => {
                    await relatedProducts.push({ prod_uuid: productUUID, base_prod_uuid: createProduct.prod_uuid, tenant_id: TENANTID });
                });

                if (relatedProducts) {
                    // Related Product Save Bulk
                    const relatedProdSave = await db.related_product.bulkCreate(relatedProducts);
                    if (!relatedProdSave) return { message: "Related Products Save Failed!!!", status: false }
                }
            }

            // Discount Type Insertion
            if (discount_type && discount_type.length > 0) {
                // Loop For Assign Other Values to Discount Type  Data
                discount_type.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.prod_uuid = createProduct.prod_uuid;
                });
                // Insert Data In Discount Type Table
                const insertDiscountType = await db.discount_type.bulkCreate(discount_type);
                if (!insertDiscountType) return { message: "Discount Table Data Insert Failed!!", status: false };
            }


            // If Part of Product Available
            if (partof_product && partof_product.length > 0) {

                partof_product.forEach(part => {
                    part.parent_prod_uuid = createProduct.prod_uuid;
                    part.tenant_id = TENANTID;
                });

                // Part Of Product Save Bulk
                const partOfProdSave = await db.partof_product.bulkCreate(partof_product);
                if (!partOfProdSave) return { message: "Part Of Products Save Failed!!!", status: false }

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
            const prod_uuid = req.prod_uuid;

            // ### ASSOCIATION STARTS ### //
            // Check If Has Alias with Categories
            if (!db.products.hasAlias('category')) {

                await db.products.hasOne(db.categories, {
                    sourceKey: 'prod_category',
                    foreignKey: 'cat_id',
                    as: 'category'
                });
            }
            // Check If Has Alias with Users and Roles
            if (!db.products.hasAlias('users') && !db.users.hasAlias('roles')) {

                await db.products.hasOne(db.users, {
                    sourceKey: 'added_by',
                    foreignKey: 'uid',
                    as: 'created_by'
                });
            }

            // Created By Associations
            db.users.belongsToMany(db.roles, { through: db.admin_roles, sourceKey: 'uid', foreignKey: 'admin_uuid' });
            db.roles.belongsToMany(db.users, { through: db.admin_roles, sourceKey: 'role_uuid', foreignKey: 'role_uuid' });

            // Product Gallery Associations
            if (!db.products.hasAlias('product_gallery') && !db.products.hasAlias('gallery')) {

                await db.products.hasMany(db.product_gallery, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'prod_uuid',
                    as: 'gallery'
                });
            }

            // Discount Type + Customer Group Association
            if (!db.products.hasAlias('discount_type')) {

                await db.products.hasMany(db.discount_type, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'prod_uuid',
                    as: 'discount_type'
                });
            }

            if (!db.discount_type.hasAlias('customer_groups') && !db.discount_type.hasAlias('customer_group')) {

                await db.discount_type.hasOne(db.customer_groups, {
                    sourceKey: 'customer_group_uuid',
                    foreignKey: 'customer_group_uuid',
                    as: 'customer_group'
                });
            }

            // Dimension Table Association with Product
            if (!db.products.hasAlias('product_dimension') && !db.products.hasAlias('dimensions')) {

                await db.products.hasOne(db.product_dimension, {
                    sourceKey: 'dimension_uuid',
                    foreignKey: 'prod_dimension_uuid',
                    as: 'dimensions'
                });
            }
            // Brand Table Association with Product
            if (!db.products.hasAlias('brands') && !db.products.hasAlias('brand')) {

                await db.products.hasOne(db.brands, {
                    sourceKey: 'brand_uuid',
                    foreignKey: 'brand_uuid',
                    as: 'brand'
                });
            }

            // Part of Product Table Association with Product
            if (!db.products.hasAlias('partof_product') && !db.products.hasAlias('part_of_products')) {

                await db.products.hasMany(db.partof_product, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'parent_prod_uuid',
                    as: 'part_of_products'
                });
            }
            if (!db.partof_product.hasAlias('products') && !db.partof_product.hasAlias('part_product')) {

                await db.partof_product.hasOne(db.products, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'prod_uuid',
                    as: 'part_product'
                });
            }

            // Product Attributes Table Association with Product
            if (!db.products.hasAlias('product_attributes') && !db.products.hasAlias('prod_attributes')) {

                await db.products.hasMany(db.product_attributes, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'prod_uuid',
                    as: 'prod_attributes'
                });
            }
            if (!db.product_attributes.hasAlias('attributes') && !db.product_attributes.hasAlias('attribute_data')) {

                await db.product_attributes.hasOne(db.attributes, {
                    sourceKey: 'attribute_uuid',
                    foreignKey: 'attribute_uuid',
                    as: 'attribute_data'
                });
            }

            // Association with Attribute Group and Attributes
            if (!db.attributes.hasAlias('attr_groups') && !db.attributes.hasAlias('attribute_group')) {
                await db.attributes.hasOne(db.attr_groups, {
                    sourceKey: 'attr_group_uuid',
                    foreignKey: 'attr_group_uuid',
                    as: 'attribute_group'
                });
            }

            // Association with Attribute Group and Attributes
            if (!db.products.hasAlias('related_product') && !db.products.hasAlias('related_products')) {
                await db.products.hasMany(db.related_product, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'base_prod_uuid',
                    as: 'related_products'
                });
            }

            if (!db.related_product.hasAlias('products') && !db.related_product.hasAlias('related_prod')) {
                await db.related_product.hasOne(db.products, {
                    sourceKey: 'prod_uuid',
                    foreignKey: 'prod_uuid',
                    as: 'related_prod'
                });
            }
            // ### ASSOCIATION ENDS ### //

            // Find Triggered Product
            const findProduct = await db.products.findOne({
                include: [
                    { model: db.categories, as: 'category' }, // Include Product Category
                    { model: db.product_gallery, as: 'gallery' }, // Include Gallery Images from Product Gallery
                    { model: db.product_dimension, as: 'dimensions' }, // Include Product Dimensions
                    { model: db.brands, as: 'brand' }, // Inlcude Brand
                    {
                        model: db.users, as: 'created_by', // Include User who created the product and his roles
                        include: {
                            model: db.roles,
                            as: 'roles'
                        }
                    },
                    {
                        model: db.discount_type, as: 'discount_type', // Include Discount Types Along with Customer Groups
                        include: {
                            model: db.customer_groups,
                            as: 'customer_group'
                        }
                    },
                    {
                        model: db.partof_product, as: 'part_of_products', // Include Part of Product along with Part Products
                        include: {
                            model: db.products,
                            as: 'part_product'
                        }
                    },
                    {
                        model: db.product_attributes, as: 'prod_attributes', // Include Product Attributes along with Attributes and Attributes Group
                        include: {
                            model: db.attributes,
                            as: 'attribute_data',
                            include: {
                                model: db.attr_groups,
                                as: 'attribute_group'
                            }
                        }
                    },
                    {
                        model: db.related_product, as: 'related_products', // Include Related Products
                        include: {
                            model: db.products,
                            as: 'related_prod'
                        }
                    },
                ],
                where: {
                    [Op.and]: [{
                        prod_uuid,
                        tenant_id: TENANTID
                    }]
                },
            });

            // Return Final Data
            return {
                message: "Get Single Product Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: findProduct
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

            // Find ALL Product
            const allProducts = await db.products.findAll({
                where: { tenant_id },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Return If Success
            if (allProducts) {
                return {
                    message: "Get Product List Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allProducts
                }
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
    // Update Thumbnail Helper
    updateThumbnail: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { prod_uuid, prod_thumbnail } = req;

            // Find The Product
            const findProduct = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        prod_uuid,
                        tenant_id: TENANTID
                    }]

                }
            });

            // Delete Previous Thumbnail for Update Thumbnail
            if (prod_thumbnail) {
                // Delete Previous S3 Image From Product Folder
                const product_image_src = config.get("AWS.PRODUCT_IMG_THUMB_DEST").split("/")
                const product_image_bucketName = product_image_src[0];
                const product_image_folder = product_image_src.slice(1).join("/");
                await deleteFile({ idf: prod_uuid, folder: product_image_folder, fileName: findProduct.prod_thumbnail, bucketName: product_image_bucketName });
            }

            // Upload New Product Thumbnail
            let thumbName;
            // Upload New Image to AWS S3
            const product_image_src = config.get("AWS.PRODUCT_IMG_THUMB_SRC").split("/")
            const product_image_bucketName = product_image_src[0];
            const product_image_folder = product_image_src.slice(1).join("/");
            const imageUrl = await singleFileUpload({ file: prod_thumbnail, idf: findProduct.prod_uuid, folder: product_image_folder, fileName: findProduct.prod_uuid, bucketName: product_image_bucketName });
            if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

            // Update Product with New Thumbnail Name
            thumbName = imageUrl.Key.split('/').slice(-1)[0];

            // Find and Update Product Thumb Name By UUID
            const productThumbUpdate = {
                prod_thumbnail: thumbName
            }
            const updateProductWithThumb = await db.products.update(productThumbUpdate, {
                where: {
                    [Op.and]: [{
                        prod_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateProductWithThumb) return { message: "Product Thumbnail Update Failed!!!", status: false }


            // Return Formation
            return {
                message: "Product Thumbnail Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Delete Gallery Helper
    deleteGalleryImage: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { prod_uuid, prod_gallery_uuid } = req;


            // Find Product Gallery
            const findGallery = await db.product_gallery.findOne({
                where: {
                    [Op.and]: [{
                        prod_gallery_uuid,
                        prod_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findGallery) return { message: "Couldnt Find The Gallery From DB!!!", status: false }

            if (findGallery) {
                // Delete Gallery S3 Image From Product Folder
                const product_image_src = config.get("AWS.PRODUCT_IMG_GALLERY_DEST").split("/")
                const product_image_bucketName = product_image_src[0];
                const product_image_folder = product_image_src.slice(1).join("/");
                await deleteFile({ idf: prod_uuid, folder: product_image_folder, fileName: findGallery.prod_image, bucketName: product_image_bucketName });

            } else {
                return {
                    message: "Gallery Image Couldnt Deleted From S3!!!",
                    status: false,
                    tenant_id: TENANTID
                }
            }

            // Delete Gallery Image From DB
            const deleteGlryImgFromDB = await db.product_gallery.destroy({
                where: {
                    [Op.and]: [{
                        prod_gallery_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!deleteGlryImgFromDB) return { message: "Gallery Image Delete Failed From DB!!!", status: false }

            // Return Formation
            return {
                message: "Gallery Image Deleted Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }




        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // Upload New Gallery Image
    uploadGalleryImage: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // Data From Request
            const { prod_uuid, gallery_img } = req;

            // Find Product
            const findProduct = await db.products.findOne({
                where: {
                    [Op.and]: [{
                        prod_uuid,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findProduct) return { message: "Couldnt Found This Product!!!", status: false };


            if (gallery_img) {
                // Upload New Gallery Image
                let gallery = [];
                // Upload Image to AWS S3
                const product_gallery_src = config.get("AWS.PRODUCT_IMG_GALLERY_SRC").split("/")
                const product_gallery_bucketName = product_gallery_src[0];
                const product_gallery_folder = product_gallery_src.slice(1).join("/");
                const imageUrl = await multipleFileUpload({ file: gallery_img, idf: findProduct.prod_uuid, folder: product_gallery_folder, fileName: findProduct.prod_uuid, bucketName: product_gallery_bucketName });
                if (!imageUrl) return { message: "New Gallery Image Couldnt Uploaded Properly!!!", status: false };

                // Assign Values To Gallery Array For Bulk Create
                imageUrl.forEach(async (galleryImg) => {
                    await gallery.push({ prod_image: galleryImg.upload.Key.split('/').slice(-1)[0], prod_uuid: findProduct.prod_uuid, tenant_id: TENANTID });
                });

                // If Gallery Array Created Successfully then Bulk Create In Product Gallery Table
                if (gallery && gallery.length > 0) {
                    // Product Gallery Save Bulk
                    const prodGalleryImgSave = await db.product_gallery.bulkCreate(gallery);
                    if (!prodGalleryImgSave) return { message: "New Product Gallery Image Save Failed!!!", status: false }
                }

                // Return Formation
                return {
                    message: "New Gallery Image Added Successfully!!!",
                    status: true,
                    tenant_id: TENANTID
                }

            } else {
                return {
                    message: "You Didnt Uploaded Gallery Image!!!",
                    status: false
                }
            }



        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}