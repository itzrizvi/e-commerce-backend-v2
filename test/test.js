const { po_activity_type } = require("../enums/po_enum");
const { Mail } = require("../src/utils/email");
const path = require('path');

// Import ENUM for PO Activities
// console.log(po_activity_type.CREATE_PO)

// Test Mailer
Mail('sumonskys@gmail.com', "Test Subject", {"data": 1}, '', 100001, [{
    filename: '37-1674769035302.pdf',
    path: path.join(__dirname, '../tmp/37-1674769035302.pdf'),
    contentType: 'application/pdf'
}])