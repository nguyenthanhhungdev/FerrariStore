const { Schema, model } = require('mongoose');

const Collection_Name = 'Book';
const bookSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  id: { type: Number, required: true },
  cover_image: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  description: { type: String, required: true, trim: true },
  file_path: { type: String, trim: true },
  language: { type: String, trim: true },
  type: {
    name: { type: String, trim: true}
  },
  category: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true }
    }
  ],
  authors: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true }
    }
  ],
  volumes: [
    {
      nth: { type: Number, required: true },
      cover_image: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      pages: [
        {
          page: { type: Number, required: true },
          filename: { type: String, required: true, trim: true }
        }
      ]
    }
  ],
  altTitle: { type: String, trim: true }
}, {
  timestamps: true,
  collection: Collection_Name
});

module.exports = model(Collection_Name, bookSchema);