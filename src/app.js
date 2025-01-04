/**
 * Sử dụng require để import module express
 * Sau đó tạo một thể hiện của express bằng cách gọi hàm express().
 */
/* jshint esversion: 6 */
'use strict';
const express = require('express');
const { handleError } = require('./middleware/ExceptionHandler.middleware');
const app = express();
module.exports = app;
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cors = require('cors');
const passport = require('passport');
const csrf = require('csurf');

// Use cookieParser with the same secret as JWT
app.use(cookieParser(process.env.JWT_SECRET));
// Initialize CSRF protection middleware
const csrfProtection = csrf({cookie: true, });

// Apply CSRF middleware to protect routes
app.use(csrfProtection);

// CSRF Token Middleware to send a token to the frontend
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {httpOnly: true, secure: true, sameSite: 'Strict', });
    next();
});

// Middleware xử lý lỗi CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'Invalid CSRF token', });
    } else {
        next(err);
    }
});

app.use(morgan('dev'));
app.use(helmet());
app.use(helmet.xssFilter());
app.use(compression());
app.use(express.json());


// Configure Content-Security-Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'", ],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.example.com", ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.example.com", ],
          imgSrc: ["'self'", "data:", "https://images.example.com", ],
          connectSrc: ["'self'", "https://api.example.com", ],
          fontSrc: ["'self'", "https://fonts.example.com", ],
          objectSrc: ["'none'", ],
          upgradeInsecureRequests: [],
      },
  })
);

// Configure CORS for both development and production
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', ], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent and received
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', ], // Define allowed headers
};

// Use the CORS middleware in Express
app.use(cors(corsOptions));

require('./configs/config.app');

// Init Db
require('./dbs/init.mongodb.js');

// Init passport before routes
require('./configs/passport.config')(app);
app.use(passport.initialize());

// Init routes
/**
 * Hàm xử lí yêu cầu người dùng và gửi lại phản hồi khi người dùng yêu cầu truy cập
 * tài nguyên máy chủ
 * app.get('/', (req, res, next) =>{} tuyến đường chính là / đây cũng là địa chỉ gốc
 * của ứng dụng
 *
 * */
app.use('/', require('./routes/index.js'));

// error handler
// Sử dụng ExceptionHandler Middleware để xử lí lỗi

/**
 *
 *
 *
 * Các tham số trong đoạn mã bạn đã chọn (err, req, res, next) là các tham số của middleware trong Express.js. Dưới đây là giải thích chi tiết về từng tham số:
 * err: Đây là đối tượng lỗi (Error object) được truyền vào middleware khi có lỗi xảy ra trong quá trình xử lý yêu cầu. Nó có thể chứa thông tin về lỗi như thông điệp lỗi (message), mã trạng thái (statusCode), và các thông tin bổ sung khác (metadata).
 * req: Đây là đối tượng yêu cầu (Request object) đại diện cho yêu cầu HTTP được gửi từ client đến server. Nó chứa thông tin về yêu cầu như URL, phương thức HTTP, headers, và dữ liệu gửi kèm.
 * res: Đây là đối tượng phản hồi (Response object) được sử dụng để gửi phản hồi HTTP từ server về client. Nó cung cấp các phương thức để thiết lập mã trạng thái, headers, và gửi dữ liệu phản hồi.
 * next: Đây là hàm callback được sử dụng để chuyển quyền điều khiển đến middleware tiếp theo trong chuỗi middleware. Nếu không có lỗi, bạn có thể gọi next() để tiếp tục xử lý yêu cầu. Nếu có lỗi, bạn có thể gọi next(err) để chuyển lỗi đến middleware xử lý lỗi.
 * Các tham số này được Express.js tự động truyền vào middleware khi có yêu cầu HTTP đến server.
 *
 *
 * */

app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});
/**
 * Sau khi đã import module vào bằng câu lệnh require thì ta thực hiện exports module
 */
module.exports = app;
