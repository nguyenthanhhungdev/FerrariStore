'use strict'

if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: 'product.env' });
} else {
    require('dotenv').config({ path: 'developer.env' });
}



const config  = {
    server:{
        port: process.env.PORT
    },
    db:{
        url: process.env.DB_URL
    }
};
module.exports = config;