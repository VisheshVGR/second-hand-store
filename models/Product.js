const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name must be provided'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price must be provided'],
    },
    description: {
      type: String,
      required: [true, 'Product description must be provided'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
