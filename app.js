const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//* CROSS ORIGIN HANDLING
app.use(cors());
app.options('*', cors());

//* IMPORTING ENVIRONMENT VARIABLES
require('dotenv/config');

const port = process.env.PORT;

//? MIDDLEWARE

//* BODY PARSING INTO JSON
app.use(express.json());

//* set security HTTP headers00
app.use(helmet());

//* HTTP loggers details
//? development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//* limiting request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Request limit reached! Please try again in an hour!',
});
app.use('/', limiter);

//? serving static files
app.use(express.static(`${__dirname}/public`));

//? data sanitization against NoSQL query injection
app.use(mongoSanitize());

//? data sanitization against XSS
app.use(xss());

//? ROUTES HANDLING
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(`/users`, userRoutes);
app.use(`/products`, productRoutes);
app.use(`/orders`, orderRoutes);
app.use(`/reviews`, reviewRoutes);
app.use(`/admin`, adminRoutes);

//! GLOBAL ERROR HANDLING
app.use('*', (res, req, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//* DATABASE CONNECTION
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: 'SpareDB',
    })
    .then(() => {
        console.log('Database connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

//* SERVER
app.listen(port, () => {
    console.log(`Listening to https://localhost:${port}`);
});
