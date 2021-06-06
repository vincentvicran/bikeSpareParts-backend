const AppError = require('../helpers/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    //* Operational error,
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('---ERROR---🛠🛠🛠---', err);

        //* internal programming error
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!!!',
        });
    }
};

//* TYPE CASTING ERROR HANDLING
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

//* DUPLICATE FIELD ERROR HANDLING
const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

//* VALIDATION ERROR HANDLING
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data! \n ${errors.join('.')} \n Please use valid data!`;

    return new AppError(message, 400);
};

//* TOKEN ERROR HANDLING
const handleJWTError = () => new AppError('Invalid token. Please login again!');

const handleJWTExpiredError = () => new AppError('Your login token has expired. Plese login again!');

//? MAIN FUNCTION CALL
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    //! FOR DEVELOPMENT
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }

    //! FOR PRODUCTION
    else if (process.env.NODE_ENV === 'production') {
        let error = err;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

        sendErrorProd(error, res);
    }
};
