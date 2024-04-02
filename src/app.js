/**
 * Sử dụng require để import module express
 * Sau đó tạo một thể hiện của express bằng cách gọi hàm express().
 */
'use strict'
const express = require('express')
const app = express()
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
require('dotenv').config
// Init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Init Db
require('./dbs/init.mongodb.js')
// Init routers
/**
 * Hàm xử lí yêu cầu người dùng và gửi lại phản hồi khi người dùng yêu cầu truy cập
 * tài nguyên máy chủ
 * app.get('/', (req, res, next) =>{} tuyến đường chính là / đây cũng là địa chỉ gốc
 * của ứng dụng
 *
 * */
app.use('/', require('./routers/index.js'))

// error handler

/**
 * Sau khi đã import module vào bằng câu lệnh require thì ta thực hiện exports module
 */
module.exports = app
