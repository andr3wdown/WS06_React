const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    author: {
      type: String,
      required: true,
      trim: true
    }
  },
  {

    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);