const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Post = require('../models/post.model.js') ;


const router = Router();

router.post("/upload", async (req, res) => {
  const{ base64Data } = req.body
    try{
        const newImage = await Post.create({ base64Data });
        newImage.save();
        res.status(201).json({ msg : "New image uploaded...!"})
    }catch(error){
        res.status(409).json({ message : error.message })
    }
})

  module.exports = router