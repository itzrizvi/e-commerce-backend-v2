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
            const { banner_name, banner_status} = req;
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
            const createBanner = await db.banners.create({
                banner_name: banner_name,
                banner_slug: banner_slug,
                banner_status: banner_status,
                tenant_id: TENANTID
            });

            if (createBanner) {
                // Return Formation
                return {
                    message: "Successfully Created Banner!",
                    data: {
                        banner_uuid: createBanner.banner_uuid,
                        banner_name: createBanner.banner_name,
                        banner_slug: createBanner.banner_slug,
                        banner_status: createBanner.banner_status,
                        tenant_id: createBanner.tenant_id,
                    },
                    status: true
                }

            } else {
                // Return Formation
                return {
                    message: "Banner Update Failed!!",
                    status: false
                }
            }

        } catch (error) {
            if (error) return { message: "Something Went Wrong!!!", status: false }
        }
    },
    createBannerImage: async (req, db, user, isAuth, TENANTID) => {
        const {banner_id, title, link, sort_order, image} = req
        // If Image is Available
        let imageName;
        if (image) {
            // Upload Image to AWS S3
            const banner_image_src = config.get("AWS.BANNER_IMG_SRC").split("/")
            const banner_image_bucketName = banner_image_src[0]
            const banner_image_folder = banner_image_src.slice(1)
            const imageUrl = await singleFileUpload({ file: image, idf: banner_id, folder: banner_image_folder, bucketName: banner_image_bucketName });
            if (!imageUrl) return { message: "Image Couldnt Uploaded Properly!!!", status: false };
            // Update Brand with Image Name
            imageName = imageUrl.Key.split('/').slice(-1)[0];
        }

        // Create Banner Image
        const createBannerImage = await db.banner_images.create({
            banner_uuid: banner_id,
            title,
            link,
            image: imageName,
            sort_order,
            tenant_id: TENANTID
        });

        if (createBannerImage) {
            // Return Formation
            return {
                message: "Successfully Created Brand Image!",
                data: {
                    banner_uuid:createBannerImage.banner_uuid,
                    banner_id:createBannerImage.id,
                    title:createBannerImage.title,
                    link:createBannerImage.link,
                    sort_order:createBannerImage.sort_order,
                },
                status: true
            }

        } else {
            // Return Formation
            return {
                message: "Banner Image Failed!!",
                status: false
            }
        }
    }
}