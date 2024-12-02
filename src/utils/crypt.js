const CryptoJS = require("crypto-js");
const {CustomError} = require("../middleware/ExceptionHandler.middleware");
const encryptToken = (token) => {
  try {
    return CryptoJS.AES.encrypt(token, process.env.TOKEN_SECRET).toString();
  } catch (error) {
    throw (new CustomError(500, error.message, {layer: 'UTILS', methodName: 'encryptToken'}));
  }
}

const decryptToken = (encryptedToken) => {
  try{
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.TOKEN_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw (new CustomError(500, error.message, { layer: 'UTILS', methodName: 'decryptToken' }));
  }
}

module.exports = {
  encryptToken,
  decryptToken
};
