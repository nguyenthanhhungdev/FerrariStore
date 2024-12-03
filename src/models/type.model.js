const {Schema, model} = require('mongoose');
const Collection_Name = 'Type';
const typeSchema = new Schema({
    name: {type: String, required: true, trim: true},
  },
  {
    timestamps: true,
    collection: Collection_Name
  });

module.exports = model(Collection_Name, typeSchema);