const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

        passwordResetToken: String,

        passwordResetExpiry: Date,

        passwordChangedAt: Date,

        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true,
            required: true,
            select: false,
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

//* AFTER CHANGING THE PASSWORD
userSchema.pre('save', async function (next) {
    //* THIS FUNCTION RUNS IF PASSWORD IS NOT MODIFIED, OR FOR NEW DOCUMENT
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

//* CHECKING IF THE PASSWORD WAS MODIFIED AFTER USER LOG IN IN THE SAME SESSION
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < changedTimestamp;
    }

    //? FALSE MEANS, NOT MODIFIED
    return false;
};

//* CHECKING CURRENT USER PASSWORD WITH THE PASSWORD ENTERED
userSchema.methods.correctPassword = async function (candidatePassword, password) {
    return await bcrypt.compareSync(candidatePassword, password);
};

//* CREATING THE PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

//* CHECKING EITHER THE LOGGED IN PASSWORD IS CORRECT OR NOT
userSchema.methods.correctPassword = async function (candidatePassword, password) {
    return await bcrypt.compareSync(candidatePassword, password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
