const express = require('express');
const bodyparser = require('body-parser');

const app = express();

//* IMPORTING ENVIRONMENT VARIABLES
require('dotenv/config');

port = process.env.PORT;

//? MIDDLEWARE
app.use(bodyparser.json());

//* SERVER
app.listen(port, () => {
    console.log(`Listening to https://localhost:${port}`);
});
