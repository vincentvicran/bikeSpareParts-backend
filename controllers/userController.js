const User = require('../models/userModel');

const factory = require('./handlerFactory');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('The user data couldnot be obtained!', 401));

    res.status(200).json({
        status: 'success',
        data: user,
    });
});

//! UPDATING USERFIELDS BY LOGGED IN USER
exports.updateMe = catchAsync(async (req, res, next) => {
    //* 1. CREATE ERROR IF USER POSTS PASSWORD DATA
    if (req.body.password) {
        return next(new AppError('This route is not for password update!', 400));
    }

    //* 2. UPDATE USER DOCUMENT
    const filteredBody = filterObj(req.body, 'name', 'email', 'contact', 'address');

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: updatedUser,
    });
});

//! DEACTIVATING THE USER
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(200).json({
        status: 'success',
        data: null,
        message: 'The user is deleted!',
    });
});

exports.getAllUsers = factory.getAll(User);

exports.getOneUser = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
