const CryptoJS = require("crypto-js");
const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, process.env.TOKEN_SECRET).toString();
}

const decryptToken = (encryptedToken) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.TOKEN_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encryptToken,
  decryptToken
};
