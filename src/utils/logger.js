const winston = require('winston')

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// level để định nghĩa mức độ hiển thị log
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// colors để định nghĩa màu sắc của log
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

// format để định nghĩa các hiển thị thông tin của log

const format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({all: true}),
    winston.format.printf( (info) => {
        const meta = info.metadata && Object.keys(info.metadata).length ? `\nMeta: ${JSON.stringify(info.metadata, null, 2)}` : '';
        return `${info.timestamp}-${info.level}: ${info.message} ${meta}`;
    }),
);

// transports để định nghĩa nơi lưu trữ log

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({
        filename: 'logs/all.log',
        level: 'info',
    }),
]

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

module.exports = Logger