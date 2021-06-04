const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        comment: {
            type: String,
            default: '',
        },

        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 5,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.Schema('Review', reviewSchema);
module.exports = Review;
