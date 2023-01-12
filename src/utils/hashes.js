const CryptoJS = require("crypto-js");
const crypt = (text) => {

    let ciphertext = CryptoJS.AES.encrypt(text, process.env.secretKey).toString();
    let encodeURI = encodeURIComponent(ciphertext);

    return encodeURI
};

const decrypt = (encoded) => {

    let decodeURI = decodeURIComponent(encoded);
    let bytes = CryptoJS.AES.decrypt(decodeURI, process.env.secretKey);
    let decodedValue = bytes.toString(CryptoJS.enc.Utf8);

    return decodedValue
}



// Module Export
module.exports = {
    crypt,
    decrypt
}