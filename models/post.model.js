const mongoose = require ("mongoose");

const postSchema = new mongoose.Schema({
    base64Data: {
      type: String,
      required: [true, "Upload is required"]
    },
    postHeader: {
      type: String,
      required: [true, "Header is required"]
    },
    postDescription: {
      type: String
    }
});

const Post = mongoose.model("Post", postSchema)

module.exports = Post