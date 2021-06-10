const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');
const sendEmail = require('../helpers/email');

//* GENERATE THE SIGNED TOKEN
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });

//* SEND THE SIGNED TOKEN IN THE HEADER
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //! COOKIE HANDLING
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    //! MAKING BROWSING SECURE
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    //* MAKING THE PASSWORD
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        address: req.body.address,
        contact: req.body.contact,
        password: req.body.password,
        // passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });

    if (!user) next(new AppError('The user could not be created!', 404));

    createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //* CHECK IF EMAIL AND PASSWORD IS PROVIDED
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //* CHECK IF USER EXISTS AND PASSWORD IS CORRECT
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }

    //* IF EVERYTHING IS OK, SEND TOKEN TO THE CLIENT
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    //? 1. GETTING TOKEN AND CHECK IF IT'S THERE
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to gain access!', 401));
    }

    //? 2. VERIFYING THE TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //? 3. CHECK IF USER STILL EXISTS
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
        return next(new AppError('The user with this token no longer exists!', 401));
    }

    // //? 4. CHECK IF USER MODIFIED THE PASSWORD AFTER THE TOKEN WAS ISSUED
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again!', 401));
    }

    //* FINALLY GRANT ACCESS TO THE PROTECTED USER
    req.user = freshUser;
    next();
});

exports.allowedTo =
    (...roles) =>
    (req, res, next) => {
        //* ROLES ['ADMIN', 'USER']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You are not allowed!', 403));
        }
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //? 1. FIND THE USER BASED ON THE ENTERED (POSTED) EMAIL
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return next(new AppError('There is no user with the given email address!', 404));
    }

    //? 2. GENERATE THE RANDOM RESET TOKEN
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const message = `Forgot your password? Submit this token with your new password to: \n${resetToken}\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)!',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to your Email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email! Please try again later!', 500));
    }
});
