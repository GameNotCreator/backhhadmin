const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    tableId: Number,
    items: [
        {
            id: String,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalAmount: Number,
    firstName: String,
    lastName: String,
    status: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;