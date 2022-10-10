// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');

// BRAND HELPER
module.exports = {
    // Create Brand HELPER
    createBrand: async (req, db, user, isAuth, TENANTID) => {

        // Try Catch Block
        try {
            // Data From Req
            const { brandName, brandDescription, brandStatus, brandSortOrder, categories } = req;

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
                image_key: "100001",
                image_ext: ".png",
                brand_status: brandStatus,
                brand_sort_order: brandSortOrder,
                tenant_id: TENANTID
            });

            // IF Not Created
            if (!createBrand) return { message: "Couldnt Created The Brand", status: false };

            // Loop For Assign Other Values to Brand Categories
            categories.forEach(element => {
                element.tenant_id = createBrand.tenant_id;
                element.brand_uuid = createBrand.brand_uuid;
            });

            // Brand Categories Save Bulk
            const brandCategoriesDataSave = await db.brand_categories.bulkCreate(categories);
            if (!brandCategoriesDataSave) return { message: "Brand Categories Data Save Failed", status: false };


            // Return Formation
            return {
                message: "Successfully Created Brand With Categories!!",
                tenant_id: createBrand.tenant_id,
                status: true
            }


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}