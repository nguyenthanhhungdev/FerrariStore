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
const passport = require('passport')

// Use cookieParser with the same secret as JWT
app.use(cookieParser(process.env.JWT_SECRET))

// Init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());

// Configure CORS for both development and production
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));

require('./configs/config.app')

// Init Db
require('./dbs/init.mongodb.js')

// Init passport before routes
require('./configs/passport.config')(app)
app.use(passport.initialize())

// Init routes
/**
 * Hàm xử lí yêu cầu người dùng và gửi lại phản hồi khi người dùng yêu cầu truy cập
 * tài nguyên máy chủ
 * app.get('/', (req, res, next) =>{} tuyến đường chính là / đây cũng là địa chỉ gốc
 * của ứng dụng
 *
 * */
app.use('/', require('./routes/index.js'))

// error handler
// Sử dụng ExceptionHandler Middleware để xử lí lỗi
app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});
/**
 * Sau khi đã import module vào bằng câu lệnh require thì ta thực hiện exports module
 */
module.exports = app
