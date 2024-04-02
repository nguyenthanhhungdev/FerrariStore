'use strict'
const express = require('express');
const router = express.Router();

// router.get('/', (req, res) => {
//     return res.status(200).send({
//         message: 'Hello Nguyen Thanh Hung'
//     });
// })

/**
 * Sử dụng use để gọi tới roter trong access từ đó gọi tới api của router đó
 * Sau đó ta sẽ sử dụng các api của router đó ở đây bằng cách gọi tới đường dẫn /v1/api/...
 *
 * */
router.use('/v1/api', require('./access')) // Middleware

module.exports = router;