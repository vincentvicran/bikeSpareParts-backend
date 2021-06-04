const express = require('express');
const morgan = require('morgan');

const app = express();

//* IMPORTING ENVIRONMENT VARIABLES
require('dotenv/config');

const port = process.env.PORT;

//? MIDDLEWARE
//* HTTP  request logger
app.use(morgan('dev'));

app.use(express.json());

//* SERVER
app.listen(port, () => {
    console.log(`Listening to https://localhost:${port}`);
});
