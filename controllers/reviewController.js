const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Review = require('../models/reviewModel');

const factory = require('./handlerFactory');

exports.getAllUserReviews = catchAsync(async (req, res, next) => {
    const review = await Review.findOne({ reviewer: req.user.id });

    if (!review) {
        return next(new AppError('There is no review with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        results: review.length,
        message: 'Your reviews have been found!',
        data: review,
    });
});

exports.getUserReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById({ reviewer: req.user.id } && req.params.id);

    if (!review) {
        return next(new AppError('There is no review with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your review has been found!',
        data: review,
    });
});

exports.createUserReview = catchAsync(async (req, res, next) => {
    const review = await Review.create({
        reviewer: req.user.id,
        product: req.params.productId,
        comment: req.body.comment,
        rating: req.body.rating,
    });

    if (!review) return next(new AppError('Your review could not be issued! Please try again!', 400));

    res.status(201).json({
        status: 'success',
        message: 'Your review has been issued!',
        data: review,
    });
});

exports.updateUserReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate({ reviewer: req.user.id } && req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    // const review = await userReview.findByIdAndUpdate(req.params.id, req.body);

    if (!review) {
        return next(new AppError('There is no review with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your review has been updated!',
        data: review,
    });
});

exports.deleteUserReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete({ reviewer: req.user.id } && req.params.id);

    if (!review) {
        return next(new AppError('There is no review with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your review has been deleted!',
        data: null,
    });
});

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
