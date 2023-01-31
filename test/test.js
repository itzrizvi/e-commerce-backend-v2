const { po_activity_type } = require("../enums/po_enum");
const { Mail } = require("../src/utils/email");
const path = require('path');
const { singleFileUploadFromPath } = require("../src/utils/fileUpload");

// Import ENUM for PO Activities
// console.log(po_activity_type.CREATE_PO)

// Test Mailer
// Mail('sumonskys@gmail.com', "Test Subject", {"data": 1}, 'allias', 100001, [{
//     filename: '37-1674769035302.pdf',
//     path: path.join(__dirname, '../tmp/37-1674769035302.pdf'),
//     contentType: 'application/pdf'
// }])

/* ------------------------------- File Upload ------------------------------ */
const upload = singleFileUploadFromPath({
    file: path.join(__dirname, '../tmp/PO-36-1675105906252.pdf'),
    folder: "test",
    idf: 12,
    fileName: "PO-36-1675105906252",
    bucketName: "psp-admin-doc",
    delete_file: false
})

console.log(upload);