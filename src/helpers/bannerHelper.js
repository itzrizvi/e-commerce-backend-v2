// BRAND HELPER REQUIRES
const { default: slugify } = require("slugify");
const { Op } = require('sequelize');
const config = require('config');
const { singleFileUpload, deleteFile } = require("../utils/fileUpload");

// Banner HELPER
module.exports = {
    // Create Banner HELPER
    createBanner: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {
            // Data From Req
            const { banner_name, banner_status, banner_image} = req;
            console.log(banner_name, banner_image);
            // Slugify  with Banner name
            const banner_slug = slugify(banner_name, {
                replacement: '-',
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true,
                trim: true
            });

            // Check If Already Exist the Banner
            const checkExistence = await db.banners.findOne({
                where: {
                    [Op.and]: [{
                        banner_slug,
                        tenant_id: TENANTID
                    }]
                }
            });

            // If Found Banner
            if (checkExistence) return { message: "Already Have This Banner!!!", status: false };

            // Create Banner
            // const createBanner = await db.banners.create({
            //     banner_name: banner_name,
            //     banner_slug: banner_slug,
            //     banner_status: banner_status,
            //     tenant_id: TENANTID
            // });

            // IF Not Created
            if (!createBanner) return { message: "Couldnt Created The Banner", status: false };

            banner_image.forEach(element, index => {
                console.log(element);
            });


        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    }
}