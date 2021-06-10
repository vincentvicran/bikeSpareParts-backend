const User = require('../models/userModel');

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('The user data couldnot be obtained!', 401));

    res.status(200).json({
        status: 'success',
        data: user,
    });
});
