const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Wishlist Schema
const WishlistSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}
,
    {
      timestamps: true,
      collection: 'Wishlist'
    }
);

module.exports = Mongoose.model('Wishlist', WishlistSchema);
