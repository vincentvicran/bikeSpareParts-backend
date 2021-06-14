const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please insert the name of the product!'],
        },

        description: {
            type: String,
            max: 100,
        },

        images: [
            {
                type: String,
            },
        ],

        category: {
            type: String,
            required: [true, 'Please insert the category of the product!'],
        },

        price: {
            type: Number,
            required: [true, 'Please insert the price of the product!'],
        },

        brand: String,

        vehicle: {
            type: String,
        },

        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },

        color: String,

        numReviews: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },

        isAvailable: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestapms: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
