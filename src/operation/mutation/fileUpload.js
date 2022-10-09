const { singleFileUpload, multipleFileUpload } = require("../../utils/fileUpload");

module.exports = {
    singleUpload: async (_, {file}) => {
        const imageUrl = await singleFileUpload(file, 'test/single');
        console.log(imageUrl);
        return {
            message: "Single file uploaded successfully!",
            image: imageUrl
        }
    },
    multipleUpload: async (_, {file}) => {
        const imagesUrl = await multipleFileUpload(file, 'test/multiple');
        console.log(imagesUrl);
        return {
            message: "Multiple File uploaded successfully!",
            images: imagesUrl
        }
    }
}