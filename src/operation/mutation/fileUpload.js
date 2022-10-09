const { singleFileUpload, multipleFileUpload } = require("../../utils/fileUpload");

module.exports = {
    singleUpload: async (_, {file}) => {
        const imageUrl = await singleFileUpload(file, 'product/thumbnail', 'xffsdfsghgdgfsfdg');
        console.log(imageUrl);
        return {
            message: "Single file uploaded successfully!",
            image: imageUrl
        }
    },
    multipleUpload: async (_, { file }) => {
        const imagesUrl = await multipleFileUpload(file, 'test/multiple');
        console.log(imagesUrl);
        return {
            message: "Multiple File uploaded successfully!",
            images: imagesUrl
        }
    },
    deleteSingle: (_, {file}) => {
        deleteFile(file)
        return { message: "File Delete successfully!" }
    },
    deleteMultiple: async (_, {files}) => {
        const deleted = await deleteFiles(files)
        if(deleted) return { message: "Files Delete successfully!" }
        else return { message: "Files Delete failed!" }
    }
}