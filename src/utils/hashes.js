// const CryptoJS = require("crypto-js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.secretKey, {
  pbkdf2Iterations: 10000,
  saltLength: 10,
});

// const crypt = (text) => {

//     let ciphertext = CryptoJS.AES.encrypt(text, process.env.secretKey).toString();
//     let encodeURI = encodeURIComponent(ciphertext);

//     return encodeURI
// };

// const decrypt = (encoded) => {

//     let decodeURI = decodeURIComponent(encoded);
//     let bytes = CryptoJS.AES.decrypt(decodeURI, process.env.secretKey);
//     let decodedValue = bytes.toString(CryptoJS.enc.Utf8);

//     return decodedValue
// }

const crypt = (text) => {
  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
};

const decrypt = (encoded) => {
  const decryptedString = cryptr.decrypt(encoded);
  return decryptedString;
};

// Module Export
module.exports = {
  crypt,
  decrypt,
};
