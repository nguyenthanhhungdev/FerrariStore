// import logger from '../logger'; // Import logger module
const logger = require('../utils/logger');
const {models} = require("mongoose");
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const customErrorMiddleware = (err, req, res, next) => {
    logger.error(err.stack); // Ghi nhật ký lỗi

    if (err instanceof CustomError) {
        // Xử lý lỗi tự định nghĩa
        res.status(err.statusCode).json({ message: err.message });
    } else {
        // Xử lý lỗi không xác định
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { CustomError, customErrorMiddleware };