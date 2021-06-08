const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

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
