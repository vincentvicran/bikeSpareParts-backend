const mongoose = require('mongoose');

const Product = require('./productModel');

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
            // required: true,
        },
    },
    { timestamps: true }
);

orderSchema.pre('save', async function (next) {
    const product = await Product.findById(this.product);

    this.totalPrice = this.quantity * product.price;
});

orderSchema.methods.getTotalPrice = async function (productId, next) {
    const product = await Product.findById(productId);

    this.totalPrice = this.quantity * product.price;
    // console.table([this.quantity, this.totalPrice]);
    return this.totalPrice;
};

//* POPULATE OPTIONS
orderSchema.pre(/^find/, async function (next) {
    this.populate({
        path: 'product',
        select: 'name',
    }).populate({
        path: 'buyer',
        select: 'name',
    });
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
