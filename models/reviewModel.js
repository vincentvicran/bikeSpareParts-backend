const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user!'],
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to a product!'],
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

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'product',
        select: 'name',
    }).populate({
        path: 'reviewer',
        select: 'name',
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
