const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const MenuItemSchema = new Schema({
  name: String,
  price: String,
  ingredient: String,
  description: String,
  image: String,
  section: String,
});


module.exports = mongoose.model('Menu', MenuItemSchema);
