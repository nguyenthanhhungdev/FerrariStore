'use strict'
// import mongoose from "mongoose";
const mongoose = require('mongoose')
const {db: {host, port, db_name}} = require('../configs/config.app')
const url = `mongodb://${host}:${port}/${db_name}`
console.log("DB_URL::" + url)

// Sử dụng singleton pattern để tránh tạo ra nhiều kết nối
class Database {
    constructor() {
        this.connect();
    }

    static getInstance() {
        if (!this.instance) { // Nếu không có tồn tại một đối tượng tới db thì tạo mới
            this.instance = new Database()
        }
        return this.instance // Nếu đã có thì trả về
    }
    connect() {
        if (1===1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(url)
            .then(() => console.log('Kết nối Mongo DB thành công'))
            .catch(err => console.log("Kết nối Mongo DB không thanh công", err.message))
    }
}
const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB