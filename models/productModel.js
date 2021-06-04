const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            max: 100,
        },

        image: [
            {
                type: String,
            },
        ],

        category: {
            type: String,
        },

        price: {
            type: Number,
            required: true,
        },

        brand: String,

        vehicle: {
            type: String,
            required: true,
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
            default: false,
        },
    },
    { timestapms: true }
);

const Product = mongoose.Schema('Product', productSchema);
module.exports = Product;
