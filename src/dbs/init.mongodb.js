'use strict';
const mongoose = require('mongoose')
const {db: {url}} = require('../configs/config.mongo')
const config = url; // Lấy url từ file config
class Database {
    Contructor() {
        this.connect()
    }

    //Singleton
    static getInstance() {
        if (!this.instance) { // Nếu không có tồn tại một đối tượng tới db thì tạo mới
            this.instance = new Database()
        }
        return this.instance // Nếu đã có thì trả về
    }
    connect(type = 'mongodb') {
        if (1===1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(config).then(e => {
            console.log('Connected to MongoDB Success');
        }).catch(err => console.log("Couldn't connect to MongoDB'"))
    }

}


const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB