const logger = require('../utils/logger');
const { CustomError } = require('./ExceptionHandler.middleware');
// Tạo validation middleware, nhận vào schema, lấy data từ request
const validateMiddleware = (schema) => async (req, res, next) => {
    try {
        // Validate request data against the passed schema
        const data = req.body || req.params;
        const { error } = schema.validate(data);
        if (error) {
            next(new CustomError(400, error.message, { layer: 'MIDDLEWARE', className: 'validateMiddleware' }));
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validateMiddleware;