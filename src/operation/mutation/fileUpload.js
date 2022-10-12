const { singleFileUpload, multipleFileUpload, deleteFile, deleteFiles } = require("../../utils/fileUpload");
const config = require('config');

module.exports = {
    singleUpload: async (_, { file }) => {
        const brand_image_src = config.get("AWS.BRAND_IMG_SRC").split("/")
        const brand_image_bucketName = brand_image_src[0]
        const brand_image_folder = brand_image_src.slice(1)
        const brand_img_idf = config.get('AWS.BRND_IMG_IDF')
        const imageUrl = await singleFileUpload({ file, idf: brand_img_idf, folder: brand_image_folder, fileName: brand_img_idf, bucketName: brand_image_bucketName });
        console.log(imageUrl);
        return {
            file: imageUrl,
            message: "Single file uploaded successfully!"
        }
    },
    multipleUpload: async (_, { file }) => {
        const brand_image_src = config.get("AWS.BRAND_IMG_SRC").split("/")
        const brand_image_bucketName = brand_image_src[0]
        const brand_image_folder = brand_image_src.slice(1)
        const brand_img_idf = config.get('AWS.BRND_IMG_IDF')

        const imagesUrl = await multipleFileUpload({ file, idf: brand_img_idf, folder: brand_image_folder, fileName: brand_img_idf, bucketName: brand_image_bucketName });
        console.log(imagesUrl);
        return {
            message: "Multiple File uploaded successfully!"
        }
    },
    deleteSingle: (_, { name }) => {
        const brand_image_src = config.get("AWS.BRAND_IMG_DEST").split("/")
        const brand_image_bucketName = brand_image_src[0]
        const brand_image_folder = brand_image_src.slice(1)
        const brand_img_idf = config.get('AWS.BRND_IMG_IDF')
        deleteFile({ idf: brand_img_idf, folder: brand_image_folder, fileName: name, bucketName: brand_image_bucketName })
        return { message: "File Delete successfully!" }
    },
    deleteMultiple: (_, { names }) => {
        const brand_image_src = config.get("AWS.BRAND_IMG_DEST").split("/")
        const brand_image_bucketName = brand_image_src[0]
        const brand_image_folder = brand_image_src.slice(1)
        const brand_img_idf = config.get('AWS.BRND_IMG_IDF')

        deleteFiles({ idf: brand_img_idf, folder: brand_image_folder, filesName: names, bucketName: brand_image_bucketName })
        return { message: "Files Delete successfully!" }
    }
}