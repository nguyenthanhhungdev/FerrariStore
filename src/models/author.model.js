'use strict'
const { Schema, model } = require('mongoose')
const Collection_Name = 'Author'
const authorSchema = new Schema({
    name: { type: String, required: true, trim: true },
},
    {
        timestamps: true,
        collection: Collection_Name
    });

module.exports = model(Collection_Name, authorSchema);







