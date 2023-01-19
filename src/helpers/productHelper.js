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
                prod_outofstock_status,
                prod_status,
                taxable,
                is_featured,
                is_sale,
                is_serial,
                cost,
                prod_condition,
                extended_warranty,
                extended_warranty_value,
                location,
                hs_code,
                product_rank,
                mfg_build_part_number,
                product_rep,
                related_product,
                prod_thumbnail,
                prod_gallery,
                dimensions,
                weight,
                discount_type,
                product_attributes,
                partof_product } = req;


            const findProductCondition = await db.product_condition.findOne({
                where: {
                    [Op.and]: [{
                        id: prod_condition,
                        tenant_id: TENANTID
                    }]
                }
            });
            const conditionSlug = findProductCondition.slug;

            // Product Slug
            const prod_slug = slugify(`${prod_name}-${prod_partnum}-${conditionSlug}`, {
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
                        prod_partnum,
                        prod_condition,
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
                prod_outofstock_status,
                prod_status,
                taxable,
                cost,
                is_featured,
                is_sale,
                is_serial,
                prod_condition,
                extended_warranty,
                extended_warranty_value,
                location,
                hs_code,
                product_rank,
                mfg_build_part_number,
                product_rep,
                prod_thumbnail: "demo.jpg",
                added_by: user.id,
                tenant_id: TENANTID
            });
            if (!createProduct) return { message: "Product Create Failed!!!", status: false }

            if (product_attributes && product_attributes.length > 0) {
                //
                await product_attributes.forEach(async (element) => {
                    element.tenant_id = TENANTID;
                    element.prod_id = createProduct.id;
                    if (element.attribute_type === "file" && element.attribute_value.file) {
                        // Upload New ATTR File to AWS S3
                        const fileName = `${Math.ceil(Date.now() + Math.random())}-${createProduct.id}`;
                        const file = element.attribute_value.file;
                        element.attribute_value = `${fileName}.${file.filename.split('.').slice(-1)[0]}`;
                        const product_attribute_src = config.get("AWS.ATTRIBUTE_FILE_SRC").split("/")
                        const product_attr_bucketName = product_attribute_src[0];
                        const product_attr_folder = product_attribute_src.slice(1).join("/");

                        const fileUrl = await singleFileUpload({ file: file, idf: createProduct.id, folder: product_attr_folder, fileName: fileName, bucketName: product_attr_bucketName });
                        if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };
                    }
                });
            }

            // Dimensions Table Data Insertion
            if (dimensions) {
                // Insert Data In Dimension Table
                dimensions.tenant_id = TENANTID;
                dimensions.product_id = createProduct.id;
                dimensions.created_by = user.id;
                const insertDimension = await db.product_dimension.create(dimensions);
                if (!insertDimension) return { message: "Dimension Data Insert Failed!!", status: false };
            }

            // Weight Table Data Insertion
            if (weight) {
                // Insert Data In Dimension Table
                weight.tenant_id = TENANTID;
                weight.product_id = createProduct.id;
                weight.created_by = user.id;
                const insertWeight = await db.product_weight.create(weight);
                if (!insertWeight) return { message: "Weight Data Insert Failed!!", status: false };
            }


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
                    foreignKey: 'product_id',
                    as: 'dimensions'
                });
            }

            // 
            if (!db.product_dimension.hasAlias('dimension_class') && !db.product_dimension.hasAlias('dimensionClass')) {

                await db.product_dimension.hasOne(db.dimension_class, {
                    sourceKey: 'dimension_class_id',
                    foreignKey: 'id',
                    as: 'dimensionClass'
                });
            }

            // Weight Table Association with Product
            if (!db.product.hasAlias('product_weight') && !db.product.hasAlias('weight')) {

                await db.product.hasOne(db.product_weight, {
                    foreignKey: 'product_id',
                    as: 'weight'
                });
            }

            // 
            if (!db.product_weight.hasAlias('weight_class') && !db.product_weight.hasAlias('weightClass')) {

                await db.product_weight.hasOne(db.weight_class, {
                    sourceKey: 'weight_class_id',
                    foreignKey: 'id',
                    as: 'weightClass'
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

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('productCondition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'productCondition'
                });
            }

            // Availability Status Table Association with Product
            if (!db.product.hasAlias('product_availability_status') && !db.product.hasAlias('productavailablitystatus')) {
                await db.product.hasOne(db.product_availability_status, {
                    sourceKey: 'prod_outofstock_status',
                    foreignKey: 'id',
                    as: 'productavailablitystatus'
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

            if (!db.related_product.hasAlias('product') && !db.related_product.hasAlias('related_prod')) {
                await db.related_product.hasOne(db.product, {
                    sourceKey: 'prod_id',
                    foreignKey: 'id',
                    as: 'related_prod'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.product.hasAlias('user') && !db.product.hasAlias('created_by')) {

                await db.product.hasOne(db.user, {
                    sourceKey: 'added_by',
                    foreignKey: 'id',
                    as: 'created_by'
                });
            }

            // Check If Has Alias with Users and Product
            if (!db.product.hasAlias('user') && !db.product.hasAlias('representative')) {

                await db.product.hasOne(db.user, {
                    sourceKey: 'product_rep',
                    foreignKey: 'id',
                    as: 'representative'
                });
            }


            // ### ASSOCIATION ENDS ### //

            // Find Triggered Product
            const findProduct = await db.product.findOne({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_gallery, as: 'gallery' }, // Include Gallery Images from Product Gallery
                    {
                        model: db.product_dimension, as: 'dimensions',
                        include: {
                            model: db.dimension_class,
                            as: 'dimensionClass'
                        }
                    }, // Include Product Dimensions
                    {
                        model: db.product_weight, as: 'weight',
                        include: {
                            model: db.weight_class,
                            as: 'weightClass'
                        }
                    }, // Include Product Weight
                    { model: db.product_condition, as: 'productCondition' }, // Include Product Condition
                    { model: db.product_availability_status, as: 'productavailablitystatus' }, // Include Product Condition
                    { model: db.brand, as: 'brand' }, // Inlcude Brand
                    {
                        model: db.user, as: 'created_by', // Include User who created the product and his roles
                        include: {
                            model: db.role,
                            as: 'roles'
                        }
                    },
                    {
                        model: db.user, as: 'representative', // 
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


            // Condition Assign
            if (findProduct.productCondition) {
                findProduct.prod_condition = findProduct.productCondition.name
            } else {
                findProduct.prod_condition = 'N/A'
            }

            // Availability Status Assign
            if (findProduct.productavailablitystatus) {
                findProduct.prod_outofstock_status = findProduct.productavailablitystatus.name
            } else {
                findProduct.prod_outofstock_status = 'N/A'
            }

            // console.log(findProduct)
            // Return Final Data
            return {
                message: "Get Single Product Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: findProduct
            }



        } catch (error) {
            if (error) console.log("ERROR FROM TRY CATCH: ", error)
            // if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Product List Helper
    getProductList: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            const { searchQuery,
                availability,
                category,
                productEntryStartDate,
                productEntryEndDate,
                updatedStartDate,
                updatedEndDate,
                condition,
                attribute,
                minPrice,
                maxPrice,
                productRep } = req;
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

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
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
            // Condtional Date Filters
            const twoDateFilterWhere = productEntryStartDate && productEntryEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(productEntryStartDate),
                    [Op.lte]: new Date(productEntryEndDate),
                }]
            } : {};

            const startDateFilterWhere = (productEntryStartDate && !productEntryEndDate) ? {
                [Op.gte]: new Date(productEntryStartDate)
            } : {};

            const endDateFilterWhere = (productEntryEndDate && !productEntryStartDate) ? {
                [Op.lte]: new Date(productEntryEndDate)
            } : {};

            const twoUpdatedDateFilterWhere = updatedStartDate && updatedEndDate ? {
                [Op.and]: [{
                    [Op.gte]: new Date(updatedStartDate),
                    [Op.lte]: new Date(updatedEndDate),
                }]
            } : {};

            const updatedStartDateFilterWhere = (updatedStartDate && !updatedEndDate) ? {
                [Op.gte]: new Date(updatedStartDate)
            } : {};

            const updatedEndDateFilterWhere = (updatedEndDate && !updatedStartDate) ? {
                [Op.lte]: new Date(updatedEndDate)
            } : {};

            const attributeWhere = (attribute && attribute.length) ? {
                attribute_id: attribute
            } : {};

            // Find ALL Product
            const allProducts = await db.product.findAll({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
                    {
                        model: db.product_attribute,
                        as: 'prod_attributes',
                        ...(attribute && { where: attributeWhere }), // Include Product Attributes along with Attributes and Attributes Group
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
                    tenant_id,
                    ...(searchQuery && { // 
                        prod_name: {
                            [Op.iLike]: `%${searchQuery}%`
                        }
                    }),
                    ...(availability && { // 
                        prod_outofstock_status: {
                            [Op.in]: availability
                        }
                    }),
                    ...(productRep && { // 
                        product_rep: {
                            [Op.in]: productRep
                        }
                    }),
                    ...(category && { // 
                        prod_category: {
                            [Op.in]: category
                        }
                    }),
                    ...(condition && { // 
                        prod_condition: {
                            [Op.in]: condition
                        }
                    }),
                    ...((minPrice || maxPrice) && { // 
                        prod_regular_price: {
                            [Op.and]: [{
                                [Op.gte]: minPrice ?? 0,
                                [Op.lte]: maxPrice ?? 100000
                            }]
                        }
                    }),
                    ...((productEntryStartDate || productEntryEndDate) && {
                        createdAt: {
                            [Op.or]: [{
                                ...(twoDateFilterWhere && twoDateFilterWhere),
                                ...(startDateFilterWhere && startDateFilterWhere),
                                ...(endDateFilterWhere && endDateFilterWhere),
                            }],
                        }
                    }),
                    ...((updatedStartDate || updatedEndDate) && {
                        updatedAt: {
                            [Op.or]: [{
                                ...(twoUpdatedDateFilterWhere && twoUpdatedDateFilterWhere),
                                ...(updatedStartDateFilterWhere && updatedStartDateFilterWhere),
                                ...(updatedEndDateFilterWhere && updatedEndDateFilterWhere),
                            }],
                        }
                    })
                },
                order: [
                    ['updatedAt', 'DESC']
                ]
            });

            // Condition Assign
            await allProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
                prod_status,
                taxable,
                is_featured,
                is_sale,
                is_serial,
                cost,
                prod_condition,
                extended_warranty,
                extended_warranty_value,
                location,
                hs_code,
                product_rank,
                mfg_build_part_number,
                product_rep,
                prod_outofstock_status,
                related_product,
                dimensions,
                weight,
                discount_type,
                product_attributes,
                partof_product } = req;

            if (product_attributes && product_attributes.length > 0) {
                //
                await product_attributes.forEach(async (element) => {
                    element.tenant_id = TENANTID;
                    element.prod_id = prod_id;
                    if (element.attribute_type === "file" && element.attribute_value.file) {
                        // Upload New ATTR File to AWS S3
                        const fileName = `${Math.ceil(Date.now() + Math.random())}-${prod_id}`;
                        const file = element.attribute_value.file;
                        element.attribute_value = `${fileName}.${file.filename.split('.').slice(-1)[0]}`;
                        const product_attribute_src = config.get("AWS.ATTRIBUTE_FILE_SRC").split("/")
                        const product_attr_bucketName = product_attribute_src[0];
                        const product_attr_folder = product_attribute_src.slice(1).join("/");

                        const fileUrl = await singleFileUpload({ file: file, idf: prod_id, folder: product_attr_folder, fileName: fileName, bucketName: product_attr_bucketName });
                        if (!fileUrl) return { message: "File Couldnt Uploaded Properly!!!", status: false };

                    }
                });
            }

            let conditionSlug;
            if (prod_condition) {
                const findProductCondition = await db.product_condition.findOne({
                    where: {
                        [Op.and]: [{
                            id: prod_condition,
                            tenant_id: TENANTID
                        }]
                    }
                });
                conditionSlug = findProductCondition.slug;
            }



            // FIND TARGETED PRODUCT
            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('productCondition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'productCondition'
                });
            }
            const findProd = await db.product.findOne({
                include: [
                    { model: db.product_condition, as: 'productCondition' }, // Include Product Condition
                ],
                where: {
                    [Op.and]: [{
                        id: prod_id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Product Name is Also Updated
            let prod_slug;
            if (prod_name) {
                // Product Slug
                prod_slug = slugify(`${prod_name}-${prod_partnum ?? findProd.prod_partnum}-${conditionSlug ?? findProd.productCondition.slug}`, {
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
            if (dimensions) {
                dimensions.tenant_id = TENANTID;
                dimensions.product_id = prod_id;
                dimensions.updated_by = user.id;

                // Find Existing Dimension
                const existingDimension = await db.product_dimension.findOne({
                    where: {
                        [Op.and]: [{
                            product_id: prod_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If Dimension Already Have Created
                if (existingDimension) {
                    // Update Dimension
                    const updateDimension = await db.product_dimension.update(dimensions, {
                        where: {
                            [Op.and]: [{
                                product_id: prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!updateDimension) return { message: "Product Dimension Couldnt Updated!!!", status: false }

                } else { // If Not Have Dimensions

                    const insertDimension = await db.product_dimension.create(dimensions);
                    if (!insertDimension) return { message: "Dimension Data Insert Failed!!", status: false };
                }

            }
            // If Weight Updated 
            if (weight) {
                weight.tenant_id = TENANTID;
                weight.product_id = prod_id;
                weight.updated_by = user.id;

                // Find Existing Dimension
                const existingWeight = await db.product_weight.findOne({
                    where: {
                        [Op.and]: [{
                            product_id: prod_id,
                            tenant_id: TENANTID
                        }]
                    }
                });
                // If Dimension Already Have Created
                if (existingWeight) {
                    // Update Dimension
                    const updateWeight = await db.product_weight.update(weight, {
                        where: {
                            [Op.and]: [{
                                product_id: prod_id,
                                tenant_id: TENANTID
                            }]
                        }
                    });
                    if (!updateWeight) return { message: "Product Weight Couldnt Updated!!!", status: false }

                } else { // If Not Have Dimensions

                    const insertWeight = await db.product_weight.create(weight);
                    if (!insertWeight) return { message: "Weight Data Insert Failed!!", status: false };
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
                prod_status,
                taxable,
                is_featured,
                is_sale,
                cost,
                is_serial,
                prod_condition,
                extended_warranty,
                extended_warranty_value,
                location,
                hs_code,
                product_rank,
                mfg_build_part_number,
                product_rep,
                prod_outofstock_status,
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Featured Products Helper
    getFeaturedProducts: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##
            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }
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
                limit: 12,
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
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
                        is_featured: true,
                        prod_status: true
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Condition Assign
            await allFeaturedProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET On Sale Products Helper
    getOnSaleProducts: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##
            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }
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


            // Find ALL On Sale Product
            const allOnSaleProducts = await db.product.findAll({
                limit: 12,
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
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
                        is_sale: true,
                        prod_status: true
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Condition Assign
            await allOnSaleProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

            });

            // Return If Success
            if (allOnSaleProducts) {
                return {
                    message: "Get All On Sale Product Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allOnSaleProducts
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    recentViewProduct: async (req, db, user, isAuth, TENANTID) => {
        try {
            // GET DATA
            const { product_id } = req;

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

            return {
                tenant_id: TENANTID,
                message: "Successfully Relink Recent View Product.",
                status: true,
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    getRecentViewProducts: async (req, db, user, isAuth, TENANTID) => {
        try {

            if (!db.recent_view_product.hasAlias('product')) {

                await db.recent_view_product.hasOne(db.product, {
                    sourceKey: 'product_id',
                    foreignKey: 'id',
                    as: 'product'
                });
            }

            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

            const allRecentViewProducts = await db.recent_view_product.findAll({
                limit: req?.max ?? 10,
                include: [
                    {
                        model: db.product, as: 'product',
                        include: [
                            { model: db.category, as: 'category' },
                            { model: db.product_condition, as: 'condition' }, // Include Product Condition
                        ]
                    }
                ],
                where: {
                    [Op.and]: [{
                        tenant_id: TENANTID,
                        user_id: user.id
                    }]
                },
                order: [['updatedAt', 'DESC']]
            });

            // Array For GET All The Recent Viewed Products
            const recentlyViewedProducts = [];
            await allRecentViewProducts.forEach(async (element) => {
                await recentlyViewedProducts.push(element.product)
            });


            // Condition Assign
            await recentlyViewedProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

            });

            // Return If Success
            return {
                message: "Get Recent View Success!!!",
                status: true,
                tenant_id: TENANTID,
                data: recentlyViewedProducts
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Public Product View Helper
    publicProductView: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // Product ID From Request
            const id = req.prod_id;

            // ### ASSOCIATION STARTS ### //
            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }
            // Check If Has Alias with Categories
            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

            // Product Gallery Associations
            if (!db.product.hasAlias('product_gallery') && !db.product.hasAlias('gallery')) {

                await db.product.hasMany(db.product_gallery, {
                    foreignKey: 'prod_id',
                    as: 'gallery'
                });
            }

            // Dimension Table Association with Product
            if (!db.product.hasAlias('product_dimension') && !db.product.hasAlias('dimensions')) {

                await db.product.hasOne(db.product_dimension, {
                    foreignKey: 'product_id',
                    as: 'dimensions'
                });
            }

            // 
            if (!db.product_dimension.hasAlias('dimension_class') && !db.product_dimension.hasAlias('dimensionClass')) {

                await db.product_dimension.hasOne(db.dimension_class, {
                    sourceKey: 'dimension_class_id',
                    foreignKey: 'id',
                    as: 'dimensionClass'
                });
            }

            // Weight Table Association with Product
            if (!db.product.hasAlias('product_weight') && !db.product.hasAlias('weight')) {

                await db.product.hasOne(db.product_weight, {
                    foreignKey: 'product_id',
                    as: 'weight'
                });
            }

            // 
            if (!db.product_weight.hasAlias('weight_class') && !db.product_weight.hasAlias('weightClass')) {

                await db.product_weight.hasOne(db.weight_class, {
                    sourceKey: 'weight_class_id',
                    foreignKey: 'id',
                    as: 'weightClass'
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

            // Find Public View Product
            const findProduct = await db.product.findOne({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_gallery, as: 'gallery' }, // Include Gallery Images from Product Gallery
                    {
                        model: db.product_dimension, as: 'dimensions',
                        include: {
                            model: db.dimension_class,
                            as: 'dimensionClass'
                        }
                    }, // Include Product Dimensions
                    {
                        model: db.product_weight, as: 'weight',
                        include: {
                            model: db.weight_class,
                            as: 'weightClass'
                        }
                    }, // Include Product Weight
                    { model: db.brand, as: 'brand' }, // Inlcude Brand
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
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

            // Condition Assign
            if (findProduct.condition) {
                findProduct.prod_condition = findProduct.condition.name
            } else {
                findProduct.prod_condition = 'N/A'
            }

            // Return Final Data
            return {
                message: "Get Public View Product Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: findProduct
            }



        } catch (error) {
            if (error) console.log("ERROR FROM TRY CATCH PUBLIC VIEW PRODUCT : ", error)
            // if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Single Product By Slug Helper
    getSingleProductBySlug: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // Product ID From Request
            const { prod_slug } = req;

            // ### ASSOCIATION STARTS ### //
            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('productCondition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'productCondition'
                });
            }

            // Check If Has Alias with Categories
            if (!db.product.hasAlias('category')) {

                await db.product.hasOne(db.category, {
                    sourceKey: 'prod_category',
                    foreignKey: 'id',
                    as: 'category'
                });
            }

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
                    foreignKey: 'product_id',
                    as: 'dimensions'
                });
            }

            // 
            if (!db.product_dimension.hasAlias('dimension_class') && !db.product_dimension.hasAlias('dimensionClass')) {

                await db.product_dimension.hasOne(db.dimension_class, {
                    sourceKey: 'dimension_class_id',
                    foreignKey: 'id',
                    as: 'dimensionClass'
                });
            }

            // Weight Table Association with Product
            if (!db.product.hasAlias('product_weight') && !db.product.hasAlias('weight')) {

                await db.product.hasOne(db.product_weight, {
                    foreignKey: 'product_id',
                    as: 'weight'
                });
            }

            // 
            if (!db.product_weight.hasAlias('weight_class') && !db.product_weight.hasAlias('weightClass')) {

                await db.product_weight.hasOne(db.weight_class, {
                    sourceKey: 'weight_class_id',
                    foreignKey: 'id',
                    as: 'weightClass'
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

            if (!db.related_product.hasAlias('product') && !db.related_product.hasAlias('related_prod')) {
                await db.related_product.hasOne(db.product, {
                    sourceKey: 'prod_id',
                    foreignKey: 'id',
                    as: 'related_prod'
                });
            }

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });

            // Check If Has Alias with Users and Roles
            if (!db.product.hasAlias('user') && !db.product.hasAlias('created_by')) {

                await db.product.hasOne(db.user, {
                    sourceKey: 'added_by',
                    foreignKey: 'id',
                    as: 'created_by'
                });
            }
            // ### ASSOCIATION ENDS ### //

            // Find Triggered Product
            const findProduct = await db.product.findOne({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_gallery, as: 'gallery' }, // Include Gallery Images from Product Gallery
                    {
                        model: db.product_dimension, as: 'dimensions',
                        include: {
                            model: db.dimension_class,
                            as: 'dimensionClass'
                        }
                    }, // Include Product Dimensions
                    {
                        model: db.product_weight, as: 'weight',
                        include: {
                            model: db.weight_class,
                            as: 'weightClass'
                        }
                    }, // Include Product Weight
                    { model: db.brand, as: 'brand' }, // Inlcude Brand
                    { model: db.product_condition, as: 'productCondition' }, // Include Product Condition
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
                        prod_slug,
                        tenant_id: TENANTID
                    }]
                },
            });


            // Condition Assign
            if (findProduct.productCondition) {
                findProduct.prod_condition = findProduct.productCondition.name
            } else {
                findProduct.prod_condition = 'N/A'
            }

            // Return Final Data
            return {
                message: "Get Single Product By Slug Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: findProduct
            }



        } catch (error) {
            if (error) console.log("ERROR FROM TRY CATCH: ", error)
            // if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Product List Helper
    getProductsByIDs: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // Data From REQUEST
            const { prod_ids } = req;
            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

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
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
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
                        id: prod_ids,
                        tenant_id
                    }]
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Condition Assign
            await allProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

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
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Searched Products
    getSearchedProducts: async (req, db, TENANTID) => {

        // Try Catch Block
        try {

            // Data From REQUEST
            const { category_id, searchQuery } = req;
            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

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

            // Created By Associations
            db.user.belongsToMany(db.role, { through: db.admin_role, foreignKey: 'admin_id' });
            db.role.belongsToMany(db.user, { through: db.admin_role, foreignKey: 'role_id' });
            // Check If Has Alias with Users and Product
            if (!db.product.hasAlias('user') && !db.product.hasAlias('representative')) {

                await db.product.hasOne(db.user, {
                    sourceKey: 'product_rep',
                    foreignKey: 'id',
                    as: 'representative'
                });
            }
            // ## ASSOCIATION ENDS ##

            // Find ALL Product
            const searchedProducts = await db.product.findAll({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
                    {
                        model: db.user, as: 'representative', // 
                        include: {
                            model: db.role,
                            as: 'roles'
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
                ],
                limit: 10,
                where: {
                    ...(searchQuery && {
                        [Op.and]: [{
                            ...(category_id && { prod_category: category_id }),
                            tenant_id,
                            prod_status: true
                        }],
                        [Op.or]: [
                            {
                                prod_slug: {
                                    [Op.iLike]: `%${searchQuery}%`
                                },
                            },
                            {
                                prod_name: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                prod_sku: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                prod_partnum: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            },
                            {
                                mfg_build_part_number: {
                                    [Op.iLike]: `%${searchQuery}%`
                                }
                            }
                        ]
                    }),
                    tenant_id: TENANTID
                },
                order: [
                    ['prod_slug', 'ASC']
                ],
            });

            // Condition Assign
            await searchedProducts.forEach(async (item) => {

                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

            });

            // Return If Success
            if (searchedProducts) {
                return {
                    message: "Get Searched Products Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: searchedProducts
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Add Recent Viewed Product By Array
    addRecentViewProductByArray: async (req, db, user, isAuth, TENANTID) => {
        try {
            // GET DATA
            const { product_ids } = req;

            const checkExist = await db.recent_view_product.findAll({
                where: {
                    [Op.and]: [{
                        product_id: product_ids,
                        user_id: user.id,
                        tenant_id: TENANTID
                    }]
                }
            });

            // Extract Exists IDS
            let existingProdIDS = [];
            checkExist.forEach(async (view) => {
                await existingProdIDS.push(parseInt(view.product_id));
            });

            // Delete Duplicates
            const newProductIDs = product_ids.filter(val => !existingProdIDS.includes(val));

            // GET New Array
            const newRecentViews = [];
            newProductIDs.forEach(async (element) => {
                await newRecentViews.push({ user_id: user.id, product_id: element, tenant_id: TENANTID })
            });

            if (newRecentViews) {
                await db.recent_view_product.bulkCreate(newRecentViews);
            }

            return {
                tenant_id: TENANTID,
                message: "Successfully Added New Recent View Products.",
                status: true,
            }

        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Latest Products
    getLatestProducts: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // ## ASSOCIATION STARTS ##

            // Condition Table Association with Product
            if (!db.product.hasAlias('product_condition') && !db.product.hasAlias('condition')) {

                await db.product.hasOne(db.product_condition, {
                    sourceKey: 'prod_condition',
                    foreignKey: 'id',
                    as: 'condition'
                });
            }

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
            const latestProducts = await db.product.findAll({
                include: [
                    { model: db.category, as: 'category' }, // Include Product Category
                    { model: db.product_condition, as: 'condition' }, // Include Product Condition
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
                limit: 12,
                where: {
                    tenant_id,
                    prod_status: true
                },
                order: [
                    ['createdAt', 'DESC']
                ],
            });

            // Condition Assign
            await latestProducts.forEach(async (item) => {
                if (item.condition) {
                    item.prod_condition = item.condition.name
                } else {
                    item.prod_condition = 'N/A'
                }

            });

            // Return If Success
            if (latestProducts) {
                return {
                    message: "Get Latest Products Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: latestProducts
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // Update Product Is Serial Helper
    changeProductIsSerial: async (req, db, user, TENANTID) => {

        // Try Catch Block
        try {

            // Data From Reqeust
            const { id, is_serial } = req;

            // Update Product Is Serial
            const updateProdIsSerial = await db.product.update({
                is_serial: is_serial
            }, {
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });
            if (!updateProdIsSerial) return { message: "Product Is Serial Status Change Failed!!!", status: false }


            // Return Formation
            return {
                message: "Product Is Serial Status Changed Successfully!!!",
                status: true,
                tenant_id: TENANTID
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Dimension Class List
    getDimensionClassList: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // List
            const allDimensionClass = await db.dimension_class.findAll({
                where: { tenant_id },
                order: [
                    ['name', 'ASC']
                ],
            });

            // Return If Success
            if (allDimensionClass) {
                return {
                    message: "Get Deimension Class List Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allDimensionClass
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET Weight Class List
    getWeightClassList: async (db, TENANTID) => {

        // Try Catch Block
        try {

            // TENANT ID
            const tenant_id = TENANTID;

            // List
            const allWeightClass = await db.weight_class.findAll({
                where: { tenant_id },
                order: [
                    ['name', 'ASC']
                ],
            });

            // Return If Success
            if (allWeightClass) {
                return {
                    message: "Get Weight Class List Success!!!",
                    status: true,
                    tenant_id: TENANTID,
                    data: allWeightClass
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
}