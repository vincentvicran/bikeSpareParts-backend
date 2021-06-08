const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name!'],
        },

        email: {
            type: String,
            required: [true, 'Please enter your email!'],
            unique: [true, 'Email already taken!'],
            lowercase: true,
            validate: [validator.isEmail, 'Please enter a valid email!'],
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
            minlength: [6, 'Password must contain at least 6 letters!'],
            select: false,
        },

        // passwordConfirm: {
        //     type: String,
        //     required: [true, 'Please confirm your password!'],
        //     validate: {
        //         //? this is only executed for create and save
        //         validator: function (el) {
        //             return el === this.password;
        //         },
        //     },
        // },

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

//* ENCRYPTING THE USER GIVEN PASSWORD
userSchema.pre('save', async function (next) {
    //? CHECKING IF PASSWORD IS ACTUALLY MODIFIED
    if (!this.isModified('password')) return next();

    //* HASHIND THE PASSWORD WITH THE COST OF 12
    this.password = await bcrypt.hashSync(this.password, 12);

    next();
});

//* CHECKING EITHER THE LOGGED IN PASSWORD IS CORRECT OR NOT
userSchema.methods.correctPassword = async function (candidatePassword, password) {
    return await bcrypt.compareSync(candidatePassword, password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
