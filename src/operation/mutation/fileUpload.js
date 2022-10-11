const { singleFileUpload, multipleFileUpload, deleteFile, deleteFiles } = require("../../utils/fileUpload");

module.exports = {
    singleUpload: async (_, {file}) => {
        const imageUrl = await singleFileUpload(file, 'product/thumbnail', '1000');
        return {
            message: "Single file uploaded successfully!",
            image: imageUrl
        }
    },
    multipleUpload: async (_, { file }) => {
        const imagesUrl = await multipleFileUpload(file, '', '1000');
        return {
            message: "Multiple File uploaded successfully!",
            images: imagesUrl
        }
    },
    deleteSingle: (_, {folder, key, ext}) => {
        deleteFile(folder, key, ext)
        return { message: "File Delete successfully!" }
    },
    deleteMultiple: (_, {keyExt}) => {
        deleteFiles(keyExt)
        return { message: "Files Delete successfully!" }
    }
}