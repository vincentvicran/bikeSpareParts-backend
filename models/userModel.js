const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name!'],
        },

        email: {
            type: String,
            required: [true, 'Please enter your email!'],
        },

        dob: {
            type: Date,
            required: true,
        },

        address: {
            type: String,
            default: '',
            required: true,
        },

        contact: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: [true, 'Please enter your password!'],
        },

        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password!'],
            validate: {
                //this is only executed for create and save
            },
        },

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

const User = mongoose.Schema('User', userSchema);
module.exports = User;
