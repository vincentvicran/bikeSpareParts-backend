const User = require('../models/userModel');

exports.register = async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        address: req.body.address,
        contact: req.body.contact,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // userPasswordChangedAt: req.body.userPasswordChangedAt,
        role: req.body.role,
    });
    res.status(201).json({
        status: 'success',
        data: user,
    });
};
