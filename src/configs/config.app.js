'use strict'
const looger = require('../utils/logger')
looger.info("ENV: ", process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: 'product.env' });
} else {
    require('dotenv').config({ path: 'developer.env' });
}

const config  = {
    server:{
        port: process.env.PORT || 3000
    },
    db:{
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 27017,
        db_name: process.env.DB_NAME || "FerrariStore"
    }
};
module.exports = config;