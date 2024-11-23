/**
 * Sử dụng require để import module express
 * Sau đó tạo một thể hiện của express bằng cách gọi hàm express().
 */
'use strict'
const express = require('express');
const { handleError } = require('./middleware/ExceptionHandler.middleware');
const app = express();
module.exports = app;
const cookieParser = require('cookie-parser')
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cors = require('cors');

// Use cookieParser
app.use(cookieParser())

// Init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());

// Configure CORS for both development and production
app.use(cors({
    // origin: '*', // Cho phép tất cả các nguồn gốc
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));

require('./configs/config.app')

// Init Db
require('./dbs/init.mongodb.js')
// Init routes
/**
 * Hàm xử lí yêu cầu người dùng và gửi lại phản hồi khi người dùng yêu cầu truy cập
 * tài nguyên máy chủ
 * app.get('/', (req, res, next) =>{} tuyến đường chính là / đây cũng là địa chỉ gốc
 * của ứng dụng
 *
 * */
app.use('/', require('./routes/index.js'))

// Init passport
const passport = require('passport')
require('./configs/passport.config')(app) // cấu hình passport và truyền vào app như 1 tham số
app.use(passport.initialize())

// error handler
// Sử dụng ExceptionHandler Middleware để xử lí lỗi
app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});
/**
 * Sau khi đã import module vào bằng câu lệnh require thì ta thực hiện exports module
 */
module.exports = app
