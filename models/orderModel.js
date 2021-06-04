const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            default: 1,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        deliveryAddress: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Shipping', 'Shipped'],
            default: 'Pending',
        },

        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.Schema('Order', orderSchema);
module.exports = Order;
