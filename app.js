const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const AppError = require('./helpers/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//* IMPORTING ENVIRONMENT VARIABLES
require('dotenv/config');

const port = process.env.PORT;

//? MIDDLEWARE
//* HTTP  request logger
app.use(morgan('dev'));

app.use(express.json());

//? ROUTES HANDLING
const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const adminRoutes = require('./routes/adminRoutes');

app.use(`/users`, userRoutes);
// app.use(`/products`, productRoutes);
// app.use(`/orders`, orderRoutes);
// app.use(`/reviews`, reviewRoutes);
// app.use(`/admin`, adminRoutes);

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
