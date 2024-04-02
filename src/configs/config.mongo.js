require('dotenv').config()
const config = {
    app:{
        port: process.env.PORT || 3000
    },
    db:{

        url: process.env.DATA_URL
    }
}
module.exports = config;