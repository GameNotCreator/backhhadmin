const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const PostsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }
});


module.exports = mongoose.model('Posts', PostsSchema);
