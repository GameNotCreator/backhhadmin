const express = require('express');
const router = express.Router();
const multer = require('multer');
const Posts = require('../models/Posts');
const { ObjectId } = require('mongoose').Types;
const cookieParser = require('cookie-parser');
router.use(cookieParser());

module.exports = (db) => {

    const storage = multer.diskStorage({
       destination: (req, file, cb) => {
          cb(null, 'uploads/');
       },
       filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
       }
    });

    const upload = multer({
       storage: storage
    });

    router.post('/add', upload.single('image'), async (req, res) => {
       const { title, description } = req.body;
       const image = req.file ? req.file.filename : '';

       const post = new Posts({ title, description, image });
       await post.save();

       console.log('Post ajouté avec succès:', post); // Ajout du console.log

       res.status(201).json(post);
    });

    router.get('/', async (req, res) => {
       const posts = await Posts.find({});
       res.json(posts);
    });

    router.delete('/:itemId', async (req, res) => {
       const itemId = req.params.itemId;
       await Posts.deleteOne({ _id: new ObjectId(itemId) });

       res.status(200).json({ success: true });
    });

 return router;
};