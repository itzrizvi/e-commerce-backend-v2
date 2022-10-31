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
                brand_id,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                taxable,
                is_featured,
                prod_condition,
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
            const checkExists = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        prod_slug,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (checkExists) return { message: "Already Have This Product!!!", status: false };

            // If SKU Exists
            if (prod_sku) {
                // Check Existence
                const checkSKUExists = await db.product.findOne({
                    where: {
                        [Op.and]: [{
                            prod_sku,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (checkSKUExists) return { message: "Already Have This SKU In Product!!!", status: false };
            }
            // If Part Number Exists
            if (prod_partnum) {
                // Check Existence
                const checkPNExists = await db.product.findOne({
                    where: {
                        [Op.and]: [{
                            prod_partnum,
                            tenant_id: TENANTID
                        }]
                    }
                });
                if (checkPNExists) return { message: "Already Have This Part Number In Product!!!", status: false };
            }


            // Dimensions Table Data Insertion
            let dimension_id;
            if (dimensions) {
                // Insert Data In Dimension Table
                dimensions.tenant_id = TENANTID;
                const insertDimension = await db.product_dimension.create(dimensions);
                if (!insertDimension) return { message: "Dimension Data Insert Failed!!", status: false };

                // Discount Type UUID
                dimension_id = insertDimension.id
            }

            // Create Product Without Image First
            const createProduct = await db.product.create({
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
                brand_id,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_outofstock_status,
                prod_status,
                taxable,
                is_featured,
                prod_condition,
                dimension_id,
                prod_thumbnail: "demo.jpg",
                added_by: user.id,
                tenant_id: TENANTID
            });
            if (!createProduct) return { message: "Product Create Failed!!!", status: false }



            // Upload Product Thumbnail
            let thumbName;
            // Upload Image to AWS S3
            const product_image_src = config.get("AWS.PRODUCT_IMG_THUMB_SRC").split("/")
            const product_image_bucketName = product_image_src[0];
            const product_image_folder = product_image_src.slice(1).join("/");
            const imageUrl = await singleFileUpload({ file: prod_thumbnail, idf: createProduct.id, folder: product_image_folder, fileName: createProduct.id, bucketName: product_image_bucketName });
            if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

            // Update Product with Thumbnail Name
            thumbName = imageUrl.Key.split('/').slice(-1)[0];
            // Find and Update Product Thumb Name By UUID
            const productThumbUpdate = {
                prod_thumbnail: thumbName
            }
            const updateProductWithThumb = await db.product.update(productThumbUpdate, {
                where: {
                    [Op.and]: [{
                        id: createProduct.id,
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
                const imageUrl = await multipleFileUpload({ file: prod_gallery, idf: createProduct.id, folder: product_gallery_folder, fileName: createProduct.id, bucketName: product_gallery_bucketName });
                if (!imageUrl) return { message: "Gallery Images Couldnt Uploaded Properly!!!", status: false };

                // Assign Values To Gallery Array For Bulk Create
                imageUrl.forEach(async (galleryImg) => {
                    await gallery.push({ prod_image: galleryImg.upload.Key.split('/').slice(-1)[0], prod_id: createProduct.id, tenant_id: TENANTID });
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
                    element.prod_id = createProduct.id;
                });

                // Product Attributes Save Bulk
                const prodAttributesDataSave = await db.product_attribute.bulkCreate(product_attributes);
                if (!prodAttributesDataSave) return { message: "Product Attributes Data Save Failed!!!", status: false }
            }


            // If Related Products Are Available For Add
            if (related_product && related_product.length > 0) {
                let relatedProducts = [];
                related_product.forEach(async (productID) => {
                    await relatedProducts.push({ prod_id: productID, base_prod_id: createProduct.id, tenant_id: TENANTID });
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
                    element.prod_id = createProduct.id;
                });
                // Insert Data In Discount Type Table
                const insertDiscountType = await db.discount_type.bulkCreate(discount_type);
                if (!insertDiscountType) return { message: "Discount Table Data Insert Failed!!", status: false };
            }


            // If Part of Product Available
            if (partof_product && partof_product.length > 0) {

                partof_product.forEach(part => {
                    part.parent_prod_id = createProduct.id;
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
            const id = req.prod_id;

            // ### ASSOCIATION STARTS ### //
            // Check If Has Alias with Categories
            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }
            // Check If Has Alias with Users and Roles
            if (!db.product.hasAlias('users') && !db.product.hasAlias('created_by')) {

                await db.product.hasOne(db.user, {
                    sourceKey: 'added_by',
                    foreignKey: 'id',
                    as: 'created_by'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Product Gallery Associations
            if (!db.product.hasAlias('product_gallery') && !db.product.hasAlias('gallery')) {

                await db.product.hasMany(db.product_gallery, {
                    foreignKey: 'prod_id',
                    as: 'gallery'
                });
            }

            // Discount Type + Customer Group Association
            if (!db.product.hasAlias('discount_type')) {

                await db.product.hasMany(db.discount_type, {
                    foreignKey: 'prod_id',
                    as: 'discount_type'
                });
            }

            if (!db.discount_type.hasAlias('customer_groups') && !db.discount_type.hasAlias('customer_group')) {

                await db.discount_type.hasOne(db.customer_group, {
                    sourceKey: 'customer_group_id',
                    foreignKey: 'id',
                    as: 'customer_group'
                });
            }

            // Dimension Table Association with Product
            if (!db.product.hasAlias('product_dimension') && !db.product.hasAlias('dimensions')) {

                await db.product.hasOne(db.product_dimension, {
                    sourceKey: 'dimension_id',
                    foreignKey: 'id',
                    as: 'dimensions'
                });
            }
            // Brand Table Association with Product
            if (!db.product.hasAlias('brands') && !db.product.hasAlias('brand')) {

                await db.product.hasOne(db.brand, {
                    sourceKey: 'brand_id',
                    foreignKey: 'id',
                    as: 'brand'
                });
            }

            // Part of Product Table Association with Product
            if (!db.product.hasAlias('partof_product') && !db.product.hasAlias('part_of_products')) {

                await db.product.hasMany(db.partof_product, {
                    foreignKey: 'parent_prod_id',
                    as: 'part_of_products'
                });
            }
            if (!db.partof_product.hasAlias('products') && !db.partof_product.hasAlias('part_product')) {

                await db.partof_product.hasOne(db.product, {
                    sourceKey: 'prod_id',
                    foreignKey: 'id',
                    as: 'part_product'
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

            // Association with Attribute Group and Attributes
            if (!db.product.hasAlias('related_product') && !db.product.hasAlias('related_products')) {
                await db.product.hasMany(db.related_product, {
                    foreignKey: 'base_prod_id',
                    as: 'related_products'
                });
            }

            if (!db.related_product.hasAlias('products') && !db.related_product.hasAlias('related_prod')) {
                await db.related_product.hasOne(db.product, {
                    sourceKey: 'prod_id',
                    foreignKey: 'id',
                    as: 'related_prod'
                });
            }
            // ### ASSOCIATION ENDS ### //

            // Find Triggered Product
            const findProduct = await db.product.findOne({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_gallery, as: 'gallery' }, // Include Gallery Images from Product Gallery
                    { model: db.product_dimension, as: 'dimensions' }, // Include Product Dimensions
                    { model: db.brand, as: 'brand' }, // Inlcude Brand
                    {
                        model: db.user, as: 'created_by', // Include User who created the product and his roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    },
                    {
                        model: db.discount_type, as: 'discount_type', // Include Discount Types Along with Customer Groups
                        include: {
                            model: db.customer_group,
                            as: 'customer_group'
                        }
                    },
                    {
                        model: db.partof_product, as: 'part_of_products', // Include Part of Product along with Part Products
                        include: {
                            model: db.product,
                            as: 'part_product'
                        }
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
                    },
                    {
                        model: db.related_product, as: 'related_products', // Include Related Products
                        include: {
                            model: db.product,
                            as: 'related_prod'
                        }
                    },
                ],
                where: {
                    [Op.and]: [{
                        id,
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
            if (error) console.log("ERROR FROM TRY CATCH: ", error)
            // if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    // GET Product List Helper
    getProductList: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##
            // Check If Has Alias with Categories
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
            // ## ASSOCIATION ENDS ##

            // Find ALL Product
            const allProducts = await db.product.findAll({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
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
                    },
                ],
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
    updateProduct: async (req, db, user, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Request
            const { prod_id,
                prod_name,
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
                brand_id,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_status,
                taxable,
                is_featured,
                prod_condition,
                prod_outofstock_status,
                related_product,
                dimensions,
                discount_type,
                product_attributes,
                partof_product } = req;

            // FIND TARGETED PRODUCT
            const findProd = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_id,
                        tenant_id: TENANTID
                    }]
                }
            })

            // If Product Name is Also Updated
            let prod_slug;
            if (prod_name) {
                // Product Slug
                prod_slug = slugify(`${prod_name}`, {
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true,
                    strict: true,
                    trim: true
                });

                // Check Existence
                const checkSlugExists = await db.product.findOne({
                    where: {
                        [Op.and]: [{
                            prod_slug,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: prod_id
                        }]
                    }
                });
                if (checkSlugExists) return { message: "Already Have This Product!!!", status: false };
            }

            // If SKU Updated
            if (prod_sku) {
                // Check Existence
                const checkSKUExists = await db.product.findOne({
                    where: {
                        [Op.and]: [{
                            prod_sku,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: prod_id
                        }]
                    }
                });
                if (checkSKUExists) return { message: "Already Have This SKU In Product!!!", status: false };
            }
            // If Part Number Updated
            if (prod_partnum) {
                // Check Existence
                const checkPNExists = await db.product.findOne({
                    where: {
                        [Op.and]: [{
                            prod_partnum,
                            tenant_id: TENANTID
                        }],
                        [Op.not]: [{
                            id: prod_id
                        }]
                    }
                });
                if (checkPNExists) return { message: "Already Have This Part Number In Product!!!", status: false };
            }
            // If Dimension Updated 
            let dimension_id;
            if (dimensions) {
                dimensions.tenant_id = TENANTID;
                // If Dimension Already Have Created
                if (findProd.dimension_id) {
                    // Update Dimension
                    const updateDimension = await db.product_dimension.update(dimensions, {
                        where: {
                            [Op.and]: [{
                                id: findProd.dimension_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!updateDimension) return { message: "Product Dimension Couldnt Updated!!!", status: false }

                } else { // If Not Have Dimensions

                    const insertDimension = await db.product_dimension.create(dimensions);
                    if (!insertDimension) return { message: "Dimension Data Insert Failed!!", status: false };

                    // Discount Type UUID
                    dimension_id = insertDimension.id
                }

            }
            // If Related Product is Updated
            if (related_product && related_product.length > 0) {
                // Delete Previous Entry
                await db.related_product.destroy({
                    where: {
                        [Op.and]: [{
                            base_prod_id: prod_id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                let newRelatedProducts = [];
                related_product.forEach(async (productID) => {
                    await newRelatedProducts.push({ prod_id: productID, base_prod_id: findProd.id, tenant_id: TENANTID });
                });

                if (newRelatedProducts) {
                    // New Related Product Save Bulk
                    const newRelatedProdSave = await db.related_product.bulkCreate(newRelatedProducts);
                    if (!newRelatedProdSave) return { message: "Related Products Update Failed!!!", status: false }
                }
            }
            // If Discount Type of Product is Updated
            if (discount_type && discount_type.length > 0) {
                // Delete Previous Entry
                await db.discount_type.destroy({
                    where: {
                        [Op.and]: [{
                            prod_id: findProd.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Loop For Assign Other Values to Discount Type  Data
                discount_type.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.prod_id = findProd.id;
                });
                // Insert Data In Discount Type Table
                const insertNewDiscountTypes = await db.discount_type.bulkCreate(discount_type);
                if (!insertNewDiscountTypes) return { message: "Updated Discount Type Data Insert Failed!!", status: false };
            }
            // If Product Attributes is Updated
            if (product_attributes && product_attributes.length > 0) {
                // Delete Previous Entry
                await db.product_attribute.destroy({
                    where: {
                        [Op.and]: [{
                            prod_id: findProd.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                // Loop For Assign Other Values to Product Attribites Data
                product_attributes.forEach(element => {
                    element.tenant_id = TENANTID;
                    element.prod_id = findProd.id;
                });

                // Product Attributes Save Bulk
                const newProdAttributesDataSave = await db.product_attribute.bulkCreate(product_attributes);
                if (!newProdAttributesDataSave) return { message: "Updated Product Attributes Data Save Failed!!!", status: false }
            }
            // If Part of Product is Updated
            if (partof_product && partof_product.length > 0) {
                // Delete Previous Entry
                await db.partof_product.destroy({
                    where: {
                        [Op.and]: [{
                            parent_prod_id: findProd.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                partof_product.forEach(part => {
                    part.parent_prod_id = findProd.id;
                    part.tenant_id = TENANTID;
                });

                // Part Of Product Save Bulk
                const newPartOfProdSave = await db.partof_product.bulkCreate(partof_product);
                if (!newPartOfProdSave) return { message: "Updated Part Of Products Data Save Failed!!!", status: false }
            }

            // Final Update Doc For Product Table
            const prodUpdateDoc = {
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
                brand_id,
                prod_category,
                prod_weight,
                prod_weight_class,
                prod_status,
                taxable,
                is_featured,
                prod_condition,
                prod_outofstock_status,
                dimension_id,
                added_by: user.id
            }

            // Update Product
            const updateProd = await db.product.update(prodUpdateDoc, {
                where: {
                    [Op.and]: [{
                        id: findProd.id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateProd) return { message: "Product Update Failed!!!", status: false }


            // Return Formation
            return {
                message: "Product Updated Successfully!!!",
                status: true,
                tenant_id: TENANTID
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
            const { prod_id, prod_thumbnail } = req;

            // Find The Product
            const findProduct = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_id,
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
                await deleteFile({ idf: findProduct.id, folder: product_image_folder, fileName: findProduct.prod_thumbnail, bucketName: product_image_bucketName });
            }

            // Upload New Product Thumbnail
            let thumbName;
            // Upload New Image to AWS S3
            const product_image_src = config.get("AWS.PRODUCT_IMG_THUMB_SRC").split("/")
            const product_image_bucketName = product_image_src[0];
            const product_image_folder = product_image_src.slice(1).join("/");
            const imageUrl = await singleFileUpload({ file: prod_thumbnail, idf: findProduct.id, folder: product_image_folder, fileName: findProduct.id, bucketName: product_image_bucketName });
            if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };

            // Update Product with New Thumbnail Name
            thumbName = imageUrl.Key.split('/').slice(-1)[0];

            // Find and Update Product Thumb Name By UUID
            const productThumbUpdate = {
                prod_thumbnail: thumbName
            }
            const updateProductWithThumb = await db.product.update(productThumbUpdate, {
                where: {
                    [Op.and]: [{
                        id: prod_id,
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
            const { prod_id, prod_gallery_id } = req;


            // Find Product Gallery
            const findGallery = await db.product_gallery.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_gallery_id,
                        prod_id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!findGallery) return { message: "Couldnt Find The Gallery From DB!!!", status: false }

            // Find The Product
            const findProduct = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_id,
                        tenant_id: TENANTID
                    }]

                }
            });

            if (findGallery) {
                // Delete Gallery S3 Image From Product Folder
                const product_image_src = config.get("AWS.PRODUCT_IMG_GALLERY_DEST").split("/")
                const product_image_bucketName = product_image_src[0];
                const product_image_folder = product_image_src.slice(1).join("/");
                await deleteFile({ idf: findProduct.id, folder: product_image_folder, fileName: findGallery.prod_image, bucketName: product_image_bucketName });

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
                        id: prod_gallery_id,
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
            const { prod_id, gallery_img } = req;

            // Find Product
            const findProduct = await db.product.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_id,
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
                const imageUrl = await multipleFileUpload({ file: gallery_img, idf: findProduct.id, folder: product_gallery_folder, fileName: findProduct.id, bucketName: product_gallery_bucketName });
                if (!imageUrl) return { message: "New Gallery Image Couldnt Uploaded Properly!!!", status: false };

                // Assign Values To Gallery Array For Bulk Create
                imageUrl.forEach(async (galleryImg) => {
                    await gallery.push({ prod_image: galleryImg.upload.Key.split('/').slice(-1)[0], prod_id: findProduct.id, tenant_id: TENANTID });
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
    },
    // GET Featured Products Helper
    getFeaturedProducts: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##
            // Check If Has Alias with Categories
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
            // ## ASSOCIATION ENDS ##


            // Find ALL Featured Product
            const allFeaturedProducts = await db.product.findAll({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
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
                    },
                ],
                where: {
                    [Op.and]: [{
                        tenant_id,
                        is_featured: true
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Return If Success
            if (allFeaturedProducts) {
                return {
                    message: "Get All Featured Product Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allFeaturedProducts
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    recentViewProduct: async (req, db, user, isAuth, TENANTID, ip) => {
        try {
            // GET DATA
            const { product_id } = req;

            if (isAuth) {
                const checkExist = await db.recent_view_product.findOne({
                    where: {
                        [Op.and]: [{
                            product_id,
                            user_id: user.id,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (!checkExist) {
                    db.recent_view_product.create({
                        product_id,
                        user_id: user.id,
                        tenant_id: TENANTID
                    });
                }
            } else {
                const checkExistbyIP = await db.recent_view_product.findOne({
                    where: {
                        [Op.and]: [{
                            product_id,
                            user_ip: ip,
                            tenant_id: TENANTID
                        }]
                    }
                });

                if (!checkExistbyIP) {
                    db.recent_view_product.create({
                        product_id,
                        user_ip: ip,
                        tenant_id: TENANTID
                    });
                }
            }


            return {
                tenant_id: TENANTID,
                message: "Successfully Relink Recent View Product.",
                status: true,
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    getRecentViewProducts: async (req, db, user, isAuth, TENANTID, ip) => {
        try {
            const allRecentViewProducts = [];

            if (!db.recent_view_product.hasAlias('product')) {

                await db.recent_view_product.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            if (isAuth) {
                allRecentViewProducts = await db.recent_view_product.findAll({
                    limit: req.max ?? 20,
                    include: [
                        { model: db.product, as: 'product' }
                    ],
                    where: {
                        [Op.and]: [{
                            tenant_id: TENANTID,
                            user_id: user.id
                        }]
                    },
                    order: [['updatedAt', 'DESC']]
                });
            } else {
                allRecentViewProducts = await db.recent_view_product.findAll({
                    limit: req.max ?? 20,
                    include: [
                        { model: db.product, as: 'product' }
                    ],
                    where: {
                        [Op.and]: [{
                            tenant_id: TENANTID,
                            user_ip: ip
                        }]
                    },
                    order: [['updatedAt', 'DESC']]
                });
            }

            // Return If Success
            if (allRecentViewProducts) {
                return {
                    message: "Get Recent View Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allRecentViewProducts
                }
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
}