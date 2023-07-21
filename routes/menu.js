const express = require('express');
const router = express.Router();
const multer = require('multer');
const MenuItem = require('../models/MenuItem');
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
      console.log('Received request to add a new menu item:');
      console.log('Request body:', req.body);

      const image = req.file ? req.file.filename : '';

      const product = new MenuItem({
          name: req.body.name,
          price: req.body.price,
          ingredient: req.body.ingredient,
          description: req.body.description,
          image: image,
          section: req.body.section,
      });

      try {
          const savedProduct = await product.save();
          console.log('Product saved to the database:', savedProduct);
          res.json(savedProduct);
      } catch (err) {
          console.error('Error saving product to the database:', err);
          res.status(500).json({ message: 'An error occurred. Please try again.' });
      }
  });


    router.get('/', async (req, res) => {
       const galeries = await Galeries.find({});
       res.json(galeries);
    });

    router.delete('/:itemId', async (req, res) => {
       const itemId = req.params.itemId;
       await Galeries.deleteOne({ _id: new ObjectId(itemId) });

       res.status(200).json({ success: true });
    });

 return router;
};