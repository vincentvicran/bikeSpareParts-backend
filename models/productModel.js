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

        // reviews: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Review',
        //     },
        // ],

        color: String,

        isAvailable: {
            type: Boolean,
            default: true,
            required: true,
        },
    },
    { timestapms: true }
);

//* VIRTUALLY POPULATING REVIEWS
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
