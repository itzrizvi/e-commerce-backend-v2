// All Requires
const { Op } = require("sequelize");
const { multipleFileUpload } = require("../utils/fileUpload");
const config = require('config');


// Contact Us HELPER
module.exports = {
    // Create Contact Us MSG API
    createContactUs: async (req, db, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { name, email, phone, subject, message, images } = req;

            // Add Contact Message TO DB
            const insertMessage = await db.contact_us.create({
                name,
                email,
                phone,
                subject,
                message,
                tenant_id: TENANTID
            });

            // If Images are Available
            if (images) {
                // 
                let contactusImages = [];
                // Upload Image to AWS S3
                const contactus_image_src = config.get("AWS.CONTACTUS_IMG_SRC").split("/")
                const contactus_image_bucketName = contactus_image_src[0];
                const contactus_image_folder = contactus_image_src.slice(1).join("/");
                const imageUrl = await multipleFileUpload({ file: images, idf: insertMessage.id, folder: contactus_image_folder, fileName: insertMessage.id, bucketName: contactus_image_bucketName });
                if (!imageUrl) return { message: "Contact Us Images Couldnt Uploaded Properly!!!", status: false };

                // 
                imageUrl.forEach(async (contactUsImg) => {
                    await contactusImages.push({ image: contactUsImg.upload.Key.split('/').slice(-1)[0], contactus_id: insertMessage.id, tenant_id: TENANTID });
                });

                // 
                if (contactusImages) {
                    // 
                    const contactusImgesSave = await db.contactus_media.bulkCreate(contactusImages);
                    if (!contactusImgesSave) return { message: "Contact Us Images Save Failed!!!", status: false }
                }
            }

            // Return Formation
            if (insertMessage) {
                return {
                    message: "Message Sent Successfully, We Will Contact You Shortly.",
                    status: true,
                    tenant_id: TENANTID
                }
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET SINGLE CONTACT US MESSAGE
    getSingleContactUsMsg: async (req, db, user, isAuth, TENANTID) => {
        // Try Catch Block
        try {

            // DATA FROM REQUEST
            const { id } = req;


            // 
            if (!db.contact_us.hasAlias('contactus_media') && !db.contact_us.hasAlias('images')) {

                await db.contact_us.hasMany(db.contactus_media, {
                    foreignKey: 'contactus_id',
                    as: 'images'
                });
            }

            // 
            const getsinglecontactus = await db.contact_us.findOne({
                include: [
                    {
                        model: db.contactus_media, as: 'images', //
                    }
                ],
                where: {
                    [Op.and]: [{
                        id,
                        tenant_id: TENANTID
                    }]
                }
            });


            return {
                message: "GET Single Contact Us Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getsinglecontactus
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    },
    // GET CONTACT US LIST
    getContactUsMsgList: async (db, TENANTID) => {
        // Try Catch Block
        try {

            // 
            if (!db.contact_us.hasAlias('contactus_media') && !db.contact_us.hasAlias('images')) {

                await db.contact_us.hasMany(db.contactus_media, {
                    foreignKey: 'contactus_id',
                    as: 'images'
                });
            }

            // 
            const getcontactuslist = await db.contact_us.findAll({
                include: [
                    {
                        model: db.contactus_media, as: 'images', //
                    }
                ],
                where: {
                    tenant_id: TENANTID
                }
            });


            return {
                message: "GET Contact Us List Success!!!",
                tenant_id: TENANTID,
                status: true,
                data: getcontactuslist
            }


        } catch (error) {
            if (error) return { message: `Something Went Wrong!!! Error: ${error}`, status: false }
        }
    }
}